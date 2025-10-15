// src/ts/features/theme/theme.ts
var ThemeManager = class {
  constructor() {
    this.mode = "system";
    this.listeners = /* @__PURE__ */ new Set();
    this.cleanupFns = [];
    this.init();
  }
  init() {
    this.mode = this.loadTheme();
    this.applyTheme();
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.setupUI());
    } else {
      this.setupUI();
    }
    this.watchSystemTheme();
    console.log(`\u{1F3A8} Theme initialized: ${this.mode}`);
  }
  loadTheme() {
    try {
      const saved = localStorage.getItem("theme");
      if (saved === "light" || saved === "dark" || saved === "system") {
        return saved;
      }
    } catch (e) {
      console.warn("Failed to load theme from localStorage");
    }
    return "system";
  }
  saveTheme() {
    try {
      localStorage.setItem("theme", this.mode);
    } catch (e) {
      console.warn("Failed to save theme to localStorage");
    }
  }
  getEffectiveTheme() {
    var _a;
    if (this.mode !== "system") return this.mode;
    if ((_a = window.matchMedia) == null ? void 0 : _a.call(window, "(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  }
  applyTheme() {
    const effective = this.getEffectiveTheme();
    document.documentElement.setAttribute("data-theme", effective);
    this.listeners.forEach((fn) => fn());
  }
  setupUI() {
    const buttons = document.querySelectorAll(".theme-toggle, [data-theme-toggle]");
    buttons.forEach((btn) => {
      this.updateButton(btn);
      const handler = (e) => {
        e.preventDefault();
        this.toggle();
      };
      btn.addEventListener("click", handler);
      this.cleanupFns.push(() => btn.removeEventListener("click", handler));
    });
    console.log(`\u{1F3A8} Theme UI setup: ${buttons.length} toggle button(s)`);
  }
  updateButton(btn) {
    const effective = this.getEffectiveTheme();
    const isDark = effective === "dark";
    btn.setAttribute("aria-pressed", isDark.toString());
    btn.setAttribute("title", isDark ? "Switch to light mode" : "Switch to dark mode");
    const icon = btn.querySelector(".theme-icon");
    if (icon) {
      icon.textContent = isDark ? "\u{1F319}" : "\u2600\uFE0F";
    }
    btn.classList.toggle("active", isDark);
  }
  watchSystemTheme() {
    if (!window.matchMedia) return;
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (this.mode === "system") {
        this.applyTheme();
        document.querySelectorAll(".theme-toggle, [data-theme-toggle]").forEach((btn) => {
          this.updateButton(btn);
        });
      }
    };
    if (query.addEventListener) {
      query.addEventListener("change", handler);
      this.cleanupFns.push(() => query.removeEventListener("change", handler));
    }
  }
  /**
   * Toggle between light and dark (skip system)
   */
  toggle() {
    const current = this.getEffectiveTheme();
    this.mode = current === "light" ? "dark" : "light";
    this.saveTheme();
    this.applyTheme();
    document.querySelectorAll(".theme-toggle, [data-theme-toggle]").forEach((btn) => {
      this.updateButton(btn);
    });
    console.log(`\u{1F3A8} Theme toggled to: ${this.mode}`);
  }
  /**
   * Set specific theme
   */
  setTheme(mode) {
    this.mode = mode;
    this.saveTheme();
    this.applyTheme();
    document.querySelectorAll(".theme-toggle, [data-theme-toggle]").forEach((btn) => {
      this.updateButton(btn);
    });
  }
  /**
   * Get current mode
   */
  getMode() {
    return this.mode;
  }
  /**
   * Get effective theme (resolved system preference)
   */
  getTheme() {
    return this.getEffectiveTheme();
  }
  /**
   * Subscribe to theme changes
   */
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }
  /**
   * Cleanup (for testing)
   */
  destroy() {
    this.cleanupFns.forEach((fn) => fn());
    this.cleanupFns = [];
    this.listeners.clear();
  }
};
var themeManager = new ThemeManager();

// src/ts/features/navigation/navigation.ts
var MobileNavigation = class {
  constructor() {
    this.isOpen = false;
    this.toggle = null;
    this.menu = null;
    this.cleanupFns = [];
    this.scrollY = 0;
    this.init();
  }
  init() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.setup());
    } else {
      this.setup();
    }
  }
  setup() {
    this.toggle = document.querySelector(".nav-toggle, [data-nav-toggle]");
    this.menu = document.querySelector(".nav-mobile, [data-nav-menu]");
    if (!this.toggle || !this.menu) {
      console.log("\u{1F4F1} Navigation elements not found - skipping mobile nav");
      return;
    }
    this.setupToggle();
    this.setupClickOutside();
    this.setupEscapeKey();
    this.setupResponsive();
    console.log("\u{1F4F1} Mobile navigation initialized");
  }
  setupToggle() {
    if (!this.toggle) return;
    this.toggle.setAttribute("aria-expanded", "false");
    this.toggle.setAttribute("aria-label", "Toggle navigation menu");
    const handler = (e) => {
      e.preventDefault();
      this.toggleMenu();
    };
    this.toggle.addEventListener("click", handler);
    this.cleanupFns.push(() => {
      var _a;
      return (_a = this.toggle) == null ? void 0 : _a.removeEventListener("click", handler);
    });
  }
  setupClickOutside() {
    const handler = (e) => {
      var _a, _b;
      if (!this.isOpen) return;
      const target = e.target;
      const isInMenu = (_a = this.menu) == null ? void 0 : _a.contains(target);
      const isInToggle = (_b = this.toggle) == null ? void 0 : _b.contains(target);
      if (!isInMenu && !isInToggle) {
        this.close();
      }
    };
    document.addEventListener("click", handler);
    this.cleanupFns.push(() => document.removeEventListener("click", handler));
  }
  setupEscapeKey() {
    const handler = (e) => {
      if (e.key === "Escape" && this.isOpen) {
        this.close();
      }
    };
    document.addEventListener("keydown", handler);
    this.cleanupFns.push(() => document.removeEventListener("keydown", handler));
  }
  setupResponsive() {
    let timeoutId;
    const handler = () => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        if (window.innerWidth > 768 && this.isOpen) {
          this.close();
        }
      }, 150);
    };
    window.addEventListener("resize", handler);
    this.cleanupFns.push(() => {
      window.removeEventListener("resize", handler);
      clearTimeout(timeoutId);
    });
  }
  toggleMenu() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }
  open() {
    if (!this.toggle || !this.menu) return;
    this.isOpen = true;
    this.toggle.classList.add("active");
    this.toggle.setAttribute("aria-expanded", "true");
    this.menu.classList.add("active", "is-open");
    this.scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${this.scrollY}px`;
    document.body.style.width = "100%";
    document.body.classList.add("nav-open");
    console.log("\u{1F4F1} Menu opened");
  }
  close() {
    if (!this.toggle || !this.menu) return;
    this.isOpen = false;
    this.toggle.classList.remove("active");
    this.toggle.setAttribute("aria-expanded", "false");
    this.menu.classList.remove("active", "is-open");
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
    document.body.classList.remove("nav-open");
    window.scrollTo(0, this.scrollY);
    console.log("\u{1F4F1} Menu closed");
  }
  /**
   * Cleanup (for testing)
   */
  destroy() {
    this.close();
    this.cleanupFns.forEach((fn) => fn());
    this.cleanupFns = [];
  }
};
var mobileNav = new MobileNavigation();

// src/ts/features/copy-code/copy-code.ts
var CopyCode = class {
  constructor() {
    this.cleanupFns = [];
    this.init();
  }
  init() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.setup());
    } else {
      this.setup();
    }
  }
  setup() {
    const codeBlocks = document.querySelectorAll("pre code");
    if (codeBlocks.length === 0) {
      console.log("\u{1F4CB} No code blocks found");
      return;
    }
    codeBlocks.forEach((code) => {
      const pre = code.parentElement;
      if (!pre || pre.classList.contains("has-copy-button")) return;
      pre.classList.add("has-copy-button");
      pre.style.position = "relative";
      const button = this.createButton();
      pre.appendChild(button);
      const handler = () => this.copy(code.textContent || "", button);
      button.addEventListener("click", handler);
      this.cleanupFns.push(() => button.removeEventListener("click", handler));
    });
    console.log(`\u{1F4CB} Copy buttons added to ${codeBlocks.length} code blocks`);
  }
  createButton() {
    const button = document.createElement("button");
    button.className = "copy-button";
    button.type = "button";
    button.textContent = "Copy";
    button.setAttribute("aria-label", "Copy code to clipboard");
    return button;
  }
  async copy(text, button) {
    if (!text.trim()) return;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      const originalText = button.textContent;
      button.textContent = "Copied!";
      button.classList.add("copied");
      setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove("copied");
      }, 2e3);
    } catch (err) {
      console.error("Copy failed:", err);
      button.textContent = "Failed";
      button.classList.add("error");
      setTimeout(() => {
        button.textContent = "Copy";
        button.classList.remove("error");
      }, 2e3);
    }
  }
  /**
   * Cleanup (for testing)
   */
  destroy() {
    this.cleanupFns.forEach((fn) => fn());
    this.cleanupFns = [];
    document.querySelectorAll(".copy-button").forEach((btn) => btn.remove());
    document.querySelectorAll(".has-copy-button").forEach((pre) => {
      pre.classList.remove("has-copy-button");
    });
  }
};
var copyCode = new CopyCode();

// src/ts/features/toc/toc.ts
var TableOfContents = class {
  constructor() {
    this.container = null;
    this.headings = [];
    this.cleanupFns = [];
    this.init();
  }
  init() {
    if (!document.body.classList.contains("post") && !document.querySelector(".post-content")) {
      console.log("\u{1F4DA} Not a post page - skipping TOC");
      return;
    }
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.setup());
    } else {
      this.setup();
    }
  }
  setup() {
    this.container = document.querySelector("#toc, [data-toc]");
    if (!this.container) {
      console.log("\u{1F4DA} TOC container not found - skipping");
      return;
    }
    const content = document.querySelector(".post-content, article");
    if (!content) return;
    this.headings = Array.from(content.querySelectorAll("h2, h3, h4"));
    if (this.headings.length === 0) {
      console.log("\u{1F4DA} No headings found");
      return;
    }
    this.generateTOC();
    this.setupScrollSpy();
    console.log(`\u{1F4DA} TOC generated with ${this.headings.length} headings`);
  }
  generateTOC() {
    if (!this.container) return;
    const nav = document.createElement("nav");
    nav.className = "toc";
    nav.setAttribute("aria-label", "Table of contents");
    const title = document.createElement("h2");
    title.className = "toc-title";
    title.textContent = "Table of Contents";
    nav.appendChild(title);
    const list = document.createElement("ul");
    list.className = "toc-list";
    this.headings.forEach((heading, index) => {
      if (!heading.id) {
        heading.id = `heading-${index}`;
      }
      const item = document.createElement("li");
      item.className = `toc-item toc-${heading.tagName.toLowerCase()}`;
      const link = document.createElement("a");
      link.href = `#${heading.id}`;
      link.className = "toc-link";
      link.textContent = heading.textContent || "";
      link.setAttribute("data-heading-id", heading.id);
      const handler = (e) => {
        e.preventDefault();
        heading.scrollIntoView({ behavior: "smooth", block: "start" });
        history.pushState(null, "", `#${heading.id}`);
        this.updateActive(heading.id);
      };
      link.addEventListener("click", handler);
      this.cleanupFns.push(() => link.removeEventListener("click", handler));
      item.appendChild(link);
      list.appendChild(item);
    });
    nav.appendChild(list);
    this.container.appendChild(nav);
  }
  setupScrollSpy() {
    let ticking = false;
    const handler = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          this.highlightActive();
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handler);
    this.cleanupFns.push(() => window.removeEventListener("scroll", handler));
    setTimeout(() => this.highlightActive(), 100);
  }
  highlightActive() {
    let activeHeading = null;
    const scrollPos = window.scrollY + 100;
    for (const heading of this.headings) {
      if (heading.offsetTop <= scrollPos) {
        activeHeading = heading;
      } else {
        break;
      }
    }
    if (activeHeading) {
      this.updateActive(activeHeading.id);
    }
  }
  updateActive(headingId) {
    var _a, _b;
    (_a = this.container) == null ? void 0 : _a.querySelectorAll(".toc-link").forEach((link) => {
      link.classList.remove("active");
    });
    const activeLink = (_b = this.container) == null ? void 0 : _b.querySelector(`[data-heading-id="${headingId}"]`);
    if (activeLink) {
      activeLink.classList.add("active");
    }
  }
  /**
   * Cleanup (for testing)
   */
  destroy() {
    this.cleanupFns.forEach((fn) => fn());
    this.cleanupFns = [];
    if (this.container) {
      this.container.innerHTML = "";
    }
  }
};
var toc = new TableOfContents();

// src/ts/main.ts
document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("js-loaded");
  document.body.classList.remove("js-loading");
  console.log("\u2705 All features loaded");
});
console.log("\u{1F680} Jekyll blog frontend initialized");
//# sourceMappingURL=main.js.map
