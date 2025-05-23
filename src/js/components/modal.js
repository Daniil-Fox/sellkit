const modalButtons = document.querySelectorAll(".modal-btn");

if (modalButtons.length > 0) {
  const modal = document.querySelector(".modal");
  const modalBody = document.querySelector(".modal__body");
  const modalClose = document.querySelector(".modal__close");
  const menu = document.querySelector(".menu");

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
      // Добавляем отступ для фиксированных элементов, если они есть
      const fixedElements = document.querySelectorAll(
        ".header-fixed, .fixed-element"
      );
      fixedElements.forEach((el) => {
        el.style.paddingRight = `${scrollbarWidth}px`;
      });
    } else {
      if (!menu.classList.contains("menu--active")) {
        document.body.style.overflow = null;
        document.body.style.paddingRight = "";
        // Убираем отступ у фиксированных элементов
        const fixedElements = document.querySelectorAll(
          ".header-fixed, .fixed-element"
        );
        fixedElements.forEach((el) => {
          el.style.paddingRight = "";
        });
      }
    }
  };

  modalButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      modal.classList.add("active");
      handleScrollbar(true);
    });
  });

  modalClose.addEventListener("click", (e) => {
    e.preventDefault();
    modal.classList.remove("active");
    modal.classList.remove("thankyou-active");
    handleScrollbar(false);
  });

  modalBody.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  modal.addEventListener("click", (e) => {
    e.preventDefault();
    modal.classList.remove("active");
    modal.classList.remove("thankyou-active");
    handleScrollbar(false);
  });
}
