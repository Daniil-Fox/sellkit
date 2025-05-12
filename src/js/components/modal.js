const modalButtons = document.querySelectorAll(".modal-btn");

if (modalButtons.length > 0) {
  const modal = document.querySelector(".modal");
  const modalBody = document.querySelector(".modal__body");
  const modalClose = document.querySelector(".modal__close");
  const menu = document.querySelector(".menu");
  modalButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  });

  modalClose.addEventListener("click", (e) => {
    e.preventDefault();
    modal.classList.remove("active");
    modal.classList.remove("thankyou-active");
    if (!menu.classList.contains("menu--active"))
      document.body.style.overflow = null;
  });

  modalBody.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  modal.addEventListener("click", (e) => {
    e.preventDefault();
    modal.classList.remove("active");

    // При закрытии модального окна также удаляем класс thankyou-active
    modal.classList.remove("thankyou-active");
    if (!menu.classList.contains("menu--active"))
      document.body.style.overflow = null;
  });
}
