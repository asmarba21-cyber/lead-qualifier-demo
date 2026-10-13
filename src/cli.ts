import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";
import { SYNTHETIC_LEADS } from "./leads.js";
import { routeLead } from "./route.js";
import type { Route, RoutedLead } from "./types.js";

const bold = (s: string) => `\x1b[1m${s}\x1b[0m`;
const dim = (s: string) => `\x1b[2m${s}\x1b[0m`;
const color = (code: string, s: string) => `\x1b[${code}m${s}\x1b[0m`;

const SECTION_TITLE: Record<Route, string> = {
  priority: "🎯 Priority List (educational institutions)",
  standard: "📋 Standard List",
  excluded: "🗂  Excluded / Needs Review",
};
const SECTION_COLOR: Record<Route, string> = { priority: "32", standard: "36", excluded: "90" };

function printSection(route: Route, rows: RoutedLead[]) {
  if (rows.length === 0) return;
  console.log(`\n${color(SECTION_COLOR[route], bold(SECTION_TITLE[route]))}`);
  for (const r of rows) {
    console.log(`  ${bold(r.lead.company)} ${dim(`(${r.lead.contactName}, ${r.lead.domain})`)}`);
    console.log(`  ${dim("→")} ${r.reason}`);
  }
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("Missing ANTHROPIC_API_KEY — copy .env.example to .env and add your key.");
    process.exit(1);
  }
  const client = new Anthropic();

  console.log(bold("\nLead Qualifier — demo run\n"));
  console.log(dim(`${SYNTHETIC_LEADS.length} synthetic leads, qualifying + routing each...\n`));

  const routed: RoutedLead[] = [];
  for (const lead of SYNTHETIC_LEADS) {
    const result = await routeLead(client, lead);
    routed.push(result);
    console.log(`${dim(lead.company)} ${dim("...")} ${color(SECTION_COLOR[result.route], result.route)}`);
  }

  printSection("priority", routed.filter((r) => r.route === "priority"));
  printSection("standard", routed.filter((r) => r.route === "standard"));
  printSection("excluded", routed.filter((r) => r.route === "excluded"));
  console.log();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
