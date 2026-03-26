task_id: ses_2e9848b7fffe7atWhyQdGurD1o (for resuming to continue this task if needed)

<task_result>
Many onboarding fields are not explicitly listed in the MongoDB mapping sub-entity (it shows a sample subset). This is expected — the mapping doc uses representative fields. Now I have everything needed.

Here is the complete Part 2 data dictionary content:

---

## 14. Full Onboarding Form (type=ONBOARDING)

Source: [consultation/04-consultation-details-onboarding.md](consultation/04-consultation-details-onboarding.md)

The Full Onboarding form is the comprehensive medical intake rendered when `consultation.type === 'ONBOARDING'`. It covers family history, physical examination, organ systems review, infectious diseases, substance use, and suitability evaluation.

### 14a. Family History & Previous Physician

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Family history | Familieanamnese | `data.standardHelper.anamnesisFamily` | `consultationData.standard.anamnesis[type=FAMILY].documentation` | [treatment.md#sub-entity-consultationonboarding](../mongodb-mapping/treatment.md#sub-entity-consultationonboarding) | String | Textarea | — | Yes | No | Workflow-only helper; persisted as `standard.anamnesis[]` entry with `type=FAMILY`. CSS class `anamnesisLink`, `data-linktype="FAMILY"` |
| Name of last attending physician (hospital) | Name zuletzt behandelnder Arzt (Krankenhaus) | `data.onboarding.previousPhysician` | `consultationData.onboarding.previousPhysician` | [treatment.md#sub-entity-consultationonboarding](../mongodb-mapping/treatment.md#sub-entity-consultationonboarding) | String | Text Input | — | Yes | No | Placeholder: `label.name` |
| Pretreatment notes | Notizen | `data.standardHelper.anamnesisPretreatment` | `consultationData.standard.anamnesis[type=PRETREATMENT].documentation` | [treatment.md#sub-entity-consultationonboarding](../mongodb-mapping/treatment.md#sub-entity-consultationonboarding) | String | Textarea | — | No | No | Workflow-only helper; persisted as `standard.anamnesis[]` entry with `type=PRETREATMENT`. CSS class `anamnesisLink`, `data-linktype="PRETREATMENT"` |

### 14b. Physical Findings

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Body height | Koerperlicher Befund | `data.body.bodyHeight` | `consultationData.body.bodyHeight` | [treatment.md#sub-entity-consultationbody](../mongodb-mapping/treatment.md#sub-entity-consultationbody) | Number | Number Input | — | Yes | No | Input mask `###,9`, unit suffix `cm`, icon `fa-ruler-vertical` |
| Body weight | Koerperlicher Befund | `data.body.bodyWeight` | `consultationData.body.bodyWeight` | [treatment.md#sub-entity-consultationbody](../mongodb-mapping/treatment.md#sub-entity-consultationbody) | Number | Number Input | — | Yes | No | Input mask `009,9`, unit suffix `kg`, icon `fa-weight` |
| RR (blood pressure) | RR. | `data.body.rr` | `consultationData.body.rr` | [treatment.md#sub-entity-consultationbody](../mongodb-mapping/treatment.md#sub-entity-consultationbody) | String | Text Input | — | Yes | No | Unit suffix `mmHg` |
| Pulse | Puls | `data.body.pulse` | `consultationData.body.pulse` | [treatment.md#sub-entity-consultationbody](../mongodb-mapping/treatment.md#sub-entity-consultationbody) | String | Text Input | — | Yes | No | Unit suffix `bpm` |

### 14c. General & Weight State

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| General condition | Allgemeinzustand | `data.onboarding.generalState` | `consultationData.onboarding.generalState` | [treatment.md#sub-entity-consultationonboarding](../mongodb-mapping/treatment.md#sub-entity-consultationonboarding) | Enum (BodyState) | Select | `OVER` (schlecht/obese), `REDUCED` (reduziert/reduced), `WELL` (gut/well) | Yes | No | Legacy orphan value `MEDIUM` exists in DB (266 records) |
| Nutritional status | Ernaehrungszustand | `data.onboarding.weightState` | `consultationData.onboarding.weightState` | [treatment.md#sub-entity-consultationonboarding](../mongodb-mapping/treatment.md#sub-entity-consultationonboarding) | Enum (WeightState) | Select | `WELL` (gut/well), `REDUCED` (reduziert/reduced), `OBESE` (adipoes/obese), `CACHECTIC` (kachektisch/cachectic) | Yes | No | Legacy orphan values `MEDIUM` (335), `OVER` (223) exist in DB |
| Notes | Notizen | `data.onboarding.stateInfo` | `consultationData.onboarding.stateInfo` | [treatment.md#sub-entity-consultationonboarding](../mongodb-mapping/treatment.md#sub-entity-consultationonboarding) | String | Textarea | — | No | No | — |

### 14d. Preexisting Conditions

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Information on previous illnesses | Angaben ueber fruehere Erkrankungen | `data.onboarding.preexistingState` | `consultationData.onboarding.preexistingState` | [treatment.md#sub-entity-consultationonboarding](../mongodb-mapping/treatment.md#sub-entity-consultationonboarding) | Enum (PreexistingState) | Select | `NO_ANSWER` (Keine Angaben), `HEALTHY` (Angeblich nicht krank gewesen), `OTHER` (Angeblich erkrankt an) | Yes | No | ID `preexistingState`; controls conditional visibility of `preexistingCondition` |
| Allegedly suffering from | Angeblich erkrankt an | `data.onboarding.preexistingCondition` | `consultationData.onboarding.preexistingCondition` | [treatment.md#sub-entity-consultationonboarding](../mongodb-mapping/treatment.md#sub-entity-consultationonboarding) | String | Textarea | — | No | No | **Conditional**: visible only when `preexistingState === 'OTHER'` |
| Allergies | Allergien | `data.onboarding.allergies` | `consultationData.onboarding.allergies` | [treatment.md#sub-entity-consultationonboarding](../mongodb-mapping/treatment.md#sub-entity-consultationonboarding) | Boolean | Boolean Select | `–` / Yes / No | Yes | No | Tri-state: null, true, false |

### 14e. Current Health State

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Information on the current state of health | Angaben ueber den gegenwaertigen Gesundheitszustand | `data.onboarding.currentState` | `consultationData.onboarding.currentState` | [treatment.md#sub-entity-consultationonboarding](../mongodb-mapping/treatment.md#sub-entity-consultationonboarding) | Enum (ConditionState) | Select | `NO_ANSWER` (Keine Angaben), `HEALTHY` (Gesund), `OTHER` (Angeblich erkrankt an) | Yes | No | ID `currentState`; controls conditional visibility of `anamnesisOwn` |
| Current condition details | Angeblich erkrankt an | `data.standardHelper.anamnesisOwn` | `consultationData.standard.anamnesis[type=OWN].documentation` | [treatment.md#sub-entity-consultationonboarding](../mongodb-mapping/treatment.md#sub-entity-consultationonboarding) | String | Textarea | — | No | No | **Conditional**: visible only when `currentState === 'OTHER'`. Workflow-only helper; persisted as `standard.anamnesis[]` entry with `type=OWN`. CSS class `anamnesisLink` |

### 14f. Infectious Diseases

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Hepatitis | Hepatitis | `data.onboarding.hepatitis` | `consultationData.onboarding.hepatitis` | [treatment.md#sub-entity-consultationonboarding](../mongodb-mapping/treatment.md#sub-entity-consultationonboarding) | Enum (DiseaseState) | Select | `–` (empty), `UNKNOWN` (nicht bekannt/unknown), `SURE` (gesichert/sure), `EXCLUDED` (ausgeschlossen/excluded) | Yes | No | — |
| Pulmonary tuberculosis | Lungentuberkulose | `data.onboarding.lungTuberculosis` | `consultationData.onboarding.lungTuberculosis` | [treatment.md#sub-entity-consultationonboarding](../mongodb-mapping/treatment.md#sub-entity-consultationonboarding) | Enum (DiseaseState) | Select | `–` (empty), `UNKNOWN`, `SURE`, `EXCLUDED` | Yes | No | — |
| Venereal diseases | Geschlechtskrankheiten | `data.onboarding.std` | `consultationData.onboarding.std` | [treatment.md#sub-entity-consultationonboarding](../mongodb-mapping/treatment.md#sub-entity-consultationonboarding) | Enum (DiseaseState) | Select | `–` (empty), `UNKNOWN`, `SURE`, `EXCLUDED` | Yes | No | — |
| HIV | HIV | `data.onboarding.hiv` | `consultationData.onboarding.hiv` | [treatment.md#sub-entity-consultationonboarding](../mongodb-mapping/treatment.md#sub-entity-consultationonboarding) | Enum (DiseaseState) | Select | `–` (empty), `UNKNOWN`, `SURE`, `EXCLUDED` | Yes | No | — |
| Notes | Notizen | `data.onboarding.transmittalInfo` | `consultationData.onboarding.transmittalInfo` | [treatment.md#sub-entity-consultationonboarding](../mongodb-mapping/treatment.md#sub-entity-consultationonboarding) | String | Textarea | — | No | No | Infectious diseases notes |

### 14g. Skin & Head/Neck

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Skin | Haut | `data.onboarding.skinCondition` | `consultationData.onboarding.skinCondition` | [treatment.md#sub-entity-consultationonboarding](../mongodb-mapping/treatment.md#sub-entity-consultationonboarding) | String | Textarea | — | Yes | No | — |
| Sensory organs | Sinnesorgane | `data.onboarding.senseCondition` | `consultationData.onboarding.senseCondition` | [treatment.md#sub-entity-consultationonboarding](../mongodb-mapping/treatment.md#sub-entity-consultationonboarding) | String | Text Input | — | Yes | No | Under "Head/Neck" section |
| Eyes | Augen | `data.onboarding.eyeCondition` | `consultationData.onboarding.eyeCondition` | [treatment.md#sub-entity-consultationonboarding](../mongodb-mapping/treatment.md#sub-entity-consultationonboarding) | String | Text Input | — | Yes | No | — |
| Ears | Ohren | `data.onboarding.earCondition` | `consultationData.onboarding.earCondition` | [treatment.md#sub-entity-consultationonboarding](../mongodb-mapping/treatment.md#sub-entity-consultationonboarding) | String | Text Input | — | Yes | No | — |

### 14h. Substance Use

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Alcohol consumption | Alkoholkonsum | `data.onboarding.alcoholUsage` | `consultationData.onboarding.alcoholUsage` | [treatment.md#sub-entity-consultationonboarding](../mongodb-mapping/treatment.md#sub-entity-consultationonboarding) | String | Textarea | — | Yes | No | — |
| Tobacco consumption | Tabakkonsum | `data.onboarding.tabaccoUsage` | `consultationData.onboarding.tabaccoUsage` | [treatment.md#sub-entity-consultationonboarding](../mongodb-mapping/treatment.md#sub-entity-consultationonboarding) | String | Textarea | — | Yes | No | Note: legacy field name has typo `tabacco` (preserved from source) |
| Drugs | Drogen | `data.onboarding.drugUsage` | `consultationData.onboarding.drugUsage` | [treatment.md#sub-entity-consultationonboarding](../mongodb-mapping/treatment.md#sub-entity-consultationonboarding) | String | Textarea | — | Yes | No | — |

### 14i. Medications

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Medication (medical history) | Medikamente (Anamnese) | `data.standard.medicationAnamnesis.documentation` | `consultationData.standard.medicationAnamnesis.documentation` | [treatment.md#sub-entity-consultationonboarding](../mongodb-mapping/treatment.md#sub-entity-consultationonboarding) | String | Textarea | — | Yes | No | Shared field under `standard` namespace; used by both onboarding and standard consultation types. ID `standardMedicationAnamnesis` |
| Medication prescription | Medikation Verordnung | `data.onboarding.additionalPrescription` | `consultationData.onboarding.additionalPrescription` | [treatment.md#sub-entity-consultationonboarding](../mongodb-mapping/treatment.md#sub-entity-consultationonboarding) | Boolean | Boolean Select | `–` / Yes / No | Yes | No | Tri-state: null, true, false |

### 14j. Organ System Review

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Heart | Herz | `data.onboarding.heartCondition` | `consultationData.onboarding.heartCondition` | [treatment.md#sub-entity-consultationonboarding](../mongodb-mapping/treatment.md#sub-entity-consultationonboarding) | String | Textarea | — | Yes | No | — |
| Lungs | Lunge | `data.onboarding.lungCondition` | `consultationData.onboarding.lungCondition` | [treatment.md#sub-entity-consultationonboarding](../mongodb-mapping/treatment.md#sub-entity-consultationonboarding) | String | Textarea | — | Yes | No | — |
| Abdomen | Abdomen | `data.onboarding.abdomenCondition` | `consultationData.onboarding.abdomenCondition` | [treatment.md#sub-entity-consultationonboarding](../mongodb-mapping/treatment.md#sub-entity-consultationonboarding) | String | Textarea | — | Yes | No | — |
| Kidneys and reproductive organs | Nieren und Geschlechtsorgane | `data.onboarding.kidneyCondition` | `consultationData.onboarding.kidneyCondition` | [treatment.md#sub-entity-consultationonboarding](../mongodb-mapping/treatment.md#sub-entity-consultationonboarding) | String | Textarea | — | Yes | No | — |
| Extremities | Extremitaeten | `data.onboarding.extremitiesCondition` | `consultationData.onboarding.extremitiesCondition` | [treatment.md#sub-entity-consultationonboarding](../mongodb-mapping/treatment.md#sub-entity-consultationonboarding) | String | Textarea | — | Yes | No | — |
| Central nervous system | Zentralnervensystem | `data.onboarding.centralNerveSystemCondition` | `consultationData.onboarding.centralNerveSystemCondition` | [treatment.md#sub-entity-consultationonboarding](../mongodb-mapping/treatment.md#sub-entity-consultationonboarding) | String | Textarea | — | Yes | No | — |
| Psyche | Psyche | `data.onboarding.psychologicalCondition` | `consultationData.onboarding.psychologicalCondition` | [treatment.md#sub-entity-consultationonboarding](../mongodb-mapping/treatment.md#sub-entity-consultationonboarding) | String | Textarea | — | Yes | No | — |
| Further findings | weitere Befunde | `data.onboarding.otherConditions` | `consultationData.onboarding.otherConditions` | [treatment.md#sub-entity-consultationonboarding](../mongodb-mapping/treatment.md#sub-entity-consultationonboarding) | String | Textarea | — | Yes | No | — |

### 14k. Evaluation

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Suitable for implementation | Vollzugstauglich | `data.onboarding.incarcerationSuitability` | `consultationData.onboarding.incarcerationSuitability` | [treatment.md#sub-entity-consultationonboarding](../mongodb-mapping/treatment.md#sub-entity-consultationonboarding) | Boolean | Boolean Select | `–` / Yes / No | Yes | No | — |
| Concerns about individual accommodation | Bedenken gegen Einzelunterbringung | `data.onboarding.singleRoomSuitability` | `consultationData.onboarding.singleRoomSuitability` | [treatment.md#sub-entity-consultationonboarding](../mongodb-mapping/treatment.md#sub-entity-consultationonboarding) | Boolean | Boolean Select | `–` / Yes / No | Yes | No | — |
| Able to work | Arbeitsfaehig | `data.onboarding.workSuitability` | `consultationData.onboarding.workSuitability` | [treatment.md#sub-entity-consultationonboarding](../mongodb-mapping/treatment.md#sub-entity-consultationonboarding) | Enum (Suitability) | Select | `UNKNOWN` (unbekannt), `YES` (ja), `PARTLY` (eingeschraenkt), `NO` (nein) | Yes | No | ID `workSuitability` |
| Able to work outdoors | Aussenarbeitsfaehig | `data.onboarding.outDoorWorkSuitability` | `consultationData.onboarding.outDoorWorkSuitability` | [treatment.md#sub-entity-consultationonboarding](../mongodb-mapping/treatment.md#sub-entity-consultationonboarding) | Boolean | Boolean Select | `–` / Yes / No | Yes | No | ID `outDoorWorkSuitability` |
| Suitable for sports | Sporttauglich | `data.onboarding.sportSuitability` | `consultationData.onboarding.sportSuitability` | [treatment.md#sub-entity-consultationonboarding](../mongodb-mapping/treatment.md#sub-entity-consultationonboarding) | Enum (Suitability) | Select | `UNKNOWN`, `YES`, `PARTLY`, `NO` | Yes | No | ID `sportSuitability` |
| Requires medical treatment | Aerztlicher Behandlung beduerftig | `data.onboarding.requireTreatment` | `consultationData.onboarding.requireTreatment` | [treatment.md#sub-entity-consultationonboarding](../mongodb-mapping/treatment.md#sub-entity-consultationonboarding) | Boolean | Boolean Select | `–` / Yes / No | Yes | No | — |
| Treatment information | Informationen | `data.onboarding.treatmentInfo` | `consultationData.onboarding.treatmentInfo` | [treatment.md#sub-entity-consultationonboarding](../mongodb-mapping/treatment.md#sub-entity-consultationonboarding) | String | Textarea | — | No | No | — |
| Signs of suicidal tendencies | Anzeichen fuer Suizidgefaehrdung | `data.onboarding.suicidal` | `consultationData.onboarding.suicidal` | [treatment.md#sub-entity-consultationonboarding](../mongodb-mapping/treatment.md#sub-entity-consultationonboarding) | Boolean | Boolean Select | `–` / Yes / No | Yes | No | — |
| Special measures required due to danger to others | Besondere Massnahmen wegen Gefahr fuer andere erforderlich | `data.onboarding.dangerous` | `consultationData.onboarding.dangerous` | [treatment.md#sub-entity-consultationonboarding](../mongodb-mapping/treatment.md#sub-entity-consultationonboarding) | Boolean | Boolean Select | `–` / Yes / No | Yes | No | — |
| *Note | *Bemerkung | `data.onboarding.suitabilityInfo` | `consultationData.onboarding.suitabilityInfo` | [treatment.md#sub-entity-consultationonboarding](../mongodb-mapping/treatment.md#sub-entity-consultationonboarding) | String | Textarea | — | No | No | Full-width; preceded by `*` asterisk marker. ID `suitabilityInfo` |

---

## 15. Short Onboarding Form (type=ONBOARDING_SHORT)

Source: [consultation/04-consultation-details-onboarding.md](consultation/04-consultation-details-onboarding.md)

The Short Onboarding is a **strict subset** of the Full Onboarding form. It retains only the state assessment selects (General & Weight State) and the entire Evaluation section. Sections 14a–14i and 14j (Family History, Physical Findings, Preexisting Conditions, Current Health State, Infectious Diseases, Skin & Head/Neck, Substance Use, Medications, Organ System Review) are **omitted**.

### 15a. General & Weight State (Short)

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| General condition | Allgemeinzustand | `data.onboarding.generalState` | `consultationData.onboarding.generalState` | [treatment.md#sub-entity-consultationonboarding](../mongodb-mapping/treatment.md#sub-entity-consultationonboarding) | Enum (BodyState) | Select | `OVER`, `REDUCED`, `WELL` | Yes | No | Same field as §14c |
| Nutritional status | Ernaehrungszustand | `data.onboarding.weightState` | `consultationData.onboarding.weightState` | [treatment.md#sub-entity-consultationonboarding](../mongodb-mapping/treatment.md#sub-entity-consultationonboarding) | Enum (WeightState) | Select | `WELL`, `REDUCED`, `OBESE`, `CACHECTIC` | Yes | No | Same field as §14c |

### 15b. Evaluation (Short)

All fields identical to §14k. Section heading rendered as `<label>` (not `<h6>` as in Full form). Layout uses `col-md-4` + `col-md-6` (vs `col-md-5` + `col-md-7` + `col-md-12` in Full form).

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Suitable for implementation | Vollzugstauglich | `data.onboarding.incarcerationSuitability` | `consultationData.onboarding.incarcerationSuitability` | [treatment.md#sub-entity-consultationonboarding](../mongodb-mapping/treatment.md#sub-entity-consultationonboarding) | Boolean | Boolean Select | `–` / Yes / No | Yes | No | — |
| Concerns about individual accommodation | Bedenken gegen Einzelunterbringung | `data.onboarding.singleRoomSuitability` | `consultationData.onboarding.singleRoomSuitability` | [treatment.md#sub-entity-consultationonboarding](../mongodb-mapping/treatment.md#sub-entity-consultationonboarding) | Boolean | Boolean Select | `–` / Yes / No | Yes | No | — |
| Able to work | Arbeitsfaehig | `data.onboarding.workSuitability` | `consultationData.onboarding.workSuitability` | [treatment.md#sub-entity-consultationonboarding](../mongodb-mapping/treatment.md#sub-entity-consultationonboarding) | Enum (Suitability) | Select | `UNKNOWN`, `YES`, `PARTLY`, `NO` | Yes | No | — |
| Able to work outdoors | Aussenarbeitsfaehig | `data.onboarding.outDoorWorkSuitability` | `consultationData.onboarding.outDoorWorkSuitability` | [treatment.md#sub-entity-consultationonboarding](../mongodb-mapping/treatment.md#sub-entity-consultationonboarding) | Boolean | Boolean Select | `–` / Yes / No | Yes | No | — |
| Suitable for sports | Sporttauglich | `data.onboarding.sportSuitability` | `consultationData.onboarding.sportSuitability` | [treatment.md#sub-entity-consultationonboarding](../mongodb-mapping/treatment.md#sub-entity-consultationonboarding) | Enum (Suitability) | Select | `UNKNOWN`, `YES`, `PARTLY`, `NO` | Yes | No | — |
| Requires medical treatment | Aerztlicher Behandlung beduerftig | `data.onboarding.requireTreatment` | `consultationData.onboarding.requireTreatment` | [treatment.md#sub-entity-consultationonboarding](../mongodb-mapping/treatment.md#sub-entity-consultationonboarding) | Boolean | Boolean Select | `–` / Yes / No | Yes | No | — |
| Treatment information | Informationen | `data.onboarding.treatmentInfo` | `consultationData.onboarding.treatmentInfo` | [treatment.md#sub-entity-consultationonboarding](../mongodb-mapping/treatment.md#sub-entity-consultationonboarding) | String | Textarea | — | No | No | — |
| Signs of suicidal tendencies | Anzeichen fuer Suizidgefaehrdung | `data.onboarding.suicidal` | `consultationData.onboarding.suicidal` | [treatment.md#sub-entity-consultationonboarding](../mongodb-mapping/treatment.md#sub-entity-consultationonboarding) | Boolean | Boolean Select | `–` / Yes / No | Yes | No | — |
| Special measures required due to danger to others | Besondere Massnahmen wegen Gefahr fuer andere erforderlich | `data.onboarding.dangerous` | `consultationData.onboarding.dangerous` | [treatment.md#sub-entity-consultationonboarding](../mongodb-mapping/treatment.md#sub-entity-consultationonboarding) | Boolean | Boolean Select | `–` / Yes / No | Yes | No | — |
| *Note | *Bemerkung | `data.onboarding.suitabilityInfo` | `consultationData.onboarding.suitabilityInfo` | [treatment.md#sub-entity-consultationonboarding](../mongodb-mapping/treatment.md#sub-entity-consultationonboarding) | String | Textarea | — | No | No | No asterisk `*` marker in short form (unlike full form) |

---

## 16. Incarceration Form (type=INCARCERATION)

Source: [consultation/05-consultation-details-incarceration.md](consultation/05-consultation-details-incarceration.md)

The Incarceration form is rendered when `consultation.type === 'INCARCERATION'`. It covers custody suitability evaluation including substance consumption, general examination, intoxication staging, vitals, and body check. Total: 51 form elements across 6 blocks.

### 16a. Incarceration Type

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Type | Typ | `data.incarceration.type` | `consultationData.incarceration.type` | [treatment.md#sub-entity-consultationincarceration](../mongodb-mapping/treatment.md#sub-entity-consultationincarceration) | Enum (IncarcerationType) | Select | `INCARCERATION` (Gewahrsamfahigkeit/Custodial capacity), `LIABILITY` (Haftfahigkeit/Adhesion) | Yes | No | Siren icon `siren-on` |

### 16b. Examination Result

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Hearing-capable | Anhorungsfahig | `data.incarceration.examinationCapability` | `consultationData.incarceration.examinationCapability` | [treatment.md#sub-entity-consultationincarceration](../mongodb-mapping/treatment.md#sub-entity-consultationincarceration) | Boolean | Boolean Select | `–` / Yes / No | No | No | Siren icon `siren-off` |
| Custodial capacity | Gewahrsamfahig | `data.incarceration.incarcerationCapability` | `consultationData.incarceration.incarcerationCapability` | [treatment.md#sub-entity-consultationincarceration](../mongodb-mapping/treatment.md#sub-entity-consultationincarceration) | Boolean | Boolean Select | `–` / Yes / No | Yes | No | Siren icon `siren-on` |
| Custody conditions description | Gewahrsamfahig unter Einhaltung folgender Massgaben | `data.incarceration.incarcerationCapabilityComment` | `consultationData.incarceration.incarcerationCapabilityComment` | [treatment.md#sub-entity-consultationincarceration](../mongodb-mapping/treatment.md#sub-entity-consultationincarceration) | String | Textarea | — | No | No | `data-linktype="OWN"`, siren icon `siren-off` |

### 16c. Control Interval

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Control interval | Kontroll Intervall | `data.incarceration.checkupRequirement` | `consultationData.incarceration.checkupRequirement` | [treatment.md#sub-entity-consultationincarceration](../mongodb-mapping/treatment.md#sub-entity-consultationincarceration) | Enum (CheckupRequirement) | Select | `HALF_HOUR` (2x pro Stunde), `HOURLY` (1x pro Stunde), `TWO_HOUR` (1x in 2 Stunden) | No | No | Default: `HOURLY`. Siren `siren-off` |
| Hours without deterioration | nach Std Aufenthalt ohne Verschlechterung | `data.incarceration.healthImprovementTime` | `consultationData.incarceration.healthImprovementTime` | [treatment.md#sub-entity-consultationincarceration](../mongodb-mapping/treatment.md#sub-entity-consultationincarceration) | Number | Number Input | — | No | No | maxlength=3; siren `siren-off` |
| Control(s) per hour | Kontrolle(n) pro Stunde | `data.incarceration.improvementControlInterval` | `consultationData.incarceration.improvementControlInterval` | [treatment.md#sub-entity-consultationincarceration](../mongodb-mapping/treatment.md#sub-entity-consultationincarceration) | Number | Number Input | — | No | No | Siren `siren-off` |

### 16d. Other Requirements

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Special food | Spezielle Kost | `data.incarceration.specialDiataryRequirement` | `consultationData.incarceration.specialDiataryRequirement` | [treatment.md#sub-entity-consultationincarceration](../mongodb-mapping/treatment.md#sub-entity-consultationincarceration) | String | Text Input | — | No | No | Siren `siren-off` |
| Video/audio control required | Kontrolle Video/Audio verlangt | `data.incarceration.requireVideo` | `consultationData.incarceration.requireVideo` | [treatment.md#sub-entity-consultationincarceration](../mongodb-mapping/treatment.md#sub-entity-consultationincarceration) | Boolean | Boolean Select | Yes / No | No | No | Default: `true` (no blank option). Siren `siren-off` |
| Other requirements | sonstige Auflagen | `data.incarceration.otherRequirements` | `consultationData.incarceration.otherRequirements` | [treatment.md#sub-entity-consultationincarceration](../mongodb-mapping/treatment.md#sub-entity-consultationincarceration) | String | Textarea | — | No | No | `data-linktype="OWN"`, siren `siren-off` |

### 16e. Re-Introduction

> **Note**: This block is present in the legacy DOM but marked as "Do not delete — Only currently not used — saved for later use." Consider implementing behind a feature flag.

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Not custodial | Nicht gewahrsamfahig | `data.incarceration.notIncarcerationCapability` | `consultationData.incarceration.notIncarcerationCapability` | [treatment.md#sub-entity-consultationincarceration](../mongodb-mapping/treatment.md#sub-entity-consultationincarceration) | Boolean | Boolean Select | `–` / Yes / No | No | No | Siren `siren-off`. **Currently unused** |
| Referral / inpatient admission required | Einweisung / Stationare Aufnahme erforderlich | `data.incarceration.inpatientAdmissionRequired` | `consultationData.incarceration.inpatientAdmissionRequired` | [treatment.md#sub-entity-consultationincarceration](../mongodb-mapping/treatment.md#sub-entity-consultationincarceration) | Boolean | Boolean Select | `–` / Yes / No | No | No | **Currently unused** |
| Referral / Inpatient admission on site | Einweisung / Stationare Aufnahme am Ort | `data.incarceration.inpatientPlace` | `consultationData.incarceration.inpatientPlace` | [treatment.md#sub-entity-consultationincarceration](../mongodb-mapping/treatment.md#sub-entity-consultationincarceration) | String | Textarea | — | No | No | `data-linktype="OWN"`, siren `siren-off`. **Currently unused** |

### 16f. Doctor Examination — Consumption

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Alcohol consumption | Alkoholkonsum | `data.incarceration.consumedAlcohol` | `consultationData.incarceration.consumedAlcohol` | [treatment.md#sub-entity-consultationincarceration](../mongodb-mapping/treatment.md#sub-entity-consultationincarceration) | Boolean | Boolean Select | `–` / Yes / No | No | No | Uses shared i18n key `OnboardingData.alcoholUsage` |
| Medication | Medikamente | `data.incarceration.consumedMedication` | `consultationData.incarceration.consumedMedication` | [treatment.md#sub-entity-consultationincarceration](../mongodb-mapping/treatment.md#sub-entity-consultationincarceration) | Boolean | Boolean Select | `–` / Yes / No | No | No | Siren `siren-off` |
| Other intoxicating substances | Einnahme folgender Medikamente (korrekte Anwendung) | `data.incarceration.consumedOtherIntoxicatingSubstances` | `consultationData.incarceration.consumedOtherIntoxicatingSubstances` | [treatment.md#sub-entity-consultationincarceration](../mongodb-mapping/treatment.md#sub-entity-consultationincarceration) | String | Textarea | — | No | No | `data-linktype="OWN"`, siren `siren-off` |
| Last date/time (date) | Zuletzt an Datum | `data.incarceration.dateConsumedLastTime` | `consultationData.incarceration.dateConsumedLastTime` | [treatment.md#sub-entity-consultationincarceration](../mongodb-mapping/treatment.md#sub-entity-consultationincarceration) | Date | Date Input | — | No | No | Placeholder "Datum" (hardcoded DE) |
| Last date/time (time) | Zuletzt um | `data.incarceration.timeConsumedLastTime` | `consultationData.incarceration.timeConsumedLastTime` | [treatment.md#sub-entity-consultationincarceration](../mongodb-mapping/treatment.md#sub-entity-consultationincarceration) | Time | Time Input | — | No | No | Placeholder "HH:MM", clockpicker widget |
| Quantity | Menge | `data.incarceration.consumedLastTimeAmount` | `consultationData.incarceration.consumedLastTimeAmount` | [treatment.md#sub-entity-consultationincarceration](../mongodb-mapping/treatment.md#sub-entity-consultationincarceration) | String | Text Input | — | No | No | — |

### 16g. Doctor Examination — General Condition

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| General condition conspicuous | Allgemeinzustand auffallig | `data.incarceration.generalConditionNoticeable` | `consultationData.incarceration.generalConditionNoticeable` | [treatment.md#sub-entity-consultationincarceration](../mongodb-mapping/treatment.md#sub-entity-consultationincarceration) | Boolean | Boolean Select | `–` / Yes / No | No | No | — |
| General condition | Allgemeinzustand | `data.onboarding.generalState` | `consultationData.onboarding.generalState` | [treatment.md#sub-entity-consultationonboarding](../mongodb-mapping/treatment.md#sub-entity-consultationonboarding) | Enum (BodyState) | Select | `OVER`, `REDUCED`, `WELL` | No | No | **Cross-model**: binds to `onboarding.*`, shared with onboarding data |
| Nutritional status | Ernaehrungszustand | `data.onboarding.weightState` | `consultationData.onboarding.weightState` | [treatment.md#sub-entity-consultationonboarding](../mongodb-mapping/treatment.md#sub-entity-consultationonboarding) | Enum (WeightState) | Select | `WELL`, `REDUCED`, `OBESE`, `CACHECTIC` | No | No | **Cross-model**: binds to `onboarding.*`, shared with onboarding data |
| Intoxication | Intox | `data.incarceration.intox` | `consultationData.incarceration.intox` | [treatment.md#sub-entity-consultationincarceration](../mongodb-mapping/treatment.md#sub-entity-consultationincarceration) | String | Text Input | — | No | No | — |
| Conspicuity of the pupils | Auffaligkeit der Pupillen | `data.incarceration.abnormalPupils` | `consultationData.incarceration.abnormalPupils` | [treatment.md#sub-entity-consultationincarceration](../mongodb-mapping/treatment.md#sub-entity-consultationincarceration) | Boolean | Boolean Select | `–` / Yes / No | No | No | — |
| Pupil description | Beschreibung der Pupillen (Weite, Differenz, Reaktion) | `data.incarceration.abnormalPupilsDescription` | `consultationData.incarceration.abnormalPupilsDescription` | [treatment.md#sub-entity-consultationincarceration](../mongodb-mapping/treatment.md#sub-entity-consultationincarceration) | String | Textarea | — | No | No | `data-linktype="OWN"` |

### 16h. Doctor Examination — Allergies & Addictions

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Known allergies/intolerances | Bekannte Allergien/Unvertraglichkeiten | `data.incarceration.knownAllergiesIntolerances` | `consultationData.incarceration.knownAllergiesIntolerances` | [treatment.md#sub-entity-consultationincarceration](../mongodb-mapping/treatment.md#sub-entity-consultationincarceration) | Boolean | Boolean Select | `–` / Yes / No | No | No | — |
| Known allergies description | Wenn Ja, welche bekannte Allergien? | `data.incarceration.knownAllergiesIntolerancesDescription` | `consultationData.incarceration.knownAllergiesIntolerancesDescription` | [treatment.md#sub-entity-consultationincarceration](../mongodb-mapping/treatment.md#sub-entity-consultationincarceration) | String | Textarea | — | No | No | `data-linktype="OWN"` |
| Known addiction | Bekannte Suchterkrankung | `data.incarceration.knownAddictionDisorder` | `consultationData.incarceration.knownAddictionDisorder` | [treatment.md#sub-entity-consultationincarceration](../mongodb-mapping/treatment.md#sub-entity-consultationincarceration) | Boolean | Boolean Select | `–` / Yes / No | No | No | — |
| Known addiction description | Wenn Ja, welche bekannte Suchterkrankung? | `data.incarceration.knownAddictionDisorderDescription` | `consultationData.incarceration.knownAddictionDisorderDescription` | [treatment.md#sub-entity-consultationincarceration](../mongodb-mapping/treatment.md#sub-entity-consultationincarceration) | String | Textarea | — | No | No | `data-linktype="OWN"` |

### 16i. Doctor Examination — Neurology

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Neurology assessment | Neurologie | `data.incarceration.nerologyDescription` | `consultationData.incarceration.nerologyDescription` | [treatment.md#sub-entity-consultationincarceration](../mongodb-mapping/treatment.md#sub-entity-consultationincarceration) | String | Textarea (rows=4) | — | No | No | `data-linktype="OWN"`. Full width. Legacy typo in field name: `nerology` (missing 'u'). Placeholder describes: Standing/Speech/Consciousness/Gait assessments |

### 16j. Intoxication Assessment

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Stage | Stadium | `data.incarceration.intoxication` | `consultationData.incarceration.intoxication` | [treatment.md#sub-entity-consultationincarceration](../mongodb-mapping/treatment.md#sub-entity-consultationincarceration) | Enum (IntoxicationStage) | Select | `NONE` (no significant intoxication), `STAGE_1` (Euphoria), `STAGE_2` (Excitation), `STAGE_3` (Confusion), `STAGE_4` (Stupor), `STAGE_5` (Coma) | No | No | Each option has tooltip with detailed `.desc` text |
| Stage Description | Stadium Beschreibung | `data.incarceration.intoxicationDescription` | `consultationData.incarceration.intoxicationDescription` | [treatment.md#sub-entity-consultationincarceration](../mongodb-mapping/treatment.md#sub-entity-consultationincarceration) | String | Text Input | — | No | No | — |
| Reflective behavior abnormal | Reflexverhalten auffallig | `data.incarceration.reflexBehaviorNoticeable` | `consultationData.incarceration.reflexBehaviorNoticeable` | [treatment.md#sub-entity-consultationincarceration](../mongodb-mapping/treatment.md#sub-entity-consultationincarceration) | Boolean | Boolean Select | `–` / Yes / No | No | No | — |
| Head/neck noticeable | Kopf/Hals auffallig | `data.incarceration.abnormalHeadNeck` | `consultationData.incarceration.abnormalHeadNeck` | [treatment.md#sub-entity-consultationincarceration](../mongodb-mapping/treatment.md#sub-entity-consultationincarceration) | Boolean | Boolean Select | `–` / Yes / No | No | No | — |
| Chest organs abnormal | Brustorgane (auskultatorisch/perkutorisch) auffallig | `data.incarceration.abnormalChestOrgans` | `consultationData.incarceration.abnormalChestOrgans` | [treatment.md#sub-entity-consultationincarceration](../mongodb-mapping/treatment.md#sub-entity-consultationincarceration) | Boolean | Boolean Select | `–` / Yes / No | No | No | — |
| Limbs/joints abnormal | Gliedmassen/Gelenke auffallig | `data.incarceration.abnormalLimbsJoints` | `consultationData.incarceration.abnormalLimbsJoints` | [treatment.md#sub-entity-consultationincarceration](../mongodb-mapping/treatment.md#sub-entity-consultationincarceration) | Boolean | Boolean Select | `–` / Yes / No | No | No | — |
| Heart (auscultatory) abnormal | Herz (auskultatorisch) auffallig | `data.incarceration.abnormalHeartAuscultatory` | `consultationData.incarceration.abnormalHeartAuscultatory` | [treatment.md#sub-entity-consultationincarceration](../mongodb-mapping/treatment.md#sub-entity-consultationincarceration) | Boolean | Boolean Select | `–` / Yes / No | No | No | — |
| Circulation abnormal | Kreislauf auffallig | `data.incarceration.abnormalCirculation` | `consultationData.incarceration.abnormalCirculation` | [treatment.md#sub-entity-consultationincarceration](../mongodb-mapping/treatment.md#sub-entity-consultationincarceration) | Boolean | Boolean Select | `–` / Yes / No | No | No | — |

### 16k. Vitals & Skin

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Pulse frequency | Pulsfrequenz | `data.incarceration.pulseFrequency` | `consultationData.incarceration.pulseFrequency` | [treatment.md#sub-entity-consultationincarceration](../mongodb-mapping/treatment.md#sub-entity-consultationincarceration) | String | Text Input | — | No | No | Suffix: `/ Min` (hardcoded) |
| Tachycardia | Tachykard | `data.incarceration.tachykard` | `consultationData.incarceration.tachykard` | [treatment.md#sub-entity-consultationincarceration](../mongodb-mapping/treatment.md#sub-entity-consultationincarceration) | Boolean | Boolean Select | `–` / Yes / No | No | No | Shares row with bradycard |
| Bradycardia | Bradykard | `data.incarceration.bradycard` | `consultationData.incarceration.bradycard` | [treatment.md#sub-entity-consultationincarceration](../mongodb-mapping/treatment.md#sub-entity-consultationincarceration) | Boolean | Boolean Select | `–` / Yes / No | No | No | Shares row with tachykard |
| Blood pressure | Blutdruck | `data.incarceration.bloodPressure` | `consultationData.incarceration.bloodPressure` | [treatment.md#sub-entity-consultationincarceration](../mongodb-mapping/treatment.md#sub-entity-consultationincarceration) | String | Text Input | — | No | No | — |
| Skin Color | Hautkolorit | `data.incarceration.skinColor` | `consultationData.incarceration.skinColor` | [treatment.md#sub-entity-consultationincarceration](../mongodb-mapping/treatment.md#sub-entity-consultationincarceration) | Enum (SkinColor) | Select | `ROSY` (rosig/pink), `PALE` (blass/pale) | No | No | — |
| Intoxication supplement | Erganzung zur Intoxikation (bspw. Durchgefuhrte Koordinationstests) | `data.incarceration.intoxicationComment` | `consultationData.incarceration.intoxicationComment` | [treatment.md#sub-entity-consultationincarceration](../mongodb-mapping/treatment.md#sub-entity-consultationincarceration) | String | Textarea | — | No | No | `data-linktype="OWN"` |

### 16l. Respiratory & Suicidality

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Respiratory system | Atemwege | `data.incarceration.respiratoryTract` | `consultationData.incarceration.respiratoryTract` | [treatment.md#sub-entity-consultationincarceration](../mongodb-mapping/treatment.md#sub-entity-consultationincarceration) | Enum (RespiratoryTract) | Select | `FREE` (frei), `OCCUPIED` (belegt) | No | No | — |
| Respiratory rate | Atemfrequenz | `data.incarceration.respiratoryFrequency` | `consultationData.incarceration.respiratoryFrequency` | [treatment.md#sub-entity-consultationincarceration](../mongodb-mapping/treatment.md#sub-entity-consultationincarceration) | Enum (RespiratoryFrequency) | Select | `APNOE` (Apnea), `BRADYPNOE` (Bradypnea), `EUPNOE` (Eupnoe), `TACHYPNOE` (Tachypnea) | No | No | — |
| Body temperature | Korpertemperatur | `data.incarceration.bodyTemperature` | `consultationData.incarceration.bodyTemperature` | [treatment.md#sub-entity-consultationincarceration](../mongodb-mapping/treatment.md#sub-entity-consultationincarceration) | Number | Number Input | — | No | No | Suffix: `°C` (hardcoded) |
| Oxygen saturation | Sattigung | `data.incarceration.saturation` | `consultationData.incarceration.saturation` | [treatment.md#sub-entity-consultationincarceration](../mongodb-mapping/treatment.md#sub-entity-consultationincarceration) | Number | Number Input | — | No | No | Suffix: `%` (hardcoded) |
| Evidence of suicidality | Hinweise zu Suizidalitat | `data.incarceration.signsOfSuicidalityAtExamination` | `consultationData.incarceration.signsOfSuicidalityAtExamination` | [treatment.md#sub-entity-consultationincarceration](../mongodb-mapping/treatment.md#sub-entity-consultationincarceration) | Boolean | Boolean Select | `–` / Yes / No | No | No | Siren `siren-off`, asterisk `*` marker. Footnote: relevant specifically when type=`LIABILITY` |
| Suicidality description | Beschreibung | `data.incarceration.signsOfSuicidalityDescription` | `consultationData.incarceration.signsOfSuicidalityDescription` | [treatment.md#sub-entity-consultationincarceration](../mongodb-mapping/treatment.md#sub-entity-consultationincarceration) | String | Textarea (rows=4) | — | No | No | `data-linktype="OWN"`, siren `siren-off`, asterisk `*` marker. Placeholder lists assessment options: unremarkable, anxious, unassessable, euphoric, agitated, delusional, aggressive, confused, slow/stuporous, suicidal, depressed, motor restless |

### 16m. Body Check

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Body check findings | Bodycheck aussere Feststellungen/Verletzungen, Hinweise auf Trauma | `data.incarceration.bodyCheckComment` | `consultationData.incarceration.bodyCheckComment` | [treatment.md#sub-entity-consultationincarceration](../mongodb-mapping/treatment.md#sub-entity-consultationincarceration) | String | Textarea | — | Yes | No | `data-linktype="OWN"`. Full width |

---

## 17. Treatment Sub-Form (type=TREATMENT)

Source: [consultation/06-consultation-details-treatment-warning.md](consultation/06-consultation-details-treatment-warning.md)

The Treatment sub-form is rendered inside `#tabTreatment` when `consultation.type === 'TREATMENT'`. It is a continuous vertical form of textareas plus one collection/repeater for therapy history entries. **No fields are required.**

### 17a. Diagnosis

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Diagnosis Comment | Diagnose Kommentar | `data.treatment.diagnosis.comment` | `consultationData.treatment.diagnosis.comment` | [treatment.md#sub-entity-consultationtreatment](../mongodb-mapping/treatment.md#sub-entity-consultationtreatment) | String | Textarea | — | No | No | Under section heading "Diagnoses at the start of therapy" |

### 17b. Anamnesis

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Biographical and social anamnestic information | Biographische und sozialanamnestische Angaben | `data.treatment.anamnesisSocial` | `consultationData.treatment.anamnesisSocial` | [treatment.md#sub-entity-consultationtreatment](../mongodb-mapping/treatment.md#sub-entity-consultationtreatment) | String | Textarea | — | No | No | Left column |
| School, training and professional history | Schul-, Ausbildungs- und Berufsanamnese | `data.treatment.anamnesisEducationJob` | `consultationData.treatment.anamnesisEducationJob` | [treatment.md#sub-entity-consultationtreatment](../mongodb-mapping/treatment.md#sub-entity-consultationtreatment) | String | Textarea | — | No | No | Left column |
| Family history | Familienanamnese | `data.treatment.anamnesisFamily` | `consultationData.treatment.anamnesisFamily` | [treatment.md#sub-entity-consultationtreatment](../mongodb-mapping/treatment.md#sub-entity-consultationtreatment) | String | Textarea | — | No | No | Left column |
| Personal history | Eigenanamnese | `data.treatment.anamnesisSelf` | `consultationData.treatment.anamnesisSelf` | [treatment.md#sub-entity-consultationtreatment](../mongodb-mapping/treatment.md#sub-entity-consultationtreatment) | String | Textarea | — | No | No | Left column |
| Specific disease development | Spezifische Krankheitsentwicklung | `data.treatment.specificDiseaseDevelopment` | `consultationData.treatment.specificDiseaseDevelopment` | [treatment.md#sub-entity-consultationtreatment](../mongodb-mapping/treatment.md#sub-entity-consultationtreatment) | String | Textarea | — | No | No | Right column |
| Vegetative history | Vegetative Anamnese | `data.treatment.anamnesisVegetative` | `consultationData.treatment.anamnesisVegetative` | [treatment.md#sub-entity-consultationtreatment](../mongodb-mapping/treatment.md#sub-entity-consultationtreatment) | String | Textarea | — | No | No | Right column |
| Substance history and withdrawal treatment completed | Substanzanamnese und absolvierte Entwoehnungsbehandlungen | `data.treatment.anamnesisSubstance` | `consultationData.treatment.anamnesisSubstance` | [treatment.md#sub-entity-consultationtreatment](../mongodb-mapping/treatment.md#sub-entity-consultationtreatment) | String | Textarea | — | No | No | Right column |
| Delinquency history | Delinquenzanamnese | `data.treatment.anamnesisDelinquency` | `consultationData.treatment.anamnesisDelinquency` | [treatment.md#sub-entity-consultationtreatment](../mongodb-mapping/treatment.md#sub-entity-consultationtreatment) | String | Textarea | — | No | No | Right column |

### 17c. Medication

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Medication | Medikation | `data.treatment.medication` | `consultationData.treatment.medication` | [treatment.md#sub-entity-consultationtreatment](../mongodb-mapping/treatment.md#sub-entity-consultationtreatment) | String | Textarea | — | No | No | Full width |

### 17d. Findings & Psych Diagnostics

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Findings and psychological diagnostics | Befunde und psychologische Diagnostik | `data.treatment.reportPsychDiagnostic` | `consultationData.treatment.reportPsychDiagnostic` | [treatment.md#sub-entity-consultationtreatment](../mongodb-mapping/treatment.md#sub-entity-consultationtreatment) | String | Textarea | — | No | No | Left column |
| Psychopathological findings on admission | Psychopathologischer Befund bei Aufnahme | `data.treatment.reportsPsychopathologicalAdmission` | `consultationData.treatment.reportsPsychopathologicalAdmission` | [treatment.md#sub-entity-consultationtreatment](../mongodb-mapping/treatment.md#sub-entity-consultationtreatment) | String | Textarea | — | No | No | Right column |

### 17e. Medical Admission

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Medical admission findings before the start of telepsychotherapy | Aerztliche Aufnahmebefunde vor Beginn der Telepsychotherapie | `data.treatment.medicalAdmissiontelepsychotherapy` | `consultationData.treatment.medicalAdmissiontelepsychotherapy` | [treatment.md#sub-entity-consultationtreatment](../mongodb-mapping/treatment.md#sub-entity-consultationtreatment) | String | Textarea | — | No | No | col-md-6 |

### 17f. History (Repeater)

The history is a read+write collection/repeater where each entry represents a dated therapy progress note. The `date` field is auto-populated on creation (rendered as display-only `<span>`).

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Entry date | Datum | `data.treatment.history[].date` | `consultationData.treatment.history[].date` | [treatment.md#sub-entity-consultationtreatment](../mongodb-mapping/treatment.md#sub-entity-consultationtreatment) | Date | Date Display | — | No | Yes | Auto-populated date stamp. Rendered as `<span class="field date">` (display-only) |
| Treatment History Content | Therapie Verlauf | `data.treatment.history[].content` | `consultationData.treatment.history[].content` | [treatment.md#sub-entity-consultationtreatment](../mongodb-mapping/treatment.md#sub-entity-consultationtreatment) | String | Textarea | — | No | No | Editable progress note. New entries appended by framework |

### 17g. Further Treatment Recommendations

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Further treatment recommendations | Weitere Behandlungsempfehlungen | `data.treatment.furtherTreatmentRecommendations` | `consultationData.treatment.furtherTreatmentRecommendations` | [treatment.md#sub-entity-consultationtreatment](../mongodb-mapping/treatment.md#sub-entity-consultationtreatment) | String | Textarea | — | No | No | Left column |
| More goals | Weitere Ziele | `data.treatment.furtherGoals` | `consultationData.treatment.furtherGoals` | [treatment.md#sub-entity-consultationtreatment](../mongodb-mapping/treatment.md#sub-entity-consultationtreatment) | String | Textarea | — | No | No | Right column |

---

## 18. Warning Sub-Form (tab within consultation)

Source: [consultation/06-consultation-details-treatment-warning.md](consultation/06-consultation-details-treatment-warning.md)

The Warning sub-form is rendered inside `#tabWarning`. It provides a toggle to indicate no warnings apply, four category-specific insert selects for adding warnings, and a collection of warning card rows. Warnings are snapshots of `patientAlerts` entities.

### 18a. No-Warnings Toggle

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| No warnings | Keine Warnhinweise | `data.noWarnings` | `consultationData.noWarnings` | [treatment.md#sub-entity-consultationwarning](../mongodb-mapping/treatment.md#sub-entity-consultationwarning) | Boolean | Checkbox | — | No | No | When checked, hides the entire warning insert row + collection via `class="conditional" data-condition="! #noWarnings"` |

### 18b. Warning Insert Selects

These are category-filtered `<select>` dropdowns, each paired with an add (`+`) button. Selecting an option and clicking `+` inserts a new warning into the `data.warnings` collection. Options are populated server-side from `WarningService`.

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Allergy | Allergie | `data.warnings` (insert) | `consultationData.warnings[]` | [treatment.md#sub-entity-consultationwarning](../mongodb-mapping/treatment.md#sub-entity-consultationwarning) | — | Select + Add Button | Dynamic: `WarningService.getAllergies` | No | No | Inserts warning with `type=ALLERGY`. Options carry `id`, `name`, `pojo` (full snapshot) |
| Conspicuous | Auffaelligkeit | `data.warnings` (insert) | `consultationData.warnings[]` | [treatment.md#sub-entity-consultationwarning](../mongodb-mapping/treatment.md#sub-entity-consultationwarning) | — | Select + Add Button | Dynamic: `WarningService.getConspicious` | No | No | Inserts warning with `type=CONSPICIOUS`. Note: legacy typo preserved (`CONSPICIOUS` not `CONSPICUOUS`) |
| Infection | Infektiositaet | `data.warnings` (insert) | `consultationData.warnings[]` | [treatment.md#sub-entity-consultationwarning](../mongodb-mapping/treatment.md#sub-entity-consultationwarning) | — | Select + Add Button | Dynamic: `WarningService.getInfections` | No | No | Inserts warning with `type=INFECTION` |
| Other | Sonstige | `data.warnings` (insert) | `consultationData.warnings[]` | [treatment.md#sub-entity-consultationwarning](../mongodb-mapping/treatment.md#sub-entity-consultationwarning) | — | Select + Add Button | Dynamic: `WarningService.getOther` | No | No | Inserts warning with `type=OTHER` |

### 18c. Warning Collection Item Fields

Each warning in the `data.warnings[]` collection renders as a card row with the following fields. The `warning` sub-object is a **full embedded snapshot** of a `patientAlerts` document at write time (carrying `_id`, `version`, `name`, `type`, `entryRequirement`, `documentationRequirement`, `priority`).

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Warning name | (Name) | `data.warnings[].warning.name` | `consultationData.warnings[].warning.name` | [treatment.md#sub-entity-consultationwarning](../mongodb-mapping/treatment.md#sub-entity-consultationwarning) | String | Text Input | — | No | No | Auto-filled from selected option. `warning` is a snapshot of `patientAlerts` |
| Warning type | (Typ) | `data.warnings[].warning.type` | `consultationData.warnings[].warning.type` | [treatment.md#sub-entity-consultationwarning](../mongodb-mapping/treatment.md#sub-entity-consultationwarning) | Enum (WarningType) | Select | `ALLERGY` (Allergie), `CONSPICIOUS` (Auffaelligkeit), `INFECTION` (Infektiositaet), `OTHER` (Sonstige) | No | **Yes** | Read-only + disabled. Set automatically from insert category |
| Applies | Aktiv | `data.warnings[].applies` | `consultationData.warnings[].applies` | [treatment.md#sub-entity-consultationwarning](../mongodb-mapping/treatment.md#sub-entity-consultationwarning) | Boolean | Boolean Select | Yes / No | Yes | No | `class="required"` |
| Comment | Kommentar | `data.warnings[].comment` | `consultationData.warnings[].comment` | [treatment.md#sub-entity-consultationwarning](../mongodb-mapping/treatment.md#sub-entity-consultationwarning) | String | Textarea | — | No | No | Free-text comment |
| Start date | von | `data.warnings[].dateStart` | `consultationData.warnings[].dateStart` | [treatment.md#sub-entity-consultationwarning](../mongodb-mapping/treatment.md#sub-entity-consultationwarning) | Date | Date Input | — | No | No | Warning start date |
| End date | bis | `data.warnings[].dateEnd` | `consultationData.warnings[].dateEnd` | [treatment.md#sub-entity-consultationwarning](../mongodb-mapping/treatment.md#sub-entity-consultationwarning) | Date | Date Input | — | No | No | Warning end date. Note: `dateEnd` present in UI but not observed in MongoDB mapping sub-entity schema — may be stored but not indexed |

> **Delete action**: Each warning row includes a trash icon (`fa-trash action delete`) to remove the entry from the collection.
</task_result>task_id: ses_2e983d2e0ffet24xIv9o4l4R10 (for resuming to continue this task if needed)

<task_result>
No existing data dictionary file for treatment exists yet. I have all the context needed from the source analysis files and the MongoDB mapping. Let me now produce the complete markdown content.

## 19. Consultation View Dialog (read-only)

**Source**: [consultation/07-consultation-view-review.md](consultation/07-consultation-view-review.md)
**Dialog ID**: `consultationDetailsViewDlg` — 1500 px overlay
**Pattern**: Read-only view rendering all consultation data via `renderConsultationView()`. Sections conditionally shown by `data.type`.

### 19.1 Header Fields (always visible)

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| Book Number | Buchnummer | `data.bookNumber` | `consultationData.bookNumber` | [treatment.md#entity-konsultationsdaten-consultation-data](../mongodb-mapping/treatment.md#entity-konsultationsdaten-consultation-data) | string | display (bold, icon) | — | — | Yes | Icon: `fa-user-injured` |
| Birthday | Geburtstag | `data.body.birthday` | `consultationData.body.birthday` | [treatment.md#entity-konsultationsdaten-consultation-data](../mongodb-mapping/treatment.md#entity-konsultationsdaten-consultation-data) | date | display | — | — | Yes | Formatted date, icon: `fa-birthday-cake` |
| Age | Alter | `data.body.age` | `consultationData.body.age` | [treatment.md#entity-konsultationsdaten-consultation-data](../mongodb-mapping/treatment.md#entity-konsultationsdaten-consultation-data) | number | display | — | — | Yes | Suffix "Jahre" (HARDCODED DE) |
| Customer / Location | Kunde / Standort | `data.customer.name` / `data.location.externalDescription` | `consultationData.__ref_snapshot_customer.name` / `consultationData.__ref_snapshot_location.name` | [treatment.md#entity-konsultationsdaten-consultation-data](../mongodb-mapping/treatment.md#entity-konsultationsdaten-consultation-data) | string | display | — | — | Yes | Icon: `fa-hospital-user` |
| JVA Location | JVA | `data.location.name` | `consultationData.__ref_snapshot_location.name` | [treatment.md#entity-konsultationsdaten-consultation-data](../mongodb-mapping/treatment.md#entity-konsultationsdaten-consultation-data) | string | display | — | — | Yes | Icon: `fa-clinic-medical` |
| Job Title & Type | Leistung & Typ | `data.job.title` / `data.itype` | `consultationData.__ref_snapshot_job.title` | [treatment.md#entity-konsultationsdaten-consultation-data](../mongodb-mapping/treatment.md#entity-konsultationsdaten-consultation-data) | string | display | — | — | Yes | — |
| Date | Datum | `data.date` | `consultationData.date` | [treatment.md#entity-konsultationsdaten-consultation-data](../mongodb-mapping/treatment.md#entity-konsultationsdaten-consultation-data) | date | display | — | — | Yes | Icon: `fa-calendar-day` |
| Time Range | Zeitraum | `data.start` / `data.end` | `consultationData.timeStart` / `consultationData.timeEnd` | [treatment.md#entity-konsultationsdaten-consultation-data](../mongodb-mapping/treatment.md#entity-konsultationsdaten-consultation-data) | time | display | — | — | Yes | — |
| Contact | Kontakt | `data.base.contact` | `consultationData.base.timeContact` | [treatment.md#entity-konsultationsdaten-consultation-data](../mongodb-mapping/treatment.md#entity-konsultationsdaten-consultation-data) | string | display | — | — | Yes | Icon: `fa-phone-plus` |
| Doctor | Arzt | `data.doctor.displayName` | `consultationData.__ref_snapshot_doctor.name` | [treatment.md#entity-konsultationsdaten-consultation-data](../mongodb-mapping/treatment.md#entity-konsultationsdaten-consultation-data) | string | display | — | — | Yes | Icon: `fa-user-md` |
| Communication Type | Verbindungsart | `data.base.communicationType` | `consultationData.base.communicationType` | [treatment.md#entity-konsultationsdaten-consultation-data](../mongodb-mapping/treatment.md#entity-konsultationsdaten-consultation-data) | enum | display | VIDEO, VCGO, PHONE, EMAIL | — | Yes | Prefix "Verbindungsart:" (HARDCODED DE) |
| Expert Review | AL Begutachtung | `data.reporting.expert.displayName` / `data.reporting.dateReportEnd` | `consultationData.reporting.expert.name` / `consultationData.reporting.dateReportEnd` | [treatment.md#entity-konsultationsdaten-consultation-data](../mongodb-mapping/treatment.md#entity-konsultationsdaten-consultation-data) | string + date | display (conditional) | — | — | Yes | Only shown if `reporting` exists |
| Comment | Kommentar Experte | `data.comment` | `consultationData.comment` | [treatment.md#entity-konsultationsdaten-consultation-data](../mongodb-mapping/treatment.md#entity-konsultationsdaten-consultation-data) | string | display | — | — | Yes | — |

### 19.2 Section Visibility by Consultation Type

| `data.type` | Sections Shown |
|---|---|
| `STANDARD` | tabStandard + tabWarning |
| `ONBOARDING` | tabPatientData + tabOnboarding |
| `ONBOARDING_SHORT` | tabOnboardingShort |
| `INCARCERATION` | tabIncarcerationData |
| `TREATMENT` | tabTreatment |
| `DOCUMENT` | tabDocumentation |
| `EXTERNAL` | Generic header only |

### 19.3 Attachments Collection

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| Attachments | Anhänge | `data.attachments` | `consultationData.attachments[]` | [treatment.md#entity-konsultationsdaten-consultation-data](../mongodb-mapping/treatment.md#entity-konsultationsdaten-consultation-data) | collection | repeater table | — | — | Yes | File download links |
| File Name | Dateiname | `attachments.file.name` | `consultationData.attachments[].file.name` | [treatment.md#entity-konsultationsdaten-consultation-data](../mongodb-mapping/treatment.md#entity-konsultationsdaten-consultation-data) | string | link | — | — | Yes | URL: `/get/ConsultationService/attachment/{id}/{fileId}` |

### 19.4 Actions

| Action (EN) | Action (DE) | Trigger | API Call | Notes |
|---|---|---|---|---|
| OK | OK | Button click | — | Closes dialog |
| Download PDF | PDF herunterladen | Button click | `GET /get/ConsultationService/download/{id}/{name}` | Opens in new window |

> **Note**: All consultation sections (Standard examination, Onboarding, Incarceration, Treatment anamnesis, Documentation, Warnings, Files) are rendered read-only within this dialog. The full field breakdown per section is documented in the source analysis file. Key sub-sections include: Standard (medication anamnesis, anamnesis repeater, diagnosis with ICD-10, prescriptions, procedure report), Onboarding (personal/medical info, infectious diseases, body systems, assessment), Incarceration (consumption, intoxication assessment), Treatment (8 anamnesis fields, psych diagnostic, treatment history, further treatment), Documentation (single text field), Warnings (repeater with warning name/type/applies/comment/dateRange), Files (repeater with file link/date/transmit result).

---

## 20. Consultation Review Dialog

**Source**: [consultation/07-consultation-view-review.md](consultation/07-consultation-view-review.md)
**Dialog ID**: `consultationDetailsReviewDlg` — 1500 px overlay, 9/3 column split
**Pattern**: Left panel = read-only consultation view (same as §19); Right panel = review editing sidebar.

### 20.1 Review Sidebar Fields

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| Expert Name | Gutachter | `data.reporting.expert.displayName` | `consultationData.reporting.expert.name` | [treatment.md#entity-konsultationsdaten-consultation-data](../mongodb-mapping/treatment.md#entity-konsultationsdaten-consultation-data) | string | span (display) | — | — | Yes | Shown after review started |
| Report End Date | Datum Berichtsende | `data.reporting.dateReportEnd` | `consultationData.reporting.dateReportEnd` | [treatment.md#entity-konsultationsdaten-consultation-data](../mongodb-mapping/treatment.md#entity-konsultationsdaten-consultation-data) | date | span (display) | — | — | Yes | Shown after review started |
| Report Documentation | Begutachtungsdokumentation | `data.reporting.reportDocumentation` | `consultationData.reporting.reportDocumentation` | [treatment.md#entity-konsultationsdaten-consultation-data](../mongodb-mapping/treatment.md#entity-konsultationsdaten-consultation-data) | string (markdown) | textarea (markdown editor) | — | Yes | No | `height: calc(70vh)` ; mandatory validation |

### 20.2 Review Workflow Actions

| Action (EN) | Action (DE) | Trigger | API Call | Condition | Notes |
|---|---|---|---|---|---|
| Start Review | Begutachtung Starten | `#startReview` click | `ConsultationService.startReporting(id)` | `data.reporting` is null | Creates reporting object server-side; refreshes dialog |
| Save Review | Begutachtung Speichern | `#saveReview` click | `ConsultationService.saveReporting(id, reporting)` | `data.reporting` exists | Persists markdown; stays open |
| Download Review | Download | `#downloadReview` click | `GET /get/ConsultationService/download/{id}/{name}` | `data.reporting` exists | Opens PDF in new window |
| Submit Review | Begutachtung abschließen | `#submitReview` click | `ConsultationService.verify(id, reporting)` | `data.reporting` exists | Finalizes review; triggers page reload; closes dialog |

### 20.3 Review State Machine

- **No reporting** → Show only "Start Review" button
- **After `startReporting()`** → Show editor + Save / Download / Submit buttons
- **Save** → Persist, refresh, stay open
- **Submit** → Verify, reload, close

---

## 21. Warning Management (standalone CRUD)

**Source**: [warning/01-warning-management.md](warning/01-warning-management.md)
**Service**: `WarningService` (get, getAll)
**Collection**: `patientAlerts`
**Pattern**: Standard `tableView` + `slickerGrid` + modal detail CRUD

### 21.1 Grid Columns

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| ID | ID | `data.id` | `patientAlerts._id` | [treatment.md#entity-patientenbezogene-risikofaktoren--warnhinweise-patient-alerts](../mongodb-mapping/treatment.md#entity-patientenbezogene-risikofaktoren--warnhinweise-patient-alerts) | number | grid column | — | — | Yes | PK |
| Name | Name | `data.name` | `patientAlerts.name` | [treatment.md#entity-patientenbezogene-risikofaktoren--warnhinweise-patient-alerts](../mongodb-mapping/treatment.md#entity-patientenbezogene-risikofaktoren--warnhinweise-patient-alerts) | string | grid column (sortable, 180px) | — | — | — | — |
| Warning Type | Warnung | `data.type` | `patientAlerts.type` | [treatment.md#entity-patientenbezogene-risikofaktoren--warnhinweise-patient-alerts](../mongodb-mapping/treatment.md#entity-patientenbezogene-risikofaktoren--warnhinweise-patient-alerts) | enum | grid column (formatted) | WarningType | — | — | Formatter: `Formatter.warningType` |
| Entry Requirement | Nur bei langer Zugangsuntersuchung angezeigt | `data.entryRequirement` | `patientAlerts.entryRequirement` | [treatment.md#entity-patientenbezogene-risikofaktoren--warnhinweise-patient-alerts](../mongodb-mapping/treatment.md#entity-patientenbezogene-risikofaktoren--warnhinweise-patient-alerts) | boolean | grid column (formatted) | — | — | — | Formatter: `Formatter.bool` |
| Documentation Requirement | Kommentar verpflichtend | `data.documentationRequirement` | `patientAlerts.documentationRequirement` | [treatment.md#entity-patientenbezogene-risikofaktoren--warnhinweise-patient-alerts](../mongodb-mapping/treatment.md#entity-patientenbezogene-risikofaktoren--warnhinweise-patient-alerts) | boolean | grid column (formatted) | — | — | — | Formatter: `Formatter.bool` |
| Description | Beschreibung | `data.description` | `patientAlerts.description` | [treatment.md#entity-patientenbezogene-risikofaktoren--warnhinweise-patient-alerts](../mongodb-mapping/treatment.md#entity-patientenbezogene-risikofaktoren--warnhinweise-patient-alerts) | string | grid column (sortable, 180px) | — | — | — | — |

### 21.2 Detail Form (Create / Edit)

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| Name | Name | `data.name` | `patientAlerts.name` | [treatment.md#entity-patientenbezogene-risikofaktoren--warnhinweise-patient-alerts](../mongodb-mapping/treatment.md#entity-patientenbezogene-risikofaktoren--warnhinweise-patient-alerts) | string | text input | — | No | No | Placeholder: `label.name` |
| Warning Type | Warnung | `data.type` | `patientAlerts.type` | [treatment.md#entity-patientenbezogene-risikofaktoren--warnhinweise-patient-alerts](../mongodb-mapping/treatment.md#entity-patientenbezogene-risikofaktoren--warnhinweise-patient-alerts) | enum | select | ALLERGY, CONSPICUOUS*, INFECTION, OTHER | Yes | No | *Legacy: `CONSPICIOUS` (misspelled). Normalize to `CONSPICUOUS` in rebuild. |
| Entry Requirement | Nur bei langer Zugangsuntersuchung angezeigt | `data.entryRequirement` | `patientAlerts.entryRequirement` | [treatment.md#entity-patientenbezogene-risikofaktoren--warnhinweise-patient-alerts](../mongodb-mapping/treatment.md#entity-patientenbezogene-risikofaktoren--warnhinweise-patient-alerts) | boolean | checkbox (switch) | — | No | No | Default: unchecked |
| Documentation Requirement | Kommentar verpflichtend | `data.documentationRequirement` | `patientAlerts.documentationRequirement` | [treatment.md#entity-patientenbezogene-risikofaktoren--warnhinweise-patient-alerts](../mongodb-mapping/treatment.md#entity-patientenbezogene-risikofaktoren--warnhinweise-patient-alerts) | boolean | checkbox (switch) | — | No | No | Default: unchecked |
| Priority | Priorität | `data.priority` | `patientAlerts.priority` | [treatment.md#entity-patientenbezogene-risikofaktoren--warnhinweise-patient-alerts](../mongodb-mapping/treatment.md#entity-patientenbezogene-risikofaktoren--warnhinweise-patient-alerts) | number | number input | — | No | No | Input-group with label prefix |
| Description | Beschreibung | `data.description` | `patientAlerts.description` | [treatment.md#entity-patientenbezogene-risikofaktoren--warnhinweise-patient-alerts](../mongodb-mapping/treatment.md#entity-patientenbezogene-risikofaktoren--warnhinweise-patient-alerts) | string | textarea | — | No | No | Full-width; placeholder: `description` |

### 21.3 WarningType Enum

| Value | EN | DE |
|---|---|---|
| `ALLERGY` | Allergy | Allergie |
| `CONSPICUOUS` | Conspicuous | Auffälligkeit |
| `INFECTION` | Infection | Infektiosität |
| `OTHER` | Other | Sonstige |

> **Migration note**: Legacy enum value `CONSPICIOUS` is misspelled. Normalize to `CONSPICUOUS` with backward-compatible mapping.

---

## 22. Questionnaire List

**Source**: [questionnaire/01-questionnaire-list.md](questionnaire/01-questionnaire-list.md)
**Service**: `QuestionaireService` (getAll, get)
**Collection**: `questionaire` / `serviceQm`
**Pattern**: `tableView` + `slickerGrid` (24 columns) + inline detail panel

### 22.1 Grid Columns (24)

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| ID | ID | `data.id` | `questionaire._id` | [treatment.md#entity-qualitätsumfragen-questionaires](../mongodb-mapping/treatment.md#entity-qualitätsumfragen-questionaires) | number | grid column | — | — | Yes | PK |
| Appointment ID | Termin-ID | `data.appointmentId` | `questionaire.appointmentId` | [treatment.md#entity-qualitätsumfragen-questionaires](../mongodb-mapping/treatment.md#entity-qualitätsumfragen-questionaires) | number | grid column | — | — | Yes | FK |
| Consultation ID | Konsultations-ID | `data.consultationId` | `questionaire.consultationId` | [treatment.md#entity-qualitätsumfragen-questionaires](../mongodb-mapping/treatment.md#entity-qualitätsumfragen-questionaires) | number | grid column | — | — | Yes | FK |
| Customer ID | Kunden-ID | `data.customerId` | `questionaire.customerId` | [treatment.md#entity-qualitätsumfragen-questionaires](../mongodb-mapping/treatment.md#entity-qualitätsumfragen-questionaires) | number | grid column | — | — | Yes | FK |
| Location ID | Standort-ID | `data.locationId` | `questionaire.locationId` | [treatment.md#entity-qualitätsumfragen-questionaires](../mongodb-mapping/treatment.md#entity-qualitätsumfragen-questionaires) | number | grid column | — | — | Yes | FK |
| Expert ID | Experten-ID | `data.expertId` | `questionaire.expertId` | [treatment.md#entity-qualitätsumfragen-questionaires](../mongodb-mapping/treatment.md#entity-qualitätsumfragen-questionaires) | number | grid column | — | — | Yes | FK |
| Type | Typ | `data.type` | `questionaire.type` | [treatment.md#entity-qualitätsumfragen-questionaires](../mongodb-mapping/treatment.md#entity-qualitätsumfragen-questionaires) | string | grid column | — | — | Yes | — |
| Date | Datum | `data.date` | `questionaire.date` | [treatment.md#entity-qualitätsumfragen-questionaires](../mongodb-mapping/treatment.md#entity-qualitätsumfragen-questionaires) | datetime | grid column (formatted) | — | — | Yes | Formatter: `Formatter.dateTime` |
| Time Start | Startzeit | `data.timeStart` | `questionaire.timeStart` | [treatment.md#entity-qualitätsumfragen-questionaires](../mongodb-mapping/treatment.md#entity-qualitätsumfragen-questionaires) | string | grid column | — | — | Yes | — |
| Time End | Endzeit | `data.timeEnd` | `questionaire.timeEnd` | [treatment.md#entity-qualitätsumfragen-questionaires](../mongodb-mapping/treatment.md#entity-qualitätsumfragen-questionaires) | string | grid column | — | — | Yes | — |
| Patient Count | Patienten | `data.countPatients` | `questionaire.countPatients` | [treatment.md#entity-qualitätsumfragen-questionaires](../mongodb-mapping/treatment.md#entity-qualitätsumfragen-questionaires) | number | grid column | — | — | Yes | — |
| Risk Rating | Risiko | `data.ratingRisk` | `questionaire.ratingRisk` | [treatment.md#entity-qualitätsumfragen-questionaires](../mongodb-mapping/treatment.md#entity-qualitätsumfragen-questionaires) | number | grid column | — | — | Yes | Legacy/dead code in detail view |
| Tele Applicability | Telemedizin-Eignung | `data.ratingTeleApplyable` | `questionaire.ratingTeleApplyable` | [treatment.md#entity-qualitätsumfragen-questionaires](../mongodb-mapping/treatment.md#entity-qualitätsumfragen-questionaires) | number | grid column | — | — | Yes | Read-only; not in detail form |
| Extra Referral | Überweisungswahrscheinlichkeit | `data.ratingRequireExtraReferal` | `questionaire.ratingRequireExtraReferal` | [treatment.md#entity-qualitätsumfragen-questionaires](../mongodb-mapping/treatment.md#entity-qualitätsumfragen-questionaires) | number | grid column | — | — | Yes | — |
| Room Rating | Raumbewertung | `data.ratingRoom` | `questionaire.ratingRoom` | [treatment.md#entity-qualitätsumfragen-questionaires](../mongodb-mapping/treatment.md#entity-qualitätsumfragen-questionaires) | number | grid column | — | — | Yes | — |
| Documentation Rating | Dokumentationsbewertung | `data.ratingDocumentation` | `questionaire.ratingDocumentation` | [treatment.md#entity-qualitätsumfragen-questionaires](../mongodb-mapping/treatment.md#entity-qualitätsumfragen-questionaires) | number | grid column | — | — | Yes | Grid only; absent from detail |
| Require Reporting | Weiterleitung | `data.requireReporting` | `questionaire.requireReporting` | [treatment.md#entity-qualitätsumfragen-questionaires](../mongodb-mapping/treatment.md#entity-qualitätsumfragen-questionaires) | boolean | grid column (formatted) | — | — | Yes | Formatter: `Formatter.bool` |
| Equipment Rating | Verbindungsqualität | `data.ratingEquipment` | `questionaire.ratingEquipment` | [treatment.md#entity-qualitätsumfragen-questionaires](../mongodb-mapping/treatment.md#entity-qualitätsumfragen-questionaires) | number | grid column | — | — | Yes | — |
| Communication Rating | Zusammenarbeit | `data.ratingCommunication` | `questionaire.ratingCommunication` | [treatment.md#entity-qualitätsumfragen-questionaires](../mongodb-mapping/treatment.md#entity-qualitätsumfragen-questionaires) | number | grid column | — | — | Yes | — |
| Require Translator | Dolmetscher | `data.requireTranslator` | `questionaire.requireTranslator` | [treatment.md#entity-qualitätsumfragen-questionaires](../mongodb-mapping/treatment.md#entity-qualitätsumfragen-questionaires) | boolean | grid column (formatted) | — | — | Yes | Formatter: `Formatter.bool` |
| Comment | Kommentar | `data.comment` | `questionaire.comment` | [treatment.md#entity-qualitätsumfragen-questionaires](../mongodb-mapping/treatment.md#entity-qualitätsumfragen-questionaires) | string | grid column | — | — | Yes | — |
| Admissions Count | Anzahl Einweisungen | `data.countEntries` | `questionaire.countEntries` | [treatment.md#entity-qualitätsumfragen-questionaires](../mongodb-mapping/treatment.md#entity-qualitätsumfragen-questionaires) | number | grid column | — | — | Yes | — |
| Follow-ups Count | Anzahl Folgetermine | `data.countFollowUps` | `questionaire.countFollowUps` | [treatment.md#entity-qualitätsumfragen-questionaires](../mongodb-mapping/treatment.md#entity-qualitätsumfragen-questionaires) | number | grid column | — | — | Yes | — |
| Referrals Count | Anzahl Überweisungen | `data.countReferals` | `questionaire.countReferals` | [treatment.md#entity-qualitätsumfragen-questionaires](../mongodb-mapping/treatment.md#entity-qualitätsumfragen-questionaires) | number | grid column | — | — | Yes | Legacy spelling; normalize to `countReferrals` |

### 22.2 Inline Detail — Header & Counts

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| Appointment | Termin | `data.appointment.name` | (joined) | — | string | display | — | — | Yes | — |
| Consultation | Konsultation | `data.consultation` | (joined) | — | string | display | — | — | Yes | — |
| Customer | Kunde | `data.customer.name` | (joined) | — | string | display | — | — | Yes | — |
| Location | Standort | `data.location.name` | (joined) | — | string | display | — | — | Yes | — |
| Expert | Experte | `data.expert.displayName` | (joined) | — | string | display | — | — | Yes | — |
| Date | Datum | `data.qm.date` | `questionaire.date` | [treatment.md#entity-qualitätsumfragen-questionaires](../mongodb-mapping/treatment.md#entity-qualitätsumfragen-questionaires) | date | display | — | — | Yes | Icon: `fa-calendar-day` |
| Time Range | Zeitraum | `data.qm.timeStart` – `data.qm.timeEnd` | `questionaire.timeStart` / `questionaire.timeEnd` | [treatment.md#entity-qualitätsumfragen-questionaires](../mongodb-mapping/treatment.md#entity-qualitätsumfragen-questionaires) | time | display | — | — | Yes | — |
| Patients | Patienten | `data.qm.countPatients` | `questionaire.countPatients` | [treatment.md#entity-qualitätsumfragen-questionaires](../mongodb-mapping/treatment.md#entity-qualitätsumfragen-questionaires) | number | display | — | — | Yes | — |
| Admissions | Einweisungen | `data.qm.countEntries` | `questionaire.countEntries` | [treatment.md#entity-qualitätsumfragen-questionaires](../mongodb-mapping/treatment.md#entity-qualitätsumfragen-questionaires) | number | display | — | — | Yes | — |
| Follow-ups | Folgetermine | `data.qm.countFollowUps` | `questionaire.countFollowUps` | [treatment.md#entity-qualitätsumfragen-questionaires](../mongodb-mapping/treatment.md#entity-qualitätsumfragen-questionaires) | number | display | — | — | Yes | — |
| Referrals | Überweisungen | `data.qm.countReferals` | `questionaire.countReferals` | [treatment.md#entity-qualitätsumfragen-questionaires](../mongodb-mapping/treatment.md#entity-qualitätsumfragen-questionaires) | number | display | — | — | Yes | — |
| Re-presentations | Wiedervorstellungen | `data.qm.countRepeatEntry` | `questionaire.countRepeatEntry` | [treatment.md#entity-qualitätsumfragen-questionaires](../mongodb-mapping/treatment.md#entity-qualitätsumfragen-questionaires) | number | display | — | — | Yes | — |

---

## 23. Questionnaire Detail (QM Form)

**Source**: [questionnaire/02-questionnaire-detail.md](questionnaire/02-questionnaire-detail.md)
**Dialog ID**: `questionaireDetailsDlg` — 800 px, also embedded as `{{> detailQuestionaire}}` in dashboard dialogs
**Service**: `QuestionaireService`
**Collection**: `questionaire` (standalone) / `serviceQm` (embedded in appointment flow)

### 23.1 Equipment Ratings (conditional, hidden by default)

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| Dermatoscope Rating | Bewertung Dermatoskop | `data.qm.ratingEquipmentDermatoskop` | `questionaire.ratingEquipmentDermatoskop` / `serviceQm.ratingEquipmentDermatoskop` | [treatment.md#entity-qualitätsumfragen-questionaires](../mongodb-mapping/treatment.md#entity-qualitätsumfragen-questionaires) | number | radio group (1-6, -1) | 1=sehr gut…6=ungenügend, -1=nicht benötigt | No | No | Hidden if `-1` or psych job. Icon: `fa-wifi` |
| Otoscope Rating | Bewertung Otoskop | `data.qm.ratingEquipmentOtoskop` | `questionaire.ratingEquipmentOtoskop` / `serviceQm.ratingEquipmentOtoskop` | [treatment.md#entity-qualitätsumfragen-questionaires](../mongodb-mapping/treatment.md#entity-qualitätsumfragen-questionaires) | number | radio group (1-6, -1) | 1-6, -1=not required | No | No | Hidden if `-1` or psych job. Icon: `fa-wifi` |
| Stethoscope Rating | Bewertung Stethoskop | `data.qm.ratingEquipmentStethoskop` | `questionaire.ratingEquipmentStethoskop` / `serviceQm.ratingEquipmentStethoskop` | [treatment.md#entity-qualitätsumfragen-questionaires](../mongodb-mapping/treatment.md#entity-qualitätsumfragen-questionaires) | number | radio group (1-6, -1) | 1-6, -1=not required | No | No | Hidden if `-1` or psych job. Icon: `fa-wifi` |
| Vital Signs Rating | Bewertung Vitalwerte | `data.qm.ratingEquipmentVital` | `questionaire.ratingEquipmentVital` / `serviceQm.ratingEquipmentVital` | [treatment.md#entity-qualitätsumfragen-questionaires](../mongodb-mapping/treatment.md#entity-qualitätsumfragen-questionaires) | number | radio group (1-6, -1) | 1-6, -1=not required | No | No | Hidden if `-1` or psych job. Icon: `fa-wifi` |

### 23.2 General Ratings (always visible unless filtered)

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| Room Conditions | Räumliche Gegebenheiten | `data.qm.ratingRoom` | `questionaire.ratingRoom` / `serviceQm.ratingRoom` | [treatment.md#entity-qualitätsumfragen-questionaires](../mongodb-mapping/treatment.md#entity-qualitätsumfragen-questionaires) | number | radio group (1-6) | 1=sehr gut…6=ungenügend | No | No | School grade scale |
| Video/Connection Quality | Video-/Verbindungsqualität | `data.qm.ratingEquipment` | `questionaire.ratingEquipment` / `serviceQm.ratingEquipment` | [treatment.md#entity-qualitätsumfragen-questionaires](../mongodb-mapping/treatment.md#entity-qualitätsumfragen-questionaires) | number | radio group (1-6) | 1=sehr gut…6=ungenügend | No | No | School grade scale |
| Referral Likelihood | Überweisungswahrscheinlichkeit | `data.qm.ratingRequireExtraReferal` | `questionaire.ratingRequireExtraReferal` / `serviceQm.ratingRequireExtraReferal` | [treatment.md#entity-qualitätsumfragen-questionaires](../mongodb-mapping/treatment.md#entity-qualitätsumfragen-questionaires) | number | radio group (1-6) | 1=notwendig…6=gar nicht | No | No | Probability scale. Hidden for psych jobs + EXTERNAL type |
| Communication Rating | Zusammenarbeit Personal | `data.qm.ratingCommunication` | `questionaire.ratingCommunication` / `serviceQm.ratingCommunication` | [treatment.md#entity-qualitätsumfragen-questionaires](../mongodb-mapping/treatment.md#entity-qualitätsumfragen-questionaires) | number | radio group (1-6) | 1=sehr gut…6=ungenügend | No | No | School grade scale |
| Interpreter Required | Dolmetscher notwendig | `data.qm.requireTranslator` | `questionaire.requireTranslator` / `serviceQm.requireTranslator` | [treatment.md#entity-qualitätsumfragen-questionaires](../mongodb-mapping/treatment.md#entity-qualitätsumfragen-questionaires) | boolean | radio group (yes/no) | Ja, Nein | No | No | — |
| Diagnostic Certainty | Diagnostische Sicherheit | `data.qm.ratingDiagnosticCertainty` | `questionaire.ratingDiagnosticCertainty` / `serviceQm.ratingDiagnosticCertainty` | [treatment.md#entity-qualitätsumfragen-questionaires](../mongodb-mapping/treatment.md#entity-qualitätsumfragen-questionaires) | number | radio group (1-6) | 1=sehr gut…6=ungenügend | No | No | School grade scale |
| Treatment Over Video Quality | Fallbehandlung per Video | `data.qm.ratingTreatmentOverVideoQuality` | `questionaire.ratingTreatmentOverVideoQuality` / `serviceQm.ratingTreatmentOverVideoQuality` | [treatment.md#entity-qualitätsumfragen-questionaires](../mongodb-mapping/treatment.md#entity-qualitätsumfragen-questionaires) | number | radio group (1-6) | 1=sehr gut…6=ungenügend | No | No | School grade scale |

### 23.3 Feedback

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| Treatment Quality Feedback | Feedback Behandlungsqualität | `data.qm.requireTreatmentQuality` | `questionaire.requireTreatmentQuality` / `serviceQm.requireTreatmentQuality` | [treatment.md#entity-qualitätsumfragen-questionaires](../mongodb-mapping/treatment.md#entity-qualitätsumfragen-questionaires) | string | textarea | — | Conditional | No | Mandatory (min 3 chars) when any equipment rating is 5 or 6 (`requireDocumentation` trigger) |

### 23.4 Conditional Visibility Rules

| Rule | Condition | Effect |
|---|---|---|
| Psych job | `job.remoteCode` contains "psych" (case-insensitive) | Hide all `.qmphysical` rows (equipment ratings + referral) |
| EXTERNAL type | `consultation.type === "EXTERNAL"` or `location.patientDataType === "EXTERNAL"` | Hide `.qmexternal` row (referral rating) |
| Equipment auto-expand | Saved rating value > 0 | Show corresponding equipment row |
| Require documentation | Any equipment rating value = 5 or 6 | `requireTreatmentQuality` becomes mandatory (min 3 chars) |

### 23.5 Rating Scale Enums

**School grade scale** (used by room, equipment, communication, diagnostic certainty, treatment video):

| Value | DE | EN |
|---|---|---|
| 1 | sehr gut | very good |
| 2 | gut | good |
| 3 | befriedigend | satisfying |
| 4 | ausreichend | sufficient |
| 5 | mangelhaft | poor |
| 6 | ungenügend | inadequate |

**Probability scale** (used by referral likelihood):

| Value | DE | EN |
|---|---|---|
| 1 | notwendig | necessary |
| 2 | eventuell | possibly |
| 3 | neutral | neutral |
| 4 | eher weniger | rather less |
| 5 | gering | low |
| 6 | gar nicht | not at all |

**Equipment not-required sentinel**: `-1` = "nicht benötigt" / "not required"

---

## 24. Treatment List (MonthTable)

**Source**: [treatment-core/01-treatment-and-category.md](treatment-core/01-treatment-and-category.md)
**Service**: `AppointmentService` (filtered to `jobType="TREATMENT"`)
**Pattern**: `MonthTable` calendar grid (day × job) — NOT a standard row-based table

### 24.1 Calendar Grid Axes

| Axis | Content | Source |
|---|---|---|
| Rows | Day of month (1-31) | Generated from current month |
| Columns | Job/service names | Returned by `AppointmentService` for TREATMENT type |
| Cells | Treatment entries with state coloring + assigned staff | Custom render function |

### 24.2 Filter Panel

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| Day | Tag | `filterDay` | — | — | number | number input | — | No | No | Exact match on row day number; HARDCODED placeholder "Tag" |
| Job | Job | `filterJob` | — | — | string | text input | — | No | No | Substring match on column job name |
| State | Status | `filterState` | — | — | enum | select | READY, STARTED, REQUESTED, LOCKEDIN, ACTIVE, REOPENED, DONE, CLOSED, STORNO, RESCHEDULED, CANCELED, ARCHIVED | No | No | Triggers cell-level filter via `MonthTable.filter()` |

### 24.3 Actions

| Action (EN) | Action (DE) | Trigger | API Call | Notes |
|---|---|---|---|---|
| Reload | Neu laden | `#reloadMenuBtn` click | `$(document).trigger("reloadGrid")` | Also auto-fires on page load |
| Edit | Bearbeiten | `#editMenuBtn` click | Opens shared appointment detail panel | Disabled until selection |
| Export | Exportieren | `#exportMenuBtn` click | `GET /get/AppointmentService/export/TREATMENT/{year}/{month}/Termine-Therapie-{year}_{month}.xls` | Excel download |
| Send Reminder | Erinnerung | `#locationReminderMenuBtn` click | `AppointmentService.sendAppointmentReminderLocations(start, days, ["TREATMENT"])` | Opens reminder dialog; defaults: start=next Monday, days=7 |

> **Note**: No create button exists on this page. Treatments are created through a different flow. The detail panel is the shared `appointment/details.html`.

---

## 25. Treatment Category (simple CRUD)

**Source**: [treatment-core/01-treatment-and-category.md](treatment-core/01-treatment-and-category.md)
**Service**: `TreatmentCategoryService` (get, getAll, save, delete)
**Collection**: `treatmentCategory`
**Pattern**: `slickerGrid` + modal detail form

### 25.1 Grid Columns

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| ID | ID | `data.id` | `treatmentCategory._id` | [treatment.md#entity-behandlungskategorien-treatment-categories](../mongodb-mapping/treatment.md#entity-behandlungskategorien-treatment-categories) | number | grid column | — | — | Yes | PK |
| Name | Name | `data.name` | `treatmentCategory.name` | [treatment.md#entity-behandlungskategorien-treatment-categories](../mongodb-mapping/treatment.md#entity-behandlungskategorien-treatment-categories) | string | grid column (sortable, 80px) | — | — | — | — |
| Description | Beschreibung | `data.description` | `treatmentCategory.description` | [treatment.md#entity-behandlungskategorien-treatment-categories](../mongodb-mapping/treatment.md#entity-behandlungskategorien-treatment-categories) | string | grid column (sortable, 80px) | — | — | — | — |
| Priority | Priorität | `data.prio` | `treatmentCategory.prio` | [treatment.md#entity-behandlungskategorien-treatment-categories](../mongodb-mapping/treatment.md#entity-behandlungskategorien-treatment-categories) | number | grid column (sortable, 80px) | — | — | — | — |

### 25.2 Detail Form

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| Name | Name | `data.name` | `treatmentCategory.name` | [treatment.md#entity-behandlungskategorien-treatment-categories](../mongodb-mapping/treatment.md#entity-behandlungskategorien-treatment-categories) | string | text input | — | No | No | Placeholder: `label.name` |
| Description | Beschreibung | `data.description` | `treatmentCategory.description` | [treatment.md#entity-behandlungskategorien-treatment-categories](../mongodb-mapping/treatment.md#entity-behandlungskategorien-treatment-categories) | string | text input | — | No | No | Placeholder: `label.description` |
| Priority | Priorität | `data.prio` | `treatmentCategory.prio` | [treatment.md#entity-behandlungskategorien-treatment-categories](../mongodb-mapping/treatment.md#entity-behandlungskategorien-treatment-categories) | number | number input | — | No | No | Placeholder: `label.priority` |

---

## 26. Treatment Plan Grid (17 columns)

**Source**: [treatment-core/02-treatment-plan.md](treatment-core/02-treatment-plan.md)
**Service**: `TreatmentService.getAllSortedLocation` (filtered by `history` flag)
**Collection**: `treatment`
**Pattern**: `slickerGrid` (17 columns — largest grid in codebase) + dual dialog pattern (create vs. edit)

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| ID | ID | `data.id` | `treatment._id` | [treatment.md#entity-behandlungsverlauf-treatment](../mongodb-mapping/treatment.md#entity-behandlungsverlauf-treatment) | number | grid column (40px) | — | — | Yes | PK |
| External UUID | Externe UUID | `data.externalUuid` | `treatment.externalUuid` | [treatment.md#entity-behandlungsverlauf-treatment](../mongodb-mapping/treatment.md#entity-behandlungsverlauf-treatment) | string | grid column (80px) | — | — | Yes | — |
| Assigned | Zugewiesen | `data.assigned` | `treatment.__ref_snapshot_assigned.name` | [treatment.md#entity-behandlungsverlauf-treatment](../mongodb-mapping/treatment.md#entity-behandlungsverlauf-treatment) | object | grid column (140px, formatted) | — | — | Yes | Formatter: `Formatter.name` → `.displayName` |
| Location | Standort | `data.location` | `treatment.__ref_snapshot_location.name` | [treatment.md#entity-behandlungsverlauf-treatment](../mongodb-mapping/treatment.md#entity-behandlungsverlauf-treatment) | object | grid column (180px, formatted) | — | — | Yes | Formatter: `Formatter.name` |
| Book Number | Buchnummer | `data.bookNumber` | `treatment.bookNumber` | [treatment.md#entity-behandlungsverlauf-treatment](../mongodb-mapping/treatment.md#entity-behandlungsverlauf-treatment) | string | grid column (80px) | — | — | Yes | — |
| Start Date | Startdatum | `data.dateStart` | `treatment.dateStart` | [treatment.md#entity-behandlungsverlauf-treatment](../mongodb-mapping/treatment.md#entity-behandlungsverlauf-treatment) | datetime | grid column (80px, formatted) | — | — | Yes | Formatter: `Formatter.dateTime` |
| Weekday | Wochentag | `data.day` | `treatment.day` | [treatment.md#entity-behandlungsverlauf-treatment](../mongodb-mapping/treatment.md#entity-behandlungsverlauf-treatment) | enum | grid column (80px, formatted) | MO, TU, WE, TH, FR, SA, SU | — | Yes | Formatter: `Formatter.weekday` |
| Start Time | Startzeit | `data.startTime` | `treatment.startTime` | [treatment.md#entity-behandlungsverlauf-treatment](../mongodb-mapping/treatment.md#entity-behandlungsverlauf-treatment) | string | grid column (80px) | — | — | Yes | — |
| J-Number | J-Nummer | `data.jNumber` | `treatment.jNumber` | [treatment.md#entity-behandlungsverlauf-treatment](../mongodb-mapping/treatment.md#entity-behandlungsverlauf-treatment) | string | grid column (80px) | — | — | Yes | HARDCODED label "jNumber" |
| Job | Leistung | `data.job` | `treatment.__ref_snapshot_job.title` | [treatment.md#entity-behandlungsverlauf-treatment](../mongodb-mapping/treatment.md#entity-behandlungsverlauf-treatment) | object | grid column (180px, formatted) | — | — | Yes | Formatter: `Formatter.name` |
| State | Status | `data.state` | `treatment.state` | [treatment.md#entity-behandlungsverlauf-treatment](../mongodb-mapping/treatment.md#entity-behandlungsverlauf-treatment) | enum | grid column (180px, formatted) | TreatmentState (12 values) | — | Yes | Formatter: `treatmentStateFormatter`; color-coded with `tr-{state}` CSS class |
| Archived | Archiviert | `data.archived` | `treatment.archived` | [treatment.md#entity-behandlungsverlauf-treatment](../mongodb-mapping/treatment.md#entity-behandlungsverlauf-treatment) | boolean | grid column (80px, formatted) | — | — | Yes | Formatter: `Formatter.bool` |
| Closed | Geschlossen | `data.closed` | `treatment.closed` | [treatment.md#entity-behandlungsverlauf-treatment](../mongodb-mapping/treatment.md#entity-behandlungsverlauf-treatment) | datetime | grid column (100px, formatted) | — | — | Yes | Formatter: `Formatter.dateTime` |
| Total Created | Anzahl erstellt | `data.countTotal` | `treatment.countTotal` | [treatment.md#entity-behandlungsverlauf-treatment](../mongodb-mapping/treatment.md#entity-behandlungsverlauf-treatment) | number | grid column (100px) | — | — | Yes | — |
| Completed | Anzahl abgeschlossen | `data.countFinished` | `treatment.countFinished` | [treatment.md#entity-behandlungsverlauf-treatment](../mongodb-mapping/treatment.md#entity-behandlungsverlauf-treatment) | number | grid column (130px) | — | — | Yes | — |
| Planned | Anzahl geplant | `data.countPlanned` | `treatment.countPlanned` | [treatment.md#entity-behandlungsverlauf-treatment](../mongodb-mapping/treatment.md#entity-behandlungsverlauf-treatment) | number | grid column (110px) | — | — | Yes | — |
| Comment | Kommentar | `data.comment` | `treatment.comment` | [treatment.md#entity-behandlungsverlauf-treatment](../mongodb-mapping/treatment.md#entity-behandlungsverlauf-treatment) | string | grid column (310px) | — | — | Yes | — |

### 26.1 TreatmentState Enum (12 values)

| Value | DE | CSS Class |
|---|---|---|
| `PREPARED` | Vorbereitet | `tr-prepared` |
| `READY` | Bereit | `tr-ready` |
| `STARTED` | Gestartet | `tr-started` |
| `PROBATORIK` | Probatorisch | `tr-probatorik` |
| `RUNNING` | Laufend | `tr-running` |
| `ENDING` | Beendend | `tr-ending` |
| `CANCELED` | Abgebrochen | `tr-canceled` |
| `CANCELED_CLOSED` | Abgebrochen (geschlossen) | `tr-canceled_closed` |
| `CLOSED` | Geschlossen | `tr-closed` |
| `STORNO` | Storniert | `tr-storno` |
| `STORNO_CLOSED` | Storniert (geschlossen) | `tr-storno_closed` |
| `PAUSED` | Pausiert | `tr-paused` |

---

## 27. Treatment Plan — Create Dialog

**Source**: [treatment-core/02-treatment-plan.md](treatment-core/02-treatment-plan.md)
**Dialog ID**: `createTreatmentDlg` — 1100 px, 2-column layout (col-md-4 + col-md-8)
**Condition**: Opened when `data.dateStarted` does NOT exist on the selected treatment

### 27.1 Left Column — Form Fields

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| Job | Leistung | `data.job` | `treatment.__ref_snapshot_job` | [treatment.md#entity-behandlungsverlauf-treatment](../mongodb-mapping/treatment.md#entity-behandlungsverlauf-treatment) | object | autocomplete | `JobService.autocompleteType("APPOINTMENT")` | Yes | No | Display: `code` |
| Room | Raum | `data.room` | `treatment.room` | [treatment.md#entity-behandlungsverlauf-treatment](../mongodb-mapping/treatment.md#entity-behandlungsverlauf-treatment) | object | autocomplete | `RoomService.autocompleteAvailableRooms` | No | No | Display: `name` |
| Location | Standort | `data.location` | `treatment.__ref_snapshot_location` | [treatment.md#entity-behandlungsverlauf-treatment](../mongodb-mapping/treatment.md#entity-behandlungsverlauf-treatment) | object | autocomplete | `LocationService.autocomplete` | Yes | No | Display: `name` |
| Book Number | Buchnummer | `data.bookNumber` | `treatment.bookNumber` | [treatment.md#entity-behandlungsverlauf-treatment](../mongodb-mapping/treatment.md#entity-behandlungsverlauf-treatment) | string | text input | — | No | No | — |
| J-Number | J-Nummer | `data.jNumber` | `treatment.jNumber` | [treatment.md#entity-behandlungsverlauf-treatment](../mongodb-mapping/treatment.md#entity-behandlungsverlauf-treatment) | string | text input | — | No | No | HARDCODED label; tooltip: "JNumber used to get the bookNumber" |
| Planned Count | Anzahl geplant | `data.countPlanned` | `treatment.countPlanned` | [treatment.md#entity-behandlungsverlauf-treatment](../mongodb-mapping/treatment.md#entity-behandlungsverlauf-treatment) | number | number input | — | Yes | No | Default: 65 |
| Initial Count | Anfang | `data.dateInitial` | `treatment.dateInitial` | [treatment.md#entity-behandlungsverlauf-treatment](../mongodb-mapping/treatment.md#entity-behandlungsverlauf-treatment) | number | number input | — | Yes | No | Default: 5; tooltip: `Treatment.AppointmentCountInitialExtend.Desc` |
| Day | Tag | `data.day` | `treatment.day` | [treatment.md#entity-behandlungsverlauf-treatment](../mongodb-mapping/treatment.md#entity-behandlungsverlauf-treatment) | enum | select | MO, TU, WE, TH, FR, SA, SU | No | No | Weekday select |
| Hour | Stunde | `data.hour` | `treatment.hour` | [treatment.md#entity-behandlungsverlauf-treatment](../mongodb-mapping/treatment.md#entity-behandlungsverlauf-treatment) | number | select | 1–24 | No | No | Icon: `fa-clock` |
| Minutes | Minuten | `data.minutes` | `treatment.minutes` | [treatment.md#entity-behandlungsverlauf-treatment](../mongodb-mapping/treatment.md#entity-behandlungsverlauf-treatment) | number | select | 00, 15, 30, 45 | No | No | Warning shown when ≠ 00 |
| Comment | Kommentar | `data.comment` | `treatment.comment` | [treatment.md#entity-behandlungsverlauf-treatment](../mongodb-mapping/treatment.md#entity-behandlungsverlauf-treatment) | string | textarea | — | No | No | — |
| Probatory Report Job | Probatorisch Leistung | `data.jobReportPobatorik` | `treatment.__ref_snapshot_jobReportProbatorik` | [treatment.md#entity-behandlungsverlauf-treatment](../mongodb-mapping/treatment.md#entity-behandlungsverlauf-treatment) | object | autocomplete | `JobService.autocompleteType("SHIFT")` | Yes | No | Display: `code` |
| Reporting Path | Upload-Pfad | `data.reportingPath` | `treatment.reportingPath` | [treatment.md#entity-behandlungsverlauf-treatment](../mongodb-mapping/treatment.md#entity-behandlungsverlauf-treatment) | string | text input | — | No | No | Placeholder: "upload path"; icon: `fa-cloud-upload` |
| Report Job | Leistung Bericht | `data.jobReport` | `treatment.__ref_snapshot_jobReport` | [treatment.md#entity-behandlungsverlauf-treatment](../mongodb-mapping/treatment.md#entity-behandlungsverlauf-treatment) | object | autocomplete | `JobService.autocompleteType("SHIFT")` | Yes | No | Display: `code` |
| Report Initial Count | Bericht Anfang | `data.reportCountInitial` | `treatment.reportCountInitial` | [treatment.md#entity-behandlungsverlauf-treatment](../mongodb-mapping/treatment.md#entity-behandlungsverlauf-treatment) | number | number input | — | Yes | No | Default: 5 |
| Report Rhythm | Bericht Rhythmus | `data.reportCountRhytm` | `treatment.reportCountRhytm` | [treatment.md#entity-behandlungsverlauf-treatment](../mongodb-mapping/treatment.md#entity-behandlungsverlauf-treatment) | number | number input | — | Yes | No | Default: 20; icon: `fa-drum` |
| Start Date | Start | `data.dateStart` | `treatment.dateStart` | [treatment.md#entity-behandlungsverlauf-treatment](../mongodb-mapping/treatment.md#entity-behandlungsverlauf-treatment) | date | date input | — | No | No | Icon: `fa-calendar-day` |
| Accepted PT Leadership | Akzeptiert PT Leitung | `data.dateAcceptedPTLeitung` | `treatment.dateAcceptedPTLeitung` | [treatment.md#entity-behandlungsverlauf-treatment](../mongodb-mapping/treatment.md#entity-behandlungsverlauf-treatment) | date | date input | — | No | No | Icon: `fa-calendar-day` |
| Accepted PT | Akzeptiert PT | `data.dateAcceptedPT` | `treatment.dateAcceptedPT` | [treatment.md#entity-behandlungsverlauf-treatment](../mongodb-mapping/treatment.md#entity-behandlungsverlauf-treatment) | date | date input | — | No | No | Icon: `fa-calendar-day` |
| Accepted Location | Akzeptiert Standort | `data.dateAcceptedLocation` | `treatment.dateAcceptedLocation` | [treatment.md#entity-behandlungsverlauf-treatment](../mongodb-mapping/treatment.md#entity-behandlungsverlauf-treatment) | date | date input | — | No | No | Icon: `fa-calendar-day` |

### 27.2 Right Column — Expert Selection + Week Calendar

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| Assigned Expert | Behandelnder Arzt | `data.assigned` | `treatment.__ref_snapshot_assigned` | [treatment.md#entity-behandlungsverlauf-treatment](../mongodb-mapping/treatment.md#entity-behandlungsverlauf-treatment) | object | autocomplete | `UserService.findDoctor` | No | No | Display: `displayName`; icon: `fa-user-md` |
| Expert Week Calendar | Wochenkalender | (embedded widget) | — | — | widget | embedded table (7-day MO-SU) | — | — | — | Loaded via `profile/expertWeek.js`; bidirectional sync with Day/Hour selects; `weekTypeSelection="TREATMENT"` |

### 27.3 Create Default Values

| Field | Default |
|---|---|
| `countInitial` | 5 |
| `countPlanned` | 65 |
| `reportCountInitial` | 5 |
| `reportCountRhytm` | 20 |
| `appointmentCountRhytmExtend` | 20 |
| `type` | `"PSYCH"` |
| `state` | `"PREPARED"` |

### 27.4 Actions

| Action (EN) | Action (DE) | Trigger | API Call | Notes |
|---|---|---|---|---|
| Save | Speichern | Dialog save callback | `TreatmentService.save(data)` | Persists without starting |
| Start Treatment | Therapie starten | `startTreatment` event | `TreatmentService.start(data)` + `asyncExecutorProgress` | Confirm: "Therapie starten? (Termine werden angelegt)" (HARDCODED DE). Creates appointments. |

---

## 28. Treatment Plan — Edit Dialog

**Source**: [treatment-core/02-treatment-plan.md](treatment-core/02-treatment-plan.md)
**Dialog ID**: `editTreatmentDlg` — 1300 px, 3-column top row + full-width positions/attachments
**Condition**: Opened when `data.dateStarted` EXISTS on the selected treatment

### 28.1 Column 1 — Read-only Info

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| Assigned Expert | Behandelnder Arzt | `data.assigned.displayName` | `treatment.__ref_snapshot_assigned.name` | [treatment.md#entity-behandlungsverlauf-treatment](../mongodb-mapping/treatment.md#entity-behandlungsverlauf-treatment) | string | span (display) | — | — | Yes | Icon: `fa-user-md` |
| J-Number | J-Nummer | `data.jNumber` | `treatment.jNumber` | [treatment.md#entity-behandlungsverlauf-treatment](../mongodb-mapping/treatment.md#entity-behandlungsverlauf-treatment) | string | span (display) | — | — | Yes | — |
| Book Number | Buchnummer | `data.bookNumber` | `treatment.bookNumber` | [treatment.md#entity-behandlungsverlauf-treatment](../mongodb-mapping/treatment.md#entity-behandlungsverlauf-treatment) | string | span (display) | — | — | Yes | Icon: `fa-user-injured` |
| Location | Standort | `data.location.name` | `treatment.__ref_snapshot_location.name` | [treatment.md#entity-behandlungsverlauf-treatment](../mongodb-mapping/treatment.md#entity-behandlungsverlauf-treatment) | string | span (display) | — | — | Yes | — |
| Customer | Kunde | `data.customer.name` | `treatment.__ref_snapshot_customer.name` | [treatment.md#entity-behandlungsverlauf-treatment](../mongodb-mapping/treatment.md#entity-behandlungsverlauf-treatment) | string | span (display) | — | — | Yes | — |
| Accepted PT Leadership | Akzeptiert PT Leitung | `data.dateAcceptedPTLeitung` | `treatment.dateAcceptedPTLeitung` | [treatment.md#entity-behandlungsverlauf-treatment](../mongodb-mapping/treatment.md#entity-behandlungsverlauf-treatment) | date | span (display) | — | — | Yes | — |
| Accepted PT | Akzeptiert PT | `data.dateAcceptedPT` | `treatment.dateAcceptedPT` | [treatment.md#entity-behandlungsverlauf-treatment](../mongodb-mapping/treatment.md#entity-behandlungsverlauf-treatment) | date | span (display) | — | — | Yes | — |
| Accepted Location | Akzeptiert Standort | `data.dateAcceptedLocation` | `treatment.dateAcceptedLocation` | [treatment.md#entity-behandlungsverlauf-treatment](../mongodb-mapping/treatment.md#entity-behandlungsverlauf-treatment) | date | span (display) | — | — | Yes | — |
| Start Date | Start | `data.dateStart` | `treatment.dateStart` | [treatment.md#entity-behandlungsverlauf-treatment](../mongodb-mapping/treatment.md#entity-behandlungsverlauf-treatment) | date | span (display) | — | — | Yes | HARDCODED label "Start" |

### 28.2 Column 2 — Editable Scheduling

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| Room | Raum | `data.room` | `treatment.room` | [treatment.md#entity-behandlungsverlauf-treatment](../mongodb-mapping/treatment.md#entity-behandlungsverlauf-treatment) | object | autocomplete | `RoomService.autocompleteAvailableRooms` | No | No | Display: `name` |
| Day | Tag | `data.day` | `treatment.day` | [treatment.md#entity-behandlungsverlauf-treatment](../mongodb-mapping/treatment.md#entity-behandlungsverlauf-treatment) | enum | select | MO-SU | No | No | — |
| Hour | Stunde | `data.hour` | `treatment.hour` | [treatment.md#entity-behandlungsverlauf-treatment](../mongodb-mapping/treatment.md#entity-behandlungsverlauf-treatment) | number | select | 1–24 | No | No | — |
| Minutes | Minuten | `data.minutes` | `treatment.minutes` | [treatment.md#entity-behandlungsverlauf-treatment](../mongodb-mapping/treatment.md#entity-behandlungsverlauf-treatment) | number | select | 00, 15, 30, 45 | No | No | — |
| Comment | Kommentar | `data.comment` | `treatment.comment` | [treatment.md#entity-behandlungsverlauf-treatment](../mongodb-mapping/treatment.md#entity-behandlungsverlauf-treatment) | string | textarea | — | No | No | — |

### 28.3 Column 3 — Counts & Report Config

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| Finished / Planned | Abgeschlossen / Geplant | `data.countFinished` / `data.countPlanned` | `treatment.countFinished` / `treatment.countPlanned` | [treatment.md#entity-behandlungsverlauf-treatment](../mongodb-mapping/treatment.md#entity-behandlungsverlauf-treatment) | string | span (display) | — | — | Yes | "Termine" HARDCODED DE |
| Planned Count | Geplant (editierbar) | `data.countPlanned` | `treatment.countPlanned` | [treatment.md#entity-behandlungsverlauf-treatment](../mongodb-mapping/treatment.md#entity-behandlungsverlauf-treatment) | number | number input | — | No | No | Editable count |
| Probatory Report Job | Probatorisch Leistung | `data.jobReportPobatorik` | `treatment.__ref_snapshot_jobReportProbatorik` | [treatment.md#entity-behandlungsverlauf-treatment](../mongodb-mapping/treatment.md#entity-behandlungsverlauf-treatment) | object | autocomplete | `JobService.autocompleteType("APPOINTMENT")` | No | No | — |
| Report Initial Count | Bericht Anfang | `data.reportCountInitial` | `treatment.reportCountInitial` | [treatment.md#entity-behandlungsverlauf-treatment](../mongodb-mapping/treatment.md#entity-behandlungsverlauf-treatment) | number | number input | — | No | No | — |
| Report Rhythm | Bericht Rhythmus | `data.reportCountRhytm` | `treatment.reportCountRhytm` | [treatment.md#entity-behandlungsverlauf-treatment](../mongodb-mapping/treatment.md#entity-behandlungsverlauf-treatment) | number | number input | — | No | No | — |
| Report Job | Leistung Bericht | `data.jobReport` | `treatment.__ref_snapshot_jobReport` | [treatment.md#entity-behandlungsverlauf-treatment](../mongodb-mapping/treatment.md#entity-behandlungsverlauf-treatment) | object | autocomplete | `JobService.autocompleteType("SHIFT")` | No | No | — |
| Last Appointment | Letzter Termin | `data.dateLastAppointment` | `treatment.dateLastAppointment` | [treatment.md#entity-behandlungsverlauf-treatment](../mongodb-mapping/treatment.md#entity-behandlungsverlauf-treatment) | date | date input | — | No | No | — |
| Closed | Geschlossen | `data.closed` | `treatment.closed` | [treatment.md#entity-behandlungsverlauf-treatment](../mongodb-mapping/treatment.md#entity-behandlungsverlauf-treatment) | date | date input | — | No | No | — |
| Reporting Path | Upload-Pfad | `data.reportingPath` | `treatment.reportingPath` | [treatment.md#entity-behandlungsverlauf-treatment](../mongodb-mapping/treatment.md#entity-behandlungsverlauf-treatment) | string | text input + Test button | — | No | No | Test calls `TreatmentService.testUpload` |
| Archived | Archiviert | `data.archived` | `treatment.archived` | [treatment.md#entity-behandlungsverlauf-treatment](../mongodb-mapping/treatment.md#entity-behandlungsverlauf-treatment) | boolean | checkbox | — | No | No | — |

### 28.4 Positions Collection

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| # | # | `positions.$idx` | — | — | number | span (auto-index) | — | — | Yes | Row number |
| Date | Datum | `positions.date` | `treatment.positions[].date` | [treatment.md#sub-entity-treatmentposition](../mongodb-mapping/treatment.md#sub-entity-treatmentposition) | date | date input | — | Yes | No | HARDCODED DE header; class `suggestType` |
| Start | Start | `positions.timeStart` | `treatment.positions[].timeStart` | [treatment.md#sub-entity-treatmentposition](../mongodb-mapping/treatment.md#sub-entity-treatmentposition) | time | clockpicker | — | Yes | No | HARDCODED DE header; linked to timeEnd |
| End | Ende | `positions.timeEnd` | `treatment.positions[].timeEnd` | [treatment.md#sub-entity-treatmentposition](../mongodb-mapping/treatment.md#sub-entity-treatmentposition) | time | clockpicker | — | Yes | No | HARDCODED DE header; auto-adjusts on start change |
| Status | Status | `positions.state` | `treatment.positions[].state` | [treatment.md#sub-entity-treatmentposition](../mongodb-mapping/treatment.md#sub-entity-treatmentposition) | enum | span (color-coded) | AppointmentState | — | Yes | Uses `appointmentState()` formatter |
| Force Report | Bericht | `positions.forceReport` | `treatment.positions[].forceReport` | [treatment.md#sub-entity-treatmentposition](../mongodb-mapping/treatment.md#sub-entity-treatmentposition) | boolean | checkbox | — | No | No | HARDCODED DE header; title "verpflichtend" (has typo in legacy) |
| Require Report | — | `positions.requireReport` | `treatment.positions[].requireReport` | [treatment.md#sub-entity-treatmentposition](../mongodb-mapping/treatment.md#sub-entity-treatmentposition) | boolean | formatted display | — | — | Yes | — |
| Report Start | — | `positions.report.dateStart` | `treatment.positions[].report.dateStart` | [treatment.md#sub-entity-treatmentposition](../mongodb-mapping/treatment.md#sub-entity-treatmentposition) | datetime | span (conditional) | — | — | Yes | Visible if `report.consultationId` exists |
| Report End | — | `positions.report.dateEnd` | `treatment.positions[].report.dateEnd` | [treatment.md#sub-entity-treatmentposition](../mongodb-mapping/treatment.md#sub-entity-treatmentposition) | time | span (conditional) | — | — | Yes | — |

### 28.5 Attachments Collection

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| File | Datei | `attachments.file.name` | `treatment.attachments[].file.name` | [treatment.md#sub-entity-treatmentattachment](../mongodb-mapping/treatment.md#sub-entity-treatmentattachment) | string | link | — | — | Yes | URL: `/get/TreatmentService/attachment/{treatmentId}/{fileId}/{fileName}` |
| Delete | Löschen | — | — | — | action | icon button | — | — | — | Confirm → `TreatmentService.removeFile(treatmentId, fileId)` |
| Upload | Datei hochladen | — | — | — | action | file upload button | — | — | — | `TreatmentService.upload([treatmentId])`; HARDCODED DE title |

### 28.6 Edit Dialog Actions

| Action (EN) | Action (DE) | Trigger | API Call | Notes |
|---|---|---|---|---|
| Save | Speichern | `saveTreatement` event | `TreatmentService.save(data)` + `asyncExecutorProgress` | Note typo in event name: "saveTreatement" |
| Storno | Storno | `stornoTreatment` event | `TreatmentService.storno(id)` | Confirm: "Wirklich stornieren?" (HARDCODED DE) |
| Cancel/End | Beenden/Abbruch | `cancelTreatment` event | `TreatmentService.cancel(id)` | Confirm: "Wirklich durch Arzt abbrechen?" (HARDCODED DE) |
| Close | Abbrechen | `cancel` event | — | Close without saving |

---

## 29. Medication (simple CRUD)

**Source**: [medication/01-medication.md](medication/01-medication.md)
**Service**: `MedicationService` (get, getAll, save, delete)
**Collection**: `medication` (in external-data)
**Pattern**: `slickerGrid` + off-canvas detail CRUD

### 29.1 Grid Columns (14)

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| ID | ID | `data.id` | `medication._id` | [external-data.md#entity-medikamente-medication](../mongodb-mapping/external-data.md#entity-medikamente-medication) | number | grid column | — | — | Yes | PK |
| Entry Number | Eingangsnummer | `data.entryNumber` | `medication.entryNumber` | [external-data.md#entity-medikamente-medication](../mongodb-mapping/external-data.md#entity-medikamente-medication) | number | grid column (80px) | — | — | — | — |
| Name | Name | `data.name` | `medication.name` | [external-data.md#entity-medikamente-medication](../mongodb-mapping/external-data.md#entity-medikamente-medication) | string | grid column (80px) | — | — | — | — |
| Unit | Einheit | `data.unit` | `medication.unit` | [external-data.md#entity-medikamente-medication](../mongodb-mapping/external-data.md#entity-medikamente-medication) | enum | grid column (80px) | MedicationUnit | — | — | — |
| Target Group | Zielgruppe | `data.targetGroup` | `medication.targetGroup` | [external-data.md#entity-medikamente-medication](../mongodb-mapping/external-data.md#entity-medikamente-medication) | string | grid column (80px) | — | — | — | — |
| Usage | Anwendung | `data.usage` | `medication.usage` | [external-data.md#entity-medikamente-medication](../mongodb-mapping/external-data.md#entity-medikamente-medication) | string | grid column (80px) | — | — | — | — |
| Application Area | Anwendungsgebiet | `data.applicationArea` | `medication.applicationArea` | [external-data.md#entity-medikamente-medication](../mongodb-mapping/external-data.md#entity-medikamente-medication) | string | grid column (80px) | — | — | — | — |
| Approval Status | Zulassungsstatus | `data.approvalStatus` | `medication.approvalStatus` | [external-data.md#entity-medikamente-medication](../mongodb-mapping/external-data.md#entity-medikamente-medication) | string | grid column (80px) | — | — | — | — |
| Trafficability | Verkehrsfähigkeit | `data.trafficability` | `medication.trafficability` | [external-data.md#entity-medikamente-medication](../mongodb-mapping/external-data.md#entity-medikamente-medication) | boolean | grid column (formatted) | — | — | — | Formatter: `Formatter.bool` |
| Producer | Hersteller | `data.producer` | `medication.producer` | [external-data.md#entity-medikamente-medication](../mongodb-mapping/external-data.md#entity-medikamente-medication) | string | grid column (80px) | — | — | — | — |
| Authorisation Holder | Zulassungsinhaber | `data.authorisationHolder` | `medication.authorisationHolder` | [external-data.md#entity-medikamente-medication](../mongodb-mapping/external-data.md#entity-medikamente-medication) | string | grid column (80px) | — | — | — | — |
| Active Ingredients | Wirkstoffe | `data.activeIngedients` | `medication.activeIngredients` | [external-data.md#entity-medikamente-medication](../mongodb-mapping/external-data.md#entity-medikamente-medication) | string | grid column (80px) | — | — | — | Legacy field typo: `activeIngedients` (missing 'r') |
| Package Size | Packungsgröße | `data.packageSize` | `medication.packageSize` | [external-data.md#entity-medikamente-medication](../mongodb-mapping/external-data.md#entity-medikamente-medication) | string | grid column (80px) | — | — | — | — |
| AM Classification | AM-Klassifikation | `data.amClassification` | `medication.amClassification` | [external-data.md#entity-medikamente-medication](../mongodb-mapping/external-data.md#entity-medikamente-medication) | string | grid column (80px) | — | — | — | — |

### 29.2 Detail Form

Same fields as grid, all editable. Additional details:

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| Unit | Einheit | `data.unit` | `medication.unit` | [external-data.md#entity-medikamente-medication](../mongodb-mapping/external-data.md#entity-medikamente-medication) | enum | select | PIECE (`MedicationUnit.PIECE`), IE (`MedicationUnit.IE`) | No | No | — |
| Trafficability | Verkehrsfähigkeit | `data.trafficability` | `medication.trafficability` | [external-data.md#entity-medikamente-medication](../mongodb-mapping/external-data.md#entity-medikamente-medication) | boolean | checkbox (switch) | — | No | No | — |

All other detail fields are text inputs without validation or required constraints.

### 29.3 MedicationUnit Enum

| Value | DE | EN |
|---|---|---|
| `PIECE` | Stück | Piece |
| `IE` | IE | IE (International Unit) |

---

## 30. Patient Data

**Source**: [patient-data/01-patient-data.md](patient-data/01-patient-data.md)
**Service**: `PatientDataService` (get, getAll, save, delete, upload, removeFile)
**Collection**: `patientData`
**Pattern**: `slickerGrid` + detail form with file attachments

### 30.1 Grid Columns

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| ID | ID | `data.id` | `patientData._id` | [treatment.md#entity-patientenergänzungsdaten-patient-data](../mongodb-mapping/treatment.md#entity-patientenergänzungsdaten-patient-data) | number | grid column (40px) | — | — | Yes | PK |
| Appointment ID | Termin-ID | `data.appointmentId` | `patientData.appointmentId` | [treatment.md#entity-patientenergänzungsdaten-patient-data](../mongodb-mapping/treatment.md#entity-patientenergänzungsdaten-patient-data) | number | grid column (80px) | — | — | Yes | — |
| Book Number | Buchnummer | `data.bookNumber` | `patientData.booknumber` | [treatment.md#entity-patientenergänzungsdaten-patient-data](../mongodb-mapping/treatment.md#entity-patientenergänzungsdaten-patient-data) | string | grid column (100px) | — | — | — | — |
| J-Number | J-Nummer | `data.jNumber` | `patientData.jNumber` | [treatment.md#entity-patientenergänzungsdaten-patient-data](../mongodb-mapping/treatment.md#entity-patientenergänzungsdaten-patient-data) | string | grid column (80px) | — | — | — | HARDCODED label |
| Closed | Geschlossen | `data.closed` | `patientData.closed` | [treatment.md#entity-patientenergänzungsdaten-patient-data](../mongodb-mapping/treatment.md#entity-patientenergänzungsdaten-patient-data) | datetime | grid column (100px, formatted) | — | — | — | Formatter: `Formatter.dateTime` |
| Attachments | Anhänge | `data.attachments` | `patientData.attachments` | [treatment.md#entity-patientenergänzungsdaten-patient-data](../mongodb-mapping/treatment.md#entity-patientenergänzungsdaten-patient-data) | number | grid column (80px) | — | — | Yes | Attachment count |

### 30.2 Detail Form

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| Book Number | Buchnummer | `data.bookNumber` | `patientData.booknumber` | [treatment.md#entity-patientenergänzungsdaten-patient-data](../mongodb-mapping/treatment.md#entity-patientenergänzungsdaten-patient-data) | string | text input | — | No | No | Input-group with label prefix |
| J-Number | J-Nummer | `data.jNumber` | `patientData.jNumber` | [treatment.md#entity-patientenergänzungsdaten-patient-data](../mongodb-mapping/treatment.md#entity-patientenergänzungsdaten-patient-data) | string | text input | — | No | No | HARDCODED label; tooltip: "JNumber used to get the bookNumber" |
| Appointment ID | Termin-ID | `data.appointmentId` | `patientData.appointmentId` | [treatment.md#entity-patientenergänzungsdaten-patient-data](../mongodb-mapping/treatment.md#entity-patientenergänzungsdaten-patient-data) | number | number input | — | No | No | Tooltip: "for what appointment is the data" |
| Closed | Geschlossen | `data.closed` | `patientData.closed` | [treatment.md#entity-patientenergänzungsdaten-patient-data](../mongodb-mapping/treatment.md#entity-patientenergänzungsdaten-patient-data) | date | date input | — | No | No | Calendar icon |

### 30.3 File Attachments

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| File Name | Dateiname | `attachments.file.name` | `patientData.attachments[].file.name` | [treatment.md#entity-patientenergänzungsdaten-patient-data](../mongodb-mapping/treatment.md#entity-patientenergänzungsdaten-patient-data) | string | link | — | — | Yes | URL: `/get/PatientDataService/attachment/{dataId}/{fileId}/{fileName}` |
| Upload | Hochladen | — | — | — | action | file upload | — | — | — | `PatientDataService.upload([data.id])` |
| Remove File | Datei löschen | — | — | — | action | icon button (trash) | — | — | — | Confirm → `PatientDataService.removeFile(dataId, attachmentId)` |

---

## 31. Appointment Details — Patient Tab

**Source**: [appointment-patient/02-appointment-details-patient.md](appointment-patient/02-appointment-details-patient.md)
**Context**: Tab 3 within the shared `appointment/details.html` panel
**Pattern**: Add patient input + patients collection + treatments collection + patient data dialog

### 31.1 Add Patient Input

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| Book Number | Patientennummer | (input value) | — | — | string | text input | — | No | No | Placeholder: `patient.number`; Add button calls `PatientDataService.save({appointmentId, bookNumber})` |

### 31.2 Patients Collection

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| Title | Titel | `patients.title` | `patientData.title` | [treatment.md#entity-patientenergänzungsdaten-patient-data](../mongodb-mapping/treatment.md#entity-patientenergänzungsdaten-patient-data) | string | display | — | — | Yes | Patient identifier |
| Only Documentation | Nur Dokumentation | `patients.onlyDocumentation` | `patientData.onlyDocumentation` | [treatment.md#entity-patientenergänzungsdaten-patient-data](../mongodb-mapping/treatment.md#entity-patientenergänzungsdaten-patient-data) | boolean | icon (checkmark or empty) | — | — | Yes | — |
| Closed | Geschlossen | `patients.closed` | `patientData.closed` | [treatment.md#entity-patientenergänzungsdaten-patient-data](../mongodb-mapping/treatment.md#entity-patientenergänzungsdaten-patient-data) | datetime | display | — | — | Yes | — |
| Location | Standort | `patients.location.name` | `patientData.location.name` | [treatment.md#entity-patientenergänzungsdaten-patient-data](../mongodb-mapping/treatment.md#entity-patientenergänzungsdaten-patient-data) | string | display | — | — | Yes | — |
| Edit | Bearbeiten | — | — | — | action | icon button | — | — | — | Opens `patientDataDlg` with `PatientDataService.get` |
| Remove | Entfernen | — | — | — | action | icon button | — | — | — | Confirm → `PatientDataService.remove` |

### 31.3 Treatments Collection

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| Title | Titel | `treatments.title` | (joined) | — | string | display | — | — | Yes | Treatment identifier |
| Edit | Bearbeiten | — | — | — | action | icon button | — | — | — | Handler not analyzed |

### 31.4 Patient Data Dialog (`patientDataDlg`)

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| Book Number | Buchnummer | `data.bookNumber` | `patientData.booknumber` | [treatment.md#entity-patientenergänzungsdaten-patient-data](../mongodb-mapping/treatment.md#entity-patientenergänzungsdaten-patient-data) | string | text input | — | No | No | — |
| J-Number | J-Nummer | `data.jNumber` | `patientData.jNumber` | [treatment.md#entity-patientenergänzungsdaten-patient-data](../mongodb-mapping/treatment.md#entity-patientenergänzungsdaten-patient-data) | string | text input | — | No | No | — |
| Location | Standort | `data.location` | `patientData.location` | [treatment.md#entity-patientenergänzungsdaten-patient-data](../mongodb-mapping/treatment.md#entity-patientenergänzungsdaten-patient-data) | object | autocomplete | `LocationService.autocomplete` | Conditional | No | Mandatory only for `.council` class; toggles with `jobSupport` checkbox |
| Closed | Geschlossen | `data.closed` | `patientData.closed` | [treatment.md#entity-patientenergänzungsdaten-patient-data](../mongodb-mapping/treatment.md#entity-patientenergänzungsdaten-patient-data) | date | datepicker | — | No | No | — |

### 31.5 Attachments Sub-Collection (within `patientDataDlg`)

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| File Name | Dateiname | `attachments.file.name` | `patientData.attachments[].file.name` | [treatment.md#entity-patientenergänzungsdaten-patient-data](../mongodb-mapping/treatment.md#entity-patientenergänzungsdaten-patient-data) | string | link | — | — | Yes | Download URL template |
| Transmit | Übermitteln | `attachments.attach` | `patientData.attachments[].attach` | [treatment.md#entity-patientenergänzungsdaten-patient-data](../mongodb-mapping/treatment.md#entity-patientenergänzungsdaten-patient-data) | boolean | checkbox | — | No | No | Transmit flag |
| Comment | Kommentar | `attachments.comment` | `patientData.attachments[].comment` | [treatment.md#entity-patientenergänzungsdaten-patient-data](../mongodb-mapping/treatment.md#entity-patientenergänzungsdaten-patient-data) | string | text input | — | No | No | Free text |
| Delete | Löschen | — | — | — | action | icon button (trash) | — | — | — | `PatientDataService.removeFile(dataId, fileId)` |
| Upload | Hochladen | — | — | — | action | file upload | — | — | — | `PatientDataService.upload` |

---

## 32. Consultation Wizard

**Source**: [dashboard/05-consultation-wizard.md](dashboard/05-consultation-wizard.md)
**Dialog IDs**: `#consultationWizard` (600 px, modal), `#consultationLocationWizard` (600 px, modal)
**Pattern**: 4-step wizard creating a new consultation via `ConsultationService.start`

### 32.1 Step 1 — Patient Selection (`cw-start`)

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| Patient | Patient | `data.bookNumberSelect` | — | — | string | select | Populated from `appointment.patients[]` (bookNumber or jNumber) | Yes | No | Skip to step 2 if no patients; validation: length > 3 |

### 32.2 Step 2 — Manual Book Number (`cw-booknumber`)

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| Book Number | Buchnummer | `data.booknumber` | — | — | string | text input (masked) | — | Yes | No | Placeholder: `consultation.booknumber`; dynamic mask from `location.booknumberMask`; validation: length > 3 |

### 32.3 Step 3 — Consultation Type (`cw-type`)

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| Consultation Type | Konsultationstyp | `data.consultationtype` | — | — | enum | select | EXTERNAL, DOCUMENT, STANDARD, INCARCERATION, ONBOARDING, ONBOARDING_SHORT, TREATMENT | Yes | No | Filtered by job capabilities; default from `job.defaultConsultation` |

### 32.4 Step 4 — Summary & Confirm (`cw-success`)

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| Appointment | Termin | `data.appointment.job.expertTitle` | — | — | string | span (display) | — | — | Yes | — |
| Location | Standort | `data.location.name` | — | — | string | span (display) | — | — | Yes | — |
| Book Number | Buchnummer | `data.booknumber` | — | — | string | span (display) | — | — | Yes | — |
| Consultation Type | Konsultationstyp | `data.type` | — | — | enum | select (pre-selected, display) | — | — | Yes | — |

### 32.5 Location Wizard (pre-step)

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| Location | Standort | `data.location` | — | — | object | autocomplete | `LocationService.autocomplete` (display: `name`) | Yes | No | Shown only when location is missing; icon: `fa-compass` |

### 32.6 Final Submit

| Action | API Call | Parameters | Post-Action |
|---|---|---|---|
| Confirm (Next on step 4) | `ConsultationService.start` | `[appointment.id, location, job, booknumber, null, type]` | Creates `consultationData` document; closes wizard; opens ConsultationDetails; triggers reload |

### 32.7 Consultation Type Filtering Rules

| Type | Hidden When |
|---|---|
| `EXTERNAL` | `location.patientDataType !== "EXTERNAL"` |
| `STANDARD` | `!job.consultationStandard` |
| `ONBOARDING` | `!job.consultationOnboarding` |
| `ONBOARDING_SHORT` | `!job.consultationOnboardingShort` |
| `DOCUMENT` | `!job.consultationDocument` |
| `INCARCERATION` | `!job.consultationIncarceration` |
| `TREATMENT` | `!appointment.treatmentId` |

---

## 33. Consultation Template CRUD

**Source**: [dashboard/07-consultation-template.md](dashboard/07-consultation-template.md)
**Service**: `ExpertConsultationTemplateService` (getAll, get, save, remove)
**Collection**: `expertConsultationTemplate`
**Pattern**: Secondary panel list + modal create dialog

### 33.1 Template List

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| Filter | Filter | `#consultationTemplateFilter` | — | — | string | text input | — | No | No | Prefix search on `name`; icon: `fa-search` |
| Name | Name | `templates.name` | `expertConsultationTemplate.name` | [treatment.md#entity-konsultationsvorlagen-expert-consultation-templates](../mongodb-mapping/treatment.md#entity-konsultationsvorlagen-expert-consultation-templates) | string | display (bold) | — | — | Yes | — |
| Description | Beschreibung | `templates.description` | `expertConsultationTemplate.description` | [treatment.md#entity-konsultationsvorlagen-expert-consultation-templates](../mongodb-mapping/treatment.md#entity-konsultationsvorlagen-expert-consultation-templates) | string | display | — | — | Yes | — |

### 33.2 Create Dialog

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| Name | Name | `data.name` | `expertConsultationTemplate.name` | [treatment.md#entity-konsultationsvorlagen-expert-consultation-templates](../mongodb-mapping/treatment.md#entity-konsultationsvorlagen-expert-consultation-templates) | string | text input | — | Yes | No | Input-group with `label.name` prefix |
| Description | Beschreibung | `data.description` | `expertConsultationTemplate.description` | [treatment.md#entity-konsultationsvorlagen-expert-consultation-templates](../mongodb-mapping/treatment.md#entity-konsultationsvorlagen-expert-consultation-templates) | string | textarea | — | No | No | Placeholder: `label.description` |

### 33.3 Actions

| Action (EN) | Action (DE) | Trigger | API Call | Post-Action |
|---|---|---|---|---|
| Create | Erstellen | `#addConsultationBtn` click → save in modal | `ExpertConsultationTemplateService.save([data])` | Refreshes list; opens `ConsultationDetails` with `template=true` |
| Edit | Bearbeiten | `.edit` button per row | `ExpertConsultationTemplateService.get([id])` | Opens `ConsultationDetails` with `template=true` |
| Remove | Entfernen | `.remove` button per row | `ExpertConsultationTemplateService.remove([id])` | Confirm dialog; refreshes list |

---

## 34. End Appointment Dialog

**Source**: [dashboard/04-dialogs-treatment.md](dashboard/04-dialogs-treatment.md)
**Dialog ID**: `#endAppointmentDlg` — 900 px
**Pattern**: Workflow dialog — ends appointment via `AppointmentService.done`

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| Start Time | Startzeit | `data.timeStart` | — (workflow field) | — | time | clockpicker | — | Yes | No | Icon: `fa-play`; title: `action.dateStart` |
| End Time | Endzeit | `data.timeEnd` | — (workflow field) | — | time | clockpicker | — | Yes | No | Icon: `fa-stop`; title: `action.dateEnd` |
| QM Questionnaire | QM-Fragebogen | (embedded `detailQuestionaire`) | → `serviceQm.*` | [treatment.md#entity-service-qualitätsmanagement-service-qm](../mongodb-mapping/treatment.md#entity-service-qualitätsmanagement-service-qm) | embedded form | QM form (see §23) | — | — | No | Full QM questionnaire partial with `filterQm()` applied |

**Static text**: `operation.ended.text` (confirmation) + `correct.the.time.text` (instruction)

### 34.1 Submit Action

| Action | API Call | Parameters | Post-Action |
|---|---|---|---|
| Save | `AppointmentService.done` | `[id, timeStart, timeEnd, qm]` | Triggers reload; on error re-opens dialog with previous `qm` data |

---

## 35. Summarize Appointment Dialog

**Source**: [dashboard/04-dialogs-treatment.md](dashboard/04-dialogs-treatment.md)
**Dialog ID**: `#summarizeAppointmentDlg` — 1000 px
**Pattern**: Workflow dialog — summarizes external-location appointment via `AppointmentService.summarize`

### 35.1 Display Fields (read-only)

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| Weekday | Wochentag | `data.appointment.weekday` | — (joined) | — | string | span (display) | — | — | Yes | — |
| Date | Datum | `data.appointment.date` | — (joined) | — | date | span (display) | — | — | Yes | — |
| Start Time | Startzeit | `data.appointment.timeStart` | — (joined) | — | time | span (display) | — | — | Yes | Original time |
| End Time | Endzeit | `data.appointment.timeEnd` | — (joined) | — | time | span (display) | — | — | Yes | Original time |
| Location | Standort | `data.appointment.location.name` | — (joined) | — | string | span (display) | — | — | Yes | — |

### 35.2 Editable Fields

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| Adjusted Start | Korrigierte Startzeit | `data.summary.adjustedStart` | — (workflow field) | — | time | clockpicker | — | Yes | No | — |
| Adjusted End | Korrigiertes Ende | `data.summary.adjustedUntil` | — (workflow field) | — | time | clockpicker | — | Yes | No | HARDCODED label "Ende" |
| Communication Type | Verbindungsart | `data.summary.communicationType` | — (workflow field) | — | enum | select | VIDEO, VCGO, PHONE, EMAIL | Yes | No | — |
| Referral Count | Krankenhauseinweisung | `data.summary.referral` | — (workflow field) | — | number | number input | — | No | No | — |
| Re-presentation Count | WV | `data.summary.ifRequired` | — (workflow field) | — | number | number input | — | No | No | HARDCODED label "WV" (Wiedervorstellung) |
| Follow-up Count | Folgetermin | `data.summary.followUp` | — (workflow field) | — | number | number input | — | No | No | — |
| Referral Other Count | Überweisung | `data.summary.referralOther` | — (workflow field) | — | number | number input | — | No | No | HARDCODED label "Überweisung" |
| Total | Summe | `data.summary.total` | — (computed) | — | number | span (computed) | — | — | Yes | Auto-sum of all `.summary input` values; HARDCODED label "Summe" |
| QM Questionnaire | QM-Fragebogen | (embedded `detailQuestionaire`) | → `serviceQm.*` | [treatment.md#entity-service-qualitätsmanagement-service-qm](../mongodb-mapping/treatment.md#entity-service-qualitätsmanagement-service-qm) | embedded form | QM form (see §23) | — | — | No | Full QM questionnaire with `filterQm()` |

### 35.3 Submit Action

| Action | API Call | Parameters | Post-Action |
|---|---|---|---|
| Save | `AppointmentService.summarize` | `[data]` (full summary object) | Confirm dialog with total count (HARDCODED DE text); triggers reload; closes dialog |

### 35.4 CommunicationType Enum

| Value | DE | EN |
|---|---|---|
| `VIDEO` | Video | Video |
| `VCGO` | VC to Go | VC to Go |
| `PHONE` | Telefon | Phone |
| `EMAIL` | E-Mail | E-Mail |

---

## 36. Incarceration Check Dialog

**Source**: [dashboard/04-dialogs-treatment.md](dashboard/04-dialogs-treatment.md)
**Dialog ID**: `#consultationIncarcerationCheck` — modal
**Pattern**: Verification step before incarceration retrieval

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| Book Number | Buchnummer | `data.bookNumber` | — (workflow input) | — | string | text input | — | Yes | No | Icon: `fa-user-injured`; placeholder: `consultation.booknumber` |
| Code | Code | `data.code` | — (workflow input) | — | string | text input | — | Yes | No | Icon: `fa-key`; placeholder: `consultation.code` |

### 36.1 Submit Action

| Action | API Call | Parameters | Post-Action |
|---|---|---|---|
| Save | `ConsultationService.checkCustomer` | `[bookNumber, code]` | Opens `#consultationIncarceration` dialog with result data |

---

## 37. Incarceration Prepare Dialog

**Source**: [dashboard/04-dialogs-treatment.md](dashboard/04-dialogs-treatment.md)
**Dialog ID**: `#consultationIncarceration` — modal
**Pattern**: Address form for incarceration retrieval → `ConsultationService.prepareCustomer`

### 37.1 Read-only Fields

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| Book Number | Buchnummer | `data.bookNumber` | — (from check step) | — | string | text input | — | — | Yes | `readonly`; icon: `fa-user-injured` |
| Code | Code | `data.code` | — (from check step) | — | string | text input | — | — | Yes | `readonly`; icon: `fa-key` |
| Previous Retrieval Warning | Vorherige Abfrage | `data.dateRetrieved` | — | — | datetime | alert (danger) | — | — | Yes | Conditional: shown if `dateRetrieved` is truthy; HARDCODED DE: "Dieser Datensatz wurde bereits am {date} abgefragt!" |

### 37.2 Address Form

| UI Field Label (EN) | UI Field Label (DE) | Data Path | MongoDB Path | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| Name | Vorname Nachname | `data.target.name` | — (workflow field) | — | string | text input | — | Yes | No | Placeholder: `contact.firstName contact.lastName` |
| Address | Straße | `data.target.address` | — (workflow field) | — | string | text input | — | Yes | No | Placeholder: `contact.street` |
| Address 2 | Adresszusatz | `data.target.address2` | — (workflow field) | — | string | text input | — | No | No | Placeholder: `contact.street2` |
| Zip Code | PLZ | `data.target.zip` | — (workflow field) | — | string | text input | — | Yes | No | Placeholder: `contact.zipcode`; class `searchZipCode` for auto-lookup |
| State | Bundesland | `data.target.state` | — (workflow field) | — | string | text input | — | No | No | Placeholder: `contact.state` |
| City | Stadt | `data.target.city` | — (workflow field) | — | string | text input | — | Yes | No | Placeholder: `contact.city` |
| Country | Land | `data.target.country` | — (workflow field) | — | string | text input | — | No | No | Placeholder: `contact.country` |
| Address Info | Zusatztext Adresse | `data.target.addressInfo` | — (workflow field) | — | string | textarea | — | No | No | HARDCODED DE placeholder: "Zusatztext Adresse" |

### 37.3 Submit Action

| Action | API Call | Parameters | Post-Action |
|---|---|---|---|
| Save | `ConsultationService.prepareCustomer` | `[bookNumber, code, target]` | Opens `#jobStatusDlg` with download link to PDF: `/get/ConsultationService/retrieve/{id}/{name}.pdf` |
</task_result>