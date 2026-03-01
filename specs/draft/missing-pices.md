# Missing Pieces - Videoclinic Schema Integration

This document merges the requirements from `all-together.md` with the existing MongoDB schema described in `videoclinic.dbml`, identifying missing parts and proposing a unified structure.

## 1. Experts (Experten)
**Mapping:** `user` (DBML) -> Expert

### Missing Fields / Extensions:
- **Academic Title:** `academicTitle` (String)
- **Salutation:** `salutation` (String)
- **Secondary Email:** `secondaryEmail` (String)
- **Forwarding Enabled:** `forwardingEnabled` (Boolean)
- **On-Call Phone:** `onCallPhone` (String)
- **Signature Image:** `signatureImage` (File/Blob reference)
- **SecureBox Credentials:** `secureBoxUsername`, `secureBoxPassword`
- **Career Dates:** `practicingSince`, `videoclinicSince`, `videoclinicUntil`
- **Accounting/ID:** `debitNumber` (GKTO), `debitAccount` (GKTK), `efn` (Unified Education Number)
- **Contract Info:** `avvAcceptedDate`, `contractDate`, `contractNumber`
- **Tax Info:** `vatNumber`, `taxId`
- **Account Status Details:** Start/End dates for "Sick Leave".
- **Qualification Level:** `qualificationLevel` (Enum: Onboarding, Beginner, Amateur, Professional)
- **Addiction Medicine Experience:** `addictionMedicineExperience` (Enum: Very High to Very Low)
- **Focus & Dedication:** 
  - `focusOnCall` (Enum: None, Low, Medium, High)
  - `focusClinic` (Enum: None, Low, Medium, High)
  - `focusTherapy` (Enum: None, Low, Medium, High)
- **Subscribed Products:** A list of items with quantity, price, dates, and billing options (Mail/Post).
- **Billing Addresses:** Support for multiple types (Residence, Work, Practice, etc.) - only one per type.

## 2. Services (Dienstleistungen)
**Mapping:** `jobId` (DBML) -> Service

### Missing Fields / Extensions:
- **Multi-lingual Titles:** Internal name, Expert name, Invoice name.
- **Display Index:** `sortOrder` (Integer)
- **Consultation Type Selection:** 
  - List of allowed types (external, Konsiliarbericht, Normal, Complete Entry, Short Entry, Detention Fitness).
  - `defaultConsultationType` (Reference to one of the above).
- **Further Treatment Presets:** `defaultFurtherTreatment` (Enum: Admission, Re-presentation, Follow-up, Referral).
- **Skill Requirements:** 
  - `requiredSkills` (List of Skill IDs).
  - `skillRequirementLogic` (Enum: ALL_REQUIRED, ANY_REQUIRED).

## 3. Skills (Fähigkeiten)
**Mapping:** `skill` (DBML) -> Skill

### Identified Gaps:
- The DBML already has `code`, `description`, `type`, `active`, `certified`.
- Requirement adds a specific "Acquired Date" and "Certificate Document" per expert-skill relation.

## 4. Exclusion Criteria (Ausschlusskriterien)
**Mapping:** **NEW ENTITY** (Missing in DBML)

### Definition:
- `name` (String)
- `description` (String)
- `weight` (Number)
- `active` (Boolean)
- **Expert Relation:** List of exclusion criteria assigned to an expert.

## 5. Scheduling & Availability (Sprechstundenplan & Kalender)
**Mapping:** `appointmentPlan` / `expertDays` / `expertWeek`

### Refinements:
- **Schedule (Sprechstundenplan):** Needs to support the specific recurrence rules:
  - Weekly
  - First day of month
  - Every X-th day of month
  - Specific day of month
  - Last day of month
- **Expert Availability:**
  - Tri-state: `Unknown`, `Yes`, `No`.
  - Shift-based division:
    - **On-Call (Bereitschaft):** Morning (08-13), Afternoon (13-18), Night (18-08).
    - **Clinic (Sprechstunde):** Morning, Afternoon (No Night).
    - **Therapy:** No shifts (08-18).
- **Consilium (Konsil):** Explicitly mentioned as a billing modality (Expert + Time).
- **Service Billing Modalities:** Patienten (Bereitschaft), Zeit (Sprechstunde, Therapie), Experten+Zeit (Konsil).
- **Specialties (Fachrichtung):** Allgemeinmedizin, Psychiatrie, Dermatologie, Substitution, Psychotherapie, Physiotherapie.

## 6. Proposed Prisma Model Extensions (Conceptual)

```prisma
// Example of how the missing pieces would look in Prisma

model ExpertProfile {
  id                String   @id @default(cuid())
  userId            String   @unique
  user              User     @relation(fields: [userId], references: [id])
  
  academicTitle     String?
  salutation        String?
  onCallPhone       String?
  
  qualificationLevel QualificationLevel @default(ONBOARDING)
  addictionExperience ExperienceLevel    @default(LOW)
  
  // Focus & Dedication
  focusOnCall       DedicationLevel    @default(NONE)
  focusClinic       DedicationLevel    @default(NONE)
  focusTherapy      DedicationLevel    @default(NONE)

  skills            ExpertSkill[]
  exclusions        ExclusionCriterion[]
  subscriptions     Subscription[]
  addresses         BillingAddress[]
}

model Service {
  id                String   @id @default(cuid())
  titleInternal     String
  titleExpert       String
  titleInvoice      String
  shortName         String
  color             String
  sortOrder         Int
  
  billingMode       BillingMode
  department        String
  
  allowedConsultationTypes ConsultationType[]
  defaultConsultationType  ConsultationType
  
  furtherTreatmentPreset   FurtherTreatmentType
  
  requiredSkills    Skill[]
  skillLogic        RequirementLogic @default(ALL)
}

model ExclusionCriterion {
  id          String   @id @default(cuid())
  name        String
  description String
  weight      Int
  isActive    Boolean  @default(true)
  experts     ExpertProfile[]
}

enum QualificationLevel { ONBOARDING; BEGINNER; AMATEUR; PROFESSIONAL }
enum ExperienceLevel    { VERY_HIGH; HIGH; MEDIUM; LOW; VERY_LOW }
enum DedicationLevel    { NONE; LOW; MEDIUM; HIGH }
enum RequirementLogic   { ALL; ANY }
// ... other enums
```
