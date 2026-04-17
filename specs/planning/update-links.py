#!/usr/bin/env python3
import os
import json
import re
from pathlib import Path

BASE_DIR = Path("specs")
ANALYSIS_DIR = BASE_DIR / "analysis"
WIREFRAMES_DIR = BASE_DIR / "wireframes"

def process_markdown_file(md_path, src_to_dest):
    with open(md_path, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    
    for old_path_relative, new_path_relative in src_to_dest.items():
        # The new path is something like `01-dashboard/calendar-view-calendar.pen`
        # Because we merged the file directly into `specs/analysis/01-dashboard/`,
        # and the markdown file we are currently changing is `specs/analysis/01-dashboard/calendar-view.md`.
        # The correct relative markdown link inside that file should just be `./calendar-view-calendar.pen` (or just `calendar-view-calendar.pen`).
        
        # Determine the name of the new file
        new_file_name = Path(new_path_relative).name
        
        # Identify if replacing in specs/analysis
        # the traditional wireframe links were like: `../wireframes/planning/dashboard/calendar.pen`
        # old_path_relative is `planning/dashboard/calendar.pen`
        
        # We need to replace anything referencing `old_path_relative` with the new structure.
        # But wait – what if an analysis file in `02-appointments` refers to a wireframe in `01-dashboard`?
        # A universal approach:
        # 1. Figure out absolute path of the new wireframe from the repo root.
        # 2. Compute relative path from the current markdown file's directory to the new wireframe's directory.
        
        # Example: 
        # Markdown file: specs/analysis/02-appointments/appointment-list.md
        # Target wireframe: specs/analysis/01-dashboard/worklog.pen
        # Output relative link: ../01-dashboard/worklog.pen

        # Target wireframe: specs/analysis/02-appointments/appointment-list.pen
        # Output relative link: ./appointment-list.pen
        
        if old_path_relative in content:
            # We found a reference to the old wireframe path.
            # E.g. `../wireframes/planning/appointment/appointment-list.pen`
            
            # Compute new valid relative linkage
            if new_path_relative.startswith('_admin') or new_path_relative.startswith('_unmapped') or new_path_relative.startswith('../planning'):
                # Admin files or unmapped. Ignore or point to specs/planning.
                # Let's just point to its absolute representation /specs/planning/...
                new_rel = "/specs/planning/" + Path(new_path_relative).name
            else:
                # new_path_relative = `02-appointments/appointment-list.pen`
                target_full = ANALYSIS_DIR / new_path_relative
                md_dir = md_path.parent
                
                # Use os.path.relpath to find path from md_dir to target
                new_rel = os.path.relpath(target_full, md_dir)
            
            # Now replace the entire old reference block matching the old path.
            # The old reference in the markdown looks like `../wireframes/planning/appointment/appointment-list.pen`
            # We can use regex to replace `[any_prefix]planning/appointment/appointment-list.pen`
            # with `new_rel`.
            
            # The regex pattern matches optional preceding `.` and `/` or `wireframes/` 
            # and ends with `old_path_relative`.
            # A simple regex: Replace `[^\s"'\)]*old_path_relative` with `new_rel`
            escaped_old = re.escape(old_path_relative)
            # Find the whole href string inside () or "" that ends exactly with old_path_relative
            # We match backwards until a space, quote, or paren.
            pattern = r'([("])([^("]*?)' + escaped_old + r'([)"])'
            
            # Replace exactly the middle part
            content = re.sub(pattern, r"\\1" + new_rel.replace('\\', '/') + r"\\3", content)
            
    if content != original_content:
        with open(md_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    map_file = BASE_DIR / "planning" / "src_to_dest.json"
    if not map_file.exists():
        print("Mapping file missing: specs/planning/src_to_dest.json")
        return
        
    with open(map_file, 'r') as f:
        src_to_dest = json.load(f)
    
    print(f"Updating link references in {ANALYSIS_DIR} to point directly into the merged directories...")
    updated_files = 0
    
    # Update analysis markdowns
    for md_file in ANALYSIS_DIR.rglob("*.md"):
        if process_markdown_file(md_file, src_to_dest):
            updated_files += 1
            print(f"Updated links in: {md_file.relative_to(BASE_DIR)}")

    print(f"Update complete. Modified {updated_files} markdown files.")

if __name__ == "__main__":
    main()
