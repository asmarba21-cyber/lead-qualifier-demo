import type { Lead } from "./types.js";

/**
 * Synthetic CRM leads. None of this is real data — fictional people,
 * companies, and domains written for this demo only.
 */
export const SYNTHETIC_LEADS: Lead[] = [
  { id: "l1", contactName: "Dana Whitfield", email: "d.whitfield@northfield.edu", company: "Northfield College", domain: "northfield.edu", leadStatus: "Marketing Qualified Lead", daysSinceLastActivity: 3 },
  { id: "l2", contactName: "Rian Castillo", email: "rian@brightforge.io", company: "Brightforge", domain: "brightforge.io", leadStatus: "New", daysSinceLastActivity: 1 },
  { id: "l3", contactName: "Yuki Tanaka", email: "y.tanaka@meridianinstitute.ac.jp", company: "Meridian Institute of Technology", domain: "meridianinstitute.ac.jp", leadStatus: "New", daysSinceLastActivity: 8 },
  { id: "l4", contactName: "Priya Chandra", email: "priya.chandra@gmail.com", company: "(personal email, no company given)", domain: "gmail.com", leadStatus: "New", daysSinceLastActivity: 2 },
  { id: "l5", contactName: "Marcus Oduya", email: "marcus@oduya-consulting.com", company: "Oduya Consulting", domain: "oduya-consulting.com", leadStatus: "Unqualified", daysSinceLastActivity: 45 },
  { id: "l6", contactName: "Elin Hagstrom", email: "e.hagstrom@polarhigh.se", company: "Polar Technical High School", domain: "polarhigh.se", leadStatus: "Marketing Qualified Lead", daysSinceLastActivity: 60 },
  { id: "l7", contactName: "Oscar Belmonte", email: "oscar@vantapoint.com", company: "Vantapoint Analytics", domain: "vantapoint.com", leadStatus: null, daysSinceLastActivity: 5 },
  { id: "l8", contactName: "Grace Lindqvist", email: "grace@summitpartners.academy", company: "Summit Partners Academy", domain: "summitpartners.academy", leadStatus: "New", daysSinceLastActivity: 0 },
];
