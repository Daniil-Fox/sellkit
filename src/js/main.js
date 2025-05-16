import {
  initProducts,
  initSliders,
  initHeader,
  initDelivery,
  initRomb,
  initAOS,
  initLoyalItems,
  initLazyLoad,
  initDeferredLoading,
} from "./_components.js";
import "./functions/burger.js";

// Список функций для отложенной инициализации
const deferredFunctions = [];

// Функция для отложенной инициализации компонентов
function addDeferred(fn) {
  deferredFunctions.push(fn);
}

// Инициализация основных компонентов
function initMainComponents() {
  // Инициализация отложенной загрузки ресурсов - запускаем первым для оптимизации
  initDeferredLoading();

  // Инициализация компонента для управления loyal-item блоками
  initLoyalItems();

  // Инициализация модуля ленивой загрузки изображений - выполняем сразу, это критично
  initLazyLoad();

  // Инициализация AOS
  initAOS();

  // Инициализация слайдеров
  initSliders();

  // Инициализация шапки
  initHeader();

  // Инициализация блока доставки
  initDelivery();

  // Инициализация 3D ромба
  initRomb();

  // Инициализация продуктов
  initProducts();

  // Добавляем остальные компоненты в очередь отложенных инициализаций
  addDeferred(initSvgPathAnimations);
  addDeferred(initMapPathAnimations);
}

// Функция для инициализации анимации SVG путей
function initSvgPathAnimations() {
  const svgPaths = document.querySelectorAll(".spider path");

  if (svgPaths.length > 0) {
    const items = document.querySelectorAll(".integrate__item");
    const logo = document.querySelector(".int-logo");

    // Используем меньший порог для мобильных устройств
    const threshold = window.innerWidth < 768 ? 0.25 : 0.5;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            logo.classList.add("animate");

            // Используем requestAnimationFrame вместо setTimeout для оптимизации
            requestAnimationFrame(() => {
              // Добавим таймаут, но уменьшим его на мобильных
              const isMobile = window.innerWidth < 768;
              const delay = isMobile ? 500 : 800;

              setTimeout(() => {
                // На iOS используем transform и opacity вместо анимаций
                const isIOS =
                  /iPad|iPhone|iPod/.test(navigator.userAgent) &&
                  !window.MSStream;

                svgPaths.forEach((path) => {
                  if (isIOS) {
                    path.style.strokeDashoffset = "0";
                    path.style.transition = "stroke-dashoffset 5s ease-in-out";
                  } else {
                    path.style.animation = "draw 5s forwards 0.3s";
                  }
                });

                items.forEach((item, index) => {
                  // Добавляем постепенное появление для плавности
                  setTimeout(() => {
                    item.style.opacity = 1;
                  }, index * 70);
                });

                observer.unobserve(entry.target);
              }, delay);
            });
          }
        });
      },
      {
        threshold: threshold,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    observer.observe(logo);
  }
}

// Функция для инициализации анимации карты
function initMapPathAnimations() {
  const mapPath = document.querySelector(".map-path");

  if (mapPath) {
    // Оптимизируем порог для мобильных
    const threshold = window.innerWidth < 768 ? 0.1 : 0.3;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Используем RAF для синхронизации с кадрами отрисовки
            requestAnimationFrame(() => {
              const delay = window.innerWidth < 768 ? 600 : 1000;
              setTimeout(() => {
                entry.target.classList.add("animate");
                observer.unobserve(entry.target);
              }, delay);
            });
          }
        });
      },
      {
        threshold: threshold,
        rootMargin: "0px 0px -5% 0px",
      }
    );

    document.querySelectorAll(".map-path").forEach((path) => {
      observer.observe(path);
    });
  }
}

// Загрузка тяжелых компонентов
function loadHeavyComponents() {
  const isMobile = window.innerWidth < 768;

  // На мобильных устройствах делаем еще большую задержку для Matter.js
  const matterDelay = isMobile ? 2500 : 1000;

  setTimeout(() => {
    // Импортируем Matter.js только когда пользователь уже взаимодействовал со страницей
    import(/* webpackChunkName: "matter" */ "./components/matter.js")
      .then((module) => {
        // Инициализируем Matter.js с помощью функции initMatter
        if (typeof module.initMatter === "function") {
          module.initMatter();
        } else {
          console.warn("Функция initMatter не найдена в модуле matter.js");
        }
      })
      .catch((error) => {
        console.error("Ошибка загрузки Matter.js:", error);
      });
  }, matterDelay);
}

// Выполнение отложенных функций с промежутками для снижения нагрузки на CPU
function executeDeferredFunctions() {
  if (!deferredFunctions.length) return;

  const isMobile = window.innerWidth < 768;
  const interval = isMobile ? 300 : 150; // Больший интервал для мобильных

  let index = 0;

  function executeNext() {
    if (index >= deferredFunctions.length) return;

    const fn = deferredFunctions[index++];
    fn();

    if (index < deferredFunctions.length) {
      setTimeout(executeNext, interval);
    }
  }

  executeNext();
}

// Обработчик события прокрутки с оптимизацией
function setupOptimizedScroll() {
  let scrollTimeout;
  let lastKnownScrollPosition = 0;
  let ticking = false;

  window.addEventListener(
    "scroll",
    () => {
      lastKnownScrollPosition = window.scrollY;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Здесь можно добавить обработку события прокрутки
          ticking = false;
        });

        ticking = true;
      }

      // Определяем окончание прокрутки
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        // Код, который должен выполниться после окончания прокрутки
      }, 150);
    },
    { passive: true }
  );
}

// Инициализация при загрузке DOM
document.addEventListener("DOMContentLoaded", () => {
  // Инициализация основных компонентов
  initMainComponents();

  // Запуск отложенных функций
  executeDeferredFunctions();

  // Настройка оптимизированной прокрутки
  setupOptimizedScroll();

  // Загрузка тяжелых компонентов
  loadHeavyComponents();

  // Оптимизируем обработчик кнопки скролла наверх
  const scrollTopButton = document.querySelector(".footer__link--up");
  if (scrollTopButton) {
    scrollTopButton.addEventListener(
      "click",
      (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      },
      { passive: false }
    );
  }
});

// Добавляем обработчик события загрузки окна для дополнительной оптимизации
window.addEventListener(
  "load",
  () => {
    // После полной загрузки страницы можно выполнить дополнительные оптимизации
    setTimeout(() => {
      // Удаляем неиспользуемые обработчики и освобождаем ресурсы
      if (window.performance && window.performance.memory) {
        console.log(
          "Memory usage:",
          window.performance.memory.usedJSHeapSize / 1048576,
          "MB"
        );
      }
    }, 3000);
  },
  { passive: true }
);
