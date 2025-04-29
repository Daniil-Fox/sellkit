import "./_components.js";
import { burger } from "./functions/burger.js";
import initLoyalItems from "./components/loyal-items.js";
import { initHeavyComponents, initVeryHeavyComponents } from "./_components.js";
import { initPreloader } from "./components/preloader.js";

// Глобальный флаг завершения загрузки компонентов
let componentsLoaded = false;
let matterInitialized = false;

// Инициализация прелоадера
const preloader = initPreloader();

// Создаем обработчик события для отслеживания инициализации matter.js
const matterInitEvent = new CustomEvent("matterInitialized");

// Отслеживаем завершение инициализации matter.js
window.addEventListener("matterInitialized", () => {
  matterInitialized = true;

  // Проверяем, загрузились ли уже все компоненты
  if (componentsLoaded) {
    // Завершаем работу прелоадера вручную
    finishPreloader();
  }
});

// Функция для завершения работы прелоадера
function finishPreloader() {
  // Добавляем небольшую задержку для более плавного перехода
  setTimeout(() => {
    if (preloader && typeof preloader.finishLoading === "function") {
      preloader.finishLoading();
    }
  }, 300);
}

// Приоритетные компоненты загружаются сразу
document.addEventListener("DOMContentLoaded", () => {
  // Инициализация компонента для управления loyal-item блоками
  initLoyalItems();

  // Загружаем средние по весу компоненты с небольшой задержкой
  setTimeout(() => {
    initHeavyComponents();
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
    // Загружаем matter.js и другие тяжелые компоненты
    initVeryHeavyComponents();

    // Устанавливаем флаг, что компоненты загружены
    componentsLoaded = true;

    // Если matter.js уже инициализирован, закрываем прелоадер
    if (matterInitialized) {
      finishPreloader();
    }
  }, 1000);
});

// Выносим SVG анимации в отдельную функцию
function initSvgAnimations() {
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

// Выносим анимации путей карты в отдельную функцию
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

const upBtn = document.querySelector(".footer__link--up");
if (upBtn) {
  upBtn.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
    });
  });
}
