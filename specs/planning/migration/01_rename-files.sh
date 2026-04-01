#!/bin/bash
set -e

# Script 01: Rename files by removing numeric prefixes and applying standardized names
# Must run BEFORE update-references.sh
# Examples:
#   01-appointment-list.md → list.md
#   02-appointment-details-scheduling.md → details.md
#   01-equipment.md → equipment.md

echo "=========================================="
echo "Script 01: File Renaming Process"
echo "=========================================="
echo ""

cd "$(dirname "$0")/../.." || exit 1

if [ ! -d "specs" ]; then
  echo "❌ Error: Failed to change to specs directory"
  echo "Analysis: specs directory may not exist from current location"
  echo "Direction: Run 'pwd' to verify current directory, then 'ls -la' to check specs exists"
  exit 1
fi

# Define rename mappings: "old_pattern" -> "new_name"
declare -A renames=(
  # Appointments
  ["01-appointment-list.md"]="list.md"
  ["02-appointment-details-scheduling.md"]="details.md"
  ["03-appointment-assign-user.md"]="assign-user.md"
  
  # Shifts
  ["01-shift-and-plan.md"]="list.md"
  
  # Council
  ["01-council-and-plan.md"]="list.md"
  
  # Consultations
  ["01-consultation-list.md"]="list.md"
  ["02-consultation-details-header.md"]="details-header.md"
  ["03-consultation-details-standard.md"]="standard-form.md"
  ["04-consultation-details-onboarding.md"]="onboarding-form.md"
  ["05-consultation-details-incarceration.md"]="incarceration-form.md"
  ["06-consultation-details-treatment-warning.md"]="treatment-warning.md"
  ["07-consultation-view-review.md"]="view-review.md"
  ["08-consultation-details-js.md"]="details-js.md"
  
  # Customer
  ["01-customer-list-detail.md"]="list.md"
  ["02-location-and-users.md"]="locations-users.md"
  
  # Invoices
  ["01-invoice-list.md"]="invoices.md"
  ["02-invoice-details.md"]="invoice-details.md"
  
  # Equipment
  ["01-equipment.md"]="equipment.md"
  
  # Notifications
  ["01-notification.md"]="list.md"
  
  # Treatments
  ["01-treatment-and-category.md"]="list.md"
  ["02-treatment-plan.md"]="plan.md"
  
  # User Management
  ["01-onboarding-flow.md"]="onboarding.md"
  ["02-user-management.md"]="user-management.md"
  ["04-skill.md"]="skills.md"
  
  # Admin
  ["03-job-configuration.md"]="jobs.md"
  ["04-workhour.md"]="work-hours.md"
  
  # System
  ["01-admin-landing.md"]="admin-landing.md"
  ["04-motd-template.md"]="motd.md"
  
  # Wireframe plans
  ["wireframe-plan.md"]="wireframes.md"
)

# Process each file
echo "Processing explicit rename mappings..."
rename_errors=0
for old_name in "${!renames[@]}"; do
  new_name="${renames[$old_name]}"
  
  # Find and rename matching files
  find specs -name "$old_name" -type f | while read file; do
    dir=$(dirname "$file")
    new_path="$dir/$new_name"
    
    if [ "$file" != "$new_path" ]; then
      if mv "$file" "$new_path"; then
        echo "Renamed: $file → $new_path"
      else
        echo "❌ Error: Failed to rename $file → $new_path"
        echo "Analysis: Check if destination file already exists or permissions issue"
        echo "Direction: Run 'ls -la $dir/' to inspect directory state"
        rename_errors=$((rename_errors + 1))
      fi
    fi
  done
done

if [ $rename_errors -gt 0 ]; then
  echo "❌ Found $rename_errors rename errors"
  echo "Analysis: Review errors above and resolve conflicts manually"
  echo "Direction: Check for existing files with target names or permission issues"
  exit 1
fi

# Generic numeric prefix removal for files not in mapping
echo ""
echo "Processing generic numeric prefix removal..."
find specs -name "*.md" -type f | while read file; do
  dir=$(dirname "$file")
  base=$(basename "$file")
  
  # Check if filename starts with NN- pattern
  if [[ "$base" =~ ^[0-9]{2}-(.+\.md)$ ]]; then
    new_base="${BASH_REMATCH[1]}"
    new_path="$dir/$new_base"
    
    if [ "$file" != "$new_path" ]; then
      if mv "$file" "$new_path"; then
        echo "Renamed (generic): $file → $new_path"
      else
        echo "❌ Error: Failed to rename (generic) $file → $new_path"
        echo "Analysis: Check if destination already exists or permissions issue"
        echo "Direction: Run 'ls -la $dir/' to inspect directory state"
        exit 1
      fi
    fi
  fi
done

echo ""
echo "✅ File renaming complete"
echo "=========================================="
