#!/usr/bin/env python3
"""
Save a .pen file from Pencil's in-memory state to disk via mcp2cli.

Usage:
    python3 _save_pen.py <linux_path>

Example:
    python3 specs/wireframes/_save_pen.py specs/wireframes/customer/customer-core/location-management.pen

This script:
1. Converts the Linux path to a Windows UNC path for Pencil MCP
2. Extracts the full node tree via batch-get (readDepth:10)
3. Extracts variables via get-variables
4. Constructs a valid .pen JSON document
5. Writes it to the Linux filesystem
6. Verifies the round-trip by re-opening in Pencil
"""
import subprocess, sys, json, time, os

PCMD = "/mnt/c/Users/RaphaelBossek/AppData/Local/Programs/Pencil/resources/app.asar.unpacked/out/mcp-server-windows-x64.exe --app desktop"
WSL_PREFIX = "/home/raphael/src/vc/BearStudio-start-ui-web/"
UNC_PREFIX = "\\\\wsl.localhost\\Ubuntu\\home\\raphael\\src\\vc\\BearStudio-start-ui-web\\"


def linux_to_unc(linux_path):
    """Convert a Linux path to Windows UNC path for Pencil."""
    # Handle both absolute and relative paths
    if linux_path.startswith(WSL_PREFIX):
        rel = linux_path[len(WSL_PREFIX):]
    elif linux_path.startswith("/"):
        # Generic absolute path
        return "\\\\wsl.localhost\\Ubuntu" + linux_path.replace("/", "\\")
    else:
        rel = linux_path
    return UNC_PREFIX + rel.replace("/", "\\")


def pcli(tool, args_dict=None, flags=None):
    """Call mcp2cli. Returns (stdout, error_or_None)."""
    cmd = ["mcp2cli", "--mcp-stdio", PCMD, tool]
    if flags:
        cmd.extend(flags)
    kw = dict(capture_output=True, text=True, timeout=120)
    if args_dict is not None:
        cmd.append("--stdin")
        kw["input"] = json.dumps(args_dict)
    r = subprocess.run(cmd, **kw)
    if r.returncode != 0:
        return None, r.stderr[-500:]
    return r.stdout.strip(), None


def save_pen(linux_path):
    """Extract Pencil in-memory state and save as .pen file."""
    unc = linux_to_unc(linux_path)
    abs_path = os.path.join(WSL_PREFIX, linux_path) if not linux_path.startswith("/") else linux_path
    
    print(f"Saving: {linux_path}")
    print(f"UNC:    {unc}")
    
    # 1. Ensure the file is open in Pencil
    print("[1/4] Opening in Pencil...")
    out, err = pcli("open-document", flags=["--file-path-or-template", unc])
    if err:
        print(f"  FAIL: {err}"); return False
    time.sleep(0.3)
    
    # 2. Extract children
    print("[2/4] Extracting nodes (readDepth:10)...")
    t0 = time.time()
    children_raw, err = pcli("batch-get", {"filePath": unc, "readDepth": 10})
    if err:
        print(f"  FAIL: {err}"); return False
    t1 = time.time()
    print(f"  Got {len(children_raw):,} bytes in {t1-t0:.1f}s")
    
    # 3. Extract variables
    print("[3/4] Extracting variables...")
    vars_raw, err = pcli("get-variables", {"filePath": unc})
    if err:
        print(f"  FAIL: {err}"); return False
    t2 = time.time()
    print(f"  Got {len(vars_raw):,} bytes in {t2-t1:.1f}s")
    
    # 4. Construct and write
    print("[4/4] Writing .pen file...")
    children = json.loads(children_raw)
    vars_parsed = json.loads(vars_raw)
    # get-variables returns {"variables": {"--bg": ...}} — unwrap the outer key
    variables = vars_parsed.get("variables", vars_parsed)
    pen = json.dumps({"version": "2.9", "variables": variables, "children": children}, separators=(',', ':'))
    
    os.makedirs(os.path.dirname(abs_path), exist_ok=True)
    with open(abs_path, 'w') as f:
        f.write(pen)
    
    sz = os.path.getsize(abs_path)
    print(f"  Written: {sz:,} bytes ({sz/1024:.1f} KB)")
    
    # Verify
    print("Verifying round-trip...")
    pcli("open-document", flags=["--file-path-or-template", unc])
    time.sleep(0.3)
    vraw, err = pcli("batch-get", {"filePath": unc, "readDepth": 1})
    if not err:
        vn = json.loads(vraw)
        match = len(vn) == len(children)
        print(f"  Nodes: {len(vn)} (expected {len(children)}) — {'OK' if match else 'MISMATCH'}")
        return match
    else:
        print(f"  Verify failed: {err}")
        return False


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 _save_pen.py <linux_path>")
        sys.exit(1)
    
    path = sys.argv[1]
    success = save_pen(path)
    sys.exit(0 if success else 1)
