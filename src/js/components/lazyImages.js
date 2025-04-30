/**
 * Модуль для ленивой загрузки изображений
 */

export default function initLazyLoad() {
  // Проверяем поддержку нативной ленивой загрузки
  if ("loading" in HTMLImageElement.prototype) {
    // Браузер поддерживает атрибут loading="lazy"
    // Ничего делать не нужно, все загрузится автоматически
    console.log("Native lazy loading is supported");
  } else {
    // Браузер не поддерживает атрибут loading="lazy", добавляем IntersectionObserver
    console.log(
      "Native lazy loading is not supported, using IntersectionObserver"
    );

    // Получаем все изображения с атрибутом loading="lazy"
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');

    // Создаем объект IntersectionObserver
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const image = entry.target;
          // Если изображение попало в область видимости, начинаем его загрузку
          image.src = image.dataset.src || image.src;

          // Если есть data-srcset, устанавливаем его
          if (image.dataset.srcset) {
            image.srcset = image.dataset.srcset;
          }

          // Удаляем атрибут loading="lazy", так как мы уже загрузили изображение
          image.removeAttribute("loading");

          // Прекращаем наблюдение за этим изображением
          observer.unobserve(image);
        }
      });
    });

    // Начинаем наблюдение за всеми ленивыми изображениями
    lazyImages.forEach((image) => {
      imageObserver.observe(image);
    });
  }

  // Функция для предзагрузки важных изображений
  function preloadCriticalImages() {
    const criticalImages = document.querySelectorAll(
      'img[fetchpriority="high"]'
    );

    criticalImages.forEach((image) => {
      // Создаем объект для предзагрузки
      const preloadLink = document.createElement("link");
      preloadLink.rel = "preload";
      preloadLink.as = "image";
      preloadLink.href = image.src;
      preloadLink.type = image.src.endsWith(".webp")
        ? "image/webp"
        : "image/jpeg";

      // Добавляем в head
      document.head.appendChild(preloadLink);
    });
  }

  // Запускаем предзагрузку критических изображений
  preloadCriticalImages();
}
