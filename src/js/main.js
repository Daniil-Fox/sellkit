import "./_components.js";
import "./functions/burger.js";
import initLoyalItems from "./components/loyal-items.js";
import initLazyLoad from "./components/lazyImages.js";

// Инициализация основных компонентов
function initMainComponents() {
  // Инициализация компонента для управления loyal-item блоками
  initLoyalItems();

  // Инициализация анимации SVG путей
  initSvgPathAnimations();

  // Инициализация анимации карты
  initMapPathAnimations();

  // Инициализация модуля ленивой загрузки изображений
  initLazyLoad();
}

// Функция для инициализации анимации SVG путей
function initSvgPathAnimations() {
  const svgPaths = document.querySelectorAll(".spider path");

  if (svgPaths.length > 0) {
    const items = document.querySelectorAll(".integrate__item");
    const logo = document.querySelector(".int-logo");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            logo.classList.add("animate");
            setTimeout(() => {
              svgPaths.forEach((path) => {
                path.style.animation = "draw 8s forwards 0.4s";
              });
              items.forEach((item) => {
                item.style.opacity = 1;
              });
              observer.unobserve(entry.target);
            }, 1300);
          }
        });
      },
      {
        threshold: 1,
      }
    );

    observer.observe(logo);
  }
}

// Функция для инициализации анимации карты
function initMapPathAnimations() {
  const mapPath = document.querySelector(".map-path");

  if (mapPath) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("animate");
              observer.unobserve(entry.target);
            }, 1000);
          }
        });
      },
      {
        threshold: 1,
      }
    );

    document.querySelectorAll(".map-path").forEach((path) => {
      observer.observe(path);
    });
  }
}

// Загрузка тяжелых компонентов
function loadHeavyComponents() {
  // Загружаем Matter.js компонент с задержкой
  import("./components/matter.js")
    .then((module) => {
      // Вызываем инициализацию Matter.js
      module.default();
    })
    .catch((error) => {
      console.error("Ошибка загрузки Matter.js:", error);
    });
}

// Инициализация при загрузке DOM
document.addEventListener("DOMContentLoaded", () => {
  // Инициализируем основные компоненты
  initMainComponents();

  document.querySelector(".footer__link--up").addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo(0, 0);
  });

  // Загружаем тяжелые компоненты с задержкой
  requestIdleCallback
    ? requestIdleCallback(loadHeavyComponents, { timeout: 2000 })
    : setTimeout(loadHeavyComponents, 1000);
});
