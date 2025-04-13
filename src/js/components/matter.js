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
engine.gravity.y = 0.05;

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
    Math.random() * (container.offsetHeight - 100) + 50,
    htmlEl.offsetWidth,
    htmlEl.offsetHeight,
    50
  );

  bodies.push(body);
});

const walls = [
  Bodies.rectangle(container.offsetWidth / 2, -11, container.offsetWidth, 20, {
    isStatic: true,
    render: {
      visible: false,
    },
  }),
  Bodies.rectangle(
    container.offsetWidth / 2,
    container.offsetHeight + 10,
    container.offsetWidth,
    20,
    {
      isStatic: true,
      render: {
        visible: false,
      },
    }
  ),
  Bodies.rectangle(
    -10,
    container.offsetHeight / 2,
    20,
    container.offsetHeight,
    {
      isStatic: true,
      render: {
        visible: false,
      },
    }
  ),
  Bodies.rectangle(
    container.offsetWidth + 10,
    container.offsetHeight / 2,
    20,
    container.offsetHeight,
    {
      isStatic: true,
      render: {
        visible: false,
      },
    }
  ),
];

World.add(engine.world, [...bodies, ...walls]);

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

setInterval(() => {
  if (!mouseConstraint.body) {
    bodies.forEach((body) => {
      Body.applyForce(body, body.position, {
        x: (Math.random() - 0.5) * 0.001,
        y: (Math.random() - 0.5) * 0.001,
      });
    });
  }
}, 3000);

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
