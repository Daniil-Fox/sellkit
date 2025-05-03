const modalButtons = document.querySelectorAll(".modal-btn");

if (modalButtons.length > 0) {
  const modal = document.querySelector(".modal");
  const modalBody = document.querySelector(".modal__body");
  const modalClose = document.querySelector(".modal__close");

  modalButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      modal.classList.add("active");
    });
  });

  modalClose.addEventListener("click", (e) => {
    e.preventDefault();
    modal.classList.remove("active");

    // При закрытии модального окна также удаляем класс thankyou-active
    // чтобы сбросить состояние анимации при следующем открытии
    modal.classList.remove("thankyou-active");
  });

  modalBody.addEventListener("click", (e) => {
    // Удаляем e.preventDefault() чтобы позволить клики по кнопкам и формам внутри модального окна
    e.stopPropagation();
  });

  modal.addEventListener("click", (e) => {
    e.preventDefault();
    modal.classList.remove("active");

    // При закрытии модального окна также удаляем класс thankyou-active
    modal.classList.remove("thankyou-active");
  });
}
