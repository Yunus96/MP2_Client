# Anvaya CRM Dashboard

A clean React + Vite + React Router v6 project with full separation of concerns.

## Routes

| Path              | Screen               |
|-------------------|----------------------|
| `/`               | Redirects → `/dashboard` |
| `/dashboard`      | Dashboard (card grid + status) |
| `/leads`          | Lead List (table, filters, sort) |
| `/leads/:leadId`  | Lead Detail + Comments |
| `/sales`          | Coming soon |
| `/agents`         | Coming soon |
| `/reports`        | Coming soon |
| `/settings`       | Coming soon |
| `*`               | 404 Not Found |

## Project Structure

```
anvaya-crm/
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx              # Entry — BrowserRouter wraps App
    ├── index.css             # Global reset & CSS variables
    ├── App.jsx               # Route definitions (Routes / Route)
    ├── App.css
    ├── data/
    │   └── leads.js          # Mock data & constants
    ├── hooks/
    │   ├── useLeads.js       # Dashboard filter logic
    │   ├── useLeadList.js    # Lead list filter/sort/add logic
    │   └── useLeadDetail.js  # Single lead state & comments
    └── components/
        ├── Header.jsx / .css         # Uses <Link> for brand
        ├── Sidebar.jsx / .css        # Uses <NavLink> (auto active)
        ├── SectionTitle.jsx / .css
        ├── LeadCard.jsx / .css
        ├── LeadsSection.jsx / .css   # Uses useNavigate
        ├── StatusPanel.jsx / .css
        ├── LeadList.jsx / .css       # Uses useNavigate
        ├── AddLeadModal.jsx
        ├── LeadManagement.jsx        # Uses useParams + useNavigate
        ├── LeadManagement.css
        ├── LeadDetail.jsx
        ├── CommentsSection.jsx / .css
        └── NotFound.jsx
```

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173

## React Router hooks used

| Hook            | Used in              | Purpose                            |
|-----------------|----------------------|------------------------------------|
| `useNavigate`   | LeadsSection, LeadList, LeadManagement, NotFound | Programmatic navigation |
| `useParams`     | LeadManagement       | Read `:leadId` from URL            |
| `NavLink`       | Sidebar              | Auto applies active class          |
| `Link`          | Header               | Brand logo home link               |
| `Routes/Route`  | App                  | Declare all routes                 |
| `Navigate`      | App                  | Redirect `/` → `/dashboard`        |
