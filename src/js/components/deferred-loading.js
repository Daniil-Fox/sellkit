/**
 * Модуль для отложенной загрузки ресурсов на мобильных устройствах
 * Помогает улучшить показатели PageSpeed за счет приоритизации загрузки критического контента
 */
export default function initDeferredLoading() {
  const isMobile = window.innerWidth < 768;

  // Регистрируем отложенные ресурсы после загрузки основного контента
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupDeferredLoading);
  } else {
    setupDeferredLoading();
  }

  function setupDeferredLoading() {
    // Отложенная загрузка тяжелых скриптов
    deferNonCriticalScripts();

    // Отложенная загрузка декоративных изображений
    lazyLoadDecorativeImages();

    // Отложенная загрузка нижней части страницы
    deferBelowFoldContent();

    // Отложенная загрузка шрифтов
    optimizeFontLoading();
  }

  // Отложенная загрузка тяжелых JS-скриптов
  function deferNonCriticalScripts() {
    // Список скриптов, которые можно загрузить отложенно
    const nonCriticalScripts = [
      // Внешние аналитические скрипты и т.д.
      {
        src: "https://www.google-analytics.com/analytics.js",
        async: true,
        defer: true,
      },
      {
        src: "https://www.googletagmanager.com/gtag/js",
        async: true,
        defer: true,
      },
    ];

    // Откладываем загрузку на несколько секунд после загрузки страницы
    setTimeout(
      () => {
        nonCriticalScripts.forEach((scriptData) => {
          const scriptElement = document.createElement("script");

          // Устанавливаем атрибуты скрипта
          scriptElement.src = scriptData.src;
          if (scriptData.async) scriptElement.async = true;
          if (scriptData.defer) scriptElement.defer = true;

          // Добавляем скрипт в конец body
          document.body.appendChild(scriptElement);
        });
      },
      isMobile ? 3000 : 1000
    ); // Большая задержка для мобильных устройств
  }

  // Отложенная загрузка декоративных изображений
  function lazyLoadDecorativeImages() {
    // Находим все декоративные изображения
    const decorativeImages = document.querySelectorAll(
      '[data-src][aria-hidden="true"]'
    );

    // Настраиваем IntersectionObserver для загрузки изображений при прокрутке
    const imageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;

            // Загружаем изображение
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute("data-src");
            }

            // Прекращаем наблюдение за этим элементом
            imageObserver.unobserve(img);
          }
        });
      },
      {
        rootMargin: "200px", // Предзагрузка за 200px до появления в области видимости
        threshold: 0,
      }
    );

    // Начинаем наблюдение за изображениями
    decorativeImages.forEach((img) => {
      imageObserver.observe(img);
    });
  }

  // Отложенная загрузка контента ниже линии сгиба
  function deferBelowFoldContent() {
    const belowFoldSections = document.querySelectorAll("[data-defer-loading]");

    if (!belowFoldSections.length) return;

    // Устанавливаем минимальную высоту для предотвращения смещения макета
    belowFoldSections.forEach((section) => {
      // Сохраняем минимальную высоту секции
      if (!section.style.minHeight) {
        section.style.minHeight = section.offsetHeight + "px";
      }

      // Скрываем неважное содержимое
      const nonEssentialContent = section.querySelectorAll(
        "[data-non-essential]"
      );
      nonEssentialContent.forEach((element) => {
        element.style.opacity = "0";
        element.style.transition = "opacity 0.3s ease";
      });
    });

    // Используем IntersectionObserver для загрузки контента при приближении
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const section = entry.target;

            // Показываем скрытый контент
            const hiddenContent = section.querySelectorAll(
              "[data-non-essential]"
            );
            hiddenContent.forEach((element) => {
              setTimeout(() => {
                element.style.opacity = "1";
              }, 100);
            });

            // Прекращаем наблюдение
            sectionObserver.unobserve(section);
          }
        });
      },
      {
        rootMargin: "300px", // Начинаем загрузку за 300px до появления
        threshold: 0,
      }
    );

    // Начинаем наблюдение за секциями
    belowFoldSections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }

  // Оптимизация загрузки шрифтов
  function optimizeFontLoading() {
    // Вставка CSS для предотвращения мигания невидимого текста (FOIT)
    const fontDisplayStyle = document.createElement("style");
    fontDisplayStyle.textContent = `
      @font-face {
        font-display: swap !important;
      }
    `;
    document.head.appendChild(fontDisplayStyle);

    // Предзагрузка критических шрифтов
    if (!isMobile) {
      // На десктопах загружаем больше шрифтов
      return;
    }

    // На мобильных устройствах ограничиваем количество загружаемых шрифтов
    const fontLinks = document.querySelectorAll(
      'link[rel="preload"][as="font"]'
    );
    let loadedFonts = 0;

    // Отмечаем некритичные шрифты для отложенной загрузки
    fontLinks.forEach((link) => {
      if (loadedFonts >= 2 && !link.href.includes("woff2")) {
        // Изменяем атрибут для отложенной загрузки
        link.setAttribute("rel", "prefetch");
        link.setAttribute("media", "print");

        // Восстанавливаем нормальную загрузку после того, как критические ресурсы загружены
        window.addEventListener("load", () => {
          setTimeout(() => {
            link.setAttribute("rel", "preload");
            link.setAttribute("media", "all");
          }, 2000);
        });
      }
      loadedFonts++;
    });
  }
}
