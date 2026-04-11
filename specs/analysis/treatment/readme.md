---
title: 'Treatment'
---

# Treatment Domain — Analysis Documents

Core medical data: consultations, treatments, prescriptions, warnings, quality management, patient data.

## Documents

### consultation/
Analysis of the consultation module — the most complex domain feature with 7 consultation types and 100+ fields.

| File | Origin | Content |
|:---|:---|:---|
| `01-consultation-list.md` | `consultation/` (whole) | Consultation list view with grid, filters, status columns |
| `02-consultation-details-header.md` | `consultation/` (whole) | Consultation detail header: patient info, status, actions |
| `03-consultation-details-standard.md` | `consultation/` (whole) | Standard consultation form fields |
| `04-consultation-details-onboarding.md` | `consultation/` (whole) | Onboarding consultation variant |
| `05-consultation-details-incarceration.md` | `consultation/` (whole) | Incarceration consultation variant |
| `06-consultation-details-treatment-warning.md` | `consultation/` (whole) | Treatment warning fields |
| `07-consultation-view-review.md` | `consultation/` (whole) | View-only and review consultation modes |
| `08-consultation-details-js.md` | `consultation/` (whole) | JavaScript behavior analysis |
| `wireframes.md` | `consultation/` (whole) | Wireframe inventory for consultation screens |

### warning/
| File | Origin | Content |
|:---|:---|:---|
| `01-warning-management.md` | `warning/` (whole) | Treatment warning CRUD management |

### questionnaire/
| File | Origin | Content |
|:---|:---|:---|
| `01-questionnaire-list.md` | `questionnaire/` (whole) | QM questionnaire list view |
| `02-questionnaire-detail.md` | `questionnaire/` (whole) | QM questionnaire detail/editor |
| `wireframes.md` | `questionnaire/` (whole) | Wireframe inventory for questionnaire screens |

### treatment-core/
| File | Origin | Content |
|:---|:---|:---|
| `01-treatment-and-category.md` | `treatment/` (whole) | Treatment and treatment category CRUD |
| `02-treatment-plan.md` | `treatment/` (whole) | Treatment plan management |

### medication/
| File | Origin | Content |
|:---|:---|:---|
| `01-medication.md` | Split from `entity-cruds/*` | Medication entity CRUD |

### patient-data/
| File | Origin | Content |
|:---|:---|:---|
| `01-patient-data.md` | Split from `entity-cruds/*` | Patient data entity CRUD |

### appointment-patient/
| File | Origin | Content |
|:---|:---|:---|
| `02-appointment-details-patient.md` | Split from `appointment/appointment-details.md` | Patient data CRUD within appointments, file uploads/downloads |

### dashboard/
| File | Origin | Content |
|:---|:---|:---|
| `05-consultation-wizard.md` | `dash/` (whole) | Create new consultation wizard |
| `07-consultation-template.md` | `dash/` (whole) | Consultation template CRUD |
| `04-dialogs-treatment.md` | Split from `dash/dashboard-dialogs.md` | Treatment dialogs: endAppointment, summarize, incarceration check/retrieval |
| `wireframe-plan-treatment.md` | Split from `dash/wireframes.md` | Wireframe inventory for treatment dashboard dialogs |
