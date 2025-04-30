import AOS from "aos";

// Возвращаемся к стандартной реализации AOS с небольшими модификациями
AOS.init({
  offset: 60, // Настраиваем смещение для точного срабатывания
  delay: 0,
  duration: 800,
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
    console.log("AOS elements found:", aosElements.length);

    // Если AOS не инициализировался должным образом, запускаем обновление
    if (!document.querySelector(".aos-init")) {
      console.log("AOS not initialized properly, refreshing...");
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

// Обработчик события прокрутки для ручного обновления видимости
window.addEventListener(
  "scroll",
  function () {
    AOS.refresh();
  },
  { passive: true }
);

// При загрузке всех ресурсов
window.addEventListener("load", function () {
  setTimeout(() => {
    console.log("Window loaded, refreshing AOS");
    AOS.refresh();
  }, 100);
});

// При изменении размера окна
window.addEventListener("resize", function () {
  setTimeout(() => {
    console.log("Window resized, refreshing AOS");
    AOS.refresh();
  }, 100);
});
