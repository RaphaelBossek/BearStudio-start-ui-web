# Requirements: Skill Management

## JTBD Hypothesis
**When** I am an administrator,
**I want to** define and manage a list of skills and exclusion criteria,
**So that** I can accurately match experts with the services they are qualified to perform.

## Problem Space
Medical services require specific qualifications (skills). Additionally, some experts may have exclusion criteria that prevent them from performing certain tasks. Without a system to manage these, qualification tracking becomes manual and prone to error.

## Success Metrics
- 100% accurate tracking of expert certifications.
- Automatic filtering of experts in the scheduler based on required skills.

## Technical & Functional Requirements

### Skills (Fähigkeiten)
Each skill must include:
- **Title**: Name of the skill.
- **Description**: Detailed explanation.
- **Type**:
  - Specialty (Fachrichtung)
  - Additional Training (Zusatzausbildung)
  - Continuing Education (Fort- und Weiterbildung)
  - Language (Sprache)
- **Status**: Active or Deactivated.
- **Certificate Requirement**: Boolean (Yes/No).

### Exclusion Criteria (Ausschlusskriterien)
Each criterion must include:
- **Title**: Name of the criterion.
- **Description**: Detailed explanation.
- **Weighting**: Numeric value representing importance/impact.
- **Status**: Active or Deactivated.
