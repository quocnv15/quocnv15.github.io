// src/ts/main.ts
var getAppConfig = () => {
  const script = document.querySelector("#site-config");
  if (script == null ? void 0 : script.textContent) {
    try {
      return JSON.parse(script.textContent);
    } catch (error) {
      console.warn("Failed to parse site config:", error);
    }
  }
  return {
    theme: "system",
    searchEnabled: !!document.querySelector("#search-input"),
    tocEnabled: document.body.classList.contains("post"),
    copyCodeEnabled: !!document.querySelector("pre code"),
    shareButtonsEnabled: !!document.querySelector(".share-links"),
    isPost: document.body.classList.contains("post"),
    isHomePage: document.body.classList.contains("home"),
    environment: "development"
  };
};
var initializeApp = async () => {
  const config = getAppConfig();
  try {
    console.log("\u{1F680} Jekyll TypeScript Frontend Starting...");
    console.log("\u{1F4CA} Config:", config);
    document.body.classList.add("js-enabled");
    document.body.classList.remove("js-loading");
    console.log("\u2705 Jekyll TypeScript frontend initialized successfully (Phase 1 complete)");
  } catch (error) {
    console.error("\u274C Failed to initialize app:", error);
    document.body.classList.add("js-fallback");
    document.body.classList.remove("js-loading");
  }
};
var ready = (callback) => {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback);
  } else {
    callback();
  }
};
ready(() => {
  document.body.classList.add("js-loading");
  initializeApp();
});
export {
  getAppConfig,
  initializeApp
};
//# sourceMappingURL=main.js.map
