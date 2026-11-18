## Skills & Rules

- **Global skills** (`~/.claude/skills/`) — always available every session; pick whichever fits the task.
- **Project-local skills** (`.claude/skills/`, when this repo has any) — check first; these specialize/override the global ones for this repo's own conventions.
- **Global rules** (`~/.claude/rules/`) — behavior/workflow/coding conventions that apply everywhere.
- **Project-local rules** (`rules/`, when this repo has any) — check first; these specialize the global ones for this repo's own domain.

## Agent Memory

Per-project memory lives centrally in `~/Git/Personal/agent-memory-private/agent-memory/nice-crochet/` (never in this repo). Resolve path via `python3 ~/.claude/scripts/lib/memory_root.py .` or search via `python3 ~/.claude/scripts/recall.py "<query>"`.

## Code search

- Use `project_search` first. One call returns text matches and code-graph hits together.
- `rg` plus `Read` is the primary method. Read the file before you edit it.
- If `project_search` reports a stale index, treat its graph hits as hints and confirm them with `rg` and `Read`.
- Code-index output is local. Never commit it.

## Agent skills

### Issue tracker
Issues live in GitHub Issues (Vit129/nice-crochet), via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels
Default five canonical roles (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs
Single-context layout: `CONTEXT.md` + `docs/adr/` at repo root. See `docs/agents/domain.md`.
