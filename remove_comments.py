#!/usr/bin/env python3
import os
import re
from pathlib import Path

def remove_comments_from_tsx(content):
    """Remove comments from TSX/TS files while preserving code structure"""
    
    lines = content.split('\n')
    result = []
    i = 0
    in_multiline_comment = False
    
    while i < len(lines):
        line = lines[i]
        
        # Handle multiline comments start/end
        if '/*' in line and '*/' in line:
            # Single line multiline comment
            before = line[:line.find('/*')]
            after = line[line.find('*/') + 2:]
            line = before + after
            line = line.rstrip()
            if line:  # Only add non-empty lines
                result.append(line)
            i += 1
            continue
        elif '/*' in line:
            in_multiline_comment = True
            before = line[:line.find('/*')]
            line = before.rstrip()
            if line:
                result.append(line)
            i += 1
            continue
        elif '*/' in line and in_multiline_comment:
            in_multiline_comment = False
            after = line[line.find('*/') + 2:].lstrip()
            if after:
                result.append(after)
            i += 1
            continue
        elif in_multiline_comment:
            i += 1
            continue
        
        # Handle single line comments
        if '//' in line:
            # Check if it's inside a string
            in_string = False
            string_char = None
            comment_pos = -1
            
            for j, char in enumerate(line):
                if char in ['"', "'", '`'] and (j == 0 or line[j-1] != '\\'):
                    if not in_string:
                        in_string = True
                        string_char = char
                    elif char == string_char:
                        in_string = False
                elif not in_string and j < len(line) - 1 and line[j:j+2] == '//':
                    comment_pos = j
                    break
            
            if comment_pos != -1:
                line = line[:comment_pos].rstrip()
        
        # Only add non-empty lines or preserve empty lines if needed for structure
        line_stripped = line.rstrip()
        if line_stripped or (result and result[-1] == ''):  # Keep one empty line max
            result.append(line_stripped)
        
        i += 1
    
    # Remove trailing empty lines
    while result and result[-1] == '':
        result.pop()
    
    return '\n'.join(result) + '\n'

def process_file(filepath):
    """Process a single file to remove comments"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = remove_comments_from_tsx(content)
        
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"✓ {filepath}")
            return True
        else:
            return False
    except Exception as e:
        print(f"✗ {filepath}: {e}")
        return False

def main():
    """Process all TSX/TS files in the frontend src directory"""
    frontend_dir = Path("c:\\Users\\joanet\\Documents\\Projecte final\\frontend\\src")
    
    if not frontend_dir.exists():
        print(f"Frontend directory not found: {frontend_dir}")
        return
    
    tsx_files = list(frontend_dir.rglob("*.tsx")) + list(frontend_dir.rglob("*.ts"))
    
    print(f"Found {len(tsx_files)} TSX/TS files")
    print("Removing comments...")
    
    count = 0
    for filepath in tsx_files:
        if process_file(filepath):
            count += 1
    
    print(f"\nProcessed {count} files with comments removed")

if __name__ == "__main__":
    main()
