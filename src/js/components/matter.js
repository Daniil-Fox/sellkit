import {
  Engine,
  Render,
  Runner,
  World,
  Bodies,
  Mouse,
  MouseConstraint,
  Body,
  Query,
  Composite,
  Events,
  Common,
} from "matter-js";
const isMobile = window.matchMedia("(max-width: 768px)").matches;
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
// Создаем движок Matter.js
const engine = Engine.create();
engine.gravity.y = 0.0;

// Получаем контейнер, в котором будет работать Matter.js
const container = document.querySelector(".lb__canvas");

// Создаем рендерер Matter.js
const render = Render.create({
  element: document.querySelector("#canvas-container"),
  engine: engine,
  options: {
    width: container.offsetWidth,
    height: container.offsetHeight,
    wireframes: false,
    background: "transparent",
  },
});

// Создаем объект мыши и настраиваем его для лучшего отслеживания на разных устройствах
const mouse = Mouse.create(render.canvas);
mouse.pixelRatio = window.devicePixelRatio || 1;

// Создаем ограничение для мыши с особыми настройками, которые разрешают скроллинг страницы
const mouseConstraint = MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: {
    stiffness: 0.2,
    render: { visible: false },
  },
});

// Важно: разрешить прокрутку страницы, когда курсор находится над canvas
// Решение проблемы с блокировкой скроллинга на desktop
render.canvas.style.pointerEvents = "auto";

// Обработчик события колесика мыши для разрешения скроллинга
render.canvas.addEventListener(
  "wheel",
  function (event) {
    // Разрешаем стандартное поведение прокрутки
    event.stopPropagation();
  },
  { passive: true }
);

// Полностью отключаем обработку касаний для canvas на мобильных устройствах
// Это разрешит скроллинг и не будет мешать взаимодействию с элементами
if (window.matchMedia("(max-width: 768px)").matches) {
  render.canvas.style.touchAction = "auto";

  // Определение, является ли устройство iOS
  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  if (isIOS) {
    // Специальные настройки для iOS
    engine.timing.timeScale = 1.0; // Нормальная скорость симуляции для iOS

    // iOS-специфичный стиль для canvas
    render.canvas.style.webkitTouchCallout = "none";
    render.canvas.style.webkitUserSelect = "none";
    render.canvas.style.webkitTapHighlightColor = "rgba(0,0,0,0)";
  }

  // Отключаем перехват событий касания для физического движка
  mouseConstraint.mouse.element.removeEventListener(
    "touchmove",
    mouseConstraint.mouse.mousemove
  );
  mouseConstraint.mouse.element.removeEventListener(
    "touchstart",
    mouseConstraint.mouse.mousedown
  );
  mouseConstraint.mouse.element.removeEventListener(
    "touchend",
    mouseConstraint.mouse.mouseup
  );

  // Прямая обработка событий для перемещения элементов вместо использования MouseConstraint
  let activeElement = null;
  let offsetX = 0;
  let offsetY = 0;
  let startBodyPos = null;

  container.addEventListener(
    "touchstart",
    function (event) {
      if (event.touches.length > 0) {
        const touchX = event.touches[0].clientX;
        const touchY = event.touches[0].clientY;
        const canvasRect = render.canvas.getBoundingClientRect();
        const mousePosition = {
          x: touchX - canvasRect.left,
          y: touchY - canvasRect.top,
        };

        // Проверяем, коснулся ли пользователь какого-либо элемента
        const body = Query.point(bodies, mousePosition)[0];
        if (body) {
          const index = bodies.indexOf(body);
          activeElement = { body, index, element: htmlElements[index] };
          startBodyPos = { x: body.position.x, y: body.position.y };

          // Расчет смещения для более точного перемещения
          offsetX = mousePosition.x - body.position.x;
          offsetY = mousePosition.y - body.position.y;

          // Визуальная обратная связь
          htmlElements[index].style.cursor = "grabbing";
          htmlElements[index].style.zIndex = "10";

          // Снижаем гравитацию при перетаскивании
          engine.gravity.y = isIOS ? 0.5 : 0.3; // Повышенная гравитация для iOS

          // Для iOS делаем элемент "неподвижным" при перетаскивании
          if (isIOS) {
            Body.setStatic(body, true);
          }

          // Останавливаем скроллинг только если касание на элементе
          event.preventDefault();
        }
      }
    },
    { passive: false }
  );

  container.addEventListener(
    "touchmove",
    function (event) {
      // Если у нас активный элемент, перемещаем его
      if (activeElement && event.touches.length > 0) {
        const touchX = event.touches[0].clientX;
        const touchY = event.touches[0].clientY;
        const canvasRect = render.canvas.getBoundingClientRect();

        // Вычисляем новые координаты с учетом границ контейнера
        const newX = touchX - canvasRect.left - offsetX;
        const newY = touchY - canvasRect.top - offsetY;

        // Проверяем границы, чтобы элемент не вышел за пределы контейнера
        const padding = isIOS ? 20 : 10; // Больший отступ для iOS
        const width = activeElement.element.offsetWidth / 2;
        const height = activeElement.element.offsetHeight / 2;

        // Ограничиваем позицию внутри границ
        const boundedX = Math.max(
          width + padding,
          Math.min(render.options.width - width - padding, newX)
        );
        const boundedY = Math.max(
          height + padding,
          Math.min(render.options.height - height - padding, newY)
        );

        // Сохраняем предыдущую позицию для расчета скорости
        const prevPosition = {
          x: activeElement.body.position.x,
          y: activeElement.body.position.y,
        };

        // Перемещаем тело к новой позиции с проверкой границ
        Body.setPosition(activeElement.body, { x: boundedX, y: boundedY });

        // Обновляем информацию о скорости для реалистичного броска
        activeElement.velocity = {
          x: (boundedX - prevPosition.x) * (isIOS ? 5 : 3), // Увеличенная скорость для iOS
          y: (boundedY - prevPosition.y) * (isIOS ? 5 : 3),
        };

        // Если элемент перемещается более чем на 10px, предотвращаем скроллинг
        if (
          Math.abs(activeElement.body.position.x - startBodyPos.x) > 10 ||
          Math.abs(activeElement.body.position.y - startBodyPos.y) > 10
        ) {
          event.preventDefault();
        }
      }
    },
    { passive: false }
  );

  container.addEventListener(
    "touchend",
    function () {
      if (activeElement) {
        // Для iOS возвращаем динамику элементу
        if (isIOS) {
          Body.setStatic(activeElement.body, false);

          // Даем небольшую задержку перед возвращением гравитации
          setTimeout(() => {
            engine.gravity.y = 0.7;
          }, 50);
        } else {
          // Возвращаем нормальную гравитацию после отпускания
          engine.gravity.y = 0.7;
        }

        // Применяем накопленную скорость как импульс, чтобы сохранить инерцию движения
        if (activeElement.velocity) {
          // Ограничиваем максимальную скорость, чтобы избежать слишком сильных бросков
          const maxSpeed = isIOS ? 15 : 10;
          const vx = Math.min(
            Math.max(-maxSpeed, activeElement.velocity.x),
            maxSpeed
          );
          const vy = Math.min(
            Math.max(-maxSpeed, activeElement.velocity.y),
            maxSpeed
          );

          Body.setVelocity(activeElement.body, { x: vx, y: vy });
        }

        activeElement.element.style.cursor = "grab";
        activeElement.element.style.zIndex = "";

        // Добавляем небольшой случайный боковой импульс для более естественного движения
        const randomX = Math.random() * 0.002 - 0.001;
        Body.applyForce(activeElement.body, activeElement.body.position, {
          x: randomX * activeElement.body.mass,
          y: -0.0005 * activeElement.body.mass,
        });

        activeElement = null;
      }
    },
    { passive: true }
  );

  // Специальная обработка для iOS, чтобы предотвратить нежелательные касания
  if (isIOS) {
    document.addEventListener(
      "gesturestart",
      function (e) {
        e.preventDefault();
      },
      { passive: false }
    );

    // Дополнительное предотвращение масштабирования на iOS
    document.addEventListener(
      "touchmove",
      function (e) {
        if (e.touches.length > 1) {
          e.preventDefault();
        }
      },
      { passive: false }
    );
  }
} else {
  // Решение проблемы с блокировкой скроллинга на мобильных устройствах для десктопа
  render.canvas.addEventListener(
    "touchmove",
    function (event) {
      // Не блокируем стандартное поведение прокрутки страницы
    },
    { passive: true }
  );

  // Добавляем обработчик для контейнера
  container.addEventListener(
    "touchstart",
    function (event) {
      // Пропускаем события скроллинга до обработки Matter.js
    },
    { passive: true }
  );

  container.addEventListener(
    "touchmove",
    function (event) {
      // Пропускаем события скроллинга до обработки Matter.js
    },
    { passive: true }
  );
}

World.add(engine.world, mouseConstraint);
render.mouse = mouse;

// Элементы, которые будут отображаться в canvas
const elements = [
  {
    text: "сео-настройки",
    color: "#f86790",
    fontColor: "#ffffff",
  },
  {
    text: "Экспресс-полигоны",
    color: "#81ffd2",
    fontColor: "#001840",
  },
  { text: "QR-меню", color: "#46caee", fontColor: "#ffffff" },
  {
    text: "телеграм бот",
    color: "#b0fcff",
    fontColor: "#001840",
  },
  {
    text: "PUSH-рассылки",
    color: "#ffddd2",
    fontColor: "#001840",
  },
  {
    text: "Бронирование столика",
    color: "#fff6a9",
    fontColor: "#001840",
  },
  {
    text: "модификаторы",
    color: "#3828ce",
    fontColor: "#ffffff",
  },
  {
    text: "Сегментация",
    color: "#ffc98b",
    fontColor: "#001840",
  },
  { text: "отчёты", color: "#f3c7f5", fontColor: "#001840" },
  {
    text: "Приложение для курьеров",
    color: "#d0e3ff",
    fontColor: "#001840",
  },
  {
    text: "Промокоды",
    color: "#001840",
    fontColor: "#ffffff",
  },
  {
    text: "Авторасчет доставки",
    color: "#c2f6a6",
    fontColor: "#001840",
  },
  {
    text: "Предзаказ",
    color: "#b2a9ff",
    fontColor: "#ffffff",
  },
  {
    text: "Оценки и отзывы",
    color: "#f68310",
    fontColor: "#ffffff",
  },
  {
    text: "Сайт и приложение",
    color: "#ff7370",
    fontColor: "#ffffff",
  },
];

const bodies = [];
const htmlElements = [];

// Функция для создания скругленного прямоугольника
function createRoundedRectangle(x, y, width, height, radius) {
  const vertices = [
    { x: x - width / 2 + radius, y: y - height / 2 },
    { x: x + width / 2 - radius, y: y - height / 2 },
    { x: x + width / 2, y: y - height / 2 + radius },
    { x: x + width / 2, y: y + height / 2 - radius },
    { x: x + width / 2 - radius, y: y + height / 2 },
    { x: x - width / 2 + radius, y: y + height / 2 },
    { x: x - width / 2, y: y + height / 2 - radius },
    { x: x - width / 2, y: y - height / 2 + radius },
  ];

  // Увеличиваем трение воздуха для более реалистичной физики на мобильных устройствах
  const frictionAir = isMobile ? (isIOS ? 0.03 : 0.05) : 0.01;

  return Bodies.fromVertices(x, y, vertices, {
    restitution: 0.3, // Увеличиваем упругость для лучших отскоков
    friction: 0.1, // Небольшое трение с другими телами
    frictionAir: frictionAir, // Трение с воздухом - разное для разных устройств
    density: 0.001, // Меньшая плотность для более легких элементов
    render: {
      visible: false,
    },
  });
}

// Создание элементов и тел
elements.forEach((element) => {
  const htmlEl = document.createElement("div");
  htmlEl.className = "floating-element";
  htmlEl.textContent = element.text;
  htmlEl.style.backgroundColor = element.color;
  htmlEl.style.fontSize = element.fontSize;
  htmlEl.style.color = element.fontColor;
  htmlEl.contentEditable = "true";
  htmlEl.style.cursor = "grab";
  container.appendChild(htmlEl);
  htmlElements.push(htmlEl);

  // Создаем тело с начальной позицией
  const body = createRoundedRectangle(
    Math.random() * (container.offsetWidth - 200) + 100,
    Math.max(100, container.offsetHeight * 0.2),
    htmlEl.offsetWidth,
    htmlEl.offsetHeight,
    window.matchMedia("(max-width: 1024px)").matches ? 25 : 50
  );

  // Проверяем, чтобы тело было ниже потолка
  if (body.position.y < 20) {
    Body.setPosition(body, { x: body.position.x, y: 100 });
  }

  bodies.push(body);
});

// Добавление стенок
function createWalls() {
  // Определение, является ли устройство iOS
  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  // Создаем более толстые и упругие стенки для мобильных устройств
  const wallThickness = window.matchMedia("(max-width: 768px)").matches
    ? 50
    : 20;
  const wallOptions = {
    isStatic: true,
    restitution: isIOS ? 0.4 : 0.2, // Большая упругость для iOS
    friction: isIOS ? 0.05 : 0.1, // Меньшее трение для iOS
    render: {
      visible: false, // Стенки невидимы
    },
  };

  const walls = [
    // Верхняя стенка
    Bodies.rectangle(
      container.offsetWidth / 2,
      -wallThickness / 2,
      container.offsetWidth,
      wallThickness,
      wallOptions
    ),
    // Нижняя стенка
    Bodies.rectangle(
      container.offsetWidth / 2,
      container.offsetHeight + wallThickness / 2,
      container.offsetWidth,
      wallThickness,
      wallOptions
    ),
    // Левая стенка
    Bodies.rectangle(
      -wallThickness / 2,
      container.offsetHeight / 2,
      wallThickness,
      container.offsetHeight,
      wallOptions
    ),
    // Правая стенка
    Bodies.rectangle(
      container.offsetWidth + wallThickness / 2,
      container.offsetHeight / 2,
      wallThickness,
      container.offsetHeight,
      wallOptions
    ),
  ];

  World.add(engine.world, walls);
}

// Добавляем стенки при инициализации
createWalls();
World.add(engine.world, bodies);

// Запускаем физику и рендеринг
Runner.run(engine);
Render.run(render);

// Флаг для отслеживания, был ли контейнер уже инициализирован
let isInitialized = true;

// Флаг для предотвращения повторной перегенерации блоков во время скролла
let isResizing = false;
let resizeTimeout = null;

// Обновление позиций HTML элементов в соответствии с физическими телами
function updateElements() {
  bodies.forEach((body, index) => {
    const element = htmlElements[index];
    if (element && body) {
      const angle = body.angle * (180 / Math.PI);
      element.style.transform = `translate(${
        body.position.x - element.offsetWidth / 2
      }px, ${
        body.position.y - element.offsetHeight / 2
      }px) rotate(${angle}deg)`;
    }
  });
  requestAnimationFrame(updateElements);
}

updateElements();

// Отслеживание видимости контейнера для запуска гравитации
let blocksHaveFallen = false;
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !blocksHaveFallen && isInitialized) {
        setTimeout(() => {
          engine.gravity.y = isMobile ? 0.3 : 0.05;
          blocksHaveFallen = true;

          // Сообщаем о завершении инициализации matter.js
          // для скрытия прелоадера
          window.dispatchEvent(new CustomEvent("matterInitialized"));
        }, 200);
      }
    });
  },
  {
    root: null,
    threshold: 0.5,
  }
);

// Запускаем наблюдение только один раз
observer.observe(container);

// Обработчик изменения размера окна с дебаунсом для предотвращения частых перегенераций
window.addEventListener("resize", () => {
  // Если уже идет процесс ресайза, не запускаем новый
  if (isResizing) return;

  isResizing = true;

  // Очищаем предыдущий таймаут, если он был
  if (resizeTimeout) {
    clearTimeout(resizeTimeout);
  }

  // Ставим таймаут для предотвращения множественных вызовов при скролле
  resizeTimeout = setTimeout(() => {
    // Обновляем размеры только если размер контейнера действительно изменился
    const newWidth = container.offsetWidth;
    const newHeight = container.offsetHeight;

    // Проверяем, действительно ли изменились размеры
    if (
      render.options.width !== newWidth ||
      render.options.height !== newHeight
    ) {
      render.options.width = newWidth;
      render.options.height = newHeight;

      // Обновляем размер canvas
      render.canvas.width = newWidth;
      render.canvas.height = newHeight;

      World.clear(engine.world);
      createWalls();
      World.add(engine.world, mouseConstraint);

      bodies.forEach((body, index) => {
        Body.scale(
          body,
          htmlElements[index].offsetWidth /
            Math.max(1, body.bounds.max.x - body.bounds.min.x),
          htmlElements[index].offsetHeight /
            Math.max(1, body.bounds.max.y - body.bounds.min.y)
        );
        Body.setPosition(body, {
          x:
            Math.random() * (newWidth - htmlElements[index].offsetWidth) +
            htmlElements[index].offsetWidth / 2,
          y: Math.max(100, Math.random() * newHeight * 0.3),
        });
      });

      World.add(engine.world, bodies);
    }

    isResizing = false;
  }, 300); // Достаточно долгий таймаут, чтобы не вызывать перестроение при скролле
});

// Отключаем обновление физики при скролле на мобильных устройствах
let lastScrollTime = 0;
const scrollThreshold = 300; // миллисекунды

window.addEventListener(
  "scroll",
  () => {
    const now = Date.now();

    // Пропускаем обновление физики во время скролла
    if (now - lastScrollTime < scrollThreshold) {
      // При скролле не обновляем физику, только обновляем время последнего скролла
      lastScrollTime = now;
      return;
    }

    lastScrollTime = now;
  },
  { passive: true }
);

// Обработчики событий мыши для визуальной обратной связи
mouseConstraint.mouse.element.addEventListener("mousedown", function (event) {
  const mousePosition = mouseConstraint.mouse.position;
  const body = Query.point(bodies, mousePosition)[0];
  if (body) {
    const index = bodies.indexOf(body);
    htmlElements[index].style.cursor = "grabbing";
    htmlElements[index].style.zIndex = "10";
  }
});

mouseConstraint.mouse.element.addEventListener("mouseup", function (event) {
  htmlElements.forEach((el) => {
    el.style.cursor = "grab";
    el.style.zIndex = "";
  });
});

// Инициализация Matter.js с отправкой события
export default function initMatter() {
  const container = document.querySelector(".matter-container");

  // Диспетчеризуем событие инициализации даже если контейнера нет
  // Это поможет корректно закрыть прелоадер
  setTimeout(() => {
    window.dispatchEvent(new CustomEvent("matterInitialized"));
    console.log("Событие инициализации Matter.js отправлено");
  }, 500);

  // Если контейнера нет, не продолжаем инициализацию
  if (!container) {
    console.log("Matter.js контейнер не найден");
    return;
  }

  // Проверяем видимость контейнера перед инициализацией
  checkContainerVisibility(container, () => {
    // Используем requestIdleCallback для запуска в свободное время
    if (window.requestIdleCallback) {
      window.requestIdleCallback(() => startMatter(container), {
        timeout: 1000,
      });
    } else {
      // Fallback для браузеров без поддержки requestIdleCallback
      setTimeout(() => startMatter(container), 800);
    }
  });
}

// Функция для проверки видимости контейнера с помощью IntersectionObserver
function checkContainerVisibility(container, callback) {
  // Проверяем, виден ли контейнер в viewport
  const observer = new IntersectionObserver(
    (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        observer.disconnect();
        callback();
      }
    },
    { threshold: 0.1 }
  );

  observer.observe(container);
}

// Функция запуска Matter.js
function startMatter(container) {
  console.log("Запуск инициализации Matter.js");

  // Создаем движок
  const engine = Engine.create({
    enableSleeping: true,
    gravity: { x: 0, y: 0.5 },
  });

  // Настраиваем рендерер
  const render = Render.create({
    element: container,
    engine: engine,
    options: {
      width: container.clientWidth,
      height: container.clientHeight,
      wireframes: false,
      background: "transparent",
      pixelRatio: window.devicePixelRatio,
    },
  });

  // Создаем объект мыши с учетом pixel ratio для лучшего отслеживания
  const mouse = Mouse.create(render.canvas);
  mouse.pixelRatio = window.devicePixelRatio || 1;

  // Создаем констрейнт для мыши с возможностью прокрутки
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: {
        visible: false,
      },
    },
    collisionFilter: {
      mask: 0x0001, // Разрешить взаимодействие только с объектами в этой категории
    },
  });

  // Добавляем обработчик прокрутки, чтобы страница скроллилась при прокрутке над canvas
  render.canvas.addEventListener(
    "wheel",
    function (event) {
      // Не блокируем стандартную прокрутку
      event.stopPropagation();
    },
    { passive: true }
  );

  // Добавляем обработчик для мобильных устройств
  render.canvas.addEventListener(
    "touchmove",
    function (event) {
      // Не блокируем стандартное касание и скролл
      event.stopPropagation();
    },
    { passive: true }
  );

  // Добавляем элементы в мир
  createElements(engine, container);

  // Обработка изменения размера окна
  const handleResize = debounce(() => {
    // Обновляем размеры канваса
    render.options.width = container.clientWidth;
    render.options.height = container.clientHeight;
    render.canvas.width = container.clientWidth;
    render.canvas.height = container.clientHeight;

    // Перепозиционируем элементы
    repositionElements(engine, container);

    // Обновляем рендерер
    Render.setPixelRatio(render, window.devicePixelRatio);
    Render.lookAt(render, {
      min: { x: 0, y: 0 },
      max: { x: container.clientWidth, y: container.clientHeight },
    });
  }, 200);

  window.addEventListener("resize", handleResize);

  // Запускаем движок и рендерер
  Render.run(render);
  const runner = Runner.create();
  Runner.run(runner, engine);

  // Добавляем мышь и констрейнт в мир
  Composite.add(engine.world, mouseConstraint);

  // Добавляем обработчик нажатия мыши для перетаскивания только левой кнопкой
  Events.on(mouseConstraint, "mousedown", function (event) {
    if (event.mouse.button !== 0) {
      // 0 - левая кнопка
      // Отключаем перетаскивание для других кнопок
      mouseConstraint.constraint.stiffness = 0;
    } else {
      mouseConstraint.constraint.stiffness = 0.2;
    }
  });

  // Сброс состояния при отпускании кнопки мыши
  Events.on(mouseConstraint, "mouseup", function () {
    mouseConstraint.constraint.stiffness = 0.2;
  });

  console.log("Matter.js успешно инициализирован");
}

// Создание элементов в контейнере
function createElements(engine, container) {
  // Создаем статические стены вокруг контейнера
  const wallOptions = {
    isStatic: true,
    render: { visible: false },
  };

  // Верхняя, нижняя, левая и правая стены
  const walls = [
    Bodies.rectangle(
      container.clientWidth / 2,
      -50,
      container.clientWidth,
      100,
      wallOptions
    ), // верх
    Bodies.rectangle(
      container.clientWidth / 2,
      container.clientHeight + 50,
      container.clientWidth,
      100,
      wallOptions
    ), // низ
    Bodies.rectangle(
      -50,
      container.clientHeight / 2,
      100,
      container.clientHeight,
      wallOptions
    ), // лево
    Bodies.rectangle(
      container.clientWidth + 50,
      container.clientHeight / 2,
      100,
      container.clientHeight,
      wallOptions
    ), // право
  ];

  Composite.add(engine.world, walls);

  // Создаем случайные элементы
  const elements = [];
  const count = Math.min(
    15,
    Math.floor((container.clientWidth * container.clientHeight) / 40000)
  ); // Адаптивное количество элементов

  for (let i = 0; i < count; i++) {
    const size = Common.random(30, 60);
    const x = Common.random(size, container.clientWidth - size);
    const y = Common.random(size, container.clientHeight - size);

    // Используем разные формы для разнообразия
    let element;
    const shapeType = Math.floor(Common.random(0, 3));

    switch (shapeType) {
      case 0:
        element = Bodies.circle(x, y, size / 2, {
          render: {
            fillStyle: getRandomColor(),
            opacity: 0.8,
          },
          collisionFilter: {
            category: 0x0001,
          },
        });
        break;
      case 1:
        element = Bodies.rectangle(x, y, size, size, {
          render: {
            fillStyle: getRandomColor(),
            opacity: 0.8,
          },
          collisionFilter: {
            category: 0x0001,
          },
        });
        break;
      case 2:
        const sides = Math.floor(Common.random(3, 7));
        element = Bodies.polygon(x, y, sides, size / 2, {
          render: {
            fillStyle: getRandomColor(),
            opacity: 0.8,
          },
          collisionFilter: {
            category: 0x0001,
          },
        });
        break;
    }

    elements.push(element);
  }

  // Добавляем элементы в мир
  Composite.add(engine.world, elements);
}

// Функция для получения случайного цвета
function getRandomColor() {
  const colors = [
    "#FF6B6B",
    "#48DBFB",
    "#1DD1A1",
    "#FECA57",
    "#FF9FF3",
    "#A29BFE",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Перепозиционирование статических стен при изменении размера
function repositionElements(engine, container) {
  // Обновляем позиции стен
  Composite.allBodies(engine.world).forEach((body) => {
    if (body.isStatic && body.render.visible === false) {
      const allBodies = Composite.allBodies(engine.world);
      const walls = allBodies.filter(
        (b) => b.isStatic && b.render.visible === false
      );

      if (walls.length >= 4) {
        // Верхняя стена
        Body.setPosition(walls[0], {
          x: container.clientWidth / 2,
          y: -50,
        });
        Body.setVertices(
          walls[0],
          Bodies.rectangle(
            container.clientWidth / 2,
            -50,
            container.clientWidth,
            100
          ).vertices
        );

        // Нижняя стена
        Body.setPosition(walls[1], {
          x: container.clientWidth / 2,
          y: container.clientHeight + 50,
        });
        Body.setVertices(
          walls[1],
          Bodies.rectangle(
            container.clientWidth / 2,
            container.clientHeight + 50,
            container.clientWidth,
            100
          ).vertices
        );

        // Левая стена
        Body.setPosition(walls[2], {
          x: -50,
          y: container.clientHeight / 2,
        });
        Body.setVertices(
          walls[2],
          Bodies.rectangle(
            -50,
            container.clientHeight / 2,
            100,
            container.clientHeight
          ).vertices
        );

        // Правая стена
        Body.setPosition(walls[3], {
          x: container.clientWidth + 50,
          y: container.clientHeight / 2,
        });
        Body.setVertices(
          walls[3],
          Bodies.rectangle(
            container.clientWidth + 50,
            container.clientHeight / 2,
            100,
            container.clientHeight
          ).vertices
        );
      }
    }
  });
}

// Функция debounce для оптимизации обработки событий resize
function debounce(func, wait) {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}
