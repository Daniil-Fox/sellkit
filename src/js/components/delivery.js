const deliveryItems = document.querySelectorAll(".d-item");

if (deliveryItems.length > 0) {
  function clearActive(currentItem) {
    deliveryItems.forEach((item) => {
      if (item !== currentItem && item.classList.contains("active")) {
        item.classList.remove("active");
        const content = item.querySelector(".d-item__text");
        const topContent = item.querySelector(".d-item__top");
        content.style.maxHeight = content.scrollHeight + "px";

        const onContentClose = () => {
          topContent.style.display = "grid";
          topContent.style.opacity = 1;
          content.removeEventListener("transitionend", onContentClose);
        };

        requestAnimationFrame(() => {
          content.style.maxHeight = null;
        });
        content.addEventListener("transitionend", onContentClose);
      }
    });
  }

  deliveryItems.forEach((item) => {
    const btn = item.querySelector(".d-item__btn");
    const content = item.querySelector(".d-item__text");
    const topContent = item.querySelector(".d-item__top");

    if (item.classList.contains("active")) {
      topContent.style.display = "none";
      content.style.maxHeight = content.scrollHeight + "px";
    }

    btn.addEventListener("click", (e) => {
      e.preventDefault();

      clearActive(item);

      const isActive = item.classList.toggle("active");

      if (isActive) {
        topContent.style.display = "none";
        topContent.style.opacity = 0;
        content.style.maxHeight = content.scrollHeight + "px";
      } else {
        content.style.maxHeight = content.scrollHeight + "px";

        const onContentClose = () => {
          topContent.style.display = "grid";
          topContent.style.opacity = 1;
          content.removeEventListener("transitionend", onContentClose);
        };

        requestAnimationFrame(() => {
          content.style.maxHeight = null;
        });
        content.addEventListener("transitionend", onContentClose);
      }
    });
  });
}
