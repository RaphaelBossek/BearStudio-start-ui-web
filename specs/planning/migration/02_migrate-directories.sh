#!/bin/bash
set -e

# Script 02: Migrate files from old directory structure to new consolidated domain folders
# This script moves files to their new locations according to the migration plan

echo "=========================================="
echo "Script 02: Directory Migration Process"
echo "=========================================="
echo ""

cd "$(dirname "$0")/../.." || exit 1

if [ ! -d "specs" ]; then
  echo "❌ Error: specs directory not found"
  exit 1
fi

# Create new directory structure
echo "Creating new directory structure..."

# Analysis directories
mkdir -p specs/analysis/{dashboard,appointments,shifts,treatments,council,consultations,appointment-admin,notifications,customers,staff,administration,system-admin,includes,permissions,orphan,i18n/domains,i18n/scripts}

# Wireframes directories  
mkdir -p specs/wireframes/{dashboard,appointments,shifts,treatments,council,consultations,appointment-admin,notifications,customers,staff,administration,system-admin,includes,orphan,components}

# New top-level directories
mkdir -p specs/{features/appointments,features/shifts,features/treatments,features/consultations,features/customers,features/staff,features/administration,features/system-admin,features/includes,domains/appointments,domains/consultations,domains/customers,domains/staff,decisions,migration,testing}

echo "✅ New directory structure created"
echo ""

# Function to move file with validation
move_file() {
  local src="$1"
  local dest="$2"
  
  if [ -f "$src" ]; then
    if mv "$src" "$dest"; then
      echo "  Moved: $src → $dest"
    else
      echo "  ❌ Failed to move: $src → $dest"
      return 1
    fi
  elif [ -d "$src" ]; then
    # For directories, move contents
    for file in "$src"/*; do
      if [ -f "$file" ]; then
        if mv "$file" "$dest/"; then
          echo "  Moved: $file → $dest/"
        else
          echo "  ❌ Failed to move: $file → $dest/"
          return 1
        fi
      fi
    done
  else
    echo "  ⚠ Source not found: $src"
  fi
}

echo "Migrating Analysis files..."
echo "--------------------------"

# Dashboard
move_file "specs/analysis/system/dashboard/01-dashboard-main.md" "specs/analysis/dashboard/standard.md"
move_file "specs/analysis/system/dashboard/03-dashboard-admin.md" "specs/analysis/dashboard/admin.md"
move_file "specs/analysis/planning/dashboard/02-dashboard-selfservice.md" "specs/analysis/dashboard/self-service.md"

# Appointments
move_file "specs/analysis/planning/appointment/01-appointment-list.md" "specs/analysis/appointments/list.md"
move_file "specs/analysis/planning/appointment/02-appointment-details-scheduling.md" "specs/analysis/appointments/details.md"
move_file "specs/analysis/planning/appointment/03-appointment-assign-user.md" "specs/analysis/appointments/assign-user.md"
move_file "specs/analysis/planning/appointment-support/01-appointment-plan.md" "specs/analysis/appointments/plan.md"
move_file "specs/analysis/treatment/patient-data/01-patient-data.md" "specs/analysis/appointments/patient-data.md"

# Shifts
move_file "specs/analysis/planning/shift/01-shift-and-plan.md" "specs/analysis/shifts/list.md"
move_file "specs/analysis/planning/shift/wireframe-plan.md" "specs/analysis/shifts/plan.md"

# Treatments
move_file "specs/analysis/treatment/treatment-core/01-treatment-and-category.md" "specs/analysis/treatments/list.md"
move_file "specs/analysis/treatment/treatment-core/02-treatment-plan.md" "specs/analysis/treatments/plan.md"

# Council
move_file "specs/analysis/planning/council/01-council-and-plan.md" "specs/analysis/council/list.md"
move_file "specs/analysis/planning/council/wireframe-plan.md" "specs/analysis/council/plan.md"

# Consultations
for file in specs/analysis/treatment/consultation/*.md; do
  if [ -f "$file" ]; then
    base=$(basename "$file")
    case "$base" in
      "01-consultation-list.md") move_file "$file" "specs/analysis/consultations/list.md" ;;
      "02-consultation-details-header.md") move_file "$file" "specs/analysis/consultations/details-header.md" ;;
      "03-consultation-details-standard.md") move_file "$file" "specs/analysis/consultations/standard-form.md" ;;
      "04-consultation-details-onboarding.md") move_file "$file" "specs/analysis/consultations/onboarding-form.md" ;;
      "05-consultation-details-incarceration.md") move_file "$file" "specs/analysis/consultations/incarceration-form.md" ;;
      "06-consultation-details-treatment-warning.md") move_file "$file" "specs/analysis/consultations/treatment-warning.md" ;;
      "07-consultation-view-review.md") move_file "$file" "specs/analysis/consultations/view-review.md" ;;
      "08-consultation-details-js.md") move_file "$file" "specs/analysis/consultations/details-js.md" ;;
    esac
  fi
done

# Appointment Admin
move_file "specs/analysis/planning/appointment-admin/01-appointment-admin.md" "specs/analysis/appointment-admin/admin.md"
move_file "specs/analysis/accounting/config/01-accounting-config.md" "specs/analysis/appointment-admin/closed-month.md"

# Notifications
move_file "specs/analysis/system/notification/01-notification.md" "specs/analysis/notifications/list.md"

# Customers
move_file "specs/analysis/customer/customer-core/01-customer-list-detail.md" "specs/analysis/customers/list.md"
move_file "specs/analysis/customer/customer-core/02-location-and-users.md" "specs/analysis/customers/locations-users.md"
move_file "specs/analysis/accounting/invoice/01-invoice-list.md" "specs/analysis/customers/invoices.md"
move_file "specs/analysis/accounting/invoice/02-invoice-details.md" "specs/analysis/customers/invoice-details.md"
move_file "specs/analysis/accounting/invoice-receiver/01-invoice-receiver.md" "specs/analysis/customers/invoice-receivers.md"
move_file "specs/analysis/customer/room/01-room.md" "specs/analysis/customers/rooms.md"
move_file "specs/analysis/customer/equipment/01-equipment.md" "specs/analysis/customers/equipment.md"

# Staff
move_file "specs/analysis/user-management/profile/" "specs/analysis/staff/profile.md"
move_file "specs/analysis/user-management/admin-user/02-user-management.md" "specs/analysis/staff/user-management.md"
move_file "specs/analysis/user-management/onboarding/01-onboarding-flow.md" "specs/analysis/staff/onboarding.md"

# Administration
move_file "specs/analysis/accounting/admin-job/03-job-configuration.md" "specs/analysis/administration/jobs.md"
move_file "specs/analysis/accounting/config/01-accounting-config.md" "specs/analysis/administration/job-prices.md"
move_file "specs/analysis/user-management/admin-skill/04-skill.md" "specs/analysis/administration/skills.md"
move_file "specs/analysis/treatment/warning/01-warning-management.md" "specs/analysis/administration/warnings.md"

# System Admin
move_file "specs/analysis/system/admin-system/01-admin-landing.md" "specs/analysis/system-admin/admin-landing.md"
move_file "specs/analysis/system/admin-cruds/04-motd-template.md" "specs/analysis/system-admin/motd.md"
move_file "specs/analysis/accounting/admin-workhour/04-workhour.md" "specs/analysis/system-admin/work-hours.md"
move_file "specs/analysis/system/cdr-call/01-cdr-call.md" "specs/analysis/system-admin/cdr.md"

# Includes (retain but consolidate)
move_file "specs/analysis/system/includes/03-site-shell.md" "specs/analysis/includes/site-shell.md"
move_file "specs/analysis/system/includes/01-includes-shared-components.md" "specs/analysis/includes/shared-components.md"
move_file "specs/analysis/system/includes/02-includes-customization.md" "specs/analysis/includes/customization.md"
move_file "specs/analysis/system/templates-files/01-templates-files.md" "specs/analysis/includes/templates-files.md"

# Orphan (from academy)
move_file "specs/analysis/academy/support-video/01-support-and-video.md" "specs/analysis/orphan/support-and-video.md"
move_file "specs/analysis/academy/video-history/" "specs/analysis/orphan/user-video-history.md"

# i18n (from planning/translations)
if [ -d "specs/analysis/planning/translations" ]; then
  mv specs/analysis/planning/translations/* specs/analysis/i18n/ 2>/dev/null || true
  echo "  Moved: specs/analysis/planning/translations/* → specs/analysis/i18n/"
fi

echo ""
echo "Migrating Wireframes files..."
echo "-----------------------------"

# Dashboard wireframes
for file in specs/wireframes/planning/dashboard/*.pen specs/wireframes/planning/dashboard/*.png; do
  if [ -f "$file" ]; then
    base=$(basename "$file")
    case "$base" in
      "calendar.pen"|"calendar.png") mv "$file" "specs/wireframes/dashboard/" 2>/dev/null && echo "  Moved: $file → specs/wireframes/dashboard/" ;;
      "expert-availability.pen"|"expert-availability.png") mv "$file" "specs/wireframes/dashboard/availability-week.png" 2>/dev/null && echo "  Moved: $file → specs/wireframes/dashboard/" ;;
      "shift-dialog.pen"|"shift-dialog.png") mv "$file" "specs/wireframes/dashboard/" 2>/dev/null && echo "  Moved: $file → specs/wireframes/dashboard/" ;;
      "end-shift.pen"|"end-shift.png") mv "$file" "specs/wireframes/dashboard/" 2>/dev/null && echo "  Moved: $file → specs/wireframes/dashboard/" ;;
    esac
  fi
done

# Appointment wireframes
for file in specs/wireframes/planning/appointment/*.pen specs/wireframes/planning/appointment/*.png; do
  if [ -f "$file" ]; then
    base=$(basename "$file")
    case "$base" in
      "appointment-list."*) mv "$file" "specs/wireframes/appointments/list.${file##*.}" ;;
      "appointment-details."*) mv "$file" "specs/wireframes/appointments/details.${file##*.}" ;;
      "appointment-details-referenced."*) mv "$file" "specs/wireframes/appointments/details-referenced.${file##*.}" ;;
      "appointment-details-patients."*) mv "$file" "specs/wireframes/appointments/details-patients.${file##*.}" ;;
      "appointment-details-assigned."*) mv "$file" "specs/wireframes/appointments/details-assigned.${file##*.}" ;;
      "appointment-details-suggestions."*) mv "$file" "specs/wireframes/appointments/details-suggestions.${file##*.}" ;;
      "appointment-assign-user."*) mv "$file" "specs/wireframes/appointments/assign-user.${file##*.}" ;;
      "appointment-state-legend."*) mv "$file" "specs/wireframes/appointments/state-legend.${file##*.}" ;;
    esac
    [ -f "$file" ] && echo "  Moved: $file → specs/wireframes/appointments/"
  fi
done

# Shift wireframes
for file in specs/wireframes/planning/shift/*.pen specs/wireframes/planning/shift/*.png; do
  if [ -f "$file" ]; then
    base=$(basename "$file")
    case "$base" in
      "shift-list."*) mv "$file" "specs/wireframes/shifts/shift-list.${file##*.}" ;;
      "shift-plan-detail."*) mv "$file" "specs/wireframes/shifts/shift-plan-detail.${file##*.}" ;;
      "apply-plan."*) mv "$file" "specs/wireframes/shifts/apply-plan.${file##*.}" ;;
    esac
    [ -f "$file" ] && echo "  Moved: $file → specs/wireframes/shifts/"
  fi
done

# Council wireframes
for file in specs/wireframes/planning/council/*.pen specs/wireframes/planning/council/*.png; do
  if [ -f "$file" ]; then
    base=$(basename "$file")
    case "$base" in
      "council-list."*) mv "$file" "specs/wireframes/council/council-list.${file##*.}" ;;
      "council-plan-detail."*) mv "$file" "specs/wireframes/council/council-plan-detail.${file##*.}" ;;
    esac
    [ -f "$file" ] && echo "  Moved: $file → specs/wireframes/council/"
  fi
done

# Consultation wireframes
for file in specs/wireframes/treatment/consultation/*.pen specs/wireframes/treatment/consultation/*.png; do
  if [ -f "$file" ]; then
    base=$(basename "$file")
    case "$base" in
      "consultation-list."*) mv "$file" "specs/wireframes/consultations/list.${file##*.}" ;;
      "consultation-details-header."*) mv "$file" "specs/wireframes/consultations/details-header.${file##*.}" ;;
      "consultation-details-standard."*) mv "$file" "specs/wireframes/consultations/standard-form.${file##*.}" ;;
      "consultation-details-onboarding."*) mv "$file" "specs/wireframes/consultations/onboarding-form.${file##*.}" ;;
      "consultation-details-incarceration."*) mv "$file" "specs/wireframes/consultations/incarceration-form.${file##*.}" ;;
      "consultation-details-treatment-warning."*) mv "$file" "specs/wireframes/consultations/treatment-warning.${file##*.}" ;;
      "consultation-view."*) mv "$file" "specs/wireframes/consultations/view.${file##*.}" ;;
      "consultation-review."*) mv "$file" "specs/wireframes/consultations/review.${file##*.}" ;;
      "consultation-icd10-search."*) mv "$file" "specs/wireframes/consultations/icd10-search.${file##*.}" ;;
      "consultation-export-template."*) mv "$file" "specs/wireframes/consultations/export-template.${file##*.}" ;;
    esac
    [ -f "$file" ] && echo "  Moved: $file → specs/wireframes/consultations/"
  fi
done

# Customer wireframes
for file in specs/wireframes/customer/customer-core/*.pen specs/wireframes/customer/customer-core/*.png; do
  if [ -f "$file" ]; then
    mv "$file" "specs/wireframes/customers/" 2>/dev/null && echo "  Moved: $file → specs/wireframes/customers/"
  fi
done

for file in specs/wireframes/customer/room/*.pen specs/wireframes/customer/room/*.png; do
  if [ -f "$file" ]; then
    mv "$file" "specs/wireframes/customers/" 2>/dev/null && echo "  Moved: $file → specs/wireframes/customers/"
  fi
done

for file in specs/wireframes/customer/equipment/*.pen specs/wireframes/customer/equipment/*.png; do
  if [ -f "$file" ]; then
    mv "$file" "specs/wireframes/customers/" 2>/dev/null && echo "  Moved: $file → specs/wireframes/customers/"
  fi
done

# Staff wireframes
for file in specs/wireframes/user-management/profile/*.pen specs/wireframes/user-management/profile/*.png; do
  if [ -f "$file" ]; then
    mv "$file" "specs/wireframes/staff/" 2>/dev/null && echo "  Moved: $file → specs/wireframes/staff/"
  fi
done

# Administration wireframes
for file in specs/wireframes/accounting/admin-job/*.pen specs/wireframes/accounting/admin-job/*.png; do
  if [ -f "$file" ]; then
    mv "$file" "specs/wireframes/administration/" 2>/dev/null && echo "  Moved: $file → specs/wireframes/administration/"
  fi
done

for file in specs/wireframes/accounting/config/*.pen specs/wireframes/accounting/config/*.png; do
  if [ -f "$file" ]; then
    mv "$file" "specs/wireframes/administration/" 2>/dev/null && echo "  Moved: $file → specs/wireframes/administration/"
  fi
done

for file in specs/wireframes/accounting/invoice/*.pen specs/wireframes/accounting/invoice/*.png; do
  if [ -f "$file" ]; then
    mv "$file" "specs/wireframes/administration/" 2>/dev/null && echo "  Moved: $file → specs/wireframes/administration/"
  fi
done

for file in specs/wireframes/accounting/invoice-receiver/*.pen specs/wireframes/accounting/invoice-receiver/*.png; do
  if [ -f "$file" ]; then
    mv "$file" "specs/wireframes/administration/" 2>/dev/null && echo "  Moved: $file → specs/wireframes/administration/"
  fi
done

for file in specs/wireframes/accounting/worklog/*.pen specs/wireframes/accounting/worklog/*.png; do
  if [ -f "$file" ]; then
    mv "$file" "specs/wireframes/administration/" 2>/dev/null && echo "  Moved: $file → specs/wireframes/administration/"
  fi
done

# System Admin wireframes
for file in specs/wireframes/system/dashboard/*.pen specs/wireframes/system/dashboard/*.png; do
  if [ -f "$file" ]; then
    mv "$file" "specs/wireframes/system-admin/" 2>/dev/null && echo "  Moved: $file → specs/wireframes/system-admin/"
  fi
done

for file in specs/wireframes/system/cdr-call/*.pen specs/wireframes/system/cdr-call/*.png; do
  if [ -f "$file" ]; then
    mv "$file" "specs/wireframes/system-admin/" 2>/dev/null && echo "  Moved: $file → specs/wireframes/system-admin/"
  fi
done

# Includes wireframes
for file in specs/wireframes/system/includes/*.pen specs/wireframes/system/includes/*.png; do
  if [ -f "$file" ]; then
    mv "$file" "specs/wireframes/includes/" 2>/dev/null && echo "  Moved: $file → specs/wireframes/includes/"
  fi
done

# Orphan wireframes (from academy)
for file in specs/wireframes/academy/support-video/*.pen specs/wireframes/academy/support-video/*.png; do
  if [ -f "$file" ]; then
    mv "$file" "specs/wireframes/orphan/" 2>/dev/null && echo "  Moved: $file → specs/wireframes/orphan/"
  fi
done

echo ""
echo "✅ Directory migration complete"
echo "=========================================="
