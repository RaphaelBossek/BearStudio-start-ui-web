#!/bin/bash
set -e

# Script 02: Migrate files from old directory structure to new consolidated domain folders
# This script moves files to their new locations according to the migration plan
# MUST run AFTER 01_rename-files.sh

echo "=========================================="
echo "Script 02: Directory Migration Process"
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
move_file "specs/analysis/system/dashboard/dashboard-main.md" "specs/analysis/dashboard/standard.md"
move_file "specs/analysis/system/dashboard/dashboard-admin.md" "specs/analysis/dashboard/admin.md"
move_file "specs/analysis/planning/dashboard/dashboard-selfservice.md" "specs/analysis/dashboard/self-service.md"

# Appointments
move_file "specs/analysis/planning/appointment/list.md" "specs/analysis/appointments/list.md"
move_file "specs/analysis/planning/appointment/details.md" "specs/analysis/appointments/details.md"
move_file "specs/analysis/planning/appointment/assign-user.md" "specs/analysis/appointments/assign-user.md"
move_file "specs/analysis/planning/appointment-support/appointment-plan.md" "specs/analysis/appointments/plan.md"
move_file "specs/analysis/treatment/patient-data/patient-data.md" "specs/analysis/appointments/patient-data.md"

# Shifts
move_file "specs/analysis/planning/shift/list.md" "specs/analysis/shifts/list.md"

# Treatments
move_file "specs/analysis/treatment/treatment-core/list.md" "specs/analysis/treatments/list.md"
move_file "specs/analysis/treatment/treatment-core/plan.md" "specs/analysis/treatments/plan.md"

# Council
move_file "specs/analysis/planning/council/list.md" "specs/analysis/council/list.md"

# Consultations
move_file "specs/analysis/treatment/consultation/list.md" "specs/analysis/consultations/list.md"
move_file "specs/analysis/treatment/consultation/details-header.md" "specs/analysis/consultations/details-header.md"
move_file "specs/analysis/treatment/consultation/standard-form.md" "specs/analysis/consultations/standard-form.md"
move_file "specs/analysis/treatment/consultation/onboarding-form.md" "specs/analysis/consultations/onboarding-form.md"
move_file "specs/analysis/treatment/consultation/incarceration-form.md" "specs/analysis/consultations/incarceration-form.md"
move_file "specs/analysis/treatment/consultation/treatment-warning.md" "specs/analysis/consultations/treatment-warning.md"
move_file "specs/analysis/treatment/consultation/view-review.md" "specs/analysis/consultations/view-review.md"
move_file "specs/analysis/treatment/consultation/details-js.md" "specs/analysis/consultations/details-js.md"

# Appointment Admin
move_file "specs/analysis/planning/appointment-admin/appointment-admin.md" "specs/analysis/appointment-admin/admin.md"
move_file "specs/analysis/accounting/config/accounting-config.md" "specs/analysis/appointment-admin/closed-month.md"

# Notifications
move_file "specs/analysis/system/notification/list.md" "specs/analysis/notifications/list.md"

# Customers
move_file "specs/analysis/customer/customer-core/list.md" "specs/analysis/customers/list.md"
move_file "specs/analysis/customer/customer-core/locations-users.md" "specs/analysis/customers/locations-users.md"
move_file "specs/analysis/accounting/invoice/invoices.md" "specs/analysis/customers/invoices.md"
move_file "specs/analysis/accounting/invoice/invoice-details.md" "specs/analysis/customers/invoice-details.md"
move_file "specs/analysis/accounting/invoice-receiver/invoice-receiver.md" "specs/analysis/customers/invoice-receivers.md"
move_file "specs/analysis/customer/room/room.md" "specs/analysis/customers/rooms.md"
move_file "specs/analysis/customer/equipment/equipment.md" "specs/analysis/customers/equipment.md"

# Staff
move_file "specs/analysis/user-management/profile/profile-form.md" "specs/analysis/staff/profile-form.md"
move_file "specs/analysis/user-management/profile/profile-staff.md" "specs/analysis/staff/profile-staff.md"
move_file "specs/analysis/user-management/profile/profile-dialogs.md" "specs/analysis/staff/profile-dialogs.md"
move_file "specs/analysis/user-management/profile/profile-expert-availability.md" "specs/analysis/staff/profile-expert-availability.md"
move_file "specs/analysis/user-management/admin-user/user-management.md" "specs/analysis/staff/user-management.md"
move_file "specs/analysis/user-management/onboarding/onboarding.md" "specs/analysis/staff/onboarding.md"

# Administration
move_file "specs/analysis/accounting/admin-job/jobs.md" "specs/analysis/administration/jobs.md"
move_file "specs/analysis/user-management/admin-skill/skills.md" "specs/analysis/administration/skills.md"
move_file "specs/analysis/treatment/warning/warning-management.md" "specs/analysis/administration/warnings.md"

# System Admin
move_file "specs/analysis/system/admin-system/admin-landing.md" "specs/analysis/system-admin/admin-landing.md"
move_file "specs/analysis/system/admin-cruds/motd.md" "specs/analysis/system-admin/motd.md"
move_file "specs/analysis/accounting/admin-workhour/work-hours.md" "specs/analysis/system-admin/work-hours.md"
move_file "specs/analysis/system/cdr-call/cdr-call.md" "specs/analysis/system-admin/cdr.md"

# Includes
move_file "specs/analysis/system/includes/site-shell.md" "specs/analysis/includes/site-shell.md"
move_file "specs/analysis/system/includes/includes-shared-components.md" "specs/analysis/includes/shared-components.md"
move_file "specs/analysis/system/includes/includes-customization.md" "specs/analysis/includes/customization.md"
move_file "specs/analysis/system/templates-files/templates-files.md" "specs/analysis/includes/templates-files.md"

# Orphan
move_file "specs/analysis/academy/support-video/support-and-video.md" "specs/analysis/orphan/support-and-video.md"
move_file "specs/analysis/academy/video-history/user-video-history.md" "specs/analysis/orphan/user-video-history.md"

echo ""
echo "Migrating Wireframes files (copying)..."
echo "---------------------------------------"

# Dashboard wireframes
for file in specs/wireframes/planning/dashboard/*.pen specs/wireframes/planning/dashboard/*.png; do
  [ -f "$file" ] && cp "$file" specs/wireframes/dashboard/ && echo "  Copied: $file"
done

# Appointment wireframes
for file in specs/wireframes/planning/appointment/*.pen specs/wireframes/planning/appointment/*.png; do
  [ -f "$file" ] && cp "$file" specs/wireframes/appointments/ && echo "  Copied: $file"
done

# Shift wireframes
for file in specs/wireframes/planning/shift/*.pen specs/wireframes/planning/shift/*.png; do
  [ -f "$file" ] && cp "$file" specs/wireframes/shifts/ && echo "  Copied: $file"
done

# Council wireframes
for file in specs/wireframes/planning/council/*.pen specs/wireframes/planning/council/*.png; do
  [ -f "$file" ] && cp "$file" specs/wireframes/council/ && echo "  Copied: $file"
done

# Consultation wireframes
for file in specs/wireframes/treatment/consultation/*.pen specs/wireframes/treatment/consultation/*.png; do
  [ -f "$file" ] && cp "$file" specs/wireframes/consultations/ && echo "  Copied: $file"
done

# Customer wireframes
for file in specs/wireframes/customer/customer-core/*.pen specs/wireframes/customer/customer-core/*.png; do
  [ -f "$file" ] && cp "$file" specs/wireframes/customers/ && echo "  Copied: $file"
done
for file in specs/wireframes/customer/room/*.pen specs/wireframes/customer/room/*.png; do
  [ -f "$file" ] && cp "$file" specs/wireframes/customers/ && echo "  Copied: $file"
done
for file in specs/wireframes/customer/equipment/*.pen specs/wireframes/customer/equipment/*.png; do
  [ -f "$file" ] && cp "$file" specs/wireframes/customers/ && echo "  Copied: $file"
done

# Staff wireframes
for file in specs/wireframes/user-management/profile/*.pen specs/wireframes/user-management/profile/*.png; do
  [ -f "$file" ] && cp "$file" specs/wireframes/staff/ && echo "  Copied: $file"
done

# Administration wireframes
for file in specs/wireframes/accounting/admin-job/*.pen specs/wireframes/accounting/admin-job/*.png; do
  [ -f "$file" ] && cp "$file" specs/wireframes/administration/ && echo "  Copied: $file"
done
for file in specs/wireframes/accounting/config/*.pen specs/wireframes/accounting/config/*.png; do
  [ -f "$file" ] && cp "$file" specs/wireframes/administration/ && echo "  Copied: $file"
done
for file in specs/wireframes/accounting/invoice/*.pen specs/wireframes/accounting/invoice/*.png; do
  [ -f "$file" ] && cp "$file" specs/wireframes/administration/ && echo "  Copied: $file"
done
for file in specs/wireframes/accounting/invoice-receiver/*.pen specs/wireframes/accounting/invoice-receiver/*.png; do
  [ -f "$file" ] && cp "$file" specs/wireframes/administration/ && echo "  Copied: $file"
done
for file in specs/wireframes/accounting/worklog/*.pen specs/wireframes/accounting/worklog/*.png; do
  [ -f "$file" ] && cp "$file" specs/wireframes/administration/ && echo "  Copied: $file"
done

# System Admin wireframes
for file in specs/wireframes/system/dashboard/*.pen specs/wireframes/system/dashboard/*.png; do
  [ -f "$file" ] && cp "$file" specs/wireframes/system-admin/ && echo "  Copied: $file"
done
for file in specs/wireframes/system/cdr-call/*.pen specs/wireframes/system/cdr-call/*.png; do
  [ -f "$file" ] && cp "$file" specs/wireframes/system-admin/ && echo "  Copied: $file"
done

# Includes wireframes
for file in specs/wireframes/system/includes/*.pen specs/wireframes/system/includes/*.png; do
  [ -f "$file" ] && cp "$file" specs/wireframes/includes/ && echo "  Copied: $file"
done

# Orphan wireframes
for file in specs/wireframes/academy/support-video/*.pen specs/wireframes/academy/support-video/*.png; do
  [ -f "$file" ] && cp "$file" specs/wireframes/orphan/ && echo "  Copied: $file"
done

echo ""
echo "✅ Directory migration complete"
echo "=========================================="
