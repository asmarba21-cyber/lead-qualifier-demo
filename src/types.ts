export type LeadStatus = "New" | "Marketing Qualified Lead" | "Unqualified" | "Disqualified" | "Customer";

export interface Lead {
  id: string;
  contactName: string;
  email: string;
  company: string;
  domain: string;
  leadStatus: LeadStatus | null;
  daysSinceLastActivity: number;
}

export interface OrgClassification {
  isTargetOrgType: boolean;
  confidence: "high" | "medium" | "low";
  reasoning: string;
}

export type Route = "priority" | "standard" | "excluded";

export interface RoutedLead {
  lead: Lead;
  route: Route;
  reason: string;
  orgClassification?: OrgClassification;
}
