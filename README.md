# Lead Qualifier

A small lead qualification and routing assistant: takes raw CRM-style leads, applies a qualification
rule, uses [Claude](https://www.anthropic.com/claude) to judge an ambiguous case a keyword match would get
wrong, and routes each lead into a prioritized list — built end-to-end with
[Claude Code](https://claude.com/claude-code).

This is a self-contained demo with entirely synthetic leads (fictional people, companies, domains) — no
real CRM data of any kind. It's a from-scratch exploration of a pattern I've used in production (qualify →
classify an ambiguous entity → route), rebuilt here as a small, public, inspectable project.

## What it does

```
lead ──▶ qualify (rule-based) ──▶ did it qualify? ──▶ classify org type (Claude) ──▶ route
                                        │
                                        └── no ──────────────────────────────────▶ Excluded / Needs Review
```

1. **Qualify** — a plain rule, no AI needed: a lead's status must actually be *set* (not just absent) and
   must not be Unqualified/Disqualified/Customer, and it must be recently active. The "must be set" clause
   is deliberate — a lead nobody has triaged yet is not the same as one that's been approved, and treating
   them the same would silently qualify every untouched record.
2. **Classify the organization** *(only for leads that qualify)* — the genuinely interesting step. A
   keyword match ("contains 'academy' or 'institute'") gets this wrong in both directions: a corporate
   training company can have "Academy" in its name without being a school, and a real institution can use
   a domain that gives no obvious signal either way. Claude is asked to make the actual judgment call, with
   a stated confidence and reasoning — not a boolean from string matching.
3. **Route** — qualified + genuinely the target org type → **Priority List**. Qualified but not → **Standard
   List**. Anything that didn't qualify → **Excluded / Needs Review**, with the specific reason attached (no
   status yet / explicitly disqualified / gone stale) so a human reviewing that list knows exactly why,
   not just that it landed there.

## Running it

```bash
npm install
cp .env.example .env   # add your own ANTHROPIC_API_KEY
npm run demo
```

Includes a deliberately tricky case ("Summit Partners Academy," a corporate training firm, not a school)
to show the classification step actually reasoning rather than keyword-matching.

## Project layout

```
src/
  types.ts          shared types
  leads.ts          synthetic lead data (no real CRM data)
  classify-org.ts    the AI judgment call — is this really the target org type?
  route.ts          qualify (rule) -> classify (AI, if qualified) -> route
  cli.ts            demo runner, prints three routed lists
```

## What this demonstrates

- Knowing when a rule should stay a plain rule (qualification) and when it genuinely needs a model's
  judgment (classifying an ambiguous name) — not reaching for AI everywhere by default
- A qualification rule with a real, deliberate edge case (the "must be set, not just falsy" check) rather
  than the obvious-looking version that would have been wrong
- Built with Claude Code, end to end

## License

MIT — see [LICENSE](./LICENSE).
