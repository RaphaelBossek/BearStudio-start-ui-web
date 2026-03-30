#!/bin/bash
# Translation lookup script for i18n keys
# Usage: ./lookup-translations.sh <domain-name>

set -e

DOMAIN="$1"
if [ -z "$DOMAIN" ]; then
    echo "Usage: $0 <domain-name>"
    echo "Available domains: academy, accounting, customer, interfaces, planning, system, treatment, user-management"
    exit 1
fi

KEYFILE="specs/planning/translations/i18n-keys-${DOMAIN}.txt"
OUTPUTFILE="specs/planning/translations/lookup-${DOMAIN}.csv"
APP_DE="$HOME/src/vc/videoclinic-prod/web/src/main/resources/ApplicationResources.properties"
APP_EN="$HOME/src/vc/videoclinic-prod/web/src/main/resources/ApplicationResources_en.properties"
BASE_DE="/tmp/webcore_extract/BaseResources_de.properties"
BASE_EN="/tmp/webcore_extract/BaseResources.properties"

if [ ! -f "$KEYFILE" ]; then
    echo "Error: Key file not found: $KEYFILE"
    exit 1
fi

echo "Looking up translations for domain: $DOMAIN"
echo "Input: $KEYFILE"
echo "Output: $OUTPUTFILE"
echo "---"

# Write CSV header
echo "key|german|english|source|status" > "$OUTPUTFILE"

missing_en=0
missing_de=0
total=0

while IFS= read -r key; do
    [ -z "$key" ] && continue
    total=$((total + 1))
    
    # Initialize source for this iteration
    source="ApplicationResources"
    
    # Search in ApplicationResources (domain-specific) - use word boundary matching
    de_value=$(grep -E "^${key}[[:space:]]*=" "$APP_DE" 2>/dev/null | head -1 | cut -d'=' -f2- | sed 's/^[[:space:]]*//' || echo "")
    en_value=$(grep -E "^${key}[[:space:]]*=" "$APP_EN" 2>/dev/null | head -1 | cut -d'=' -f2- | sed 's/^[[:space:]]*//' || echo "")
    
    # Search in BaseResources (framework) if not found in ApplicationResources
    if [ -z "$de_value" ]; then
        de_base=$(grep -E "^${key}[[:space:]]*=" "$BASE_DE" 2>/dev/null | head -1 | cut -d'=' -f2- | sed 's/^[[:space:]]*//' || echo "")
        if [ -n "$de_base" ]; then
            de_value="$de_base"
            source="BaseResources_de"
        fi
    fi
    
    if [ -z "$en_value" ]; then
        en_base=$(grep -E "^${key}[[:space:]]*=" "$BASE_EN" 2>/dev/null | head -1 | cut -d'=' -f2- | sed 's/^[[:space:]]*//' || echo "")
        if [ -n "$en_base" ]; then
            en_value="$en_base"
            source="BaseResources"
        fi
    fi
    
    # Determine status
    status="OK"
    if [ -z "$en_value" ]; then
        status="MISSING_EN"
        missing_en=$((missing_en + 1))
    fi
    if [ -z "$de_value" ]; then
        status="MISSING_DE"
        missing_de=$((missing_de + 1))
    fi
    
    # Escape pipe characters in values
    de_value=$(echo "$de_value" | tr '|' ' ')
    en_value=$(echo "$en_value" | tr '|' ' ')
    
    # Write to CSV
    echo "${key}|${de_value}|${en_value}|${source}|${status}" >> "$OUTPUTFILE"
    
done < "$KEYFILE"

echo "---"
echo "Lookup complete!"
echo "Total keys: $total"
echo "Missing English: $missing_en"
echo "Missing German: $missing_de"
echo "Results: $OUTPUTFILE"

# Generate summary
if [ $missing_en -gt 0 ] || [ $missing_de -gt 0 ]; then
    echo ""
    echo "⚠️  Missing translations detected!"
    echo "   Run: grep 'MISSING' $OUTPUTFILE"
fi
