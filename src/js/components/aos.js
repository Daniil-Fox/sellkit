import AOS from "aos";

export default function initAOS() {
  console.log("Initializing AOS...");

  // Проверяем наличие элементов с AOS
  const aosElements = document.querySelectorAll("[data-aos]");
  console.log("Found AOS elements:", aosElements.length);

  if (!aosElements.length) {
    console.log("No AOS elements found, skipping initialization");
    return;
  }
  const isMob = window.innerWidth < 768;
  // Возвращаемся к стандартной реализации AOS с небольшими модификациями
  AOS.init({
    offset: isMob ? 0 : 60, // Настраиваем смещение для точного срабатывания
    delay: 0,
    duration: 800,
    easing: "ease",
    once: true, // Анимация будет срабатывать только один раз
    mirror: false,
    anchorPlacement: "top-center", // Привязка к центру вьюпорта
  });
  console.log("AOS initialized with config");

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

  // Оптимизированный обработчик события прокрутки с троттлингом
  let scrollTimeout;
  window.addEventListener(
    "scroll",
    function () {
      if (!scrollTimeout) {
        scrollTimeout = setTimeout(() => {
          AOS.refresh();
          scrollTimeout = null;
        }, 100);
      }
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

  // Оптимизированный обработчик изменения размера окна
  let resizeTimeout;
  window.addEventListener("resize", function () {
    if (!resizeTimeout) {
      resizeTimeout = setTimeout(() => {
        console.log("Window resized, refreshing AOS");
        AOS.refresh();
        resizeTimeout = null;
      }, 100);
    }
  });
}
