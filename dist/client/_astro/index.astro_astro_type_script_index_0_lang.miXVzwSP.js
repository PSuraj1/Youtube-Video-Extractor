const d=document.querySelector("[data-url-input]"),r=document.querySelector("[data-extract-result]"),b=()=>{document.querySelector(".extractor-card").scrollIntoView({behavior:"smooth",block:"center"}),setTimeout(()=>d?.focus(),350)};document.querySelectorAll("[data-paste-link]").forEach(e=>e.addEventListener("click",b));const y=document.querySelector("[data-mobile-menu]"),p=document.querySelector("[data-menu-toggle]");p?.addEventListener("click",()=>{const e=y.classList.toggle("is-open");p.setAttribute("aria-expanded",String(e))});document.querySelectorAll(".mobile-menu a").forEach(e=>e.addEventListener("click",()=>y.classList.remove("is-open")));function g(e){const a=e.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);return a?a[1]:null}function w(e="Fetching video details and preparing direct server download..."){r&&(r.className="extract-result is-visible",r.innerHTML=`
      <div class="extract-loading">
        <div class="spinner"></div>
        <span>${e}</span>
      </div>
    `)}function v(e){r&&(r.className="extract-result is-visible is-error",r.innerHTML=`<div><strong>Unable to process link:</strong> ${e}</div>`)}async function q(e){const a=["https://invidious.f5.si","https://invidious.nerqv.ai","https://vid.puffyan.us","https://invidious.privacydev.net"];for(const o of a)try{const i=new AbortController,m=setTimeout(()=>i.abort(),4e3),n=await fetch(`${o}/api/v1/videos/${e}`,{signal:i.signal});if(clearTimeout(m),n.ok){const s=await n.json();if(s&&(s.formatStreams?.length||s.adaptiveFormats?.length))return s}}catch{}return null}function f(e,a){if(!r)return;const o=a?.title||"YouTube Video",i=a?.author||"YouTube Creator",m=a?.videoThumbnails?.find(t=>t.quality==="high")?.url||`https://i.ytimg.com/vi/${e}/hqdefault.jpg`,n=`https://www.youtube.com/watch?v=${e}`,s=o.replace(/[^\w\s-]/gi,"").replace(/\s+/g,"_"),l=[];a?.formatStreams&&a.formatStreams.forEach(t=>{t.url&&l.push({quality:t.qualityLabel||"720p",ext:t.container||"mp4",url:t.url})}),a?.adaptiveFormats&&a.adaptiveFormats.forEach(t=>{t.url&&t.type?.includes("video/mp4")&&t.qualityLabel&&(l.some(u=>u.quality===t.qualityLabel)||l.push({quality:t.qualityLabel,ext:"mp4",url:t.url}))}),l.length===0&&l.push({quality:"1080p Full HD",ext:"mp4",url:""},{quality:"720p HD",ext:"mp4",url:""},{quality:"480p SD",ext:"mp4",url:""},{quality:"360p Mobile",ext:"mp4",url:""});const c=[];a?.adaptiveFormats&&a.adaptiveFormats.forEach(t=>{if(t.url&&t.type?.includes("audio")){const u=t.bitrate?Math.round(t.bitrate/1e3)+" kbps":"Audio Track";c.some(h=>h.quality===u)||c.push({quality:u,ext:t.container||"m4a",url:t.url})}}),c.length===0&&c.push({quality:"320 kbps High Quality",ext:"mp3",url:""},{quality:"128 kbps Standard",ext:"mp3",url:""}),r.className="extract-result is-visible",r.innerHTML=`
      <div class="result-header">
        <img class="result-thumb" src="${m}" alt="${o}" />
        <div class="result-info">
          <h3 class="result-title">${o}</h3>
          <p class="result-author">By ${i}</p>
        </div>
      </div>

      <div class="format-heading">
        <span>🎬 Video Downloads (MP4)</span>
        <small style="color: #10b981; font-weight: 700;">⚡ 100% Direct Server Stream</small>
      </div>
      <div class="formats-grid">
        ${l.slice(0,4).map(t=>`
          <div class="format-card">
            <div class="format-meta">
              <span class="format-quality">${t.quality}</span>
              <span class="format-type">${t.ext.toUpperCase()} Video</span>
            </div>
            <a href="/api/download?url=${encodeURIComponent(n)}&format=mp4&quality=${encodeURIComponent(t.quality)}" download="${s}_${t.quality}.${t.ext}" class="format-download-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download MP4
            </a>
          </div>
        `).join("")}
      </div>

      <div class="format-heading">
        <span>🎧 Audio Downloads (MP3)</span>
        <small style="color: #10b981; font-weight: 700;">⚡ 100% Direct Server Stream</small>
      </div>
      <div class="formats-grid">
        ${c.slice(0,2).map(t=>`
          <div class="format-card">
            <div class="format-meta">
              <span class="format-quality">${t.quality}</span>
              <span class="format-type">MP3 Audio</span>
            </div>
            <a href="/api/download?url=${encodeURIComponent(n)}&format=mp3" download="${s}_audio.mp3" class="format-download-btn audio">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
              Download MP3
            </a>
          </div>
        `).join("")}
      </div>

      <div class="result-actions">
        <button type="button" class="action-btn" id="toggle-embed-btn">▶ Play In-Browser</button>
      </div>

      <div id="embed-container" style="display:none; margin-top:14px;">
        <iframe width="100%" height="315" src="https://www.youtube.com/embed/${e}?autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="border-radius:10px; width:100%;"></iframe>
      </div>
    `,document.getElementById("toggle-embed-btn")?.addEventListener("click",()=>{const t=document.getElementById("embed-container");t&&(t.style.display=t.style.display==="none"?"block":"none")})}document.querySelector("[data-extractor-form]")?.addEventListener("submit",async e=>{e.preventDefault();const a=d?d.value.trim():"";if(!a){v("Please paste a YouTube video or Shorts URL to extract."),d?.focus();return}const o=g(a);if(!o){v("Invalid URL format. Please paste a valid YouTube video or Shorts link (e.g., https://www.youtube.com/watch?v=...).");return}w("Extracting video info and preparing direct download endpoint...");try{const i=await q(o);f(o,i)}catch{f(o,null)}});document.querySelectorAll("[data-faq-button]").forEach(e=>e.addEventListener("click",()=>{const a=e.closest(".faq-item"),o=!a?.classList.contains("is-open");document.querySelectorAll(".faq-item").forEach(i=>{i.classList.remove("is-open"),i.querySelector("button")?.setAttribute("aria-expanded","false")}),o&&(a?.classList.add("is-open"),e.setAttribute("aria-expanded","true"))}));
