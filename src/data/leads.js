export const LEADS = [
  {
    id: 1,
    name: "Priya Krishnamurthy",
    company: "Meridian Tech",
    email: "priya@meridian.in",
    phone: "+91 98400 12345",
    value: 420000,
    status: "New",
    progress: 20,
    agent: "John Doe",
    source: "Referral",
    priority: "High",
    daysToClose: 30,
    comments: [
      { id: 1, author: "John Doe", avatar: "JD", date: "2026-03-20T09:15:00", text: "Reached out via email. Waiting for response from the client." },
      { id: 2, author: "Riya Kumar", avatar: "RK", date: "2026-03-21T14:30:00", text: "Follow-up call scheduled for Thursday. She seemed interested in the Pro plan." },
    ],
  },
  {
    id: 2,
    name: "Arjun Sharma",
    company: "Novacraft Solutions",
    email: "arjun@novacraft.io",
    phone: "+91 97300 54321",
    value: 875000,
    status: "Contacted",
    progress: 55,
    agent: "Sara Nair",
    source: "Cold Call",
    priority: "Medium",
    daysToClose: 45,
    comments: [
      { id: 1, author: "Sara Nair", avatar: "SN", date: "2026-03-18T11:00:00", text: "Had a good first call. They are evaluating two other vendors." },
    ],
  },
  {
    id: 3,
    name: "Meera Raghavan",
    company: "Skyline Ventures",
    email: "meera@skylinev.com",
    phone: "+91 94440 67890",
    value: 1500000,
    status: "Qualified",
    progress: 82,
    agent: "John Doe",
    source: "Website",
    priority: "High",
    daysToClose: 15,
    comments: [
      { id: 1, author: "John Doe", avatar: "JD", date: "2026-03-15T10:00:00", text: "Demo completed. Very positive response. Sending proposal today." },
      { id: 2, author: "John Doe", avatar: "JD", date: "2026-03-22T09:00:00", text: "Proposal sent. Awaiting sign-off from their finance team." },
    ],
  },
  {
    id: 4,
    name: "Rohit Desai",
    company: "Bluewave Labs",
    email: "rohit@bluewave.co",
    phone: "+91 91234 11111",
    value: 300000,
    status: "New",
    progress: 10,
    agent: "Amit Singh",
    source: "LinkedIn",
    priority: "Low",
    daysToClose: 60,
    comments: [],
  },
  {
    id: 5,
    name: "Sneha Pillai",
    company: "Zenith Corp",
    email: "sneha@zenith.com",
    phone: "+91 99887 22222",
    value: 650000,
    status: "Contacted",
    progress: 40,
    agent: "Sara Nair",
    source: "Event",
    priority: "Medium",
    daysToClose: 30,
    comments: [
      { id: 1, author: "Sara Nair", avatar: "SN", date: "2026-03-19T16:45:00", text: "Met at Bangalore SaaS Summit. Very interested. Will send brochure." },
    ],
  },
];

export const NAV_ITEMS = [
  { label: "Dashboard", icon: "👥", badge: 11 },
  { label: "Leads", icon: "👥", badge: 10 },
  { label: "Sales", icon: "📈", badge: 3 },
  { label: "Agents", icon: "🧑‍💼", badge: null },
  { label: "Reports", icon: "📊", badge: null },
  { label: "Settings", icon: "⚙️", badge: null },
];

export const STATUS_SUMMARY = [
  { status: "New", count: 5, trend: "+12%", up: true },
  { status: "Contacted", count: 3, trend: "+5%", up: true },
  { status: "Qualified", count: 2, trend: "-2%", up: false },
];

export const FILTERS = ["All", "New", "Contacted", "Qualified", "Closed"];

export const AGENTS  = ["John Doe", "Sara Nair", "Amit Singh", "Riya Kumar"];
export const SOURCES = ["Referral", "Cold Call", "Website", "LinkedIn", "Event"];
export const STATUSES   = ["New", "Contacted", "Qualified", "Closed"];
export const PRIORITIES = ["Low", "Medium", "High"];
