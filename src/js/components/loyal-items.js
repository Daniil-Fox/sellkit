/**
 * Компонент для управления отображением loyal-item блоков
 * Скрывает излишние блоки на мобильных устройствах и добавляет кнопку "Показать ещё"
 */
export default function initLoyalItems() {
  // Находим все контейнеры с data-loyal-items
  const containers = document.querySelectorAll("[data-loyal-items]");

  if (!containers.length) return;

  containers.forEach((container) => {
    const visibleItems = parseInt(container.dataset.loyalItems, 10);

    if (isNaN(visibleItems) || visibleItems <= 0) return;

    const loyalItems = container.querySelectorAll(".loyal-item");

    if (loyalItems.length <= visibleItems) return;

    // Флаг, показывающий, что все элементы раскрыты
    let allItemsShown = false;

    // Функция для обновления видимости элементов
    const updateVisibility = () => {
      // Если все элементы уже раскрыты, всегда показываем все и скрываем кнопку
      if (allItemsShown) {
        loyalItems.forEach((item) => {
          item.style.display = "";
        });
        showMoreBtn.style.display = "none";
        return;
      }
      // Проверяем ширину экрана
      if (window.innerWidth < 850) {
        // Скрываем элементы свыше указанного количества
        loyalItems.forEach((item, index) => {
          if (index >= visibleItems) {
            item.style.display = "none";
          }
        });

        // Показываем кнопку только если есть скрытые элементы
        showMoreBtn.style.display = "block";
      } else {
        // На десктопе показываем все элементы
        loyalItems.forEach((item) => {
          item.style.display = "";
        });

        // Скрываем кнопку
        showMoreBtn.style.display = "none";
        // Сброс флага при возврате на десктоп
        allItemsShown = false;
      }
    };

    // Создаем кнопку "Показать ещё"
    const showMoreBtn = container.querySelector(".loyal-more-btn");

    // Обработчик клика по кнопке
    showMoreBtn.addEventListener("click", () => {
      // Показываем все элементы
      loyalItems.forEach((item) => {
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
