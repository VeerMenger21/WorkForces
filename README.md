# WorkForces 

> **Nearby Work · Clear Terms · Work with Dignity**  
> A realistic, responsive platform bridging informal daily-wage workers and local employers with transparency, structured trade-based matching, two-way accountability, and fair labor standards.

---

## 🌟 Key Features & Capabilities

### 1. 🛠️ Strict Structured Trade-Based Matching
- Workers only see jobs that match their exact trade or explicitly compatible crafts (e.g., Electricians see electrical rewiring; Plumbers see pipeline fitting; Carpenters see woodwork).
- Normalized trade identifiers eliminate spelling or capitalization discrepancies.
- Multi-skill support allows workers to match additional verified skills.
- Employers filtering on the **Digital Naka** worker directory only see trades relevant to their requirements.

### 2. 👥 Multi-Worker Persona Switcher (9 Distinct Trades)
- Switch instantly between 9 fully fleshed-out worker profiles across Mumbai neighborhoods:
  1. **Ramesh Patil** — Electrician (Andheri East)
  2. **Suresh Sharma** — Plumber (Saki Naka)
  3. **Rajesh Vishwakarma** — Carpenter (Marol)
  4. **Anil Chauhan** — Painter (Powai)
  5. **Ganesh Yadav** — Mason / Construction (Kurla West)
  6. **Vikram Shinde** — Welder & Fabricator (Ghatkopar)
  7. **Sunita Devi** — Deep Cleaning & Sanitation (Andheri East)
  8. **Manoj Kumar** — Construction Labourer / Helper (Saki Naka)
  9. **Deepak Gupta** — Tile & Marble Layer (Powai)
- Each persona has dedicated confirmed bookings, diary history, expected daily rates, and trade specialties.
- Quick-switch selector available in the header ModeBar, desktop sidebar, and profile view.

### 3. ⭐ Uber-Style Dynamic Tiered Rating System
- Feedback tags adapt dynamically based on star ratings:
  - **1–2 Stars (Low Tier)**: Negative issue flags (*Payment delayed or disputed*, *Unsafe site conditions*, *Worker arrived late*, *Work below expectations*).
  - **3 Stars (Mid Tier)**: Constructive feedback (*Minor communication issues*, *Delay in site access*, *Punctuality could improve*).
  - **4–5 Stars (High Tier)**: Positive commendations (*Payment immediate & accurate*, *Polite & respectful*, *Superb craftsmanship*, *Punctual*).
- Star picker includes accessible radio roles, keyboard interaction, and hover indicators.

### 4. 🔄 Two-Way Cancellation Workflow
- **Worker side**: Allows withdrawal from agreed bookings prior to completion with valid notice reasons (*Family emergency*, *Schedule conflict*, *Transport issue*, *Rate discrepancy*). Reopens job listing and notifies employer.
- **Employer side**: Allows cancellation of open listings or confirmed bookings with reasons (*Postponed*, *Alternative worker hired*, *Materials not ready*). Flags listing as cancelled and alerts worker.

### 5. 🛡️ In-App Dispute Notification & Resolution
- If payment is delayed, partial, or missing, workers can file a structured dispute with reason codes and optional descriptions.
- The employer receives a high-priority in-app notification and can review details and acknowledge the issue directly.
- **Rule Enforcement**: Once a job is marked **Paid**, the dispute button is completely hidden from the worker's card and diary.

### 6. ⏱️ Fair Labor Shift Limits (9:00 AM – 7:00 PM)
- Daily shifts are strictly bounded between 9:00 AM and 7:00 PM (maximum 10 hours per shift).
- Real-time form validation blocks submission outside permitted hours to prevent informal labor over-exploitation.

### 7. 🏆 Urban Company Inspirations
- **Fair Market Rate Benchmarks**: Standard market wage chips by trade (e.g., ₹850–₹1,200/day for electricians) enable employers to set fair, competitive compensation with 1 click.
- **"Super Pro" Trust Badges**: Awarded to top-rated, highly experienced pros (≥4.8 rating, ≥30 completed jobs).
- **Safety & Terms Guarantee**: Upfront clarity on tools, transport, and payment timing.

### 8. 🌐 Authentic Multilingual Localization
- Natural, culturally accurate translations for **English**, **हिन्दी (Hindi)**, and **मराठी (Marathi)**.
- Switching language updates navigation, tabs, action buttons, form labels, and status badges instantly.

### 9. 📱 Authentic Mobile Phone Emulator
- One-click toggle between full **Desktop Web View** and **Mobile Phone Device View**.
- Simulated smartphone chassis features dynamic island, status bar, hidden desktop sidebar, and native bottom navigation tab bar.

---

## 💻 Tech Stack

- **Framework**: React 19 with TypeScript
- **Bundler & Dev Server**: Vite
- **Icons**: Lucide React
- **Styling**: Pure CSS Design System (Custom CSS Variables, Fluid Grids, Mobile Emulator Shell)
- **State Management**: React Context with LocalStorage persistence

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation & Run

```bash
# 1. Clone the repository
git clone https://github.com/VeerMenger21/WorkForces.git
cd WorkForces

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Build for production
npm run build
```

Open [http://localhost:5173](http://localhost:5173) (or the port indicated in your console) to view the application.

---

## 📂 Repository Structure

```
WorkForces/
├── public/                 # Static assets and icons
├── src/
│   ├── components/         # Shared UI components
│   │   ├── CancelModal.tsx    # Two-way cancellation modal
│   │   ├── DisputeModal.tsx   # Payment dispute reporting
│   │   ├── JobCard.tsx        # Standardized job card
│   │   ├── ModeBar.tsx        # Top navbar, language, & persona switcher
│   │   ├── PhoneDevice.tsx    # Mobile device emulator frame
│   │   ├── RatingModal.tsx    # Uber-style dynamic rating system
│   │   └── Toast.tsx          # Toast notification system
│   ├── pages/
│   │   ├── Landing.tsx        # Platform entry and role selector
│   │   ├── worker/            # Worker portal views
│   │   │   ├── WorkerShell.tsx
│   │   │   ├── WorkerHome.tsx
│   │   │   ├── Jobs.tsx
│   │   │   ├── JobDetail.tsx
│   │   │   ├── Diary.tsx
│   │   │   ├── Profile.tsx
│   │   │   └── Rights.tsx
│   │   └── employer/          # Employer portal views
│   │       ├── EmployerShell.tsx
│   │       ├── Dashboard.tsx
│   │       ├── Discover.tsx
│   │       ├── ManageJobs.tsx
│   │       └── PostJob.tsx
│   ├── utils/
│   │   └── matching.ts        # Trade matching algorithms & wage helpers
│   ├── context.tsx            # Global state store & persistence
│   ├── i18n.ts                # English, Hindi, and Marathi dictionaries
│   ├── seedData.ts            # Realistic personas, jobs, and locations
│   ├── types.ts               # Core TypeScript data models
│   ├── styles.css             # Unified KaamSetu design system
│   ├── App.tsx                # Client routing configuration
│   └── main.tsx               # Application root
├── index.html
├── package.json
├── tsconfig.json
└── README.md
```

---

## 👥 Contributors & Team Distribution

This project was built collaboratively with balanced contributions:

| Contributor | GitHub Profile | Role & Primary Contributions | Planned Share |
|---|---|---|---|
| **Veer Menger** | [@VeerMenger21](https://github.com/VeerMenger21) | System Architecture, Build Configuration, Store Persistence, UI Component Suite, Design System & Final Polish | **40%** |
| **Anay Mhatre** | [@anaymhatre-alt](https://github.com/anaymhatre-alt) | Domain Data Models, Structured Trade-Matching Algorithms, Worker Portal Workflows & Multilingual Localization | **30%** |
| **Devansh** | [@Devansh1353](https://github.com/Devansh1353) | Realistic Persona Modeling, Employer Portal & Job Lifecycle, Uber-Style Dynamic Rating Engine & Dispute Tracking | **30%** |

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
