# -*- mode: python ; coding: utf-8 -*-
"""
PyInstaller spec file for bundling the Torrdown backend.
Run with: pyinstaller torrent_server.spec
"""

import sys
import os
from PyInstaller.utils.hooks import collect_data_files, collect_submodules

block_cipher = None

# Collect all hidden imports for the packages we use
hidden_imports = [
    'uvicorn',
    'uvicorn.logging',
    'uvicorn.loops',
    'uvicorn.loops.auto',
    'uvicorn.protocols',
    'uvicorn.protocols.http',
    'uvicorn.protocols.http.auto',
    'uvicorn.protocols.websockets',
    'uvicorn.protocols.websockets.auto',
    'uvicorn.lifespan',
    'uvicorn.lifespan.on',
    'fastapi',
    'starlette',
    'starlette.routing',
    'starlette.middleware',
    'starlette.middleware.cors',
    'pydantic',
    'anyio',
    'anyio._backends',
    'anyio._backends._asyncio',
    'httptools',
    'websockets',
    'libtorrent',
    'requests',
    'bs4',
    'lxml',
    'lxml.etree',
]

# Collect submodules
hidden_imports += collect_submodules('uvicorn')
hidden_imports += collect_submodules('fastapi')
hidden_imports += collect_submodules('starlette')
hidden_imports += collect_submodules('pydantic')

# Collect binaries for libtorrent and other dependencies
binaries = []

# Dynamically find site-packages
import site
site_packages_dirs = site.getsitepackages()
if site_packages_dirs:
    site_packages = site_packages_dirs[0]
else:
    site_packages = os.path.join(os.path.dirname(sys.executable), 'lib', 'site-packages')

print(f"Using site-packages: {site_packages}")

# Collect libtorrent module and all its binaries
try:
    import libtorrent
    libtorrent_path = os.path.dirname(libtorrent.__file__)
    print(f"Found libtorrent at: {libtorrent_path}")
    
    # Add the entire libtorrent module including compiled extensions
    binaries.append((libtorrent_path, 'libtorrent'))
    
    # Also look for .pyd/.so files in site-packages that might be dependencies
    if os.path.exists(site_packages):
        for filename in os.listdir(site_packages):
            filepath = os.path.join(site_packages, filename)
            if filename.endswith('.pyd') or filename.endswith('.so'):
                # Only add critical binary extensions, not all of them
                if any(x in filename.lower() for x in ['torrent', 'boost']):
                    binaries.append((filepath, '.'))
                    print(f"Adding binary: {filename}")
except ImportError as e:
    print(f"WARNING: Could not import libtorrent: {e}")

# Add OpenSSL 1.1 DLLs for libtorrent support on any Windows system
openssl_paths = [
    'C:\\Program Files\\OpenSSL-Win64\\bin',
    'C:\\Program Files (x86)\\OpenSSL-Win32\\bin',
    os.path.join(os.path.dirname(sys.executable), '..', '..', 'Library', 'bin'),
]

for openssl_path in openssl_paths:
    if os.path.exists(openssl_path):
        print(f"Found OpenSSL at: {openssl_path}")
        # Add the OpenSSL DLLs to the root of the dist folder
        for dll_name in ['libssl-1_1-x64.dll', 'libcrypto-1_1-x64.dll', 'libssl-1_1.dll', 'libcrypto-1_1.dll']:
            dll_path = os.path.join(openssl_path, dll_name)
            if os.path.exists(dll_path):
                binaries.append((dll_path, '.'))
                print(f"Adding OpenSSL DLL: {dll_name}")
        break
else:
    print("WARNING: OpenSSL 1.1 not found. libtorrent may fail on systems without OpenSSL installed.")

a = Analysis(
    ['server.py'],
    pathex=['.'],
    binaries=binaries,
    datas=[
        ('main.py', '.'),
        ('yts.py', '.'),
        ('downloader.py', '.'),
    ],
    hiddenimports=hidden_imports,
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[
        'tkinter',
        'matplotlib',
        'scipy',
        'numpy',
        'pandas',
        'PIL',
    ],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    [],
    name='torrent_server',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=True,  # Set to True for debugging, False for production
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)

