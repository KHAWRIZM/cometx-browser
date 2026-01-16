# CometX Browser - AI Agent Instructions

> **"من الرماد ينهض العنقاء"** - From the ashes rises the phoenix

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│  CometX Browser v2.0 - Sovereign Neural Browser             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  index.html (1800+ lines)                                   │
│    └─ Single-page browser UI with:                          │
│       • Three-Lobe AI System (Executive/Sensory/Cognitive)  │
│       • 6-language i18n (ar, en, fr, es, zh, de)           │
│       • Neural particle background animations               │
│       • AI chat sidebar                                     │
│                                                             │
│  src/main/main.js                                           │
│    └─ Electron main process                                 │
│       • BrowserView tab management                          │
│       • IPC handlers for navigation                         │
│       • Global shortcuts (Ctrl+T, Ctrl+W, etc.)            │
│       • electron-store for settings persistence             │
│                                                             │
│  src/main/preload.js                                        │
│    └─ Context bridge for secure IPC                         │
│                                                             │
│  locales/{ar,en,fr,es,zh,de}.json                          │
│    └─ Translation strings for all UI elements               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🎨 Design System

### CSS Variables (in `:root`)
```css
--sovereign-primary: #1ABC9C;   /* Main turquoise */
--sovereign-dark: #05261F;      /* Dark background */
--sovereign-darker: #021a15;    /* Darker background */
--sovereign-light: #2ECC71;     /* Accent green */
--neural-glow: rgba(26,188,156,0.6);  /* Glow effects */
```

### Key Visual Elements
- **Neural grid**: Animated 50px grid with `gridMove` animation
- **Particles**: Floating orbs with `particleFloat` keyframes  
- **Glass effects**: `backdrop-filter: blur()` with `--glass` variables

## 🧠 Three-Lobe AI System

The core architectural concept - each "lobe" has specific responsibilities:

| Lobe | Arabic | Role |
|------|--------|------|
| Executive | الفص التنفيذي | Decision making, command execution |
| Sensory | الفص الحسي | Monitoring, input analysis |
| Cognitive | الفص المعرفي | Understanding, learning, responses |

### UI Implementation
- `.three-lobe-display` - Flex container for lobe cards
- `showLobeInfo(lobe)` - Function to display lobe details
- `.lobe-btn` buttons in AI sidebar for mode switching

## 🌍 Internationalization (i18n)

### Current Implementation
- 6 languages: Arabic (RTL), English, French, Spanish, Chinese, German
- Language selector buttons in footer: 🇸🇦 🇺🇸 🇫🇷 🇪🇸 🇨🇳 🇩🇪
- Translation files in `/locales/*.json`

### Adding New Translations
1. Copy `locales/en.json` → `locales/XX.json`
2. Update `name`, `code`, `dir`, `flag` fields
3. Translate all strings in `strings` object
4. Add flag button in `index.html` footer

## ⚡ Key Functions (index.html)

```javascript
// AI Chat
sendAIMessage()       // Send message to AI sidebar
addMessage(text, type) // Add chat bubble ('user'|'system')

// Navigation
search()              // Execute Google search
newTab()              // Create new tab (Electron)
toggleAI()            // Open/close AI sidebar

// Lobes
showLobeInfo(lobe)    // Display lobe information popup

// Window Controls
closeWindow()         // Close with confirmation
maximizeWindow()      // Toggle fullscreen
```

## 🔌 Electron IPC Channels

### Renderer → Main
```javascript
window.cometAPI.createTab(url)
window.cometAPI.switchTab(tabId)
window.cometAPI.closeTab(tabId)
window.cometAPI.navigate(url)
window.cometAPI.goBack()
window.cometAPI.goForward()
window.cometAPI.reload()
```

### Main → Renderer
```javascript
'tab-created'   // New tab opened
'tab-updated'   // Tab title/URL changed
'tab-switched'  // Active tab changed
'url-changed'   // Navigation occurred
'focus-url'     // Focus URL bar
```

## 📁 File Structure

```
COMETX_BROWSER/
├── index.html              # Main browser UI (all-in-one)
├── package.json            # Electron config + build settings
├── src/
│   └── main/
│       ├── main.js         # Electron main process
│       └── preload.js      # Context bridge
├── locales/
│   ├── ar.json             # Arabic (default)
│   ├── en.json             # English
│   ├── fr.json             # French
│   ├── es.json             # Spanish
│   ├── zh.json             # Chinese
│   └── de.json             # German
├── docs/
│   └── THE_BROWSER_EXPLAINED.html  # Documentation page
└── assets/
    └── icons/              # App icons (ico, icns, png)
```

## 🛠️ Development Commands

```bash
npm start        # Run Electron app
npm run dev      # Run with logging
npm run build    # Build for all platforms
npm run build:win # Windows installer (NSIS + Portable)
npm run dist     # Windows x64 distribution
```

## 🎯 Conventions

### Naming
- Functions: camelCase (`sendAIMessage`, `toggleAI`)
- CSS classes: kebab-case (`three-lobe-display`, `lobe-card`)
- IPC channels: kebab-case (`tab-created`, `url-changed`)

### Comments
- Section headers use ASCII boxes:
```javascript
/* ============================================
   Section Name
   ============================================ */
```

### Arabic/Bilingual Text
- Arabic strings as primary, English as fallback
- Use RTL direction for Arabic UI (`dir="rtl"`)
- Mix Arabic labels with English technical terms

## 🔐 Core Principles

1. **100% Local Processing** - No data leaves the device
2. **Zero Bias** - Neutral to nations, religions, politics
3. **Saudi Vision 2030** - Digital sovereignty focus
4. **Phoenix Story** - Rebuilt from destroyed Azure resources

## 🚀 Extending the Project

### Adding New AI Response Topics
Edit `sendAIMessage()` in index.html:
```javascript
const responses = [
    'existing response 1',
    'existing response 2',
    'YOUR_NEW_RESPONSE'  // Add here
];
```

### Adding New Quick Link
In `.quick-links` section of index.html:
```html
<a href="YOUR_URL" class="quick-link" target="_blank">
    <span class="link-icon">🔗</span>
    <span class="link-label">Label</span>
</a>
```

### Adding New Lobe Functionality
1. Add lobe info in `showLobeInfo()` function
2. Add button in `.ai-lobes` section
3. Add styles in CSS if needed

---

**GitHub**: [KHAWRIZM/cometx-browser](https://github.com/KHAWRIZM/cometx-browser)  
**Live Demo**: [khawrizm.github.io/cometx-browser](https://khawrizm.github.io/cometx-browser)  
**Author**: Sulaiman Al-Shammari (shammar403@gmail.com)
