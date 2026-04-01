#!/bin/bash
set -e

# Script 05: Validate migration completeness
# Run as final step to ensure all files are in correct locations and links work

echo "=========================================="
echo "Script 05: Validate Migration Process"
echo "=========================================="
echo ""

cd "$(dirname "$0")/../.." || exit 1

if [ ! -d "specs" ]; then
  echo "❌ Error: specs directory not found"
  exit 1
fi

errors=0

# Check all domains exist
echo "Checking domain directories exist..."
echo ""

analysis_domains=(dashboard appointments shifts treatments council consultations appointment-admin notifications customers staff administration system-admin includes permissions orphan i18n)
wireframes_domains=(dashboard appointments shifts treatments council consultations appointment-admin notifications customers staff administration system-admin includes orphan components)

for domain in "${analysis_domains[@]}"; do
  if [ ! -d "specs/analysis/$domain" ]; then
    echo "  ❌ Missing: analysis/$domain"
    errors=$((errors + 1))
  else
    echo "  ✓ analysis/$domain"
  fi
done

echo ""

for domain in "${wireframes_domains[@]}"; do
  if [ ! -d "specs/wireframes/$domain" ]; then
    echo "  ❌ Missing: wireframes/$domain"
    errors=$((errors + 1))
  else
    echo "  ✓ wireframes/$domain"
  fi
done

echo ""

# Check new top-level directories
echo "Checking new top-level directories..."
echo ""

new_dirs=(features/domains domains decisions migration testing)
for dir in "${new_dirs[@]}"; do
  if [ ! -d "specs/$dir" ]; then
    echo "  ❌ Missing: $dir"
    errors=$((errors + 1))
  else
    echo "  ✓ $dir"
  fi
done

echo ""

# Check for broken markdown links
echo "Checking for broken links..."
echo ""

broken_links=0
broken_link_details=()

for md_file in $(find specs -name "*.md" -type f); do
  # Extract relative links from markdown files
  while IFS= read -r link; do
    # Skip external links and anchors
    if [[ "$link" =~ ^http ]] || [[ "$link" =~ ^# ]]; then
      continue
    fi
    
    # Resolve relative path from the file's directory
    file_dir=$(dirname "$md_file")
    target_path="$file_dir/$link"
    
    # Remove anchor from path if present
    target_path="${target_path%%#*}"
    
    if [ ! -e "$target_path" ]; then
      broken_link_details+=("  ❌ $md_file: $link")
      broken_links=$((broken_links + 1))
    fi
  done < <(grep -oP '\]\(\K[^\)]+' "$md_file" 2>/dev/null || true)
done

if [ $broken_links -gt 0 ]; then
  echo "  ❌ Found $broken_links broken links"
  echo ""
  echo "  Broken link details:"
  for detail in "${broken_link_details[@]}"; do
    echo "$detail"
  done
  errors=$((errors + broken_links))
else
  echo "  ✓ No broken links found"
fi

echo ""

# Check for files still in old locations
echo "Checking for files in old locations..."
echo ""

old_locations=(
  "specs/analysis/accounting"
  "specs/analysis/academy"
  "specs/analysis/customer"
  "specs/analysis/interfaces"
  "specs/analysis/planning"
  "specs/analysis/system/dashboard"
  "specs/analysis/system/notification"
  "specs/analysis/system/admin-system"
  "specs/analysis/system/admin-cruds"
  "specs/analysis/system/cdr-call"
  "specs/analysis/treatment"
  "specs/analysis/user-management"
  "specs/wireframes/accounting"
  "specs/wireframes/academy"
  "specs/wireframes/customer"
  "specs/wireframes/interfaces"
  "specs/wireframes/planning"
  "specs/wireframes/system/dashboard"
  "specs/wireframes/system/cdr-call"
  "specs/wireframes/user-management"
)

files_in_old_locations=0
for old_loc in "${old_locations[@]}"; do
  if [ -d "$old_loc" ]; then
    file_count=$(find "$old_loc" -type f 2>/dev/null | wc -l)
    if [ "$file_count" -gt 0 ]; then
      echo "  ⚠ Found $file_count files in old location: $old_loc"
      files_in_old_locations=$((files_in_old_locations + file_count))
    fi
  fi
done

if [ $files_in_old_locations -gt 0 ]; then
  echo ""
  echo "  ⚠ Total files in old locations: $files_in_old_locations"
  echo "  Direction: Run Script 02 (migrate-directories.sh) to move remaining files"
else
  echo "  ✓ No files found in old locations"
fi

echo ""
echo "=========================================="

# Summary
if [ $errors -eq 0 ] && [ $files_in_old_locations -eq 0 ]; then
  echo "✅ Migration validation passed"
  echo "=========================================="
  exit 0
else
  echo "❌ Found $errors validation errors"
  if [ $files_in_old_locations -gt 0 ]; then
    echo "⚠ Found $files_in_old_locations files still in old locations"
  fi
  echo "=========================================="
  echo ""
  echo "Analysis: Review missing directories and broken links above"
  echo "Direction: Fix missing directories or update broken references in markdown files"
  exit 1
fi
