console.log("hi");

const themes = {
  normal: {
    playlist: [
      { artist: "18hzr", name: "apathy", id: "18hzr.apathy.mp3" },
      { artist: "18hzr", name: "AVTM", id: "18hzr.AVTM.mp3" },
      {
        artist: "18hzr",
        name: "mental disorder",
        id: "18hzr.mental-disorder.mp3",
      },
      {
        artist: "18hzr",
        name: "split personality",
        id: "18hzr.split-personality.mp3",
      },
      {
        artist: "ava",
        name: "while the skys fallin down",
        id: "ava.while-the-skys-fallin-down.mp3",
      },
      { artist: "ava", name: "wipe my tears", id: "ava.wipe-my-tears.mp3" },
      {
        artist: "cast heal",
        name: "traumacide",
        id: "cast-heal.traumacide.mp3",
      },
      { artist: "FRAXRIEL", name: "LIKE I DO", id: "FRAXRIEL.LIKE-I-DO.mp3" },
      { artist: "ilymeow", name: "heal!!", id: "ilymeow.heal!!.mp3" },
      { artist: "IVOXYGEN", name: "casino143", id: "IVOXYGEN.casino143.mp3" },
      { artist: "kiyosumi", name: "repeat", id: "kiyosumi.repeat.mp3" },
      {
        artist: "kiyosumi",
        name: "thinking of you",
        id: "kiyosumi.thinking-of-you.mp3",
      },
      {
        artist: "nunashi",
        name: "wake in loneliness",
        id: "nunashi.wake-in-loneliness.mp3",
      },
      { artist: "xNasuni", name: "bright", id: "xNasuni.bright.mp3" },
    ],
    bgv: "backdrop3.mp4",
  },
  halloween: {
    playlist: [
      {
        artist: "Thaehan",
        name: "Deadly Lullaby",
        id: "Thaehan.Deadly-Lullaby.mp3",
      },
    ],
    bgv: "graveyard.mp4",
  },
  xd: {
    playlist: [
      // {
      //   artist: "Cult Member",
      //   name: "U Weren't Here I Really Miss You",
      //   id: "Cult-Member.U-Weren't-Here-I-Really-Miss-You.mp3",
      // },
    ],
    bgv: "blue.mp4",
  },
};
const theme = themes["xd"];

const preload = {};

async function preloadAssets() {
  const explosionResponse = await fetch("media/explosion.mp3");
  const explosionBuffer = await explosionResponse.arrayBuffer();
  preload.explosion = await ctx.decodeAudioData(explosionBuffer);

  const meowResponse = await fetch("media/meow.mp3");
  const meowBuffer = await meowResponse.arrayBuffer();
  preload.meow = await ctx.decodeAudioData(meowBuffer);

  const pngs = [
    "media/images/diamond.png",
    "media/images/muted.png",
    "media/images/audible.png",
  ];
  for (const src of pngs) {
    const img = new Image();
    img.src = src;
    preload[src] = img;
  }
}

preloadAssets();

const header = document.getElementById("header");

function split(element) {
  const elementChars = element.innerText;
  const className = element.classList.value;
  const parent = element.parentNode;
  element.remove();

  const chars = [];
  for (const char of elementChars.split("")) {
    const elem = document.createElement("span");
    elem.innerHTML = char == " " ? "&nbsp;" : char;
    elem.className = className;
    elem.classList.add("individual");

    parent.appendChild(elem);
    chars.push(elem);
  }

  return chars;
}

function rstr(length) {
  let s = "";
  const chars = Array.from({ length: 95 }, (_, i) =>
    String.fromCharCode(i + 32)
  );
  for (let i = 0; i < length; i++)
    s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

const ctx = new (window.AudioContext || window.webkitAudioContext)();

async function playDingPitch(chidx) {
  const response = await fetch("media/ding.mp3");
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
  const source = ctx.createBufferSource();
  source.buffer = audioBuffer;

  source.detune.value = (chidx - 1) * 100;

  source.connect(ctx.destination);
  source.start();
}

for (const glowy of document.querySelectorAll(".glowies")) {
  split(glowy);
}

const keys = {};
const timeouts = {};

for (const individual of document.querySelectorAll(".individual")) {
  if (individual.parentNode.getAttribute("japanese")) {
    const chidx = Array.from(individual.parentNode.children).indexOf(
      individual
    );
    function handler() {
      playDingPitch(chidx);

      if (timeouts[chidx]) {
        clearTimeout(timeouts[chidx]);
      }

      individual.classList.remove("shake");
      void individual.offsetWidth;

      individual.classList.add("shake");

      timeouts[chidx] = setTimeout(() => {
        individual.classList.remove("shake");
      }, 500);
    }
    keys[chidx] = handler;
    individual.addEventListener("mouseenter", handler);
  }
}

const keyMap = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"];

const reveal = document.getElementById("reveal");
const cover = document.getElementById("cover");

document.addEventListener("keydown", (e) => {
  const idx = keyMap.indexOf(e.key.toLowerCase());
  if (
    idx !== -1 &&
    keys[idx] &&
    !e.repeat &&
    (!document.body.contains(cover) || cover.classList.contains("reveal"))
  ) {
    keys[idx]();
  }
});

const radio = document.getElementById("radio");
const backdrop = document.getElementById("backdrop");
const backdropglow = document.getElementById("backdropglow");
const radiotitle = document.getElementById("radiotitle");
const radiobar = document.getElementById("radiobar");
const currenttime = document.getElementById("currenttime");
const duration = document.getElementById("duration");
const mute = document.getElementById("mute");

const kittybutton = document.getElementById("kittybutton");

backdrop.src = `media/${theme.bgv}`;
backdropglow.src = `media/${theme.bgv}`;

var radiomuted = localStorage.getItem("radiomute") == "true";
function updateRadioWidget() {
  radio.volume = radiomuted ? 0 : 1;
  backdrop.volume = radiomuted ? 0 : 1;
  mute.children[0].src = radiomuted
    ? "media/images/muted.png"
    : "media/images/audible.png";
}
updateRadioWidget();

function format(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return mins + ":" + (secs < 10 ? "0" : "") + secs;
}

mute.onclick = () => {
  radiomuted = !radiomuted;
  localStorage.setItem("radiomute", radiomuted);
  updateRadioWidget();
};

reveal.onclick = () => {
  cover.classList.add("reveal");
  backdrop.play();
  backdropglow.play();

  radiotitle.textContent = `Cult Member - U Weren't Here I Really Miss You`;
  setInterval(() => {
    const ratio = backdrop.currentTime / backdrop.duration;
    radiobar.style.width = `${ratio * 100.0}%`;

    currenttime.textContent = format(backdrop.currentTime);
    duration.textContent = format(backdrop.duration);
  }, 1000);
  // var radiointerval = -1;
  // function radiotick() {
  //   const music =
  //     theme.playlist[Math.floor(Math.random() * theme.playlist.length)];
  //   radio.src = `media/radio/${music.id}`;
  //   radio.play();
  //   radiotitle.textContent = `${music.artist} - ${music.name}`;
  //   clearInterval(radiointerval);
  //   radiointerval = setInterval(() => {
  //     const ratio = radio.currentTime / radio.duration;
  //     radiobar.style.width = `${ratio * 100.0}%`;

  //     currenttime.textContent = format(radio.currentTime);
  //     duration.textContent = format(radio.duration);
  //   }, 1000);
  // }
  // radiotick();
  // radio.addEventListener("ended", radiotick);

  setTimeout(() => {
    cover.remove();
  }, 1000);
};
var kittycount = 0;
var kittytime = Date.now();
var kittytimeout = null;
var kittypitch = 0;

kittybutton.onclick = async () => {
  if (kittybutton.disabled) {
    return;
  }

  if (kittytimeout) clearTimeout(kittytimeout);

  kittycount++;
  kittypitch = Math.min(kittycount * 50, 1200);

  if (kittycount > 20) {
    const meow = new Audio("media/explosion.mp3");
    meow.play();
    kittybutton.disabled = true;
    kittybutton.classList.add("disabled");
    kittycount = 0;
    kittypitch = 0;
  } else {
    const response = await fetch("media/meow.mp3");
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;

    source.detune.value = kittypitch;

    source.connect(ctx.destination);
    source.start();
  }

  kittytimeout = setTimeout(() => {
    kittycount = 0;
    kittytime = Date.now();
    kittypitch = 0;
  }, 2000);
};

const cards = document.querySelectorAll(".container");

document.addEventListener("mousemove", (e) => {
  for (const card of cards) {
    for (const subcard of card.querySelectorAll(".card")) {
      const rect = subcard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      subcard.style.setProperty("--mouse-x", `${x}px`);
      subcard.style.setProperty("--mouse-y", `${y}px`);
    }
  }
});

cards.forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rx = ((y - cy) / cy) * -10;
    const ry = ((x - cx) / cx) * 10;
    card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

const t = document.getElementsByClassName("tooltip");

for (let i = 0; i < t.length; i++) {
  const el = t[i];
  const box = document.createElement("div");
  box.className = "tooltipbox";
  box.textContent = el.getAttribute("data-tooltip");
  el.appendChild(box);

  el.addEventListener("mouseenter", () => {
    box.classList.add("show");
  });

  el.addEventListener("mouseleave", () => {
    box.classList.remove("show");
  });
}
