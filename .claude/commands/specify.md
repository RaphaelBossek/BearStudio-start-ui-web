---
description: Start interactive requirements gathering for a new feature or project
argument-hint: [feature-idea]
---

# Requirements Generator

**Input**: $ARGUMENTS

## Goal
Standardize feature specifications using Jobs to be Done (JTBD) and INVEST criteria.
- **Mission**: High-quality software based on customer needs.
- **Tone**: Technical, formal, objective, concise.

## Workflow

### 1. INITIATE
Ask these questions (Wait for answers):
1. **BASELINE**: Current situation/challenges?
2. **MOTIVATION**: Why build this?
3. **OUTCOME**: Expected result?
4. **CONTEXT**: Constraints or environment?
5. **AC**: Acceptance criteria?
6. **INITIAL REQS**: Any known requirements?
7. **TITLE**: Feature name?

### 2. ANALYZE & VALIDATE
- Check against **INVEST** (Independent, Negotiable, Valuable, Estimable, Small, Testable).
- Suggest improvements if criteria are not met.

### 3. GENERATE SPEC
Use the `requirements` skill to create files in `specs/features/{topic}/{feature}/`:
- `requirements.md`: JTBD hypothesis, problem space, success metrics.
- `{feature}.md`: User stories, functional/technical/UI reqs, specific AC.
- `acceptance-criteria.md`: Common AC and suggestions.

### 4. SUMMARY
- Report created file paths.
- Suggest handoff to `/plan`.

### Feature Mode Git Commit
```
feat({topic}): Add feature specification for {feature}
```

---

## INIT MODE: New Project Setup

Use this mode when the user provides a project description for the first time. The goal is to create the PRD AND break the project into individual feature specss in one go.

### Phase 1: Understand the Project
Ask the user interactive questions to clarify the big picture:
1. What is the **CURRENT BASELINE**? (The current situation and challenges)
2. What is my **MOTIVATION**? (Why build this?)
3. What **OUTCOME** should be achieved?
4. Is there any **ADDITIONAL CONTEXT**? (Constraints, specific environment, etc.)
5. What are the **ACCEPTANCE CRITERIA**?
6. Are there any **INITIAL REQUIREMENTS** already known?
7. What is the **TITLE** of the requirement?

Wait for user responses before proceeding.

### Phase 2: Analyze and Validate
1. Inform the user whether the description fulfills the **INVEST** criteria (Independent, Negotiable, Valuable, Estimable, Small, Testable).
2. If it doesn't meet INVEST, make specific suggestions for improvement based on expert analysis.
3. Provide "Further Suggestions for Hypotheses" if applicable.
4. If INITIAL REQUIREMENTS are very general, make additional suggestions or improvements for better clarity.

### Phase 3: Create the Global Requirements
Based on user answers, fill out `specs/PRD.md` with:
- **Vision:** Clear 2-3 sentence description of what and why
- **Target Users:** Who they are, their needs and pain points
- **Success Metrics:** How to measure if the product works
- **Constraints:** Timeline, budget, technical limitations
- **Non-Goals:** What is explicitly NOT being built
- **Core Features (Roadmap):** Prioritized tables by status (Planned, In Progress, Done). Within each table, sort by **Topic**, then by **Feature**.

### Phase 3: Break Down into Features
Apply the Single Responsibility principle to split the roadmap into individual features:
- Each feature = ONE testable, deployable unit
- Identify dependencies between features
- Suggest a recommended build order (considering dependencies)

Present the feature breakdown to the user for review:
> "I've identified X features for your project. Here's the breakdown and recommended build order:"

### Phase 4: Create Feature Specs
For each feature (after user approval of the breakdown):
- Create a directory `specs/features/{topic}/{feature}/`
- Create `specs/features/{topic}/{feature}/requirements.md`
- Create `specs/features/{topic}/{feature}/acceptance-criteria.md`
- Create `specs/features/{topic}/{feature}/{user-story-breakdown-title}.md` for specific user stories and their acceptance criteria.
- Include Jobs to be Done (JTBD), user stories, and edge cases.

### Phase 5: Update Tracking
- Update `specs/PRD.md` with ALL new topics and features in the **Planned** section.

### Phase 6: User Review
Present everything for final approval:
- `specs/PRD.md` summary.
- List of all feature specss created (organized by topic).
- Recommended build order.

### Init Mode Handoff
> "Project setup complete! I've created:
> - Global requirements at `specs/PRD.md`
> - X feature specss in `features/`
>
> Recommended first feature: {topic}/{feature}
> Next step: Run `/plan` to design the technical approach for the first feature."

### Init Mode Git Commit
```
feat: Initialize project - Global requirements and X feature specifications

- Created global requirements with vision, target users, and roadmap in specs/PRD.md
- Created feature specss
- Updated specs/PRD.md
```
