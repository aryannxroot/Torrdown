#!/usr/bin/env python3
"""
Standalone server entry point for PyInstaller bundling.
This file is the main entry point when running the bundled executable.
"""

import sys
import os

# Add the current directory to the path for imports
if getattr(sys, 'frozen', False):
    # Running as bundled executable
    application_path = os.path.dirname(sys.executable)
else:
    # Running as script
    application_path = os.path.dirname(os.path.abspath(__file__))

# Use user's home directory for downloads (writable location)
# This works on Windows, macOS, and Linux
home_dir = os.path.expanduser("~")
torrdown_dir = os.path.join(home_dir, "Torrdown")
downloads_dir = os.path.join(torrdown_dir, "downloads")

# Create directories if they don't exist
if not os.path.exists(downloads_dir):
    os.makedirs(downloads_dir)

# Change to downloads directory for file operations
os.chdir(downloads_dir)

import uvicorn
from main import app

if __name__ == "__main__":
    print("Starting Torrdown Backend Server...")
    print(f"Application path: {application_path}")
    print(f"Downloads directory: {downloads_dir}")
    
    uvicorn.run(
        app,
        host="127.0.0.1",
        port=8000,
        log_level="info"
    )

