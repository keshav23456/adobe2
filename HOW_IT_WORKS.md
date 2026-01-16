# 📚 How Canvas Features Work

## 🔍 Reading Progress Tracking (Blind Spots Detection)

### **How It Works:**

The Canvas viewer uses the **Intersection Observer API** to track which sections are viewed. Here's the step-by-step process:

#### **1. Section Observation Setup**

When the Canvas viewer page loads:

```javascript
// viewer.html - setupSectionTracking()

const options = {
    root: null,              // Use viewport as root
    rootMargin: '0px',       // No margin
    threshold: 0.5           // Trigger when 50% visible
};

const observer = new IntersectionObserver(callback, options);
sections.forEach(section => {
    observer.observe(section);  // Watch each section
});
```

**What this means:**
- Each section is "watched" by the browser
- When **50% of a section** becomes visible in the viewport, a callback fires
- This happens automatically as the user scrolls

---

#### **2. View Detection**

When a section becomes visible:

```javascript
const callback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Section is now visible!
            const sectionId = entry.target.id;
            
            if (!viewedSections.has(sectionId)) {
                viewedSections.add(sectionId);
                trackSectionView(sectionId);  // Send to backend
            }
        }
    });
};
```

**Flow:**
```
User scrolls ↓
  → Section becomes 50% visible
    → Intersection Observer detects it
      → Check: "Have we seen this section before?"
        → If NO: Mark as viewed + send to backend
        → If YES: Do nothing (already tracked)
```

---

#### **3. Backend Tracking**

The view is sent to the backend:

```javascript
async function trackSectionView(sectionId) {
    await fetch(`${BACKEND_URL}/api/tracking/view-section`, {
        method: 'POST',
        body: JSON.stringify({ 
            canvasId,     // Which Canvas?
            sectionId     // Which section?
        })
    });
    updateBlindSpots();  // Refresh blind spots list
}
```

The backend stores this in the database:

```javascript
// routes/tracking.js
canvas.tracking.sectionsViewed[sectionId] = {
    firstViewed: new Date().toISOString(),
    count: count + 1
};
```

---

#### **4. Blind Spots Calculation**

Blind spots are sections that were **never viewed**:

```javascript
// Backend: routes/tracking.js
const allSectionIds = structure.sections.map(s => s.id);
const viewedSectionIds = Object.keys(tracking.sectionsViewed);

const blindSpots = allSectionIds.filter(
    id => !viewedSectionIds.includes(id)
);
```

**Example:**

| Section ID | Status | Blind Spot? |
|-----------|--------|-------------|
| section-1 | ✅ Viewed | ❌ No |
| section-2 | ❌ Never viewed | ✅ **YES** |
| section-3 | ✅ Viewed | ❌ No |
| section-4 | ❌ Never viewed | ✅ **YES** |

---

#### **5. Progress Bar Update**

The progress bar shows the percentage of viewed sections:

```javascript
const totalSections = 4;
const viewedSections = 2;
const progressPercent = (viewedSections / totalSections) * 100;  // 50%

<div class="progress-bar" style="width: 50%"></div>
```

**Visual Result:**

```
📊 Reading Progress: 2/4 sections viewed
[████████████░░░░░░░░░░░░] 50%

⚠️ "Impact on Education" was not viewed
⚠️ "Challenges and Future Outlook" was not viewed
```

---

### **Why This Approach?**

✅ **Privacy-First**: Only tracks section visibility, not user identity  
✅ **Real-Time**: Updates instantly as user scrolls  
✅ **Non-Intrusive**: Works silently in background  
✅ **Accurate**: 50% threshold ensures intentional viewing  
✅ **Simple**: No complex analytics or tracking scripts

---

## 💾 Milestone Creation

### **How It Works:**

#### **1. User Clicks "Create Milestone"**

A modal appears with:
- **Milestone Name** (required): e.g., "Initial Draft", "Client Review"
- **Reason** (optional): e.g., "Added pricing section"

#### **2. Data Saved to Backend**

```javascript
// routes/milestones.js
const newMilestone = {
    id: nanoid(),
    canvasId,
    name: "Initial Draft",
    reason: "First version for team review",
    createdAt: new Date().toISOString(),
    contentSnapshot: { ...canvas.structure }  // Full document copy
};

canvas.milestones.push(newMilestone);
```

**What gets stored:**
- Milestone metadata (name, reason, timestamp)
- **Complete snapshot** of the document at that moment
- Link to the parent Canvas

#### **3. Displayed in Canvas Viewer**

Milestones appear in the sidebar:

```
💙 Milestones

📌 Initial Draft
   First version for team review
   Created: Jan 16, 2026 2:30 PM

📌 Client Review
   Updated based on feedback
   Created: Jan 16, 2026 4:15 PM
```

---

## 🔄 Insight View (Text → Bullets)

### **How It Works:**

#### **1. User Clicks "Insights" Toggle**

```javascript
// viewer.html - toggleInsightView()
if (viewType === 'insights') {
    // Generate insights if not cached
    if (insightsDiv.innerHTML === '') {
        const response = await fetch('/api/insights/generate', {
            method: 'POST',
            body: JSON.stringify({ paragraph: sectionContent })
        });
        const { insights } = await response.json();
        // Display as bullet points
    }
}
```

#### **2. Backend Generates Insights**

```javascript
// routes/insights.js
const sentences = paragraph.split(/(?<=[.!?])\s+/);
const insights = sentences.slice(0, 5).map(s => s.trim());
```

**Example:**

**Original Text:**
> Technology has completely changed the way people communicate with each other. Messages, emails, and video calls allow instant interaction across the world, reducing distance and time barriers. Social media platforms help individuals share ideas, opinions, and experiences, creating a more connected global society.

**Insights (Bullets):**
- Technology has completely changed the way people communicate with each other.
- Messages, emails, and video calls allow instant interaction across the world, reducing distance and time barriers.
- Social media platforms help individuals share ideas, opinions, and experiences, creating a more connected global society.

---

## 🎨 Demo Content Editor

### **How It Works:**

#### **1. Edit Demo Content**

Click "✏️ Edit Demo Content" in the add-on panel.

#### **2. Format:**

```
Title | Content
```

Example:

```
Introduction | This is the introduction section explaining the project goals.
Budget | This section covers the financial planning and resource allocation.
Timeline | The project will be completed in three phases over six months.
```

#### **3. Storage:**

Content is saved to **localStorage**:

```javascript
localStorage.setItem('demoContent', JSON.stringify({
    title: "My Custom Document",
    sections: [
        { id: "section-1", title: "Introduction", content: "..." },
        { id: "section-2", title: "Budget", content: "..." }
    ]
}));
```

#### **4. Used During Publish:**

When you click "Publish as Canvas", the UI checks for custom content:

```javascript
const customDemo = localStorage.getItem('demoContent');
if (customDemo) {
    documentData = JSON.parse(customDemo);  // Use custom content
}
```

---

## 🎯 Key Design Principles

| Principle | Implementation |
|-----------|----------------|
| **User Control** | Everything requires explicit action (buttons, clicks) |
| **No Auto-Editing** | Canvas never modifies your document |
| **Simple Insights** | Plain text, no complex analytics |
| **Privacy First** | No user identity tracking |
| **Optional Features** | All features can be ignored |

---

## 📊 Technical Architecture

```
┌─────────────────────────────────────────┐
│   Adobe Express (Creative Cloud)        │
│   ┌─────────────────────────────────┐   │
│   │  Canvas Add-on Panel            │   │
│   │  - Publish as Canvas            │   │
│   │  - Create Milestone             │   │
│   │  - Edit Demo Content            │   │
│   └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
              ↓ HTTP POST
┌─────────────────────────────────────────┐
│   Backend (Node.js/Express)             │
│   - /api/canvas/publish                 │
│   - /api/milestones/create              │
│   - /api/tracking/view-section          │
│   - /api/insights/generate              │
│   Storage: LowDB (JSON file)            │
└─────────────────────────────────────────┘
              ↓ HTTP GET
┌─────────────────────────────────────────┐
│   Canvas Viewer (Browser)               │
│   - Display document sections           │
│   - Intersection Observer (tracking)    │
│   - Text/Insights toggle                │
│   - Blind spots sidebar                 │
│   - Milestones list                     │
└─────────────────────────────────────────┘
```

---

## 🚀 Performance Optimizations

1. **Debounced Tracking**: Section views are tracked once, not repeatedly
2. **Cached Insights**: Generated insights are cached in the DOM
3. **Lazy Loading**: Milestones load on sidebar open
4. **Minimal Database**: JSON file for fast read/write
5. **Client-Side Progress**: Progress bar updates without backend calls

---

## 🎬 Perfect for Demo Videos!

- ✅ Reliable (Demo Mode prevents crashes)
- ✅ Customizable (Edit demo content anytime)
- ✅ Professional (Beautiful UI and smooth interactions)
- ✅ Feature-Complete (All 4 Phase 1 features working)
- ✅ Predictable (Same behavior every time)
