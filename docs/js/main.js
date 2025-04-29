/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/_components.js":
/*!*******************************!*\
  !*** ./src/js/_components.js ***!
  \*******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initHeavyComponents: () => (/* binding */ initHeavyComponents),
/* harmony export */   initVeryHeavyComponents: () => (/* binding */ initVeryHeavyComponents)
/* harmony export */ });
/* harmony import */ var _components_loyal_items_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/loyal-items.js */ "./src/js/components/loyal-items.js");
/* harmony import */ var _components_header_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/header.js */ "./src/js/components/header.js");
/* harmony import */ var _components_delivery_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/delivery.js */ "./src/js/components/delivery.js");
/* harmony import */ var _components_faq_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/faq.js */ "./src/js/components/faq.js");
/* harmony import */ var _components_plans_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/plans.js */ "./src/js/components/plans.js");
/* harmony import */ var _components_cards_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/cards.js */ "./src/js/components/cards.js");
// Компоненты, которые необходимы сразу






// Объявляем функцию для отложенной загрузки тяжелых компонентов
function initHeavyComponents() {
  // Динамический импорт тяжелых компонентов
  __webpack_require__.e(/*! import() */ "src_js_components_products_js").then(__webpack_require__.bind(__webpack_require__, /*! ./components/products.js */ "./src/js/components/products.js"));
  __webpack_require__.e(/*! import() */ "src_js_components_mouse_js").then(__webpack_require__.bind(__webpack_require__, /*! ./components/mouse.js */ "./src/js/components/mouse.js"));
  Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_swiper_modules_index_mjs-node_modules_swiper_swiper_mjs"), __webpack_require__.e("src_js_components_sliders_js")]).then(__webpack_require__.bind(__webpack_require__, /*! ./components/sliders.js */ "./src/js/components/sliders.js"));
  Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_gsap_index_js-node_modules_three_build_three_module_js"), __webpack_require__.e("src_js_components_romb_js")]).then(__webpack_require__.bind(__webpack_require__, /*! ./components/romb.js */ "./src/js/components/romb.js"));
  Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_aos_dist_aos_js"), __webpack_require__.e("src_js_components_aos_js")]).then(__webpack_require__.bind(__webpack_require__, /*! ./components/aos.js */ "./src/js/components/aos.js"));
}

// Очень тяжелые компоненты загружаем с большей задержкой
function initVeryHeavyComponents() {
  // Проверяем наличие элементов перед загрузкой
  if (document.querySelector(".lb__canvas")) {
    Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_matter-js_build_matter_js"), __webpack_require__.e("src_js_components_matter_js")]).then(__webpack_require__.bind(__webpack_require__, /*! ./components/matter.js */ "./src/js/components/matter.js"));
  }
}

/***/ }),

/***/ "./src/js/_vars.js":
/*!*************************!*\
  !*** ./src/js/_vars.js ***!
  \*************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  windowEl: window,
  documentEl: document,
  htmlEl: document.documentElement,
  bodyEl: document.body
});

/***/ }),

/***/ "./src/js/components/cards.js":
/*!************************************!*\
  !*** ./src/js/components/cards.js ***!
  \************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
document.addEventListener("DOMContentLoaded", function () {
  const tabs = document.querySelectorAll(".clients__tab");
  const cards = document.querySelectorAll(".clients__card");
  const clientsItems = document.querySelector(".clients__items");
  const maxVisibleCards = parseInt(clientsItems.getAttribute("data-visible-cards")) || Infinity;
  function filterCards(category) {
    let visibleCards = 0;

    // Сначала добавляем класс hidden всем карточкам
    cards.forEach(card => {
      card.classList.add("hidden");
    });
    cards.forEach(card => {
      const cardCategories = card.getAttribute("data-client-card").split(",").map(c => c.trim());
      const shouldShow = category === "all" || cardCategories.includes(category);
      if (shouldShow && visibleCards < maxVisibleCards) {
        card.classList.remove("hidden");
        visibleCards++;
      } else {
        card.classList.add("hidden");
      }
    });
    clientsItems.setAttribute("data-visible-cards", visibleCards);
  }
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      const category = tab.getAttribute("data-client");
      filterCards(category);
    });
  });
  filterCards("all");
});

/***/ }),

/***/ "./src/js/components/delivery.js":
/*!***************************************!*\
  !*** ./src/js/components/delivery.js ***!
  \***************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
const deliveryItems = document.querySelectorAll(".d-item");
if (deliveryItems.length > 0) {
  // Функция для проверки и управления активным состоянием блоков на мобильных устройствах
  const checkMobileState = () => {
    if (window.innerWidth < 850) {
      // На мобильных устройствах при загрузке убираем active у всех блоков
      deliveryItems.forEach(item => {
        if (item.classList.contains("active")) {
          item.classList.remove("active");
          const content = item.querySelector(".d-item__text");
          const topContent = item.querySelector(".d-item__top");
          if (content && topContent) {
            content.style.maxHeight = null;
            topContent.style.display = "grid";
            topContent.style.opacity = 1;
          }
        }
      });
    }
  };

  // Вызываем функцию при загрузке страницы
  checkMobileState();

  // Следим за изменением размера окна
  window.addEventListener("resize", checkMobileState);
  function clearActive(currentItem) {
    deliveryItems.forEach(item => {
      if (item !== currentItem && item.classList.contains("active")) {
        item.classList.remove("active");
        const content = item.querySelector(".d-item__text");
        const topContent = item.querySelector(".d-item__top");
        content.style.maxHeight = content.scrollHeight + "px";
        const onContentClose = () => {
          topContent.style.display = "grid";
          topContent.style.opacity = 1;
          content.removeEventListener("transitionend", onContentClose);
        };
        requestAnimationFrame(() => {
          content.style.maxHeight = null;
        });
        content.addEventListener("transitionend", onContentClose);
      }
    });
  }
  deliveryItems.forEach(item => {
    const btn = item.querySelector(".d-item__header");
    const content = item.querySelector(".d-item__text");
    const topContent = item.querySelector(".d-item__top");
    if (item.classList.contains("active")) {
      topContent.style.display = "none";
      content.style.maxHeight = content.scrollHeight + "px";
    }
    btn.addEventListener("click", e => {
      e.preventDefault();
      clearActive(item);
      const isActive = item.classList.toggle("active");
      if (isActive) {
        topContent.style.display = "none";
        topContent.style.opacity = 0;
        content.style.maxHeight = content.scrollHeight + "px";
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
        const onContentClose = () => {
          topContent.style.display = "grid";
          topContent.style.opacity = 1;
          content.removeEventListener("transitionend", onContentClose);
        };
        requestAnimationFrame(() => {
          content.style.maxHeight = null;
        });
        content.addEventListener("transitionend", onContentClose);
      }
    });
  });
}

// Функция для управления отображением d-item блоков
function initDeliveryItems() {
  // Находим все контейнеры с data-delivery-items
  const containers = document.querySelectorAll("[data-delivery-items]");
  if (!containers.length) return;
  containers.forEach(container => {
    const visibleItems = parseInt(container.dataset.deliveryItems, 10);
    if (isNaN(visibleItems) || visibleItems <= 0) return;
    const deliveryItems = container.querySelectorAll(".d-item");
    if (deliveryItems.length <= visibleItems) return;

    // Функция для обновления видимости элементов
    const updateVisibility = () => {
      // Проверяем ширину экрана
      if (window.innerWidth < 769) {
        // Скрываем элементы свыше указанного количества
        deliveryItems.forEach((item, index) => {
          if (index >= visibleItems) {
            item.style.display = "none";
          }
        });

        // Показываем кнопку только если есть скрытые элементы
        showMoreBtn.style.display = "block";
      } else {
        // На десктопе показываем все элементы
        deliveryItems.forEach(item => {
          item.style.display = "";
        });

        // Скрываем кнопку
        showMoreBtn.style.display = "none";
      }
    };

    // Создаем кнопку "Показать ещё"
    const showMoreBtn = container.querySelector(".delivery-more-btn");

    // Обработчик клика по кнопке
    showMoreBtn.addEventListener("click", () => {
      // Показываем все элементы
      deliveryItems.forEach(item => {
        item.style.display = "";
      });

      // Скрываем кнопку после клика
      showMoreBtn.style.display = "none";
    });

    // Вызываем функцию при загрузке страницы
    updateVisibility();

    // Добавляем обработчик изменения размера окна
    window.addEventListener("resize", updateVisibility);
  });
}

// Инициализация компонента при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
  initDeliveryItems();
});

/***/ }),

/***/ "./src/js/components/faq.js":
/*!**********************************!*\
  !*** ./src/js/components/faq.js ***!
  \**********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
const faqItems = document.querySelectorAll(".faq-item");
if (faqItems.length > 0) {
  function clearActive(cur) {
    faqItems.forEach(item => {
      if (item == cur) return;
      item.querySelector(".faq-item__content").style.maxHeight = null;
      item.classList.remove("active");
    });
  }
  faqItems.forEach(item => {
    const btn = item.querySelector(".faq-item__header");
    const content = item.querySelector(".faq-item__content");
    btn.addEventListener("click", e => {
      e.preventDefault();
      let isActive = item.classList.toggle("active");
      clearActive(item);
      content.style.maxHeight = isActive ? content.scrollHeight + "px" : null;
    });
    if (item.classList.contains("active")) {
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
}

/***/ }),

/***/ "./src/js/components/header.js":
/*!*************************************!*\
  !*** ./src/js/components/header.js ***!
  \*************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _functions_throttle_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../functions/throttle.js */ "./src/js/functions/throttle.js");

document.addEventListener("DOMContentLoaded", () => {
  const sections = Array.from(document.querySelectorAll("[data-header]"));
  if (sections.length > 0) {
    const header = document.querySelector("header"); // Ваш элемент хедера
    const offset = 0; // Смещение для проверки, можно настроить при необходимости

    // Функция получения текущей секции, соприкасающейся с верхом viewport
    function updateHeaderClass() {
      const scrollY = window.scrollY || window.pageYOffset;

      // Находим все секции, у которых верхняя граница <= верха viewport + offset
      // И из них берем ту, у которой значение верхней границы ближе всех к верху
      let currentSection = null;
      let minDistance = Infinity;
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const distance = Math.abs(rect.top - offset);
        if (rect.top <= offset && distance < minDistance) {
          minDistance = distance;
          currentSection = section;
        }
      });
      if (currentSection) {
        // Получаем значение data-header для текущей активной секции
        const headerClass = currentSection.getAttribute("data-header");

        // Сбрасываем все классы, которые отвечают за цвет (можно указать конкретный префикс)
        header.className = header.className.split(" ").filter(c => !c.startsWith("header-color-")).join(" ");

        // Добавляем класс, соответствующий секции
        header.classList.add(`header-color-${headerClass}`);
      }
    }
    let throttledUpdate = (0,_functions_throttle_js__WEBPACK_IMPORTED_MODULE_0__.throttle)(updateHeaderClass);
    window.addEventListener("scroll", throttledUpdate);
    window.addEventListener("resize", throttledUpdate);

    // Запускаем один раз при загрузке страницы
    updateHeaderClass();
  }
});

/***/ }),

/***/ "./src/js/components/loyal-items.js":
/*!******************************************!*\
  !*** ./src/js/components/loyal-items.js ***!
  \******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ initLoyalItems)
/* harmony export */ });
/**
 * Компонент для управления отображением loyal-item блоков
 * Скрывает излишние блоки на мобильных устройствах и добавляет кнопку "Показать ещё"
 */
function initLoyalItems() {
  // Находим все контейнеры с data-loyal-items
  const containers = document.querySelectorAll("[data-loyal-items]");
  if (!containers.length) return;
  containers.forEach(container => {
    const visibleItems = parseInt(container.dataset.loyalItems, 10);
    if (isNaN(visibleItems) || visibleItems <= 0) return;
    const loyalItems = container.querySelectorAll(".loyal-item");
    if (loyalItems.length <= visibleItems) return;

    // Функция для обновления видимости элементов
    const updateVisibility = () => {
      // Проверяем ширину экрана
      if (window.innerWidth < 850) {
        // Скрываем элементы свыше указанного количества
        loyalItems.forEach((item, index) => {
          if (index >= visibleItems) {
            item.style.display = "none";
          }
        });

        // Показываем кнопку только если есть скрытые элементы
        showMoreBtn.style.display = "block";
      } else {
        // На десктопе показываем все элементы
        loyalItems.forEach(item => {
          item.style.display = "";
        });

        // Скрываем кнопку
        showMoreBtn.style.display = "none";
      }
    };

    // Создаем кнопку "Показать ещё"
    const showMoreBtn = container.querySelector(".loyal-more-btn");

    // Обработчик клика по кнопке
    showMoreBtn.addEventListener("click", () => {
      // Показываем все элементы
      loyalItems.forEach(item => {
        item.style.display = "";
      });

      // Скрываем кнопку после клика
      showMoreBtn.style.display = "none";
    });

    // Вызываем функцию при загрузке страницы
    updateVisibility();

    // Добавляем обработчик изменения размера окна
    window.addEventListener("resize", updateVisibility);
  });
}

/***/ }),

/***/ "./src/js/components/plans.js":
/*!************************************!*\
  !*** ./src/js/components/plans.js ***!
  \************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
const planTabs = document.querySelectorAll(".plans__tab");
if (planTabs.length > 0) {
  const planContent = document.querySelectorAll(".plans__content");
  const clearActive = () => {
    planContent.forEach(el => el.classList.add("hidden"));
    planTabs.forEach(el => el.classList.remove("active"));
  };
  planTabs.forEach(tab => {
    tab.addEventListener("click", e => {
      e.preventDefault();
      clearActive();
      const type = tab.dataset.planTab;
      tab.classList.add("active");
      document.querySelector(`.plans__content[data-plan=${type}]`).classList.remove("hidden");
    });
  });
}

/***/ }),

/***/ "./src/js/functions/burger.js":
/*!************************************!*\
  !*** ./src/js/functions/burger.js ***!
  \************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _functions_disable_scroll_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../functions/disable-scroll.js */ "./src/js/functions/disable-scroll.js");
/* harmony import */ var _functions_enable_scroll_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../functions/enable-scroll.js */ "./src/js/functions/enable-scroll.js");


(function () {
  const burger = document?.querySelector("[data-burger]");
  const menu = document?.querySelector("[data-menu]");
  const menuItems = document?.querySelectorAll("[data-menu-item]");
  const overlay = document?.querySelector("[data-menu-overlay]");
  burger?.addEventListener("click", e => {
    burger?.classList.toggle("burger--active");
    menu?.classList.toggle("menu--active");
    if (menu?.classList.contains("menu--active")) {
      burger?.setAttribute("aria-expanded", "true");
      burger?.setAttribute("aria-label", "Закрыть меню");
      (0,_functions_disable_scroll_js__WEBPACK_IMPORTED_MODULE_0__.disableScroll)();
    } else {
      burger?.setAttribute("aria-expanded", "false");
      burger?.setAttribute("aria-label", "Открыть меню");
      (0,_functions_enable_scroll_js__WEBPACK_IMPORTED_MODULE_1__.enableScroll)();
    }
  });
  overlay?.addEventListener("click", () => {
    burger?.setAttribute("aria-expanded", "false");
    burger?.setAttribute("aria-label", "Открыть меню");
    burger.classList.remove("burger--active");
    menu.classList.remove("menu--active");
    (0,_functions_enable_scroll_js__WEBPACK_IMPORTED_MODULE_1__.enableScroll)();
  });
  menuItems?.forEach(el => {
    el.addEventListener("click", () => {
      burger?.setAttribute("aria-expanded", "false");
      burger?.setAttribute("aria-label", "Открыть меню");
      burger.classList.remove("burger--active");
      menu.classList.remove("menu--active");
      (0,_functions_enable_scroll_js__WEBPACK_IMPORTED_MODULE_1__.enableScroll)();
    });
  });
})();

/***/ }),

/***/ "./src/js/functions/disable-scroll.js":
/*!********************************************!*\
  !*** ./src/js/functions/disable-scroll.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   disableScroll: () => (/* binding */ disableScroll)
/* harmony export */ });
/* harmony import */ var _vars_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_vars.js */ "./src/js/_vars.js");

const disableScroll = () => {
  const fixBlocks = document?.querySelectorAll('.fixed-block');
  const pagePosition = window.scrollY;
  const paddingOffset = `${window.innerWidth - _vars_js__WEBPACK_IMPORTED_MODULE_0__["default"].bodyEl.offsetWidth}px`;
  _vars_js__WEBPACK_IMPORTED_MODULE_0__["default"].htmlEl.style.scrollBehavior = 'none';
  fixBlocks.forEach(el => {
    el.style.paddingRight = paddingOffset;
  });
  _vars_js__WEBPACK_IMPORTED_MODULE_0__["default"].bodyEl.style.paddingRight = paddingOffset;
  _vars_js__WEBPACK_IMPORTED_MODULE_0__["default"].bodyEl.classList.add('dis-scroll');
  _vars_js__WEBPACK_IMPORTED_MODULE_0__["default"].bodyEl.dataset.position = pagePosition;
  _vars_js__WEBPACK_IMPORTED_MODULE_0__["default"].bodyEl.style.top = `-${pagePosition}px`;
};

/***/ }),

/***/ "./src/js/functions/enable-scroll.js":
/*!*******************************************!*\
  !*** ./src/js/functions/enable-scroll.js ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   enableScroll: () => (/* binding */ enableScroll)
/* harmony export */ });
/* harmony import */ var _vars_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_vars.js */ "./src/js/_vars.js");

const enableScroll = () => {
  const fixBlocks = document?.querySelectorAll('.fixed-block');
  const body = document.body;
  const pagePosition = parseInt(_vars_js__WEBPACK_IMPORTED_MODULE_0__["default"].bodyEl.dataset.position, 10);
  fixBlocks.forEach(el => {
    el.style.paddingRight = '0px';
  });
  _vars_js__WEBPACK_IMPORTED_MODULE_0__["default"].bodyEl.style.paddingRight = '0px';
  _vars_js__WEBPACK_IMPORTED_MODULE_0__["default"].bodyEl.style.top = 'auto';
  _vars_js__WEBPACK_IMPORTED_MODULE_0__["default"].bodyEl.classList.remove('dis-scroll');
  window.scroll({
    top: pagePosition,
    left: 0
  });
  _vars_js__WEBPACK_IMPORTED_MODULE_0__["default"].bodyEl.removeAttribute('data-position');
  _vars_js__WEBPACK_IMPORTED_MODULE_0__["default"].htmlEl.style.scrollBehavior = 'smooth';
};

/***/ }),

/***/ "./src/js/functions/throttle.js":
/*!**************************************!*\
  !*** ./src/js/functions/throttle.js ***!
  \**************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   throttle: () => (/* binding */ throttle)
/* harmony export */ });
const throttle = function (func) {
  let delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 250;
  let isThrottled = false;
  let savedArgs = null;
  let savedThis = null;
  return function wrap() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    if (isThrottled) {
      savedArgs = args, savedThis = this;
      return;
    }
    func.apply(this, args);
    isThrottled = true;
    setTimeout(() => {
      isThrottled = false;
      if (savedThis) {
        wrap.apply(savedThis, savedArgs);
        savedThis = null;
        savedArgs = null;
      }
    }, delay);
  };
};

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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".main.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	(() => {
/******/ 		var inProgress = {};
/******/ 		var dataWebpackPrefix = "gulp-builder:";
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key, chunkId) => {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if(s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.setAttribute("data-webpack", dataWebpackPrefix + key);
/******/ 		
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach((fn) => (fn(event)));
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
/******/ 	})();
/******/ 	
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
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript && document.currentScript.tagName.toUpperCase() === 'SCRIPT')
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && (!scriptUrl || !/^http(s?):/.test(scriptUrl))) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/^blob:/, "").replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.f.j = (chunkId, promises) => {
/******/ 				// JSONP chunk loading for javascript
/******/ 				var installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
/******/ 				if(installedChunkData !== 0) { // 0 means "already installed".
/******/ 		
/******/ 					// a Promise means "currently loading".
/******/ 					if(installedChunkData) {
/******/ 						promises.push(installedChunkData[2]);
/******/ 					} else {
/******/ 						if(true) { // all chunks have JS
/******/ 							// setup Promise in chunk cache
/******/ 							var promise = new Promise((resolve, reject) => (installedChunkData = installedChunks[chunkId] = [resolve, reject]));
/******/ 							promises.push(installedChunkData[2] = promise);
/******/ 		
/******/ 							// start chunk loading
/******/ 							var url = __webpack_require__.p + __webpack_require__.u(chunkId);
/******/ 							// create error before stack unwound to get useful stacktrace later
/******/ 							var error = new Error();
/******/ 							var loadingEnded = (event) => {
/******/ 								if(__webpack_require__.o(installedChunks, chunkId)) {
/******/ 									installedChunkData = installedChunks[chunkId];
/******/ 									if(installedChunkData !== 0) installedChunks[chunkId] = undefined;
/******/ 									if(installedChunkData) {
/******/ 										var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 										var realSrc = event && event.target && event.target.src;
/******/ 										error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 										error.name = 'ChunkLoadError';
/******/ 										error.type = errorType;
/******/ 										error.request = realSrc;
/******/ 										installedChunkData[1](error);
/******/ 									}
/******/ 								}
/******/ 							};
/******/ 							__webpack_require__.l(url, loadingEnded, "chunk-" + chunkId, chunkId);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 		};
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 		
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkgulp_builder"] = self["webpackChunkgulp_builder"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
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
/* harmony import */ var _functions_burger_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./functions/burger.js */ "./src/js/functions/burger.js");
/* harmony import */ var _components_loyal_items_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/loyal-items.js */ "./src/js/components/loyal-items.js");





// Приоритетные компоненты загружаются сразу
document.addEventListener("DOMContentLoaded", () => {
  // Инициализация компонента для управления loyal-item блоками
  (0,_components_loyal_items_js__WEBPACK_IMPORTED_MODULE_2__["default"])();

  // Загружаем средние по весу компоненты с небольшой задержкой
  setTimeout(() => {
    (0,_components_js__WEBPACK_IMPORTED_MODULE_0__.initHeavyComponents)();
  }, 300);
});

// Отложенная загрузка тяжелых компонентов
window.addEventListener("load", () => {
  // Запускаем анимации SVG после полной загрузки страницы
  setTimeout(() => {
    initSvgAnimations();
    initMapPathAnimations();
  }, 500);

  // Загружаем самые тяжелые компоненты в последнюю очередь
  setTimeout(() => {
    (0,_components_js__WEBPACK_IMPORTED_MODULE_0__.initVeryHeavyComponents)();
  }, 1000);
});

// Выносим SVG анимации в отдельную функцию
function initSvgAnimations() {
  const svgPaths = document.querySelectorAll(".spider path");
  if (svgPaths.length > 0) {
    const items = document.querySelectorAll(".integrate__item");
    const logo = document.querySelector(".int-logo");
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          logo.classList.add("animate");
          setTimeout(() => {
            svgPaths.forEach(path => {
              path.style.animation = "draw 8s forwards 0.4s";
            });
            items.forEach(item => {
              item.style.opacity = 1;
            });
            observer.unobserve(entry.target);
          }, 1300);
        }
      });
    }, {
      threshold: 1
    });
    observer.observe(logo);
  }
}

// Выносим анимации путей карты в отдельную функцию
function initMapPathAnimations() {
  const mapPath = document.querySelector(".map-path");
  if (mapPath) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add("animate");
            observer.unobserve(entry.target);
          }, 1000);
        }
      });
    }, {
      threshold: 1
    });
    document.querySelectorAll(".map-path").forEach(path => {
      observer.observe(path);
    });
  }
}
})();

/******/ })()
;
//# sourceMappingURL=main.js.map