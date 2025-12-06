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

# Change to the application directory
os.chdir(application_path)

# Create downloads directory if it doesn't exist
downloads_dir = os.path.join(application_path, 'downloads')
if not os.path.exists(downloads_dir):
    os.makedirs(downloads_dir)

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

