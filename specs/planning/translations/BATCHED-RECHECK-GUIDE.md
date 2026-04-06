---
title: 'Batched Recheck Guide'
---

# Batched Translation Recheck - How-To Guide

## Overview

The translation infrastructure in `specs/planning/translations/` enables systematic batched rechecks of all analysis files to verify i18n translations.

## What Was Created

### 1. Key Extraction Files
- `i18n-keys-{domain}.txt` - Unique i18n keys per domain (8 files, 466 total keys)
- Extracted from all analysis markdown files in `specs/analysis/`

### 2. Lookup Scripts
- `lookup-translations.sh` - Batch script to look up translations in all sources
- Searches both ApplicationResources and BaseResources (framework)
- Outputs CSV with German, English, source, and status

### 3. Lookup Results
- `lookup-{domain}.csv` - Translation status for each key (8 files)
- Format: `key|german|english|source|status`
- Status: `OK`, `MISSING_EN`, or `MISSING_DE`

### 4. Summary Reports
- `translation-summary.md` - Comprehensive overview with statistics
- Lists all missing translations with auto-translated suggestions
- Includes query commands and next steps

## How to Run a Batched Recheck

### Full Recheck (All Domains)

```bash
cd /home/raphael/src/vc/BearStudio-start-ui-web

# Extract keys from all domains (if analysis files changed)
for domain in specs/analysis/*/; do
  domain_name=$(basename "$domain")
  grep -rohE '\{\{i18n\.[a-zA-Z0-9_.]+\}\}' "$domain" 2>/dev/null | \
    sed 's/{{i18n\.//;s/}}//' | sort -u > \
    "specs/planning/translations/i18n-keys-${domain_name}.txt"
done

# Look up translations for all domains
for domain in academy accounting customer interfaces planning system treatment user-management; do
  ./specs/planning/translations/lookup-translations.sh $domain
done

# View summary
cat specs/planning/translations/translation-summary.md
```

### Single Domain Recheck

```bash
# Recheck just one domain
./specs/planning/translations/lookup-translations.sh treatment

# View results
cat specs/planning/translations/lookup-treatment.csv | grep "MISSING"
```

### Check Specific Key

```bash
# Check if a key exists in all sources
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

## Workflow for Adding Missing Translations

### Step 1: Identify Missing Translations

```bash
# Get all missing English
grep "MISSING_EN" specs/planning/translations/lookup-*.csv | \
  cut -d'|' -f1,2 | sort -u > /tmp/missing-english.txt

# Get all missing German
grep "MISSING_DE" specs/planning/translations/lookup-*.csv | \
  cut -d'|' -f1,3 | sort -u > /tmp/missing-german.txt
```

### Step 2: Add Translations to Property Files

**For English translations:**
```bash
# Edit ApplicationResources_en.properties
# Add missing keys with English values
```

**For German translations:**
```bash
# Edit ApplicationResources.properties
# Add missing keys with German values
```

### Step 3: Re-run Lookup to Verify

```bash
# Recheck the domain where you added translations
./specs/planning/translations/lookup-translations.sh treatment
```

### Step 4: Update Analysis Documents

For each analysis document, add a translation table:

```markdown
## Translations

| Key | German | English | Source |
|:---|:---|:---|:---|
| {{i18n.consultation.booknumber}} | Buchnummer | Book number | ApplicationResources |
| {{i18n.button.cancel}} | Abbrechen | Cancel | BaseResources |
```

## Current Status (2026-03-30)

| Metric | Value |
|:---|---:|
| **Total unique i18n keys** | 466 |
| **German coverage** | 98% (457/466) |
| **English coverage** | 95% (444/466) |
| **Missing English** | 22 keys |
| **Missing German** | 9 keys |
| **Translation sources** | ApplicationResources + BaseResources |

## Quality Checks

After each batch recheck:

- [ ] Verify all keys from the domain are in the `.txt` file
  ```bash
  wc -l specs/planning/translations/i18n-keys-*.txt
  ```
  
- [ ] Check that missing English translations are flagged
  ```bash
  grep "MISSING_EN" specs/planning/translations/lookup-*.csv | wc -l
  ```
  
- [ ] Identify HARDCODED strings in analysis files
  ```bash
  grep -rohE '"[A-Z][a-zA-Z ]+"' specs/analysis/{domain}/ | sort -u
  ```
  
- [ ] Generate updated markdown report
  ```bash
  cat specs/planning/translations/translation-summary.md
  ```
  
- [ ] Update at least one analysis document with real translations

## Automation Opportunities

### Pre-commit Hook

Add to `.git/hooks/pre-commit`:
```bash
#!/bin/bash
# Check if translation files changed
if git diff --cached --name-only | grep -q "ApplicationResources"; then
  echo "Running translation lookup..."
  ./specs/planning/translations/lookup-translations.sh system
  ./specs/planning/translations/lookup-translations.sh treatment
  # Add other critical domains
fi
```

### CI/CD Check

Add to CI pipeline:
```yaml
- name: Check translation coverage
  run: |
    ./specs/planning/translations/lookup-translations.sh all
    if grep -q "MISSING_EN" specs/planning/translations/lookup-*.csv; then
      echo "⚠️ Missing English translations detected"
      grep "MISSING_EN" specs/planning/translations/lookup-*.csv
    fi
```

## Troubleshooting

### Script Not Finding Keys

**Problem**: Keys exist but script reports MISSING

**Solution**: Check for whitespace or encoding issues
```bash
# Check exact key format
grep "^key\.name" ApplicationResources.properties | cat -A

# Try with word boundary matching
grep -E "^key\.name[[:space:]]*=" ApplicationResources.properties
```

### BaseResources Not Found

**Problem**: `/tmp/webcore_extract/` doesn't exist

**Solution**: Re-extract from JAR
```bash
cd /tmp && rm -rf webcore_extract && mkdir webcore_extract && cd webcore_extract
jar -xf ~/.m2/repository/corinis/webCore/1.5/webCore-1.5.jar
```

### Unicode Escape Sequences

**Problem**: German umlauts show as `\u00FC`

**Solution**: This is normal Java properties format. To decode:
```bash
# Use native2ascii or online decoder
echo "w\u00FCrde" | native2ascii -reverse
```

## Example: Complete Recheck Session

```bash
# 1. Navigate to project
cd /home/raphael/src/vc/BearStudio-start-ui-web

# 2. Re-extract keys (if analysis files changed)
for domain in specs/analysis/*/; do
  domain_name=$(basename "$domain")
  grep -rohE '\{\{i18n\.[a-zA-Z0-9_.]+\}\}' "$domain" 2>/dev/null | \
    sed 's/{{i18n\.//;s/}}//' | sort -u > \
    "specs/planning/translations/i18n-keys-${domain_name}.txt"
done

# 3. Run lookup for all domains
for domain in academy accounting customer interfaces planning system treatment user-management; do
  ./specs/planning/translations/lookup-translations.sh $domain
done

# 4. Check results
echo "=== Missing English ==="
grep "MISSING_EN" specs/planning/translations/lookup-*.csv | cut -d'|' -f1,2 | sort -u

echo "=== Missing German ==="
grep "MISSING_DE" specs/planning/translations/lookup-*.csv | cut -d'|' -f1,3 | sort -u

# 5. Update summary
cat specs/planning/translations/translation-summary.md

# 6. Pick one domain to update
# Edit the analysis files with real translations from the CSV
```

## Conclusion

This batched recheck system provides:
- ✅ Automated extraction of i18n keys from analysis files
- ✅ Systematic lookup across multiple translation sources
- ✅ Clear visibility of missing translations
- ✅ Repeatable process for quality assurance
- ✅ Foundation for continuous translation maintenance

Use this system regularly to maintain high translation quality as analysis documents evolve.
