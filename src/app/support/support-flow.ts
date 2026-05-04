export type SupportStatus = "Open" | "In Progress" | "Resolved" | "On Hold";
export type SupportPriority = "Urgent" | "High" | "Medium" | "Low";
export type SupportCategory =
  | "All Tickets"
  | "Technical"
  | "Payment"
  | "Course Access"
  | "Onboarding";
export type SupportView = "tickets" | "chat";
export type SupportDetailMode = "activity" | "execution";
export type ReplyMode = "public" | "internal";

export type TicketAttachment = {
  id: string;
  name: string;
  size?: string;
  type: "image" | "sheet" | "document";
};

export type TicketActivity = {
  id: string;
  author: string;
  timestamp: string;
  badge: string;
  tone: "requester" | "internal" | "agent";
  body: string[];
  attachment?: TicketAttachment;
};

export type ExecutionStep = {
  id: string;
  title: string;
  description: string;
  state: "current" | "pending" | "complete";
  timestamp?: string;
};

export type SupportTicket = {
  id: string;
  ticketNumber: string;
  caseCode: string;
  title: string;
  from: string;
  requesterName: string;
  requesterRole: string;
  requesterAvatar: string;
  requesterTone: string;
  category: Exclude<SupportCategory, "All Tickets">;
  priority: SupportPriority;
  status: SupportStatus;
  lastUpdated: string;
  assignedAgent: string;
  summary: string;
  submittedBy: string;
  environment: string;
  environmentMeta: string;
  identity: string;
  identityMeta: string;
  slaDeadline: string;
  tags: string[];
  technicalDetails: {
    ipAddress: string;
    sessionId: string;
    orgCode: string;
    language: string;
  };
  requesterHealth: {
    score: string;
    statement: string;
    relatedTo: string;
  };
  description: string[];
  attachments: TicketAttachment[];
  detailMode: SupportDetailMode;
  activity: TicketActivity[];
  executionTimeline: ExecutionStep[];
};

export type LiveChatMessage = {
  id: string;
  sender: "assistant" | "requester";
  body: string;
  timestamp: string;
  attachment?: TicketAttachment;
};

export type LiveChatThread = {
  id: string;
  participant: string;
  avatarTone: string;
  lastSeen: string;
  preview: string;
  badge: string;
  unread: boolean;
  caseCode: string;
  messages: LiveChatMessage[];
};

export const supportAgents = [
  "Mark Thompson",
  "Marcus Vance",
  "Elena Rossi",
  "Julian Thorne",
];

export const supportMetrics = [
  {
    label: "Open Tickets",
    value: "128",
    note: "+5.2%",
    noteClassName: "bg-[#e8fbf0] text-[#14a467]",
    accentClassName: "bg-[#f0ebff] text-[#6b43ff]",
  },
  {
    label: "Pending Schools",
    value: "14",
    note: "-5%",
    noteClassName: "bg-[#fff0f2] text-[#ef4b6a]",
    accentClassName: "bg-[#eef8f1] text-[#2d8a59]",
  },
  {
    label: "Avg. Response Time",
    value: "2h 15m",
    note: "-10%",
    noteClassName: "bg-[#fff0f2] text-[#ef4b6a]",
    accentClassName: "bg-[#eef4ff] text-[#3567ff]",
  },
  {
    label: "Satisfaction Score",
    value: "4.8",
    suffix: "/5",
    note: "+2%",
    noteClassName: "bg-[#e8fbf0] text-[#14a467]",
    accentClassName: "bg-[#f3ebff] text-[#45304e]",
  },
];

export const initialSupportTickets: SupportTicket[] = [
  {
    id: "tk-8942",
    ticketNumber: "#TK-8942",
    caseCode: "CASE #EDU-2024-8842",
    title: "Student Grades Sync Timeout Error",
    from: "Greenwood Academy",
    requesterName: "Sarah Jenkins",
    requesterRole: "Requester",
    requesterAvatar: "SJ",
    requesterTone: "bg-[#efe4ff] text-[#6f44ff]",
    category: "Technical",
    priority: "Urgent",
    status: "Open",
    lastUpdated: "12 mins ago",
    assignedAgent: "Mark Thompson",
    summary:
      "Difficulty observed while pushing Q1 student grades to the LMS. Sync request times out after several seconds.",
    submittedBy: "Greenfield Academy",
    environment: "macOS v14.2.1",
    environmentMeta: "Chrome 122.0.X",
    identity: "Portal ID: EP-9921-X",
    identityMeta: "Chrome 122.0.x",
    slaDeadline: "2h 14m remaining",
    tags: ["LMS_SYNC", "GRADEBOOK"],
    technicalDetails: {
      ipAddress: "192.168.1.45",
      sessionId: "sess_44921xX",
      orgCode: "OAK_HS_TX",
      language: "en-US",
    },
    requesterHealth: {
      score: "4.8",
      statement: "Sarah has opened 12 tickets in the last 30 days.",
      relatedTo: "Integration Sync",
    },
    description: [
      "I am unable to sync the student grades for the Q1 \"Advanced Algebra\" course.",
      "Every time I click the 'Push to LMS' button, it spins for 10 seconds and then gives a \"Timeout Exception\" error. This is critical as the deadline is tomorrow.",
    ],
    attachments: [{ id: "error-log", name: "error_log.png", type: "image" }],
    detailMode: "activity",
    activity: [
      {
        id: "a1",
        author: "Sarah Jenkins",
        timestamp: "yesterday at 4:32 PM",
        badge: "REQUESTER",
        tone: "requester",
        body: [
          "I am unable to sync the student grades for the Q1 \"Advanced Algebra\" course. Every time I click the 'Push to LMS' button, it spins for 10 seconds and then gives a \"Timeout Exception\" error.",
          "This is critical as the deadline is tomorrow.",
        ],
        attachment: { id: "log-one", name: "error_log.png", type: "image" },
      },
      {
        id: "a2",
        author: "Mark Thompson",
        timestamp: "today at 9:15 AM",
        badge: "INTERNAL NOTE",
        tone: "internal",
        body: [
          "Checking the server logs for school OAK-122. Looks like a database deadlock on the grades export table.",
          "Notifying the DevOps team. @DevTeam - can we look at the transaction isolation levels for this school?",
        ],
      },
      {
        id: "a3",
        author: "Mark Thompson",
        timestamp: "today at 10:45 AM",
        badge: "SUPPORT AGENT",
        tone: "agent",
        body: [
          "Hello Sarah, thank you for bringing this to our attention. Our engineering team has identified a sync conflict in your account.",
          "We are currently applying a manual patch to the \"Advanced Algebra\" section. You should see the grades sync correctly within the next hour.",
        ],
      },
    ],
    executionTimeline: [
      {
        id: "e1",
        title: "Analysis & Testing",
        description: "LMS Engineering Team is validating patch #492.",
        state: "current",
      },
      {
        id: "e2",
        title: "Deployment",
        description: "Patch queued for the affected tenant.",
        state: "pending",
      },
      {
        id: "e3",
        title: "Final Verification",
        description: "Post-deployment grade sync confirmation.",
        state: "pending",
      },
      {
        id: "e4",
        title: "Ticket Initiated",
        description: "Initial school report received.",
        state: "complete",
        timestamp: "Oct 24, 08:00 AM",
      },
    ],
  },
  {
    id: "tk-8943",
    ticketNumber: "#TK-8943",
    caseCode: "CASE #EDU-2024-8843",
    title: "Batch LMS Enrollment Synchronization Error",
    from: "Sarah Jenkins",
    requesterName: "Greenfield Academy",
    requesterRole: "Oakwood school Admin",
    requesterAvatar: "GA",
    requesterTone: "bg-[#eaf7df] text-[#486f2b]",
    category: "Technical",
    priority: "High",
    status: "In Progress",
    lastUpdated: "12 mins ago",
    assignedAgent: "Marcus Vance",
    summary:
      "Difficulty observed during the bulk import of 2nd Quarter Student Data from SIS to the LMS platform.",
    submittedBy: "Greenfield Academy",
    environment: "Windows 11",
    environmentMeta: "Edge 122.0",
    identity: "Portal ID: SIS-1013-TX",
    identityMeta: "SIS Connector v4.2",
    slaDeadline: "5h 08m remaining",
    tags: ["ENROLLMENT", "CSV_IMPORT"],
    technicalDetails: {
      ipAddress: "192.168.1.45",
      sessionId: "sess_66491cK",
      orgCode: "GRN_FLD_TX",
      language: "en-US",
    },
    requesterHealth: {
      score: "4.2",
      statement: "Greenfield Academy has logged 8 cases this semester.",
      relatedTo: "Enrollment Imports",
    },
    description: [
      "I am unable to sync the student grades for the Q1 \"Advanced Algebra\" course. Every time I click the 'Push to LMS' button, it spins for 10 seconds and then gives a \"Timeout Exception\" error.",
      "This is critical as the deadline is tomorrow.",
    ],
    attachments: [
      { id: "error-log-2", name: "error_log.png", type: "image" },
      { id: "source-file", name: "SOURCE_ENROLLMENT_Q2.CSV", size: "(1.2 MB)", type: "sheet" },
    ],
    detailMode: "execution",
    activity: [],
    executionTimeline: [
      {
        id: "x1",
        title: "Analysis & Testing",
        description: "LMS Engineering Team is validating patch #492.",
        state: "current",
      },
      {
        id: "x2",
        title: "Deployment",
        description: "Patch will be applied after validation.",
        state: "pending",
      },
      {
        id: "x3",
        title: "Final Verification",
        description: "Cross-check import records with SIS output.",
        state: "pending",
      },
      {
        id: "x4",
        title: "Ticket Initiated",
        description: "Bulk enrollment import error logged by school admin.",
        state: "complete",
        timestamp: "Oct 24, 08:00 AM",
      },
    ],
  },
  {
    id: "tk-8944",
    ticketNumber: "#TK-8944",
    caseCode: "CASE #EDU-2024-8844",
    title: "Course Thumbnail Not Updating",
    from: "Emerald High School",
    requesterName: "Emerald High School",
    requesterRole: "Curriculum Admin",
    requesterAvatar: "EH",
    requesterTone: "bg-[#eaf7df] text-[#486f2b]",
    category: "Technical",
    priority: "Low",
    status: "Resolved",
    lastUpdated: "12 mins ago",
    assignedAgent: "Elena Rossi",
    summary: "Thumbnail cache retained outdated artwork after course metadata update.",
    submittedBy: "Emerald High School",
    environment: "macOS v14.1",
    environmentMeta: "Safari 17.2",
    identity: "Portal ID: ART-2201",
    identityMeta: "CMS Node 7",
    slaDeadline: "Resolved",
    tags: ["CATALOG", "MEDIA"],
    technicalDetails: {
      ipAddress: "192.168.1.62",
      sessionId: "sess_1137xaQ",
      orgCode: "EMR_HS_TX",
      language: "en-US",
    },
    requesterHealth: {
      score: "4.9",
      statement: "Emerald High School rarely opens requests.",
      relatedTo: "Media Library",
    },
    description: ["Resolved by clearing the tenant cache and regenerating the course asset bundle."],
    attachments: [],
    detailMode: "activity",
    activity: [],
    executionTimeline: [],
  },
  {
    id: "tk-8945",
    ticketNumber: "#TK-8945",
    caseCode: "CASE #EDU-2024-8845",
    title: "Parent Access Reset Request",
    from: "Oakland Private School",
    requesterName: "Oakland Private School",
    requesterRole: "Operations Desk",
    requesterAvatar: "OP",
    requesterTone: "bg-[#e9f1ff] text-[#3567ff]",
    category: "Onboarding",
    priority: "Medium",
    status: "Open",
    lastUpdated: "12 mins ago",
    assignedAgent: "Julian Thorne",
    summary: "Multiple parent accounts require onboarding link regeneration after SSO migration.",
    submittedBy: "Oakland Private School",
    environment: "Windows 11",
    environmentMeta: "Chrome 121.0",
    identity: "Portal ID: OPS-4481",
    identityMeta: "SSO Migration Batch",
    slaDeadline: "9h 20m remaining",
    tags: ["ONBOARDING", "SSO"],
    technicalDetails: {
      ipAddress: "192.168.4.42",
      sessionId: "sess_99244bd",
      orgCode: "OAK_PS_TX",
      language: "en-US",
    },
    requesterHealth: {
      score: "4.7",
      statement: "Oakland Private School has stable support usage.",
      relatedTo: "Parent Access",
    },
    description: ["The onboarding emails were not received after the parent directory sync was completed."],
    attachments: [],
    detailMode: "activity",
    activity: [],
    executionTimeline: [],
  },
];

export const initialLiveChatThreads: LiveChatThread[] = [
  {
    id: "chat-1",
    participant: "Sarah Jenkins",
    avatarTone: "bg-[#efe4ff] text-[#6f44ff]",
    lastSeen: "yesterday at 4:32 PM",
    preview: "I am unable to sync the student...",
    badge: "CASE #EDU-2024-8842",
    unread: true,
    caseCode: "CASE #EDU-2024-8842",
    messages: [
      {
        id: "m1",
        sender: "assistant",
        body: "Hi, Ada, just a reminder that our zonal meeting is scheduled for this Saturday at 10 AM. Hope you can make it.",
        timestamp: "May 25, 2025, 11:44am",
      },
      {
        id: "m2",
        sender: "requester",
        body: "Thanks, Chairman! Yes, I’ll be there. Will the meeting link be shared here?",
        timestamp: "May 25, 2025, 11:44am",
      },
      {
        id: "m3",
        sender: "assistant",
        body: "Yes, I’ll drop the link here by Friday evening. Also, don’t forget to review the agenda shared earlier this weekend for this Saturday at 10 AM. Hope you can make it.",
        timestamp: "May 25, 2025, 11:44am",
        attachment: { id: "pdf-1", name: "Order of meeting.pdf", size: "1.2 MB", type: "document" },
      },
      {
        id: "m4",
        sender: "requester",
        body: "Got it. I’ve gone through it. Looking forward to the discussion on dues restructuring.",
        timestamp: "May 25, 2025, 11:44am",
      },
      {
        id: "m5",
        sender: "assistant",
        body: "Perfect. See you then!",
        timestamp: "May 25, 2025, 11:44am",
      },
    ],
  },
  {
    id: "chat-2",
    participant: "Greenfield Academy",
    avatarTone: "bg-[#eaf7df] text-[#486f2b]",
    lastSeen: "15 min ago",
    preview: "I am unable to sync the student...",
    badge: "CASE #EDU-2024-8842",
    unread: true,
    caseCode: "CASE #EDU-2024-8842",
    messages: [],
  },
  {
    id: "chat-3",
    participant: "Greenfield Academy",
    avatarTone: "bg-[#eaf7df] text-[#486f2b]",
    lastSeen: "15 min ago",
    preview: "I am unable to sync the student...",
    badge: "CASE #EDU-2024-8842",
    unread: true,
    caseCode: "CASE #EDU-2024-8842",
    messages: [],
  },
  {
    id: "chat-4",
    participant: "Sarah Jenkins",
    avatarTone: "bg-[#efe4ff] text-[#6f44ff]",
    lastSeen: "yesterday at 4:32 PM",
    preview: "I am unable to sync the student...",
    badge: "CASE #EDU-2024-8842",
    unread: true,
    caseCode: "CASE #EDU-2024-8842",
    messages: [],
  },
];

const supportTicketsStorageKey = "bmi-super-admin-support-tickets";

export function buildSupportHref(view: SupportView = "tickets") {
  return view === "chat" ? "/support/live-chat" : "/support";
}

export function buildSupportTicketHref(ticket: SupportTicket) {
  return ticket.detailMode === "execution"
    ? `/support/${ticket.id}/execution`
    : `/support/${ticket.id}`;
}

export function loadStoredSupportTickets() {
  if (typeof window === "undefined") {
    return initialSupportTickets;
  }

  const storedValue = window.localStorage.getItem(supportTicketsStorageKey);

  if (!storedValue) {
    return initialSupportTickets;
  }

  try {
    const parsedValue = JSON.parse(storedValue);

    if (!Array.isArray(parsedValue)) {
      return initialSupportTickets;
    }

    return parsedValue as SupportTicket[];
  } catch {
    return initialSupportTickets;
  }
}

export function persistSupportTickets(tickets: SupportTicket[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(supportTicketsStorageKey, JSON.stringify(tickets));
}

export function ticketStatusClassName(status: SupportStatus) {
  if (status === "Open") {
    return "text-[#14b96b]";
  }

  if (status === "In Progress") {
    return "text-[#ffb71c]";
  }

  if (status === "Resolved") {
    return "text-[#a4adc7]";
  }

  return "text-[#426d50]";
}

export function ticketPriorityClassName(priority: SupportPriority) {
  if (priority === "Urgent") {
    return "text-[#ff4a4a]";
  }

  if (priority === "High") {
    return "text-[#ff8b12]";
  }

  if (priority === "Medium") {
    return "text-[#4564ff]";
  }

  return "text-[#9caac5]";
}
