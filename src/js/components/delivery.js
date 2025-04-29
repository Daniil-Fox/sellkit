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

  // Следим за изменением размера окна
  window.addEventListener("resize", checkMobileState);

  function clearActive(currentItem) {
    deliveryItems.forEach((item) => {
      if (item !== currentItem && item.classList.contains("active")) {
        item.classList.remove("active");
        const content = item.querySelector(".d-item__text");
        const topContent = item.querySelector(".d-item__top");
        content.style.maxHeight = content.scrollHeight + "px";

        const onContentClose = () => {
          topContent.style.display = "grid";
          topContent.style.opacity = 1;
          content.removeEventListener("transitionend", onContentClose);
        };

        requestAnimationFrame(() => {
          content.style.maxHeight = null;
        });
        content.addEventListener("transitionend", onContentClose);
      }
    });
  }

  deliveryItems.forEach((item) => {
    const btn = item.querySelector(".d-item__header");
    const content = item.querySelector(".d-item__text");
    const topContent = item.querySelector(".d-item__top");

    if (item.classList.contains("active")) {
      topContent.style.display = "none";
      content.style.maxHeight = content.scrollHeight + "px";
    }

    btn.addEventListener("click", (e) => {
      e.preventDefault();

      clearActive(item);

      const isActive = item.classList.toggle("active");

      if (isActive) {
        topContent.style.display = "none";
        topContent.style.opacity = 0;
        content.style.maxHeight = content.scrollHeight + "px";
      } else {
        content.style.maxHeight = content.scrollHeight + "px";

        const onContentClose = () => {
          topContent.style.display = "grid";
          topContent.style.opacity = 1;
          content.removeEventListener("transitionend", onContentClose);
        };

        requestAnimationFrame(() => {
          content.style.maxHeight = null;
        });
        content.addEventListener("transitionend", onContentClose);
      }
    });
  });
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

    // Функция для обновления видимости элементов
    const updateVisibility = () => {
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
    });

    // Вызываем функцию при загрузке страницы
    updateVisibility();

    // Добавляем обработчик изменения размера окна
    window.addEventListener("resize", updateVisibility);
  });
}

// Инициализация компонента при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
  initDeliveryItems();
});
