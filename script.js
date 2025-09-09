/* =============================
   Small, accessible JS features
   ============================= */

// 1) Typing animation for the brand title
const typingTarget = document.getElementById("typing-text");
const typingText = "M. Logeshwari";
const typingSpeed = 100; // ms per letter
let i = 0;
(function typeWriter() {
  if (!typingTarget) return;
  if (i < typingText.length) {
    typingTarget.textContent += typingText.charAt(i);
    i++;
    setTimeout(typeWriter, typingSpeed);
  }
})();

// 2) Theme toggle (Blue + Black Light Theme)
//    - Persists user choice in localStorage
//    - Defaults to light theme for better readability
const THEME_KEY = "logeshwari-theme";
const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");

function setTheme(theme) {
  root.setAttribute("data-theme", theme);
  if (themeToggle) {
    themeToggle.textContent = theme === "light" ? "🌙" : "☀️"; // icon
    themeToggle.setAttribute("aria-pressed", theme === "dark");
  }
  localStorage.setItem(THEME_KEY, theme);
}

// Initialize theme (respect saved preference or system, fallback to light)
(function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "dark" || saved === "light") {
    setTheme(saved);
  } else {
    const systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(systemDark ? "dark" : "light");
  }
})();

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const current = root.getAttribute("data-theme") || "light";
    setTheme(current === "light" ? "dark" : "light");
  });
}

// 3) Mobile navigation toggle
const menuToggle = document.getElementById("menuToggle");
const navList = document.getElementById("navList");
if (menuToggle && navList) {
  menuToggle.addEventListener("click", () => {
    navList.classList.toggle("open");
  });
  // Close menu when a link is clicked (mobile UX)
  navList.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navList.classList.remove('open')));
}

// 4) Active link highlighting while scrolling
const sections = document.querySelectorAll("section[id]");
const links = document.querySelectorAll(".nav-list a");
const linkById = new Map([...links].map(a => [a.getAttribute('href').slice(1), a]));

function onScroll() {
  let currentId = null;
  sections.forEach(sec => {
    const rect = sec.getBoundingClientRect();
    if (rect.top <= 120 && rect.bottom >= 120) {
      currentId = sec.id;
    }
  });
  links.forEach(a => a.classList.remove('active'));
  if (currentId && linkById.has(currentId)) {
    linkById.get(currentId).classList.add('active');
  }
}

document.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('load', onScroll);

// 5) Footer year auto-update
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// 6) Contact form validation + fake submit (no backend)
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');

function validateEmail(email) {
  // Basic email regex; good enough for client-side UX
  return /\S+@\S+\.\S+/.test(email);
}

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = String(data.get('name')||'').trim();
    const email = String(data.get('email')||'').trim();
    const message = String(data.get('message')||'').trim();

    if (!name || !email || !message) {
      status.textContent = 'Please fill in all fields.';
      return;
    }
    if (!validateEmail(email)) {
      status.textContent = 'Please enter a valid email address.';
      return;
    }

    // Simulated submit
    status.textContent = 'Sending…';
    setTimeout(() => {
      status.textContent = 'Thank you! Your message has been sent (demo).';
      form.reset();
    }, 600);
  });
}