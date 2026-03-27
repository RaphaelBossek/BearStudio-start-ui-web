# User Management -- User Workflows

This document describes the user experience and decision flows for the User Management domain. All diagrams represent the journey from the user's perspective, not internal system architecture.

---

## Context

The User Management domain covers staff profile management, expert search, availability scheduling, onboarding, and administrative user operations. It is used by two primary roles:

- **Employees** (EMPLOYEE authority): Can view and edit their own profile (personal data, business data, addresses, education), change their password, and create a digital signature.
- **Administrators** (ADMIN / USERS_UPDATE authority): Can manage all staff profiles, access admin-only tabs (documents, products, availability scheduling), search experts, manage appointment assignments, trigger onboarding, reset passwords, and create invoices.

The profile form is the densest form in the application (1014 lines, 8 tabs, 60+ fields) and is shared between the personal profile page and the staff management list's inline detail panel.

---

## 1. Staff Onboarding Journey

This diagram shows the high-level flow when an administrator onboards a new staff member, from account creation through to full operational readiness.

**Who uses it:** Administrators (ADMIN_INTERN, ADMIN)
**Entry point:** Administrator clicks "Add" on Staff List toolbar
**Exit points:** Staff member is fully onboarded and active, or onboarding is paused/incomplete

```mermaid
flowchart TD
    A["Staff List Page<br>(Administrator View)"] -->|"Click Add (+)"| B["New Employee Record<br>(Profile Form Opens)"]

    B --> C["Fill Personal Data Tab<br>(Name*, Email*, Mobile, Birthday)"]
    C --> D["Fill Business Data Tab<br>(Active Since, Contract Type,<br>Qualification Level)"]
    D --> E["Fill Address Tab<br>(Main Address: Street*, ZIP*, City*)"]
    E --> F["Save Employee Record"]

    F --> G{"Account Created<br>Successfully?"}
    G -->|"Yes"| H["Employee Appears in Staff List<br>(State: UNCONFIRMED)"]
    G -->|"No"| I["Validation Error<br>(Missing required fields)"]
    I --> C

    H --> J{"Start Onboarding?"}
    J -->|"Click Onboarding button"| K["Onboarding Dialog Opens<br>(Checklist of steps)"]
    J -->|"Skip for now"| L["Employee stays UNCONFIRMED"]

    K --> M["Work Through Steps<br>(Documents, Contracts, Checks)"]
    M --> N{"All Steps Complete?"}
    N -->|"Yes"| O["Change State to ACTIVE<br>(Business Data Tab)"]
    N -->|"Not yet"| P["Save Progress<br>(Partial completion tracked)"]
    P --> L

    O --> Q["Set Up 2FA<br>(Require TOTP checkbox)"]
    Q --> R["Configure Availability<br>(Expert Days + Expert Week tabs)"]
    R --> S["Assign Skills<br>(Education Tab)"]
    S --> T["Upload Documents<br>(Documents Tab)"]
    T --> U["Employee Fully Operational"]

    style A fill:#e8f4f8,stroke:#2c7bb6
    style U fill:#d4edda,stroke:#155724
    style I fill:#fce4ec,stroke:#c62828
    style L fill:#fff3cd,stroke:#856404
```

**Key observations:**

- The onboarding process is non-linear -- administrators can complete steps in any order and save partial progress.
- The profile form's 8 tabs map to distinct onboarding phases: identity (Personal), employment (Business), location (Address), qualifications (Education), compliance (Documents), billing (Products), and scheduling (Expert Days/Week).
- State transitions (UNCONFIRMED -> ACTIVE) are manual via the Business Data tab's state dropdown.
- 2FA enforcement is a separate admin decision made via the `requireTotp` checkbox.

---

## 2. Profile Editing State Diagram

This diagram models the states a staff profile editing session can be in, from the user's perspective.

**Who uses it:** Both employees (own profile) and administrators (any profile)

```mermaid
stateDiagram-v2
    [*] --> ViewingProfile: Open profile page / Select staff row

    ViewingProfile: Viewing Profile
    EditingTab: Editing a Tab
    SavingProfile: Saving Changes
    UploadingFile: Uploading File
    ChangingPassword: Changing Password
    CreatingSignature: Creating Signature
    ManagingAvailability: Managing Availability

    ViewingProfile --> EditingTab: Click into any field
    ViewingProfile --> ChangingPassword: Click "Change Password" (navbar)
    ViewingProfile --> CreatingSignature: Click "Create Signature" (Business tab)
    ViewingProfile --> ManagingAvailability: Switch to Expert Days/Week tab

    EditingTab --> EditingTab: Switch between tabs (unsaved changes preserved)
    EditingTab --> SavingProfile: Click Save (navbar)
    EditingTab --> UploadingFile: Upload profile picture / document / certificate

    SavingProfile --> SaveSuccess: Validation passes
    SavingProfile --> ValidationError: Required field missing
    SaveSuccess --> ViewingProfile: Form re-filled with saved data

    state SaveSuccess <<choice>>
    state ValidationError <<choice>>

    ValidationError --> EditingTab: Fix validation errors

    UploadingFile --> UploadSuccess: File accepted
    UploadingFile --> UploadError: File rejected
    UploadSuccess --> EditingTab: Auto-save triggered, form refreshed

    state UploadSuccess <<choice>>
    state UploadError <<choice>>

    UploadError --> EditingTab: Show error, try again

    ChangingPassword --> PasswordDialog: Dialog opens
    PasswordDialog --> ValidatingPassword: Enter current + new + confirm
    ValidatingPassword --> PasswordSuccess: All rules pass + server accepts
    ValidatingPassword --> PasswordError: Rule failed or bad credential

    state PasswordSuccess <<choice>>
    state PasswordError <<choice>>

    PasswordSuccess --> ViewingProfile: Toast "Password changed"
    PasswordError --> PasswordDialog: Show which rule failed

    CreatingSignature --> SignaturePad: Canvas dialog opens
    SignaturePad --> SignatureSaved: Click "Sign"
    SignaturePad --> SignatureCleared: Click "Clear"

    state SignatureSaved <<choice>>

    SignatureCleared --> SignaturePad: Canvas reset
    SignatureSaved --> ViewingProfile: Signature image updated

    ManagingAvailability --> EditingSlots: Click on grid cells
    EditingSlots --> SavingAvailability: Click Save (navbar)
    SavingAvailability --> ManagingAvailability: Grid reloaded

    state EditingSlots {
        [*] --> CellClick: Click single cell
        CellClick --> CycleTriState: Month grid (null->true->false->null)
        CellClick --> CycleBinary: Week grid (null->true->null)
        CycleTriState --> [*]
        CycleBinary --> [*]
    }
```

---

## 3. 2FA Setup Experience

This diagram shows the TOTP two-factor authentication setup flow from the user's perspective.

**Who uses it:** Any user whose account has `requireTotp = true`, or users who voluntarily set up 2FA
**Entry point:** User navigates to Security page (`/admin/userSecurity.html`)
**Exit points:** 2FA successfully activated, or user leaves without completing setup

```mermaid
sequenceDiagram
    actor User
    participant SecurityPage as Security Page
    participant AuthApp as Authenticator App (phone)

    Note over User, SecurityPage: User navigates to Security settings

    alt No TOTP configured
        SecurityPage-->>User: Shows "2-Factor" info text + "Start" button
        User->>SecurityPage: Clicks "Start"
        SecurityPage-->>User: Shows QR code + secret key + algorithm info

        User->>AuthApp: Scans QR code with phone
        AuthApp-->>User: Shows 6-digit code

        User->>SecurityPage: Enters 6-digit code (auto-advances between fields)
        Note right of SecurityPage: Auto-submits when 6th digit entered

        alt Code valid (first time)
            SecurityPage-->>User: Activates TOTP device
            SecurityPage-->>User: Page reloads showing "Active" state
        else Code invalid
            SecurityPage-->>User: Shows error alert "Code is invalid"
            User->>SecurityPage: Re-enters code from authenticator app
        end

    else TOTP active
        SecurityPage-->>User: Shows device info (agent, IP, activated date, last used)
        SecurityPage-->>User: Shows 6-digit input for testing + "Delete 2nd Factor" button

        alt User tests code
            User->>SecurityPage: Enters 6-digit code
            SecurityPage-->>User: Shows "Code successfully verified!" success alert
        else User deletes 2FA
            User->>SecurityPage: Enters current code + clicks "Delete 2nd Factor"
            SecurityPage-->>User: TOTP removed, page reloads to "No Token" state
        end
    end
```

**Key observations:**

- The 6-digit split input has specialized UX: auto-focus advancement, paste distribution, backspace navigation, and auto-submit on the 6th digit.
- The QR code is server-generated (`/get/UserService/showToken`) and the secret is displayed in plaintext for manual entry.
- There is no confirmation dialog before deleting 2FA -- this should be addressed in the rebuild.
- The "Generate New Secret" button in the pending state regenerates the QR code (invalidates previous scans).

---

## 4. Expert Search and Assignment Decision Flow

This diagram shows how an administrator finds and assigns experts to appointments.

**Who uses it:** Administrators with USERS_UPDATE authority
**Entry point:** Staff List page -- "Expert Test Search" button or "Appointment Requests" button
**Exit points:** Expert found and navigated to, or assignment accepted/rejected

```mermaid
flowchart TD
    A["Staff List Page<br>(10-column grid)"] -->|"Expert Test Search button<br>(always enabled)"| B["Expert Search Dialog"]
    A -->|"Select row → Appointment Requests<br>(enabled on selection)"| C["Assignment Dialog"]

    subgraph "Expert Search Flow"
        B --> D["Select Job Filter<br>(autocomplete)"]
        D --> E["Toggle Active Filter"]
        E --> F["Click Search"]
        F --> G["Results Table Appears<br>(Name, Skills, Exclusion Criteria,<br>Qualification Level)"]

        G --> H{"Refine Results?"}
        H -->|"Add Skill filter"| I["Add to Skills Collection<br>(autocomplete + insert)"]
        I --> J["Client-side AND filter<br>applied automatically"]
        J --> G

        H -->|"Add Exclusion Criteria"| K["Add to Exclusion Collection<br>(autocomplete + insert)"]
        K --> L["Client-side exclusion filter<br>applied automatically"]
        L --> G

        H -->|"Found expert"| M{"Expert has appointment link?"}
        M -->|"Yes"| N["Navigate to<br>appointment.html#id"]
        M -->|"No"| O["Note expert for manual<br>assignment elsewhere"]
    end

    subgraph "Assignment Request Flow"
        C --> P["Filter: Year / Month<br>(pre-filled: previous month)"]
        P --> Q["Shows User: display name"]
        Q --> R["Appointment List<br>(Type, Weekday, Date, Time,<br>Job Code, Location)"]

        R --> S{"For each appointment:"}
        S -->|"Accept"| T["Confirm: 'Accept user?'"]
        T --> U["AppointmentService.adjustUser<br>(AGREED)"]
        S -->|"Reject"| V["Confirm: 'Reject user?'"]
        V --> W["AppointmentService.adjustUser<br>(REJECTED)"]
        S -->|"Export"| X["Download .xls<br>for selected user/period"]
    end

    style A fill:#e8f4f8,stroke:#2c7bb6
    style N fill:#d4edda,stroke:#155724
    style U fill:#d4edda,stroke:#155724
    style W fill:#fce4ec,stroke:#c62828
```

---

## 5. Expert Availability Management

This diagram shows how an administrator manages an expert's monthly and weekly availability schedule.

**Who uses it:** Administrators (ADMIN) via profile form's Expert Days / Expert Week tabs
**Entry point:** Select staff member -> open profile -> switch to Expert Days or Expert Week tab
**Exit points:** Availability saved

```mermaid
flowchart TD
    subgraph "Month Grid (Expert Days Tab)"
        A1["Select Year/Month<br>(defaults to next month)"] --> A2["Grid Loads:<br>31 rows x 6 slot columns"]
        A2 --> A3{"Interaction:"}

        A3 -->|"Click single cell"| A4["Tri-state cycle:<br>null (circle) -> true (green check)<br>-> false (red X) -> null"]
        A3 -->|"Click day number"| A5["Equalize all 6 slots<br>for that day, then cycle"]
        A3 -->|"Click weekday name<br>(e.g., 'Mon')"| A6["Copy current day's slots<br>to ALL same-weekday rows<br>(Mon 7 -> Mon 14, 21, 28)"]
        A3 -->|"Click column header<br>(e.g., 'Morning')"| A7["Equalize entire column,<br>then cycle"]

        A4 & A5 & A6 & A7 --> A8["Visual update:<br>Icons + colors refresh"]

        A8 --> A9{"Change year/month?"}
        A9 -->|"Yes, unsaved changes"| A10["Prompt: Save first?"]
        A10 --> A11["Save then reload"]
        A9 -->|"No"| A12["Click Save (navbar)"]
        A12 --> A13["ExpertDaysService.save"]
    end

    subgraph "Week Grid (Expert Week Tab)"
        B1["Select Week Type<br>(only: TREATMENT)"] --> B2["Grid Loads:<br>24 rows (hours) x 7 day columns"]
        B2 --> B3{"Interaction:"}

        B3 -->|"Click single cell"| B4["Binary cycle:<br>null (X) -> true (green check)<br>-> null"]
        B3 -->|"Click hour label"| B5["Equalize all 7 days<br>for that hour, then cycle"]
        B3 -->|"Click column header<br>(e.g., 'Monday')"| B6["Equalize entire column,<br>then cycle"]

        B4 & B5 & B6 --> B7["Visual update"]
        B7 --> B8["Click Save (navbar)"]
        B8 --> B9["ExpertWeekService.save"]
    end

    subgraph "Lock Behavior (Month Grid Only)"
        A13 --> L1{"Month locked<br>by planning?"}
        L1 -->|"Yes + not ADMIN"| L2["Grid disabled,<br>alert shown:<br>'Month is in planning'"]
        L1 -->|"No or ADMIN"| L3["Grid remains editable"]
    end

    style A4 fill:#e8f4f8,stroke:#2c7bb6
    style B4 fill:#e8f4f8,stroke:#2c7bb6
    style L2 fill:#fff3cd,stroke:#856404
```

**Key observations:**

- The month grid has a tri-state cycle (null/available/unavailable) while the week grid only has binary (null/available).
- The "copy to same weekday" interaction (clicking weekday name) is a powerful bulk-edit that copies one day's configuration to all matching weekdays in the month.
- Month availability can be locked when the planning department has already used it for scheduling. Only ADMIN users can override the lock.
- Appointment overlay icons appear in the month grid showing existing bookings -- they are read-only indicators with deep-link navigation.
- Known bug in legacy: Sunday data mapping between server (`slotsSo`) and UI (`slotsSu`) is broken.

---

## 6. Password Change Flow

**Who uses it:** Any authenticated user
**Entry point:** Click "Change Password" button in profile navbar
**Exit point:** Password successfully changed, or user cancels

```mermaid
sequenceDiagram
    actor User
    participant Dialog as Password Dialog
    participant Rules as Validation Rules

    User->>Dialog: Click "Change Password" in navbar
    Dialog-->>User: Shows 3 password fields + strength meter at 10%

    Note over Dialog, Rules: Rules fetched from server on dialog open:<br/>min length, mixed case, special char, bad credential

    User->>Dialog: Types current password (field 1)
    User->>Dialog: Types new password (field 2)

    loop On every keyup in new password field
        Dialog->>Rules: Check Rule 1: length >= min (default 8)
        Dialog->>Rules: Check Rule 2: has uppercase AND lowercase
        Dialog->>Rules: Check Rule 3: has special char OR digit
        Rules-->>Dialog: Update rule icons (exclamation -> checkmark)
        Rules-->>Dialog: Update progress bar (+percentage per satisfied rule)
    end

    User->>Dialog: Types confirm password (field 3)
    User->>Dialog: Clicks OK

    alt Any rule icon still shows exclamation
        Dialog-->>User: Alert "Password does not meet requirements"
    else All client rules pass
        Dialog->>Rules: Server check: BadCredentialService.hasBadCredentials
        alt Password is commonly used
            Dialog-->>User: Shows Rule 4 alert (commonly used password)
        else Password is unique enough
            Dialog->>Dialog: UserService.changePassword(null, current, new, confirm)
            alt Success
                Dialog-->>User: Toast "Your password has been changed"
                Dialog-->>User: Dialog closes
            else Server error
                Dialog-->>User: Show error message
            end
        end
    end
```

---

## Interdependencies Summary

| Factor | Affects | How |
|:---|:---|:---|
| **User role (EMPLOYEE vs ADMIN)** | Profile form visibility | EMPLOYEE sees 4 tabs; ADMIN sees 8 tabs + inline admin sections within employee tabs |
| **USERS_UPDATE authority** | Staff list write access | Controls whether inline detail panel allows editing |
| **isAnEmployee flag** | Address validation | Street, ZIP, City become mandatory for employee profiles |
| **Employee state** | Operational status | UNCONFIRMED users cannot be scheduled; ACTIVE users appear in availability grids; INACTIVE users are excluded from expert search |
| **requireTotp flag** | Login flow | When true, user must complete TOTP setup before next login |
| **Month locked status** | Availability editing | Locked months (in planning) disable the Expert Days grid for non-ADMIN users |
| **Qualification level** | Expert search results | Shown in search results table, used for filtering |
| **Skills** | Expert search filtering | Skills collection drives AND-logic client-side filtering of search results |
| **Exclusion criteria** | Expert search filtering | Exclusion criteria collection drives AND-logic exclusion of results |
| **Context (personal vs staff)** | Profile form behavior | Personal page: user edits own profile, no delete/onboarding. Staff page: admin edits any profile, full toolbar. |
| **Platform (personal vs admin)** | Password dialog variant | Personal page shows current+new+confirm. Admin page (not in scope) shows new+confirm only (resets for any user). |

---

## Wireframe Screenshots

### W1: Profile Form — Tab Overview

Shows the 8-tab layout: 4 employee-visible tabs (white) and 4 admin-only tabs (orange highlight). Save and Change Password buttons in the navbar. Form content renders in the tab content area below.

![Profile Form Tab Overview](./profile/profile-form-tab-overview.png)

### W1: Profile Form — Personal Data Tab (Employee View)

Left column: profile picture with upload and rotate. Right column: personal information fields (salutation, title, first name*, last name*, mobile, birthday, email*). Securebox data section with check button. Notification checkbox.

![Profile Form Personal Data](./profile/profile-form-personal-data.png)

### W1: Profile Form — Business Data Tab (Admin View)

Two-column layout. Left: dates & status with admin-only section (GKTO, Konto, EFN, employee state, inactive dates, TOTP). Contractual relations and SIP accounts collections. Right: financial data (UID, IBAN), signature upload with create/upload buttons.

![Profile Form Business Data](./profile/profile-form-business-data.png)

### W2: Staff List

Full page view with toolbar (9 buttons: Add, Edit, Onboarding, Assignments, Password, Delete, Export, Expert Search, Invoice). A-Z quick filter bar with search input. 10-column grid: firstName, lastName, state, shift, appointment, therapy, lastReminder, 2FA, enabled. Row 1 shows selected state (blue highlight).

![Staff List](./profile/profile-staff-list.png)

### W3: Expert Search Dialog

Job autocomplete filter with active toggle. Skills and Exclusion Criteria insert-and-delete collections with chip display. Results table with name, skills (nested), exclusion criteria (nested), qualification level columns. Search and Cancel buttons.

![Expert Search](./profile/profile-expert-search.png)

### W4: Assignment Dialog

Year/Month filter (pre-filled with previous month), read-only user display name, export download icon. Appointment rows showing type, weekday, date, time, job code, location. Accept (green) and Reject (red) action buttons per row.

![Assignment Dialog](./profile/profile-assignment-dialog.png)

### W5: Password Change Dialog

Three password fields with show/hide eye toggles. Progress bar strength meter (10% danger to 100% success). Four validation rules with real-time icon toggling (exclamation = not met, checkmark = met). Rule 4 (bad credential) is server-only on submit.

![Password Dialog](./profile/profile-password-dialog.png)

### W6: Signature Pad Dialog

HTML5 Canvas area with decorative signing line and "Sign above" text. Sign button (submits base64 to server) and Clear button (resets canvas). Dimension hint for PNG/JPG format.

![Signature Pad](./profile/profile-signature-pad.png)

### W7: Expert Availability — Month Grid

Year/month selectors. 31 rows x 6 slot columns (3 shift + 2 appointment + 1 treatment). Tri-state cell icons: circle (null), green check (available), red X (unavailable). Weekend rows highlighted yellow. Summary counters for weekday/weekend.

![Expert Availability Month](./profile/profile-expert-availability-month.png)

### W7: Expert Availability — Week Grid

Week type selector (TREATMENT only). 24 rows (hours) x 7 day columns (Mon-Sun). Binary state cell icons: X (null/off), green check (available). Column headers are clickable for bulk equalize.

![Expert Availability Week](./profile/profile-expert-availability-week.png)

### W14: User Stats Dialog

Date picker input. Stats collection table with icon-labeled columns: department name, available (calendar icon), booked (briefcase icon), holiday (palm tree icon — note: holiday column has no data binding in legacy).

![User Stats](./dashboard/user-stats.png)
