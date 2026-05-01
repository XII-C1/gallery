/* ================================
   FIREBASE CONFIGURATION
================================ */
const firebaseConfig = {
  apiKey: "AIzaSyDMxFEP87qzw-BBOQs-XlMZzDJ-ZyeUcw8",
  authDomain: "yearbook-xii-c1.firebaseapp.com",
  databaseURL: "https://yearbook-xii-c1-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "yearbook-xii-c1",
  storageBucket: "yearbook-xii-c1.firebasestorage.app",
  messagingSenderId: "33633849648",
  appId: "1:33633849648:web:c5bc9211fc9bf0dca8b8f5",
};

// Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

/* ================================
   DASAR & UTILITIES
================================ */
const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

const menuBtn = $("#menuBtn");
const navLinks = $("#navLinks");
const themeBtn = $("#themeBtn");
const musicBtn = $("#musicBtn");
const toTop = $("#toTop");

/* ================================
   NAVBAR MENU
================================ */
if(menuBtn && navLinks){
  menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });
}

$$(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks?.classList.remove("open");
  });
});

/* ================================
   THEME SIANG / MALAM
================================ */
if(themeBtn){
  themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("night");
    const isNight = document.body.classList.contains("night");
    themeBtn.textContent = isNight ? "🌙" : "☀";
    localStorage.setItem("memory-theme", isNight ? "night" : "day");
  });
}

if(localStorage.getItem("memory-theme") === "night"){
  document.body.classList.add("night");
  if(themeBtn){
    themeBtn.textContent = "🌙";
  }
}

/* ================================
   MP3 MEMORY MUSIC PLAYER
================================ */
const memoryAudio = $("#memoryAudio");

const memorySongs = [
  { title:"Sampai Jumpa", desc:"Endank soekamti", src:"https://www.image2url.com/r2/default/audio/1777547373468-67e04445-b617-462e-ae12-f18b7ea22681.mp3" },
  { title:"Laskar pelangi", desc:"Nidji", src:"https://www.image2url.com/r2/default/audio/1777547582081-7e84923d-912a-4524-950c-a834ce459591.mp3" },
  { title:"Kita kesana", desc:"Hindia", src:"https://www.image2url.com/r2/default/audio/1777547831620-727bcbfb-815a-47af-952d-1fc82516a83d.mp3" },
  { title:"Tarot", desc:"Hindia", src:"https://www.image2url.com/r2/default/audio/1777548010882-a9ee6724-ed2b-48ec-b499-dafc1e8083d7.mp3" },
  { title:"Tujuh belas", desc:"TULUS", src:"https://www.image2url.com/r2/default/audio/1777548279962-4857e7a2-d560-49ae-9d54-189ea994af64.mp3" }
];

let currentSongIndex = 0;
let isMusicPlaying = false;
let progressTimer = null;

function loadMemorySong(index){
  if(!memoryAudio) return;
  const song = memorySongs[index];
  memoryAudio.src = song.src;
  memoryAudio.load();
  const title = $("#songTitle");
  const desc = $("#songDesc");
  if(title) title.textContent = song.title;
  if(desc) desc.textContent = song.desc;
  updateMusicUI();
  updateMusicProgress();
}

async function playMemorySong(){
  if(!memoryAudio) return;
  try{
    await memoryAudio.play();
    isMusicPlaying = true;
    updateMusicUI();
    startMusicProgress();
  }catch(error){
    console.warn("Audio belum bisa diputar.", error);
  }
}

function pauseMemorySong(){
  if(!memoryAudio) return;
  memoryAudio.pause();
  isMusicPlaying = false;
  updateMusicUI();
}

function toggleMemorySong(){
  isMusicPlaying ? pauseMemorySong() : playMemorySong();
}

function nextMemorySong(){
  currentSongIndex = (currentSongIndex + 1) % memorySongs.length;
  loadMemorySong(currentSongIndex);
  playMemorySong();
}

function prevMemorySong(){
  currentSongIndex = (currentSongIndex - 1 + memorySongs.length) % memorySongs.length;
  loadMemorySong(currentSongIndex);
  playMemorySong();
}

function updateMusicUI(){
  const playBtn = $("#playSong");
  const vinyl = $("#vinyl");
  if(musicBtn) musicBtn.textContent = isMusicPlaying ? "♫" : "♪";
  if(playBtn) playBtn.textContent = isMusicPlaying ? "⏸" : "▶";
  if(vinyl) vinyl.classList.toggle("playing", isMusicPlaying);
}

function formatMusicTime(seconds){
  if(!Number.isFinite(seconds)) return "00:00";
  const minute = String(Math.floor(seconds / 60)).padStart(2, "0");
  const second = String(Math.floor(seconds % 60)).padStart(2, "0");
  return `${minute}:${second}`;
}

function updateMusicProgress(){
  if(!memoryAudio) return;
  const songBar = $("#songBar");
  const songTime = $("#songTime");
  const songDuration = $("#songDuration");
  if(!songBar || !songTime) return;
  const current = memoryAudio.currentTime || 0;
  const duration = memoryAudio.duration || 0;
  const percent = duration ? (current / duration) * 100 : 0;
  songBar.style.width = `${percent}%`;
  songTime.textContent = formatMusicTime(current);
  if(songDuration) songDuration.textContent = formatMusicTime(duration);
}

function startMusicProgress(){
  clearInterval(progressTimer);
  progressTimer = setInterval(() => {
    if(isMusicPlaying) updateMusicProgress();
  }, 500);
}

function toggleYTSong(){ toggleMemorySong(); }
function nextYTSong(){ nextMemorySong(); }
function prevYTSong(){ prevMemorySong(); }

if(musicBtn){
  musicBtn.addEventListener("click", () => { toggleMemorySong(); });
}

if(memoryAudio){
  memoryAudio.addEventListener("ended", () => { nextMemorySong(); });
  memoryAudio.addEventListener("loadedmetadata", updateMusicProgress);
  memoryAudio.addEventListener("timeupdate", updateMusicProgress);
}

loadMemorySong(currentSongIndex);

/* ================================
   SCROLL ACTIVE NAV
================================ */
const sections = $$("section[id]");
let scrollTicking = false;

function handleScroll(){
  const y = scrollY + 160;
  sections.forEach(section => {
    const link = $(`.nav-links a[href="#${section.id}"]`);
    if(link && y >= section.offsetTop && y < section.offsetTop + section.offsetHeight){
      $$(".nav-links a").forEach(a => a.classList.remove("active"));
      link.classList.add("active");
    }
  });
  if(toTop) toTop.classList.toggle("show", scrollY > 600);
  scrollTicking = false;
}

window.addEventListener("scroll", () => {
  if(!scrollTicking){
    requestAnimationFrame(handleScroll);
    scrollTicking = true;
  }
}, { passive:true });

if(toTop){
  toTop.addEventListener("click", () => {
    scrollTo({ top:0, behavior:"smooth" });
  });
}

/* ================================
   REVEAL ANIMATION
================================ */
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add("show");
      if(entry.target.querySelector("[data-count]")){
        runCounters();
      }
      observer.unobserve(entry.target);
    }
  });
},{ threshold:0.12, rootMargin:"0px 0px -40px 0px" });

$$(".reveal").forEach(element => observer.observe(element));

/* ================================
   COUNTER ANGKA HERO
================================ */
let countersStarted = false;

function runCounters(){
  if(countersStarted) return;
  countersStarted = true;
  const counters = $$("[data-count]");
  counters.forEach(counter => {
    const target = Number(counter.dataset.count || 0);
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 60));
    function update(){
      current += step;
      if(current >= target) current = target;
      counter.textContent = current;
      if(current < target) requestAnimationFrame(update);
    }
    update();
  });
}

window.addEventListener("load", () => {
  setTimeout(() => { runCounters(); }, 300);
});

/* ================================
   TILT CARD - DESKTOP ONLY
================================ */
const allowHeavyEffects = window.matchMedia("(min-width: 900px)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if(allowHeavyEffects){
  $$(".tilt").forEach(card => {
    let tiltRAF = null;
    let lastEvent = null;
    card.addEventListener("mousemove", event => {
      lastEvent = event;
      if(tiltRAF) return;
      tiltRAF = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = lastEvent.clientX - rect.left;
        const y = lastEvent.clientY - rect.top;
        card.style.setProperty("--x", `${x}px`);
        card.style.setProperty("--y", `${y}px`);
        const rotateX = -(y - rect.height / 2) / 24;
        const rotateY = (x - rect.width / 2) / 24;
        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        tiltRAF = null;
      });
    }, { passive:true });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

/* ================================
   FIREFLIES CANVAS
================================ */
const canvas = $("#fireflies");

if(canvas){
  const ctx = canvas.getContext("2d", { alpha:true });
  let fireflies = [];
  let cw = 0;
  let ch = 0;
  let frame = 0;

  const isMobile = window.matchMedia("(max-width: 760px)").matches;
  const fireflyCount = isMobile ? 26 : 44;

  function resizeCanvas(){
    const ratio = Math.min(window.devicePixelRatio || 1, 1.4);
    cw = window.innerWidth;
    ch = window.innerHeight;
    canvas.width = cw * ratio;
    canvas.height = ch * ratio;
    canvas.style.width = `${cw}px`;
    canvas.style.height = `${ch}px`;
    ctx.setTransform(ratio,0,0,ratio,0,0);

    fireflies = Array.from({length:fireflyCount}, () => ({
      x:Math.random() * cw,
      y:Math.random() * ch,
      r:Math.random() * 1.8 + 1,
      vx:(Math.random() - .5) * .22,
      vy:(Math.random() - .5) * .22,
      glow:Math.random() * .7 + .25
    }));
  }

  function drawFireflies(){
    frame++;
    if(frame % 2 === 0){
      ctx.clearRect(0,0,cw,ch);
      fireflies.forEach(f => {
        f.x += f.vx;
        f.y += f.vy;
        if(f.x < 0 || f.x > cw) f.vx *= -1;
        if(f.y < 0 || f.y > ch) f.vy *= -1;
        f.glow += (Math.random() - .5) * .022;
        f.glow = Math.max(.25, Math.min(1, f.glow));
        const gradient = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 7);
        gradient.addColorStop(0, `rgba(255,235,140,${f.glow})`);
        gradient.addColorStop(1, "rgba(255,235,140,0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r * 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(255,250,180,${f.glow})`;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      });
    }
    requestAnimationFrame(drawFireflies);
  }

  resizeCanvas();
  drawFireflies();

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resizeCanvas, 180);
  }, { passive:true });
}

/* ================================
   FALLING LEAVES
================================ */
const leavesContainer = $("#leaves");
let activeLeaves = 0;

const isSmallScreen = window.matchMedia("(max-width: 760px)").matches;
const maxLeaves = isSmallScreen ? 8 : 16;
const leafDelay = isSmallScreen ? 1200 : 850;

function createLeaf(){
  if(!leavesContainer) return;
  if(activeLeaves >= maxLeaves) return;

  const leaf = document.createElement("span");
  leaf.className = "leaf";
  const size = Math.random() * 10 + 9;
  const left = Math.random() * 100;
  const duration = Math.random() * 5 + 7;
  const drift = (Math.random() - .5) * 220;

  leaf.style.left = `${left}%`;
  leaf.style.width = `${size}px`;
  leaf.style.height = `${size * .65}px`;
  leaf.style.animationDuration = `${duration}s`;
  leaf.style.setProperty("--drift", `${drift}px`);
  leaf.style.opacity = Math.random() * .42 + .32;

  leavesContainer.appendChild(leaf);
  activeLeaves++;

  setTimeout(() => {
    leaf.remove();
    activeLeaves--;
  }, duration * 1000);
}

setInterval(createLeaf, leafDelay);

/* ================================
   MODAL LAMA
================================ */
const modal = $("#modal");
const modalBody = $("#modalBody");
const closeModal = $("#closeModal");

if(closeModal && modal){
  closeModal.addEventListener("click", () => {
    modal.classList.remove("show");
  });
}

if(modal){
  modal.addEventListener("click", event => {
    if(event.target === modal){
      modal.classList.remove("show");
    }
  });
}

/* ================================
   FINAL QUOTE
================================ */
const finalQuotes = [
  "“Kita mungkin berjalan ke arah yang berbeda, tapi pernah berada di cerita yang sama.”",
  "“Sekolah selesai, tapi kenangannya masih duduk rapi di kepala.”",
  "“Ada orang-orang yang tidak selalu kita temui lagi, tapi tetap tinggal di masa terbaik kita.”",
  "“Suatu hari nanti, kita akan rindu pada hari yang dulu terasa biasa saja.”",
  "“Terima kasih sudah menjadi bagian dari masa muda yang hangat.”"
];

let finalQuoteIndex = 0;
const changeFinalQuote = $("#changeFinalQuote");

if(changeFinalQuote){
  changeFinalQuote.addEventListener("click", () => {
    finalQuoteIndex = (finalQuoteIndex + 1) % finalQuotes.length;
    const quote = $("#finalQuote");
    if(!quote) return;
    quote.animate([
      { opacity:0, transform:"translateY(12px)" },
      { opacity:1, transform:"translateY(0)" }
    ],{ duration:450, easing:"ease" });
    quote.textContent = finalQuotes[finalQuoteIndex];
  });
}

/* ================================
   FLOATING ISLAND PARALLAX
================================ */
if(allowHeavyEffects){
  const island = $(".floating-island");
  let parallaxRAF = null;
  let mouseX = 0;
  let mouseY = 0;

  document.addEventListener("mousemove", event => {
    mouseX = event.clientX / window.innerWidth - .5;
    mouseY = event.clientY / window.innerHeight - .5;
    if(parallaxRAF) return;
    parallaxRAF = requestAnimationFrame(() => {
      if(island){
        island.style.transform = `translateY(${mouseY * -10}px) translateX(${mouseX * 12}px) rotateX(${mouseY * 5}deg) rotateY(${mouseX * -5}deg)`;
      }
      parallaxRAF = null;
    });
  }, { passive:true });
}

/* ================================
   REAL INTERACTIVE FEATURES
================================ */
const featureTabs = $$(".feature-tab");
const featurePages = $$(".feature-page");

featureTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.feature;
    featureTabs.forEach(item => item.classList.remove("active"));
    featurePages.forEach(page => page.classList.remove("active"));
    tab.classList.add("active");
    const targetPage = $(`#feature-${target}`);
    if(targetPage) targetPage.classList.add("active");
  });
});

document.addEventListener("click", event => {
  if(event.target.id === "playSong") toggleYTSong();
  if(event.target.id === "nextSong") nextYTSong();
  if(event.target.id === "prevSong") prevYTSong();
});

const classQuotes = [
  "“Santai, masih lama.” — diucapkan 2 jam sebelum deadline.",
  "“Ada yang sudah ngerjain?” — pertanyaan paling sakral di grup kelas.",
  "“Besok bawa apa?” — muncul tiap malam sebelum sekolah.",
  "“Nanti kumpul lagi ya.” — kalimat simpel yang ternyata berat.",
  "“Yang penting hadir dulu, pahamnya belakangan.”",
  "“Tugas kelompok adalah ujian kesabaran versi sekolah.”",
  "“Kelas ini berisik, tapi nanti justru itu yang dikangenin.”"
];

const randomQuote = $("#randomQuote");
const generateQuote = $("#generateQuote");
const copyQuote = $("#copyQuote");

if(generateQuote && randomQuote){
  generateQuote.addEventListener("click", () => {
    const quote = classQuotes[Math.floor(Math.random() * classQuotes.length)];
    randomQuote.animate([
      { opacity:0, transform:"translateY(12px)" },
      { opacity:1, transform:"translateY(0)" }
    ],{ duration:420, easing:"ease" });
    randomQuote.textContent = quote;
  });
}

if(copyQuote && randomQuote){
  copyQuote.addEventListener("click", async () => {
    try{
      await navigator.clipboard.writeText(randomQuote.textContent);
      copyQuote.textContent = "Tersalin ✓";
      setTimeout(() => { copyQuote.textContent = "Copy Quote"; }, 1200);
    }catch{
      alert("Quote: " + randomQuote.textContent);
    }
  });
}

const awards = [
  "Paling sering bilang “aman” padahal belum ngerjain",
  "Raja/Ratu jam kosong",
  "Paling susah diajak serius tapi selalu bikin rame",
  "Penyelamat tugas kelompok",
  "Paling sering nanya “besok bawa apa?”",
  "Paling kalem tapi sekalinya ngomong langsung savage",
  "Paling niat kalau urusan foto kelas",
  "Paling cepat hilang pas kerja kelompok",
  "Mood booster kelas sepanjang masa",
  "Legenda kantin dan jajanan sekolah"
];

const generateAward = $("#generateAward");

if(generateAward){
  generateAward.addEventListener("click", () => {
    const awardName = $("#awardName");
    const result = $("#awardResult");
    if(!result) return;
    const name = awardName?.value.trim() || "Teman Misterius";
    const award = awards[Math.floor(Math.random() * awards.length)];
    result.classList.remove("pop");
    void result.offsetWidth;
    result.classList.add("pop");
    result.innerHTML = `<div><div style="font-size:2.4rem;margin-bottom:10px;">🏆</div><div>${name}</div><p style="margin-top:10px;color:var(--muted);font-size:1rem;">${award}</p></div>`;
  });
}

/* ================================
   KAPSUL WAKTU & SURAT MASA DEPAN
   (SHARED DATABASE)
================================ */
const capsuleForm = $("#capsuleForm");
const capsuleList = $("#capsuleList");
const letterForm = $("#letterForm");
const lettersList = $("#lettersList");

// Fungsi escape string biar aman dari XSS
function escapeText(text){
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// 1. KAPSUL WAKTU
database.ref('capsules').on('value', (snapshot) => {
  const data = snapshot.val();
  if(!capsuleList) return;
  
  if(!data) {
    capsuleList.innerHTML = `<div class="capsule-item"><b>Belum ada pesan</b><p>Jadilah yang pertama.</p></div>`;
    return;
  }

  const items = Object.keys(data).map(key => data[key]).reverse();
  capsuleList.innerHTML = items.slice(0, 6).map(item => `
    <div class="capsule-item">
      <b>${escapeText(item.name)}</b>
      <p>${escapeText(item.message)}</p>
    </div>
  `).join("");
});

if(capsuleForm){
  capsuleForm.addEventListener("submit", e => {
    e.preventDefault();
    const name = $("#capsuleName").value.trim();
    const message = $("#capsuleMessage").value.trim();
    database.ref('capsules').push({ name, message });
    capsuleForm.reset();
  });
}

// 2. SURAT MASA DEPAN
database.ref('letters').on('value', (snapshot) => {
  const data = snapshot.val();
  if(!lettersList) return;

  if(!data) {
    lettersList.innerHTML = `<div class="saved-letter"><b>Belum ada surat</b></div>`;
    return;
  }

  const items = Object.keys(data).map(key => data[key]).reverse();
  lettersList.innerHTML = items.map(item => `
    <div class="saved-letter">
      <b>${escapeText(item.name)}</b>
      <p>${escapeText(item.message)}</p>
    </div>
  `).join("");
});

if(letterForm){
  letterForm.addEventListener("submit", e => {
    e.preventDefault();
    const name = $("#letterName").value.trim();
    const message = $("#letterMessage").value.trim();

    database.ref('letters').push({ name, message });
    letterForm.reset();

    if(modal && modalBody){
      modalBody.innerHTML = `<h2>Surat Terkirim! 💌</h2><p>Sekarang semua orang bisa baca pesanmu.</p>`;
      modal.classList.add("show");
    }
  });
}
