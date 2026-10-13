import Anthropic from "@anthropic-ai/sdk";
import type { Lead, RoutedLead } from "./types.js";
import { classifyOrganization } from "./classify-org.js";

const DISQUALIFYING_STATUSES = new Set(["Unqualified", "Disqualified", "Customer"]);
const STALE_AFTER_DAYS = 30;

/**
 * Qualify, then (for anything that qualifies) classify the organization
 * type, then route. The "leadStatus must actually be set" check is
 * load-bearing — without it, every lead with no status yet at all would
 * silently qualify, which is wrong: no status means nobody has looked at it,
 * not that it's been approved.
 */
export async function routeLead(client: Anthropic, lead: Lead): Promise<RoutedLead> {
  if (!lead.leadStatus) {
    return { lead, route: "excluded", reason: "no lead status set yet — nobody has triaged this lead" };
  }
  if (DISQUALIFYING_STATUSES.has(lead.leadStatus)) {
    return { lead, route: "excluded", reason: `status is "${lead.leadStatus}"` };
  }
  if (lead.daysSinceLastActivity > STALE_AFTER_DAYS) {
    return { lead, route: "excluded", reason: `stale — ${lead.daysSinceLastActivity} days since last activity` };
  }

  const orgClassification = await classifyOrganization(client, lead);
  if (orgClassification.isTargetOrgType && orgClassification.confidence !== "low") {
    return { lead, route: "priority", reason: orgClassification.reasoning, orgClassification };
  }
  return { lead, route: "standard", reason: orgClassification.reasoning, orgClassification };
}
