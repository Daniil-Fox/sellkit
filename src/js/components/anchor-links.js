document.addEventListener("DOMContentLoaded", () => {
  // Находим все ссылки с атрибутом data-scroll-to
  const scrollLinks = document.querySelectorAll("[data-scroll-to]");

  scrollLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("data-scroll-to");
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        // Добавляем дополнительный отступ для мобильных устройств
        const isMobile = window.innerWidth < 768;
        const headerHeight =
          document.querySelector(".header")?.offsetHeight || 0;
        const additionalOffset = isMobile ? 30 : 0;

        // Получаем позицию элемента и сразу скроллим к нему
        const elementPosition =
          targetElement.getBoundingClientRect().top +
          window.pageYOffset -
          headerHeight -
          additionalOffset;

        window.scrollTo({
          top: elementPosition,
          behavior: "smooth",
        });
      }
    });
  });
});
