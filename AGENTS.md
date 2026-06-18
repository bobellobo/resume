# AGENTS

## Purpose
This file consolidates repository-specific agent guidance for future prompts.

## Core Rules
1. Never modify the inner content of JSON files under `content/json/` unless the user explicitly asks for that exact change.
2. Prefer code and wiring changes over content rewrites when implementing features.
3. Keep changes minimal and scoped to the user request.
4. Preserve existing structure and naming conventions unless explicitly asked to refactor.
5. Validate changes with a build when relevant.

## Working Preferences
1. Treat `content/json/` as user-managed source of truth.
2. If a request might require changing JSON content, ask for confirmation first unless the user already requested it.
3. Document any structural content migrations in the final response.

## Review Checklist
1. Confirm scope: only requested files and behavior are changed.
2. Confirm content safety: no inner value changes in `content/json/*.json` unless explicitly requested.
3. Confirm data wiring: imports, paths, and loaders still resolve correctly after refactors.
4. Confirm UI behavior: locale switching, navigation, and key views still work after changes.
5. Confirm build health: run a full build for non-trivial edits and report result.
6. Confirm output clarity: summarize changed files and rationale in final response.

## Coding Style Rules
1. Prefer small, targeted edits over broad rewrites.
2. Preserve existing naming conventions, folder organization, and public interfaces.
3. Avoid introducing new dependencies unless clearly justified by the task.
4. Add concise comments only when code intent is not obvious.
5. Keep utility logic deterministic and easy to rerun for scripts and migrations.
6. Favor robust path handling and cross-platform compatibility in scripts (Windows included).

## Communication Rules
1. If a requested change could impact content meaning, pause and confirm before editing values.
2. Report blockers explicitly with one practical fallback option.
3. When running automation (migrations, optimizers), report what changed and how to rerun.
