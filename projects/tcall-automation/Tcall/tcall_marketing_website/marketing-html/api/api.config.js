// const API_URL = "https://dev.backend.tcall.ai/";

const getApiUrl = () => {
    const currentHost = window.location.origin;
    if (
        currentHost.startsWith("https://www.tcall.ai") || 
        currentHost.startsWith("https://tcall.ai")
    ) {
        return "https://prod.backend.tcall.ai/";
    } else if (currentHost.startsWith("http://dev82.developer24x7.com")) {
        return "https://api.dev.tcall.ai/";
    } else {
        return "https://api.dev.tcall.ai/"; // Default development API
    }
};

const API_URL = getApiUrl();

// Attach to the global window object for browser usage
window.API_URL = API_URL;
  
