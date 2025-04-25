const planTabs = document.querySelectorAll(".plans__tab");

if (planTabs.length > 0) {
  const planContent = document.querySelectorAll(".plans__content");
  const clearActive = () => {
    planContent.forEach((el) => el.classList.add("hidden"));
    planTabs.forEach((el) => el.classList.remove("active"));
  };

  planTabs.forEach((tab) => {
    tab.addEventListener("click", (e) => {
      e.preventDefault();
      clearActive();

      const type = tab.dataset.planTab;
      tab.classList.add("active");

      document
        .querySelector(`.plans__content[data-plan=${type}]`)
        .classList.remove("hidden");
    });
  });
}
