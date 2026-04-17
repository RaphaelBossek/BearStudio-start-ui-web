#!/usr/bin/env node
/**
 * Fix Cross-References After Directory Restructuring
 *
 * This script rewrites relative markdown links after files have been moved
 * according to a path mapping table.
 *
 * Usage: node fix-cross-references.mjs [--dry-run]
 */

import { readdirSync, readFileSync, statSync, writeFileSync } from 'fs';
import { dirname, join, relative } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ANALYSIS_DIR = join(__dirname, '..', 'analysis');

// ============================================================================
// PATH MAPPING TABLE: OLD → NEW
// Each entry defines how to rewrite links to a file
// ============================================================================
const PATH_MAPPING = {
  // 01-dashboard/
  'planning/dashboard/calendar-view.md': '01-dashboard/calendar-view.md',
  'planning/dashboard/week-view.md': '01-dashboard/week-view.md',
  'planning/dashboard/month-view.md': '01-dashboard/month-view.md',
  'planning/dashboard/dialogs-planning.md': '01-dashboard/dialogs-planning.md',
  'planning/dashboard/shift-dialog.md': '01-dashboard/shift-dialog.md',
  'accounting/worklog/worklog.md': '01-dashboard/worklog.md',
  'orphan/support-and-video.md': '01-dashboard/video-library.md',
  'system/dashboard/dashboard-main.md': '01-dashboard/dashboard-main.md',
  'system/dashboard/dashboard-selfservice.md': '01-dashboard/dashboard-selfservice.md',
  'treatment/dashboard/consultation-template.md': '01-dashboard/consultation-template.md',
  'treatment/dashboard/consultation-wizard.md': '01-dashboard/consultation-wizard.md',

  // 02-appointments/
  'planning/appointment/appointment-list.md': '02-appointments/appointment-list.md',
  'planning/appointment/appointment-plan.md': '02-appointments/appointment-plan.md',
  'treatment/patient-data/patient-data.md': '02-appointments/patient-data.md',

  // 03-shifts/
  'planning/shift/shift-and-plan.md': '03-shifts/shift-and-plan.md',

  // 04-treatments/
  'treatment/treatment-core/treatment-plan.md': '04-treatments/treatment-plan.md',
  'treatment/treatment-core/treatment-and-category.md': '04-treatments/treatment-and-category.md',

  // 05-council/
  'planning/council/council-and-plan.md': '05-council/council-and-plan.md',

  // 06-consultations/
  'treatment/consultation/consultation-list.md': '06-consultations/consultation-list.md',
  'treatment/consultation/consultation-details-header.md':
    '06-consultations/consultation-details-header.md',
  'treatment/consultation/consultation-details-standard.md':
    '06-consultations/consultation-details-standard.md',
  'treatment/consultation/consultation-details-onboarding.md':
    '06-consultations/consultation-details-onboarding.md',
  'treatment/consultation/consultation-details-incarceration.md':
    '06-consultations/consultation-details-incarceration.md',
  'treatment/consultation/consultation-details-treatment-warning.md':
    '06-consultations/consultation-details-treatment-warning.md',
  'treatment/consultation/consultation-view-review.md':
    '06-consultations/consultation-view-review.md',

  // 07-appointment-admin/
  'planning/appointment-admin/appointment-admin.md': '07-appointment-admin/appointment-admin.md',
  'planning/appointment-support/close-month.md': '07-appointment-admin/closed-month.md',
  'treatment/questionnaire/questionnaire-list.md': '07-appointment-admin/questionnaire-list.md',
  'treatment/questionnaire/questionnaire-detail.md': '07-appointment-admin/questionnaire-detail.md',

  // 08-notifications/
  'system/notification/notification.md': '08-notifications/notification.md',

  // 09-customers/
  'customer/customer-core/customer-list-detail.md': '09-customers/customer-list-detail.md',
  'user-management/admin/onboarding-flow.md': '09-customers/onboarding-customer.md',
  'accounting/invoice/invoice-list.md': '09-customers/invoice-list.md',
  'accounting/invoice/invoice-details.md': '09-customers/invoice-details.md',
  'accounting/invoice-receiver/invoice-receiver.md': '09-customers/invoice-receiver.md',
  'customer/customer-core/location-and-users.md': '09-customers/locations.md',
  'customer/room/room.md': '09-customers/rooms.md',

  // 10-staff/
  'user-management/admin/user-management.md': '10-staff/user-management.md',

  // 11-administration/
  'accounting/admin-job/job-configuration.md': '11-administration/job-ids.md',
  'user-management/admin/skill.md': '11-administration/skills.md',
  'treatment/warning/warning-management.md': '11-administration/warnings.md',
  'customer/equipment/equipment.md': '11-administration/equipment.md',

  // 12-systemadmin/
  'system/admin-cruds/motd-template.md': '12-systemadmin/motd.md',
  'system/admin/dashboard-admin.md': '12-systemadmin/dashboard-admin.md',
  'planning/appointment-support/workhour.md': '12-systemadmin/work-hours.md',
  'planning/appointment-support/cdr-call.md': '12-systemadmin/cdr.md',
  'system/admin/admin-landing.md': '12-systemadmin/change-log.md',

  // Content Extraction Source Files (NOT MOVED - links rewritten to primary target)
  // These files have content extracted to multiple targets but remain in place.
  // Links to these files are rewritten to point to the PRIMARY target.
  'accounting/config/accounting-config.md': '11-administration/job-price-list.md', // Primary
  'system/config/system-config.md': '11-administration/exclusion-criteria.md', // Primary
  'system/templates-files/templates-files.md': '11-administration/export-templates.md', // Primary

  // _shared-components/
  'planning/appointment/appointment-assign-user.md':
    '_shared-components/appointment-assign-user.md',
  'planning/appointment/appointment-details-scheduling.md':
    '_shared-components/appointment-details-scheduling.md',
  'treatment/appointment-patient/appointment-details-patient.md':
    '_shared-components/appointment-details-patient.md',
  'treatment/consultation/consultation-details-js.md':
    '_shared-components/consultation-details-js.md',
  'treatment/dashboard/dialogs-treatment.md': '_shared-components/dialogs-treatment.md',
  'system/dashboard/dialogs-system.md': '_shared-components/dialogs-system.md',
  'user-management/dashboard/dialogs-user-management.md':
    '_shared-components/dialogs-user-management.md',
  'treatment/medication/medication.md': '_shared-components/medication.md',
  'customer/contact/contact.md': '_shared-components/contact.md',
  'user-management/profile/profile-expert-availability.md':
    '_shared-components/profile-expert-availability.md',
  'user-management/profile/profile-staff.md': '_shared-components/profile-staff.md',
  'user-management/profile/profile-form.md': '_shared-components/profile-form.md',
  'user-management/profile/profile-dialogs.md': '_shared-components/profile-dialogs.md',
  'user-management/admin/totp-onboarding.md': '_shared-components/totp-onboarding.md',
  'user-management/admin/group-management.md': '_shared-components/group-management.md',
  'system/admin/sysconfig-import.md': '_shared-components/sysconfig-import.md',
  'system/includes/includes-customization.md': '_shared-components/includes-customization.md',
  'system/includes/includes-shared-components.md':
    '_shared-components/includes-shared-components.md',
  'orphan/user-video-history.md': '_shared-components/user-video-history.md',
  'system/dashboard/readme.md': '_shared-components/readme.md',

  // _interfaces/
  'interfaces/dashboard/basisweb-wizard.md': '_interfaces/basisweb-wizard.md',

  // _data-dictionaries/
  'academy/data-dictionary-academy.md': '_data-dictionaries/data-dictionary-academy.md',
  'accounting/data-dictionary-accounting.md': '_data-dictionaries/data-dictionary-accounting.md',
  'customer/data-dictionary-customer.md': '_data-dictionaries/data-dictionary-customer.md',
  'interfaces/data-dictionary-interfaces.md': '_data-dictionaries/data-dictionary-interfaces.md',
  'planning/data-dictionary-planning.md': '_data-dictionaries/data-dictionary-planning.md',
  'system/data-dictionary-system.md': '_data-dictionaries/data-dictionary-system.md',
  'treatment/data-dictionary-treatment.md': '_data-dictionaries/data-dictionary-treatment.md',
  'user-management/data-dictionary-user-management.md':
    '_data-dictionaries/data-dictionary-user-management.md',

  // _mongodb-mapping/ (entire directory moved)
  'mongodb-mapping/academy.md': '_mongodb-mapping/academy.md',
  'mongodb-mapping/accounting.md': '_mongodb-mapping/accounting.md',
  'mongodb-mapping/analysis-consultation-vs-consultationData.md':
    '_mongodb-mapping/analysis-consultation-vs-consultationData.md',
  'mongodb-mapping/capabilities.md': '_mongodb-mapping/capabilities.md',
  'mongodb-mapping/customer.md': '_mongodb-mapping/customer.md',
  'mongodb-mapping/deprecated.md': '_mongodb-mapping/deprecated.md',
  'mongodb-mapping/external-data.md': '_mongodb-mapping/external-data.md',
  'mongodb-mapping/interfaces.md': '_mongodb-mapping/interfaces.md',
  'mongodb-mapping/news.md': '_mongodb-mapping/news.md',
  'mongodb-mapping/planning.md': '_mongodb-mapping/planning.md',
  'mongodb-mapping/readme.md': '_mongodb-mapping/readme.md',
  'mongodb-mapping/system.md': '_mongodb-mapping/system.md',
  'mongodb-mapping/treatment.md': '_mongodb-mapping/treatment.md',
  'mongodb-mapping/user-management.md': '_mongodb-mapping/user-management.md',

  // _i18n/ (entire directory moved)
  'i18n/domains/academy.md': '_i18n/domains/academy.md',
  'i18n/domains/accounting.md': '_i18n/domains/accounting.md',
  'i18n/domains/customer.md': '_i18n/domains/customer.md',
  'i18n/domains/interfaces.md': '_i18n/domains/interfaces.md',
  'i18n/domains/planning.md': '_i18n/domains/planning.md',
  'i18n/domains/readme.md': '_i18n/domains/readme.md',
  'i18n/domains/system.md': '_i18n/domains/system.md',
  'i18n/domains/treatment.md': '_i18n/domains/treatment.md',
  'i18n/domains/user-management.md': '_i18n/domains/user-management.md',
  'i18n/hardcoded-strings.md': '_i18n/hardcoded-strings.md',
  'i18n/missing-keys.md': '_i18n/missing-keys.md',
  'i18n/readme.md': '_i18n/readme.md',
  'i18n/translation-guide.md': '_i18n/translation-guide.md',
  'i18n/translation-inventory.md': '_i18n/translation-inventory.md',
};

// ============================================================================
// MAIN FUNCTIONS
// ============================================================================

/**
 * Calculate the relative path from one file to another after restructuring
 */
function calculateNewRelativePath(fromFile, toFile) {
  // Extract just the path within analysis/
  const fromPath = fromFile.replace(/^analysis\//, '');
  const toPath = toFile.replace(/^analysis\//, '');

  // Get directory of source file
  const fromDir = dirname(fromPath);
  const toDir = dirname(toPath);

  // Calculate relative path
  let relPath = relative(fromDir, toDir);

  // Normalize path separators
  relPath = relPath.replace(/\\/g, '/');

  // If going up, ensure we have proper ../ sequences
  if (!relPath.startsWith('.')) {
    relPath = `./${relPath}`;
  }

  // Get the target basename (preserving .md extension for markdown links)
  const targetBasename = basename(toPath);
  const targetDir = dirname(toPath);
  const finalRelPath = relative(fromDir, targetDir);

  return (finalRelPath === '' ? './' : `${finalRelPath.replace(/\\/g, '/')}/`) + targetBasename;
}

function basename(path) {
  return path.split('/').pop();
}

/**
 * Find all markdown files in a directory recursively
 */
function findMarkdownFiles(dir, files = []) {
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      findMarkdownFiles(fullPath, files);
    } else if (entry.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  return files;
}

/**
 * Rewrite cross-references in a single file
 */
function rewriteFileCrossReferences(filePath, dryRun = false) {
  let content;
  try {
    content = readFileSync(filePath, 'utf-8');
  } catch (err) {
    console.error(`Error reading ${filePath}: ${err.message}`);
    return { changed: false, replacements: 0 };
  }

  const originalContent = content;
  const replacements = [];

  // Get the directory of the current file for relative path calculation
  const fileDir = dirname(filePath).replace(/^.*analysis/, 'analysis');
  const fileRelDir = fileDir.replace(/^analysis\//, '');

  // Build regex pattern for all old paths
  // Match markdown links: [text](path/to/file.md) or [text](path/to/file.md#anchor)
  const linkPattern = /\[([^\]]+)\]\(([^)]+\.md)(#[^)]*)?\)/g;

  content = content.replace(linkPattern, (match, linkText, linkPath, anchor) => {
    // Normalize the link path - strip ALL leading ../ and ./
    let normalizedLinkPath = linkPath;
    while (normalizedLinkPath.startsWith('../') || normalizedLinkPath.startsWith('./')) {
      if (normalizedLinkPath.startsWith('./')) {
        normalizedLinkPath = normalizedLinkPath.slice(2);
      } else if (normalizedLinkPath.startsWith('../')) {
        normalizedLinkPath = normalizedLinkPath.slice(3);
      }
    }
    // Also strip leading "analysis/" if present (from links like ../analysis/...)
    if (normalizedLinkPath.startsWith('analysis/')) {
      normalizedLinkPath = normalizedLinkPath.slice('analysis/'.length);
    }

    // Check if this link points to a remapped file
    if (PATH_MAPPING[normalizedLinkPath]) {
      const newPath = PATH_MAPPING[normalizedLinkPath];

      // Calculate new relative path from current file to new location
      const newRelPath = calculateNewRelativePath(fileRelDir, newPath);

      replacements.push({
        from: normalizedLinkPath,
        to: newPath,
        newRelPath,
        anchor: anchor || '',
      });

      return `[${linkText}](${newRelPath}${anchor || ''})`;
    }

    return match; // No change
  });

  if (content !== originalContent) {
    if (!dryRun) {
      writeFileSync(filePath, content, 'utf-8');
    }
  }

  return {
    changed: content !== originalContent,
    replacements,
    file: filePath,
  };
}

/**
 * Main function
 */
function main() {
  const dryRun = process.argv.includes('--dry-run');

  console.log('='.repeat(70));
  console.log('CROSS-REFERENCE FIX SCRIPT');
  console.log('='.repeat(70));
  console.log(`Mode: ${dryRun ? 'DRY RUN (no changes written)' : 'LIVE (changes written)'}`);
  console.log();

  // Find all markdown files
  console.log('Finding markdown files...');
  const files = findMarkdownFiles(ANALYSIS_DIR);
  console.log(`Found ${files.length} markdown files\n`);

  // Process each file
  let totalChanges = 0;
  let totalReplacements = 0;
  const summary = [];

  for (const file of files) {
    const result = rewriteFileCrossReferences(file, dryRun);
    if (result.changed) {
      totalChanges++;
      totalReplacements += result.replacements.length;
      summary.push({
        file: file.replace(/^.*analysis/, 'analysis'),
        count: result.replacements.length,
        details: result.replacements.slice(0, 3), // First 3 replacements
      });
    }
  }

  // Print summary
  console.log('-'.repeat(70));
  console.log('SUMMARY');
  console.log('-'.repeat(70));
  console.log(`Files changed: ${totalChanges}`);
  console.log(`Total replacements: ${totalReplacements}`);
  console.log();

  if (summary.length > 0) {
    console.log('Files with changes:');
    for (const s of summary) {
      console.log(`  ${s.file} (${s.count} replacements)`);
    }
    console.log();
  }

  // Print detailed changes if dry run
  if (dryRun && totalChanges > 0) {
    console.log('-'.repeat(70));
    console.log('DETAILED CHANGES (dry run - no files written)');
    console.log('-'.repeat(70));

    for (const file of files) {
      const result = rewriteFileCrossReferences(file, true);
      if (result.changed) {
        console.log(`\n${file.replace(/^.*analysis/, 'analysis')}:`);
        for (const r of result.replacements) {
          console.log(`  [text](${r.from}${r.anchor}) -> [text](${r.newRelPath}${r.anchor || ''})`);
        }
      }
    }
    console.log();
  }

  console.log('='.repeat(70));
  console.log(
    dryRun
      ? 'DRY RUN COMPLETE - No files were modified'
      : 'FIX COMPLETE - All cross-references rewritten'
  );
  console.log('='.repeat(70));

  return { totalChanges, totalReplacements };
}

// Run
main();
