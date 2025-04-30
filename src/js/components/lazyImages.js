/**
 * Модуль для ленивой загрузки изображений с оптимизацией для мобильных устройств
 */

export default function initLazyLoad() {
  // Проверяем, является ли устройство мобильным
  const isMobile = window.innerWidth < 768;

  // Проверяем, является ли устройство iOS
  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  // Проверяем поддержку нативной ленивой загрузки
  if ("loading" in HTMLImageElement.prototype) {
    // Браузер поддерживает атрибут loading="lazy"
    console.log("Native lazy loading is supported");

    // Даже при поддержке нативной ленивой загрузки,
    // для iOS устройств добавляем дополнительную оптимизацию для приоритизации изображений
    if (isIOS) {
      optimizeImagesForIOS();
    }
  } else {
    // Браузер не поддерживает атрибут loading="lazy", добавляем IntersectionObserver
    console.log(
      "Native lazy loading is not supported, using IntersectionObserver"
    );

    // Получаем все изображения с атрибутом loading="lazy"
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');

    // Оптимизация: разбиваем обработку изображений на порции
    // для мобильных устройств, чтобы не блокировать основной поток
    if (isMobile && lazyImages.length > 10) {
      batchProcessImages(lazyImages);
    } else {
      // Для десктопа или небольшого количества изображений используем стандартный подход
      setupIntersectionObserver(lazyImages);
    }
  }

  // Функция для предзагрузки важных изображений
  function preloadCriticalImages() {
    // Находим только действительно критические изображения
    // Для мобильных устройств ограничиваем количество предзагружаемых изображений
    const prioritySelector = isMobile
      ? 'img[fetchpriority="high"]:not([loading="lazy"]):nth-child(-n+3)'
      : 'img[fetchpriority="high"]';

    const criticalImages = document.querySelectorAll(prioritySelector);

    // Предзагружаем только ограниченное количество изображений для экономии трафика
    const maxPreload = isMobile ? 3 : 5;
    const imagesToPreload = Array.from(criticalImages).slice(0, maxPreload);

    imagesToPreload.forEach((image) => {
      // Проверяем, загружено ли уже изображение
      if (image.complete && image.naturalWidth > 0) return;

      // Создаем объект для предзагрузки
      const preloadLink = document.createElement("link");
      preloadLink.rel = "preload";
      preloadLink.as = "image";
      preloadLink.href = image.src;
      preloadLink.type = image.src.endsWith(".webp")
        ? "image/webp"
        : image.src.endsWith(".svg")
        ? "image/svg+xml"
        : image.src.endsWith(".png")
        ? "image/png"
        : "image/jpeg";

      // Добавляем в head
      document.head.appendChild(preloadLink);
    });
  }

  // Функция для разбиения обработки изображений на порции
  function batchProcessImages(images) {
    const batchSize = isIOS ? 3 : 5; // Меньший размер порции для iOS
    const batchDelay = isIOS ? 300 : 150; // Больший промежуток между порциями для iOS
    const imagesArray = Array.from(images);

    // Функция для обработки одной порции
    function processBatch(startIndex) {
      const batch = imagesArray.slice(startIndex, startIndex + batchSize);
      if (batch.length === 0) return;

      // Настраиваем IntersectionObserver для этой порции
      setupIntersectionObserver(batch);

      // Планируем обработку следующей порции
      if (startIndex + batchSize < imagesArray.length) {
        setTimeout(() => {
          processBatch(startIndex + batchSize);
        }, batchDelay);
      }
    }

    // Начинаем с первой порции
    processBatch(0);
  }

  // Функция для настройки IntersectionObserver
  function setupIntersectionObserver(elementsToObserve) {
    // Используем более агрессивные настройки для мобильных устройств
    const rootMargin = isMobile ? "300px" : "200px";

    // Создаем объект IntersectionObserver с оптимизированными параметрами
    const imageObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const image = entry.target;

            // Если изображение попало в область видимости, начинаем его загрузку
            if (image.dataset.src && !image.src.includes(image.dataset.src)) {
              image.src = image.dataset.src;
            }

            // Если есть data-srcset, устанавливаем его
            if (image.dataset.srcset) {
              image.srcset = image.dataset.srcset;
            }

            // Добавляем обработчик загрузки для улучшения восприятия страницы
            image.onload = function () {
              // Плавно показываем изображение после загрузки
              image.style.opacity = 1;
              image.style.filter = "none";

              // Удаляем обработчик после первого вызова
              image.onload = null;
            };

            // Удаляем атрибут loading="lazy", так как мы уже загрузили изображение
            image.removeAttribute("loading");

            // Прекращаем наблюдение за этим изображением
            observer.unobserve(image);
          }
        });
      },
      {
        rootMargin: rootMargin,
        threshold: 0.01, // Низкий порог для раннего начала загрузки
      }
    );

    // Начинаем наблюдение за всеми ленивыми изображениями в порции
    elementsToObserve.forEach((image) => {
      // Устанавливаем начальные стили для плавного появления
      image.style.opacity = 0;
      image.style.transition = "opacity 0.3s ease-in";
      image.style.filter = "blur(5px)";

      imageObserver.observe(image);
    });
  }

  // Функция для дополнительной оптимизации изображений на iOS
  function optimizeImagesForIOS() {
    // На iOS добавляем дополнительную оптимизацию для критических изображений
    const visibleImages = document.querySelectorAll(
      'img:not([loading="lazy"]):not([fetchpriority="low"])'
    );

    visibleImages.forEach((img) => {
      // Добавляем hardware-acceleration для улучшения отрисовки
      img.style.transform = "translateZ(0)";

      // Устанавливаем размеры для предотвращения перерасчета layout
      if (img.width && img.height) {
        img.setAttribute("width", img.width);
        img.setAttribute("height", img.height);
      }
    });
  }

  // Запускаем предзагрузку критических изображений
  // Используем requestIdleCallback для iOS, чтобы не блокировать основной поток
  if (isIOS && "requestIdleCallback" in window) {
    requestIdleCallback(() => preloadCriticalImages(), { timeout: 1000 });
  } else {
    preloadCriticalImages();
  }
}
