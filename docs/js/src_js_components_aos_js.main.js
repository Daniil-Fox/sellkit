"use strict";
(self["webpackChunkgulp_builder"] = self["webpackChunkgulp_builder"] || []).push([["src_js_components_aos_js"],{

/***/ "./src/js/components/aos.js":
/*!**********************************!*\
  !*** ./src/js/components/aos.js ***!
  \**********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var aos__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! aos */ "./node_modules/aos/dist/aos.js");


// Возвращаемся к стандартной реализации AOS с небольшими модификациями
aos__WEBPACK_IMPORTED_MODULE_0__.init({
  offset: 100,
  // Настраиваем смещение для точного срабатывания
  delay: 0,
  duration: 800,
  easing: "ease",
  once: true,
  // Анимация будет срабатывать только один раз
  mirror: false,
  anchorPlacement: "top-center" // Привязка к центру вьюпорта
});

// Добавляем дополнительную проверку загрузки AOS
document.addEventListener("DOMContentLoaded", function () {
  // Проверяем, что AOS успешно инициализирован
  setTimeout(() => {
    const aosElements = document.querySelectorAll("[data-aos]");
    console.log("AOS elements found:", aosElements.length);

    // Если AOS не инициализировался должным образом, запускаем обновление
    if (!document.querySelector(".aos-init")) {
      console.log("AOS not initialized properly, refreshing...");
      aos__WEBPACK_IMPORTED_MODULE_0__.refreshHard();
    }

    // Проверяем стили элементов
    aosElements.forEach(element => {
      if (!element.classList.contains("aos-init")) {
        element.classList.add("aos-init");
      }
    });
  }, 300);
});

// Обработчик события прокрутки для ручного обновления видимости
window.addEventListener("scroll", function () {
  aos__WEBPACK_IMPORTED_MODULE_0__.refresh();
}, {
  passive: true
});

// При загрузке всех ресурсов
window.addEventListener("load", function () {
  setTimeout(() => {
    console.log("Window loaded, refreshing AOS");
    aos__WEBPACK_IMPORTED_MODULE_0__.refresh();
  }, 100);
});

// При изменении размера окна
window.addEventListener("resize", function () {
  setTimeout(() => {
    console.log("Window resized, refreshing AOS");
    aos__WEBPACK_IMPORTED_MODULE_0__.refresh();
  }, 100);
});

/***/ })

}]);
//# sourceMappingURL=src_js_components_aos_js.main.js.map