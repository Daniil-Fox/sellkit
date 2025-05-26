export default function initProducts() {
  const prodItems = document.querySelectorAll(".prod-item");

  if (!prodItems.length) {
    return;
  }

  function clearActive() {
    const el = document.querySelector(".prod-item.active");
    if (el) {
      const video = el.querySelector("video");
      video?.pause();
      const itemTitle = el.querySelector(".prod-item__title");
      el.classList.remove("active");
      itemTitle.textContent = itemTitle.dataset.fullText;
    }
  }

  // Оптимизированная функция для управления активным состоянием
  function handleScreenSize() {
    // Сбрасываем активное состояние только если есть активный элемент
    clearActive();

    // Если ширина экрана больше 850px, активируем элемент с индексом 3
    if (window.innerWidth >= 850 && prodItems.length > 3) {
      const targetItem = prodItems[1];
      const itemTitle = targetItem.querySelector(".prod-item__title");
      const video = targetItem.querySelector("video");
      const fullText = itemTitle.dataset.fullText;

      // Добавляем класс без задержки
      targetItem.classList.add("active");

      // Оптимизированная загрузка видео
      if (video) {
        video.setAttribute("preload", "metadata");
        // Используем requestAnimationFrame для более плавного воспроизведения
        requestAnimationFrame(() => {
          // Воспроизводим видео только когда метаданные загружены
          if (video.readyState >= 2) {
            video.play();
          } else {
            video.addEventListener(
              "loadeddata",
              () => {
                video.play();
              },
              { once: true }
            );
          }
        });
      }

      // Оптимизированный эффект печатания текста
      itemTitle.textContent = "";
      let index = 0;
      let typingDelay = 35; // Уменьшаем задержку для более быстрого печатания

      const typeEffect = () => {
        if (index < fullText.length) {
          // Добавляем по 2 символа за раз для ускорения
          const charsToAdd = Math.min(2, fullText.length - index);
          itemTitle.textContent += fullText.substring(
            index,
            index + charsToAdd
          );
          index += charsToAdd;
          setTimeout(typeEffect, typingDelay);
        }
      };

      // Используем requestAnimationFrame для более плавного старта анимации
      requestAnimationFrame(typeEffect);
    }
  }

  // Оптимизируем загрузку видео для всех элементов
  prodItems.forEach((item, index) => {
    const itemTitle = item.querySelector(".prod-item__title");
    const video = item.querySelector("video");

    // Сохраняем текст для позднего использования
    itemTitle.dataset.fullText = itemTitle.textContent;

    // Оптимизируем загрузку видео
    if (index !== 1 && video) {
      video.setAttribute("preload", "metadata"); // Отключаем предзагрузку
      video.setAttribute("loading", "lazy"); // Добавляем ленивую загрузку
      video.muted = true; // Гарантируем, что видео будет без звука
    }

    item.addEventListener("click", (e) => {
      e.preventDefault();

      // Проверяем, является ли устройство планшетом
      const isTablet = window.innerWidth <= 1024;

      // Если это планшет и элемент уже активен - закрываем его
      if (isTablet && item.classList.contains("active")) {
        clearActive();
        return;
      }

      clearActive();

      const fullText = itemTitle.dataset.fullText;
      itemTitle.textContent = "";

      item.classList.add("active");

      // Оптимизированное воспроизведение видео
      if (video) {
        if (video.readyState >= 2) {
          video.play();
        } else {
          video.load(); // Загружаем видео при необходимости
          video.addEventListener(
            "loadeddata",
            () => {
              video.play();
            },
            { once: true }
          );
        }
      }

      // Оптимизированный эффект печатания
      let index = 0;
      let typingDelay = 35; // Уменьшенная задержка

      const typeEffect = () => {
        if (index < fullText.length) {
          const charsToAdd = Math.min(2, fullText.length - index);
          itemTitle.textContent += fullText.substring(
            index,
            index + charsToAdd
          );
          index += charsToAdd;
          setTimeout(typeEffect, typingDelay);
        }
      };

      // Небольшая задержка перед началом эффекта
      setTimeout(typeEffect, 100);
    });
  });

  // Используем requestIdleCallback для неблокирующей инициализации если доступно
  if ("requestIdleCallback" in window) {
    requestIdleCallback(
      () => {
        handleScreenSize();
      },
      { timeout: 500 }
    );
  } else {
    // Fallback для браузеров, не поддерживающих requestIdleCallback
    setTimeout(handleScreenSize, 400);
  }

  // Оптимизированный обработчик изменения размера с дебаунсингом
  let resizeTimeout;
  window.addEventListener("resize", () => {
    // Отменяем предыдущий таймаут при новом изменении размера
    clearTimeout(resizeTimeout);
    // Создаем новый таймаут
    resizeTimeout = setTimeout(handleScreenSize, 200);
  });
}
