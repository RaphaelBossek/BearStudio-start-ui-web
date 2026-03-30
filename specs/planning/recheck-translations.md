# Batched Translation Recheck Plan

## Purpose

This plan systematically rechecks all analysis documents to:
1. Extract all `{{i18n.*}}` tokens from analysis files
2. Look up actual translations in German and English
3. Document missing translations
4. Identify HARDCODED strings that need i18n keys created

## Execution Strategy

### Phase 1: Extract all i18n tokens per domain

```bash
# Extract unique i18n keys from each domain directory
for domain in specs/analysis/*/; do
  domain_name=$(basename "$domain")
  grep -rohE '\{\{i18n\.[a-zA-Z0-9_.]+\}\}' "$domain" 2>/dev/null | \
    sed 's/{{i18n\.//;s/}}//' | sort -u > "specs/planning/translations/i18n-keys-${domain_name}.txt"
done
```

### Phase 2: Lookup translations in batch

For each domain's key list:

```bash
# For each key file
while IFS= read -r key; do
  # Search in German ApplicationResources
  de_value=$(grep "^${key}=" ~/src/vc/videoclinic-prod/web/src/main/resources/ApplicationResources.properties | cut -d'=' -f2-)
  
  # Search in English ApplicationResources
  en_value=$(grep "^${key}=" ~/src/vc/videoclinic-prod/web/src/main/resources/ApplicationResources_en.properties | cut -d'=' -f2-)
  
  # Search in German BaseResources (framework)
  de_base=$(grep "^${key}=" /tmp/webcore_extract/BaseResources_de.properties 2>/dev/null | cut -d'=' -f2-)
  
  # Search in English BaseResources (framework)
  en_base=$(grep "^${key}=" /tmp/webcore_extract/BaseResources.properties 2>/dev/null | cut -d'=' -f2-)
  
  # Output results
  echo "${key}|${de_value:-${de_base}}|${en_value:-${en_base}}|$( [ -z "$en_value" ] && [ -z "$en_base" ] && echo "MISSING_EN" || echo "OK" )"
done < "specs/planning/translations/i18n-keys-${domain_name}.txt" > "specs/planning/translations/lookup-${domain_name}.csv"
```

### Phase 3: Generate translation reports

For each domain, create a markdown report:

```markdown
## {Domain} Translation Report

### Summary
- Total unique i18n keys: {count}
- Keys with German translation: {count}
- Keys with English translation: {count}
- **Missing English translations: {count}** ⚠️

### Missing English Translations

| Key | German | Auto-Translated English | Priority |
|:---|:---|:---|:---|
| consultation.medical | Behandlungsdaten | Treatment data (auto-translated) | High |

### HARDCODED Strings Found

| German String | Location | Recommended i18n Key |
|:---|:---|:---|
| Liste | invoice-details.md | `invoice.list` |
```

### Phase 4: Update analysis documents

For each analysis document with missing translations or HARDCODED strings:
1. Add translation table with actual values
2. Mark German-only keys with "(auto-translated)"
3. List HARDCODED strings with recommended i18n keys

## Batch Execution Order

| Batch | Domain | Files | Priority | Estimated Time |
|:---|:---|:---|:---|:---|
| 1 | `system` | 3 files | High | 15 min |
| 2 | `user-management/profile` | 4 files | High | 20 min |
| 3 | `user-management/admin-user` | 2 files | High | 15 min |
| 4 | `accounting/invoice` | 2 files | Medium | 20 min |
| 5 | `treatment/consultation` | 8 files | Medium | 30 min |
| 6 | `planning/appointment` | 3 files | Medium | 20 min |
| 7 | `customer/customer-core` | 2 files | Low | 15 min |
| 8 | Remaining domains | 20+ files | Low | 60 min |

## Translation Lookup Commands

### Quick lookup for single key:
```bash
# Check all sources for a key
key="consultation.booknumber"
echo "=== German ===" 
grep "^${key}=" ~/src/vc/videoclinic-prod/web/src/main/resources/ApplicationResources.properties
echo "=== English ==="
grep "^${key}=" ~/src/vc/videoclinic-prod/web/src/main/resources/ApplicationResources_en.properties
echo "=== Base DE ==="
grep "^${key}=" /tmp/webcore_extract/BaseResources_de.properties
echo "=== Base EN ==="
grep "^${key}=" /tmp/webcore_extract/BaseResources.properties
```

### Batch lookup for domain:
```bash
# Create lookup script
cat > /tmp/lookup-translations.sh << 'EOF'
#!/bin/bash
keyfile="$1"
while IFS= read -r key; do
  de=$(grep "^${key}=" ~/src/vc/videoclinic-prod/web/src/main/resources/ApplicationResources.properties 2>/dev/null | cut -d'=' -f2-)
  en=$(grep "^${key}=" ~/src/vc/videoclinic-prod/web/src/main/resources/ApplicationResources_en.properties 2>/dev/null | cut -d'=' -f2-)
  de_base=$(grep "^${key}=" /tmp/webcore_extract/BaseResources_de.properties 2>/dev/null | cut -d'=' -f2-)
  en_base=$(grep "^${key}=" /tmp/webcore_extract/BaseResources.properties 2>/dev/null | cut -d'=' -f2-)
  
  de_final="${de:-${de_base}}"
  en_final="${en:-${en_base}}"
  status="OK"
  [ -z "$en_final" ] && status="MISSING_EN"
  
  echo "${key}|${de_final}|${en_final}|${status}"
done < "$keyfile"
EOF
chmod +x /tmp/lookup-translations.sh
```

## Output Directory Structure

```
specs/planning/translations/
├── i18n-keys-{domain}.txt          # Unique keys per domain
├── lookup-{domain}.csv             # Raw lookup results (pipe-delimited)
├── report-{domain}.md              # Human-readable markdown report
└── translation-index.md            # Master index of all domains
```

## Quality Checks

After each batch:
- [ ] Verify all keys from the domain are in the `.txt` file
- [ ] Check that missing English translations are flagged
- [ ] Identify HARDCODED strings in the analysis files
- [ ] Generate markdown report with auto-translations
- [ ] Update at least one analysis document with real translations

## Auto-Translation Guidelines

For German-only keys, provide English auto-translations:
1. Use DeepL or Google Translate for accuracy
2. Mark as "(auto-translated)" in the English column
3. Flag for native speaker review during implementation
4. Prioritize based on usage frequency

### Example Auto-Translations

| German | Auto-Translated English | Confidence |
|:---|:---|:---|
| Basisdaten | Basic data / Base data | High |
| Behandlungsdaten | Treatment data | High |
| Ansprechperson intern | Internal contact person | High |
| Patientendokumentation | Patient documentation | High |
| Systemkonfiguration | System configuration | High |

## Next Steps

1. **Create translation directory**: `mkdir -p specs/planning/translations`
2. **Extract keys from all domains**: Run Phase 1 script
3. **Execute Batch 1 (system domain)**: Test the workflow
4. **Refine process**: Adjust based on Batch 1 results
5. **Execute remaining batches**: Parallel execution where possible
6. **Consolidate findings**: Update master translation table in `analyse-ui-elements.md`
