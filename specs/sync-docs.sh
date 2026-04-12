#!/bin/bash

set -e

project_dir=$(realpath $(dirname "$0")/..)
docs_dir="${project_dir}/docs"
content_dir="${docs_dir}/src/content/docs"
astro_config="${docs_dir}/astro.config.mjs"

test -f "${astro_config}"

# Function to fix frontmatter in markdown files
fix_frontmatter() {
  local dir="$1"
  
  if [ ! -d "$dir" ]; then
    return
  fi
  
  find "$dir" -type f \( -name "*.md" -o -name "*.mdx" \) | while read -r file; do
    # Check if file has frontmatter with title (between first two ---)
    local has_title=false
    if head -1 "$file" | grep -q "^---$"; then
      # Extract frontmatter block and check for title
      local frontmatter
      frontmatter=$(sed -n '2,/^---$/p' "$file" | head -n -1)
      if echo "$frontmatter" | grep -q "^title:"; then
        has_title=true
      fi
    fi
    
    if [ "$has_title" = true ]; then
      continue
    fi
    
    # Get directory name for title generation
    local dir_name
    dir_name=$(basename "$(dirname "$file")")
    
    # Get file name for title generation (without extension)
    local file_name
    file_name=$(basename "$file" | sed 's/\.[^.]*$//')
    
    # Convert to human-readable title
    local title
    if [ "$file_name" = "README" ] || [ "$file_name" = "index" ]; then
      title=$(echo "$dir_name" | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2))}1')
    else
      title=$(echo "$file_name" | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2))}1')
    fi
    
    # Check if file starts with frontmatter
    if head -1 "$file" | grep -q "^---$"; then
      # Has frontmatter but missing title - add it after the opening ---
      local temp_file
      temp_file=$(mktemp)
      echo "---" > "$temp_file"
      echo "title: '${title}'" >> "$temp_file"
      tail -n +2 "$file" >> "$temp_file"
      mv "$temp_file" "$file"
    else
      # No frontmatter - add it at the beginning
      local temp_file
      temp_file=$(mktemp)
      echo "---" > "$temp_file"
      echo "title: '${title}'" >> "$temp_file"
      echo "---" >> "$temp_file"
      echo "" >> "$temp_file"
      cat "$file" >> "$temp_file"
      mv "$temp_file" "$file"
    fi
    
    echo "Fixed frontmatter in: $file (title: $title)"
  done
}

# Fix frontmatter in source directories before copying
echo "Fixing frontmatter in source directories..."
fix_frontmatter "${project_dir}/specs/analysis"
fix_frontmatter "${project_dir}/specs/wireframes"
fix_frontmatter "${project_dir}/specs/domains"
fix_frontmatter "${project_dir}/specs/decisions"
fix_frontmatter "${project_dir}/specs/planning"

# Clean existing content directories (with retry for robustness)
clean_dir() {
  local dir="$1"
  if [ -d "$dir" ]; then
    # Remove contents first, then the directory itself
    find "$dir" -mindepth 1 -delete 2>/dev/null || true
    rmdir "$dir" 2>/dev/null || true
    # If still exists, force remove with retry
    if [ -d "$dir" ]; then
      sleep 1
      rm -rf "$dir" 2>/dev/null || true
    fi
  fi
}

clean_dir "${content_dir}/analysis"
clean_dir "${content_dir}/wireframes"
clean_dir "${content_dir}/domains"
clean_dir "${content_dir}/decisions"
clean_dir "${content_dir}/planning"

# Copy spec directories to docs content
cp -rf "${project_dir}/specs/analysis" "${content_dir}/analysis"
cp -rf "${project_dir}/specs/wireframes" "${content_dir}/wireframes"
cp -rf "${project_dir}/specs/domains" "${content_dir}/domains"
cp -rf "${project_dir}/specs/decisions" "${content_dir}/decisions"
cp -rf "${project_dir}/specs/planning" "${content_dir}/planning"

# Mirror PNG/image files from specs/ to docs/public/assets/specs/
# Starlight serves static assets from public/, so images must be there.
# We preserve the directory structure under public/assets/specs/
echo "Mirroring image assets to docs/public/assets/specs/..."
public_assets="${docs_dir}/public/assets/specs"
mkdir -p "$public_assets"
# Sync all image files preserving directory structure
rsync -a --include='*/' --include='*.png' --include='*.jpg' --include='*.jpeg' \
  --include='*.gif' --include='*.svg' --include='*.webp' --exclude='*' \
  "${project_dir}/specs/" "$public_assets/"

# Rewrite image links in copied markdown files to point to /assets/specs/...
# This converts relative image paths like ../../../../wireframes/foo/bar.png
# to absolute Starlight paths like /assets/specs/wireframes/foo/bar.png
_img_rewriter=$(mktemp /tmp/fix-images-XXXXXX.pl)
cat > "$_img_rewriter" << 'IMGPERL_EOF'
use strict;
use warnings;
use File::Basename;
use File::Spec;

# The content_dir and specs_dir are passed as arguments
my $content_dir = shift @ARGV;
my $specs_dir = shift @ARGV;

foreach my $file (@ARGV) {
  open my $fh, '<', $file or next;
  my @lines = <$fh>;
  close $fh;

  # Determine the directory of the current file relative to content_dir
  my $file_dir = dirname($file);

  my $changed = 0;
  my $in_code = 0;
  foreach my $line (@lines) {
    if ($line =~ /^```/) { $in_code = !$in_code; }
    next if $in_code;

    # Match both ![alt](url) and [text](url) where url ends with image extension
    $line =~ s{
      (\!?\[[^\]]*\]\()       # ![alt]( or [text](
      (                        # capture URL
        (?:\.\.?/)+            # one or more ../ or ./
        [^)]+                  # rest of path
        \.(?:png|jpg|jpeg|gif|svg|webp)  # image extension
      )
      (\))                     # closing paren
    }{
      my $pre = $1;
      my $rel_url = $2;
      my $post = $3;

      # Resolve the relative URL to a filesystem path
      my $abs_path = File::Spec->rel2abs($rel_url, $file_dir);

      # Try to find the corresponding path under specs_dir
      # The content_dir mirrors specs_dir structure, so strip content_dir prefix
      # and use the specs-relative path
      my $resolved = File::Spec->abs2rel($abs_path, $content_dir);

      # Build the absolute URL for Starlight
      "${pre}/assets/specs/${resolved}${post}";
    }gex;
  }

  open my $out, '>', $file or next;
  print $out @lines;
  close $out;
}
IMGPERL_EOF

# Collect all markdown files and pass to the image rewriter
echo "Rewriting image links to /assets/specs/ paths..."
find "${content_dir}/analysis" "${content_dir}/wireframes" "${content_dir}/domains" \
     "${content_dir}/decisions" "${content_dir}/planning" \
     -type f \( -name "*.md" -o -name "*.mdx" \) 2>/dev/null | \
  xargs perl "$_img_rewriter" "$content_dir" "${project_dir}/specs"
rm -f "$_img_rewriter"

# Rewrite markdown links for Starlight compatibility
# Starlight serves each .md file as /{slug}/index.html, so relative links
# need adjustment: ./sibling resolves to /{slug}/sibling instead of /../sibling.
# This function:
#   1. Strips .md extensions from link targets (Starlight uses extensionless routes)
#   2. Converts README references to lowercase 'readme'
#   3. Adds one extra ../ level to relative links (adjusts for Starlight dir-per-file)

# Create the perl rewriter script in a temp file (avoids shell quoting issues)
_perl_rewriter=$(mktemp /tmp/fix-links-XXXXXX.pl)
cat > "$_perl_rewriter" << 'PERL_EOF'
use strict;
use warnings;

my $in_code = 0;
while (<>) {
  if (/^```/) { $in_code = !$in_code; }
  if (!$in_code) {
    # Process markdown links: [text](relative-url)
    # Skip: images ![...], absolute URLs, anchor-only, mailto
    s/(?<![!])\[([^\]]*)\]\((?!https?:\/\/)(?!mailto:)(?!#)(?!\/)([^)]+)\)/rewrite_link($1, $2)/ge;
  }
  print;
}

sub rewrite_link {
  my ($text, $url) = @_;

  # Split URL into path and fragment
  my ($path, $fragment) = split(/#/, $url, 2);

  # Determine if the link needs path adjustment for Starlight.
  # Two cases need the extra ../ level:
  #   1. Links with .md extension (filesystem links)
  #   2. Links starting with ./ that don't have a file extension
  #      (these are broken in both filesystem and Starlight without adjustment)
  # Links starting with ../ without .md are assumed to be already
  # Starlight-compatible and left unchanged.
  my $had_md = 0;
  my $needs_adjustment = 0;

  # Strip trailing / after .md (e.g., ./file.md/ -> ./file.md)
  if ($path =~ s/\.md\//.md/g) { $had_md = 1; }

  # Strip .md extension
  if ($path =~ s/\.md$//) { $had_md = 1; }

  # Detect resource links (.sh, .png, .py, etc.) — NOT markdown pages
  my $is_resource = ($path =~ /\.\w+$/ && $path !~ /\.mdx?$/);

  if ($had_md) {
    $needs_adjustment = 1;
  } elsif (!$is_resource && $path =~ /^\.\//) {
    # Links starting with ./ without .md extension also need adjustment
    # (e.g., ./planning#anchor, ./entity-model, ./domains/)
    $needs_adjustment = 1;
  }

  if ($needs_adjustment) {
    # Convert README to lowercase readme
    $path =~ s/README$/readme/;

    # Add one extra ../ level for relative links to markdown pages
    # (adjusts for Starlight serving files as directories)
    if ($path =~ s/^\.\///) {
      $path = "../" . $path;
    } elsif ($path =~ /^\.\.\//) {
      $path = "../" . $path;
    } else {
      # Plain relative path like "sibling" or "sub/file"
      $path = "../" . $path;
    }
  }

  # Reassemble
  my $new_url = $path;
  $new_url .= "#" . $fragment if defined $fragment;

  return "[$text]($new_url)";
}
PERL_EOF

fix_links() {
  local dir="$1"

  if [ ! -d "$dir" ]; then
    return
  fi

  find "$dir" -type f \( -name "*.md" -o -name "*.mdx" \) | while read -r file; do
    local temp_file
    temp_file=$(mktemp)
    perl "$_perl_rewriter" "$file" > "$temp_file"
    mv "$temp_file" "$file"
  done
  
  echo "Fixed links in: $dir"
}

echo "Rewriting links for Starlight compatibility..."
fix_links "${content_dir}/analysis"
fix_links "${content_dir}/wireframes"
fix_links "${content_dir}/domains"
fix_links "${content_dir}/decisions"
fix_links "${content_dir}/planning"

# Clean up temp perl script
rm -f "$_perl_rewriter"

# Generate sidebar JSON dynamically from directory structure
# Only updates the sidebar: [...] array in astro.config.mjs, preserving the rest.
generate_sidebar_items() {
  local dir="$1"
  local indent="$2"
  
  if [ ! -d "${content_dir}/${dir}" ]; then
    return
  fi
  
  for subdir in "${content_dir}/${dir}"/*/; do
    if [ -d "$subdir" ]; then
      local name
      name=$(basename "$subdir")
      if [ "$name" = "$dir" ]; then continue; fi
      local label
      label=$(echo "$name" | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2))}1')
      echo "${indent}{ label: '${label}', autogenerate: { directory: '${dir}/${name}' } },"
    fi
  done
}

generate_flat_sidebar() {
  local dir="$1"
  local label="$2"
  local indent="$3"
  
  if [ ! -d "${content_dir}/${dir}" ]; then
    return
  fi
  
  echo "${indent}{ label: '${label}', autogenerate: { directory: '${dir}' } },"
}

# Build the new sidebar array content based on section 2.4 structure
sidebar_content=$(mktemp)
indent="        "
sub_indent="            "

cat > "$sidebar_content" << 'SIDEBAR_HEADER'
        { label: 'Introduction', slug: '' },
        {
          label: 'Analysis', collapsed: true,
          items: [
            { label: 'Analysis Domain', slug: 'analysis/readme' },
SIDEBAR_HEADER

cat >> "$sidebar_content" << 'DASHBOARD'
            { label: 'Dashboard', collapsed: true,
              items: [
                { label: 'Dashboard', slug: 'analysis/system/dashboard/dashboard-main' },
                { label: 'Calendar View', slug: 'analysis/planning/dashboard/calendar-view' },
                { label: 'Week View', slug: 'analysis/planning/dashboard/week-view' },
                { label: 'Worklog', slug: 'analysis/accounting/worklog/worklog' },
                { label: 'Video Library', slug: 'analysis/orphan/support-and-video' },
              ],
            },
DASHBOARD

cat >> "$sidebar_content" << 'APPOINTMENTS'
            { label: 'Appointments', collapsed: true,
              items: [
                { label: 'Appointment Plan', slug: 'analysis/planning/appointment/appointment-plan' },
                { label: 'Patient Data', slug: 'analysis/treatment/patient-data/patient-data' },
              ],
            },
APPOINTMENTS

cat >> "$sidebar_content" << 'SHIFTS'
            { label: 'Shifts', collapsed: true,
              items: [
                { label: 'Shift Plan', slug: 'analysis/planning/shift/shift-and-plan' },
              ],
            },
SHIFTS

cat >> "$sidebar_content" << 'TREATMENTS'
            { label: 'Treatments', collapsed: true,
              items: [
                { label: 'Treatment Plan', slug: 'analysis/treatment/treatment-core/treatment-plan' },
                { label: 'Treatment Plan History', slug: 'analysis/treatment/treatment-core/treatment-plan' },
              ],
            },
TREATMENTS

cat >> "$sidebar_content" << 'COUNCIL'
            { label: 'Council', collapsed: true,
              items: [
                { label: 'Council Plan', slug: 'analysis/planning/council/council-and-plan' },
              ],
            },
COUNCIL

cat >> "$sidebar_content" << 'CONSULTATIONS'
            { label: 'Consultations', collapsed: true,
              items: [
                { label: 'Consultation List', slug: 'analysis/treatment/consultation/consultation-list' },
                { label: 'Details Header', slug: 'analysis/treatment/consultation/consultation-details-header' },
                { label: 'Standard Form', slug: 'analysis/treatment/consultation/consultation-details-standard' },
                { label: 'Onboarding Form', slug: 'analysis/treatment/consultation/consultation-details-onboarding' },
                { label: 'Incarceration Form', slug: 'analysis/treatment/consultation/consultation-details-incarceration' },
                { label: 'Treatment / Warning', slug: 'analysis/treatment/consultation/consultation-details-treatment-warning' },
                { label: 'View / Review', slug: 'analysis/treatment/consultation/consultation-view-review' },
              ],
            },
CONSULTATIONS

cat >> "$sidebar_content" << 'APPT_ADMIN'
            { label: 'Appointment Admin', collapsed: true,
              items: [
                { label: 'Closed Month', slug: 'analysis/planning/appointment-support/close-month' },
                { label: 'Questionnaire', slug: 'analysis/treatment/questionnaire/questionnaire-list' },
              ],
            },
APPT_ADMIN

cat >> "$sidebar_content" << 'NOTIFICATIONS'
            { label: 'Notifications', collapsed: true,
              items: [
                { label: 'Trash', slug: 'analysis/system/notification/notification' },
              ],
            },
NOTIFICATIONS

cat >> "$sidebar_content" << 'CUSTOMERS'
            { label: 'Customers', collapsed: true,
              items: [
                { label: 'Onboarding Customer', slug: 'analysis/user-management/admin/onboarding-flow' },
                { label: 'Invoices', slug: 'analysis/accounting/invoice/invoice-list' },
                { label: 'Invoice Receivers', slug: 'analysis/accounting/invoice-receiver/invoice-receiver' },
                { label: 'Customer Users', slug: 'analysis/customer/customer-core/location-and-users' },
                { label: 'Locations', slug: 'analysis/customer/customer-core/location-and-users' },
                { label: 'Rooms', slug: 'analysis/customer/room/room' },
                { label: 'Onboarding Location', slug: 'analysis/user-management/admin/onboarding-flow' },
              ],
            },
CUSTOMERS

cat >> "$sidebar_content" << 'STAFF'
            { label: 'Staff', collapsed: true,
              items: [
                { label: 'Onboarding', slug: 'analysis/user-management/admin/onboarding-flow' },
                { label: 'User Management', slug: 'analysis/user-management/admin/user-management' },
                { label: 'Expert Weekly Assignments', slug: 'analysis/accounting/worklog/worklog' },
              ],
            },
STAFF

cat >> "$sidebar_content" << 'ADMIN'
            { label: 'Administration', collapsed: true,
              items: [
                { label: 'Job IDs', slug: 'analysis/accounting/admin-job/job-configuration' },
                { label: 'Async Job Queue', slug: 'analysis/mongodb-mapping/system' },
                { label: 'Job Price List', slug: 'analysis/accounting/config/accounting-config' },
                { label: 'Products', slug: 'analysis/accounting/config/accounting-config' },
                { label: 'Skills', slug: 'analysis/user-management/admin/skill' },
                { label: 'Exclusion Criteria', slug: 'analysis/system/config/system-config' },
                { label: 'Export Templates', slug: 'analysis/system/templates-files/templates-files' },
                { label: 'Warnings', slug: 'analysis/treatment/warning/warning-management' },
                { label: 'Treatment Categories', slug: 'analysis/treatment/treatment-core/treatment-and-category' },
                { label: 'Equipment', slug: 'analysis/customer/equipment/equipment' },
                { label: 'Onboarding Steps', slug: 'analysis/user-management/admin/onboarding-flow' },
              ],
            },
ADMIN

cat >> "$sidebar_content" << 'SYSADMIN'
            { label: 'Systemadmin', collapsed: true,
              items: [
                { label: 'MOTD', slug: 'analysis/system/admin-cruds/motd-template' },
                { label: 'Login Notification', slug: 'analysis/system/config/system-config' },
                { label: 'Notification Templates', slug: 'analysis/system/templates-files/templates-files' },
                { label: 'Location Types', slug: 'analysis/system/config/system-config' },
                { label: 'Storno Groups', slug: 'analysis/accounting/config/accounting-config' },
                { label: 'Work Hours', slug: 'analysis/planning/appointment-support/workhour' },
                { label: 'CDR', slug: 'analysis/planning/appointment-support/cdr-call' },
                { label: 'CDR Assignment', slug: 'analysis/planning/appointment-support/cdr-call' },
                { label: 'Log', slug: 'analysis/mongodb-mapping/system' },
                { label: 'Support Categories', slug: 'analysis/system/config/system-config' },
                { label: 'BasisWeb Appointments', slug: 'analysis/mongodb-mapping/interfaces' },
                { label: 'Change Log', slug: 'analysis/system/admin/admin-landing' },
              ],
            },
SYSADMIN

cat >> "$sidebar_content" << 'MID1'
          ],
        },
        {
          label: 'Wireframes', collapsed: true,
          items: [
MID1

generate_sidebar_items "wireframes" "$sub_indent" >> "$sidebar_content"

cat >> "$sidebar_content" << 'MID2'
          ],
        },
        {
          label: 'Domains', collapsed: true,
          items: [
MID2

generate_sidebar_items "domains" "$sub_indent" >> "$sidebar_content"

cat >> "$sidebar_content" << 'MID3'
          ],
        },
        {
          label: 'Decisions', collapsed: true,
          items: [
MID3

generate_flat_sidebar "decisions" "Architecture Decisions" "$sub_indent" >> "$sidebar_content"

cat >> "$sidebar_content" << 'FOOTER'
          ],
        },
        { label: 'Planning', autogenerate: { directory: 'planning' } },
        { label: 'Billing & Invoicing', autogenerate: { directory: 'billing' } },
        { label: 'Sharing', autogenerate: { directory: 'sharing' } },
        { label: 'KIS Integration', autogenerate: { directory: 'integrations/kis' } },
FOOTER

# Use perl to replace only the sidebar: [...] array in astro.config.mjs
# This preserves all other configuration (imports, plugins, theme, etc.)
_sidebar_updater=$(mktemp /tmp/update-sidebar-XXXXXX.pl)
cat > "$_sidebar_updater" << 'SIDEBARPERL_EOF'
use strict;
use warnings;

my $config_file = shift @ARGV;
my $sidebar_file = shift @ARGV;

# Read the sidebar content
open my $sfh, '<', $sidebar_file or die "Cannot read $sidebar_file: $!";
my $new_sidebar = do { local $/; <$sfh> };
close $sfh;
chomp $new_sidebar;

# Read the config file line by line and find the sidebar: [ ... ] block
# using bracket counting for reliable matching
open my $cfh, '<', $config_file or die "Cannot read $config_file: $!";
my @lines = <$cfh>;
close $cfh;

my $sidebar_start = -1;  # line index of "sidebar: ["
my $sidebar_end = -1;    # line index of matching "],"
my $bracket_depth = 0;

for (my $i = 0; $i < scalar @lines; $i++) {
  if ($sidebar_start < 0) {
    if ($lines[$i] =~ /sidebar:\s*\[/) {
      $sidebar_start = $i;
      # Count brackets on this line
      $bracket_depth += ($lines[$i] =~ tr/[//);
      $bracket_depth -= ($lines[$i] =~ tr/]//);
      if ($bracket_depth == 0) {
        $sidebar_end = $i;
        last;
      }
    }
  } else {
    $bracket_depth += ($lines[$i] =~ tr/[//);
    $bracket_depth -= ($lines[$i] =~ tr/]//);
    if ($bracket_depth == 0) {
      $sidebar_end = $i;
      last;
    }
  }
}

if ($sidebar_start < 0 || $sidebar_end < 0) {
  die "ERROR: Could not find sidebar: [...] block in $config_file\n";
}

# Reconstruct: lines before sidebar, new sidebar block, lines after sidebar
my @before = @lines[0 .. $sidebar_start - 1];
my @after = @lines[$sidebar_end + 1 .. $#lines];

# Determine the indentation from the original sidebar line
my ($indent) = ($lines[$sidebar_start] =~ /^(\s*)/);

open my $out, '>', $config_file or die "Cannot write $config_file: $!";
print $out @before;
print $out "${indent}sidebar: [\n";
print $out $new_sidebar;
print $out "\n${indent}],\n";
print $out @after;
close $out;

print "Updated sidebar in: $config_file\n";
SIDEBARPERL_EOF

echo "Updating sidebar configuration in astro.config.mjs..."
perl "$_sidebar_updater" "$astro_config" "$sidebar_content"
rm -f "$_sidebar_updater" "$sidebar_content"

cd "${docs_dir}" && pnpm run rebuild
