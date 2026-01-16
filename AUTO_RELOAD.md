# 🔄 Auto-Reload Development Setup

Stop manually reloading! This guide shows you how to set up automatic reloading for both the add-on and backend.

---

## 🚀 Quick Start (Recommended Workflow)

### **Terminal Setup:**

Open **3 terminals** in the project root (`hello-world/`):

#### **Terminal 1: Frontend (Add-on) with Auto-Rebuild**
```bash
cd hello-world
npm start
```

**What it does:**
- ✅ Watches for changes in `src/` folder
- ✅ Auto-rebuilds when you save files
- ✅ Auto-compiles Tailwind CSS
- ✅ Serves the add-on to Adobe Express

**Auto-reloads when you edit:**
- `src/index.html`
- `src/ui/index.js`
- `src/sandbox/code.js`
- `src/input.css`

---

#### **Terminal 2: Backend with Auto-Restart**
```bash
cd hello-world/backend
npm run dev
```

**What it does:**
- ✅ Watches for changes in backend files
- ✅ Auto-restarts server when you save
- ✅ Preserves logs and connections

**Auto-reloads when you edit:**
- `server.js`
- `routes/*.js`
- `db/*.js`
- `public/*.html`

---

#### **Terminal 3: Commands & Testing**
Keep this free for running builds, tests, or other commands.

---

## 📱 Adobe Express Add-on Reload

**Important:** Adobe Express itself doesn't auto-reload the add-on panel. You need to:

### **Method 1: Quick Reload (Fastest)**
1. Make your changes in `src/`
2. In Adobe Express, **close and reopen** the add-on panel
3. Changes should appear

### **Method 2: Full Reload**
1. Make your changes in `src/`
2. In Adobe Express, go to **Add-ons** menu
3. Click **Manage Add-ons**
4. Toggle your add-on **OFF** then **ON**

### **Method 3: Hard Reload (If stuck)**
1. Close Adobe Express completely
2. Reopen Adobe Express
3. Load your add-on

---

## 🌐 Canvas Viewer Auto-Reload

The Canvas viewer page (`backend/public/viewer.html`) **does NOT auto-reload** by default.

### **Quick Solution: Browser Extension**

Install a **Live Reload** browser extension:

**For Chrome/Edge:**
- [Live Server Web Extension](https://chrome.google.com/webstore/detail/live-server-web-extension/fiegdmejfepffgpnejdinekhfieaogmj)

**For Firefox:**
- [Auto Refresh](https://addons.mozilla.org/en-US/firefox/addon/auto-refresh/)

**Setup:**
1. Install extension
2. Open Canvas viewer (`http://localhost:3000/canvas/:id`)
3. Enable auto-refresh every 2-3 seconds
4. Edit `backend/public/viewer.html`
5. Save → Browser auto-refreshes!

---

## 🎯 What Auto-Reloads vs. Manual Reload

| Component | Auto-Reloads? | How to Reload |
|-----------|---------------|---------------|
| **Backend API** | ✅ YES (nodemon) | Automatic |
| **Backend Routes** | ✅ YES (nodemon) | Automatic |
| **Canvas Viewer HTML** | ❌ NO | Refresh browser |
| **Add-on Panel UI** | ⚠️ PARTIAL | Close/reopen panel |
| **Add-on Sandbox** | ⚠️ PARTIAL | Close/reopen panel |
| **Tailwind CSS** | ✅ YES | Automatic |

---

## ⚡ Pro Tips for Faster Development

### **1. Use Two Browser Windows**

```
Window 1: Adobe Express (left side)
  ↓ Add-on panel open

Window 2: Canvas Viewer (right side)
  ↓ Live reload enabled
```

**Workflow:**
1. Edit `viewer.html` → Browser auto-refreshes
2. Edit `src/ui/index.js` → Close/reopen add-on panel
3. Test immediately side-by-side

---

### **2. Backend API Testing (No Reload Needed)**

Use **VS Code REST Client** or **Postman** to test API endpoints without opening the add-on:

```http
### Test Canvas Publishing
POST http://localhost:3000/api/canvas/publish
Content-Type: application/json

{
  "title": "Test Document",
  "content": "Test content",
  "structure": {
    "sections": [
      {
        "id": "section-1",
        "title": "Test Section",
        "content": "Test content here"
      }
    ]
  }
}

### Test Milestone Creation
POST http://localhost:3000/api/milestones/create
Content-Type: application/json

{
  "canvasId": "abc123",
  "name": "Test Milestone",
  "reason": "Testing API"
}
```

---

### **3. Browser DevTools for Quick Edits**

**For Canvas Viewer:**
1. Open Canvas viewer
2. Press **F12** (DevTools)
3. Go to **Sources** tab
4. Edit HTML/CSS/JS directly
5. See changes instantly (not saved to file)
6. Copy working code back to file

---

## 🐛 Troubleshooting

### **"Changes not appearing in add-on"**

✅ **Solution:**
1. Check if `npm start` is running (Terminal 1)
2. Check if build completed (look for "Done" message)
3. Close and reopen add-on panel in Adobe Express
4. If still not working, restart `npm start`

---

### **"Backend not restarting"**

✅ **Solution:**
1. Check if `npm run dev` is running (Terminal 2)
2. Look for nodemon watching message:
   ```
   [nodemon] watching: *.*
   [nodemon] starting `node server.js`
   ```
3. If not watching, restart: `Ctrl+C` then `npm run dev`

---

### **"Canvas viewer showing old content"**

✅ **Solution:**
1. Hard refresh browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Clear cache: DevTools → Network → Disable cache (checkbox)
3. Or use incognito/private window for testing

---

## 📊 Recommended VS Code Extensions

Install these for even better auto-reload:

1. **Live Server** (`ritwickdey.liveserver`)
   - Right-click `viewer.html` → Open with Live Server
   - Auto-reloads on save

2. **Reload** (`natqe.reload`)
   - Auto-reload on file changes
   - Works with any HTML file

3. **Auto Close Tag** & **Auto Rename Tag**
   - Faster HTML editing

---

## 🎬 Optimal Development Workflow

```
┌─────────────────────────────────────────────────────────┐
│  Your Code Editor (VS Code)                             │
│  - src/ui/index.js                                      │
│  - backend/public/viewer.html                           │
└─────────────────────────────────────────────────────────┘
              ↓ Save file (Ctrl+S)
┌─────────────────────────────────────────────────────────┐
│  Terminal 1: npm start                                  │
│  [Watching... Rebuilding... Done!] ← Auto-rebuild       │
└─────────────────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────────────────┐
│  Adobe Express (Browser)                                │
│  Close/reopen add-on panel → See changes ✓              │
└─────────────────────────────────────────────────────────┘

              ↓ Save viewer.html
┌─────────────────────────────────────────────────────────┐
│  Terminal 2: npm run dev                                │
│  [nodemon] restarting... [nodemon] started ← Auto       │
└─────────────────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────────────────┐
│  Canvas Viewer (Browser with Live Reload)               │
│  Page refreshes automatically → See changes ✓           │
└─────────────────────────────────────────────────────────┘
```

---

## ⚙️ Configuration Files

### **Nodemon Config (Optional)**

Create `backend/nodemon.json` for custom settings:

```json
{
  "watch": [
    "server.js",
    "routes",
    "db",
    "public"
  ],
  "ext": "js,json,html",
  "ignore": [
    "node_modules",
    "db/data/canvas.json"
  ],
  "delay": 500,
  "env": {
    "NODE_ENV": "development"
  }
}
```

---

## 🎯 Summary

**For Maximum Efficiency:**

1. ✅ Run `npm start` in `hello-world/` (Terminal 1)
2. ✅ Run `npm run dev` in `hello-world/backend/` (Terminal 2)
3. ✅ Install browser auto-refresh extension
4. ✅ Keep Adobe Express and Canvas viewer open side-by-side
5. ✅ Edit → Save → Quick reload (close/reopen panel or browser refresh)

**You'll save hours of manual reloading!** ⚡
