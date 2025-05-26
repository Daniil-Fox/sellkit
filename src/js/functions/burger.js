import { disableScroll } from "../functions/disable-scroll.js";
import { enableScroll } from "../functions/enable-scroll.js";

(function () {
  const burger = document?.querySelector("[data-burger]");
  const menu = document?.querySelector("#mainMenu");
  const menuItems = document?.querySelectorAll("[data-menu-item]");
  const overlay = document?.querySelector("[data-menu-overlay]");

  // Функция для получения ширины скроллбара
  const getScrollbarWidth = () => {
    const outer = document.createElement("div");
    outer.style.visibility = "hidden";
    outer.style.overflow = "scroll";
    document.body.appendChild(outer);

    const inner = document.createElement("div");
    outer.appendChild(inner);

    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
    outer.parentNode.removeChild(outer);

    return scrollbarWidth;
  };

  // Функция для управления скроллбаром
  const handleScrollbar = (isOpen) => {
    const scrollbarWidth = getScrollbarWidth();
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      // Добавляем отступ для фиксированных элементов
      const fixedElements = document.querySelectorAll(
        ".header, .fixed-element"
      );
      fixedElements.forEach((el) => {
        el.style.paddingRight = `${scrollbarWidth + 16}px`;
      });
    } else {
      document.body.style.overflow = null;
      document.body.style.paddingRight = "";
      // Убираем отступ у фиксированных элементов
      const fixedElements = document.querySelectorAll(
        ".header, .fixed-element"
      );
      fixedElements.forEach((el) => {
        el.style.paddingRight = "";
      });
    }
  };

  burger?.addEventListener("click", (e) => {
    burger?.classList.toggle("burger--active");
    menu?.classList.toggle("menu--active");

    if (menu?.classList.contains("menu--active")) {
      burger?.setAttribute("aria-expanded", "true");
      burger?.setAttribute("aria-label", "Закрыть меню");
      handleScrollbar(true);
    } else {
      burger?.setAttribute("aria-expanded", "false");
      burger?.setAttribute("aria-label", "Открыть меню");
      handleScrollbar(false);
    }
  });

  overlay?.addEventListener("click", () => {
    burger?.setAttribute("aria-expanded", "false");
    burger?.setAttribute("aria-label", "Открыть меню");
    burger.classList.remove("burger--active");
    menu.classList.remove("menu--active");
    handleScrollbar(false);
  });

  menuItems?.forEach((el) => {
    el.addEventListener("click", () => {
      burger?.setAttribute("aria-expanded", "false");
      burger?.setAttribute("aria-label", "Открыть меню");
      burger.classList.remove("burger--active");
      menu.classList.remove("menu--active");
      handleScrollbar(false);
    });
  });
})();
