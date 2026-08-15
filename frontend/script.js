// =============================================================
// DATA
// Shaped like documents you'd get back from GET /api/projects
// once the MongoDB backend exists — swap the array for a fetch
// call later without touching the render logic below.
// =============================================================
const PROJECTS = [
  {
    title: "Multi-Agent Career Assistant",
    year: "In Progress-2026",
    description: "An AI-powered career assistant designed to help students explore career paths, improve their skills through multiple specialized AI agents.",
    layers: ["Frontend", "Python", "MongoDB"],
    architectureUrl: "https://github.com/sumanth0244/AI-Career-Assistant/blob/main/README.md",
  },
  {
    title: "Smart AI Interview System",
    year: "2025",
    description: "An AI powered interview platform designed to provide an accessible and interactive interview experience for visually impaired users.",
    layers: ["Frontend","Python", "FireBase"],
    codeUrl: "https://github.com/Sidhu1909/projecthackethon",
    
  },
  {
    title: "Travel Website",
    year: "2024",
    description: "A responsive travel website designed to help users explore destinations and access useful travel informations through a simple interface.",
    layers: ["HTML5", "CSS3","JavaScript"],
    overviewUrl: "https://github.com/sumanth0244/Travel_Website/blob/main/README.md",
  },
  {
    title: "Hackathons and Competitions",
    //year: "2023",
    description: "Participated in technical hackathons, coding competitions, and problem-solving events to gain hands on experience and collaborate on real-world challenges",
    layers: [],
    highlighturl: "https://www.linkedin.com/in/sumanth-bhandary-bb5347329/",
  }
];

// =============================================================
// RENDER PROJECTS
// =============================================================
function renderProjects(projects){
  const grid = document.getElementById("projects");
  if (!grid) return;

  grid.innerHTML = projects.map(p => `
    <article class="project-card">
      <div class="project-card__top">
        <h3>${escapeHTML(p.title)}</h3>
        <span class="project-card__year">${escapeHTML(p.year)}</span>
      </div>
      <p>${escapeHTML(p.description)}</p>
      <div class="project-card__layers">
        ${p.layers.map(l => `<span>${escapeHTML(l)}</span>`).join("")}
      </div>



      <!--${p.liveUrl || p.codeUrl ? `
        <div class="project-card_links">
        ${p.liveUrl ? `<a href="${p.liveUrl}" target="_blank" rel="noopener">Live ↗</a>`:""}
        ${p.codeUrl ? `<a href="${p.codeUrl}" target="_blank" rel="noopener">Code ↗</a>`:""}
       </div>
       `:""}-->

     ${p.liveUrl ? `
      <div class="project-card__links">
        <a href="${p.liveUrl}" target="_blank" rel="noopener">Live ↗</a>
      </div>
      `:""}

     ${p.codeUrl ? `
      <div class="project-card__links">
        <a href="${p.codeUrl}" target="_blank" rel="noopener">Code ↗</a>
      </div>
      `:""}

      ${p.architectureUrl ? `
        <div class="project-card__links">
        <a href="${p.architectureUrl}" target="_blank" rel="noopener">Architecture ↗</a>
      </div>
      `:""}

      ${p.overviewUrl ? `
        <div class="project-card__links">
        <a href="${p.overviewUrl}" target="_blank" rel="noopener">Overview ↗</a>
      </div>
      `:""}

      ${p.highlighturl ? `
        <div class="project-card__links">
        <a href="${p.highlighturl}" target="_blank" rel="noopener">Highlights ↗</a>
      </div>
      `:""}

    </article>
  `).join("");

}

function escapeHTML(str){
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// =============================================================
// NAV: mobile toggle + scroll spy
// =============================================================
function setupNav(){
  const toggle = document.getElementById("navToggle");
  const mobile = document.getElementById("navMobile");

  toggle?.addEventListener("click", () => {
    const isOpen = mobile.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  mobile?.querySelectorAll("a").forEach(a =>
    a.addEventListener("click", () => {
      mobile.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );

  const navLinks = document.querySelectorAll("[data-nav]");
  const sections = [...navLinks]
    .map(link => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (!sections.length) return;

  const spy = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = "#" + entry.target.id;
      navLinks.forEach(link => {
        link.classList.toggle("is-active", link.getAttribute("href") === id);
      });
    });
  }, { rootMargin: "-45% 0px -50% 0px" });

  sections.forEach(section => spy.observe(section));
}

// =============================================================
// HERO DIAGRAM: light up each layer as a pulse travels down it
// =============================================================
function setupStackDiagram(){
  const svg = document.getElementById("stackSvg");
  const pulse = document.getElementById("stackPulse");
  if (!svg || !pulse) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const layers = [...svg.querySelectorAll(".stack-svg__layer")];
  const stops = [16, 128, 240]; // y-position of each layer's top edge

  if (prefersReduced){
    layers.forEach(l => l.classList.add("is-lit"));
    pulse.setAttribute("cy", 276);
    return;
  }

  let started = false;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started){
        started = true;
        runPulse();
      }
    });
  }, { threshold: 0.4 });
  observer.observe(svg);

  function runPulse(){
    let i = 0;
    lightLayer(i);

    function lightLayer(index){
      const layer = layers[index];
      const targetY = stops[index] + 36; // middle of the layer band
      animateTo(targetY, () => {
        layer.classList.add("is-lit");
        if (index < layers.length - 1){
          setTimeout(() => lightLayer(index + 1), 300);
        }
      });
    }

    function animateTo(targetY, done){
      const startY = parseFloat(pulse.getAttribute("cy"));
      const duration = 500;
      const startTime = performance.now();

      function step(now){
        const t = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        pulse.setAttribute("cy", startY + (targetY - startY) * eased);
        if (t < 1) requestAnimationFrame(step);
        else done();
      }
      requestAnimationFrame(step);
    }
  }
}

// =============================================================
// CONTACT FORM
// Validates client-side, then POSTs to /api/contact.
// Until that endpoint exists, the catch block below shows
// a friendly message instead of a network error.
// =============================================================
function setupContactForm(){
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  const submitBtn = document.getElementById("submitBtn");
  if (!form) return;

  const rules = {
    name: v => v.trim().length > 0 || "Enter your name.",
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Enter a valid email.",
    message: v => v.trim().length >= 10 || "Message should be at least 10 characters."
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.textContent = "";
    status.className = "contact__status";

    const data = Object.fromEntries(new FormData(form).entries());
    let valid = true;

    Object.entries(rules).forEach(([field, check]) => {
      const result = check(data[field] || "");
      const fieldEl = form.querySelector(`[name="${field}"]`).closest(".field");
      const errorEl = form.querySelector(`[data-error-for="${field}"]`);
      if (result !== true){
        valid = false;
        fieldEl.classList.add("has-error");
        errorEl.textContent = result;
      } else {
        fieldEl.classList.remove("has-error");
        errorEl.textContent = "";
      }
    });

    if (!valid) return;

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";

    try {
      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error("Request failed");

      status.textContent = "Thanks — your message is in. I'll reply soon.";
      status.classList.add("is-success");
      form.reset();
    } catch (err) {
      // No backend wired up yet — this is expected until /api/contact exists.
      status.textContent = "Message ready — connect the backend to send it, or email me directly below.";
      status.classList.add("is-error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send message";
    }
  });
}

// =============================================================
// INIT
// =============================================================
document.addEventListener("DOMContentLoaded", () => {
  renderProjects(PROJECTS);
  setupNav();
  setupStackDiagram();
  setupContactForm();
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

fetch("http://localhost:5000")
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));