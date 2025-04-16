import { throttle } from "./../functions/throttle.js";

document.addEventListener("DOMContentLoaded", () => {
  const sections = Array.from(document.querySelectorAll("[data-header]"));

  if (sections.length > 0) {
    const header = document.querySelector("header"); // Ваш элемент хедера
    const offset = 0; // Смещение для проверки, можно настроить при необходимости

    // Функция получения текущей секции, соприкасающейся с верхом viewport
    function updateHeaderClass() {
      const scrollY = window.scrollY || window.pageYOffset;

      // Находим все секции, у которых верхняя граница <= верха viewport + offset
      // И из них берем ту, у которой значение верхней границы ближе всех к верху
      let currentSection = null;
      let minDistance = Infinity;

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const distance = Math.abs(rect.top - offset);

        if (rect.top <= offset && distance < minDistance) {
          minDistance = distance;
          currentSection = section;
        }
      });

      if (currentSection) {
        // Получаем значение data-header для текущей активной секции
        const headerClass = currentSection.getAttribute("data-header");

        // Сбрасываем все классы, которые отвечают за цвет (можно указать конкретный префикс)
        header.className = header.className
          .split(" ")
          .filter((c) => !c.startsWith("header-color-"))
          .join(" ");

        // Добавляем класс, соответствующий секции
        header.classList.add(`header-color-${headerClass}`);
      }
    }

    let throttledUpdate = throttle(updateHeaderClass);

    window.addEventListener("scroll", throttledUpdate);
    window.addEventListener("resize", throttledUpdate);

    // Запускаем один раз при загрузке страницы
    updateHeaderClass();
  }
});
