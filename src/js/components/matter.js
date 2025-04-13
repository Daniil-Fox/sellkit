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
} from "matter-js";

const engine = Engine.create();
engine.gravity.y = 0.0;

const container = document.querySelector(".lb__canvas");

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

const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: {
    stiffness: 0.2,
    render: { visible: false },
  },
});

World.add(engine.world, mouseConstraint);
render.mouse = mouse;

const elements = [
  // Ваши элементы...
  {
    text: "сео-настройки",
    color: "#f86790",
    fontSize: "32px",
    fontColor: "#ffffff",
  },
  {
    text: "Экспресс-полигоны",
    color: "#81ffd2",
    fontSize: "32px",
    fontColor: "#001840",
  },
  { text: "QR-меню", color: "#46caee", fontSize: "32px", fontColor: "#ffffff" },
  {
    text: "телеграм бот",
    color: "#b0fcff",
    fontSize: "32px",
    fontColor: "#001840",
  },
  {
    text: "PUSH-рассылки",
    color: "#ffddd2",
    fontSize: "32px",
    fontColor: "#001840",
  },
  {
    text: "Бронирование столика",
    color: "#fff6a9",
    fontSize: "32px",
    fontColor: "#001840",
  },
  {
    text: "модификаторы",
    color: "#3828ce",
    fontSize: "32px",
    fontColor: "#ffffff",
  },
  {
    text: "Сегментация",
    color: "#ffc98b",
    fontSize: "32px",
    fontColor: "#001840",
  },
  { text: "отчёты", color: "#f3c7f5", fontSize: "32px", fontColor: "#001840" },
  {
    text: "Приложение для курьеров",
    color: "#d0e3ff",
    fontSize: "32px",
    fontColor: "#001840",
  },
  {
    text: "Промокоды",
    color: "#001840",
    fontSize: "32px",
    fontColor: "#ffffff",
  },
  {
    text: "Авторасчет доставки",
    color: "#c2f6a6",
    fontSize: "32px",
    fontColor: "#001840",
  },
  {
    text: "Предзаказ",
    color: "#b2a9ff",
    fontSize: "32px",
    fontColor: "#ffffff",
  },
  {
    text: "Оценки и отзывы",
    color: "#f68310",
    fontSize: "32px",
    fontColor: "#ffffff",
  },
  {
    text: "Сайт и приложение",
    color: "#ff7370",
    fontSize: "32px",
    fontColor: "#ffffff",
  },
];

const bodies = [];
const htmlElements = [];

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

  return Bodies.fromVertices(x, y, vertices, {
    restitution: 0.01,
    friction: 0.005,
    density: 0.01,
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
  container.appendChild(htmlEl);
  htmlElements.push(htmlEl);

  const body = createRoundedRectangle(
    Math.random() * (container.offsetWidth - 200) + 100,
    50, // Все блоки размещаются в верхней части canvas
    htmlEl.offsetWidth,
    htmlEl.offsetHeight,
    50
  );

  bodies.push(body);
});

// Добавление стенок
function createWalls() {
  const walls = [
    Bodies.rectangle(
      container.offsetWidth / 2,
      -11,
      container.offsetWidth,
      20,
      { isStatic: true }
    ),
    Bodies.rectangle(
      container.offsetWidth / 2,
      container.offsetHeight + 10,
      container.offsetWidth,
      20,
      { isStatic: true }
    ),
    Bodies.rectangle(
      -10,
      container.offsetHeight / 2,
      20,
      container.offsetHeight,
      { isStatic: true }
    ),
    Bodies.rectangle(
      container.offsetWidth + 10,
      container.offsetHeight / 2,
      20,
      container.offsetHeight,
      { isStatic: true }
    ),
  ];

  World.add(engine.world, walls);
}

// Создаем стенки при инициализации
createWalls();
World.add(engine.world, bodies);
Runner.run(engine);
Render.run(render);

function updateElements() {
  bodies.forEach((body, index) => {
    const element = htmlElements[index];
    const angle = body.angle * (180 / Math.PI);
    element.style.transform = `translate(${
      body.position.x - element.offsetWidth / 2
    }px, ${body.position.y - element.offsetHeight / 2}px) rotate(${angle}deg)`;
  });
  requestAnimationFrame(updateElements);
}

updateElements();

let blocksHaveFallen = false; // переменная для отслеживания падения блоков
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !blocksHaveFallen) {
        // Когда canvas становится видимым
        engine.gravity.y = 0.05; // Устанавливаем гравитацию
        blocksHaveFallen = true; // Устанавливаем, что блоки уже упали
      }
    });
  },
  {
    root: null,
    threshold: 1.0,
  }
);

// Наблюдение за canvas
observer.observe(container);

mouseConstraint.mouse.element.addEventListener("mousedown", function (event) {
  const mousePosition = mouseConstraint.mouse.position;
  const body = Query.point(bodies, mousePosition)[0];
  if (body) {
    const index = bodies.indexOf(body);
    htmlElements[index].style.cursor = "grabbing";
  }
});

mouseConstraint.mouse.element.addEventListener("mouseup", function (event) {
  htmlElements.forEach((el) => {
    el.style.cursor = "grab";
  });
});

window.addEventListener("resize", () => {
  render.options.width = container.offsetWidth;
  render.options.height = container.offsetHeight;

  World.clear(engine.world);
  createWalls();
  World.add(engine.world, mouseConstraint);

  bodies.forEach((body, index) => {
    Body.scale(
      body,
      htmlElements[index].offsetWidth / body.bounds.max.x,
      htmlElements[index].offsetHeight / body.bounds.max.y
    );
    Body.setPosition(body, {
      x:
        Math.random() *
          (container.offsetWidth - htmlElements[index].offsetWidth) +
        htmlElements[index].offsetWidth / 2,
      y: 50, // Ставим в верхнюю часть
    });
  });
});
