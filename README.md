# Jani - Your Punjabi Desktop Companion AI

A warm, friendly desktop AI assistant that runs in the background and responds to global hotkeys. Jani is your loyal Punjabi friend who's always there to chat, remember your preferences, and provide support with casual, caring conversation.

## Features

- **Background Operation**: Runs permanently in system tray, closing the window doesn't quit the app
- **System Tray Integration**: Right-click menu with "Open Jani" and "Quit" options
- **Global Hotkey**: Press `Alt + Space` anywhere to toggle Jani's visibility
- **Friendly Punjabi Persona**: Jani speaks with warm, casual Punjabi-English flair and cultural expressions
- **Persistent Memory**: Remembers your preferences across sessions using local storage
- **Typing Animations**: Smooth text-typing effects for natural conversation feel
- **Modern UI**: Beautiful chat interface built with Next.js and Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 15 (App Router) + React 18 + Tailwind CSS
- **Desktop Wrapper**: Electron.js
- **AI Engine**: Google Gemini API (official SDK)
- **Storage**: electron-store for persistent memory

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Gemini API key

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Gemini API Key

1. Get your free API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a `.env.local` file in the project root:
   ```bash
   GEMINI_API_KEY=your_actual_api_key_here
   ```
3. **Important**: Never commit `.env.local` to version control (it's already in `.gitignore`)

### 3. Development Mode

Run both Next.js dev server and Electron:

```bash
npm run dev
```

This starts:
- Next.js on `http://localhost:3000`
- Electron app that loads the Next.js app

### 4. Production Build

Build the Next.js app and package it as an executable:

```bash
npm run package
```

This creates a distributable executable in the `dist/` folder.

## Usage

- **Open/Close**: Click the tray icon or press `Alt + Space`
- **Right-click Tray**: Access "Open Jani" and "Quit" options
- **Chat**: Type messages and send to chat with Jani
- **Memory**: Jani remembers your last message and preferences across sessions

## Project Structure

```
├── app/
│   ├── api/chat/route.ts    # Gemini API integration
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main chat UI
├── electron/
│   ├── main.js              # Electron main process
│   └── preload.js           # Context bridge for IPC
├── public/
│   └── icon.svg             # App icon
└── package.json             # Dependencies and scripts
```

## Environment Variables

- `GEMINI_API_KEY`: Your Google Gemini API key (required)

## Troubleshooting

**App won't start**: Ensure `.env.local` exists with a valid API key

**System tray not working**: Check that Electron has proper permissions

**Hotkey not responding**: Ensure `Alt + Space` isn't used by other apps

**API errors**: Verify your Gemini API key is valid and has quota

## License

MIT