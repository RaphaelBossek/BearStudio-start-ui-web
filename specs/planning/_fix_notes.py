import json
import glob
import subprocess
import os

def fix_file(file_path):
    print(f"\nProcessing {file_path}...")
    
    with open(file_path, 'r') as f:
        data = json.load(f)
        
    notes = [n for n in data.get('children', []) if n.get('type') == 'note']
    frames = [n for n in data.get('children', []) if n.get('type') == 'frame']
    
    if len(notes) <= 1:
        return False
        
    try:
        orig_content = subprocess.check_output(['git', 'show', f'HEAD~3:{file_path}']).decode('utf-8')
        orig_data = json.loads(orig_content)
        
        def find_all_notes(nodes):
            res = []
            for n in nodes:
                if n.get('type') == 'note':
                    res.append(n)
                if 'children' in n:
                    res.extend(find_all_notes(n['children']))
            return res
            
        orig_notes = find_all_notes(orig_data.get('children', []))
        orig_note_map = {n.get('name'): n for n in orig_notes if n.get('name')}
        
        modified = False
        
        max_x = 0
        for f in frames:
            fx = f.get('x', 0)
            fw = f.get('width', 0)
            if fx + fw > max_x:
                max_x = fx + fw
                
        target_x = max_x + 40
        
        for note in notes:
            name = note.get('name')
            if name in orig_note_map:
                orig_n = orig_note_map[name]
                
                def find_abs_y(nodes, target_id, current_y=0):
                    for n in nodes:
                        if n.get('id') == target_id:
                            return current_y + n.get('y', 0)
                        if 'children' in n:
                            res = find_abs_y(n['children'], target_id, current_y + n.get('y', 0))
                            if res is not None:
                                return res
                    return None
                    
                abs_y = find_abs_y(orig_data.get('children', []), orig_n.get('id'))
                
                if abs_y is None:
                    abs_y = orig_n.get('y', 0)
                
                if note.get('y') != abs_y:
                    note['y'] = abs_y
                    modified = True
                    
            if note.get('x') != target_x:
                note['x'] = target_x
                modified = True
                
        notes.sort(key=lambda n: n.get('y', 0))
        for i in range(1, len(notes)):
            prev = notes[i-1]
            curr = notes[i]
            if curr.get('y', 0) < prev.get('y', 0) + 120:
                curr['y'] = prev.get('y', 0) + 120
                modified = True
                
        if modified:
            with open(file_path, 'w') as f:
                json.dump(data, f, separators=(",", ":"))
            print("  Fixed")
            return True
            
    except Exception as e:
        print(f"  Failed: {e}")
        
    return False

if __name__ == '__main__':
    import sys
    if len(sys.argv) > 1:
        fix_file(sys.argv[1])
    else:
        files = glob.glob('specs/wireframes/**/*.pen', recursive=True)
        for file in files:
            fix_file(file)
