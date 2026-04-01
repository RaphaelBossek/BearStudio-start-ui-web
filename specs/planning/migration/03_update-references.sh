#!/bin/bash
set -e

# Script 03: Update all internal markdown references after file moves
# Must run AFTER rename-files.sh and migrate-directories.sh

echo "=========================================="
echo "Script 03: Update References Process"
echo "=========================================="
echo ""

cd "$(dirname "$0")/../../.." || exit 1

if [ ! -d "specs" ]; then
  echo "❌ Error: specs directory not found"
  exit 1
fi

# Update all internal references in markdown files

# Pattern 1: Old paths to new paths
echo "Updating old path references..."
if ! find specs -name "*.md" -type f -exec sed -i \
  's|specs/analysis/planning/appointment/|specs/analysis/appointments/|g' {} \;; then
  echo "❌ Error: Failed to update path references"
  echo "Analysis: Check file permissions and disk space"
  echo "Direction: Run 'find specs -name \"*.md\" -type f' to verify files exist"
  exit 1
fi

if ! find specs -name "*.md" -type f -exec sed -i \
  's|specs/analysis/planning/shift/|specs/analysis/shifts/|g' {} \;; then
  echo "❌ Error: Failed to update shift path references"
  exit 1
fi

if ! find specs -name "*.md" -type f -exec sed -i \
  's|specs/analysis/planning/council/|specs/analysis/council/|g' {} \;; then
  echo "❌ Error: Failed to update council path references"
  exit 1
fi

if ! find specs -name "*.md" -type f -exec sed -i \
  's|specs/analysis/treatment/consultation/|specs/analysis/consultations/|g' {} \;; then
  echo "❌ Error: Failed to update consultation path references"
  exit 1
fi

if ! find specs -name "*.md" -type f -exec sed -i \
  's|specs/analysis/customer/customer-core/|specs/analysis/customers/|g' {} \;; then
  echo "❌ Error: Failed to update customer path references"
  exit 1
fi

if ! find specs -name "*.md" -type f -exec sed -i \
  's|specs/analysis/customer/room/|specs/analysis/customers/|g' {} \;; then
  echo "❌ Error: Failed to update room path references"
  exit 1
fi

if ! find specs -name "*.md" -type f -exec sed -i \
  's|specs/analysis/customer/equipment/|specs/analysis/customers/|g' {} \;; then
  echo "❌ Error: Failed to update equipment path references"
  exit 1
fi

if ! find specs -name "*.md" -type f -exec sed -i \
  's|specs/analysis/system/dashboard/|specs/analysis/dashboard/|g' {} \;; then
  echo "❌ Error: Failed to update dashboard path references"
  exit 1
fi

if ! find specs -name "*.md" -type f -exec sed -i \
  's|specs/analysis/system/notification/|specs/analysis/notifications/|g' {} \;; then
  echo "❌ Error: Failed to update notification path references"
  exit 1
fi

if ! find specs -name "*.md" -type f -exec sed -i \
  's|specs/analysis/system/admin-system/|specs/analysis/system-admin/|g' {} \;; then
  echo "❌ Error: Failed to update admin-system path references"
  exit 1
fi

if ! find specs -name "*.md" -type f -exec sed -i \
  's|specs/analysis/system/admin-cruds/|specs/analysis/system-admin/|g' {} \;; then
  echo "❌ Error: Failed to update admin-cruds path references"
  exit 1
fi

if ! find specs -name "*.md" -type f -exec sed -i \
  's|specs/analysis/system/includes/|specs/analysis/includes/|g' {} \;; then
  echo "❌ Error: Failed to update includes path references"
  exit 1
fi

if ! find specs -name "*.md" -type f -exec sed -i \
  's|specs/analysis/accounting/admin-job/|specs/analysis/administration/|g' {} \;; then
  echo "❌ Error: Failed to update admin-job path references"
  exit 1
fi

if ! find specs -name "*.md" -type f -exec sed -i \
  's|specs/analysis/accounting/invoice/|specs/analysis/customers/|g' {} \;; then
  echo "❌ Error: Failed to update invoice path references"
  exit 1
fi

if ! find specs -name "*.md" -type f -exec sed -i \
  's|specs/analysis/accounting/invoice-receiver/|specs/analysis/customers/|g' {} \;; then
  echo "❌ Error: Failed to update invoice-receiver path references"
  exit 1
fi

if ! find specs -name "*.md" -type f -exec sed -i \
  's|specs/analysis/accounting/config/|specs/analysis/administration/|g' {} \;; then
  echo "❌ Error: Failed to update accounting-config path references"
  exit 1
fi

if ! find specs -name "*.md" -type f -exec sed -i \
  's|specs/analysis/accounting/admin-workhour/|specs/analysis/system-admin/|g' {} \;; then
  echo "❌ Error: Failed to update workhour path references"
  exit 1
fi

if ! find specs -name "*.md" -type f -exec sed -i \
  's|specs/analysis/treatment/treatment-core/|specs/analysis/treatments/|g' {} \;; then
  echo "❌ Error: Failed to update treatment-core path references"
  exit 1
fi

if ! find specs -name "*.md" -type f -exec sed -i \
  's|specs/analysis/treatment/warning/|specs/analysis/administration/|g' {} \;; then
  echo "❌ Error: Failed to update warning path references"
  exit 1
fi

if ! find specs -name "*.md" -type f -exec sed -i \
  's|specs/analysis/user-management/admin-user/|specs/analysis/staff/|g' {} \;; then
  echo "❌ Error: Failed to update admin-user path references"
  exit 1
fi

if ! find specs -name "*.md" -type f -exec sed -i \
  's|specs/analysis/user-management/admin-skill/|specs/analysis/administration/|g' {} \;; then
  echo "❌ Error: Failed to update admin-skill path references"
  exit 1
fi

if ! find specs -name "*.md" -type f -exec sed -i \
  's|specs/analysis/user-management/profile/|specs/analysis/staff/|g' {} \;; then
  echo "❌ Error: Failed to update profile path references"
  exit 1
fi

if ! find specs -name "*.md" -type f -exec sed -i \
  's|specs/analysis/user-management/onboarding/|specs/analysis/staff/|g' {} \;; then
  echo "❌ Error: Failed to update onboarding path references"
  exit 1
fi

if ! find specs -name "*.md" -type f -exec sed -i \
  's|specs/analysis/academy/support-video/|specs/analysis/orphan/|g' {} \;; then
  echo "❌ Error: Failed to update academy path references"
  exit 1
fi

# Wireframe path updates
echo "Updating wireframe path references..."
if ! find specs -name "*.md" -type f -exec sed -i \
  's|specs/wireframes/planning/appointment/|specs/wireframes/appointments/|g' {} \;; then
  echo "❌ Error: Failed to update appointment wireframe path references"
  exit 1
fi

if ! find specs -name "*.md" -type f -exec sed -i \
  's|specs/wireframes/planning/shift/|specs/wireframes/shifts/|g' {} \;; then
  echo "❌ Error: Failed to update shift wireframe path references"
  exit 1
fi

if ! find specs -name "*.md" -type f -exec sed -i \
  's|specs/wireframes/planning/council/|specs/wireframes/council/|g' {} \;; then
  echo "❌ Error: Failed to update council wireframe path references"
  exit 1
fi

if ! find specs -name "*.md" -type f -exec sed -i \
  's|specs/wireframes/treatment/consultation/|specs/wireframes/consultations/|g' {} \;; then
  echo "❌ Error: Failed to update consultation wireframe path references"
  exit 1
fi

if ! find specs -name "*.md" -type f -exec sed -i \
  's|specs/wireframes/customer/customer-core/|specs/wireframes/customers/|g' {} \;; then
  echo "❌ Error: Failed to update customer wireframe path references"
  exit 1
fi

if ! find specs -name "*.md" -type f -exec sed -i \
  's|specs/wireframes/customer/room/|specs/wireframes/customers/|g' {} \;; then
  echo "❌ Error: Failed to update room wireframe path references"
  exit 1
fi

if ! find specs -name "*.md" -type f -exec sed -i \
  's|specs/wireframes/customer/equipment/|specs/wireframes/customers/|g' {} \;; then
  echo "❌ Error: Failed to update equipment wireframe path references"
  exit 1
fi

if ! find specs -name "*.md" -type f -exec sed -i \
  's|specs/wireframes/system/dashboard/|specs/wireframes/system-admin/|g' {} \;; then
  echo "❌ Error: Failed to update system dashboard wireframe path references"
  exit 1
fi

if ! find specs -name "*.md" -type f -exec sed -i \
  's|specs/wireframes/system/cdr-call/|specs/wireframes/system-admin/|g' {} \;; then
  echo "❌ Error: Failed to update cdr-call wireframe path references"
  exit 1
fi

if ! find specs -name "*.md" -type f -exec sed -i \
  's|specs/wireframes/system/includes/|specs/wireframes/includes/|g' {} \;; then
  echo "❌ Error: Failed to update system includes wireframe path references"
  exit 1
fi

if ! find specs -name "*.md" -type f -exec sed -i \
  's|specs/wireframes/accounting/admin-job/|specs/wireframes/administration/|g' {} \;; then
  echo "❌ Error: Failed to update admin-job wireframe path references"
  exit 1
fi

if ! find specs -name "*.md" -type f -exec sed -i \
  's|specs/wireframes/accounting/invoice/|specs/wireframes/administration/|g' {} \;; then
  echo "❌ Error: Failed to update invoice wireframe path references"
  exit 1
fi

if ! find specs -name "*.md" -type f -exec sed -i \
  's|specs/wireframes/accounting/invoice-receiver/|specs/wireframes/administration/|g' {} \;; then
  echo "❌ Error: Failed to update invoice-receiver wireframe path references"
  exit 1
fi

if ! find specs -name "*.md" -type f -exec sed -i \
  's|specs/wireframes/accounting/config/|specs/wireframes/administration/|g' {} \;; then
  echo "❌ Error: Failed to update accounting config wireframe path references"
  exit 1
fi

if ! find specs -name "*.md" -type f -exec sed -i \
  's|specs/wireframes/accounting/worklog/|specs/wireframes/administration/|g' {} \;; then
  echo "❌ Error: Failed to update worklog wireframe path references"
  exit 1
fi

if ! find specs -name "*.md" -type f -exec sed -i \
  's|specs/wireframes/user-management/profile/|specs/wireframes/staff/|g' {} \;; then
  echo "❌ Error: Failed to update profile wireframe path references"
  exit 1
fi

if ! find specs -name "*.md" -type f -exec sed -i \
  's|specs/wireframes/academy/support-video/|specs/wireframes/orphan/|g' {} \;; then
  echo "❌ Error: Failed to update academy wireframe path references"
  exit 1
fi

# Pattern 2: Numeric prefix removal (already handled by Script 01, but update any remaining refs)
echo "Updating numeric prefix references..."
if ! find specs -name "*.md" -type f -exec sed -i \
  's|/01-|/|g; s|/02-|/|g; s|/03-|/|g; s|/04-|/|g; s|/05-|/|g' {} \;; then
  echo "❌ Error: Failed to update numeric prefix references"
  echo "Analysis: Check for files with special characters or permissions issues"
  echo "Direction: Run 'find specs -name \"*.md\" -ls' to inspect problematic files"
  exit 1
fi

# Pattern 3: Wireframe plan references
echo "Updating wireframe plan references..."
if ! find specs -name "*.md" -type f -exec sed -i \
  's|wireframe-plan\.md|wireframes.md|g' {} \;; then
  echo "❌ Error: Failed to update wireframe plan references"
  echo "Analysis: Check for read-only files or filesystem issues"
  echo "Direction: Run 'ls -la specs/**/*.md' to check file permissions"
  exit 1
fi

echo ""
echo "✅ Reference updates complete"
echo "=========================================="
