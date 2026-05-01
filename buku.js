const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

const chapters = [
  {
    tag:"Chapter 1",
    title:"Awal Masuk",
    date:"Juli 2024",
    story:`Masih saling hafalin nama, masih jaim, masih belum tahu siapa yang paling random.
    Tahun pertama yang awalnya canggung, tapi justru jadi awal dari semua cerita.
    Kita belum terlalu dekat, tapi dari sinilah semuanya mulai pelan-pelan terbentuk.`,
    quote:"“Dulu kita cuma orang asing yang kebetulan satu kelas.”",
    photos:[
      ["https://i.imgur.com/XFsvtvQ.jpeg","Awal masuk"],
      ["https://i.imgur.com/F05FDnb.jpeg","Masih jaim"],
      ["https://i.imgur.com/77u2ifh.jpeg","Mulai kenal"]
    ]
  },
  {
    tag:"Chapter 2",
    title:"Golden Era",
    date:"Juli 2025",
    story:`Ini masa dimana kelas mulai terasa hidup. Jokes internal makin banyak,
    tawa makin gampang muncul, dan setiap hari selalu ada aja cerita baru.
    Kita belum terlalu mikirin perpisahan, karena waktu itu rasanya semuanya masih panjang.`,
    quote:"“Ada masa yang saat dijalani terasa biasa, tapi setelah lewat jadi paling dirindukan.”",
    photos:[
      ["https://i.imgur.com/CsGnf7A.jpeg","Golden era"],
      ["https://i.imgur.com/DMU4NEp.jpeg","Canda tawa"],
      ["https://i.imgur.com/61LcHLb.jpeg","Momen bareng"]
    ]
  },
  {
    tag:"Chapter 3",
    title:"Fase Akhir",
    date:"Januari 2026",
    story:`Ujian, praktek, deadline, revisi, dan rasa capek yang datang bertubi-tubi.
    Tapi anehnya, justru di fase ini kita makin sadar kalau semuanya akan segera selesai.
    Yang dulu terasa berat, sekarang malah jadi bagian dari cerita yang lucu buat dikenang.`,
    quote:"“Kita pernah capek bareng, panik bareng, dan akhirnya berhasil lewat bareng.”",
    photos:[
      ["https://i.imgur.com/KNF8LSQ.jpeg","Ujian akhir"],
      ["https://i.imgur.com/Mk7Zhkr.jpeg","Praktek"],
      ["https://i.imgur.com/XvKkHQK.jpeg","Perjuangan"]
    ]
  },
  {
    tag:"Chapter 4",
    title:"Hari Kelulusan",
    date:"Mei 2026",
    story:`Hari yang ditunggu akhirnya datang. Tapi begitu sampai di sana,
    rasanya malah berat buat pergi. Foto terakhir, salaman terakhir,
    candaan terakhir di sekolah, semuanya terasa berbeda.
    Kita lulus, tapi sebagian dari kita tetap tertinggal di kelas itu.`,
    quote:"“Kelulusan bukan akhir cerita, cuma halaman baru yang harus dibuka.”",
    photos:[
      ["https://i.imgur.com/Z8x0DNx.jpeg","Hari lulus"],
      ["https://i.imgur.com/QXgCDSV.jpeg","Foto bareng"],
      ["https://i.imgur.com/4jp1Ji6.jpeg","Perpisahan"]
    ]
  },
  {
    tag:"Chapter 5",
    title:"Untuk Masa Depan",
    date:"Nanti, saat kita sudah jauh",
    story:`Suatu hari nanti, mungkin kita membuka halaman ini lagi.
    Kita mungkin sudah berubah, sudah sibuk, sudah punya jalan masing-masing.
    Tapi semoga kita tetap ingat bahwa pernah ada masa sederhana yang membuat kita merasa punya rumah.`,
    quote:"“Kita tidak selalu bersama, tapi pernah menjadi bagian penting dari cerita yang sama.”",
    photos:[
      ["https://i.imgur.com/Yb65smK.jpeg","Ingat lagi"],
      ["https://i.imgur.com/KY2Saeq.jpeg","Rumah lama"],
      ["https://i.imgur.com/EFSFWz2.jpeg","Sampai nanti"]
    ]
  }
];

let current = 0;

const bookPaper = $(".book-paper");
const chapterTag = $("#chapterTag");
const chapterTitle = $("#chapterTitle");
const chapterDate = $("#chapterDate");
const storyText = $("#storyText");
const quoteBox = $("#quoteBox");
const photoStack = $("#photoStack");
const prevBtn = $("#prevBtn");
const nextBtn = $("#nextBtn");
const pageNumber = $("#pageNumber");
const progressFill = $("#progressFill");
const chapterDots = $("#chapterDots");
const themeBtn = $("#themeBtn");

function renderDots(){
  chapterDots.innerHTML = chapters.map((_, index) => {
    return `<button class="${index === current ? "active" : ""}" data-index="${index}"></button>`;
  }).join("");

  $$("#chapterDots button").forEach(button => {
    button.addEventListener("click", () => {
      current = Number(button.dataset.index);
      renderChapter(true);
    });
  });
}

function renderChapter(animated = false){
  const data = chapters[current];

  if(animated){
    bookPaper.classList.remove("flip");
    void bookPaper.offsetWidth;
    bookPaper.classList.add("flip");
  }

  chapterTag.textContent = data.tag;
  chapterTitle.textContent = data.title;
  chapterDate.textContent = data.date;
  storyText.textContent = data.story;
  quoteBox.textContent = data.quote;

  photoStack.innerHTML = data.photos.map((photo, index) => {
    const classes = ["photo-a", "photo-b", "photo-c"];

    return `
      <figure class="book-photo ${classes[index]}">
        <img src="${photo[0]}" alt="${photo[1]}">
        <figcaption>${photo[1]}</figcaption>
      </figure>
    `;
  }).join("");

  prevBtn.disabled = current === 0;
  nextBtn.disabled = current === chapters.length - 1;

  pageNumber.textContent = `${current + 1} / ${chapters.length}`;
  progressFill.style.width = `${((current + 1) / chapters.length) * 100}%`;

  renderDots();
}

prevBtn.addEventListener("click", () => {
  if(current > 0){
    current--;
    renderChapter(true);
  }
});

nextBtn.addEventListener("click", () => {
  if(current < chapters.length - 1){
    current++;
    renderChapter(true);
  }
});

document.addEventListener("keydown", event => {
  if(event.key === "ArrowLeft"){
    prevBtn.click();
  }

  if(event.key === "ArrowRight"){
    nextBtn.click();
  }
});

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("night");

  const night = document.body.classList.contains("night");
  themeBtn.textContent = night ? "☀" : "🌙";
  localStorage.setItem("book-theme", night ? "night" : "day");
});

if(localStorage.getItem("book-theme") === "night"){
  document.body.classList.add("night");
  themeBtn.textContent = "☀";
}

renderChapter();

/* Fireflies ringan */
const canvas = $("#fireflies");
const ctx = canvas.getContext("2d", { alpha:true });

let fireflies = [];
let cw = 0;
let ch = 0;
let frame = 0;

function resizeCanvas(){
  const ratio = Math.min(window.devicePixelRatio || 1, 1.5);

  cw = innerWidth;
  ch = innerHeight;

  canvas.width = cw * ratio;
  canvas.height = ch * ratio;
  canvas.style.width = `${cw}px`;
  canvas.style.height = `${ch}px`;

  ctx.setTransform(ratio,0,0,ratio,0,0);

  const count = innerWidth < 700 ? 26 : 42;

  fireflies = Array.from({length:count}, () => ({
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

      f.glow += (Math.random() - .5) * .025;
      f.glow = Math.max(.25, Math.min(1, f.glow));

      const g = ctx.createRadialGradient(f.x,f.y,0,f.x,f.y,f.r * 7);
      g.addColorStop(0,`rgba(255,235,140,${f.glow})`);
      g.addColorStop(1,"rgba(255,235,140,0)");

      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(f.x,f.y,f.r * 7,0,Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `rgba(255,250,180,${f.glow})`;
      ctx.beginPath();
      ctx.arc(f.x,f.y,f.r,0,Math.PI * 2);
      ctx.fill();
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

/* Daun jatuh ringan */
const leaves = $("#leaves");
let activeLeaves = 0;
const maxLeaves = innerWidth < 700 ? 8 : 15;

function createLeaf(){
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

  setTimeout(() => {
    leaf.remove();
    activeLeaves--;
  }, duration * 1000);
}

setInterval(createLeaf, innerWidth < 700 ? 1200 : 850);