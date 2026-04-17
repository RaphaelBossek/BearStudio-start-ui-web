#!/usr/bin/env python3
import os
import shutil
import json
from pathlib import Path

BASE_DIR = Path("specs")
WIRE_DIR = BASE_DIR / "wireframes"
MAP_FILE = BASE_DIR / "planning" / "src_to_dest.json"
ANALYSIS_DIR = BASE_DIR / "analysis"
PLANNING_DIR = BASE_DIR / "planning"

def main():
    print(f"Starting direct merge of {WIRE_DIR} into {ANALYSIS_DIR} based on plan...")
    
    if not MAP_FILE.exists():
        print(f"Plan file {MAP_FILE} not found.")
        return
        
    with open(MAP_FILE, 'r') as f:
        src_to_dest = json.load(f)
        
    if not WIRE_DIR.exists():
        print(f"Directory {WIRE_DIR} does not exist.")
        return
        
    moves = []
    
    for src, rel_dest in src_to_dest.items():
        src_path = WIRE_DIR / src
        if not src_path.exists():
            continue
            
        # Check special destinations
        if rel_dest.startswith('../planning/'):
            # e.g. ../planning/_fix_notes.py -> specs/planning/_fix_notes.py
            target_name = rel_dest.replace('../planning/', '')
            target_path = PLANNING_DIR / target_name
        elif rel_dest.startswith('_admin/') or rel_dest.startswith('_unmapped/'):
            # e.g. _admin/pens.txt -> we can put it in specs/planning/migration_archive or just keep it in specs/planning
            archive_dir = PLANNING_DIR / "migration_archive"
            target_path = archive_dir / rel_dest.split('/')[-1]
        elif rel_dest == "readme.md":
            # The root readme for wireframes. Move to archive.
            archive_dir = PLANNING_DIR / "migration_archive"
            target_path = archive_dir / "wireframes-readme.md"
        else:
            # Standard mapped wireframes go directly into analysis
            target_path = ANALYSIS_DIR / rel_dest
            
        if target_path != src_path:
            moves.append((src_path, target_path))

    if not moves:
        print("No files found to move.")
        return
        
    print(f"Preparing to move {len(moves)} files...")
    
    for i, (src, dest) in enumerate(moves):
        dest.parent.mkdir(parents=True, exist_ok=True)
        print(f"Moving: {src.relative_to(BASE_DIR)} -> {dest.relative_to(BASE_DIR)}")
        shutil.move(src, dest)
        
    print("Cleaning up totally vacant directories in specs/wireframes...")
    for root, dirs, files in os.walk(WIRE_DIR, topdown=False):
        for name in dirs:
            dir_path = Path(root) / name
            try:
                if not any(dir_path.iterdir()):
                    dir_path.rmdir()
            except OSError:
                pass # Not empty

    # Can we remove specs/wireframes entirely?
    try:
        if not any(WIRE_DIR.iterdir()):
            WIRE_DIR.rmdir()
            print("Successfully deleted empty specs/wireframes folder!")
        else:
            print("specs/wireframes is not completely empty, remaining files:")
            for remaining in WIRE_DIR.rglob("*"):
                print(f"  - {remaining.relative_to(WIRE_DIR)}")
    except OSError:
        pass

    print("Refactoring complete.")

if __name__ == "__main__":
    main()
