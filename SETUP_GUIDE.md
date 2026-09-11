# Magnet Mania - Setup Guide

## System Requirements & Prerequisites

The following development environment tools are required to run and build **Magnet Mania**:

| Tool | Required Version | Status | Installed Version |
| --- | --- | --- | --- |
| **Node.js** | v18+ | ✅ Installed | `v24.13.0` |
| **npm** | v9+ | ✅ Installed | `11.6.2` |
| **Git** | Any modern version | ✅ Installed | `2.52.0.windows.1` |

---

## Installation & Setup Instructions

### 1. Clone / Open Workspace
Open the workspace directory in your terminal or IDE:
```bash
cd "d:\projects\magnet mania"
```

### 2. Install Project Dependencies
Run the following command in the workspace directory to install all necessary packages (Vite, Phaser 3, Firebase, TypeScript):
```bash
npm install
```

### 3. Environment Variables Setup
Create a `.env` file in the root folder for Firebase setup (if connecting cloud services):
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Running the Game Locally
Start the Vite local development server:
```bash
npm run dev
```

### 5. Building for Production
To generate static production assets:
```bash
npm run build
```

---

## Technical Stack
- **Framework / Bundler**: Vite + TypeScript
- **Game Engine**: Phaser 3 (2D WebGL / Canvas)
- **Backend / Database**: Firebase Auth & Firestore
- **Styling**: Vanilla CSS with modern dark mode futuristic theme
