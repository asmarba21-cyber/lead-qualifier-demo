import Anthropic from "@anthropic-ai/sdk";
import type { Lead, OrgClassification } from "./types.js";

const TOOL: Anthropic.Tool = {
  name: "submit_classification",
  description: "Classify whether this organization is the target type (an educational institution).",
  input_schema: {
    type: "object",
    properties: {
      isTargetOrgType: { type: "boolean" },
      confidence: { type: "string", enum: ["high", "medium", "low"] },
      reasoning: { type: "string", description: "One sentence: what in the name/domain led to this call." },
    },
    required: ["isTargetOrgType", "confidence", "reasoning"],
  },
};

/**
 * Classifies an ambiguous organization name/domain as a genuine educational
 * institution or not — the same "is this actually the kind of org we're
 * looking for" judgment call that a plain keyword match (".edu", "college",
 * "academy") gets wrong often enough to need a real model behind it. A name
 * containing "Academy" or "Institute" is not reliable proof either way (see
 * the "Summit Partners Academy" case in leads.ts, a corporate training firm
 * that isn't a school despite the name).
 */
export async function classifyOrganization(client: Anthropic, lead: Lead): Promise<OrgClassification> {
  const message = await client.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 300,
    tools: [TOOL],
    tool_choice: { type: "tool", name: "submit_classification" },
    messages: [
      {
        role: "user",
        content: `Is this a genuine educational institution (a school, college, or university) rather than a company, consultancy, or training business that merely sounds educational?\n\nCompany: ${lead.company}\nDomain: ${lead.domain}`,
      },
    ],
  });

  const toolUse = message.content.find((b): b is Anthropic.ToolUseBlock => b.type === "tool_use");
  if (!toolUse) throw new Error("model did not classify the organization");
  return toolUse.input as OrgClassification;
}
