export const apiParameters = {
  
  catalog: [
    { label: "Login ID", name: "login", required: true, placeholder: "Enter motovisuals" },
    { label: "Password", name: "password", required: true, placeholder: "Enter motovisuals" },
    { label: "API Key", name: "apiKey", required: true, placeholder: "tg2zw99gwqb5" },
    { label: "Module Name", name: "moduleName", required: true, placeholder: "animation" },
    { label: "Method Name", name: "methodName", required: true, placeholder: "displayAnimation" },
    { label: "Language", name: "lang", placeholder: "en_US/fr_FR" },
    { label: "Animation Type", name: "animationType", placeholder: "1/0" },
    { label: "Brand", name: "brand", placeholder: "VV" }
  ],
  
  display: [
    { label: "Login ID", name: "login", required: true, placeholder: "Enter motovisuals" },
    { label: "Password", name: "password", required: true, placeholder: "Enter motovisuals" },
    { label: "API Key", name: "apiKey", required: true, placeholder: "tg2zw99gwqb5" },
    { label: "Part ID", name: "partId", required: true, placeholder: "7011" },
    { label: "RO Number", name: "roNumber", placeholder: "Enter RO Number" },
    { label: "Is Interactive", name: "is_interactive", placeholder: "1/0" },
    { label: "Language", name: "lang", placeholder: "en_US/fr_FR" },
    { label: "Brand", name: "brand", placeholder: "VV" },
    { label: "Show Left SideBar", name: "showSidebar" },
    { label: "Show Menu", name: "showMenu" },
    { label: "AutoPlay", name: "autoplay", placeholder: "1/0" },
    { label: "Show Menus", name: "showMenus" },
    { label: "Video Only", name: "videoOnly" }
  ],
  
  links: [
    { label: "Login ID", name: "login", required: true, placeholder: "motovisuals" },
    { label: "Password", name: "password", required: true, placeholder: "motovisuals" },
    { label: "API Key", name: "apiKey", required: true, placeholder: "tg2zw99gwqb5" },
    { label: "Part ID", name: "partId", required: true, placeholder: "7011" },
    { label: "RO Number", name: "roNumber", placeholder: "Enter RO Number" },
    { label: "Module Name", name: "moduleName", required: true, placeholder: "animation" },
    { label: "Method Name", name: "methodName", required: true, placeholder: "getDynamicGeneratedUrl" },
    { label: "Language", name: "lang", placeholder: "en_US/fr_FR" },
    { label: "Brand", name: "brand", placeholder: "VV" },
    { label: "Expiring Date (YYYY-MM-DD)", name: "expiryDate", placeholder: "Eg: 2026-06-02" },
  ],
  
  videoDetails: [
    { label: "Login ID", name: "login", required: true, placeholder: "motovisuals" },
    { label: "Password", name: "password", required: true, placeholder: "motovisuals" },
    { label: "API Key", name: "apiKey", required: true, placeholder: "tg2zw99gwqb5" },
    { label: "Part ID", name: "partId", required: true, placeholder: "7011" },
    { label: "Module Name", name: "moduleName", required: true, placeholder: "animation" },
    { label: "Method Name", name: "methodName", required: true, placeholder: "getVideoDetails" },
    { label: "Language", name: "lang", placeholder: "en_US/fr_FR" },
    { label: "Brand", name: "brand", required: true, placeholder: "VV" },
    { label: "Diverside", name: "driverside", placeholder: "LHD/RHD" }
  ],
  
  search: [
    { label: "API Key", name: "apiKey", required: true, placeholder: "tg2zw99gwqb5" },
    { label: "Module Name", name: "moduleName", required: true, placeholder: "animation" },
    { label: "Method Name", name: "methodName", required: true, placeholder: "searchAnimation" },
    //{ label: "Term", name: "term", required: true },
    { label: "Language", name: "lang", required: true, placeholder: "en_US/fr_FR" },
    { label: "Brand", name: "brand", placeholder: "VV" },
    { label: "Video Type", name: "videoType", placeholder: "Interactive/Narrated" }
  ],
  
  share: [
    { label: "API Key", name: "apiKey", required: true, placeholder: "tg2zw99gwqb5" },
    { label: "Module Name", name: "moduleName", required: true, placeholder: "animation" },
    { label: "Method Name", name: "methodName", required: true, placeholder: "getStreamingLink" },
    { label: "Part ID", name: "partId", required: true, placeholder: "7011" },
    { label: "Language", name: "lang", required: true, placeholder: "en_US/fr_FR" },
    { label: "Brand", name: "brand", placeholder: "VV" },
    { label: "Diverside", name: "diverside", placeholder: "LHD/RHD" },
    { label: "Job ID", name: "jobId", placeholder: "Any Numeric Number" },
    { label: "Reference ID", name: "referenceId", placeholder: "Any Numeric Number" },
    { label: "Cost", name: "cost", placeholder: "Any Numeric Number" },
    { label: "Track Type", name: "trackType", placeholder: "email/text" },
    { label: "Show Part Id", name: "showPartId" },
    { label: "cc", name: "cc", placeholder: "0/1" }
  ],
  
  update: [
    { label: "API Key", name: "apiKey", required: true, placeholder: "tg2zw99gwqb5" },
    { label: "Module Name", name: "moduleName", required: true, placeholder: "animation" },
    { label: "Method Name", name: "methodName", required: true, placeholder: "updateAnimationLink" },
    { label: "Unique Id", name: "uniqueId", required: true, placeholder: "UniqueID Generated from Animation Share Link"},
    { label: "Job ID", name: "jobId" },
    { label: "Reference ID", name: "referenceId" },
    { label: "Track Type", name: "trackType" },
    { label: "Cost", name: "cost" }
    ],
    
    usage: [
    { label: "API Key", name: "apiKey", required: true, placeholder: "tg2zw99gwqb5" },
    { label: "Module Name", name: "moduleName", required: true, placeholder: "animation" },
    { label: "Method Name", name: "methodName", required: true, placeholder: "getAnimationLinkUsage" },
    { label: "Job ID", name: "jobId", placeholder: "tg2zw99gwqb5" }
    ],
    
    viewed: [
    { label: "API Key", name: "apiKey", required: true, placeholder: "tg2zw99gwqb5" },
    { label: "Module Name", name: "moduleName", required: true, placeholder: "animation" },
    { label: "Method Name", name: "methodName", required: true, placeholder: "getUsageReport" },
    { label: "Date From (YYYY-MM-DD)", name: "dateFrom", placeholder: "Eg: 2024-01-01" },
    { label: "Date To (YYYY-MM-DD)", name: "dateTo", placeholder: "Eg: 2024-01-03" },
    { label: "Unique Id", name: "uniqueId", placeholder: "UniqueID Generated from Animation Share Link"}
    ],
    
    generateLoop: [
    { label: "Login ID", name: "login", required: true, placeholder: "motovisuals" },
    { label: "Password", name: "password", required: true, placeholder: "motovisuals" },
    { label: "Mute", name: "mute", placeholder: "1-on/0-off" }
    ],
    
    autoLogin: [
    { label: "Login ID", name: "login", required: true, placeholder: "motovisuals" },
    { label: "Password", name: "password", required: true, placeholder: "motovisuals" },
    { label: "Language", name: "lang", placeholder: "en_US" }
    ],
    
    emailAnimation: [
    { label: "API Key", name: "apiKey", required: true, placeholder: "tg2zw99gwqb5" },
    { label: "Module Name", name: "moduleName", required: true, placeholder: "emainAnimation" },
    { label: "Part ID", name: "partId", required: true, placeholder: "7011" }
    ],
    
    auto: [
      { label: "UserName", name: "username", required: true, placeholder: "motovisuals" },
      { label: "Password", name: "password", required: true, placeholder: "motovisuals" },
      { label: "API Key", name: "apiKey", required: true, placeholder: "tg2zw99gwqb5" },
      { label: "Language", name: "lang", placeholder: "en_US" },
      { label: "Flash", name: "flash" }
    ],
    
    lookup: [
      { label: "API Key", name: "apiKey", required: true, placeholder: "tg2zw99gwqb5" },
      { label: "Module Name", name: "moduleName", required: true, placeholder: "animation" },
      { label: "Method Name", name: "methodName", required: true, placeholder: "getSiteUrl" }
    ],
    
    prompt: [
      { label: "API Key", name: "apiKey", required: true, placeholder: "tg2zw99gwqb5" },
      { label: "Module Name", name: "moduleName", required: true, placeholder: "animation" },
      { label: "Method Name", name: "methodName", required: true, placeholder: "getUpgradeUserContentData" }
    ],
    
    lite: [
      { label: "API Key", name: "apiKey", required: true, placeholder: "tg2zw99gwqb5" },
      { label: "Module Name", name: "moduleName", required: true, placeholder: "animation" },
      { label: "Method Name", name: "methodName", required: true, placeholder: "upgradeLiteUser" }
    ],
    
    pdf: [
      { label: "API Key", name: "apiKey", required: true, placeholder: "tg2zw99gwqb5" },
      { label: "Module Name", name: "moduleName", required: true, placeholder: "animation" },
      { label: "Method Name", name: "methodName", required: true, placeholder: "generatePDF" },
      { label: "Part ID", name: "partId", required: true, placeholder: "7011" },
      { label: "Language", name: "lang", placeholder: "en_US" },
      { label: "Brand", name: "brand", placeholder: "VV" },
      { label: "Diverside", name: "diverside", placeholder: "LHD/RHD" }
    ],
    
    get: [
      { label: "UserName", name: "username", required: true, placeholder: "motovisuals" },
      { label: "Password", name: "password", required: true, placeholder: "motovisuals" },
      { label: "Module Name", name: "moduleName", placeholder: "animation" },
      { label: "Method Name", name: "methodName", placeholder: "getApiKey" }
    ],
    
    preference: [
      { label: "UserName", name: "username", required: true, placeholder: "motovisuals" },
      { label: "Password", name: "password", required: true, placeholder: "motovisuals" },
      { label: "API Key", name: "apiKey", required: true, placeholder: "tg2zw99gwqb5" },
      { label: "Module Name", name: "moduleName", required: true, placeholder: "animation" },
      { label: "Method Name", name: "methodName", required: true, placeholder: "getUserPreferences" },
      { label: "Language", name: "lang", placeholder: "en_US" }
    ],
    
    details: [
      { label: "UserName", name: "username", required: true, placeholder: "motovisuals" },
      { label: "Password", name: "password", required: true, placeholder: "motovisuals" },
      { label: "Part ID", name: "partID", required: true, placeholder: "7011" },
      { label: "Module Name", name: "moduleName", required: true, placeholder: "animation" },
      { label: "Method Name", name: "methodName", required: true, placeholder: "getUserDetails" },
      { label: "Website Url", name: "websiteurl", placeholder: "https://example.com" }
    ]
};
