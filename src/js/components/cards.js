document.addEventListener("DOMContentLoaded", function () {
  const tabs = document.querySelectorAll(".clients__tab");
  const cards = document.querySelectorAll(".clients__card");
  const clientsItems = document.querySelector(".clients__items");

  const maxVisibleCards =
    parseInt(clientsItems.getAttribute("data-visible-cards")) || Infinity;

  function filterCards(category) {
    let visibleCards = 0;

    // Сначала добавляем класс hidden всем карточкам
    cards.forEach((card) => {
      card.classList.add("hidden");
    });

    cards.forEach((card) => {
      const cardCategories = card
        .getAttribute("data-client-card")
        .split(",")
        .map((c) => c.trim());

      const shouldShow =
        category === "all" || cardCategories.includes(category);

      if (shouldShow && visibleCards < maxVisibleCards) {
        card.classList.remove("hidden");

        visibleCards++;
      } else {
        card.classList.add("hidden");
      }
    });

    clientsItems.setAttribute("data-visible-cards", visibleCards);
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const category = tab.getAttribute("data-client");
      filterCards(category);
    });
  });

  filterCards("all");
});
