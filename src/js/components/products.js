const prodItems = document.querySelectorAll(".prod-item");

function clearActive() {
  const el = document.querySelector(".prod-item.active");
  if (el) {
    const video = el.querySelector("video");
    video?.pause();
    const itemTitle = el.querySelector(".prod-item__title");
    el.classList.remove("active");
    itemTitle.textContent = itemTitle.dataset.fullText;
  }
}

prodItems.forEach((item) => {
  const itemTitle = item.querySelector(".prod-item__title");
  const video = item.querySelector("video");
  itemTitle.dataset.fullText = itemTitle.textContent;

  item.addEventListener("click", (e) => {
    e.preventDefault();

    clearActive();

    const fullText = itemTitle.dataset.fullText;
    itemTitle.textContent = "";

    item.classList.add("active");
    video?.play();

    let index = 0;

    const typeEffect = () => {
      if (index < fullText.length) {
        itemTitle.textContent += fullText[index];
        index++;
        setTimeout(typeEffect, 50);
      }
    };

    setTimeout(() => {
      typeEffect();
    }, 200);
  });
});
