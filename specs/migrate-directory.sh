#!/bin/bash
#
# Specs Directory Migration Script
# 
# Reorganizes specs/analysis and specs/wireframes to domain-based structure
# 
# Usage: ./migrate-directory.sh [--dry-run] [--rollback]
#
# Options:
#   --dry-run   Show what would be done without making changes
#   --rollback  Restore from backup created by this script
#

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKUP_DIR="${SCRIPT_DIR}/backup-$(date +%Y%m%d-%H%M%S)"
DRY_RUN=false
ROLLBACK=false

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --dry-run)
      DRY_RUN=true
      echo -e "${YELLOW}🔍 DRY RUN MODE - No changes will be made${NC}"
      shift
      ;;
    --rollback)
      ROLLBACK=true
      shift
      ;;
    *)
      echo "Unknown option: $1"
      echo "Usage: $0 [--dry-run] [--rollback]"
      exit 1
      ;;
  esac
done

# Function to log messages
log() {
  echo -e "${BLUE}[$(date '+%H:%M:%S')]${NC} $1"
}

log_success() {
  echo -e "${GREEN}[$(date '+%H:%M:%S')] ✓${NC} $1"
}

log_warning() {
  echo -e "${YELLOW}[$(date '+%H:%M:%S')] ⚠${NC} $1"
}

log_error() {
  echo -e "${RED}[$(date '+%H:%M:%S')] ✗${NC} $1"
}

# Function to execute or simulate command
exec_cmd() {
  if [ "$DRY_RUN" = true ]; then
    echo "  [DRY-RUN] $*"
  else
    eval "$@"
  fi
}

# Rollback function
do_rollback() {
  log "Starting rollback..."
  
  # Find most recent backup
  LATEST_BACKUP=$(ls -td ${SCRIPT_DIR}/backup-* 2>/dev/null | head -1)
  
  if [ -z "$LATEST_BACKUP" ]; then
    log_error "No backup found!"
    exit 1
  fi
  
  log "Rolling back from: $LATEST_BACKUP"
  
  # Restore analysis directory
  if [ -d "$LATEST_BACKUP/analysis" ]; then
    log "Restoring analysis/..."
    exec_cmd "rm -rf ${SCRIPT_DIR}/analysis"
    exec_cmd "mv $LATEST_BACKUP/analysis ${SCRIPT_DIR}/analysis"
  fi
  
  # Restore wireframes directory
  if [ -d "$LATEST_BACKUP/wireframes" ]; then
    log "Restoring wireframes/..."
    exec_cmd "rm -rf ${SCRIPT_DIR}/wireframes"
    exec_cmd "mv $LATEST_BACKUP/wireframes ${SCRIPT_DIR}/wireframes"
  fi
  
  log_success "Rollback complete!"
  exit 0
}

# Execute rollback if requested
if [ "$ROLLBACK" = true ]; then
  do_rollback
fi

log "Starting directory migration..."
log "Backup directory: $BACKUP_DIR"

# Create backup
if [ "$DRY_RUN" = false ]; then
  log "Creating backup..."
  mkdir -p "$BACKUP_DIR"
  cp -r "${SCRIPT_DIR}/analysis" "$BACKUP_DIR/" 2>/dev/null || log_warning "No analysis/ to backup"
  cp -r "${SCRIPT_DIR}/wireframes" "$BACKUP_DIR/" 2>/dev/null || log_warning "No wireframes/ to backup"
  log_success "Backup created"
fi

# ============================================================================
# PHASE 1: Create new directory structure
# ============================================================================
log "Phase 1: Creating new directory structure..."

# Analysis domains
DOMAINS=(
  "dashboard"
  "appointments"
  "shifts"
  "treatments"
  "council"
  "consultations"
  "appointment-admin"
  "notifications"
  "customers"
  "staff"
  "administration"
  "system-admin"
  "includes"
)

for domain in "${DOMAINS[@]}"; do
  exec_cmd "mkdir -p ${SCRIPT_DIR}/analysis/${domain}"
done

# Wireframes domains
for domain in "${DOMAINS[@]}"; do
  exec_cmd "mkdir -p ${SCRIPT_DIR}/wireframes/${domain}"
done

log_success "Directory structure created"

# ============================================================================
# PHASE 2: Move analysis files
# ============================================================================
log "Phase 2: Moving analysis files..."

# Dashboard
log "  Moving dashboard files..."
exec_cmd "cp ${SCRIPT_DIR}/analysis/system/dashboard/01-dashboard-main.md ${SCRIPT_DIR}/analysis/dashboard/standard.md 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/analysis/system/dashboard/03-dashboard-admin.md ${SCRIPT_DIR}/analysis/dashboard/admin.md 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/analysis/planning/dashboard/02-dashboard-selfservice.md ${SCRIPT_DIR}/analysis/dashboard/self-service.md 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/analysis/planning/dashboard/04-dialogs-planning.md ${SCRIPT_DIR}/analysis/dashboard/dialogs.md 2>/dev/null" || true

# Appointments
log "  Moving appointments files..."
exec_cmd "cp ${SCRIPT_DIR}/analysis/planning/appointment/01-appointment-list.md ${SCRIPT_DIR}/analysis/appointments/list.md 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/analysis/planning/appointment/02-appointment-details-scheduling.md ${SCRIPT_DIR}/analysis/appointments/details.md 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/analysis/planning/appointment/03-appointment-assign-user.md ${SCRIPT_DIR}/analysis/appointments/assign-user.md 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/analysis/planning/appointment-support/01-appointment-plan.md ${SCRIPT_DIR}/analysis/appointments/plan.md 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/analysis/treatment/patient-data/01-patient-data.md ${SCRIPT_DIR}/analysis/appointments/patient-data.md 2>/dev/null" || true

# Consultations
log "  Moving consultations files..."
exec_cmd "cp ${SCRIPT_DIR}/analysis/treatment/consultation/01-consultation-list.md ${SCRIPT_DIR}/analysis/consultations/list.md 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/analysis/treatment/consultation/02-consultation-details-header.md ${SCRIPT_DIR}/analysis/consultations/details-header.md 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/analysis/treatment/consultation/03-consultation-details-standard.md ${SCRIPT_DIR}/analysis/consultations/standard-form.md 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/analysis/treatment/consultation/04-consultation-details-onboarding.md ${SCRIPT_DIR}/analysis/consultations/onboarding-form.md 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/analysis/treatment/consultation/05-consultation-details-incarceration.md ${SCRIPT_DIR}/analysis/consultations/incarceration-form.md 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/analysis/treatment/consultation/06-consultation-details-treatment-warning.md ${SCRIPT_DIR}/analysis/consultations/treatment-warning.md 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/analysis/treatment/consultation/07-consultation-view-review.md ${SCRIPT_DIR}/analysis/consultations/view-review.md 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/analysis/treatment/consultation/08-consultation-details-js.md ${SCRIPT_DIR}/analysis/consultations/details-js.md 2>/dev/null" || true

# Staff
log "  Moving staff files..."
# Merge profile files
exec_cmd "cat ${SCRIPT_DIR}/analysis/user-management/profile/01-profile-form.md \\
              ${SCRIPT_DIR}/analysis/user-management/profile/02-profile-staff.md \\
              ${SCRIPT_DIR}/analysis/user-management/profile/03-profile-dialogs.md \\
              ${SCRIPT_DIR}/analysis/user-management/profile/04-profile-expert-availability.md \\
              > ${SCRIPT_DIR}/analysis/staff/profile.md 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/analysis/user-management/admin-user/02-user-management.md ${SCRIPT_DIR}/analysis/staff/user-management.md 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/analysis/user-management/onboarding/01-onboarding-flow.md ${SCRIPT_DIR}/analysis/staff/onboarding.md 2>/dev/null" || true

# Customers
log "  Moving customers files..."
exec_cmd "cp ${SCRIPT_DIR}/analysis/customer/customer-core/01-customer-list-detail.md ${SCRIPT_DIR}/analysis/customers/list.md 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/analysis/customer/customer-core/02-location-and-users.md ${SCRIPT_DIR}/analysis/customers/locations-users.md 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/analysis/accounting/invoice/01-invoice-list.md ${SCRIPT_DIR}/analysis/customers/invoices.md 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/analysis/accounting/invoice/02-invoice-details.md ${SCRIPT_DIR}/analysis/customers/invoice-details.md 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/analysis/accounting/invoice-receiver/01-invoice-receiver.md ${SCRIPT_DIR}/analysis/customers/invoice-receivers.md 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/analysis/customer/room/01-room.md ${SCRIPT_DIR}/analysis/customers/rooms.md 2>/dev/null" || true

# Administration
log "  Moving administration files..."
exec_cmd "cp ${SCRIPT_DIR}/analysis/accounting/admin-job/03-job-configuration.md ${SCRIPT_DIR}/analysis/administration/jobs.md 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/analysis/user-management/admin-skill/04-skill.md ${SCRIPT_DIR}/analysis/administration/skills.md 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/analysis/treatment/warning/01-warning-management.md ${SCRIPT_DIR}/analysis/administration/warnings.md 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/analysis/customer/equipment/01-equipment.md ${SCRIPT_DIR}/analysis/administration/equipment.md 2>/dev/null" || true

# System Admin
log "  Moving system-admin files..."
exec_cmd "cp ${SCRIPT_DIR}/analysis/system/admin-system/01-admin-landing.md ${SCRIPT_DIR}/analysis/system-admin/admin-landing.md 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/analysis/system/admin-cruds/04-motd-template.md ${SCRIPT_DIR}/analysis/system-admin/motd.md 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/analysis/accounting/admin-workhour/04-workhour.md ${SCRIPT_DIR}/analysis/system-admin/work-hours.md 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/analysis/system/cdr-call/01-cdr-call.md ${SCRIPT_DIR}/analysis/system-admin/cdr.md 2>/dev/null" || true

# Notifications
log "  Moving notifications files..."
exec_cmd "cp ${SCRIPT_DIR}/analysis/system/notification/01-notification.md ${SCRIPT_DIR}/analysis/notifications/list.md 2>/dev/null" || true

# Shifts
log "  Moving shifts files..."
exec_cmd "cp ${SCRIPT_DIR}/analysis/planning/shift/01-shift-and-plan.md ${SCRIPT_DIR}/analysis/shifts/list.md 2>/dev/null" || true

# Council
log "  Moving council files..."
exec_cmd "cp ${SCRIPT_DIR}/analysis/planning/council/01-council-and-plan.md ${SCRIPT_DIR}/analysis/council/list.md 2>/dev/null" || true

# Appointment Admin
log "  Moving appointment-admin files..."
exec_cmd "cp ${SCRIPT_DIR}/analysis/planning/appointment-admin/01-appointment-admin.md ${SCRIPT_DIR}/analysis/appointment-admin/admin.md 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/analysis/accounting/config/01-accounting-config.md ${SCRIPT_DIR}/analysis/appointment-admin/closed-month.md 2>/dev/null" || true

# Includes
log "  Moving includes files..."
exec_cmd "cp ${SCRIPT_DIR}/analysis/system/includes/01-includes-shared-components.md ${SCRIPT_DIR}/analysis/includes/shared-components.md 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/analysis/system/includes/02-includes-customization.md ${SCRIPT_DIR}/analysis/includes/customization.md 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/analysis/system/includes/03-site-shell.md ${SCRIPT_DIR}/analysis/includes/site-shell.md 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/analysis/system/templates-files/01-templates-files.md ${SCRIPT_DIR}/analysis/includes/templates-files.md 2>/dev/null" || true

log_success "Analysis files moved"

# ============================================================================
# PHASE 3: Move wireframe files
# ============================================================================
log "Phase 3: Moving wireframe files..."

# Dashboard - merge 3 sources
log "  Moving dashboard wireframes..."
exec_cmd "cp ${SCRIPT_DIR}/wireframes/planning/dashboard/*.pen ${SCRIPT_DIR}/wireframes/dashboard/ 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/wireframes/planning/dashboard/*.png ${SCRIPT_DIR}/wireframes/dashboard/ 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/wireframes/system/dashboard/*.pen ${SCRIPT_DIR}/wireframes/dashboard/ 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/wireframes/system/dashboard/*.png ${SCRIPT_DIR}/wireframes/dashboard/ 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/wireframes/interfaces/dashboard/*.pen ${SCRIPT_DIR}/wireframes/dashboard/ 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/wireframes/interfaces/dashboard/*.png ${SCRIPT_DIR}/wireframes/dashboard/ 2>/dev/null" || true

# Appointments
log "  Moving appointments wireframes..."
exec_cmd "cp ${SCRIPT_DIR}/wireframes/planning/appointment/*.pen ${SCRIPT_DIR}/wireframes/appointments/ 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/wireframes/planning/appointment/*.png ${SCRIPT_DIR}/wireframes/appointments/ 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/wireframes/planning/appointment-support/*.pen ${SCRIPT_DIR}/wireframes/appointments/ 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/wireframes/planning/appointment-support/*.png ${SCRIPT_DIR}/wireframes/appointments/ 2>/dev/null" || true

# Consultations
log "  Moving consultations wireframes..."
exec_cmd "cp ${SCRIPT_DIR}/wireframes/treatment/consultation/*.pen ${SCRIPT_DIR}/wireframes/consultations/ 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/wireframes/treatment/consultation/*.png ${SCRIPT_DIR}/wireframes/consultations/ 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/wireframes/treatment/dashboard/*.pen ${SCRIPT_DIR}/wireframes/consultations/ 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/wireframes/treatment/dashboard/*.png ${SCRIPT_DIR}/wireframes/consultations/ 2>/dev/null" || true

# Staff
log "  Moving staff wireframes..."
exec_cmd "cp ${SCRIPT_DIR}/wireframes/user-management/profile/*.pen ${SCRIPT_DIR}/wireframes/staff/ 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/wireframes/user-management/profile/*.png ${SCRIPT_DIR}/wireframes/staff/ 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/wireframes/user-management/dashboard/*.pen ${SCRIPT_DIR}/wireframes/staff/ 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/wireframes/user-management/dashboard/*.png ${SCRIPT_DIR}/wireframes/staff/ 2>/dev/null" || true

# Customers
log "  Moving customers wireframes..."
exec_cmd "cp ${SCRIPT_DIR}/wireframes/customer/customer-core/*.pen ${SCRIPT_DIR}/wireframes/customers/ 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/wireframes/customer/customer-core/*.png ${SCRIPT_DIR}/wireframes/customers/ 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/wireframes/customer/room/*.pen ${SCRIPT_DIR}/wireframes/customers/ 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/wireframes/customer/room/*.png ${SCRIPT_DIR}/wireframes/customers/ 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/wireframes/customer/equipment/*.pen ${SCRIPT_DIR}/wireframes/customers/ 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/wireframes/customer/equipment/*.png ${SCRIPT_DIR}/wireframes/customers/ 2>/dev/null" || true

# Administration
log "  Moving administration wireframes..."
exec_cmd "cp ${SCRIPT_DIR}/wireframes/accounting/admin-job/*.pen ${SCRIPT_DIR}/wireframes/administration/ 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/wireframes/accounting/admin-job/*.png ${SCRIPT_DIR}/wireframes/administration/ 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/wireframes/accounting/config/*.pen ${SCRIPT_DIR}/wireframes/administration/ 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/wireframes/accounting/config/*.png ${SCRIPT_DIR}/wireframes/administration/ 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/wireframes/accounting/invoice/*.pen ${SCRIPT_DIR}/wireframes/administration/ 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/wireframes/accounting/invoice/*.png ${SCRIPT_DIR}/wireframes/administration/ 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/wireframes/accounting/invoice-receiver/*.pen ${SCRIPT_DIR}/wireframes/administration/ 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/wireframes/accounting/invoice-receiver/*.png ${SCRIPT_DIR}/wireframes/administration/ 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/wireframes/accounting/worklog/*.pen ${SCRIPT_DIR}/wireframes/administration/ 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/wireframes/accounting/worklog/*.png ${SCRIPT_DIR}/wireframes/administration/ 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/wireframes/treatment/questionnaire/*.pen ${SCRIPT_DIR}/wireframes/administration/ 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/wireframes/treatment/questionnaire/*.png ${SCRIPT_DIR}/wireframes/administration/ 2>/dev/null" || true

# System Admin
log "  Moving system-admin wireframes..."
exec_cmd "cp ${SCRIPT_DIR}/wireframes/system/admin-system/*.pen ${SCRIPT_DIR}/wireframes/system-admin/ 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/wireframes/system/admin-system/*.png ${SCRIPT_DIR}/wireframes/system-admin/ 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/wireframes/system/cdr-call/*.pen ${SCRIPT_DIR}/wireframes/system-admin/ 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/wireframes/system/cdr-call/*.png ${SCRIPT_DIR}/wireframes/system-admin/ 2>/dev/null" || true

# Notifications
log "  Moving notifications wireframes..."
exec_cmd "cp ${SCRIPT_DIR}/wireframes/system/notification/*.pen ${SCRIPT_DIR}/wireframes/notifications/ 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/wireframes/system/notification/*.png ${SCRIPT_DIR}/wireframes/notifications/ 2>/dev/null" || true

# Shifts
log "  Moving shifts wireframes..."
exec_cmd "cp ${SCRIPT_DIR}/wireframes/planning/shift/*.pen ${SCRIPT_DIR}/wireframes/shifts/ 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/wireframes/planning/shift/*.png ${SCRIPT_DIR}/wireframes/shifts/ 2>/dev/null" || true

# Council
log "  Moving council wireframes..."
exec_cmd "cp ${SCRIPT_DIR}/wireframes/planning/council/*.pen ${SCRIPT_DIR}/wireframes/council/ 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/wireframes/planning/council/*.png ${SCRIPT_DIR}/wireframes/council/ 2>/dev/null" || true

# Appointment Admin
log "  Moving appointment-admin wireframes..."
exec_cmd "cp ${SCRIPT_DIR}/wireframes/planning/appointment-admin/*.pen ${SCRIPT_DIR}/wireframes/appointment-admin/ 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/wireframes/planning/appointment-admin/*.png ${SCRIPT_DIR}/wireframes/appointment-admin/ 2>/dev/null" || true

# Includes
log "  Moving includes wireframes..."
exec_cmd "cp ${SCRIPT_DIR}/wireframes/system/includes/*.pen ${SCRIPT_DIR}/wireframes/includes/ 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/wireframes/system/includes/*.png ${SCRIPT_DIR}/wireframes/includes/ 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/wireframes/system/shell/*.pen ${SCRIPT_DIR}/wireframes/includes/ 2>/dev/null" || true
exec_cmd "cp ${SCRIPT_DIR}/wireframes/system/shell/*.png ${SCRIPT_DIR}/wireframes/includes/ 2>/dev/null" || true

log_success "Wireframe files moved"

# ============================================================================
# PHASE 4: Delete orphaned files
# ============================================================================
log "Phase 4: Deleting orphaned files..."

ORPHANS=(
  "${SCRIPT_DIR}/wireframes/planning/appointment/F5baI.png"
  "${SCRIPT_DIR}/wireframes/planning/appointment/up8ie.png"
  "${SCRIPT_DIR}/wireframes/system/includes/login.png"
)

for orphan in "${ORPHANS[@]}"; do
  if [ -f "$orphan" ]; then
    log "  Deleting: $orphan"
    exec_cmd "rm $orphan"
  fi
done

log_success "Orphaned files deleted"

# ============================================================================
# PHASE 5: Validation
# ============================================================================
log "Phase 5: Validating migration..."

# Check that new directories exist
ERRORS=0
for domain in "${DOMAINS[@]}"; do
  if [ ! -d "${SCRIPT_DIR}/analysis/${domain}" ]; then
    log_error "Missing: analysis/${domain}/"
    ERRORS=$((ERRORS + 1))
  fi
  if [ ! -d "${SCRIPT_DIR}/wireframes/${domain}" ]; then
    log_error "Missing: wireframes/${domain}/"
    ERRORS=$((ERRORS + 1))
  fi
done

if [ $ERRORS -eq 0 ]; then
  log_success "Validation passed! All domains created."
else
  log_error "Validation failed! $ERRORS errors found."
  exit 1
fi

# Count files moved
ANALYSIS_COUNT=$(find "${SCRIPT_DIR}/analysis" -name "*.md" -type f 2>/dev/null | wc -l)
WIREFRAMES_COUNT=$(find "${SCRIPT_DIR}/wireframes" -name "*.pen" -o -name "*.png" 2>/dev/null | wc -l)

log "Analysis documents: $ANALYSIS_COUNT"
log "Wireframe files: $WIREFRAMES_COUNT"

log_success "Migration complete!"

if [ "$DRY_RUN" = false ]; then
  echo ""
  log_success "Backup saved to: $BACKUP_DIR"
  echo ""
  echo "To rollback if needed:"
  echo "  $0 --rollback"
  echo ""
  echo "Next steps:"
  echo "  1. Review moved files"
  echo "  2. Run content update script: ./update-references.sh"
  echo "  3. Validate all links work"
  echo "  4. Delete backup when satisfied: rm -rf $BACKUP_DIR"
fi

exit 0

# ============================================================================
# PHASE 6: Rename wireframes to match analysis naming (Unified Naming)
# ============================================================================
log "Phase 6: Applying unified naming convention..."

# Appointments - match analysis/appointments/ files
log "  Renaming appointments wireframes..."
exec_cmd "mv ${SCRIPT_DIR}/wireframes/appointments/appointment-list.png ${SCRIPT_DIR}/wireframes/appointments/list.png 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/appointments/appointment-list.pen ${SCRIPT_DIR}/wireframes/appointments/list.pen 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/appointments/appointment-details.png ${SCRIPT_DIR}/wireframes/appointments/details.png 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/appointments/appointment-details.pen ${SCRIPT_DIR}/wireframes/appointments/details.pen 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/appointments/appointment-details-referenced.png ${SCRIPT_DIR}/wireframes/appointments/details-referenced.png 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/appointments/appointment-details-referenced.pen ${SCRIPT_DIR}/wireframes/appointments/details-referenced.pen 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/appointments/appointment-details-patients.png ${SCRIPT_DIR}/wireframes/appointments/details-patients.png 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/appointments/appointment-details-patients.pen ${SCRIPT_DIR}/wireframes/appointments/details-patients.pen 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/appointments/appointment-details-assigned.png ${SCRIPT_DIR}/wireframes/appointments/details-assigned.png 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/appointments/appointment-details-assigned.pen ${SCRIPT_DIR}/wireframes/appointments/details-assigned.pen 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/appointments/appointment-details-suggestions.png ${SCRIPT_DIR}/wireframes/appointments/details-suggestions.png 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/appointments/appointment-details-suggestions.pen ${SCRIPT_DIR}/wireframes/appointments/details-suggestions.pen 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/appointments/appointment-assign-user.png ${SCRIPT_DIR}/wireframes/appointments/assign-user.png 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/appointments/appointment-assign-user.pen ${SCRIPT_DIR}/wireframes/appointments/assign-user.pen 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/appointments/appointment-state-legend.png ${SCRIPT_DIR}/wireframes/appointments/state-legend.png 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/appointments/appointment-state-legend.pen ${SCRIPT_DIR}/wireframes/appointments/state-legend.pen 2>/dev/null" || true

# Consultations - match analysis/consultations/ files
log "  Renaming consultations wireframes..."
exec_cmd "mv ${SCRIPT_DIR}/wireframes/consultations/consultation-list.png ${SCRIPT_DIR}/wireframes/consultations/list.png 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/consultations/consultation-list.pen ${SCRIPT_DIR}/wireframes/consultations/list.pen 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/consultations/consultation-details-header.png ${SCRIPT_DIR}/wireframes/consultations/details-header.png 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/consultations/consultation-details-header.pen ${SCRIPT_DIR}/wireframes/consultations/details-header.pen 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/consultations/consultation-details-standard.png ${SCRIPT_DIR}/wireframes/consultations/standard-form.png 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/consultations/consultation-details-standard.pen ${SCRIPT_DIR}/wireframes/consultations/standard-form.pen 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/consultations/consultation-details-onboarding.png ${SCRIPT_DIR}/wireframes/consultations/onboarding-form.png 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/consultations/consultation-details-onboarding.pen ${SCRIPT_DIR}/wireframes/consultations/onboarding-form.pen 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/consultations/consultation-details-incarceration.png ${SCRIPT_DIR}/wireframes/consultations/incarceration-form.png 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/consultations/consultation-details-incarceration.pen ${SCRIPT_DIR}/wireframes/consultations/incarceration-form.pen 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/consultations/consultation-details-treatment-warning.png ${SCRIPT_DIR}/wireframes/consultations/treatment-warning.png 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/consultations/consultation-details-treatment-warning.pen ${SCRIPT_DIR}/wireframes/consultations/treatment-warning.pen 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/consultations/consultation-view.png ${SCRIPT_DIR}/wireframes/consultations/view.png 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/consultations/consultation-view.pen ${SCRIPT_DIR}/wireframes/consultations/view.pen 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/consultations/consultation-review.png ${SCRIPT_DIR}/wireframes/consultations/review.png 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/consultations/consultation-review.pen ${SCRIPT_DIR}/wireframes/consultations/review.pen 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/consultations/consultation-icd10-search.png ${SCRIPT_DIR}/wireframes/consultations/icd10-search.png 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/consultations/consultation-icd10-search.pen ${SCRIPT_DIR}/wireframes/consultations/icd10-search.pen 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/consultations/consultation-export-template.png ${SCRIPT_DIR}/wireframes/consultations/export-template.png 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/consultations/consultation-export-template.pen ${SCRIPT_DIR}/wireframes/consultations/export-template.pen 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/consultations/consultation-wizard.png ${SCRIPT_DIR}/wireframes/consultations/wizard.png 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/consultations/consultation-wizard.pen ${SCRIPT_DIR}/wireframes/consultations/wizard.pen 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/consultations/consultation-location-wizard.png ${SCRIPT_DIR}/wireframes/consultations/location-wizard.png 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/consultations/consultation-location-wizard.pen ${SCRIPT_DIR}/wireframes/consultations/location-wizard.pen 2>/dev/null" || true

# Dashboard - match analysis/dashboard/ files
log "  Renaming dashboard wireframes..."
exec_cmd "mv ${SCRIPT_DIR}/wireframes/dashboard/calendar.png ${SCRIPT_DIR}/wireframes/dashboard/standard.png 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/dashboard/calendar.pen ${SCRIPT_DIR}/wireframes/dashboard/standard.pen 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/dashboard/expert-availability-week.png ${SCRIPT_DIR}/wireframes/dashboard/availability-week.png 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/dashboard/expert-availability-week.pen ${SCRIPT_DIR}/wireframes/dashboard/availability-week.pen 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/dashboard/expert-availability-month.png ${SCRIPT_DIR}/wireframes/dashboard/availability-month.png 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/dashboard/expert-availability-month.pen ${SCRIPT_DIR}/wireframes/dashboard/availability-month.pen 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/dashboard/shift-dialog-detail.png ${SCRIPT_DIR}/wireframes/dashboard/shift-dialog.png 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/dashboard/shift-dialog-detail.pen ${SCRIPT_DIR}/wireframes/dashboard/shift-dialog.pen 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/dashboard/shift-dialog-request.png ${SCRIPT_DIR}/wireframes/dashboard/shift-request.png 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/dashboard/shift-dialog-request.pen ${SCRIPT_DIR}/wireframes/dashboard/shift-request.pen 2>/dev/null" || true

log_success "Unified naming applied"

# ============================================================================
# PHASE 6: Rename wireframes to match analysis naming (Unified Naming)
# ============================================================================
log "Phase 6: Applying unified naming convention..."

# Appointments - match analysis/appointments/ files
log "  Renaming appointments wireframes..."
exec_cmd "mv ${SCRIPT_DIR}/wireframes/appointments/appointment-list.png ${SCRIPT_DIR}/wireframes/appointments/list.png 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/appointments/appointment-list.pen ${SCRIPT_DIR}/wireframes/appointments/list.pen 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/appointments/appointment-details.png ${SCRIPT_DIR}/wireframes/appointments/details.png 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/appointments/appointment-details.pen ${SCRIPT_DIR}/wireframes/appointments/details.pen 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/appointments/appointment-details-referenced.png ${SCRIPT_DIR}/wireframes/appointments/details-referenced.png 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/appointments/appointment-details-referenced.pen ${SCRIPT_DIR}/wireframes/appointments/details-referenced.pen 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/appointments/appointment-details-patients.png ${SCRIPT_DIR}/wireframes/appointments/details-patients.png 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/appointments/appointment-details-patients.pen ${SCRIPT_DIR}/wireframes/appointments/details-patients.pen 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/appointments/appointment-details-assigned.png ${SCRIPT_DIR}/wireframes/appointments/details-assigned.png 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/appointments/appointment-details-assigned.pen ${SCRIPT_DIR}/wireframes/appointments/details-assigned.pen 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/appointments/appointment-details-suggestions.png ${SCRIPT_DIR}/wireframes/appointments/details-suggestions.png 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/appointments/appointment-details-suggestions.pen ${SCRIPT_DIR}/wireframes/appointments/details-suggestions.pen 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/appointments/appointment-assign-user.png ${SCRIPT_DIR}/wireframes/appointments/assign-user.png 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/appointments/appointment-assign-user.pen ${SCRIPT_DIR}/wireframes/appointments/assign-user.pen 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/appointments/appointment-state-legend.png ${SCRIPT_DIR}/wireframes/appointments/state-legend.png 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/appointments/appointment-state-legend.pen ${SCRIPT_DIR}/wireframes/appointments/state-legend.pen 2>/dev/null" || true

# Consultations - match analysis/consultations/ files
log "  Renaming consultations wireframes..."
exec_cmd "mv ${SCRIPT_DIR}/wireframes/consultations/consultation-list.png ${SCRIPT_DIR}/wireframes/consultations/list.png 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/consultations/consultation-list.pen ${SCRIPT_DIR}/wireframes/consultations/list.pen 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/consultations/consultation-details-header.png ${SCRIPT_DIR}/wireframes/consultations/details-header.png 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/consultations/consultation-details-header.pen ${SCRIPT_DIR}/wireframes/consultations/details-header.pen 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/consultations/consultation-details-standard.png ${SCRIPT_DIR}/wireframes/consultations/standard-form.png 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/consultations/consultation-details-standard.pen ${SCRIPT_DIR}/wireframes/consultations/standard-form.pen 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/consultations/consultation-details-onboarding.png ${SCRIPT_DIR}/wireframes/consultations/onboarding-form.png 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/consultations/consultation-details-onboarding.pen ${SCRIPT_DIR}/wireframes/consultations/onboarding-form.pen 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/consultations/consultation-details-incarceration.png ${SCRIPT_DIR}/wireframes/consultations/incarceration-form.png 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/consultations/consultation-details-incarceration.pen ${SCRIPT_DIR}/wireframes/consultations/incarceration-form.pen 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/consultations/consultation-details-treatment-warning.png ${SCRIPT_DIR}/wireframes/consultations/treatment-warning.png 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/consultations/consultation-details-treatment-warning.pen ${SCRIPT_DIR}/wireframes/consultations/treatment-warning.pen 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/consultations/consultation-view.png ${SCRIPT_DIR}/wireframes/consultations/view.png 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/consultations/consultation-view.pen ${SCRIPT_DIR}/wireframes/consultations/view.pen 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/consultations/consultation-review.png ${SCRIPT_DIR}/wireframes/consultations/review.png 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/consultations/consultation-review.pen ${SCRIPT_DIR}/wireframes/consultations/review.pen 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/consultations/consultation-icd10-search.png ${SCRIPT_DIR}/wireframes/consultations/icd10-search.png 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/consultations/consultation-icd10-search.pen ${SCRIPT_DIR}/wireframes/consultations/icd10-search.pen 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/consultations/consultation-export-template.png ${SCRIPT_DIR}/wireframes/consultations/export-template.png 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/consultations/consultation-export-template.pen ${SCRIPT_DIR}/wireframes/consultations/export-template.pen 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/consultations/consultation-wizard.png ${SCRIPT_DIR}/wireframes/consultations/wizard.png 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/consultations/consultation-wizard.pen ${SCRIPT_DIR}/wireframes/consultations/wizard.pen 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/consultations/consultation-location-wizard.png ${SCRIPT_DIR}/wireframes/consultations/location-wizard.png 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/consultations/consultation-location-wizard.pen ${SCRIPT_DIR}/wireframes/consultations/location-wizard.pen 2>/dev/null" || true

# Dashboard - match analysis/dashboard/ files
log "  Renaming dashboard wireframes..."
exec_cmd "mv ${SCRIPT_DIR}/wireframes/dashboard/calendar.png ${SCRIPT_DIR}/wireframes/dashboard/standard.png 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/dashboard/calendar.pen ${SCRIPT_DIR}/wireframes/dashboard/standard.pen 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/dashboard/expert-availability-week.png ${SCRIPT_DIR}/wireframes/dashboard/availability-week.png 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/dashboard/expert-availability-week.pen ${SCRIPT_DIR}/wireframes/dashboard/availability-week.pen 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/dashboard/expert-availability-month.png ${SCRIPT_DIR}/wireframes/dashboard/availability-month.png 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/dashboard/expert-availability-month.pen ${SCRIPT_DIR}/wireframes/dashboard/availability-month.pen 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/dashboard/shift-dialog-detail.png ${SCRIPT_DIR}/wireframes/dashboard/shift-dialog.png 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/dashboard/shift-dialog-detail.pen ${SCRIPT_DIR}/wireframes/dashboard/shift-dialog.pen 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/dashboard/shift-dialog-request.png ${SCRIPT_DIR}/wireframes/dashboard/shift-request.png 2>/dev/null" || true
exec_cmd "mv ${SCRIPT_DIR}/wireframes/dashboard/shift-dialog-request.pen ${SCRIPT_DIR}/wireframes/dashboard/shift-request.pen 2>/dev/null" || true

log_success "Unified naming applied"
