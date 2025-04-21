const deliveryItems = document.querySelectorAll(".d-item");

if (deliveryItems.length > 0) {
  function clearActive(cur) {
    deliveryItems.forEach((item) => {
      if (item == cur) return;

      item.classList.remove("active");
      const content = item.querySelector(".d-item__text");
      const topContent = item.querySelector(".d-item__top");
      content.style.maxHeight = content.scrollHeight + "px";
      function contentHide() {
        topContent.style.display = "grid";
        setTimeout(() => {
          topContent.style.opacity = 1;
        }, 0);
        content.removeEventListener("transitionend", contentHide);
      }
      content.style.maxHeight = null;
      content.addEventListener("transitionend", contentHide);
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
      let isActive = item.classList.toggle("active");

      if (isActive) {
        function onTransitionEnd() {
          topContent.style.display = "none";
          content.style.maxHeight = content.scrollHeight + "px";
          topContent.removeEventListener("transitionend", onTransitionEnd);
        }
        topContent.style.opacity = 0;
        topContent.addEventListener("transitionend", onTransitionEnd);
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
        function contentHide() {
          topContent.style.display = "grid";
          setTimeout(() => {
            topContent.style.opacity = 1;
          }, 0);
          content.removeEventListener("transitionend", contentHide);
        }

        content.style.maxHeight = null;
        content.addEventListener("transitionend", contentHide);
      }
    });
  });
}
