#!/bin/bash
set -e

# Script 06: Clean up empty directories after migration
# Run after successful validation to remove old directory structure

echo "=========================================="
echo "Script 06: Cleanup Empty Directories"
echo "=========================================="
echo ""

cd "$(dirname "$0")/../../.." || exit 1

if [ ! -d "specs" ]; then
  echo "❌ Error: specs directory not found"
  exit 1
fi

cd specs

# Analysis directories to clean (old structure)
echo "Cleaning empty analysis/ subdirectories..."
echo ""

analysis_old_dirs=(
  "accounting/admin-job"
  "accounting/admin-workhour"
  "accounting/config"
  "accounting/invoice"
  "accounting/invoice-receiver"
  "accounting/worklog"
  "academy/support-video"
  "academy/video-history"
  "customer/contact"
  "customer/customer-core"
  "customer/equipment"
  "customer/room"
  "interfaces/dashboard"
  "planning/appointment"
  "planning/appointment-admin"
  "planning/appointment-support"
  "planning/council"
  "planning/dashboard"
  "planning/shift"
  "system/admin-cruds"
  "system/admin-system"
  "system/cdr-call"
  "system/config"
  "system/dashboard"
  "system/notification"
  "system/templates-files"
  "treatment/appointment-patient"
  "treatment/consultation"
  "treatment/dashboard"
  "treatment/medication"
  "treatment/patient-data"
  "treatment/questionnaire"
  "treatment/treatment-core"
  "treatment/warning"
  "user-management/admin-group"
  "user-management/admin-skill"
  "user-management/admin-user"
  "user-management/dashboard"
  "user-management/onboarding"
  "user-management/profile"
)

deleted_count=0
manual_review_count=0

for old_dir in "${analysis_old_dirs[@]}"; do
  if [ -d "analysis/$old_dir" ]; then
    echo "  Checking: analysis/$old_dir"
    if [ -z "$(ls -A "analysis/$old_dir" 2>/dev/null)" ]; then
      if rmdir "analysis/$old_dir" 2>/dev/null; then
        echo "    ✓ Deleted empty directory"
        deleted_count=$((deleted_count + 1))
      else
        echo "    ⚠ Failed to delete directory"
        echo "    Analysis: Directory may have subdirectories or permission issues"
        echo "    Direction: Run 'ls -la analysis/$old_dir' to inspect contents"
      fi
    else
      echo "    ⚠ Directory not empty - manual review required"
      echo "    Contents: $(ls -A "analysis/$old_dir" | head -5)"
      manual_review_count=$((manual_review_count + 1))
    fi
  fi
done

echo ""
echo "Cleaning empty wireframes/ subdirectories..."
echo ""

wireframes_old_dirs=(
  "accounting/admin-job"
  "accounting/config"
  "accounting/invoice"
  "accounting/invoice-receiver"
  "accounting/worklog"
  "academy/support-video"
  "customer/contact"
  "customer/customer-core"
  "customer/equipment"
  "customer/room"
  "interfaces/dashboard"
  "planning/appointment"
  "planning/appointment-admin"
  "planning/appointment-support"
  "planning/council"
  "planning/dashboard"
  "planning/shift"
  "system/admin"
  "system/cdr-call"
  "system/dashboard"
  "system/includes"
  "system/notification"
  "system/shell"
  "treatment/consultation"
  "treatment/dashboard"
  "treatment/questionnaire"
  "user-management/dashboard"
  "user-management/profile"
)

for old_dir in "${wireframes_old_dirs[@]}"; do
  if [ -d "wireframes/$old_dir" ]; then
    echo "  Checking: wireframes/$old_dir"
    if [ -z "$(ls -A "wireframes/$old_dir" 2>/dev/null)" ]; then
      if rmdir "wireframes/$old_dir" 2>/dev/null; then
        echo "    ✓ Deleted empty directory"
        deleted_count=$((deleted_count + 1))
      else
        echo "    ⚠ Failed to delete directory"
        echo "    Analysis: Directory may have subdirectories or permission issues"
        echo "    Direction: Run 'ls -la wireframes/$old_dir' to inspect contents"
      fi
    else
      echo "    ⚠ Directory not empty - manual review required"
      echo "    Contents: $(ls -A "wireframes/$old_dir" | head -5)"
      manual_review_count=$((manual_review_count + 1))
    fi
  fi
done

echo ""
echo "Cleaning empty features/ subdirectories..."
echo ""

features_old_dirs=(
  "compliance/consultation-details"
  "performance/database-optimization"
  "performance/general"
  "resource-management"
  "security"
  "usability"
)

for old_dir in "${features_old_dirs[@]}"; do
  if [ -d "features/$old_dir" ]; then
    echo "  Checking: features/$old_dir"
    if [ -z "$(ls -A "features/$old_dir" 2>/dev/null)" ]; then
      if rmdir "features/$old_dir" 2>/dev/null; then
        echo "    ✓ Deleted empty directory"
        deleted_count=$((deleted_count + 1))
      else
        echo "    ⚠ Failed to delete directory"
        echo "    Analysis: Directory may have subdirectories or permission issues"
        echo "    Direction: Run 'ls -la features/$old_dir' to inspect contents"
      fi
    else
      echo "    ⚠ Directory not empty - manual review required"
      echo "    Contents: $(ls -A "features/$old_dir" | head -5)"
      manual_review_count=$((manual_review_count + 1))
    fi
  fi
done

echo ""
echo "Cleaning empty parent directories..."
echo ""

# Clean parent directories if they became empty
parent_dirs=(
  "analysis/accounting"
  "analysis/academy"
  "analysis/customer"
  "analysis/interfaces"
  "analysis/planning"
  "analysis/system/admin-cruds"
  "analysis/system/admin-system"
  "analysis/system/cdr-call"
  "analysis/system/config"
  "analysis/system/dashboard"
  "analysis/system/notification"
  "analysis/system/templates-files"
  "analysis/treatment"
  "analysis/user-management"
  "wireframes/accounting"
  "wireframes/academy"
  "wireframes/customer"
  "wireframes/interfaces"
  "wireframes/planning"
  "wireframes/system/admin"
  "wireframes/system/cdr-call"
  "wireframes/system/dashboard"
  "wireframes/system/includes"
  "wireframes/system/notification"
  "wireframes/system/shell"
  "wireframes/treatment"
  "wireframes/user-management"
  "features/compliance"
  "features/performance"
)

for parent_dir in "${parent_dirs[@]}"; do
  if [ -d "$parent_dir" ]; then
    echo "  Checking: $parent_dir"
    if [ -z "$(ls -A "$parent_dir" 2>/dev/null)" ]; then
      if rmdir "$parent_dir" 2>/dev/null; then
        echo "    ✓ Deleted empty parent directory"
        deleted_count=$((deleted_count + 1))
      else
        echo "    ⚠ Failed to delete parent directory (may have subdirs)"
      fi
    fi
  fi
done

echo ""
echo "=========================================="
echo "✅ Cleanup Summary"
echo "=========================================="
echo "  Directories deleted: $deleted_count"
echo "  Directories needing manual review: $manual_review_count"
echo ""

if [ $manual_review_count -gt 0 ]; then
  echo "⚠ Some directories require manual review"
  echo "Direction: Inspect non-empty directories and decide whether to:"
  echo "  1. Move remaining files to new locations"
  echo "  2. Delete the directory and its contents"
  echo "  3. Keep the directory if it contains needed content"
  exit 1
else
  echo "✅ All old directories cleaned up successfully"
  exit 0
fi
