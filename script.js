// ===== Mobile menu =====
const hamburger = document.getElementById("hamburger");
const drawer = document.getElementById("drawer");

function setDrawer(open) {
  drawer.classList.toggle("is-open", open);
  drawer.setAttribute("aria-hidden", String(!open));
  hamburger.setAttribute("aria-expanded", String(open));
}

hamburger?.addEventListener("click", () => {
  const isOpen = drawer.classList.contains("is-open");
  setDrawer(!isOpen);
});

// メニュークリックで閉じる
drawer?.addEventListener("click", (e) => {
  const a = e.target.closest("a");
  if (!a) return;
  setDrawer(false);
});

// ===== Slider =====
const slider = document.getElementById("slider");
const slides = Array.from(document.querySelectorAll(".slide"));
const prev = document.getElementById("prev");
const next = document.getElementById("next");
const dots = document.getElementById("dots");

let idx = 0;
let timer = null;
const intervalMs = 6000;

function renderDots() {
  if (!dots) return;
  dots.innerHTML = "";
  slides.forEach((_, i) => {
    const b = document.createElement("button");
    b.className = "dot" + (i === idx ? " is-active" : "");
    b.setAttribute("aria-label", `Go to slide ${i + 1}`);
    b.addEventListener("click", () => go(i));
    dots.appendChild(b);
  });
}

function show(i) {
  slides.forEach((s) => s.classList.remove("is-active"));
  slides[i].classList.add("is-active");
  idx = i;
  renderDots();
}

function go(i) {
  const n = (i + slides.length) % slides.length;
  show(n);
  restart();
}

function restart() {
  if (timer) clearInterval(timer);
  timer = setInterval(() => go(idx + 1), intervalMs);
}

prev?.addEventListener("click", () => go(idx - 1));
next?.addEventListener("click", () => go(idx + 1));

// スライダーに触ってる間は止めたいならこのへんも足せる
slider?.addEventListener("mouseenter", () => timer && clearInterval(timer));
slider?.addEventListener("mouseleave", () => restart());

show(0);
restart();

// ===== Footer year =====
const year = document.getElementById("year");
if (year) year.textContent = String(new Date().getFullYear());
