#!/bin/bash
set -e

# Script 04: Detect orphaned PNG files not referenced in any markdown
# Run after migration to identify files that can be safely deleted

echo "=========================================="
echo "Script 04: Check Orphaned Files Process"
echo "=========================================="
echo ""

cd "$(dirname "$0")/../.." || exit 1

if [ ! -d "specs/wireframes" ]; then
  echo "❌ Error: specs/wireframes directory not found"
  echo "Analysis: Directory may not exist or permissions issue"
  echo "Direction: Run 'ls -la specs/' to verify wireframes directory exists"
  exit 1
fi

cd specs/wireframes

orphans=0
orphan_list=()

echo "Scanning for orphaned PNG files..."
echo ""

for file in $(find . -name "*.png" -type f); do
  if ! grep -r "$(basename "$file")" . --include="*.md" > /dev/null 2>&1; then
    echo "ORPHANED: $file"
    orphan_list+=("$file")
    orphans=$((orphans + 1))
  fi
done

echo ""
echo "=========================================="
if [ $orphans -eq 0 ]; then
  echo "✅ No orphaned files found"
  echo "=========================================="
  exit 0
else
  echo "❌ Found $orphans orphaned files"
  echo "=========================================="
  echo ""
  echo "Analysis: These PNG files are not referenced in any markdown documentation"
  echo "Direction: Review orphaned files and either delete them or add references"
  echo ""
  echo "Orphaned files to review:"
  for orphan in "${orphan_list[@]}"; do
    echo "  - $orphan"
  done
  echo ""
  echo "To delete all orphaned files, run:"
  echo "  cd specs/wireframes"
  echo "  find . -name '*.png' -type f | while read file; do"
  echo "    if ! grep -r \"\$(basename \$file)\" . --include='*.md' > /dev/null 2>&1; then"
  echo "      rm \"\$file\""
  echo "    fi"
  echo "  done"
  exit 1
fi
