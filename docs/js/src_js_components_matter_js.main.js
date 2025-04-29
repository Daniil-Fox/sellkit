"use strict";
(self["webpackChunkgulp_builder"] = self["webpackChunkgulp_builder"] || []).push([["src_js_components_matter_js"],{

/***/ "./src/js/components/matter.js":
/*!*************************************!*\
  !*** ./src/js/components/matter.js ***!
  \*************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var matter_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! matter-js */ "./node_modules/matter-js/build/matter.js");

const engine = matter_js__WEBPACK_IMPORTED_MODULE_0__.Engine.create();
engine.gravity.y = 0.0;
const container = document.querySelector(".lb__canvas");
const render = matter_js__WEBPACK_IMPORTED_MODULE_0__.Render.create({
  element: document.querySelector("#canvas-container"),
  engine: engine,
  options: {
    width: container.offsetWidth,
    height: container.offsetHeight,
    wireframes: false,
    background: "transparent"
  }
});
const mouse = matter_js__WEBPACK_IMPORTED_MODULE_0__.Mouse.create(render.canvas);
// Установка pixelRatio для более точного отслеживания мыши
mouse.pixelRatio = window.devicePixelRatio || 1;
const mouseConstraint = matter_js__WEBPACK_IMPORTED_MODULE_0__.MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: {
    stiffness: 0.2,
    render: {
      visible: false
    }
  }
});
matter_js__WEBPACK_IMPORTED_MODULE_0__.World.add(engine.world, mouseConstraint);
render.mouse = mouse;
const elements = [
// Ваши элементы...
{
  text: "сео-настройки",
  color: "#f86790",
  fontColor: "#ffffff"
}, {
  text: "Экспресс-полигоны",
  color: "#81ffd2",
  fontColor: "#001840"
}, {
  text: "QR-меню",
  color: "#46caee",
  fontColor: "#ffffff"
}, {
  text: "телеграм бот",
  color: "#b0fcff",
  fontColor: "#001840"
}, {
  text: "PUSH-рассылки",
  color: "#ffddd2",
  fontColor: "#001840"
}, {
  text: "Бронирование столика",
  color: "#fff6a9",
  fontColor: "#001840"
}, {
  text: "модификаторы",
  color: "#3828ce",
  fontColor: "#ffffff"
}, {
  text: "Сегментация",
  color: "#ffc98b",
  fontColor: "#001840"
}, {
  text: "отчёты",
  color: "#f3c7f5",
  fontColor: "#001840"
}, {
  text: "Приложение для курьеров",
  color: "#d0e3ff",
  fontColor: "#001840"
}, {
  text: "Промокоды",
  color: "#001840",
  fontColor: "#ffffff"
}, {
  text: "Авторасчет доставки",
  color: "#c2f6a6",
  fontColor: "#001840"
}, {
  text: "Предзаказ",
  color: "#b2a9ff",
  fontColor: "#ffffff"
}, {
  text: "Оценки и отзывы",
  color: "#f68310",
  fontColor: "#ffffff"
}, {
  text: "Сайт и приложение",
  color: "#ff7370",
  fontColor: "#ffffff"
}];
const bodies = [];
const htmlElements = [];
function createRoundedRectangle(x, y, width, height, radius) {
  const vertices = [{
    x: x - width / 2 + radius,
    y: y - height / 2
  }, {
    x: x + width / 2 - radius,
    y: y - height / 2
  }, {
    x: x + width / 2,
    y: y - height / 2 + radius
  }, {
    x: x + width / 2,
    y: y + height / 2 - radius
  }, {
    x: x + width / 2 - radius,
    y: y + height / 2
  }, {
    x: x - width / 2 + radius,
    y: y + height / 2
  }, {
    x: x - width / 2,
    y: y + height / 2 - radius
  }, {
    x: x - width / 2,
    y: y - height / 2 + radius
  }];
  return matter_js__WEBPACK_IMPORTED_MODULE_0__.Bodies.fromVertices(x, y, vertices, {
    restitution: 0.01,
    friction: 0.005,
    density: 0.01,
    render: {
      visible: false
    }
  });
}

// Создание элементов и тел
elements.forEach(element => {
  const htmlEl = document.createElement("div");
  htmlEl.className = "floating-element";
  htmlEl.textContent = element.text;
  htmlEl.style.backgroundColor = element.color;
  htmlEl.style.fontSize = element.fontSize;
  htmlEl.style.color = element.fontColor;
  htmlEl.contentEditable = "true";
  htmlEl.style.cursor = "grab"; // Добавляем курсор для лучшего UX
  container.appendChild(htmlEl);
  htmlElements.push(htmlEl);

  // Создаем тело с начальной позицией
  const body = createRoundedRectangle(Math.random() * (container.offsetWidth - 200) + 100, Math.max(100, container.offsetHeight * 0.2),
  // Гарантированно размещаем ниже потолка
  htmlEl.offsetWidth, htmlEl.offsetHeight, window.matchMedia("(max-width: 1024px)").matches ? 25 : 50);

  // Проверяем, чтобы тело было ниже потолка
  if (body.position.y < 20) {
    matter_js__WEBPACK_IMPORTED_MODULE_0__.Body.setPosition(body, {
      x: body.position.x,
      y: 100
    });
  }
  bodies.push(body);
});

// Добавление стенок
function createWalls() {
  const walls = [matter_js__WEBPACK_IMPORTED_MODULE_0__.Bodies.rectangle(container.offsetWidth / 2, -11, container.offsetWidth, 20, {
    isStatic: true
  }), matter_js__WEBPACK_IMPORTED_MODULE_0__.Bodies.rectangle(container.offsetWidth / 2, container.offsetHeight + 10, container.offsetWidth, 20, {
    isStatic: true
  }), matter_js__WEBPACK_IMPORTED_MODULE_0__.Bodies.rectangle(-10, container.offsetHeight / 2, 20, container.offsetHeight, {
    isStatic: true
  }), matter_js__WEBPACK_IMPORTED_MODULE_0__.Bodies.rectangle(container.offsetWidth + 10, container.offsetHeight / 2, 20, container.offsetHeight, {
    isStatic: true
  })];
  matter_js__WEBPACK_IMPORTED_MODULE_0__.World.add(engine.world, walls);
}

// Создаем стенки при инициализации
createWalls();
matter_js__WEBPACK_IMPORTED_MODULE_0__.World.add(engine.world, bodies);
matter_js__WEBPACK_IMPORTED_MODULE_0__.Runner.run(engine);
matter_js__WEBPACK_IMPORTED_MODULE_0__.Render.run(render);
function updateElements() {
  bodies.forEach((body, index) => {
    const element = htmlElements[index];
    const angle = body.angle * (180 / Math.PI);
    element.style.transform = `translate(${body.position.x - element.offsetWidth / 2}px, ${body.position.y - element.offsetHeight / 2}px) rotate(${angle}deg)`;
  });
  requestAnimationFrame(updateElements);
}
updateElements();
let blocksHaveFallen = false; // переменная для отслеживания падения блоков
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !blocksHaveFallen) {
      // Когда canvas становится видимым
      // Добавляем таймаут для плавной инициализации
      setTimeout(() => {
        engine.gravity.y = 0.05; // Устанавливаем гравитацию
        blocksHaveFallen = true; // Устанавливаем, что блоки уже упали
      }, 200);
    }
  });
}, {
  root: null,
  threshold: 0.5 // Уменьшаем порог для более раннего срабатывания
});

// Наблюдение за canvas
observer.observe(container);
mouseConstraint.mouse.element.addEventListener("mousedown", function (event) {
  const mousePosition = mouseConstraint.mouse.position;
  const body = matter_js__WEBPACK_IMPORTED_MODULE_0__.Query.point(bodies, mousePosition)[0];
  if (body) {
    const index = bodies.indexOf(body);
    htmlElements[index].style.cursor = "grabbing";
    // Поднимаем элемент над остальными при перетаскивании
    htmlElements[index].style.zIndex = "10";
  }
});
mouseConstraint.mouse.element.addEventListener("mouseup", function (event) {
  htmlElements.forEach(el => {
    el.style.cursor = "grab";
    // Сбрасываем z-index
    el.style.zIndex = "";
  });
});
window.addEventListener("resize", () => {
  render.options.width = container.offsetWidth;
  render.options.height = container.offsetHeight;
  matter_js__WEBPACK_IMPORTED_MODULE_0__.World.clear(engine.world);
  createWalls();
  matter_js__WEBPACK_IMPORTED_MODULE_0__.World.add(engine.world, mouseConstraint);
  bodies.forEach((body, index) => {
    matter_js__WEBPACK_IMPORTED_MODULE_0__.Body.scale(body, htmlElements[index].offsetWidth / Math.max(1, body.bounds.max.x - body.bounds.min.x), htmlElements[index].offsetHeight / Math.max(1, body.bounds.max.y - body.bounds.min.y));
    matter_js__WEBPACK_IMPORTED_MODULE_0__.Body.setPosition(body, {
      x: Math.random() * (container.offsetWidth - htmlElements[index].offsetWidth) + htmlElements[index].offsetWidth / 2,
      y: Math.max(100, Math.random() * container.offsetHeight * 0.3) // Распределяем по верхней части
    });
  });
  matter_js__WEBPACK_IMPORTED_MODULE_0__.World.add(engine.world, bodies);
});

/***/ })

}]);
//# sourceMappingURL=src_js_components_matter_js.main.js.map