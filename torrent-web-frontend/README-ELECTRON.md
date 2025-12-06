# Torrdown Desktop App

A premium torrent downloader desktop application built with Electron, Next.js, and Python.

## Prerequisites

- **Node.js** 18+ 
- **Python** 3.10+
- **npm** or **yarn**

## Project Structure

```
torrent-web-frontend/
├── electron/
│   ├── main.js          # Electron main process
│   └── preload.js       # Preload script
├── src/                  # Next.js app source
├── build/               # Electron builder resources
├── python-backend/      # Bundled Python backend (after build)
├── out/                 # Next.js static export (after build)
├── dist-electron/       # Packaged apps (after build)
├── electron-builder.yml # Electron builder config
└── package.json
```

## Development

### 1. Install Frontend Dependencies

```bash
cd torrent-web-frontend
npm install
```

### 2. Start Backend (in separate terminal)

```bash
cd ../backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python -m uvicorn main:app --host 127.0.0.1 --port 8000
```

### 3. Run Electron in Development Mode

```bash
npm run electron:dev
```

This will:
- Start Next.js dev server on port 3000
- Wait for the server to be ready
- Launch Electron pointing to localhost:3000

## Building for Production

### 1. Bundle Python Backend

First, bundle the Python backend as a standalone executable:

```bash
cd ../backend
source venv/bin/activate
pip install pyinstaller
python build_backend.py
```

This creates:
- `backend/dist/torrent_server` (or `.exe` on Windows)
- Copies to `torrent-web-frontend/python-backend/`

### 2. Build Electron App

```bash
cd ../torrent-web-frontend

# Build for current platform
npm run electron:build

# Build for specific platforms
npm run electron:build:win    # Windows
npm run electron:build:mac    # macOS
npm run electron:build:linux  # Linux
npm run electron:build:all    # All platforms
```

Output will be in `dist-electron/`:
- Windows: `.exe` installer and portable
- macOS: `.dmg` and `.zip`
- Linux: `.AppImage` and `.deb`

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Build Next.js for production |
| `npm run electron:dev` | Development mode with Electron |
| `npm run electron:build` | Package for current platform |
| `npm run electron:build:win` | Package for Windows |
| `npm run electron:build:mac` | Package for macOS |
| `npm run electron:build:linux` | Package for Linux |

## How It Works

1. **Electron Main Process** (`electron/main.js`):
   - Starts the bundled Python backend
   - Waits for backend to be ready
   - Creates the app window
   - Loads the Next.js static export

2. **Python Backend**:
   - Runs as a subprocess managed by Electron
   - Provides REST API and WebSocket endpoints
   - Handles torrent downloading via libtorrent

3. **Frontend**:
   - Static Next.js export
   - Communicates with backend via HTTP/WebSocket
   - Detects Electron environment via preload script

## Troubleshooting

### Backend won't start
- Check if port 8000 is already in use
- Verify Python dependencies are installed
- Check console output for errors

### Build fails
- Ensure all dependencies are installed
- On macOS, you may need to disable code signing for testing
- Check that python-backend folder contains the executable

### App crashes on startup
- Check if backend executable exists in python-backend/
- Look at the Electron console for errors
- Try running the backend executable manually first

