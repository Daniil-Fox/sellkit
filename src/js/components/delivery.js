export default function initDelivery() {
  const deliveryItems = document.querySelectorAll(".d-item");
  const deliverySection = document.querySelector(".delivery");

  if (!deliveryItems.length || !deliverySection) {
    return;
  }

  // Определяем тип устройства заранее
  const isMobile = window.innerWidth < 850;
  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  // Принудительно активируем аппаратное ускорение для всего блока delivery
  deliverySection.style.transform = "translateZ(0)";
  deliverySection.style.backfaceVisibility = "hidden";
  deliverySection.style.perspective = "1000px";

  // Оптимизация для фоновых элементов
  const backgroundShapes = document.querySelectorAll(".delivery__star");
  backgroundShapes.forEach((shape) => {
    shape.style.willChange = "transform";
    // На мобильных снижаем сложность фоновых эффектов
    if (isMobile) {
      shape.style.filter = "blur(200px)"; // Менее детализированное размытие
      shape.style.opacity = "0.5"; // Снижаем непрозрачность
    }
  });

  // Оптимизация анимации раскрытия блоков
  deliveryItems.forEach((item) => {
    // Применяем аппаратное ускорение ко всем элементам
    item.style.transform = "translateZ(0)";
    item.style.backfaceVisibility = "hidden";

    const content = item.querySelector(".d-item__text");
    const topContent = item.querySelector(".d-item__top");

    if (content) {
      // Используем transform вместо maxHeight для анимации там, где это возможно
      content.style.transform = "translateZ(0)";
      content.style.willChange = "transform, max-height";

      // Оптимизируем переходы, делая их короче для мобильных
      if (isMobile) {
        content.style.transition = "max-height 0.25s ease-out";
      }
    }
  });

  // Менее затратная версия функции проверки активного состояния
  const checkMobileState = () => {
    if (window.innerWidth < 850) {
      // Используем batch-обновление DOM
      requestAnimationFrame(() => {
        // Закрываем все блоки на мобильных
        deliveryItems.forEach((item) => {
          item.classList.remove("active");
          const content = item.querySelector(".d-item__text");
          const topContent = item.querySelector(".d-item__top");

          if (content && topContent) {
            content.style.maxHeight = null;
            topContent.style.display = "grid";
            topContent.style.opacity = 1;
          }
        });
      });
    }
  };

  // Вызываем функцию только при изменении размера окна
  let resizeTimeout;
  let prevWindowWidth = window.innerWidth;
  window.addEventListener("resize", () => {
    if (!resizeTimeout) {
      resizeTimeout = setTimeout(() => {
        resizeTimeout = null;
        // Проверяем, изменилась ли ширина окна
        const currentWidth = window.innerWidth;
        // Если был клик по кнопке "показать еще" — пропускаем checkMobileState
        if (window._deliveryShowMoreClicked) return;
        if (currentWidth !== prevWindowWidth) {
          checkMobileState();
          prevWindowWidth = currentWidth;
        }
      }, 250);
    }
  });

  // Оптимизированная функция очистки активных элементов
  function clearActive(currentItem) {
    // Используем batch-обновление DOM
    requestAnimationFrame(() => {
      deliveryItems.forEach((item) => {
        if (item !== currentItem && item.classList.contains("active")) {
          const content = item.querySelector(".d-item__text");
          const topContent = item.querySelector(".d-item__top");

          if (!content || !topContent) return;

          // Фиксируем текущую высоту для плавного закрытия
          const currentHeight = content.scrollHeight;
          content.style.maxHeight = currentHeight + "px";

          // Используем RAF для плавной анимации
          requestAnimationFrame(() => {
            item.classList.remove("active");
            content.style.maxHeight = null;

            // Используем transition вместо setTimeout для более надежного управления
            content.addEventListener(
              "transitionend",
              function onEnd() {
                topContent.style.display = "grid";
                topContent.style.opacity = 1;
                content.removeEventListener("transitionend", onEnd);
              },
              { once: true }
            );
          });
        }
      });
    });
  }

  // Оптимизация обработчиков кликов
  deliveryItems.forEach((item) => {
    const btn = item.querySelector(".d-item__header");
    const content = item.querySelector(".d-item__text");
    const topContent = item.querySelector(".d-item__top");

    if (!content || !topContent || !btn) return;

    // Применяем стили при инициализации
    if (item.classList.contains("active")) {
      requestAnimationFrame(() => {
        topContent.style.display = "none";
        content.style.maxHeight = content.scrollHeight + "px";
      });
    }

    // Оптимизированный обработчик клика
    btn.addEventListener(
      "click",
      (e) => {
        e.preventDefault();

        if (item.hasAttribute("data-animating")) return;
        item.setAttribute("data-animating", "true");

        const isActive = !item.classList.contains("active");
        const contentHeight = content.scrollHeight;

        requestAnimationFrame(() => {
          if (isActive) {
            // На десктопе оставляем автозакрытие, на мобильных убираем
            if (!isMobile) {
              clearActive(item);
            }

            requestAnimationFrame(() => {
              item.classList.add("active");
              topContent.style.display = "none";
              topContent.style.opacity = 0;
              content.style.maxHeight = contentHeight + "px";

              // Скролл только на мобильных
              if (isMobile) {
                const headerHeight = 80;
                const offset = 20;
                const itemTop =
                  item.getBoundingClientRect().top + window.scrollY;
                const randomOffset = Math.random() * 2 - 1;

                window.scrollTo({
                  top: itemTop - headerHeight - offset + randomOffset,
                });
              }
            });

            content.addEventListener(
              "transitionend",
              function onEnd() {
                item.removeAttribute("data-animating");
                content.removeEventListener("transitionend", onEnd);
              },
              { once: true }
            );
          } else {
            // Логика закрытия элемента
            item.classList.remove("active");
            content.style.maxHeight = contentHeight + "px";

            requestAnimationFrame(() => {
              setTimeout(
                () => {
                  content.style.maxHeight = null;
                },
                isIOS ? 20 : 5
              );

              content.addEventListener(
                "transitionend",
                function onEnd() {
                  topContent.style.display = "grid";
                  topContent.style.opacity = 1;
                  item.removeAttribute("data-animating");
                  content.removeEventListener("transitionend", onEnd);
                },
                { once: true }
              );
            });
          }
        });
      },
      { passive: false }
    );
  });

  // Оптимизация для скролла
  let scrollTimeout;
  window.addEventListener(
    "scroll",
    () => {
      // Снижаем качество эффектов при скролле для улучшения производительности
      if (!scrollTimeout) {
        // Добавляем класс scrolling только если нет активных блоков
        const hasActiveItems = Array.from(deliveryItems).some((item) =>
          item.classList.contains("active")
        );
        if (!hasActiveItems) {
          document.querySelector(".delivery").classList.add("scrolling");

          // Отключаем сложные эффекты при скролле
          const blurElements = document.querySelectorAll(".delivery__star");
          blurElements.forEach((el) => {
            el.style.opacity = "0.3";
          });
        }
      }

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        // Возвращаем качество после окончания скролла
        document.querySelector(".delivery").classList.remove("scrolling");

        const blurElements = document.querySelectorAll(".delivery__star");
        blurElements.forEach((el) => {
          el.style.opacity = "";
        });
      }, 150);
    },
    { passive: true }
  );

  // Инициализация при загрузке страницы
  if (window.innerWidth < 850) {
    checkMobileState();
  }
}

// Функция для управления отображением d-item блоков
function initDeliveryItems() {
  // Находим все контейнеры с data-delivery-items
  const containers = document.querySelectorAll("[data-delivery-items]");

  if (!containers.length) return;

  containers.forEach((container) => {
    const visibleItems = parseInt(container.dataset.deliveryItems, 10);

    if (isNaN(visibleItems) || visibleItems <= 0) return;

    const deliveryItems = container.querySelectorAll(".d-item");

    if (deliveryItems.length <= visibleItems) return;

    // Флаг, показывающий, что все элементы раскрыты
    let allItemsShown = false;

    // Функция для обновления видимости элементов
    const updateVisibility = () => {
      // Если все элементы уже раскрыты, всегда показываем все и скрываем кнопку
      if (allItemsShown) {
        deliveryItems.forEach((item) => {
          item.style.display = "";
        });
        showMoreBtn.style.display = "none";
        return;
      }
      // Проверяем ширину экрана
      if (window.innerWidth < 769) {
        // Скрываем элементы свыше указанного количества
        deliveryItems.forEach((item, index) => {
          if (index >= visibleItems) {
            item.style.display = "none";
          }
        });

        // Показываем кнопку только если есть скрытые элементы
        showMoreBtn.style.display = "block";
      } else {
        // На десктопе показываем все элементы
        deliveryItems.forEach((item) => {
          item.style.display = "";
        });

        // Скрываем кнопку
        showMoreBtn.style.display = "none";
        // Сброс флага при возврате на десктоп
        allItemsShown = false;
      }
    };

    // Создаем кнопку "Показать ещё"
    const showMoreBtn = container.querySelector(".delivery-more-btn");

    // Обработчик клика по кнопке
    showMoreBtn.addEventListener("click", () => {
      // Показываем все элементы
      deliveryItems.forEach((item) => {
        item.style.display = "";
      });

      // Скрываем кнопку после клика
      showMoreBtn.style.display = "none";
      // Устанавливаем флаг, чтобы updateVisibility больше не скрывал элементы
      allItemsShown = true;
    });

    // Вызываем функцию при загрузке страницы
    updateVisibility();

    // Добавляем обработчик изменения размера окна
    window.addEventListener("resize", updateVisibility);
  });
}

// Инициализация с проверкой готовности DOM
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initDeliveryItems);
} else {
  initDeliveryItems();
}
