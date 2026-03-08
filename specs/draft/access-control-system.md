# Access Control System Specification

This document outlines the design of a role-based access control (RBAC) system that leverages attributes to manage access to resources. The system follows a CRUD model for resource interaction, incorporates role inheritance, and implements confidentiality-based data visibility.

## 1. Role-Based Access Control (RBAC)
The system uses roles to define permissions on various resources.

### 1.1 Permissions Model
Permissions follow the standard CRUD (Create, Read, Update, Delete) model, extended with **Action-Based Permissions** for modern web application requirements.

#### 1.1.1 CRUD Operations
Each role defines the actions it can perform on specific resources.

#### 1.1.2 Action-Based Permissions
Beyond data manipulation, the system supports intent-based actions. These are used for UI interactions that don't map perfectly to CRUD.
- **Examples**: `Approve`, `Reject`, `Export`, `Impersonate`, `Publish`, `Share`.
- **Mapping**: Actions SHOULD be mapped to a base CRUD operation for consistency (e.g., `Publish` -> `Update`, `Export` -> `Read`), but can be explicitly defined for fine-grained control.

#### 1.1.3 Intent-Based Action Definitions (YAML)
Actions are formally defined within their respective functional resource modules using YAML. This structure binds actions to specific resource paths.

```yaml
# Example: Finance Module Resource & Actions
resource:
  name: Finance Management
  paths: ["/finance/**", "/payments/*"]
  confidentiality: level_1_secret
  actions:
    - name: ReleasePayment
      baseOperation: Update
      minIntegrityLevel: level_1_secret
      requiresMultiPerson: false
      audit: true
      parameters: [amount, departmentId]

    - name: ExportTaxReport
      baseOperation: Read
      minIntegrityLevel: level_2_internal
      requiresMultiPerson: false
      audit: true

    - name: VoidTransaction
      baseOperation: Delete
      minIntegrityLevel: level_0_top_secret
      requiresMultiPerson: true
      audit: true
```

```yaml
# Example: User Management Resource & Actions
resource:
  name: User Administration
  paths: ["/users/*", "/users/*/profile"]
  confidentiality: level_2_internal
  actions:
    - name: Impersonate
      baseOperation: Execute
      minIntegrityLevel: level_0_top_secret
      requiresMultiPerson: false
      audit: true

    - name: ResetPassword
      baseOperation: Update
      minIntegrityLevel: level_2_internal
      requiresMultiPerson: false
      audit: false
      requiresMFA: true
```

#### 1.1.4 Action Attribute Definitions
Each attribute in the action definition serves a specific purpose in the security and operational evaluation of an intent.

- **`name`**: The unique identifier for the action (e.g., `ApproveContract`). This is the string passed to the `usePermission(resource, action)` hook.
- **`baseOperation`**: Defines the fundamental CRUD operation (Create, Read, Update, Delete, Execute) that the action maps to. It acts as the "Entry Barrier" (*High-Level Intent to Low-Level Operation Mapping*): for a user to even be considered for an action, they must first possess the corresponding `baseOperation` permission in their assigned role.
    - *Example*: An action with `baseOperation: Update` is denied immediately if the user's role does not grant `Update` on the resource.
- **`minIntegrityLevel`**: Specifies the minimum clearance (Integrity Level) required to execute the action without additional oversight. It is compared against the user's `effectiveClearance`.
    - *Logic*: If `user.clearance <= action.minIntegrityLevel` (numerically lower means higher clearance), the user meets the trust threshold for this action.
- **`requiresMultiPerson`**: A boolean flag that, when `true`, enforces the **Four-Eyes Principle**. Even if a user has sufficient clearance, the action will be placed in a `PENDING_APPROVAL` state until confirmed by another authorized user.
- **`audit`**: A boolean flag indicating whether every execution of this action should be explicitly recorded in the system's audit logs for forensic and compliance purposes.
- **`parameters`**: (Optional) A list of specific data fields or scoping parameters (e.g., `amount`, `departmentId`) that the action affects. This is used by the **SBAC** layer to ensure the user's assigned scope allows them to interact with these specific parameters.
- **`requiresMFA`**: (Optional) A boolean flag that triggers a Multi-Factor Authentication challenge before the action can be completed, regardless of the user's current session state.

### 1.2 Resource Specification (Resources)
Resources are identified by a unique **Resource Name** and grouped by one or more path or URL-like syntax. This allows for granular control over various system components.

- **Case Sensitivity**: All resource paths are **case-sensitive**. `/users/` is different from `/Users/`.
- **Wildcards**:
  - `*` (Single Asterisk): Matches any sequence of characters within a single path segment (e.g., `/users/*` matches `/users/123` but not `/users/123/profile`).
  - `**` (Double Asterisk): Matches any sequence of characters across multiple path segments, including sub-paths (e.g., `/projects/**` matches `/projects/456`, `/projects/456/tasks`, and all subsequent sub-paths).
- **Resource Grouping**:
  - Multiple paths can be associated with a single resource name.
  - Permissions are granted to these named resources.
- **Precedence Rule**:
  - **Longest Matching Prefix (Most Specific First)**: When multiple resource paths match a given request, the rule for the most specific path (the one with the longest matching prefix) takes precedence. This ensures that granular rules override more general ones.

**Example of Path Precedence**:
Suppose a user has different permissions for the following paths:
1. `/projects/**` (General: Read-only access to all projects)
2. `/projects/123/*` (Specific: Update access to project 123)
3. `/projects/123/settings` (Highly Specific: No access to settings)

- Requesting `/projects/456`: Matches **Rule 1**. Result: **Read-only**.
- Requesting `/projects/123/tasks`: Matches **Rule 1** and **Rule 2**. **Rule 2** is longer/more specific. Result: **Update**.
- Requesting `/projects/123/settings`: Matches **Rule 1**, **Rule 2**, and **Rule 3**. **Rule 3** is the longest/most specific. Result: **No access**.

**Case Sensitivity Note**: All path matching is strictly case-sensitive. A request to `/PROJECTS/123/SETTINGS` would NOT match Rule 3 and would fall through to any rule that might match (or be denied if no rules match).

### 1.3 Role Inheritance
- **Single Inheritance**: A role can inherit permissions from exactly one other role. Multiple inheritance for roles is not supported.
- **Hierarchical Access**: A child role gains all permissions of its parent role, in addition to its own.

### 1.4 User Role Assignment
- A user can be assigned multiple roles.
- By having multiple roles, a user aggregates the access rights of all assigned roles.

### 1.5 UI Integration Strategies
To ensure synchronization between the Frontend (UI) and Backend (Enforcement), the following strategies are employed:

- **Permissions-on-Load**: Upon user authentication or resource fetching, the backend returns the `effective_permissions` for the user/resource combination. The UI uses this to conditionally render components (e.g., hiding an "Edit" button if the user lacks `Update` permission).
- **Unified Rule Engine**: The "Most Restrictive Wins" logic and path matching are implemented as a shared library (TypeScript) usable by both the Frontend and Backend.
- **Graceful Error Handling**: If the UI logic gets out of sync (e.g., due to stale cache), the Backend returns a standardized `403 Forbidden` error with a machine-readable reason (e.g., `INSUFFICIENT_CLEARANCE`), allowing the UI to display appropriate feedback.

## 2. Confidentiality-Based Access Control (CBAC)
In addition to RBAC, the system employs Confidentiality-Based Access Control to manage data visibility within resources. This mechanism ensures that users only see data at the visibility level their clearance permits.

### 2.1 User Confidentiality Levels (Clearance)
Users are assigned one of the following confidentiality levels, which defines their data clearance (also referred to as `clearance` in user and role definitions):
- **`level_0_top_secret`**: Top Secret / Restricted (Highest clearance)
- **`level_1_secret`**: Secret / Confidential / Personal
- **`level_2_internal`**: Internal / Private
- **`level_3_public`**: Public
- **`level_4_restricted`**: Restricted / No Access (Lowest clearance)

#### Interaction: User vs. Role vs. Scope vs. Resource
The system evaluates user-level clearance, role-level clearance, and any active **Scope** limitations (see Section 3) alongside the resource's assigned confidentiality. The **most restrictive level** (highest numerical index) always prevails to determine the **Effective Visibility Level**.

- **Security Ceiling (User Clearance)**: Defines the absolute limit of trust for an individual. A user can never see data above their personal clearance, regardless of the role they are performing.
- **Least Privilege (Role Clearance)**: Defines the specific data visibility needed for a task. A user with high personal clearance might only see data at a more restrictive level when performing a role that only requires that access.
- **Scope Limitation (User Scope)**: A temporary or permanent set of constraints applied to a user that can further reduce their clearance level below what their roles would otherwise allow.
- **Resource Sensitivity (Resource Confidentiality)**: Defines the classification of the data itself. If a user's effective clearance (User/Role/Scope) is lower than the Resource Confidentiality, the data is transformed to match that lower clearance level.

| User Clearance       | Role Clearance       | Scope Clearance Limit | Resource Confidentiality | Resulting Visibility Level |
|:---------------------|:---------------------|:----------------------|:-------------------------|:---------------------------|
| `level_0_top_secret` | `level_2_internal`   | `None`                | `level_0_top_secret`     | `level_2_internal`         |
| `level_2_internal`   | `level_0_top_secret` | `None`                | `level_0_top_secret`     | `level_2_internal`         |
| `level_0_top_secret` | `level_0_top_secret` | `level_2_internal`    | `level_0_top_secret`     | `level_2_internal`         |
| `level_1_secret`     | `level_1_secret`     | `level_3_public`      | `level_0_top_secret`     | `level_3_public`           |

Each role uses these levels to define the individual confidentiality (clearance) required for its assigned resources.

### 2.2 Access Prohibition Rules
The system can be configured to **prohibit access** rather than just masking data when a user's clearance is lower than the resource's confidentiality level.

1.  **Strict Enforcement (Global/Resource Level)**: If enabled, any access request where `User/Role Clearance < Resource Confidentiality` (where "lower" means a higher numerical index) results in a total denial of access (effectively `level_4_restricted`).
2.  **Clearance Gap Threshold**: Access is prohibited if the gap between the user's clearance and the resource's confidentiality exceeds a defined threshold (e.g., if a user with `level_3_public` tries to access `level_0_top_secret`).
3.  **Explicit level_4_restricted Assignment**: If either the user's personal clearance or the role-granted clearance for a resource is explicitly set to `level_4_restricted`, the user is prohibited from performing any CRUD operations on that resource, regardless of its confidentiality level.

### 2.3 Data Visibility Levels
The confidentiality level assigned to a user determines how they perceive specific data attributes within a resource. This is achieved through Dynamic Data Masking (DDM) or Static Data Masking (SDM) depending on the environment:

| Identifier           | Technical Term      | Transformation Technique           | Description                                                                               | Example (Credit Card) |
|:---------------------|:--------------------|:-----------------------------------|:------------------------------------------------------------------------------------------|:----------------------|
| `level_0_top_secret` | Clear Text          | None                               | Full visibility for authorized users.                                                     | 4532 0122 8844 1092   |
| `level_1_secret`     | Partial Masking     | Format-Preserving Encryption (FPE) | Shows "hints" for verification without full disclosure.                                   | **** **** **** 1092   |
| `level_2_internal`   | Pseudonymization    | Substitution / Shuffling           | Replaces data with a reversible, realistic identifier.                                    | 4912 8331 0021 7732   |
| `level_3_public`     | Anonymization       | Encryption / Hashing               | Scrubbed or aggregated data; no individual identification.                                | Visa / North America  |
| `level_4_restricted` | Redaction / Nulling | Nulling                            | Total removal or nulling of the data attribute. Access is prohibited for CRUD operations. | [REDACTED] or NULL    |

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

## 3. Scope-Based Access Control (SBAC)
A **Scope** is a set of limitations applied directly to a user that overrides and reduces the rights granted by their roles and personal clearance. Scopes are used for temporary, time-bound, or permanent restrictions.

### 3.1 Purpose of Scopes
Scopes are designed to handle scenarios where a user's permissions need to be restricted without changing their underlying roles or clearance level.
- **Onboarding**: A new user may have a "Limited Onboarding" scope that restricts access until training is complete.
- **Security Probation**: A user under review might have a "Restricted Access" scope applied.
- **Time-Bound Tasks**: Access can be limited to specific resources for the duration of a specific project or shift.
- **Emergency Lockdowns**: Quickly reducing user permissions across the system without modifying individual roles.

### 3.2 Interaction with RBAC and CBAC
A Scope acts as a **negative filter** on the user's aggregate permissions and clearance:
- **Permission Reduction**: A Scope can explicitly prohibit certain CRUD operations on specific resources, even if a user's role allows them.
- **Clearance Capping**: A Scope can set a maximum clearance level. If a user's effective clearance (User/Role) is higher than the Scope's limit, it is downgraded to the Scope's level.
- **Most Restrictive Wins**: When multiple scopes are applied, the final set of permissions is the intersection of all allowed actions, and the final clearance is the lowest (highest numerical index) among all applied scope limits.

### 3.3 Scope Application Example: Onboarding
In an onboarding scenario, a user assigned the `Admin` role (which usually allows full CRUD on `/users/**`) might have an `onboarding` scope applied.

**Example Scenario**:
- **Role (`Admin`)**: Can `Create`, `Read`, `Update`, `Delete` on `/users/**`.
- **User Clearance**: `level_0_top_secret`.
- **Applied Scope (`onboarding`)**:
  - **Permissions**: Only `Read` on `/users/**`.
  - **Clearance Limit**: `level_3_public`.

**Resulting Effective Rights**:
- **Effective Permissions**: `Read` only on `/users/**` (CRUD rights are reduced by the scope).
- **Effective Clearance**: `level_3_public` (Clearance is capped by the scope).

## 4. Data Integrity and Accuracy (Biba Integrity Model)
In addition to confidentiality, the system ensures data accuracy and integrity by implementing principles derived from the Biba Integrity Model. While CBAC (Section 2) focuses on *Read* access (No Read Up), Integrity control focuses on *Write* access.

### 4.1 The "No Write Up" Principle
To prevent low-integrity information from corrupting high-integrity data, the system enforces a **No Write Up** rule:
- A user/role can only modify or create data at a confidentiality level equal to or *lower* (higher numerical index) than their own effective clearance (after considering User, Role, and **Scope** limitations).
- **Example**: A user with `level_2_internal` clearance (effective) cannot modify a `level_1_secret` resource, as they lack the necessary integrity clearance to ensure the accuracy of such sensitive data.

### 4.2 Multi-Person Approval (Four-Eyes Principle)
When a user attempts to "Write Up" (modify data at a higher sensitivity level than their clearance) or when a resource is marked as **High Integrity**, the system requires multi-person approval.

- **Approval Threshold**: Defines the minimum number of authorized users (with sufficient clearance) who must confirm the change before it is applied.
- **Approval Workflow**:
  1. **Initiation**: A user with `Update` or `Create` permissions proposes a change.
  2. **Validation**: If the user's clearance is lower than the resource's confidentiality, the change is placed in a `Pending` state.
  3. **Review**: Users with a clearance level equal to or higher than the resource (and the `Approve` permission) are notified.
  4. **Commit**: Once the `approval_threshold` is met, the change is permanently applied to the resource.

### 4.3 Integrity Levels vs. Confidentiality
In this system, Confidentiality Levels (Clearance) also serve as Integrity Levels. A higher clearance implies a higher level of trust and responsibility for maintaining data accuracy.

## 5. CRUD Terminology and Synonyms
The following synonyms may be used within the system to represent core CRUD operations:

- **Create**: Add, Import, Execute, Run, Restore
- **Read**: View, Print, Share, Export, Backup
- **Update**: Modify, Rename, Move, Restore
- **Delete**: Revoke, Remove, Restore

*Note: The term "Restore" is context-dependent and can apply to the creation of a previous state, an update to an existing state, or the reversal of a deletion.*

---

## 6. Example Configuration (YAML)
The following example demonstrates how the various components of the Access Control System (RBAC, CBAC, SBAC, Biba) are configured in a unified YAML format.

### 6.1 Role and User Configuration
This section defines the roles, their inheritance, and the users assigned to them.

```yaml
# 1. Roles Definition (RBAC & Inheritance)
roles:
  base_user:
    inheritance: null
    permissions:
      - resource: "public_assets"
        actions: ["view"] # Synonym for Read
        clearance: level_3_public
  
  department_manager:
    inheritance: "base_user"
    permissions:
      - resource: "project_data"
        actions: ["view", "export"]
        clearance: level_2_internal
      - resource: "finance_reports"
        actions: ["view"]
        clearance: level_1_secret

  accountant:
    inheritance: "base_user"
    permissions:
      - resource: "finance_data"
        actions: ["view", "modify", "add"]
        clearance: level_0_top_secret
      - resource: "audit_logs"
        actions: ["view", "export", "backup"]
        clearance: level_0_top_secret

# 2. Scopes Definition (SBAC)
scopes:
  onboarding:
    permissions:
      - resource: "all_resources"
        actions: ["view"]
        clearance_limit: level_3_public

# 3. Users Definition
users:
  user_001:
    name: "Alice Finance"
    roles: ["accountant"]
    clearance: level_0_top_secret
  
  user_008:
    name: "New Admin Trainee"
    roles: ["admin"]
    clearance: level_0_top_secret
    scopes: ["onboarding"]
```

### 6.2 Resource and Action Definitions
This section defines the resources, their paths, and the intent-based actions associated with them.

```yaml
# 4. Resources and Intent-Based Actions
resources:
  finance_reports:
    paths: ["/finance/reports/*"]
    confidentiality: level_0_top_secret
    actions:
      - name: ExportTaxReport
        baseOperation: Read
        minIntegrityLevel: level_2_internal
        audit: true

  legal_contracts:
    paths: ["/legal/contracts/*"]
    confidentiality: level_1_secret
    approval_threshold: 1
    actions:
      - name: ApproveContract
        baseOperation: Update
        minIntegrityLevel: level_1_secret
        requiresMultiPerson: true
```

### 6.3 Use Case Scenarios
Below are concrete examples of how the system evaluates access based on the configuration above.

- **Scenario 1: RBAC & CBAC (Partial Masking)**:
  - User "Bob Manager" (Level 1) accessing `finance_reports` (Resource Level 0).
  - Role "department_manager" grants `level_1_secret` clearance for `finance_reports`.
  - **Result**: Bob sees the report with `level_1_secret` visibility (Partial Masking / FPE).

- **Scenario 2: SBAC (Scope Capping)**:
  - User "New Admin Trainee" has `admin` role (Level 0) but `onboarding` scope (Capped at Level 3).
  - **Result**: User can only `view` and sees data at `level_3_public` visibility (Anonymized).

- **Scenario 3: Biba Integrity (Write-Up Prevention)**:
  - User "Legal Assistant" (Level 2) attempts to `modify` a `legal_contracts` (Resource Level 1).
  - **Result**: Change enters a `Pending` state because the user's clearance (2) is lower than the resource's confidentiality (1).

