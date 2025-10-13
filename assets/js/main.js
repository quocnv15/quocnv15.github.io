// src/ts/modules/utils/dom.ts
var qsSafe = (selector, parent = document) => {
  return parent.querySelector(selector);
};
var qsa = (selector, parent = document) => {
  return parent.querySelectorAll(selector);
};
var create = (tag, attributes, textContent) => {
  const element = document.createElement(tag);
  if (attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }
  if (textContent !== void 0) {
    element.textContent = textContent;
  }
  return element;
};
var ready = (callback) => {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback);
  } else {
    callback();
  }
};
var throttle = (func, limit) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};
var scrollToElement = (element, offset = 0, behavior = "smooth") => {
  const elementPosition = element.getBoundingClientRect().top + window.scrollY;
  const offsetPosition = elementPosition - offset;
  window.scrollTo({
    top: offsetPosition,
    behavior
  });
};
var addEventListener = (element, event, handler, options) => {
  element.addEventListener(event, handler, options);
  return () => {
    element.removeEventListener(event, handler, options);
  };
};

// src/ts/modules/theme.ts
var STORAGE_KEY = "theme";
var THEME_ATTRIBUTE = "data-theme";
var THEME_TRANSITION_DURATION = 300;
var getSystemTheme = () => {
  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
};
var getStoredTheme = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && ["light", "dark", "system"].includes(stored)) {
      return stored;
    }
  } catch (error) {
    console.warn("Failed to read theme from localStorage:", error);
  }
  return "system";
};
var getCurrentTheme = () => {
  const stored = getStoredTheme();
  if (stored === "system") {
    return getSystemTheme();
  }
  return stored;
};
var applyTheme = (theme) => {
  const actualTheme = theme === "system" ? getSystemTheme() : theme;
  document.documentElement.setAttribute(THEME_ATTRIBUTE, actualTheme);
  updateToggleButton(actualTheme);
  document.documentElement.classList.add("theme-transitioning");
  setTimeout(() => {
    document.documentElement.classList.remove("theme-transitioning");
  }, THEME_TRANSITION_DURATION);
  console.log(`\u{1F3A8} Theme applied: ${actualTheme} (stored: ${theme})`);
};
var storeTheme = (theme) => {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch (error) {
    console.warn("Failed to save theme to localStorage:", error);
  }
};
var toggleTheme = () => {
  const current = getCurrentTheme();
  const next = current === "light" ? "dark" : "light";
  const stored = getStoredTheme();
  storeTheme(stored === "system" ? next : "system");
  applyTheme(stored === "system" ? next : "system");
};
var updateToggleButton = (actualTheme) => {
  const toggle = qsSafe(".theme-toggle");
  if (!toggle) return;
  const isActive = actualTheme === "dark";
  toggle.classList.toggle("active", isActive);
  toggle.setAttribute("aria-pressed", isActive.toString());
  const icon = toggle.querySelector(".theme-icon");
  if (icon) {
    icon.textContent = actualTheme === "dark" ? "\u{1F319}" : "\u2600\uFE0F";
  }
  toggle.setAttribute("title", actualTheme === "dark" ? "Switch to light mode" : "Switch to dark mode");
};
var watchSystemTheme = () => {
  if (!window.matchMedia) return;
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const handleChange = () => {
    const stored = getStoredTheme();
    if (stored === "system") {
      applyTheme("system");
    }
  };
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener("change", handleChange);
  } else {
    mediaQuery.addListener(handleChange);
  }
  console.log("\u{1F440} System theme watcher initialized");
};
var createThemeToggleButton = () => {
  const button = document.createElement("button");
  button.className = "theme-toggle";
  button.setAttribute("type", "button");
  button.setAttribute("aria-label", "Toggle dark mode");
  button.setAttribute("title", "Toggle dark mode");
  button.innerHTML = '<span class="theme-icon">\u{1F319}</span>';
  return button;
};
var setupThemeToggleButton = () => {
  const existingButton = qsSafe(".theme-toggle");
  if (existingButton) {
    updateToggleButton(getCurrentTheme());
    return;
  }
  const header = qsSafe(".site-header, header, .site-nav");
  if (!header) {
    console.warn("\u26A0\uFE0F Could not find suitable location for theme toggle button");
    return;
  }
  const button = createThemeToggleButton();
  header.appendChild(button);
  const cleanup = addEventListener(button, "click", (e) => {
    e.preventDefault();
    toggleTheme();
  });
  button._cleanup = cleanup;
  updateToggleButton(getCurrentTheme());
  console.log("\u{1F3A8} Theme toggle button created and added to header");
};
var initTheme = (defaultTheme) => {
  const theme = defaultTheme || getStoredTheme();
  applyTheme(theme);
  watchSystemTheme();
  setupThemeToggleButton();
  console.log(`\u{1F3A8} Theme functionality initialized with mode: ${theme}`);
};

// src/ts/modules/navigation.ts
var MOBILE_BREAKPOINT = 768;
var ANIMATION_DURATION = 300;
var FOCUSABLE_ELEMENTS = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
var isMobile = () => {
  return window.innerWidth <= MOBILE_BREAKPOINT || "ontouchstart" in window || navigator.maxTouchPoints > 0;
};
var toggleBodyScrollLock = (lock) => {
  const body = document.body;
  if (lock) {
    body.classList.add("nav-open");
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.width = "100%";
    body.style.top = `-${window.scrollY}px`;
  } else {
    const scrollY = Math.abs(parseInt(body.style.top || "0", 10));
    body.classList.remove("nav-open");
    body.style.overflow = "";
    body.style.position = "";
    body.style.width = "";
    body.style.top = "";
    window.scrollTo(0, scrollY);
  }
};
var closeMobileMenu = () => {
  const toggle = qsSafe(".nav-toggle");
  const menu = qsSafe(".nav-mobile");
  if (!toggle || !menu) return;
  toggle.classList.remove("active");
  toggle.setAttribute("aria-expanded", "false");
  menu.classList.remove("active");
  toggleBodyScrollLock(false);
  setTimeout(() => {
    toggle.focus();
  }, ANIMATION_DURATION);
  console.log("\u{1F4F1} Mobile menu closed");
};
var openMobileMenu = () => {
  const toggle = qsSafe(".nav-toggle");
  const menu = qsSafe(".nav-mobile");
  if (!toggle || !menu) return;
  toggle.classList.add("active");
  toggle.setAttribute("aria-expanded", "true");
  menu.classList.add("active");
  toggleBodyScrollLock(true);
  setTimeout(() => {
    const firstMenuItem = menu.querySelector(FOCUSABLE_ELEMENTS);
    if (firstMenuItem) {
      firstMenuItem.focus();
    }
  }, 100);
  console.log("\u{1F4F1} Mobile menu opened");
};
var toggleMobileMenu = () => {
  const toggle = qsSafe(".nav-toggle");
  if (!toggle) return;
  const isOpen = toggle.classList.contains("active");
  if (isOpen) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
};
var handleOutsideClick = (event) => {
  const menu = qsSafe(".nav-mobile");
  const toggle = qsSafe(".nav-toggle");
  if (!menu || !toggle) return;
  const target = event.target;
  const isClickInsideMenu = menu.contains(target);
  const isClickOnToggle = toggle.contains(target);
  if (!isClickInsideMenu && !isClickOnToggle) {
    closeMobileMenu();
  }
};
var handleEscapeKey = (event) => {
  if (event.key === "Escape") {
    closeMobileMenu();
  }
};
var setupMobileToggle = () => {
  const toggle = qsSafe(".nav-toggle");
  if (!toggle) {
    console.warn("\u26A0\uFE0F Mobile navigation toggle button not found");
    return;
  }
  toggle.classList.remove("active");
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-controls", "mobile-menu");
  toggle.setAttribute("aria-label", "Toggle navigation menu");
  const cleanup = addEventListener(toggle, "click", (e) => {
    e.preventDefault();
    toggleMobileMenu();
  });
  toggle._cleanup = cleanup;
  console.log("\u{1F4F1} Mobile navigation toggle setup complete");
};
var setupClickOutsideToClose = () => {
  const cleanup = addEventListener(document, "click", handleOutsideClick);
  document._clickOutsideCleanup = cleanup;
  console.log("\u{1F4F1} Click outside to close functionality setup");
};
var setupKeyboardNavigation = () => {
  const menu = qsSafe(".nav-mobile");
  if (!menu) return;
  const keydownHandler = (e) => {
    if (e.key === "Tab") {
      const focusableElements = Array.from(menu.querySelectorAll(FOCUSABLE_ELEMENTS));
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === firstElement && firstElement) {
          e.preventDefault();
          lastElement == null ? void 0 : lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement && lastElement) {
          e.preventDefault();
          firstElement == null ? void 0 : firstElement.focus();
        }
      }
    }
  };
  const cleanup = addEventListener(menu, "keydown", keydownHandler);
  menu._keyboardCleanup = cleanup;
  console.log("\u{1F4F1} Keyboard navigation setup complete");
};
var setupEscapeKeyHandler = () => {
  const cleanup = addEventListener(document, "keydown", handleEscapeKey);
  document._escapeCleanup = cleanup;
  console.log("\u{1F4F1} Escape key handler setup complete");
};
var setupResponsiveBehavior = () => {
  let isCurrentlyMobile = isMobile();
  const handleResize = () => {
    const isNowMobile = isMobile();
    if (!isCurrentlyMobile && isNowMobile) {
      const menu = qsSafe(".nav-mobile");
      if (menu && menu.classList.contains("active")) {
        closeMobileMenu();
      }
    }
    if (isCurrentlyMobile && !isNowMobile) {
      closeMobileMenu();
    }
    isCurrentlyMobile = isNowMobile;
  };
  let resizeTimeout;
  const debouncedResize = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(handleResize, 150);
  };
  const cleanup = addEventListener(window, "resize", debouncedResize);
  window._resizeCleanup = cleanup;
  console.log("\u{1F4F1} Responsive behavior setup complete");
};
var createMobileToggle = () => {
  const button = document.createElement("button");
  button.className = "nav-toggle";
  button.setAttribute("type", "button");
  button.setAttribute("aria-label", "Toggle navigation menu");
  button.setAttribute("aria-controls", "mobile-menu");
  button.setAttribute("aria-expanded", "false");
  button.innerHTML = `
    <span class="hamburger">
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
    </span>
  `;
  return button;
};
var setupMobileMenu = () => {
  const existingMenu = qsSafe(".nav-mobile");
  if (existingMenu) {
    console.log("\u{1F4F1} Mobile menu already exists");
    return;
  }
  const menu = document.createElement("nav");
  menu.className = "nav-mobile";
  menu.setAttribute("id", "mobile-menu");
  menu.setAttribute("role", "navigation");
  menu.setAttribute("aria-label", "Mobile navigation");
  const desktopNav = qsSafe(".site-nav, .nav-links");
  if (desktopNav) {
    const navLinks = desktopNav.cloneNode(true);
    menu.appendChild(navLinks);
  }
  const header = qsSafe(".site-header, header");
  if (header) {
    header.appendChild(menu);
  }
  console.log("\u{1F4F1} Mobile navigation menu created");
};
var initNavigation = () => {
  if (!isMobile()) {
    console.log("\u{1F4F1} Desktop device detected - mobile navigation not initialized");
    return;
  }
  setupMobileMenu();
  let toggle = qsSafe(".nav-toggle");
  if (!toggle) {
    toggle = createMobileToggle();
    const header = qsSafe(".site-header, header");
    if (header) {
      header.appendChild(toggle);
    }
  }
  setupMobileToggle();
  setupClickOutsideToClose();
  setupKeyboardNavigation();
  setupEscapeKeyHandler();
  setupResponsiveBehavior();
  const menu = qsSafe(".nav-mobile");
  if (menu) {
    menu.style.display = "block";
  }
  console.log("\u{1F4F1} Mobile navigation initialized successfully");
};

// src/ts/modules/copy-code.ts
var COPY_BUTTON_CLASS = "copy-button";
var COPY_SUCCESS_CLASS = "copied";
var COPY_ERROR_CLASS = "copy-error";
var COPY_TIMEOUT = 2e3;
var copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "0";
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = "0";
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);
    return successful;
  } catch (error) {
    console.error("Failed to copy text:", error);
    return false;
  }
};
var showCopySuccess = (button) => {
  const originalText = button.textContent || "Copy";
  const originalClasses = button.className;
  button.textContent = "Copied!";
  button.classList.add(COPY_SUCCESS_CLASS);
  setTimeout(() => {
    button.textContent = originalText;
    button.className = originalClasses;
  }, COPY_TIMEOUT);
};
var showCopyError = (button) => {
  const originalText = button.textContent || "Copy";
  const originalClasses = button.className;
  button.textContent = "Failed!";
  button.classList.add(COPY_ERROR_CLASS);
  setTimeout(() => {
    button.textContent = originalText;
    button.className = originalClasses;
  }, COPY_TIMEOUT);
};
var handleCopyClick = async (button, codeBlock) => {
  const code = codeBlock.textContent || "";
  if (!code.trim()) {
    console.warn("No code to copy");
    return;
  }
  button.disabled = true;
  button.style.opacity = "0.6";
  button.style.cursor = "wait";
  try {
    const success = await copyToClipboard(code);
    if (success) {
      showCopySuccess(button);
    } else {
      showCopyError(button);
    }
  } catch (error) {
    console.error("Copy failed:", error);
    showCopyError(button);
  } finally {
    button.disabled = false;
    button.style.opacity = "";
    button.style.cursor = "";
  }
};
var createCopyButton = () => {
  const button = create("button", {
    class: COPY_BUTTON_CLASS,
    type: "button",
    "aria-label": "Copy code to clipboard",
    title: "Copy code",
    "data-clipboard-text": ""
  }, "Copy");
  return button;
};
var setupCopyButton = (codeBlock) => {
  const parent = codeBlock.parentElement;
  if (!parent || parent.classList.contains("has-copy-button")) {
    return;
  }
  const preElement = parent.tagName === "PRE" ? parent : codeBlock.closest("pre");
  if (!preElement) {
    return;
  }
  preElement.classList.add("has-copy-button");
  const button = createCopyButton();
  preElement.style.position = "relative";
  preElement.appendChild(button);
  const cleanup = addEventListener(button, "click", async (e) => {
    e.preventDefault();
    await handleCopyClick(button, codeBlock);
  });
  button._cleanup = cleanup;
  const keyboardHandler = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "c") {
      const activeElement = document.activeElement;
      if (activeElement === codeBlock || codeBlock.contains(activeElement)) {
        e.preventDefault();
        handleCopyClick(button, codeBlock);
      }
    }
  };
  const keydownCleanup = addEventListener(codeBlock, "keydown", keyboardHandler);
  codeBlock._keycleanup = keydownCleanup;
};
var initCopyCode = () => {
  const codeBlocks = Array.from(qsa("pre code, highlight > code, .highlight > pre > code"));
  if (codeBlocks.length === 0) {
    console.log("\u{1F4DD} No code blocks found for copy functionality");
    return;
  }
  codeBlocks.forEach((codeBlock, index) => {
    setupCopyButton(codeBlock);
  });
  console.log(`\u{1F4CB} Copy buttons initialized for ${codeBlocks.length} code blocks`);
};

// src/ts/modules/toc.ts
var TOC_CONTAINER_SELECTOR = "#toc-container";
var TOC_ID_PREFIX = "toc-";
var ACTIVE_CLASS = "toc-active";
var HEADING_SELECTORS = "h2, h3, h4, h5, h6";
var SCROLL_OFFSET = 80;
var THROTTLE_DELAY = 100;
var generateTOC = (headings) => {
  const toc = [];
  const stack = [];
  headings.forEach((heading, index) => {
    var _a, _b, _c, _d;
    const id = `${TOC_ID_PREFIX}${index}`;
    heading.id = id;
    const item = {
      id,
      text: ((_a = heading.textContent) == null ? void 0 : _a.trim()) || `Heading ${index + 1}`,
      level: parseInt(heading.tagName.charAt(1)),
      children: []
    };
    while (stack.length > 0 && ((_c = (_b = stack[stack.length - 1]) == null ? void 0 : _b.level) != null ? _c : 0) >= item.level) {
      stack.pop();
    }
    if (stack.length === 0) {
      toc.push(item);
    } else {
      (_d = stack[stack.length - 1]) == null ? void 0 : _d.children.push(item);
    }
    stack.push(item);
  });
  return toc;
};
var renderTOC = (container, toc) => {
  if (toc.length === 0) {
    container.innerHTML = '<p class="toc-empty">No headings found</p>';
    return;
  }
  const tocElement = create("nav", { class: "toc" });
  const listElement = create("ol", { class: "toc-list" });
  const titleElement = create("h2", { class: "toc-title" }, "Table of Contents");
  tocElement.appendChild(titleElement);
  renderTOCItems(listElement, toc, 0);
  tocElement.appendChild(listElement);
  container.innerHTML = "";
  container.appendChild(tocElement);
};
var renderTOCItems = (parentElement, items, depth) => {
  items.forEach((item, index) => {
    const listItem = create("li", { class: "toc-item" });
    const link = create("a", {
      href: `#${item.id}`,
      class: "toc-link",
      "data-level": item.level.toString()
    }, item.text);
    const linkCleanup = addEventListener(link, "click", (e) => {
      e.preventDefault();
      const targetElement = document.getElementById(item.id);
      if (targetElement) {
        scrollToElement(targetElement, SCROLL_OFFSET);
        updateActiveTOC(item.id);
      }
    });
    listItem.appendChild(link);
    if (item.children.length > 0) {
      const childList = create("ol", { class: `toc-list toc-list-${depth + 1}` });
      renderTOCItems(childList, item.children, depth + 1);
      listItem.appendChild(childList);
    }
    parentElement.appendChild(listItem);
  });
};
var updateActiveTOC = (activeId) => {
  var _a;
  const activeElements = document.querySelectorAll(`.${ACTIVE_CLASS}`);
  activeElements.forEach((el) => el.classList.remove(ACTIVE_CLASS));
  const activeLink = document.querySelector(`a[href="#${activeId}"]`);
  if (activeLink) {
    activeLink.classList.add(ACTIVE_CLASS);
  }
  let currentLink = activeLink;
  while (currentLink) {
    const parentItem = currentLink.closest(".toc-item");
    if (parentItem) {
      const parentLink = parentItem.querySelector(".toc-link");
      if (parentLink) {
        parentLink.classList.add(ACTIVE_CLASS);
      }
    }
    currentLink = (_a = parentItem == null ? void 0 : parentItem.parentElement) == null ? void 0 : _a.closest(".toc-item");
  }
};
var isElementInViewport = (element, offset = 0) => {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  return rect.top <= windowHeight && rect.bottom >= 0 && rect.left >= 0 && rect.right <= (window.innerWidth || document.documentElement.clientWidth) && rect.top <= offset;
};
var getCurrentActiveHeading = () => {
  const headings = qsa(HEADING_SELECTORS);
  for (let i = headings.length - 1; i >= 0; i--) {
    const heading = headings[i];
    if (heading && isElementInViewport(heading, SCROLL_OFFSET)) {
      return heading.id;
    }
  }
  return null;
};
var setupScrollSpy = () => {
  const scrollHandler = throttle(() => {
    const activeId = getCurrentActiveHeading();
    if (activeId) {
      updateActiveTOC(activeId);
    }
  }, THROTTLE_DELAY);
  const cleanup = addEventListener(window, "scroll", scrollHandler);
  window._scrollSpyCleanup = cleanup;
  setTimeout(() => {
    const activeId = getCurrentActiveHeading();
    if (activeId) {
      updateActiveTOC(activeId);
    }
  }, 100);
  console.log("\u{1F4D1} Scroll spy functionality setup");
};
var setupContentObserver = () => {
  const targetNode = document.querySelector(".post-content, .page-content");
  if (!targetNode) return;
  const observer = new MutationObserver(() => {
    setTimeout(() => {
      const headings = Array.from(qsa(HEADING_SELECTORS));
      if (headings.length === 0) return;
      const toc = generateTOC(headings);
      const container = document.querySelector(TOC_CONTAINER_SELECTOR);
      if (container) {
        renderTOC(container, toc);
        setupScrollSpy();
      }
    }, 100);
  });
  observer.observe(targetNode, {
    childList: true,
    subtree: true
  });
  console.log("\u{1F4D1} Content observer setup");
};
var getOrCreateTOCContainer = () => {
  var _a;
  let container = document.querySelector(TOC_CONTAINER_SELECTOR);
  if (container) return container;
  const postContent = document.querySelector(".post-content");
  const pageContent = document.querySelector(".page-content");
  const targetContent = postContent || pageContent;
  if (!targetContent) {
    console.warn("\u26A0\uFE0F Could not find suitable location for TOC");
    return null;
  }
  container = create("div", {
    id: TOC_CONTAINER_SELECTOR.replace("#", ""),
    class: "toc-container"
  });
  const firstParagraph = targetContent.querySelector("p");
  if (firstParagraph) {
    (_a = firstParagraph.parentNode) == null ? void 0 : _a.insertBefore(container, firstParagraph.nextSibling);
  } else {
    targetContent.insertBefore(container, targetContent.firstChild);
  }
  return container;
};
var initTOC = () => {
  console.log("\u{1F4D1} Initializing Table of Contents...");
  const container = getOrCreateTOCContainer();
  if (!container) {
    console.log("\u{1F4D1} No suitable location found for TOC");
    return;
  }
  const headings = Array.from(qsa(HEADING_SELECTORS));
  if (headings.length === 0) {
    console.log("\u{1F4D1} No headings found - TOC not created");
    container.innerHTML = '<p class="toc-empty">No headings found on this page</p>';
    return;
  }
  const toc = generateTOC(headings);
  renderTOC(container, toc);
  setupScrollSpy();
  setupContentObserver();
  console.log(`\u{1F4D1} Table of Contents initialized with ${headings.length} headings`);
};

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
    initTheme(config.theme);
    initNavigation();
    if (config.copyCodeEnabled) {
      await initCopyCode();
    }
    if (config.tocEnabled && config.isPost) {
      await initTOC();
    }
    if (config.searchEnabled) {
      console.log("\u{1F50D} Search functionality not implemented yet");
    }
    if (config.shareButtonsEnabled && config.isPost) {
      console.log("\u{1F4E4} Share buttons not implemented yet");
    }
    document.body.classList.add("js-enabled");
    document.body.classList.remove("js-loading");
    console.log("\u2705 Jekyll TypeScript frontend initialized successfully (Phase 2 complete)");
  } catch (error) {
    console.error("\u274C Failed to initialize app:", error);
    document.body.classList.add("js-fallback");
    document.body.classList.remove("js-loading");
    try {
      initTheme(config.theme);
      initNavigation();
    } catch (fallbackError) {
      console.error("\u274C Even fallback initialization failed:", fallbackError);
    }
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
