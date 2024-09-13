import { OpenAPI } from "../client";

const initializeApp = () => {
  // Setting base URL for all API requests
  OpenAPI.BASE = import.meta.env.VITE_API_URL;
  OpenAPI.TOKEN = async () => {
    return localStorage.getItem("access_token") || "";
  };

  if (!import.meta.env.NODE_ENV || import.meta.env.NODE_ENV === "development") {
    // dev code
  } else {
    // Prod build code
    // Removing console.log from prod
    console.log = () => {};

    // init analytics here
  }
};

export default initializeApp;
