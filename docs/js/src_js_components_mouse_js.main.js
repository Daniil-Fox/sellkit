"use strict";
(self["webpackChunkgulp_builder"] = self["webpackChunkgulp_builder"] || []).push([["src_js_components_mouse_js"],{

/***/ "./src/js/components/mouse.js":
/*!************************************!*\
  !*** ./src/js/components/mouse.js ***!
  \************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
const mouse = {
  x: 0,
  y: 0
};
const mouseElem = document.querySelector(".mouse");
window.addEventListener("mousemove", e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  mouseElem.style.left = `${mouse.x}px`;
  mouseElem.style.top = `${mouse.y}px`;
});
document.querySelectorAll("a").forEach(el => {
  el.addEventListener("mouseenter", e => {
    mouseElem.classList.add("hovered");
  });
  el.addEventListener("mouseleave", e => {
    mouseElem.classList.remove("hovered");
  });
  el.addEventListener("mousedown", e => {
    mouseElem.classList.add("active");
  });
  el.addEventListener("mouseup", e => {
    mouseElem.classList.remove("active");
  });
});
document.querySelectorAll("button").forEach(el => {
  el.addEventListener("mouseenter", e => {
    mouseElem.classList.add("hovered");
  });
  el.addEventListener("mouseleave", e => {
    mouseElem.classList.remove("hovered");
  });
  el.addEventListener("mousedown", e => {
    mouseElem.classList.add("active");
  });
  el.addEventListener("mouseup", e => {
    mouseElem.classList.remove("active");
  });
});
document.addEventListener("mousedown", e => {
  mouseElem.classList.add("active");
});
document.addEventListener("mouseup", e => {
  mouseElem.classList.remove("active");
});
const orealZone = document.querySelectorAll("[data-mouse-oreal]");
const blueZone = document.querySelectorAll("[data-mouse-blue]");
const oreal = document.querySelector("#oreal");
if (orealZone.length > 0) {
  orealZone.forEach(el => {
    const oreal = document.createElement("div");
    oreal.classList.add("oreal");
    el.style.position = "relative"; // чтобы абсолют позиционировался относительно этого блока
    el.append(oreal);

    // Размеры элемента oreal для центрирования
    const orealWidth = oreal.clientWidth; // установи так, как у тебя в CSS
    const orealHeight = oreal.clientHeight;
    el.addEventListener("mouseenter", () => {
      oreal.style.opacity = "1";
    });
    el.addEventListener("mouseleave", () => {
      oreal.style.opacity = "0";
    });
    el.addEventListener("mousemove", e => {
      const rect = el.getBoundingClientRect();
      // Координаты курсора относительно блока
      const x = e.clientX - rect.left - orealWidth / 2;
      const y = e.clientY - rect.top - orealHeight / 2;
      oreal.style.transform = `translate(${x}px, ${y}px)`;
    });
  });
}
if (blueZone.length > 0) {
  blueZone.forEach(el => {
    el.addEventListener("mouseenter", e => {
      mouseElem.classList.add("white");
    });
    el.addEventListener("mouseleave", e => {
      mouseElem.classList.remove("white");
    });
  });
}

/***/ })

}]);
//# sourceMappingURL=src_js_components_mouse_js.main.js.map