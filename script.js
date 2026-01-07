if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);


(() => {
  // ----- Mobile menu -----
  const hamburger = document.getElementById("hamburger");
  const drawer = document.getElementById("drawer");

  const setDrawer = (open) => {
    hamburger?.setAttribute("aria-expanded", String(open));
    drawer?.setAttribute("aria-hidden", String(!open));
    document.body.classList.toggle("is-drawer-open", open);
  };

  hamburger?.addEventListener("click", () => {
    const isOpen = hamburger.getAttribute("aria-expanded") === "true";
    setDrawer(!isOpen);
  });

  drawer?.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (a) setDrawer(false);
  });

  // ----- Slider -----
  const slider = document.getElementById("slider");
  if (!slider) return;

  const slides = Array.from(slider.querySelectorAll(".slide"));
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");
  const dotsWrap = document.getElementById("dots");

  if (slides.length === 0) return;

  let index = Math.max(0, slides.findIndex((s) => s.classList.contains("is-active")));
  if (index === -1) index = 0;

  let timer = null;
  const INTERVAL = 6000;

  const renderDots = () => {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = "";

    slides.forEach((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "dot" + (i === index ? " is-active" : "");
      b.setAttribute("aria-label", `Go to slide ${i + 1}`);
      b.addEventListener("click", () => goTo(i, true));
      dotsWrap.appendChild(b);
    });
  };

  const setActive = (next) => {
    slides.forEach((s, i) => s.classList.toggle("is-active", i === next));
    index = next;

    if (dotsWrap) {
      const dots = Array.from(dotsWrap.querySelectorAll(".dot"));
      dots.forEach((d, i) => d.classList.toggle("is-active", i === index));
    }
  };

  const goTo = (next, userAction = false) => {
    const n = ((next % slides.length) + slides.length) % slides.length;
    setActive(n);
    if (userAction) restart();
  };

  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  const start = () => {
    stop();
    timer = window.setInterval(next, INTERVAL);
  };

  const stop = () => {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  };

  const restart = () => {
    start();
  };

  nextBtn?.addEventListener("click", () => goTo(index + 1, true));
  prevBtn?.addEventListener("click", () => goTo(index - 1, true));

  // hoverで止めたいなら有効化
  slider.addEventListener("mouseenter", stop);
  slider.addEventListener("mouseleave", start);

  renderDots();
  setActive(index);
  start();
})();
