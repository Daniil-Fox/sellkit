const deliveryItems = document.querySelectorAll(".d-item");

if (deliveryItems.length > 0) {
  // Функция для проверки и управления активным состоянием блоков на мобильных устройствах
  const checkMobileState = () => {
    if (window.innerWidth < 850) {
      // На мобильных устройствах при загрузке убираем active у всех блоков
      deliveryItems.forEach((item) => {
        if (item.classList.contains("active")) {
          item.classList.remove("active");
          const content = item.querySelector(".d-item__text");
          const topContent = item.querySelector(".d-item__top");

          if (content && topContent) {
            content.style.maxHeight = null;
            topContent.style.display = "grid";
            topContent.style.opacity = 1;
          }
        }
      });
    }
  };

  // Вызываем функцию при загрузке страницы
  checkMobileState();

  // Следим за изменением размера окна с троттлингом
  let resizeTimeout;
  window.addEventListener("resize", () => {
    if (!resizeTimeout) {
      resizeTimeout = setTimeout(() => {
        resizeTimeout = null;
        checkMobileState();
      }, 250);
    }
  });

  function clearActive(currentItem) {
    deliveryItems.forEach((item) => {
      if (item !== currentItem && item.classList.contains("active")) {
        item.classList.remove("active");
        const content = item.querySelector(".d-item__text");
        const topContent = item.querySelector(".d-item__top");

        if (!content || !topContent) return;

        // Добавляем трансформацию в GPU-слой на iOS для оптимизации
        content.style.transform = "translateZ(0)";

        // Убираем лишние вычисления scrollHeight во время изменений
        const contentHeight = content.scrollHeight;
        content.style.maxHeight = contentHeight + "px";

        const onContentClose = () => {
          topContent.style.display = "grid";
          topContent.style.opacity = 1;
          content.removeEventListener("transitionend", onContentClose);
        };

        // Откладываем изменение максимальной высоты для предотвращения дрожания
        setTimeout(() => {
          content.style.maxHeight = null;
        }, 10);

        content.addEventListener("transitionend", onContentClose);
      }
    });
  }

  // Определяем, является ли устройство iOS
  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  // На iOS для лучшей производительности при анимациях
  if (isIOS) {
    document.querySelectorAll(".d-item__text").forEach((el) => {
      el.style.transform = "translateZ(0)"; // Включаем аппаратное ускорение
      el.style.willChange = "max-height"; // Предупреждаем браузер о будущих изменениях
      el.style.transition = "max-height 0.3s ease-out"; // Более быстрая и плавная анимация для iOS
    });
  }

  deliveryItems.forEach((item) => {
    const btn = item.querySelector(".d-item__header");
    const content = item.querySelector(".d-item__text");
    const topContent = item.querySelector(".d-item__top");

    if (!content || !topContent || !btn) return;

    if (item.classList.contains("active")) {
      topContent.style.display = "none";
      content.style.maxHeight = content.scrollHeight + "px";
    }

    // Используем делегирование событий и пассивные события для улучшения производительности
    btn.addEventListener(
      "click",
      (e) => {
        e.preventDefault();

        // Отменяем обработку, если анимация уже идет (предотвращаем множественные нажатия)
        if (item.hasAttribute("data-animating")) return;
        item.setAttribute("data-animating", "true");

        // Предварительные вычисления перед DOM-изменениями
        const isActive = !item.classList.contains("active");
        const contentHeight = content.scrollHeight;

        // Сначала применяем clearActive для других элементов
        clearActive(item);

        if (isActive) {
          // Открываем элемент
          item.classList.add("active");
          topContent.style.display = "none";
          topContent.style.opacity = 0;

          // Используем requestAnimationFrame для плавности анимации
          requestAnimationFrame(() => {
            content.style.maxHeight = contentHeight + "px";

            // Удаляем флаг анимации после завершения
            content.addEventListener(
              "transitionend",
              function onEnd() {
                item.removeAttribute("data-animating");
                content.removeEventListener("transitionend", onEnd);
              },
              { once: true }
            );
          });
        } else {
          // Закрываем элемент
          item.classList.remove("active");

          // Фиксируем текущую высоту перед закрытием
          content.style.maxHeight = contentHeight + "px";

          const onContentClose = () => {
            topContent.style.display = "grid";
            topContent.style.opacity = 1;
            item.removeAttribute("data-animating");
            content.removeEventListener("transitionend", onContentClose);
          };

          // Откладываем изменение высоты для корректной анимации
          requestAnimationFrame(() => {
            // Задержка необходима для корректной анимации на iOS
            setTimeout(
              () => {
                content.style.maxHeight = null;
              },
              isIOS ? 30 : 10
            );
          });

          content.addEventListener("transitionend", onContentClose, {
            once: true,
          });
        }
      },
      { passive: false }
    );
  });
}

// Оптимизированная функция для управления отображением d-item блоков
function initDeliveryItems() {
  // Находим все контейнеры с data-delivery-items
  const containers = document.querySelectorAll("[data-delivery-items]");

  if (!containers.length) return;

  containers.forEach((container) => {
    const visibleItems = parseInt(container.dataset.deliveryItems, 10);

    if (isNaN(visibleItems) || visibleItems <= 0) return;

    const deliveryItems = container.querySelectorAll(".d-item");
    const showMoreBtn = container.querySelector(".delivery-more-btn");

    if (deliveryItems.length <= visibleItems || !showMoreBtn) return;

    // Предварительно кэшируем DOM-элементы для мобильной версии
    const hiddenItems = Array.from(deliveryItems).slice(visibleItems);
    let isMobile = window.innerWidth < 769;

    // Функция для обновления видимости элементов
    const updateVisibility = () => {
      const newIsMobile = window.innerWidth < 769;

      // Обновляем только при изменении состояния
      if (isMobile !== newIsMobile) {
        isMobile = newIsMobile;

        if (isMobile) {
          // Скрываем элементы свыше указанного количества
          hiddenItems.forEach((item) => {
            item.style.display = "none";
          });

          // Показываем кнопку
          showMoreBtn.style.display = "block";
        } else {
          // На десктопе показываем все элементы
          hiddenItems.forEach((item) => {
            item.style.display = "";
          });

          // Скрываем кнопку
          showMoreBtn.style.display = "none";
        }
      }
    };

    // Обработчик клика по кнопке
    showMoreBtn.addEventListener("click", () => {
      // Показываем все элементы
      hiddenItems.forEach((item) => {
        item.style.display = "";
      });

      // Скрываем кнопку после клика
      showMoreBtn.style.display = "none";
    });

    // Вызываем функцию при загрузке страницы
    updateVisibility();

    // Добавляем обработчик изменения размера окна с троттлингом
    let resizeTimeout;
    window.addEventListener("resize", () => {
      if (!resizeTimeout) {
        resizeTimeout = setTimeout(() => {
          resizeTimeout = null;
          updateVisibility();
        }, 250);
      }
    });
  });
}

// Инициализация компонента с проверкой готовности DOM
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initDeliveryItems);
} else {
  initDeliveryItems();
}
