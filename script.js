if ('scrollRestoration' in history) {
  history.scrollRestoration = 'auto';
}

window.addEventListener('pageshow', (e) => {
  if (e.persisted) return;
  if (location.hash) return;
  requestAnimationFrame(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  });
});

// すべてのHTML要素が読み込まれてから実行されるようにガードします
document.addEventListener("DOMContentLoaded", () => {
  
  // ----- Mobile menu -----
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

  // ハンバーガーが存在する場合のみイベントを登録
  if (hamburger) {
    hamburger.addEventListener("click", (e) => {
      e.stopPropagation(); // クリックイベントの伝播を防ぐ
      const isOpen = drawer?.classList.contains("is-open");
      setDrawer(!isOpen);
    });
  }

  // ドロワーの外側やリンクをクリックした時に閉じる
  drawer?.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (a) setDrawer(false);
  });
});
