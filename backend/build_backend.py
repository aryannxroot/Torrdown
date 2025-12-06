#!/usr/bin/env python3
"""
Build script for creating the PyInstaller bundle.
Run this script to generate the standalone backend executable.

Usage:
    python build_backend.py
    
The output will be placed in:
    - ./dist/torrent_server (or torrent_server.exe on Windows)
    
For Electron packaging, copy the executable to:
    - ../torrent-web-frontend/python-backend/
"""

import subprocess
import sys
import os
import shutil
import platform

def main():
    print("=" * 60)
    print("Building Torrdown Backend")
    print("=" * 60)
    
    # Get the directory of this script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    # Check if PyInstaller is installed
    try:
        import PyInstaller
        print(f"PyInstaller version: {PyInstaller.__version__}")
    except ImportError:
        print("PyInstaller not found. Installing...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "pyinstaller"])
    
    # Clean previous builds
    print("\nCleaning previous builds...")
    for folder in ['build', 'dist']:
        if os.path.exists(folder):
            shutil.rmtree(folder)
            print(f"  Removed {folder}/")
    
    # Run PyInstaller
    print("\nRunning PyInstaller...")
    result = subprocess.run([
        sys.executable, "-m", "PyInstaller",
        "torrent_server.spec",
        "--clean"
    ], capture_output=False)
    
    if result.returncode != 0:
        print("\nBuild failed!")
        sys.exit(1)
    
    # Determine the executable name
    exe_name = "torrent_server.exe" if platform.system() == "Windows" else "torrent_server"
    exe_path = os.path.join("dist", exe_name)
    
    if not os.path.exists(exe_path):
        print(f"\nError: Expected executable not found at {exe_path}")
        sys.exit(1)
    
    print(f"\nBuild successful!")
    print(f"Executable: {exe_path}")
    
    # Copy to frontend's python-backend folder
    frontend_backend_dir = os.path.join(script_dir, "..", "torrent-web-frontend", "python-backend")
    if not os.path.exists(frontend_backend_dir):
        os.makedirs(frontend_backend_dir)
    
    dest_path = os.path.join(frontend_backend_dir, exe_name)
    shutil.copy2(exe_path, dest_path)
    print(f"Copied to: {dest_path}")
    
    # Get file size
    size_mb = os.path.getsize(dest_path) / (1024 * 1024)
    print(f"Executable size: {size_mb:.2f} MB")
    
    print("\n" + "=" * 60)
    print("Backend build complete!")
    print("=" * 60)

if __name__ == "__main__":
    main()

