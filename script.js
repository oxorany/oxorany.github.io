console.log("hi");

const themes = {
  normal: {
    playlist: [
      "ava.wipe-my-tears.mp3",
      "ava.while-the-skys-fallin-down.mp3",
      "kiyosumi.thinking-of-you.mp3",
    ],
    bgv: "backdrop3.mp4",
  },
};
const theme = themes["normal"];

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

  source.detune.value = chidx * 100;

  source.connect(ctx.destination);
  source.start();
}

for (const glowy of document.querySelectorAll(".glowies")) {
  split(glowy);
}

for (const individual of document.querySelectorAll(".individual")) {
  if (individual.parentNode.getAttribute("japanese")) {
    const chidx = Array.from(individual.parentNode.children).indexOf(
      individual
    );
    individual.addEventListener("mouseenter", () => {
      playDingPitch(chidx);
      individual.classList.add("shake");
      setTimeout(() => {
        individual.classList.remove("shake");
      }, 1000);
    });
  }
}

const reveal = document.getElementById("reveal");
const cover = document.getElementById("cover");

const radio = document.getElementById("radio");
const backdrop = document.getElementById("backdrop");
const backdropglow = document.getElementById("backdropglow");

const kittybutton = document.getElementById("kittybutton");

backdrop.src = `media/${theme.bgv}`;
backdropglow.src = `media/${theme.bgv}`;

reveal.onclick = () => {
  cover.classList.add("reveal");
  backdrop.play();
  backdropglow.play();

  function radiotick() {
    const music =
      theme.playlist[Math.floor(Math.random() * theme.playlist.length)];
    radio.src = `media/${music}`;
    radio.play();
  }
  radiotick();
  radio.addEventListener("ended", radiotick);

  setTimeout(() => {
    cover.remove();
  }, 1000);
};

kittybutton.onclick = () => {};
// I'll do this tomorrow :)
