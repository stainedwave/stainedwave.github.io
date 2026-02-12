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

  // ----- HANAMIZU YouTube Integration -----
  loadHanamizuVideos();
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

    // Step 3: Render videos
    container.innerHTML = videosData.items.map(item => {
      const video = item.snippet;
      const videoId = video.resourceId.videoId;
      const thumbnail = video.thumbnails.high?.url || video.thumbnails.medium?.url || video.thumbnails.default?.url;
      const title = video.title;
      const publishedAt = new Date(video.publishedAt).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      return `
        <article class="youtube-card">
          <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank" rel="noopener noreferrer">
            <div class="youtube-thumb">
              <img src="${thumbnail}" alt="${title}" loading="lazy">
              <div class="youtube-play"></div>
            </div>
            <div class="youtube-card-body">
              <h4>${title}</h4>
              <p class="youtube-date">${publishedAt}</p>
            </div>
          </a>
        </article>
      `;
    }).join('');

  } catch (error) {
    console.error('YouTube API Error:', error);
    container.innerHTML = `
      <div class="youtube-error">
        <p>動画の読み込みに失敗しました</p>
        <p style="font-size: 11px; margin-top: 8px;">${error.message}</p>
      </div>
    `;
  }
}
