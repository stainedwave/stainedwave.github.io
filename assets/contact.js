// ハンバーガーメニュー & フォーム送信処理
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const drawer = document.getElementById("drawer");

  const setDrawer = (open) => {
    if (!hamburger || !drawer) return;
    hamburger.setAttribute("aria-expanded", String(open));
    drawer.setAttribute("aria-hidden", String(!open));
    if (open) {
      drawer.classList.add("is-open");
    } else {
      drawer.classList.remove("is-open");
    }
  };

  if (hamburger) {
    hamburger.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = drawer?.classList.contains("is-open");
      setDrawer(!isOpen);
    });
  }

  drawer?.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (a) setDrawer(false);
  });

  // フォーム送信処理
  const form = document.getElementById("contact-form");
  const thankYou = document.getElementById("thank-you");
  const backLink = document.getElementById("back-link");
  const contactHeader = document.querySelector(".contact-header");

  form?.addEventListener("submit", () => {
    setTimeout(() => {
      form.classList.add("is-hidden");
      backLink.classList.add("is-hidden");
      contactHeader.classList.add("is-hidden");
      thankYou.style.display = "block";
    }, 500);
  });
});
