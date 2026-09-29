---
name: update-changelog
description: >-
  Maintains and updates CHANGELOG.md at the project root with date headings and commit bullets. Use this skill when asked to update or create the changelog, synchronize CHANGELOG.md with git commit history, or document branch changes prior to merging.
---

# Update Changelog Skill

This skill maintains a structured `CHANGELOG.md` at the project root, organized in reverse chronological order with date headings (`## YYYY-MM-DD`) and commit bullet points.

## Workflow Overview

```
                      ┌──────────────────────┐
                      │  Check CHANGELOG.md  │
                      └──────────┬───────────┘
                                 │
                 ┌───────────────┴───────────────┐
                 │                               │
          [Does not exist]                   [Exists]
                 │                               │
                 ▼                               ▼
       Initial Generation               Pre-Merge Update
   - Query full git history         - Query commits not yet logged
   - Group all commits by date      - Group by date (newest first)
   - Write full CHANGELOG.md        - Prepend or update date sections
```

---

## Step-by-Step Procedure

### 1. Check for `CHANGELOG.md`

Examine the project root to determine whether `CHANGELOG.md` exists:
- If **missing**, proceed to **Scenario A: Initial Generation**.
- If **present**, proceed to **Scenario B: Incremental Pre-Merge Update**.

---

### Scenario A: Initial Generation (No Existing `CHANGELOG.md`)

When no `CHANGELOG.md` exists, build it from the repository's git commit history:

1. **Extract git commit history**:
   ```bash
   git log --date=short --pretty=format:"%ad|%h|%s"
   ```
2. **Group commits by date (`YYYY-MM-DD`)**:
   - Maintain reverse chronological order (newest date first).
   - Under each date, list commits in reverse chronological order.
3. **Format each entry**:
   - Format: `- <commit subject> (<short hash>)`
   - Example: `- feat(tests): impl. Vitest (c74868a)`
4. **Write `CHANGELOG.md`** at the project root with the following structure:

   ```markdown
   # Changelog

   All notable changes to AgentClinic are documented in this file.

   ## 2026-09-29

   - chore(git): update `.gitignore` (8e38252)
   - feat(app): impl. responsive design (e06df87)
   - feat(specs): replan for responsive design (9d73a20)
   - feat(tests): impl. Vitest (c74868a)
   - chore(git): update `.gitignore` (f556c52)

   ## 2026-09-27

   - Merge pull request #1 from ricky-kiva/feature/base-setup-and-schema (4cecb93)

   ## 2026-09-26

   - feat(app): impl. glassmorphism (946b56b)
   - feat(phase): 1. base setup & schema (8cd9570)
   ```

*(Alternatively, run the included script: `node .agents/skills/update-changelog/scripts/update-changelog.js`)*

---

### Scenario B: Incremental Pre-Merge Update (Existing `CHANGELOG.md`)

When preparing to merge changes (e.g. from a feature branch into `main` or after committing new work):

1. **Identify new commits**:
   - Check the recent git log:
     ```bash
     git log --date=short --pretty=format:"%ad|%h|%s" -n 25
     ```
   - If merging a feature branch, check commits against the base branch:
     ```bash
     git log origin/main..HEAD --date=short --pretty=format:"%ad|%h|%s"
     ```
2. **Filter out already logged commits**:
   - Compare commit short hashes with entries already recorded in `CHANGELOG.md`.
3. **Determine target date section**:
   - Use the commit dates (`YYYY-MM-DD`) or today's local date.
   - If the date section `## YYYY-MM-DD` already exists at the top of `CHANGELOG.md`, prepend the new commit bullets under that heading.
   - If the date is new, create a new `## YYYY-MM-DD` heading directly below the `# Changelog` introduction block.
4. **If updating uncommitted / staged work before commit**:
   - You can inspect staged changes with `git status -s` or `git diff --cached` and write descriptive bullet points summarizing the work under today's date heading.

---

## Formatting Rules

1. **Title**: Top-level header `# Changelog`.
2. **Date Headings**: Level-2 headers formatted strictly as `## YYYY-MM-DD` (ISO 8601 date, e.g. `## 2026-09-29`).
3. **Bullet Items**:
   - Format: `- <subject> (<hash>)` for committed changes.
   - Clean, concise descriptions summarizing user-facing value or architectural changes.
4. **Ordering**:
   - Date sections in descending chronological order (most recent date at the top).
   - Within each date, newer commits listed before older commits.
5. **Whitespace**: Single blank line between heading and first bullet; blank line between sections.

---

## Validation & Verification Checklist

- [ ] `CHANGELOG.md` is located at the workspace root.
- [ ] Heading structure is valid (`# Changelog` -> `## YYYY-MM-DD`).
- [ ] Dates are sorted descending.
- [ ] No duplicate commit hashes exist in the file.
- [ ] File ends with a single trailing newline.
