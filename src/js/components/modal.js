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
  });
  modalBody.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
  });
  modal.addEventListener("click", (e) => {
    e.preventDefault();
    modal.classList.remove("active");
  });
}
