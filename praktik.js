const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

/* ================================
   SETTING ALBUM PRAKTIK
================================ */

// Sesuaikan jumlah foto praktik yang kamu punya
const totalPhotos = 37;

// Pastikan foldernya "image/praktik" dan nama fotonya "praktik (1).jpg", "praktik (2).jpg", dst.
const photoFolder = "image/praktik"; 
const photoPrefix = "praktik";

const supportedExtensions = ["jpg", "jpeg", "png", "webp", "gif", "avif"];

/* ================================
   THEME
================================ */
const themeBtn = $("#themeBtn");

if(localStorage.getItem("album-theme") === "night"){
  document.body.classList.add("night");
  if(themeBtn) themeBtn.textContent = "🌙";
}

if(themeBtn){
  themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("night");
    const isNight = document.body.classList.contains("night");
    themeBtn.textContent = isNight ? "🌙" : "☀";
    localStorage.setItem("album-theme", isNight ? "night" : "day");
  });
}

/* ================================
   AUTO GENERATE FOTO (SISTEM TANDA KURUNG)
================================ */
const albumGrid = $("#albumGrid");
const validPhotos = [];

function getPhotoClass(index){
  if(index === 1 || index === 12 || index === 25 || index === 40 || index === 60){
    return "big landscape";
  }
  if(index % 8 === 0){
    return "wide landscape";
  }
  if(index % 5 === 0){
    return "portrait";
  }
  return "landscape";
}

// INI BAGIAN PEMBACA NAMA FILE: pakai spasi dan tanda kurung
function getPhotoBase(index){
  return `${photoFolder}/${photoPrefix} (${index})`;
}

function createPhotoCard(index){
  const base = getPhotoBase(index);
  const firstSrc = `${base}.${supportedExtensions[0]}`;
  const layoutClass = getPhotoClass(index);

  const button = document.createElement("button");
  button.className = `album-photo ${layoutClass}`;
  button.type = "button";
  button.dataset.index = index;
  button.dataset.base = base;
  button.dataset.extIndex = "0";
  button.dataset.img = firstSrc;

  button.innerHTML = `
    <img 
      src="${firstSrc}" 
      alt="Foto Praktik ${index}" 
      loading="lazy" 
      decoding="async"
    >
    <span>Dokumentasi ${index}</span>
  `;

  const img = button.querySelector("img");

  img.addEventListener("load", () => {
    button.dataset.img = img.src;
    button.classList.remove("is-missing");

    if(!validPhotos.includes(button)){
      validPhotos.push(button);
    }
  });

  img.addEventListener("error", () => {
    let nextExtIndex = Number(button.dataset.extIndex) + 1;

    if(nextExtIndex < supportedExtensions.length){
      button.dataset.extIndex = String(nextExtIndex);
      const nextSrc = `${base}.${supportedExtensions[nextExtIndex]}`;
      button.dataset.img = nextSrc;
      img.src = nextSrc;
    }else{
      button.classList.add("is-missing");
    }
  });

  return button;
}

function renderAlbumPhotos(){
  if(!albumGrid) return;

  albumGrid.innerHTML = "";
  validPhotos.length = 0;

  for(let i = 1; i <= totalPhotos; i++){
    albumGrid.appendChild(createPhotoCard(i));
  }
}

renderAlbumPhotos();

/* ================================
   LIGHTBOX (DENGAN SLIDE & SWIPE)
================================ */
const lightbox = $("#lightbox");
const lightboxImg = $("#lightboxImg");
const closeLightbox = $("#closeLightbox");
const prevLightbox = $("#prevLightbox");
const nextLightbox = $("#nextLightbox");

let activePhotoIndex = 0;

function getVisiblePhotos(){
  return $$(".album-photo:not(.is-missing)");
}

function openLightboxFromButton(button){
  if(!lightbox || !lightboxImg) return;
  const photos = getVisiblePhotos();
  activePhotoIndex = photos.indexOf(button);
  lightboxImg.src = button.dataset.img;
  lightbox.classList.add("show");
}

function closeLightboxNow(){
  if(!lightbox || !lightboxImg) return;
  lightbox.classList.remove("show");
  lightboxImg.src = "";
}

function showLightboxPhoto(direction){
  const photos = getVisiblePhotos();
  if(photos.length === 0) return;

  lightboxImg.classList.add(direction > 0 ? "slide-out-left" : "slide-out-right");

  setTimeout(() => {
    activePhotoIndex += direction;
    if(activePhotoIndex < 0) activePhotoIndex = photos.length - 1;
    if(activePhotoIndex >= photos.length) activePhotoIndex = 0;

    const button = photos[activePhotoIndex];
    lightboxImg.src = button.dataset.img;

    lightboxImg.classList.remove("slide-out-left", "slide-out-right");
    lightboxImg.classList.add(direction > 0 ? "slide-out-right" : "slide-out-left");

    void lightboxImg.offsetWidth;
    lightboxImg.classList.remove("slide-out-left", "slide-out-right");
  }, 250);
}

document.addEventListener("click", event => {
  const photo = event.target.closest(".album-photo");
  if(photo && !photo.classList.contains("is-missing")){
    openLightboxFromButton(photo);
  }
});

if(closeLightbox) closeLightbox.addEventListener("click", closeLightboxNow);
if(prevLightbox) prevLightbox.addEventListener("click", () => showLightboxPhoto(-1));
if(nextLightbox) nextLightbox.addEventListener("click", () => showLightboxPhoto(1));

if(lightbox){
  lightbox.addEventListener("click", event => {
    if(event.target === lightbox) closeLightboxNow();
  });
}

document.addEventListener("keydown", event => {
  if(!lightbox || !lightbox.classList.contains("show")) return;
  if(event.key === "Escape") closeLightboxNow();
  if(event.key === "ArrowLeft") showLightboxPhoto(-1);
  if(event.key === "ArrowRight") showLightboxPhoto(1);
});

lightboxImg.addEventListener("click", event => {
  event.stopPropagation(); 
  const clickX = event.clientX;
  if(clickX > window.innerWidth / 2) showLightboxPhoto(1);
  else showLightboxPhoto(-1);
});

let touchStartX = 0;
let touchEndX = 0;

lightbox.addEventListener("touchstart", event => {
  touchStartX = event.changedTouches[0].screenX;
}, {passive: true});

lightbox.addEventListener("touchend", event => {
  touchEndX = event.changedTouches[0].screenX;
  handleSwipe();
}, {passive: true});

function handleSwipe() {
  const swipeDistance = touchEndX - touchStartX;
  if (swipeDistance < -50) showLightboxPhoto(1);
  else if (swipeDistance > 50) showLightboxPhoto(-1);
}

/* ================================
   FIREFLIES & LEAVES (ANIMASI)
================================ */
const canvas = $("#fireflies");
if(canvas){
  const ctx = canvas.getContext("2d", { alpha:true });
  let fireflies = [];
  let cw = 0, ch = 0, frame = 0;

  function resizeCanvas(){
    const ratio = Math.min(window.devicePixelRatio || 1, 1.4);
    cw = innerWidth; ch = innerHeight;
    canvas.width = cw * ratio; canvas.height = ch * ratio;
    canvas.style.width = `${cw}px`; canvas.style.height = `${ch}px`;
    ctx.setTransform(ratio,0,0,ratio,0,0);
    const count = innerWidth < 700 ? 26 : 44;
    fireflies = Array.from({length:count}, () => ({
      x:Math.random() * cw, y:Math.random() * ch,
      r:Math.random() * 1.8 + 1, vx:(Math.random() - .5) * .22,
      vy:(Math.random() - .5) * .22, glow:Math.random() * .7 + .25
    }));
  }

  function drawFireflies(){
    frame++;
    if(frame % 2 === 0){
      ctx.clearRect(0,0,cw,ch);
      fireflies.forEach(f => {
        f.x += f.vx; f.y += f.vy;
        if(f.x < 0 || f.x > cw) f.vx *= -1;
        if(f.y < 0 || f.y > ch) f.vy *= -1;
        f.glow += (Math.random() - .5) * .022;
        f.glow = Math.max(.25, Math.min(1, f.glow));
        const gradient = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 7);
        gradient.addColorStop(0, `rgba(255,235,140,${f.glow})`);
        gradient.addColorStop(1, "rgba(255,235,140,0)");
        ctx.fillStyle = gradient;
        ctx.beginPath(); ctx.arc(f.x, f.y, f.r * 7, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = `rgba(255,250,180,${f.glow})`;
        ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2); ctx.fill();
      });
    }
    requestAnimationFrame(drawFireflies);
  }
  resizeCanvas();
  drawFireflies();
  let resizeTimer;
  addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resizeCanvas, 180);
  });
}

const leaves = $("#leaves");
let activeLeaves = 0;
const maxLeaves = innerWidth < 700 ? 8 : 16;
function createLeaf(){
  if(!leaves) return;
  if(activeLeaves >= maxLeaves) return;
  const leaf = document.createElement("span");
  leaf.className = "leaf";
  const size = Math.random() * 10 + 9;
  const duration = Math.random() * 5 + 7;
  const drift = (Math.random() - .5) * 220;
  leaf.style.left = `${Math.random() * 100}%`;
  leaf.style.width = `${size}px`;
  leaf.style.height = `${size * .65}px`;
  leaf.style.animationDuration = `${duration}s`;
  leaf.style.setProperty("--drift", `${drift}px`);
  leaves.appendChild(leaf);
  activeLeaves++;
  setTimeout(() => { leaf.remove(); activeLeaves--; }, duration * 1000);
}
setInterval(createLeaf, innerWidth < 700 ? 1200 : 850);