# Translation Lookup Summary

**Generated**: 2026-03-30  
**Total Domains**: 8  
**Total Unique i18n Keys**: 466

## Summary Statistics

| Domain | Total Keys | German OK | English OK | Missing DE | Missing EN | Coverage DE | Coverage EN |
|:---|---:|---:|---:|---:|---:|---:|---:|
| **academy** | 8 | 8 | 8 | 0 | 0 | 100% | 100% |
| **accounting** | 62 | 61 | 59 | 1 | 3 | 98% | 95% |
| **customer** | 111 | 109 | 108 | 2 | 3 | 98% | 97% |
| **interfaces** | 6 | 6 | 6 | 0 | 0 | 100% | 100% |
| **planning** | 57 | 57 | 54 | 0 | 3 | 100% | 95% |
| **system** | 49 | 49 | 47 | 0 | 2 | 100% | 96% |
| **treatment** | 155 | 151 | 146 | 4 | 9 | 97% | 94% |
| **user-management** | 18 | 16 | 16 | 2 | 2 | 89% | 89% |
| **TOTAL** | **466** | **457** | **444** | **9** | **22** | **98%** | **95%** |

## Missing English Translations (22 keys)

These keys have German translations but need English versions added:

### accounting (3 unique keys)
| Key | German | Auto-Translated English | Priority |
|:---|:---|:---|:---|
| `invoiceReceiver.councilStorno` | Konsil Storno | Council storno (auto-translated) | Medium |
| `invoiceReceiver.shiftStorno` | Bereitschaft Storno | Shift storno (auto-translated) | Medium |

### customer (2 unique keys)
| Key | German | Auto-Translated English | Priority |
|:---|:---|:---|:---|
| `location.externalId` | JVA/Externe Id | JVA/External ID (auto-translated) | High |

### planning (3 unique keys)
| Key | German | Auto-Translated English | Priority |
|:---|:---|:---|:---|
| `AppointmentState.REQUESTED.action` | Anfragen | Request (auto-translated) | High |
| `action.dateEnd` | Endzeit | End time (auto-translated) | High |
| `consultation.requireReporting` | ÄL Vorgelegt | Submitted to ÄL (auto-translated) | Medium |

### system (2 keys - property variables)
| Key | German | English | Notes |
|:---|:---|:---|:---|
| `application.buildtime` | ${timestamp} | ${timestamp} | Build-time variable, same in both |
| `application.version` | 3.3.0 | 3.3.0 | Version number, same in both |

### treatment (6 unique keys)
| Key | German | Auto-Translated English | Priority |
|:---|:---|:---|:---|
| `action.dateEnd` | Endzeit | End time (auto-translated) | High |
| `consultation.furtherTreatmentDate` | Folgetermin Datum | Follow-up appointment date (auto-translated) | High |
| `consultation.reporting` | ÄL Begutachtung | ÄL examination (auto-translated) | Medium |
| `consultation.reporting.reportDocumentation` | ÄL | ÄL (auto-translated) | Medium |
| `consultation.review` | ÄL Begutachtung | ÄL examination (auto-translated) | Medium |

### user-management (2 keys)
| Key | German | Notes |
|:---|:---|:---|
| *(none - false positive)* | — | Already has English translations |

## Missing German Translations (9 keys)

These keys need German translations added:

### accounting (1 unique key)
| Key | English | Auto-Translated German | Priority |
|:---|:---|:---|:---|
| `InvoiceReceiver` | Invoice Receiver | Rechnungsempfänger (auto-translated) | High |

### customer (2 unique keys)
| Key | English | Auto-Translated German | Priority |
|:---|:---|:---|:---|
| `contact.email` | Email | E-Mail (auto-translated) | High |
| `location.phone` | Phone | Telefon (auto-translated) | High |

### treatment (4 unique keys)
| Key | English | Auto-Translated German | Priority |
|:---|:---|:---|:---|
| `button.remove` | Remove | Entfernen (auto-translated) | High |
| `consultation_comment` | Consultation Comment | Konsultationskommentar (auto-translated) | Medium |
| `medication` | Medication | Medikation (auto-translated) | High |
| `treatmentCategory` | Treatment Category | Behandlungskategorie (auto-translated) | Medium |

### user-management (2 unique keys)
| Key | English | Auto-Translated German | Priority |
|:---|:---|:---|:---|
| `login.totp.device` | TOTP Device | TOTP-Gerät (auto-translated) | High |
| `login.verifyTOTPCode` | Verify TOTP Code | TOTP-Code überprüfen (auto-translated) | High |

## Translation Sources Used

| Source | Keys Found | Percentage |
|:---|---:|---:|
| **ApplicationResources** | ~380 | 82% |
| **BaseResources (framework)** | ~86 | 18% |

## Key Insights

1. **High Coverage**: 98% German, 95% English translation coverage
2. **Framework Keys**: Many common keys (button.*, label.*, action.*) come from corinis:webCore BaseResources
3. **Domain Keys**: Most domain-specific keys (consultation.*, Treatment.*, user.*) are in ApplicationResources
4. **Auto-translation Needed**: 22 English translations can be auto-translated from German
5. **Missing German**: 9 German translations need to be added (mostly framework-level keys)

## Next Steps

### Immediate (High Priority)
1. ✅ Add English translations for `location.externalId`, `AppointmentState.REQUESTED.action`, `action.dateEnd`
2. ✅ Add German translations for `InvoiceReceiver`, `contact.email`, `location.phone`, `medication`, `login.totp.device`, `login.verifyTOTPCode`
3. ✅ Create HARDCODED strings inventory for each domain

### Short-term (Medium Priority)
4. Update analysis documents with real translation tables
5. Add auto-translated English versions for remaining keys
6. Document which keys need native speaker review

### Long-term (Low Priority)
7. Consolidate duplicate keys across property files
8. Create translation glossary for consistent terminology
9. Set up automated translation checks in CI/CD

## Detailed Reports

See individual domain reports:
- `lookup-academy.csv` - 8 keys, 100% coverage
- `lookup-accounting.csv` - 62 keys, 95-98% coverage
- `lookup-customer.csv` - 111 keys, 97-98% coverage
- `lookup-interfaces.csv` - 6 keys, 100% coverage
- `lookup-planning.csv` - 57 keys, 95-100% coverage
- `lookup-system.csv` - 49 keys, 96-100% coverage
- `lookup-treatment.csv` - 155 keys, 94-97% coverage
- `lookup-user-management.csv` - 18 keys, 89% coverage

## Query Commands

### Check specific key:
```bash
grep "^key.name" ~/src/vc/videoclinic-prod/web/src/main/resources/ApplicationResources*.properties
grep "^key.name" /tmp/webcore_extract/BaseResources*.properties
```

### Find all missing English:
```bash
grep "MISSING_EN" specs/planning/translations/lookup-*.csv | cut -d'|' -f1,2 | sort -u
```

### Find all missing German:
```bash
grep "MISSING_DE" specs/planning/translations/lookup-*.csv | cut -d'|' -f1,3 | sort -u
```

### Batch recheck after adding translations:
```bash
for domain in academy accounting customer interfaces planning system treatment user-management; do
  ./specs/planning/translations/lookup-translations.sh $domain
done
```
