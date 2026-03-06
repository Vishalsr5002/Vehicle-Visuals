export const apiParameters = {

  catalog: [
    { label: "Login ID", name: "login", required: true },
    { label: "Password", name: "password", required: true },
    { label: "API Key", name: "apiKey", required: true },
    { label: "Module Name", name: "moduleName" },
    { label: "Method Name", name: "methodName" },
    { label: "Language", name: "lang" },
    { label: "Animation Type", name: "animationType" },
    { label: "Brand", name: "brand" }
  ],

  display: [
    { label: "Login ID", name: "login", required: true },
    { label: "Password", name: "password", required: true },
    { label: "API Key", name: "apiKey", required: true },
    { label: "Part ID", name: "partId", required: true },
    { label: "RO Number", name: "roNumber" },
    { label: "Is Interactive", name: "interactive" },
    { label: "Language", name: "lang" },
    { label: "Brand", name: "brand" },
    { label: "Show Left SideBar", name: "showSidebar" },
    { label: "Show Menu", name: "showMenu" },
    { label: "AutoPlay", name: "autoplay" },
    { label: "Show Menus", name: "showMenus" },
    { label: "Video Only", name: "videoOnly" }
  ],

  links: [
    { label: "Login ID", name: "login", required: true },
    { label: "Password", name: "password", required: true },
    { label: "API Key", name: "apiKey", required: true },
    { label: "Part ID", name: "partId", required: true },
    { label: "RO Number", name: "roNumber" },
    { label: "Module Name", name: "moduleName", required: true },
    { label: "Method Name", name: "methodName", required: true },
    { label: "Language", name: "lang" },
    { label: "Brand", name: "brand" },
    { label: "Expiring Date (YYYY-MM-DD)", name: "expiryDate" },
  ],

  videoDetails: [
    { label: "Login ID", name: "login", required: true },
    { label: "Password", name: "password", required: true },
    { label: "API Key", name: "apiKey", required: true },
    { label: "Part ID", name: "partId", required: true },
    { label: "Module Name", name: "moduleName", required: true },
    { label: "Method Name", name: "methodName", required: true },
    { label: "Language", name: "lang" },
    { label: "Brand", name: "brand", required: true },
    { label: "Diversed", name: "diversed" }
  ],

  search: [
    { label: "API Key", name: "apiKey", required: true },
    { label: "Module Name", name: "moduleName", required: true },
    { label: "Method Name", name: "methodName", required: true },
    { label: "Term", name: "term", required: true },
    { label: "Language", name: "lang", required: true },
    { label: "Brand", name: "brand" },
    { label: "Video Type", name: "videoType" }
  ],

  share: [
    { label: "API Key", name: "apiKey", required: true },
    { label: "Module Name", name: "moduleName", required: true },
    { label: "Method Name", name: "methodName", required: true },
    { label: "Part ID", name: "partId", required: true },
    { label: "Language", name: "lang", required: true },
    { label: "Brand", name: "brand" },
    { label: "Diversed", name: "diversed" },
    { label: "Job ID", name: "jobId" },
    { label: "Reference ID", name: "referenceId" },
    { label: "Cost", name: "cost" },
    { label: "Track Type", name: "trackType" },
    { label: "Show Part Id", name: "showPartId" },
    { label: "cc", name: "cc" }
  ],

    update: [
    { label: "API Key", name: "apiKey", required: true },
    { label: "Module Name", name: "moduleName", required: true },
    { label: "Method Name", name: "methodName", required: true },
    { label: "Unique Id", name: "uniqueId", required: true },
    { label: "Job ID", name: "jobId" },
    { label: "Reference ID", name: "referenceId" },
    { label: "Track Type", name: "trackType" },
    { label: "Cost", name: "cost" }
    ],

    usage: [
    { label: "API Key", name: "apiKey", required: true },
    { label: "Module Name", name: "moduleName", required: true },
    { label: "Method Name", name: "methodName", required: true },
    { label: "Job ID", name: "jobId" }
    ],

    viewed: [
    { label: "API Key", name: "apiKey", required: true },
    { label: "Module Name", name: "moduleName", required: true },
    { label: "Method Name", name: "methodName", required: true },
    { label: "Date From (YYYY-MM-DD)", name: "dateFrom" },
    { label: "Date To (YYYY-MM-DD)", name: "dateTo" },
    { label: "Unique Id", name: "uniqueId"}
    ],

    generateLoop: [
    { label: "Login ID", name: "login", required: true },
    { label: "Password", name: "password", required: true },
    { label: "Mute", name: "mute" }
    ],

    autoLogin: [
    { label: "Login ID", name: "login", required: true },
    { label: "Password", name: "password", required: true },
    { label: "Language", name: "lang" }
    ],

    emailAnimation: [
    { label: "API Key", name: "apiKey", required: true },
    { label: "Module Name", name: "moduleName", required: true },
    { label: "Part ID", name: "partId", required: true }
    ]
};