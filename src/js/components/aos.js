import AOS from "aos";

export default function initAOS() {
  // Проверяем наличие элементов с AOS
  const aosElements = document.querySelectorAll("[data-aos]");

  if (!aosElements.length) {
    return;
  }
  const isMob = window.innerWidth < 768;
  // Возвращаемся к стандартной реализации AOS с небольшими модификациями
  AOS.init({
    offset: isMob ? 0 : 60, // Настраиваем смещение для точного срабатывания
    delay: 0,
    duration: 500,
    easing: "ease",
    once: true, // Анимация будет срабатывать только один раз
    mirror: false,
    anchorPlacement: "top-center", // Привязка к центру вьюпорта
  });

  // Добавляем дополнительную проверку загрузки AOS
  document.addEventListener("DOMContentLoaded", function () {
    // Проверяем, что AOS успешно инициализирован
    setTimeout(() => {
      const aosElements = document.querySelectorAll("[data-aos]");

      // Если AOS не инициализировался должным образом, запускаем обновление
      if (!document.querySelector(".aos-init")) {
        AOS.refreshHard();
      }

      // Проверяем стили элементов
      aosElements.forEach((element) => {
        if (!element.classList.contains("aos-init")) {
          element.classList.add("aos-init");
        }
      });
    }, 300);
  });

  // При загрузке всех ресурсов
  window.addEventListener("load", function () {
    setTimeout(() => {
      AOS.refresh();
    }, 100);
  });

  // Оптимизированный обработчик изменения размера окна
  let resizeTimeout;
  window.addEventListener("resize", function () {
    if (!resizeTimeout) {
      resizeTimeout = setTimeout(() => {
        AOS.refresh();
        resizeTimeout = null;
      }, 100);
    }
  });
}
