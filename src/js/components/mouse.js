const mouse = {
  x: 0,
  y: 0,
};
const mouseElem = document.querySelector(".mouse");
window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;

  mouseElem.style.left = `${mouse.x}px`;
  mouseElem.style.top = `${mouse.y}px`;
});

document.querySelectorAll("a").forEach((el) => {
  el.addEventListener("mouseenter", (e) => {
    mouseElem.classList.add("hovered");
  });
  el.addEventListener("mouseleave", (e) => {
    mouseElem.classList.remove("hovered");
  });

  el.addEventListener("mousedown", (e) => {
    mouseElem.classList.add("active");
  });
  el.addEventListener("mouseup", (e) => {
    mouseElem.classList.remove("active");
  });
});

document.querySelectorAll("button").forEach((el) => {
  el.addEventListener("mouseenter", (e) => {
    mouseElem.classList.add("hovered");
  });
  el.addEventListener("mouseleave", (e) => {
    mouseElem.classList.remove("hovered");
  });
  el.addEventListener("mousedown", (e) => {
    mouseElem.classList.add("active");
  });
  el.addEventListener("mouseup", (e) => {
    mouseElem.classList.remove("active");
  });
});

document.addEventListener("mousedown", (e) => {
  mouseElem.classList.add("active");
});
document.addEventListener("mouseup", (e) => {
  mouseElem.classList.remove("active");
});

const orealZone = document.querySelectorAll("[data-mouse-oreal]");
const blueZone = document.querySelectorAll("[data-mouse-blue]");
if (orealZone.length > 0) {
  orealZone.forEach((el) => {
    el.addEventListener("mouseenter", (e) => {
      mouseElem.classList.add("oreal");
    });
    el.addEventListener("mouseleave", (e) => {
      mouseElem.classList.remove("oreal");
    });
  });
}
if (blueZone.length > 0) {
  blueZone.forEach((el) => {
    el.addEventListener("mouseenter", (e) => {
      mouseElem.classList.add("white");
    });
    el.addEventListener("mouseleave", (e) => {
      mouseElem.classList.remove("white");
    });
  });
}
