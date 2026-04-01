#!/bin/bash
set -e

# Script 02: Rename files by removing numeric prefixes
# Must run AFTER 01_migrate-directories.sh
# Examples:
#   01-dashboard-main.md → dashboard-main.md
#   03-dashboard-admin.md → dashboard-admin.md
#   01-appointment-list.md → appointment-list.md

echo "=========================================="
echo "Script 02: File Renaming Process"
echo "=========================================="
echo ""

cd "$(dirname "$0")/../../.." || exit 1

if [ ! -d "specs" ]; then
  echo "❌ Error: Failed to change to specs directory"
  echo "Analysis: specs directory may not exist from current location"
  echo "Direction: Run 'pwd' to verify current directory, then 'ls -la' to check specs exists"
  exit 1
fi

# Generic numeric prefix removal for all .md files
echo "Processing numeric prefix removal..."
while IFS= read -r file; do
  if [ -n "$file" ]; then
    dir=$(dirname "$file")
    base=$(basename "$file")
    
    # Check if filename starts with NN- pattern
    if [[ "$base" =~ ^[0-9]{2}-(.+\.md)$ ]]; then
      new_base="${BASH_REMATCH[1]}"
      new_path="$dir/$new_base"
      
      if [ "$file" != "$new_path" ]; then
        # Check if destination file already exists
        if [ -f "$new_path" ]; then
          # Extract name and extension
          name_without_ext="${new_base%.md}"
          counter=1
          
          # Find next available filename
          while [ -f "$dir/${name_without_ext}-${counter}.md" ]; do
            ((counter++))
          done
          
          new_path="$dir/${name_without_ext}-${counter}.md"
          echo "Conflict detected, using: $new_path"
        fi
        
        if mv "$file" "$new_path" 2>/dev/null; then
          echo "Renamed: $file → $new_path"
        fi
      fi
    fi
  fi
done < <(find specs -name "[0-9][0-9]-*.md" -type f 2>/dev/null)

echo ""
echo "✅ File renaming complete"
echo "=========================================="
