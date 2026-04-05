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

# Copy spec directories to docs content
cp -rf "${project_dir}/specs/analysis" "${content_dir}/analysis"
cp -rf "${project_dir}/specs/wireframes" "${content_dir}/wireframes"
cp -rf "${project_dir}/specs/domains" "${content_dir}/domains"
cp -rf "${project_dir}/specs/decisions" "${content_dir}/decisions"

# Generate sidebar items dynamically from directory structure
generate_sidebar_items() {
  local dir="$1"
  
  if [ ! -d "${content_dir}/${dir}" ]; then
    return
  fi
  
  for subdir in "${content_dir}/${dir}"/*/; do
    if [ -d "$subdir" ]; then
      local name
      name=$(basename "$subdir")
      # Skip if name matches parent directory (avoid self-reference)
      if [ "$name" = "$dir" ]; then
        continue
      fi
      # Convert directory name to label (capitalize and replace dashes with spaces)
      local label
      label=$(echo "$name" | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2))}1')
      echo "            { label: '${label}', autogenerate: { directory: '${dir}/${name}' } },"
    fi
  done
}

# Generate sidebar for a flat directory (no subdirs, just files)
generate_flat_sidebar() {
  local dir="$1"
  local label="$2"
  
  if [ ! -d "${content_dir}/${dir}" ]; then
    return
  fi
  
  echo "            { label: '${label}', autogenerate: { directory: '${dir}' } },"
}

# Build complete sidebar configuration in a temp file
temp_config=$(mktemp)

cat > "$temp_config" << 'HEADER_EOF'
// @ts-check

import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';
import brokenLinksChecker from 'astro-broken-links-checker';
import mermaid from 'astro-mermaid';

export default defineConfig({
  output: 'static',
  integrations: [
    brokenLinksChecker({ checkExternalLinks: false, throwError: false }),
    mermaid({
      theme: 'neutral', autoTheme: true, enableLog: false,
      mermaidConfig: { flowchart: { curve: 'basis' } },
      iconPacks: [
        { name: 'logos', loader: () => fetch('https://unpkg.com/@iconify-json/logos@1/icons.json').then(r => r.json()) },
        { name: 'iconoir', loader: () => fetch('https://unpkg.com/@iconify-json/iconoir@1/icons.json').then(r => r.json()) },
      ],
    }),
    starlight({
      title: 'VCA',
      customCss: ['./src/styles/global.css'],
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/videoclinic-co' }],
      sidebar: [
        { label: 'Introduction', slug: '' },
        {
          label: 'Analysis', collapsed: true,
          items: [
HEADER_EOF

generate_sidebar_items "analysis" >> "$temp_config"

cat >> "$temp_config" << 'MID1_EOF'
          ],
        },
        {
          label: 'Wireframes', collapsed: true,
          items: [
MID1_EOF

generate_sidebar_items "wireframes" >> "$temp_config"

cat >> "$temp_config" << 'MID2_EOF'
          ],
        },
        {
          label: 'Domains', collapsed: true,
          items: [
MID2_EOF

generate_sidebar_items "domains" >> "$temp_config"

cat >> "$temp_config" << 'MID3_EOF'
          ],
        },
        {
          label: 'Decisions', collapsed: true,
          items: [
MID3_EOF

generate_flat_sidebar "decisions" "Architecture Decisions" >> "$temp_config"

cat >> "$temp_config" << 'FOOTER_EOF'
          ],
        },
        { label: 'Billing & Invoicing', autogenerate: { directory: 'billing' } },
        { label: 'Sharing', autogenerate: { directory: 'sharing' } },
        { label: 'KIS Integration', autogenerate: { directory: 'integrations/kis' } },
      ],
    }),
  ],
});
FOOTER_EOF

# Atomically replace the config file
mv "$temp_config" "${astro_config}"

cd "${docs_dir}" && pnpm run rebuild
