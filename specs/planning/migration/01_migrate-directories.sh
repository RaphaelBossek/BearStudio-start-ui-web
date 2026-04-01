#!/bin/bash
set -e

# Script 01: Move files from old directory structure to new consolidated domain folders
# Files are moved with their numeric prefixes - renaming happens in script 02
# MUST run BEFORE 02_rename-files.sh

echo "=========================================="
echo "Script 01: Directory Migration Process"
echo "=========================================="
echo ""

cd "$(dirname "$0")/../../.." || exit 1

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
    if mv "$src" "$dest" 2>/dev/null; then
      echo "  Moved: $src → $dest"
    else
      echo "  ⚠ Could not move: $src → $dest"
    fi
  elif [ -d "$src" ]; then
    for file in "$src"/*; do
      if [ -f "$file" ]; then
        if mv "$file" "$dest/" 2>/dev/null; then
          echo "  Moved: $file → $dest/"
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
move_file "specs/analysis/system/dashboard/01-dashboard-main.md" "specs/analysis/dashboard/01-dashboard-main.md"
move_file "specs/analysis/system/dashboard/03-dashboard-admin.md" "specs/analysis/dashboard/03-dashboard-admin.md"
move_file "specs/analysis/system/dashboard/04-dialogs-system.md" "specs/analysis/dashboard/04-dialogs-system.md"
move_file "specs/analysis/planning/dashboard/02-dashboard-selfservice.md" "specs/analysis/dashboard/02-dashboard-selfservice.md"

# Appointments
move_file "specs/analysis/planning/appointment/01-appointment-list.md" "specs/analysis/appointments/01-appointment-list.md"
move_file "specs/analysis/planning/appointment/02-appointment-details-scheduling.md" "specs/analysis/appointments/02-appointment-details-scheduling.md"
move_file "specs/analysis/planning/appointment/03-appointment-assign-user.md" "specs/analysis/appointments/03-appointment-assign-user.md"
move_file "specs/analysis/planning/appointment-support/01-appointment-plan.md" "specs/analysis/appointments/01-appointment-plan.md"
move_file "specs/analysis/treatment/patient-data/01-patient-data.md" "specs/analysis/appointments/01-patient-data.md"

# Shifts
move_file "specs/analysis/planning/shift/01-shift-and-plan.md" "specs/analysis/shifts/01-shift-and-plan.md"

# Treatments
move_file "specs/analysis/treatment/treatment-core/01-treatment-and-category.md" "specs/analysis/treatments/01-treatment-and-category.md"
move_file "specs/analysis/treatment/treatment-core/02-treatment-plan.md" "specs/analysis/treatments/02-treatment-plan.md"

# Council
move_file "specs/analysis/planning/council/01-council-and-plan.md" "specs/analysis/council/01-council-and-plan.md"

# Consultations
move_file "specs/analysis/treatment/consultation/01-consultation-list.md" "specs/analysis/consultations/01-consultation-list.md"
move_file "specs/analysis/treatment/consultation/02-consultation-details-header.md" "specs/analysis/consultations/02-consultation-details-header.md"
move_file "specs/analysis/treatment/consultation/03-consultation-details-standard.md" "specs/analysis/consultations/03-consultation-details-standard.md"
move_file "specs/analysis/treatment/consultation/04-consultation-details-onboarding.md" "specs/analysis/consultations/04-consultation-details-onboarding.md"
move_file "specs/analysis/treatment/consultation/05-consultation-details-incarceration.md" "specs/analysis/consultations/05-consultation-details-incarceration.md"
move_file "specs/analysis/treatment/consultation/06-consultation-details-treatment-warning.md" "specs/analysis/consultations/06-consultation-details-treatment-warning.md"
move_file "specs/analysis/treatment/consultation/07-consultation-view-review.md" "specs/analysis/consultations/07-consultation-view-review.md"
move_file "specs/analysis/treatment/consultation/08-consultation-details-js.md" "specs/analysis/consultations/08-consultation-details-js.md"

# Appointment Admin
move_file "specs/analysis/planning/appointment-admin/01-appointment-admin.md" "specs/analysis/appointment-admin/01-appointment-admin.md"
move_file "specs/analysis/accounting/config/01-accounting-config.md" "specs/analysis/appointment-admin/01-accounting-config.md"

# Notifications
move_file "specs/analysis/system/notification/01-notification.md" "specs/analysis/notifications/01-notification.md"

# Customers
move_file "specs/analysis/customer/customer-core/01-customer-list-detail.md" "specs/analysis/customers/01-customer-list-detail.md"
move_file "specs/analysis/customer/customer-core/02-location-and-users.md" "specs/analysis/customers/02-location-and-users.md"
move_file "specs/analysis/accounting/invoice/01-invoice-list.md" "specs/analysis/customers/01-invoice-list.md"
move_file "specs/analysis/accounting/invoice/02-invoice-details.md" "specs/analysis/customers/02-invoice-details.md"
move_file "specs/analysis/accounting/invoice-receiver/01-invoice-receiver.md" "specs/analysis/customers/01-invoice-receiver.md"
move_file "specs/analysis/customer/room/01-room.md" "specs/analysis/customers/01-room.md"
move_file "specs/analysis/customer/equipment/01-equipment.md" "specs/analysis/customers/01-equipment.md"

# Staff
move_file "specs/analysis/user-management/profile/01-profile-form.md" "specs/analysis/staff/01-profile-form.md"
move_file "specs/analysis/user-management/profile/02-profile-staff.md" "specs/analysis/staff/02-profile-staff.md"
move_file "specs/analysis/user-management/profile/03-profile-dialogs.md" "specs/analysis/staff/03-profile-dialogs.md"
move_file "specs/analysis/user-management/profile/04-profile-expert-availability.md" "specs/analysis/staff/04-profile-expert-availability.md"
move_file "specs/analysis/user-management/admin-user/02-user-management.md" "specs/analysis/staff/02-user-management.md"
move_file "specs/analysis/user-management/onboarding/01-onboarding-flow.md" "specs/analysis/staff/01-onboarding-flow.md"

# Administration
move_file "specs/analysis/accounting/admin-job/03-job-configuration.md" "specs/analysis/administration/03-job-configuration.md"
move_file "specs/analysis/user-management/admin-skill/04-skill.md" "specs/analysis/administration/04-skill.md"
move_file "specs/analysis/treatment/warning/01-warning-management.md" "specs/analysis/administration/01-warning-management.md"

# System Admin
move_file "specs/analysis/system/admin-system/01-admin-landing.md" "specs/analysis/system-admin/01-admin-landing.md"
move_file "specs/analysis/system/admin-cruds/04-motd-template.md" "specs/analysis/system-admin/04-motd-template.md"
move_file "specs/analysis/accounting/admin-workhour/04-workhour.md" "specs/analysis/system-admin/04-workhour.md"
move_file "specs/analysis/system/cdr-call/01-cdr-call.md" "specs/analysis/system-admin/01-cdr-call.md"

# Includes
move_file "specs/analysis/system/includes/03-site-shell.md" "specs/analysis/includes/03-site-shell.md"
move_file "specs/analysis/system/includes/01-includes-shared-components.md" "specs/analysis/includes/01-includes-shared-components.md"
move_file "specs/analysis/system/includes/02-includes-customization.md" "specs/analysis/includes/02-includes-customization.md"
move_file "specs/analysis/system/templates-files/01-templates-files.md" "specs/analysis/includes/01-templates-files.md"

# Orphan
move_file "specs/analysis/academy/support-video/01-support-and-video.md" "specs/analysis/orphan/01-support-and-video.md"
move_file "specs/analysis/academy/video-history/01-user-video-history.md" "specs/analysis/orphan/01-user-video-history.md"

echo ""
echo "✅ Directory migration complete"
echo "=========================================="
