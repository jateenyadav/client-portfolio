// ===== Year =====
document.getElementById("year").textContent = new Date().getFullYear();

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ===== Navbar + scroll progress =====
const nav = document.getElementById("nav");
const progress = document.getElementById("scrollProgress");
function onScroll() {
  const y = window.scrollY;
  nav.classList.toggle("scrolled", y > 40);
  const docH = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (docH > 0 ? (y / docH) * 100 : 0) + "%";
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ===== Mobile menu =====
const toggle = document.getElementById("navToggle");
const links = document.getElementById("navLinks");
toggle.addEventListener("click", () => {
  const open = links.classList.toggle("open");
  toggle.classList.toggle("open", open);
});
links.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    links.classList.remove("open");
    toggle.classList.remove("open");
  })
);

// ===== Typewriter =====
const roles = [
  "Full-Funnel Marketing Executive",
  "Campaign Strategy & Execution",
  "Copywriting & Content",
  "SEO, Email & Partnerships",
];
const twEl = document.getElementById("typewriter");
let rIdx = 0, cIdx = 0, deleting = false;
function type() {
  const word = roles[rIdx];
  cIdx += deleting ? -1 : 1;
  twEl.innerHTML = word.slice(0, cIdx) + '<span class="cursor">|</span>';
  let delay = deleting ? 45 : 90;
  if (!deleting && cIdx === word.length) { delay = 1600; deleting = true; }
  else if (deleting && cIdx === 0) { deleting = false; rIdx = (rIdx + 1) % roles.length; delay = 400; }
  setTimeout(type, delay);
}
type();

// ===== Reveal on scroll =====
const revealObserver = new IntersectionObserver(
  (entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); revealObserver.unobserve(e.target); }
  }),
  { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
);
document.querySelectorAll(".reveal, .stagger, .tl-item, .reveal-up, .rm-item").forEach((el) => revealObserver.observe(el));

// ===== Skill bars =====
const barObserver = new IntersectionObserver(
  (entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); barObserver.unobserve(e.target); }
  }),
  { threshold: 0.4 }
);
document.querySelectorAll(".bar").forEach((el) => barObserver.observe(el));

// ===== Count-up stats =====
const fmt = (n) => n.toLocaleString("en-US");
function animateCount(el) {
  const target = parseInt(el.dataset.count, 10);
  const prefix = el.dataset.prefix || "";
  const suffix = el.dataset.suffix || "";
  const dur = 1600, start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / dur, 1);
    const val = Math.floor((1 - Math.pow(1 - p, 3)) * target);
    el.textContent = prefix + fmt(val) + suffix;
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = prefix + fmt(target) + suffix;
  }
  requestAnimationFrame(tick);
}
const countObserver = new IntersectionObserver(
  (entries) => entries.forEach((e) => {
    if (e.isIntersecting) { animateCount(e.target); countObserver.unobserve(e.target); }
  }),
  { threshold: 0.6 }
);
document.querySelectorAll("[data-count]").forEach((el) => countObserver.observe(el));

// ===== 3D portrait tilt + scroll parallax =====
const portrait = document.getElementById("portrait3d");
const heroStage = document.getElementById("heroStage");
let targetRX = 0, targetRY = 0, curRX = 0, curRY = 0;

if (portrait && !reduceMotion) {
  heroStage.addEventListener("mousemove", (e) => {
    const r = heroStage.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    targetRY = px * 18;
    targetRX = -py * 18;
  });
  heroStage.addEventListener("mouseleave", () => { targetRX = 0; targetRY = 0; });

  let scrollShift = 0;
  window.addEventListener("scroll", () => { scrollShift = window.scrollY * 0.05; }, { passive: true });

  (function loop() {
    curRX += (targetRX - curRX) * 0.08;
    curRY += (targetRY - curRY) * 0.08;
    portrait.style.transform =
      `rotateX(${curRX}deg) rotateY(${curRY}deg) translateY(${-scrollShift}px)`;
    requestAnimationFrame(loop);
  })();
}

// ===== Custom cursor =====
const dot = document.getElementById("cursorDot");
const ring = document.getElementById("cursorRing");
if (dot && ring && window.matchMedia("(hover: hover)").matches) {
  let mx = 0, my = 0, rx = 0, ry = 0;
  window.addEventListener("mousemove", (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
  });
  (function ringLoop() {
    rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(ringLoop);
  })();
  document.querySelectorAll("[data-cursor], a, button").forEach((el) => {
    el.addEventListener("mouseenter", () => ring.classList.add("hover"));
    el.addEventListener("mouseleave", () => ring.classList.remove("hover"));
  });
}

// ===== Magnetic buttons =====
if (!reduceMotion && window.matchMedia("(hover: hover)").matches) {
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const r = btn.getBoundingClientRect();
      const mx = e.clientX - r.left - r.width / 2;
      const my = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${mx * 0.3}px, ${my * 0.45}px)`;
    });
    btn.addEventListener("mouseleave", () => { btn.style.transform = ""; });
  });
}

// ===== 3D tilt on cards =====
if (!reduceMotion && window.matchMedia("(hover: hover)").matches) {
  document.querySelectorAll(".tilt").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform =
        `perspective(700px) rotateX(${-py * 9}deg) rotateY(${px * 11}deg) translateY(-6px)`;
    });
    card.addEventListener("mouseleave", () => { card.style.transform = ""; });
  });
}

// ===== Scroll-velocity skew on sliding card rows =====
if (!reduceMotion) {
  const marquees = [...document.querySelectorAll(".marquee")];
  let lastY = window.scrollY, vel = 0, curSkew = 0;
  window.addEventListener("scroll", () => {
    vel = window.scrollY - lastY;
    lastY = window.scrollY;
  }, { passive: true });
  (function skewLoop() {
    const target = Math.max(-8, Math.min(8, vel * 0.3));
    curSkew += (target - curSkew) * 0.1;
    vel *= 0.85;
    marquees.forEach((m) => { m.style.transform = `skewX(${curSkew.toFixed(2)}deg)`; });
    requestAnimationFrame(skewLoop);
  })();
}

// ===== File-stack shuffling deck =====
const deck = document.getElementById("deck");
if (deck) {
  const next = () => {
    const top = deck.querySelector(".deck__card");
    if (!top) return;
    top.classList.add("is-leaving");
    setTimeout(() => {
      top.classList.remove("is-leaving");
      deck.appendChild(top); // send to back; nth-child restacks the rest
    }, 520);
  };
  let timer = setInterval(next, 2600);
  const restart = () => { clearInterval(timer); timer = setInterval(next, 2600); };
  deck.addEventListener("click", () => { next(); restart(); });
  const btn = document.getElementById("deckNext");
  if (btn) btn.addEventListener("click", (e) => { e.stopPropagation(); next(); restart(); });
  deck.addEventListener("mouseenter", () => clearInterval(timer));
  deck.addEventListener("mouseleave", restart);
}

// ===== Contact form (mailto) =====
const form = document.getElementById("contactForm");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const name = encodeURIComponent(data.get("name") || "");
    const email = encodeURIComponent(data.get("email") || "");
    const message = encodeURIComponent(data.get("message") || "");
    const subject = `Portfolio enquiry from ${data.get("name") || "someone"}`;
    const body = `Name: ${data.get("name")}\nEmail: ${data.get("email")}\n\n${data.get("message")}`;
    const note = document.getElementById("formNote");
    if (note) note.hidden = false;
    window.location.href =
      `mailto:tnishkasen@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

// ===== Theme toggle =====
const themeToggle = document.getElementById("themeToggle");
const savedTheme = localStorage.getItem("ts-theme");
if (savedTheme === "pink") document.documentElement.setAttribute("data-theme", "pink");
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const isPink = document.documentElement.getAttribute("data-theme") === "pink";
    if (isPink) {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("ts-theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "pink");
      localStorage.setItem("ts-theme", "pink");
    }
  });
}

// ===== Roadmap progress line =====
const roadmapProgress = document.getElementById("roadmapProgress");
const roadmapLine = document.querySelector(".roadmap__line");
if (roadmapProgress && roadmapLine) {
  const updateRoadmap = () => {
    const r = roadmapLine.getBoundingClientRect();
    const vh = window.innerHeight;
    const total = r.height;
    const passed = Math.min(Math.max(vh * 0.5 - r.top, 0), total);
    roadmapProgress.style.height = passed + "px";
  };
  window.addEventListener("scroll", updateRoadmap, { passive: true });
  window.addEventListener("resize", updateRoadmap);
  updateRoadmap();
}

// ===== Lightbox =====
const lightbox = document.getElementById("lightbox");
if (lightbox) {
  const lbImg = document.getElementById("lightboxImg");
  const lbTitle = document.getElementById("lightboxTitle");
  const lbDetail = document.getElementById("lightboxDetail");
  const lbClose = document.getElementById("lightboxClose");
  const openLightbox = (card) => {
    const img = card.querySelector("img");
    if (!img) return;
    lbImg.src = img.src;
    lbImg.alt = img.alt || "";
    lbTitle.textContent = card.dataset.title || "";
    lbDetail.innerHTML = card.dataset.detail || "";
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };
  const closeLightbox = () => {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };
  document.querySelectorAll("#gallery .card").forEach((card) => {
    card.addEventListener("click", () => openLightbox(card));
  });
  lbClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });
}
