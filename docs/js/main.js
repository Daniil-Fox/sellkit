/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/_components.js":
/*!*******************************!*\
  !*** ./src/js/_components.js ***!
  \*******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_products_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/products.js */ "./src/js/components/products.js");


/***/ }),

/***/ "./src/js/components/products.js":
/*!***************************************!*\
  !*** ./src/js/components/products.js ***!
  \***************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
const prodItems = document.querySelectorAll(".prod-item");
function clearActive() {
  const el = document.querySelector(".prod-item.active");
  if (el) {
    const video = el.querySelector("video");
    video?.pause();
    const itemTitle = el.querySelector(".prod-item__title");
    el.classList.remove("active");
    itemTitle.textContent = itemTitle.dataset.fullText;
  }
}
prodItems.forEach(item => {
  const itemTitle = item.querySelector(".prod-item__title");
  const video = item.querySelector("video");
  itemTitle.dataset.fullText = itemTitle.textContent;
  item.addEventListener("click", e => {
    e.preventDefault();
    clearActive();
    const fullText = itemTitle.dataset.fullText;
    itemTitle.textContent = "";
    item.classList.add("active");
    video?.play();
    let index = 0;
    const typeEffect = () => {
      if (index < fullText.length) {
        itemTitle.textContent += fullText[index];
        index++;
        setTimeout(typeEffect, 50);
      }
    };
    setTimeout(() => {
      typeEffect();
    }, 200);
  });
});

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!************************!*\
  !*** ./src/js/main.js ***!
  \************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_components.js */ "./src/js/_components.js");

})();

/******/ })()
;
//# sourceMappingURL=main.js.map