const faqItems = document.querySelectorAll(".faq-item");

if (faqItems.length > 0) {
  function clearActive(cur) {
    faqItems.forEach((item) => {
      if (item == cur) return;
      item.querySelector(".faq-item__content").style.maxHeight = null;
      item.classList.remove("active");
    });
  }
  faqItems.forEach((item) => {
    const btn = item.querySelector(".faq-item__header");
    const content = item.querySelector(".faq-item__content");

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      let isActive = item.classList.toggle("active");
      clearActive(item);
      content.style.maxHeight = isActive ? content.scrollHeight + "px" : null;
    });

    if (item.classList.contains("active")) {
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
}
