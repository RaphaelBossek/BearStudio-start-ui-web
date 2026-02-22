# Context

A rules and skill-based system for AI have to be created to manage the specification of software products using the latest technologies based on the requirements of the customers.

# Goals

- The requirements should be structured in multiple nested files:
   1. General description of the needs and business rules, constraints or detailed requirements. The Jobs to be Done (JTBD) should be defined here. This general description should be written in a way that it can be understood by non-technical people. This document is stored in `specs/features/{topic}/{feature}/requirements.md`.
   2. Detailed requirements for each feature or module as a breakdown of the general description. The User Stories should be defined here. This document is stored in `specs/features/{topic}/{feature}/{user-story-breakdown-title}.md`.
   3. Common acceptance criteria should be stored in `specs/features/{topic}/{feature}/acceptance-criteria.md`. Specific acceptance criteria should be kept within the user story file.
- The `specs/features/requirements.md` file replaces the `INDEX.md` and serves as the main table of contents for all features.
- Refactor the current AI skills in `.agents/skills/requirements/SKILL.md` and `.agents/skills/requirements/template.md` to be generic and support this structure.
- Refactor the current AI commands in `.claude/commands/specify.md` (renamed from `prd.md`).

# Refactoring
- [x] The files are the specification in first place. The `requirements.md` can have indices to the user stories and acceptance criteria for easy navigation as reference.
- [x] Replace `specs/features/INDEX.md` by `specs/features/requirements.md`.
- [x] Adopt the structure of the folders to `specs/features/{topic}/{feature}/`.
- [x] Refactor the `specs/features/{topic}/{feature}/requirements.md` to be a table of contents/overview.
- [x] Refactor the `specs/features/{topic}/{feature}/{user-story-breakdown-title}.md` to contain User Stories and their specific AC.
- [x] Refactor the `specs/features/{topic}/{feature}/acceptance-criteria.md` to contain only common acceptance criteria.
- [x] Refactor the `.agents/skills/requirements/SKILL.md` file (Keep it generic).
- [x] Refactor the `.agents/skills/requirements/template.md` file (Keep it generic).
- [x] Refactor the `.claude/commands/specify.md` file (renamed from `prd.md`).
