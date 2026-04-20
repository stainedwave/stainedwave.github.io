if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

window.addEventListener('beforeunload', () => {
  sessionStorage.setItem('scrollPos', window.scrollY);
});

window.addEventListener('pageshow', (e) => {
  if (location.hash) return;

  const navEntry = performance.getEntriesByType('navigation')[0];
  const isReload = navEntry?.type === 'reload';

  if (isReload) {
    const saved = sessionStorage.getItem('scrollPos');
    if (saved !== null) {
      const pos = parseInt(saved);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        document.documentElement.style.scrollBehavior = 'auto';
        window.scrollTo({ top: pos, left: 0, behavior: 'instant' });
        document.documentElement.style.scrollBehavior = '';
      }));
    }
  } else if (!e.persisted) {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }

  sessionStorage.removeItem('scrollPos');
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

  // ----- HANAMIZU YouTube Integration -----
  loadHanamizuVideos();

  // ----- VOICE Form -----
  initVoiceForm();
});

// YouTube Data API Configuration
const YOUTUBE_CONFIG = {
  API_KEY: 'AIzaSyC8o4l_Xm12sIyZCMtAKWbQ0m8KXAaew70',
  CHANNEL_HANDLE: '@hanamizugroup',
  MAX_RESULTS: 3
};

async function loadHanamizuVideos() {
  const container = document.getElementById('hanamizu-videos');
  if (!container) return;

  // APIキーが設定されていない場合
  if (YOUTUBE_CONFIG.API_KEY === 'YOUR_YOUTUBE_API_KEY') {
    container.innerHTML = `
      <div class="youtube-error">
        <p>YouTube APIキーを設定してください</p>
        <p style="font-size: 11px; margin-top: 8px;">script.js の YOUTUBE_CONFIG.API_KEY を編集</p>
      </div>
    `;
    return;
  }

  try {
    // Step 1: Get channel ID from handle
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forHandle=${YOUTUBE_CONFIG.CHANNEL_HANDLE}&key=${YOUTUBE_CONFIG.API_KEY}`
    );
    const channelData = await channelResponse.json();

    if (!channelData.items || channelData.items.length === 0) {
      throw new Error('Channel not found');
    }

    const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;

    // Step 2: Get latest videos from uploads playlist
    const videosResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=${YOUTUBE_CONFIG.MAX_RESULTS}&key=${YOUTUBE_CONFIG.API_KEY}`
    );
    const videosData = await videosResponse.json();

    if (!videosData.items || videosData.items.length === 0) {
      container.innerHTML = '<div class="youtube-error">動画が見つかりませんでした</div>';
      return;
    }

    // Step 3: Render videos (XSS対策: textContent使用)
    container.innerHTML = '';
    videosData.items.forEach(item => {
      const video = item.snippet;
      const videoId = video.resourceId.videoId;
      const thumbnail = video.thumbnails.high?.url || video.thumbnails.medium?.url || video.thumbnails.default?.url;
      const title = video.title;
      const publishedAt = new Date(video.publishedAt).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const article = document.createElement('article');
      article.className = 'youtube-card';

      const link = document.createElement('a');
      link.href = `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';

      const thumbDiv = document.createElement('div');
      thumbDiv.className = 'youtube-thumb';

      const img = document.createElement('img');
      img.src = thumbnail;
      img.alt = title;
      img.loading = 'lazy';

      const playDiv = document.createElement('div');
      playDiv.className = 'youtube-play';

      thumbDiv.appendChild(img);
      thumbDiv.appendChild(playDiv);

      const bodyDiv = document.createElement('div');
      bodyDiv.className = 'youtube-card-body';

      const h4 = document.createElement('h4');
      h4.textContent = title;

      const dateP = document.createElement('p');
      dateP.className = 'youtube-date';
      dateP.textContent = publishedAt;

      bodyDiv.appendChild(h4);
      bodyDiv.appendChild(dateP);

      link.appendChild(thumbDiv);
      link.appendChild(bodyDiv);
      article.appendChild(link);
      container.appendChild(article);
    });

  } catch (error) {
    console.error('YouTube API Error:', error);
    // XSS対策: textContent使用
    const errorDiv = document.createElement('div');
    errorDiv.className = 'youtube-error';

    const p1 = document.createElement('p');
    p1.textContent = '動画の読み込みに失敗しました';

    const p2 = document.createElement('p');
    p2.style.cssText = 'font-size: 11px; margin-top: 8px;';
    p2.textContent = error.message;

    errorDiv.appendChild(p1);
    errorDiv.appendChild(p2);
    container.innerHTML = '';
    container.appendChild(errorDiv);
  }
}

// VOICE Form Handler
function initVoiceForm() {
  const form = document.getElementById('voice-form');
  const messageInput = document.getElementById('voice-message');
  const charCurrent = document.getElementById('voice-char-current');
  const successDiv = document.getElementById('voice-success');

  if (!form || !messageInput || !charCurrent) return;

  // Character count
  messageInput.addEventListener('input', () => {
    const len = messageInput.value.length;
    if (charCurrent) charCurrent.textContent = len;
  });

  // Form submit
  form.addEventListener('submit', (e) => {
    const message = messageInput.value.trim();
    if (!message) {
      e.preventDefault();
      return;
    }

    // Show success message after short delay
    setTimeout(() => {
      form.style.display = 'none';
      successDiv.style.display = 'block';

      // Reset and show form again after 3 seconds
      setTimeout(() => {
        form.reset();
        charCurrent.textContent = '0';
        successDiv.style.display = 'none';
        form.style.display = 'flex';
      }, 3000);
    }, 500);
  });
}
