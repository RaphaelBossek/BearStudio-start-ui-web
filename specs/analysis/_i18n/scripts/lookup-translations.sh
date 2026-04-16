#!/bin/bash
# Translation Lookup Script
# 
# Usage: ./lookup-translations.sh <key1> [key2] [key3] ...
#
# This script performs batched rechecks of translation keys against the
# translation files to verify coverage and detect missing translations.
#
# Example:
#   ./lookup-translations.sh "layout:nav.dashboard" "appointment:list.title"
#

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
I18N_DIR="$(dirname "$SCRIPT_DIR")"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

usage() {
    echo "Usage: $0 <translation_key> [translation_key2] ..."
    echo ""
    echo "Examples:"
    echo "  $0 layout:nav.dashboard"
    echo "  $0 appointment:list.title appointment:details.assign"
    echo ""
    echo "This script looks up translation keys in the domain inventory files."
    exit 1
}

if [ $# -eq 0 ]; then
    usage
fi

echo "🔍 Looking up translation keys..."
echo ""

for key in "$@"; do
    found=false
    
    # Search in all domain files
    for domain_file in "$I18N_DIR/domains"/*.md; do
        if grep -q "$key" "$domain_file" 2>/dev/null; then
            domain_name=$(basename "$domain_file" .md)
            echo -e "${GREEN}✓ Found${NC}: $key"
            echo "  Domain: $domain_name"
            
            # Show context (line with key and surrounding lines)
            grep -B1 -A2 "$key" "$domain_file" | head -5
            echo ""
            found=true
            break
        fi
    done
    
    if [ "$found" = false ]; then
        echo -e "${RED}✗ Not found${NC}: $key"
        echo "  Key may be missing from translation inventory"
        echo "  Consider adding to appropriate domain file or ../missing-keys.md"
        echo ""
    fi
done

echo "Lookup complete!"
