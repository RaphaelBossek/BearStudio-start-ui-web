# Access Control System Specification

This document outlines the design of a role-based access control (RBAC) system that leverages attributes to manage access to resources. The system follows a CRUD model for resource interaction, incorporates role inheritance, and implements confidentiality-based data visibility.

## 1. Role-Based Access Control (RBAC)
The system uses roles to define permissions on various resources.

### 1.1 Permissions Model
Permissions follow the standard CRUD (Create, Read, Update, Delete) model.
Each role defines the actions it can perform on specific resources.

### 1.2 Resource Specification (Resources)
Resources are identified by a unique **Resource Name** and grouped by one or more path or URL-like syntax. This allows for granular control over various system components.

- **Wildcards**:
  - `*` (Single Asterisk): Matches any sequence of characters within a single path segment (e.g., `/users/*` matches `/users/123` but not `/users/123/profile`).
  - `**` (Double Asterisk): Matches any sequence of characters across multiple path segments, including sub-paths (e.g., `/projects/**` matches `/projects/456`, `/projects/456/tasks`, and all subsequent sub-paths).
- **Resource Grouping**:
  - Multiple paths can be associated with a single resource name.
  - Permissions are granted to these named resources.
- **Precedence Rule**:
  - **Deepest Path First**: Permissions are applied starting from the most specific (deepest) path match within a resource group. If no specific match is found, the system continues to evaluate increasingly general (parent) paths until a rule applies.

### 1.3 Role Inheritance
- **Single Inheritance**: A role can inherit permissions from exactly one other role. Multiple inheritance for roles is not supported.
- **Hierarchical Access**: A child role gains all permissions of its parent role, in addition to its own.

### 1.4 User Role Assignment
- A user can be assigned multiple roles.
- By having multiple roles, a user aggregates the access rights of all assigned roles.

## 2. Confidentiality-Based Access Control (CBAC)
In addition to RBAC, the system employs Confidentiality-Based Access Control to manage data visibility within resources. This mechanism ensures that users only see data at the visibility level their clearance permits.

### 2.1 User Confidentiality Levels (Clearance)
Users are assigned one of the following confidentiality levels, which defines their data clearance (also referred to as `clearance` in user and role definitions):
- **`level_0_top_secret`**: Top Secret / Restricted (Highest clearance)
- **`level_1_secret`**: Secret / Confidential / Personal
- **`level_2_internal`**: Internal / Private
- **`level_3_public`**: Public
- **`level_4_restricted`**: Restricted / No Access (Lowest clearance)

Each role uses these levels to define the individual confidentiality (clearance) required for its assigned resources.

### 2.2 Data Visibility Levels
The confidentiality level assigned to a user determines how they perceive specific data attributes within a resource. This is achieved through Dynamic Data Masking (DDM) or Static Data Masking (SDM) depending on the environment:

| Identifier | Technical Term | Transformation Technique | Description | Example (Credit Card) |
| :--- | :--- | :--- | :--- | :--- |
| `level_0_top_secret` | Clear Text | None | Full visibility for authorized users. | 4532 0122 8844 1092 |
| `level_1_secret` | Partial Masking | Format-Preserving Encryption (FPE) | Shows "hints" for verification without full disclosure. | **** **** **** 1092 |
| `level_2_internal` | Pseudonymization | Substitution / Shuffling | Replaces data with a reversible, realistic identifier. | 4912 8331 0021 7732 |
| `level_3_public` | Anonymization | Encryption / Hashing | Scrubbed or aggregated data; no individual identification. | Visa / North America |
| `level_4_restricted` | Redaction / Nulling | Nulling | Total removal or nulling of the data attribute. | [REDACTED] or NULL |

**Note**: The visibility of a resource attribute is dynamically adjusted based on the user's assigned confidentiality level.

### 2.3 Technical Masking Implementation
- **Static Data Masking (SDM)**: The data is permanently changed in a copy of the database. This is commonly used for non-production environments like testing and development.
- **Dynamic Data Masking (DDM)**: The original data remains unchanged in the database, but a "proxy" or "view" masks it in real-time as the user queries it, based on their clearance level.

### 2.4 Transformation Logic
The system utilizes several transformation methods to ensure data security and privacy:

- **Substitution**: Replaces a real value with another from a predefined lookup table (e.g., replacing "Smith" with "Johnson") to maintain data realism.
- **Shuffling**: Swaps values within the same column across different rows to break the deterministic link between individuals and their data.
- **Encryption/Hashing**: Uses mathematical functions to scramble data. While hashing is one-way, encryption is intended to be reversible by authorized systems.
- **Format-Preserving Encryption (FPE)**: Scrambles data while maintaining its original format and length (e.g., an encrypted email remains `xxxxx@xxxxx.com`).

## 3. CRUD Terminology and Synonyms
The following synonyms may be used within the system to represent core CRUD operations:

- **Create**: Add, Import, Execute, Run, Restore
- **Read**: View, Print, Share, Export, Backup
- **Update**: Modify, Rename, Move, Restore
- **Delete**: Revoke, Remove, Restore

*Note: The term "Restore" is context-dependent and can apply to the creation of a previous state, an update to an existing state, or the reversal of a deletion.*

