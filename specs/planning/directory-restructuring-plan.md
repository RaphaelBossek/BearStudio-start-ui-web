# Directory Restructuring Plan

**Date**: 2026-04-16
**Based on**: Chapter 2.4 "Detailed Sitemap with Submenu Items" from `specs/analysis/readme.md`
**Status**: FINALIZED - Restructure executed; legacy migration helper retired

---

## Overview

This plan defines the target directory structure for `specs/analysis/` based on the sitemap navigation hierarchy in chapter 2.4. The restructure aligns documentation files with their corresponding menu items in the application navigation.

---

## Finalization Notes

- The restructure has been executed and the documentation now uses the final `_content-extraction/` layout for extracted source docs.
- The temporary `11-administration/*.md` placeholder targets were removed.
- The previous migration helper has been retired and its file removed from the repo.
- README and sibling-document links now point directly at the final target paths.
- The system admin landing page is documented as `12-systemadmin/change-log.md`; the old `admin-landing.md` references were retired during cleanup.

## Rollback Note

If this restructuring ever needs to be reversed, restore from the backup created during the worktree run.
