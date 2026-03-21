| Input element | Type | Options | Datamodel | German | English | i18n-key | Usecase |
|---------------|------|---------|-----------|--------|---------|----------|---------|
| input | input |  | data.bookNumber | Buchnummer | Book number | consultation.booknumber | Consultation Header/Base |
| select | select | :Geschlecht; FEMALE:Gender.FEMALE; MALE:Gender.MALE; OTHER:Gender.OTHER | data.body.gender | Geschlecht | Gender | user.gender | Consultation Header/Base |
| input | date |  | data.body.birthday | Geburtstag | patient birthday | patient.birthday | Consultation Header/Base |
| input | number |  | data.body.age | Alter | Age | patient.age | Consultation Header/Base |
| input | date |  | data.date | Tag der Behandlung | Day of Consultation | consultation.startDate | Consultation Header/Base |
| input | time |  | data.start | Start der Behandlung | Start of consultation | consultation.startTime | Consultation Header/Base |
| input | input |  | data.room | Räume | Room | equipment.room | Consultation Header/Base |
| input | time |  | data.base.contact | Erstkontakt | First Contact | consultation.timeContact | Consultation Header/Base |
| select | select | EXTERNAL:Extern; DOCUMENT:Konsiliarbericht; STANDARD:Normale Konsultation; INCARCERATION:Gewahrsamstauglichkeit; ONBOARDING:Komplette Zugangsuntersuchung; TREATMENT:Therapie | data.type |  |  | label.type | Consultation Header/Base |
| input | input |  | data.doctor | Behandelnder Arzt | Treating doctor | consultation.doctor | Consultation Header/Base |
| select | select | :Verbindungsart; VIDEO:Video; VCGO:VC to Go (Tablet); PHONE:Telefon; EMAIL:E-Mail | data.base.communicationType | Verbindungsart | connection type | CommunicationType | Consultation Header/Base |
| input | boolean |  | data.base.medicalTrainedPersonel | E-Mail | E-Mail | CommunicationType.email | Consultation Header/Base |
| textarea | textarea |  | data.document.documentation |  |  |  | Consultation Header/Base |
| input | time |  | data.end | Ende | End | consultation.end | Consultation Header/Base |
| input | radio |  | data.requireReporting | Möchten Sie, dass Ihr Fall an die Ärztliche Leitung der Videoclinic zur Einsicht weitergegeben wird? | Would you like your case to be forwarded to the medical management of the video clinic for review? | Questionaire.requireReporting | Consultation Header/Base |
| input | radio |  | data.requireReporting |  |  | label.yes | Consultation Header/Base |
| textarea | textarea |  | data.comment |  |  | label.comment | Consultation Header/Base |
| input | boolean |  | data.referral.referPsychotherapy | Psychotherapie empfohlen | Psychotherapy recommended | consultation.furtherTreatment.referPsychotherapy | Consultation Header/Base |
| textarea | textarea |  | data.referral.psychoTherapy.comment | Grund | Resoning | consultation.reasoning | Consultation Header/Base |
| select | select | :WB/Weitere Behandlung; REFERRAL:Einweisung; IF_REQUIRED:Wiedervorstellung bei Verschlechterung oder Persistenz; FOLLOW_UP:Folgetermin; REFERRAL_OTHER:Überweisung | data.base.furtherTreatment | Hinweis: Erhebung für interne Zwecke - wird nicht in Dokumentation angezeigt | Note: Collection for internal purposes - will not appear in documentation | consultation.furtherTreatment.referPsychotherapy.notice | Consultation Header/Base |
| input | date |  | data.base.dateFurtherTreatment | Folgetermin Datum |  | consultation.furtherTreatmentDate | Consultation Header/Base |
| select | select | : | data.standard.referralTo | Folgetermin Datum |  | consultation.furtherTreatmentDate | Standard Consultation |
| input | text |  | filter.bookNumber | Buchnummer | Book number | consultation.booknumber | Consultation Header/Base |
| input | input |  | filter.location | Ort | Location | location | Consultation Header/Base |
| input | date |  | filter.dateStart | Von | from | dateFilter.fromDate | Consultation Header/Base |
| input | date |  | filter.dateEnd | Bis | to | dateFilter.toDate | Consultation Header/Base |
| input | input |  | search |  |  | dialog.cancel | Consultation Header/Base |
| input | input |  | search |  |  | dialog.cancel | Consultation Header/Base |
| select | select | :-; INCARCERATION:Gewahrsamfähigkeit; LIABILITY:Haftfähigkeit | data.incarceration.type | Typ | Type | consultation.incarceration.type | Incarceration |
| select | boolean | :-; true:label.yes; false:label.no | data.incarceration.examinationCapability | Anhörungsfähig | Hearing-capable | consultation.incarceration.ableToBeHeard | Incarceration |
| select | boolean | :-; true:label.yes; false:label.no | data.incarceration.incarcerationCapability | Gewahrsamsfähig | Custodial capacity | consultation.incarceration.incarcerationCapability.yes | Incarceration |
| textarea | OWN |  | data.incarceration.incarcerationCapabilityComment | Gewahrsamsfähig unter Einhaltung folgender Maßgaben | Custody subject to compliance with the following conditions | consultation.incarceration.incarcerationCapability.desc | Incarceration |
| select | select | :-; HALF_HOUR:2x pro Stunde; HOURLY:1x pro Stunde; TWO_HOUR:1x in 2 Stunden | data.incarceration.checkupRequirement | Kontroll Intervall | Control interval | consultation.incarceration.checkupRequirement | Incarceration |
| input | number |  | data.incarceration.healthImprovementTime | Stunden | Hours | consultation.incarceration.intervallCheck.hours | Incarceration |
| input | number |  | data.incarceration.improvementControlInterval | Kontrolle(n) pro Stunde | Control(s) per hour | consultation.incarceration.intervallCheck.perHour | Incarceration |
| input | input |  | data.incarceration.specialDiataryRequirement | Spezieller Kost (zB.: Diätkost) | Observation of special foods (e.g. diet foods) | consultation.incarceration.specialDiataryRequirement.description | Incarceration |
| select | boolean | :-; true:label.yes; false:label.no | data.incarceration.requireVideo | Kontrolle Video/Audio verlangt | Video/audio control required | consultation.incarceration.videoAudioRequired | Incarceration |
| input | input |  | data.incarceration.otherRequirements | sonstige Auflagen | other requirements | consultation.incarceration.otherRequirements | Incarceration |
| textarea | OWN |  | data.incarceration.otherRequirements | sonstige Auflagen | other requirements | consultation.incarceration.otherRequirements | Incarceration |
| textarea | OWN |  | data.incarceration.inpatientPlace | Einweisung / Stationäre Aufnahme am Ort | Referral / Inpatient admission on site | consultation.incarceration.InpatientAdmissionIn | Incarceration |
| select | boolean | :-; true:label.yes; false:label.no | data.incarceration.notIncarcerationCapability | Nicht gewahrsamsfähig | Not custodial | consultation.incarceration.notIncarcerable | Incarceration |
| select | boolean | :-; true:label.yes; false:label.no | data.incarceration.inpatientAdmissionRequired | Einweisung / Stationäre Aufnahme erforderlich | Referral / inpatient admission required | consultation.incarceration.InpatientAdmissionRequired | Incarceration |
| textarea | OWN |  | data.incarceration.inpatientPlace | Einweisung / Stationäre Aufnahme am Ort | Referral / Inpatient admission on site | consultation.incarceration.InpatientAdmissionIn | Incarceration |
| input | input |  | data.incarceration.inpatientPlace | Einweisung / Stationäre Aufnahme am Ort | Referral / Inpatient admission on site | consultation.incarceration.InpatientAdmissionIn | Incarceration |
| select | boolean | :-; true:label.yes; false:label.no | data.incarceration.consumedAlcohol | Alkoholkonsum | Alcohol consumption | OnboardingData.alcoholUsage | Incarceration |
| select | boolean | :-; true:label.yes; false:label.no | data.incarceration.consumedMedication | Medikamente | Medication | consultation.incarceration.medication | Incarceration |
| textarea | OWN |  | data.incarceration.consumedOtherIntoxicatingSubstances | Einnahme folgender Medikamente (korrekte Anwendung) | Taking these medications (correct application) | consultation.incarceration.consumedOtherIntox | Incarceration |
| input | date |  | data.incarceration.dateConsumedLastTime | Zuletzt an Datum |  | consultation.incarceration.lastDate | Incarceration |
| input | time |  | data.incarceration.timeConsumedLastTime | Zuletzt um | Last date/time | consultation.incarceration.lastTime | Incarceration |
| input | input |  | data.incarceration.consumedLastTimeAmount | Menge | Quantity | consultation.incarceration.amount | Incarceration |
| select | boolean | :-; true:label.yes; false:label.no | data.incarceration.generalConditionNoticeable | Allgemeinzustand auffällig | General condition conspicuous | consultation.incarceration.generalStateNoticeable | Incarceration |
| select | select | :-; OVER:schlecht; REDUCED:reduziert; WELL:gut | data.onboarding.generalState | Allgemeinzustand | General condition | OnboardingData.generalState | Patient Onboarding |
| select | select | :-; WELL:gut; REDUCED:reduziert; OBESE:adipös; CACHECTIC:kachektisch | data.onboarding.weightState | Ernährungszustand | Nutritional status | OnboardingData.weightState | Patient Onboarding |
| input | input |  | data.incarceration.intox | Intox | Intoxication | consultation.incarceration.intox | Incarceration |
| select | boolean | :-; true:label.yes; false:label.no | data.incarceration.abnormalPupils | Auffälligkeit der Pupillen | Conspicuity of the pupils | consultation.incarceration.abnormalityPupils | Incarceration |
| textarea | OWN |  | data.incarceration.abnormalPupilsDescription | Beschreibung der Pupillen (Weite, Differenz, Reaktion) | Description of the pupils (width, difference, reaction) | consultation.incarceration.abnormalityPupils.Description | Incarceration |
| select | boolean | :-; true:label.yes; false:label.no | data.incarceration.knownAllergiesIntolerances | Bekannte Allergien/Unverträglichkeiten | Known allergies/intolerances | consultation.incarceration.knownAllergies | Incarceration |
| textarea | OWN |  | data.incarceration.knownAllergiesIntolerancesDescription | Wenn Ja, welche bekannte Allergien? | If yes, which known allergies? | consultation.incarceration.knownAllergies.yes | Incarceration |
| select | boolean | :-; true:label.yes; false:label.no | data.incarceration.knownAddictionDisorder | Bekannte Suchterkrankung | Known addiction | consultation.incarceration.knownAddiction | Incarceration |
| textarea | OWN |  | data.incarceration.knownAddictionDisorderDescription | Wenn Ja, welche bekannte Suchterkrankung? | If yes, which known addiction? | consultation.incarceration.knownAddiction.yes | Incarceration |
| textarea | OWN |  | data.incarceration.nerologyDescription | - Stand (sicher/unsicher/schwankend/nicht möglich)<br>- Sprache (deutlich/verwaschen/lallend/nicht möglich)<br>- Bewusstseinslage (wach/getrübt/ bewusstlos)<br>- Gang (sicher, unsicher, schwankend, nicht möglich) | Standing (secure/uncertain/unsteady/not possible)<br>- Speech (clear/slurred/slurred/not possible)<br>- State of consciousness (awake/clouded/unconscious)<br>- Gait (secure, uncertain, unsteady, not possible) | consultation.incarceration.neurology.description | Incarceration |
| select | select | :-; NONE:Keine signifikante Intoxikation; STAGE_1:Stadium I - Euphorie; STAGE_2:Stadium II - Erregung; STAGE_3:Stadium III - Verwirrung; STAGE_4:Stadion IV – Stupor; STAGE_5:Stadium V - Koma | data.incarceration.intoxication | Stadium | Stage | consultation.incarceration.intoxication.stadium | Incarceration |
| input | input |  | data.incarceration.intoxicationDescription | Stadium Beschreibung | Stage Description | consultation.incarceration.intoxication.stageDescription | Incarceration |
| select | boolean | :-; true:label.yes; false:label.no | data.incarceration.reflexBehaviorNoticeable | Reflexverhalten auffällig | Reflective behavior is obvious | consultation.incarceration.intoxication.reflexBehaviorNoticeable | Incarceration |
| select | boolean | :-; true:label.yes; false:label.no | data.incarceration.abnormalHeadNeck | Kopf/Hals auffällig | Head/neck noticeable | consultation.incarceration.abnormalityHeadNeck | Incarceration |
| select | boolean | :-; true:label.yes; false:label.no | data.incarceration.abnormalChestOrgans | Brustorgane (auskultatorisch/perkutorisch) auffällig | Chest organs (auscultatory/percultatory) detectable | consultation.incarceration.intoxication.abnormalChestOrgans | Incarceration |
| select | boolean | :-; true:label.yes; false:label.no | data.incarceration.abnormalLimbsJoints | Gliedmaßen/Gelenke auffällig | Limbs/joints abnormal | consultation.incarceration.intoxication.abnormalLimbsJoints | Incarceration |
| select | boolean | :-; true:label.yes; false:label.no | data.incarceration.abnormalHeartAuscultatory | Herz (auskultatorisch) auffällig | Heart (auscultatory) fully alert | consultation.incarceration.intoxication.abnormalHeartAuscultatory | Incarceration |
| select | boolean | :-; true:label.yes; false:label.no | data.incarceration.abnormalCirculation | Kreislauf auffällig | Circuit complete | consultation.incarceration.intoxication.abnormalCirculation | Incarceration |
| input | input |  | data.incarceration.pulseFrequency | Pulsfrequenz | Pulse frequency | consultation.incarceration.intoxication.pulseFrequency | Incarceration |
| select | boolean | :-; true:label.yes; false:label.no | data.incarceration.tachykard | Tachykard | Tachycardia | consultation.incarceration.intoxication.tachykard | Incarceration |
| select | boolean | :-; true:label.yes; false:label.no | data.incarceration.bradycard | Bradykard | Bradycard | consultation.incarceration.intoxication.bradycard | Incarceration |
| input | input |  | data.incarceration.bloodPressure | Blutdruck | Blood pressure | consultation.incarceration.intoxication.bloodPressure | Incarceration |
| select | select | :-; ROSY:rosig; PALE:blass | data.incarceration.skinColor | Hautkolorit | Skin Color | consultation.incarceration.intoxication.skinColor | Incarceration |
| textarea | OWN |  | data.incarceration.intoxicationComment | Ergänzung zur Intoxikation (bspw. Durchgeführte Koordinationstests) | Supplement for intoxication (e.g. coordination tests carried out) | consultation.incarceration.intoxication.Comment | Incarceration |
| select | select | :-; FREE:frei; OCCUPIED:belegt | data.incarceration.respiratoryTract | Atemwege | Respiratory system | consultation.incarceration.intoxication.respiratoryTract | Incarceration |
| select | select | :-; APNOE:Apnoe; BRADYPNOE:Bradypnoe; EUPNOE:Eupnoe; TACHYPNOE:Tachypnoe | data.incarceration.respiratoryFrequency | Atemfrequenz | Respiratory rate | consultation.incarceration.intoxication.respiratoryFrequency | Incarceration |
| input | number |  | data.incarceration.bodyTemperature | Körpertemperatur | Body temperature | consultation.incarceration.intoxication.bodyTemperature | Incarceration |
| input | number |  | data.incarceration.saturation | Sättigung | Confirmation | consultation.incarceration.intoxication.saturation | Incarceration |
| select | boolean | :-; true:label.yes; false:label.no | data.incarceration.signsOfSuicidalityAtExamination | Hinweise zu Suizidalität | Evidence of suicidality | consultation.incarceration.intoxication.signsOfSuicidality | Incarceration |
| textarea | OWN |  | data.incarceration.signsOfSuicidalityDescription | unauffällig, ängstlich, nicht beurteilbar, euphorisch, erregt, wahnhaft, aggressiv, verwirrt, verlangsam/stuporös, suizidal, depressiv, motorisch unruhig | unremarkable, anxious, unassessable, euphoric, agitated, delusional, aggressive, confused, slow/stuporous, suicidal, depressed, motor restless | consultation.incarceration.intoxication.signsOfSuicidality.description | Incarceration |
| textarea | OWN |  | data.incarceration.bodyCheckComment | Bodycheck äußere Feststellungen/Verletzungen, Hinweise auf Trauma | Body check external findings/injuries, indications of trauma | consultation.incarceration.bodyCheck.placeholder | Incarceration |
| input | number |  | data.qm.ratingEquipmentDermatoskop | Wie bewerten Sie den Einsatz des digitalen Dermatoskops? | How do you rate the use of the digital dermatoscope? | Questionaire.ratingEquipmentDermatoskop | Quality Management |
| input | number |  | ratingEquipmentDermatoskop | Wie bewerten Sie den Einsatz des digitalen Dermatoskops? | How do you rate the use of the digital dermatoscope? | Questionaire.ratingEquipmentDermatoskop | Quality Management |
| input | number |  | ratingEquipmentDermatoskop | sehr gut | very good | rating.1 | Quality Management |
| input | number |  | ratingEquipmentDermatoskop | gut | good | rating.2 | Quality Management |
| input | number |  | ratingEquipmentDermatoskop | befriedigend | satisfying | rating.3 | Quality Management |
| input | number |  | ratingEquipmentDermatoskop | ausreichend | sufficient | rating.4 | Quality Management |
| input | number |  | ratingEquipmentDermatoskop | mangelhaft | poor | rating.5 | Quality Management |
| input | number |  | ratingEquipmentDermatoskop | ungenügend | inadequate | rating.6 | Quality Management |
| input | number |  | data.qm.ratingEquipmentOtoskop | Wie bewerten Sie den Einsatz des digitalen Otoskops? | How do you rate the use of the digital otoscope? | Questionaire.ratingEquipmentOtoskop | Quality Management |
| input | number |  | ratingEquipmentOtoskop | Wie bewerten Sie den Einsatz des digitalen Otoskops? | How do you rate the use of the digital otoscope? | Questionaire.ratingEquipmentOtoskop | Quality Management |
| input | number |  | ratingEquipmentOtoskop | sehr gut | very good | rating.1 | Quality Management |
| input | number |  | ratingEquipmentOtoskop | gut | good | rating.2 | Quality Management |
| input | number |  | ratingEquipmentOtoskop | befriedigend | satisfying | rating.3 | Quality Management |
| input | number |  | ratingEquipmentOtoskop | ausreichend | sufficient | rating.4 | Quality Management |
| input | number |  | ratingEquipmentOtoskop | mangelhaft | poor | rating.5 | Quality Management |
| input | number |  | ratingEquipmentOtoskop | ungenügend | inadequate | rating.6 | Quality Management |
| input | number |  | data.qm.ratingEquipmentStethoskop | Wie bewerten Sie den Einsatz des digitalen Stethoskops? | How do you rate the use of the digital stethoscope? | Questionaire.ratingEquipmentStethoskop | Quality Management |
| input | number |  | ratingEquipmentStethoskop | Wie bewerten Sie den Einsatz des digitalen Stethoskops? | How do you rate the use of the digital stethoscope? | Questionaire.ratingEquipmentStethoskop | Quality Management |
| input | number |  | ratingEquipmentStethoskop | sehr gut | very good | rating.1 | Quality Management |
| input | number |  | ratingEquipmentStethoskop | gut | good | rating.2 | Quality Management |
| input | number |  | ratingEquipmentStethoskop | befriedigend | satisfying | rating.3 | Quality Management |
| input | number |  | ratingEquipmentStethoskop | ausreichend | sufficient | rating.4 | Quality Management |
| input | number |  | ratingEquipmentStethoskop | mangelhaft | poor | rating.5 | Quality Management |
| input | number |  | ratingEquipmentStethoskop | ungenügend | inadequate | rating.6 | Quality Management |
| input | number |  | data.qm.ratingEquipmentVital | Wie bewerten Sie den Einsatz des Vitalwerte-Messgeräts? | How do you rate the use of the vital signs monitor? | Questionaire.ratingEquipmentVital | Quality Management |
| input | number |  | ratingEquipmentVital | Wie bewerten Sie den Einsatz des Vitalwerte-Messgeräts? | How do you rate the use of the vital signs monitor? | Questionaire.ratingEquipmentVital | Quality Management |
| input | number |  | ratingEquipmentVital | sehr gut | very good | rating.1 | Quality Management |
| input | number |  | ratingEquipmentVital | gut | good | rating.2 | Quality Management |
| input | number |  | ratingEquipmentVital | befriedigend | satisfying | rating.3 | Quality Management |
| input | number |  | ratingEquipmentVital | ausreichend | sufficient | rating.4 | Quality Management |
| input | number |  | ratingEquipmentVital | mangelhaft | poor | rating.5 | Quality Management |
| input | number |  | ratingEquipmentVital | ungenügend | inadequate | rating.6 | Quality Management |
| input | number |  | data.qm.ratingRoom | Bitte bewerten Sie die räumlichen Gegebenheiten während der Behandlung! | Please assess the spatial conditions during the treatment! | Questionaire.ratingRoom | Quality Management |
| input | number |  | data.qm.ratingRoom | sehr gut | very good | rating.1 | Quality Management |
| input | number |  | data.qm.ratingRoom | gut | good | rating.2 | Quality Management |
| input | number |  | data.qm.ratingRoom | befriedigend | satisfying | rating.3 | Quality Management |
| input | number |  | data.qm.ratingRoom | ausreichend | sufficient | rating.4 | Quality Management |
| input | number |  | data.qm.ratingRoom | mangelhaft | poor | rating.5 | Quality Management |
| input | number |  | data.qm.ratingEquipment | Bitte bewerten Sie die Video-/Verbindungsqualität Ihres Patienten! | Please rate the video/connection quality of your patient! | Questionaire.ratingEquipment | Quality Management |
| input | number |  | data.qm.ratingEquipment | sehr gut | very good | rating.1 | Quality Management |
| input | number |  | data.qm.ratingEquipment | gut | good | rating.2 | Quality Management |
| input | number |  | data.qm.ratingEquipment | befriedigend | satisfying | rating.3 | Quality Management |
| input | number |  | data.qm.ratingEquipment | ausreichend | sufficient | rating.4 | Quality Management |
| input | number |  | data.qm.ratingEquipment | mangelhaft | poor | rating.5 | Quality Management |
| input | number |  | data.qm.ratingRisk | Risiko | Risk | Questionaire.ratingRisk | Quality Management |
| input | number |  | data.qm.ratingRisk | Sehr |  | rating.risk.1 | Quality Management |
| input | number |  | data.qm.ratingRisk | brisant |  | rating.risk.2 | Quality Management |
| input | number |  | data.qm.ratingRisk | eher |  | rating.risk.3 | Quality Management |
| input | number |  | data.qm.ratingRisk | weniger |  | rating.risk.4 | Quality Management |
| input | number |  | data.qm.ratingRisk | gering |  | rating.risk.5 | Quality Management |
| input | number |  | data.qm.ratingRequireExtraReferal | Wie wahrscheinlich wäre ohne Ihre Behandlung eine sofortige Ausführung oder eine sofortige externe Überweisung notwendig gewesen? | Without your treatment, how likely would an immediate evacuation or immediate external referral have been necessary? | Questionaire.ratingRequireExtraReferal | Quality Management |
| input | number |  | data.qm.ratingRequireExtraReferal | notwendig |  | rating.wahrsch.1 | Quality Management |
| input | number |  | data.qm.ratingRequireExtraReferal | eventuell |  | rating.wahrsch.2 | Quality Management |
| input | number |  | data.qm.ratingRequireExtraReferal | neutral |  | rating.wahrsch.3 | Quality Management |
| input | number |  | data.qm.ratingRequireExtraReferal | eher weniger |  | rating.wahrsch.4 | Quality Management |
| input | number |  | data.qm.ratingRequireExtraReferal | gering |  | rating.wahrsch.5 | Quality Management |
| input | number |  | data.qm.ratingCommunication | Bitte bewerten Sie die Zusammenarbeit mit dem anwesendem Personal (z.B. AVD, Pflegepersonal, Schiffscrew)? | Please rate the cooperation with the staff present (e.g. AVD, nursing staff, ship's crew)? | Questionaire.ratingCommunication | Quality Management |
| input | number |  | data.qm.ratingCommunication | sehr gut | very good | rating.1 | Quality Management |
| input | number |  | data.qm.ratingCommunication | gut | good | rating.2 | Quality Management |
| input | number |  | data.qm.ratingCommunication | befriedigend | satisfying | rating.3 | Quality Management |
| input | number |  | data.qm.ratingCommunication | ausreichend | sufficient | rating.4 | Quality Management |
| input | number |  | data.qm.ratingCommunication | mangelhaft | poor | rating.5 | Quality Management |
| input | radio |  | data.qm.requireTranslator | War für die Behandlung ein Dolmetscher notwendig? | Was an interpreter necessary for the treatment? | Questionaire.requireTranslator | Quality Management |
| input | radio |  | data.qm.requireTranslator |  |  | label.yes | Quality Management |
| input | number |  | data.qm.ratingDiagnosticCertainty | Wie beurteilen Sie die Qualität Ihrer heutigen Behandlung? | How would you rate the quality of your treatment today? | Questionaire.ratingDiagnosticCertainty | Quality Management |
| input | number |  | data.qm.ratingDiagnosticCertainty | sehr gut | very good | rating.1 | Quality Management |
| input | number |  | data.qm.ratingDiagnosticCertainty | gut | good | rating.2 | Quality Management |
| input | number |  | data.qm.ratingDiagnosticCertainty | befriedigend | satisfying | rating.3 | Quality Management |
| input | number |  | data.qm.ratingDiagnosticCertainty | ausreichend | sufficient | rating.4 | Quality Management |
| input | number |  | data.qm.ratingDiagnosticCertainty | mangelhaft | poor | rating.5 | Quality Management |
| input | number |  | data.qm.ratingTreatmentOverVideoQuality | Wie ließ sich der Fall per Video lösen? | How was the case solved by video? | Questionaire.ratingTreatmentOverVideoQuality | Quality Management |
| input | number |  | data.qm.ratingTreatmentOverVideoQuality | sehr gut | very good | rating.1 | Quality Management |
| input | number |  | data.qm.ratingTreatmentOverVideoQuality | gut | good | rating.2 | Quality Management |
| input | number |  | data.qm.ratingTreatmentOverVideoQuality | befriedigend | satisfying | rating.3 | Quality Management |
| input | number |  | data.qm.ratingTreatmentOverVideoQuality | ausreichend | sufficient | rating.4 | Quality Management |
| input | number |  | data.qm.ratingTreatmentOverVideoQuality | mangelhaft | poor | rating.5 | Quality Management |
| textarea | textarea |  | data.qm.requireTreatmentQuality | Feedback Behandlungsqualität | Feedback on treatment quality | Questionaire.requireTreatmentQuality | Quality Management |
| textarea | textarea |  | data.qm.comment |  |  | label.comment | Quality Management |
| textarea | FAMILY |  | data.standardHelper.anamnesisFamily | Familieanamnese | Family history | OnboardingData.familyInfo | Standard Consultation |
| input | input |  | data.onboarding.previousPhysician |  |  | label.name | Patient Onboarding |
| textarea | PRETREATMENT |  | data.standardHelper.anamnesisPretreatment | Notizen | Notes | OnboardingData.notes | Standard Consultation |
| input | number |  | data.body.bodyHeight | Körperlicher Befund | Physical findings | OnboardingData.physicalFindings | General |
| input | number |  | data.body.bodyWeight |  |  |  | General |
| input | input |  | data.body.rr | RR. | RR. | OnboardingData.rr | General |
| input | input |  | data.body.pulse | Puls | Puls | OnboardingData.pulse | General |
| select | select | OVER:schlecht; REDUCED:reduziert; WELL:gut | data.onboarding.generalState | Allgemeinzustand | General condition | OnboardingData.generalState | Patient Onboarding |
| select | select | WELL:gut; REDUCED:reduziert; OBESE:adipös; CACHECTIC:kachektisch | data.onboarding.weightState | Ernährungszustand | Nutritional status | OnboardingData.weightState | Patient Onboarding |
| textarea | textarea |  | data.onboarding.stateInfo | Notizen | Notes | OnboardingData.notes | Patient Onboarding |
| select | select | NO_ANSWER:Keine Angaben; HEALTHY:OnboardingData.preexistingState.HEALTHY ; OTHER:Angeblich erkrankt an | data.onboarding.preexistingState | Angaben über frühere Erkrankungen | Information on previous illnesses | OnboardingData.preexistingState | Patient Onboarding |
| textarea | textarea |  | data.onboarding.preexistingCondition | Angeblich erkrankt an | Allegedly suffering from | OnboardingData.preexistingCondition | Patient Onboarding |
| select | boolean | :-; true:label.yes; false:label.no | data.onboarding.allergies | Allergien | Allergies | OnboardingData.allergies | Patient Onboarding |
| select | select | NO_ANSWER:Keine Angaben; HEALTHY:Gesund; OTHER:Angeblich erkrankt an | data.onboarding.currentState | Angaben über den gegenwärtigen Gesundheiszustand | Information on the current state of health | OnboardingData.currentState | Patient Onboarding |
| textarea | OWN |  | data.standardHelper.anamnesisOwn | Angeblich erkrankt an | Allegedly suffering from | OnboardingData.currentCondition | Standard Consultation |
| select | select | :-; UNKNOWN:nicht bekannt; SURE:gesichert; EXCLUDED:ausgeschlossen | data.onboarding.hepatitis | Hepatitis | Hepatitis | OnboardingData.hepatitis | Patient Onboarding |
| select | select | :-; UNKNOWN:nicht bekannt; SURE:gesichert; EXCLUDED:ausgeschlossen | data.onboarding.lungTuberculosis | Lungentuberkulose | Pulmonary tuberculosis | OnboardingData.lungTuberculosis | Patient Onboarding |
| select | select | :-; UNKNOWN:nicht bekannt; SURE:gesichert; EXCLUDED:ausgeschlossen | data.onboarding.std | Geschlechtskrankheiten | Venereal diseases | OnboardingData.std | Patient Onboarding |
| select | select | :-; UNKNOWN:nicht bekannt; SURE:gesichert; EXCLUDED:ausgeschlossen | data.onboarding.hiv | HIV | HIV | OnboardingData.hiv | Patient Onboarding |
| textarea | textarea |  | data.onboarding.transmittalInfo | Notizen | Notes | OnboardingData.notes | Patient Onboarding |
| textarea | textarea |  | data.onboarding.skinCondition | Haut | Skin | OnboardingData.skinCondition | Patient Onboarding |
| input | input |  | data.onboarding.senseCondition | Sinnesorgane | Sensory organs | OnboardingData.senseCondition | Patient Onboarding |
| input | input |  | data.onboarding.eyeCondition | Augen | Eyes | OnboardingData.eyeCondition | Patient Onboarding |
| input | input |  | data.onboarding.earCondition | Ohren | Ears | OnboardingData.earCondition | Patient Onboarding |
| textarea | textarea |  | data.onboarding.alcoholUsage | Alkoholkonsum | Alcohol consumption | OnboardingData.alcoholUsage | Patient Onboarding |
| textarea | textarea |  | data.onboarding.tabaccoUsage | Tabakkonsum | Tobacco consumption | OnboardingData.tabaccoUsage | Patient Onboarding |
| textarea | textarea |  | data.onboarding.drugUsage | Drogen | Drugs | OnboardingData.drugUsage | Patient Onboarding |
| textarea | textarea |  | data.standard.medicationAnamnesis.documentation | Medikamente (Anamnese) | Medication (medical history) | OnboardingData.prescriptions | Standard Consultation |
| select | boolean | :-; true:label.yes; false:label.no | data.onboarding.additionalPrescription | Medikation Verordnung | Medication prescription | OnboardingData.additionalPrescription | Patient Onboarding |
| textarea | textarea |  | data.onboarding.heartCondition | Herz | Heart | OnboardingData.heartCondition | Patient Onboarding |
| textarea | textarea |  | data.onboarding.lungCondition | Lunge | Lungs | OnboardingData.lungCondition | Patient Onboarding |
| textarea | textarea |  | data.onboarding.abdomenCondition | Abdomen | Abdomen | OnboardingData.abdomenCondition | Patient Onboarding |
| textarea | textarea |  | data.onboarding.kidneyCondition | Nieren und Geschlechtsorgane | Kidneys and reproductive organs | OnboardingData.kidneyCondition | Patient Onboarding |
| textarea | textarea |  | data.onboarding.extremitiesCondition | Extremitäten | Extremities | OnboardingData.extremitiesCondition | Patient Onboarding |
| textarea | textarea |  | data.onboarding.centralNerveSystemCondition | Zentralnervensystem | Central nervous system | OnboardingData.centralNerveSystemCondition | Patient Onboarding |
| textarea | textarea |  | data.onboarding.psychologicalCondition | Psyche | Psyche | OnboardingData.psychologicalCondition | Patient Onboarding |
| textarea | textarea |  | data.onboarding.otherConditions | weitere Befunde | Further findings | OnboardingData.otherConditions | Patient Onboarding |
| select | boolean | :-; true:label.yes; false:label.no | data.onboarding.incarcerationSuitability | Vollzugstauglich | Suitable for implementation | OnboardingData.incarcerationSuitability | Patient Onboarding |
| select | boolean | :-; true:label.yes; false:label.no | data.onboarding.singleRoomSuitability | Bedenken gegen Einzelunterbringung | Concerns about individual accommodation | OnboardingData.singleRoomSuitability | Patient Onboarding |
| select | select | UNKNOWN:unbekannt; YES:ja; PARTLY:eingeschränkt *); NO:nein | data.onboarding.workSuitability | Arbeitsfähig | Able to work | OnboardingData.workSuitability | Patient Onboarding |
| select | boolean | :-; true:label.yes; false:label.no | data.onboarding.outDoorWorkSuitability | Außenarbeitsfähig | Able to work outdoors | OnboardingData.outDoorWorkSuitability | Patient Onboarding |
| select | select | UNKNOWN:unbekannt; YES:ja; PARTLY:eingeschränkt *); NO:nein | data.onboarding.sportSuitability | Sporttauglich | Suitable for sports | OnboardingData.sportSuitability | Patient Onboarding |
| select | boolean | :-; true:label.yes; false:label.no | data.onboarding.requireTreatment | Ärztlicher Behandlung bedürftig | Requires medical treatment | OnboardingData.requireTreatment | Patient Onboarding |
| textarea | textarea |  | data.onboarding.treatmentInfo | Informationen | Information about | OnboardingData.treatmentInfo | Patient Onboarding |
| select | boolean | :-; true:label.yes; false:label.no | data.onboarding.suicidal | Anzeichen für Suizidgefährdung | Signs of suicidal tendencies | OnboardingData.suicidal | Patient Onboarding |
| select | boolean | :-; true:label.yes; false:label.no | data.onboarding.dangerous | Besondere Maßnahmen wegen Gefahr für andere erforderlich | Special measures required due to danger to others | OnboardingData.dangerous | Patient Onboarding |
| textarea | textarea |  | data.onboarding.suitabilityInfo | *Bemerkung | *Note | OnboardingData.suitabilityInfo | Patient Onboarding |
| select | select | OVER:schlecht; REDUCED:reduziert; WELL:gut | data.onboarding.generalState | Allgemeinzustand | General condition | OnboardingData.generalState | Patient Onboarding |
| select | select | WELL:gut; REDUCED:reduziert; OBESE:adipös; CACHECTIC:kachektisch | data.onboarding.weightState | Ernährungszustand | Nutritional status | OnboardingData.weightState | Patient Onboarding |
| select | boolean | :-; true:label.yes; false:label.no | data.onboarding.incarcerationSuitability | Vollzugstauglich | Suitable for implementation | OnboardingData.incarcerationSuitability | Patient Onboarding |
| select | boolean | :-; true:label.yes; false:label.no | data.onboarding.singleRoomSuitability | Bedenken gegen Einzelunterbringung | Concerns about individual accommodation | OnboardingData.singleRoomSuitability | Patient Onboarding |
| select | select | UNKNOWN:unbekannt; YES:ja; PARTLY:eingeschränkt *); NO:nein | data.onboarding.workSuitability | Arbeitsfähig | Able to work | OnboardingData.workSuitability | Patient Onboarding |
| select | boolean | :-; true:label.yes; false:label.no | data.onboarding.outDoorWorkSuitability | Außenarbeitsfähig | Able to work outdoors | OnboardingData.outDoorWorkSuitability | Patient Onboarding |
| select | select | UNKNOWN:unbekannt; YES:ja; PARTLY:eingeschränkt *); NO:nein | data.onboarding.sportSuitability | Sporttauglich | Suitable for sports | OnboardingData.sportSuitability | Patient Onboarding |
| select | boolean | :-; true:label.yes; false:label.no | data.onboarding.requireTreatment | Ärztlicher Behandlung bedürftig | Requires medical treatment | OnboardingData.requireTreatment | Patient Onboarding |
| textarea | textarea |  | data.onboarding.treatmentInfo | Informationen | Information about | OnboardingData.treatmentInfo | Patient Onboarding |
| select | boolean | :-; true:label.yes; false:label.no | data.onboarding.suicidal | Anzeichen für Suizidgefährdung | Signs of suicidal tendencies | OnboardingData.suicidal | Patient Onboarding |
| select | boolean | :-; true:label.yes; false:label.no | data.onboarding.dangerous | Besondere Maßnahmen wegen Gefahr für andere erforderlich | Special measures required due to danger to others | OnboardingData.dangerous | Patient Onboarding |
| textarea | textarea |  | data.onboarding.suitabilityInfo | *Bemerkung | *Note | OnboardingData.suitabilityInfo | Patient Onboarding |
| textarea | textarea |  | data.standard.medicationAnamnesis.documentation | Medikamentenanamnese | Medication history | AnamnesisType.MEDICATION | Standard Consultation |
| select | select | :AB/Aktueller Befund; MEDICAL:Anamnese; ALLERGY:Allergieanamnese; OWN:Eigen Anamnese; FAMILY:Familienanamnese; PRETREATMENT:Vorbehandelnde Ärzte / Krankenhäuser; NOW:Jetztanamnese; ADDICTION:Suchtanamnese; NOTES:Notizen; DENTAL:Dentalanamnese; HAND:Handakte | anamnesis.type | AA/Anamnese | AA/anamnesis | consultation.anamnesis | General |
| textarea | textarea |  | anamnesis.documentation | Bitte geben Sie mindestens 50 Buchstaben ein | Please enter at least 50 letters | consultation.details.letters | General |
| select | select | :AA/Anamnese; MEDICAL:Anamnese; ALLERGY:Allergieanamnese; DENTAL:Dentalanamnese; OWN:Eigen Anamnese; FAMILY:Familienanamnese; HAND:Handakte; NOW:Jetztanamnese; MEDICATION:Medikamentenanamnese; NOTES:Notizen; ADDICTION:Suchtanamnese; PRETREATMENT:Vorbehandelnde Ärzte / Krankenhäuser | data.standard.anamnesis | Bitte geben Sie mindestens 50 Buchstaben ein | Please enter at least 50 letters | consultation.details.letters | Standard Consultation |
| select | select | :AB/Aktueller Befund; FINDINGS:Befund; ECG:Befund EKG; NOW:Befund Jetzt; MEASUREMENT:Befund Einfache Messung; LZRR:Befund LZRR; XRAY:Befund Röntgen; OTHER:Befund sonstiges; ULTRASOUND:Befund Utraschall; ACCESS:Befund Zugang; DENTAL:Dentalbefund | patientReport.type | AB/Aktueller Befund | ab/actual report | consultation.patientReport | General |
| textarea | textarea |  | patientReport.documentation | Bitte geben Sie mindestens 50 Buchstaben ein | Please enter at least 50 letters | consultation.details.letters | General |
| select | select | :AB/Aktueller Befund; FINDINGS:Befund; MEASUREMENT:Befund Einfache Messung; ECG:Befund EKG; NOW:Befund Jetzt; LZRR:Befund LZRR; XRAY:Befund Röntgen; OTHER:Befund sonstiges; ULTRASOUND:Befund Utraschall; ACCESS:Befund Zugang; DENTAL:Dentalbefund | data.standard.patientReport | Bitte geben Sie mindestens 50 Buchstaben ein | Please enter at least 50 letters | consultation.details.letters | Standard Consultation |
| select | select | UNKNOWN:; LEFT:L; RIGHT:R; BOTH:B | diagnosis.localization | Dentalbefund |  | PatientReportType.DENTAL | General |
| select | select | :-; VERIFY:V; ZERO:Z; GENERAL:G | diagnosis.level | Beidseitig |  | diagnosis.localization.BOTH | General |
| textarea | textarea |  | diagnosis.comment |  |  | label.comment | General |
| input | input |  | data.standard.diagnosis | AD/Aktuelle Diagnose | ad/actual diagnosis report | consultation.diagnosisReport | Standard Consultation |
| select | select |  | prescription.product |  |  |  | General |
| input | input |  | prescription.product.name |  |  |  | General |
| select | select | :Darreichungsform; Tbl.:Tbl.; Kapsel:Kapsel; Tropfen:Tropfen; Salbe/Creme:Salbe/Creme; Gel:Gel; Saft/Sirup:Saft/Sirup; Supp.:Supp.; mg:mg; ml:ml; µg:µg; Infusion:Infusion; i.m.:i.m.; i.v.:i.v.; sonstiges:sonstiges | prescription.packaging |  |  |  | General |
| input | input |  | activeIngredients.name |  |  |  | General |
| input | input |  | activeIngredients.amount |  |  |  | General |
| textarea | textarea |  | prescription.dosageAmount | Dosierhinweise | Dosage Amount | Prescription.dosageAmount | General |
| select | select | :Medikationsform; STANDARD:Bedarfsmedikation; LIMITED:Begrenzte Medikation (befristet); LONGTERM:Dauermedikation | prescription.type | Dosierhinweise | Dosage Amount | Prescription.dosageAmount | General |
| input | input |  | prescription.comment |  |  | label.comment | General |
| input | input |  | prescription.dosageRequirement | Bedarfsregel | Dosage Requirement | Prescription.dosageRequirement | General |
| input | number |  | prescription.morning | Nachts | At night | consultation.atNight | General |
| input | number |  | prescription.lunch | Nachts | At night | consultation.atNight | General |
| input | number |  | prescription.evening | Nachts | At night | consultation.atNight | General |
| input | number |  | prescription.night | Nachts | At night | consultation.atNight | General |
| select | select | :Einheit; Stück:Stück; IE:IE; Tropfen:Tropfen; ml:ml; mg:mg; Hinweis:siehe Hinweis | prescription.unit |  |  |  | General |
| input | date |  | prescription.start |  |  |  | General |
| input | date |  | prescription.end |  |  |  | General |
| input | checkbox |  | prescription.initialDosageGiven |  |  |  | General |
| input | checkbox |  | prescription.allowSubstitute | Erste Ausgabe erledigt | Initial Dosage Given | Prescription.initialDosageGiven | General |
| input | input |  | data.standard.prescription | AM/Neu Angeordnete Medikation | Medication | consultation.medication | Standard Consultation |
| input | date |  | workIncapacity.start | Arbeitsunfähigkeit | Work Incapacity | consultation.workIncapacity | General |
| input | date |  | workIncapacity.end |  |  |  | General |
| textarea | textarea |  | workIncapacity.documentation | Arbeitsunfähigkeit Dokumentation | Work Incapacity Documentation | consultation.workIncapacity.documentation | General |
| textarea | textarea |  | data.standard.procedureReport | PC / Procedere | pc / procedere | consultation.procedereReport | Standard Consultation |
| textarea | textarea |  | data.treatment.diagnosis.comment | Diagnose Kommentar | Diagnosis Comment | Treatment.diagnosisComment | Treatment |
| textarea | textarea |  | data.treatment.anamnesisSocial | Biographische und sozialanamnestische Angaben | Biographical and social anamnestic information | Treatment.anamnesisSocial | Treatment |
| textarea | textarea |  | data.treatment.anamnesisEducationJob | Schul-, Ausbildungs- und Berufsanamnese | School, training and professional history | Treatment.anamnesisEducationJob | Treatment |
| textarea | textarea |  | data.treatment.anamnesisFamily | Familienanamnese | Family history | Treatment.anamnesisFamily | Treatment |
| textarea | textarea |  | data.treatment.anamnesisSelf | Eigenanamnese | Personal history | Treatment.anamnesisSelf | Treatment |
| textarea | textarea |  | data.treatment.specificDiseaseDevelopment | Spezifische Krankheitsentwicklung | Specific disease development | Treatment.specificDiseaseDevelopment | Treatment |
| textarea | textarea |  | data.treatment.anamnesisVegetative | Vegetative Anamnese | Vegetative history | Treatment.anamnesisVegetative | Treatment |
| textarea | textarea |  | data.treatment.anamnesisSubstance | Substanzanamnese und absolvierte Entwöhnungsbehandlungen | Substance history and withdrawal treatment completed | Treatment.anamnesisSubstance | Treatment |
| textarea | textarea |  | data.treatment.anamnesisDelinquency | Delinquenzanamnese | Delinquency history | Treatment.anamnesisDelinquency | Treatment |
| textarea | textarea |  | data.treatment.medication | Medikation | Medication | Treatment.medication | Treatment |
| textarea | textarea |  | data.treatment.reportPsychDiagnostic | Befunde und psychologische Diagnostik | Findings and psychological diagnostics | Treatment.reportPsychDiagnostic | Treatment |
| textarea | textarea |  | data.treatment.reportsPsychopathologicalAdmission | Psychopathologischer Befund bei Aufnahme | Psychopathological findings on admission | Treatment.reportsPsychopathologicalAdmission | Treatment |
| textarea | textarea |  | data.treatment.medicalAdmissiontelepsychotherapy | Ärztliche Aufnahmebefunde vor Beginn der Telepsychotherapie | Medical admission findings before the start of telepsychotherapy | Treatment.medicalAdmissiontelepsychotherapy | Treatment |
| textarea | textarea |  | history.content | Therapie Verlauf | Treatment History Content | Treatment.historyContent | General |
| textarea | textarea |  | data.treatment.furtherTreatmentRecommendations | Weitere Behandlungsempfehlungen | Further treatment recommendations | Treatment.furtherTreatmentRecommendations | Treatment |
| textarea | textarea |  | data.treatment.furtherGoals | Weitere Ziele | More goals | Treatment.furtherGoals | Treatment |
| select | select | :Allergie | data.warnings |  |  |  | Warning/Urgency |
| select | select | :Allergie | data.warnings |  |  |  | Warning/Urgency |
| select | select | :Allergie | data.warnings |  |  |  | Warning/Urgency |
| select | select | :Allergie | data.warnings |  |  |  | Warning/Urgency |
| input | input |  | warnings.warning.name | Sonstige | .OTHER | WarningType.OTHER | Warning/Urgency |
| select | select | ALLERGY:Allergie; CONSPICIOUS:Auffälligkeit; INFECTION:Infektiosität; OTHER:Sonstige | warnings.warning.type |  |  |  | Warning/Urgency |
| select | boolean | :Aktiv; true:label.yes; false:label.no | warnings.applies | Sonstige | .OTHER | WarningType.OTHER | Warning/Urgency |
| textarea | textarea |  | warnings.comment |  |  | label.comment | Warning/Urgency |
| input | date |  | warnings.dateStart | von | dateStart | consultation.warning.dateStart | Warning/Urgency |
| input | date |  | warnings.dateEnd | bis | dateEnd | consultation.warning.dateEnd | Warning/Urgency |
| input | boolean |  | data.noWarnings | bis | dateEnd | consultation.warning.dateEnd | General |

## Extraction Process Guidelines

This extraction process can be reused for other HTML files in the project. The key steps are:

1. **Identify Sub-templates**: Use the `{{> FILENAME}}` references in the main template (e.g., `details.html`) to locate all sub-templates.
2. **Scan for Form Elements**: Look for `<input>`, `<select>`, and `<textarea>` elements.
3. **Extract Datamodel References**: Identify the `name` or `data-field` attributes, which usually follow the pattern `data.*` or `warnings.*`.
4. **Identify Translation Keys**: Look for `{{i18n.KEY}}` patterns in:
   - `placeholder` attributes of the element.
   - Preceding labels, spans, or help text within the same container.
   - For `<select>` elements, look into `<option>` labels.
5. **Map Types**: Map element types based on `type` attributes and CSS classes (e.g., `number`, `date`, `boolean`, `time`).
6. **Determine Usecase**: Group fields based on their datamodel prefix, the filename they reside in, or their logical section in the main template.
7. **Resolve Translations**: Load `ApplicationResources.properties` and `ApplicationResources_en.properties` to map i18n keys to German and English text. Handle unicode escapes and encoding (ISO-8859-1) in properties files.
