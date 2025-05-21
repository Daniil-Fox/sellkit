export default class LoyalParallax {
  constructor() {
    this.parallaxContainer = document.querySelector(".loyal-parallax");

    if (!this.parallaxContainer) return;

    this.images = this.parallaxContainer.querySelectorAll("img");
    this.scrollPosition = 0;
    this.ticking = false;

    this.init();
  }

  init() {
    if (window.innerWidth <= 1024) return;

    window.addEventListener("scroll", () => {
      this.scrollPosition =
        window.scrollY - this.parallaxContainer.offsetTop / 2;

      if (!this.ticking) {
        window.requestAnimationFrame(() => {
          this.updateParallax();
          this.ticking = false;
        });

        this.ticking = true;
      }
    });
  }

  updateParallax() {
    const movePercent = this.scrollPosition * 0.17;

    // Первое изображение движется вверх
    this.images[0].style.transform = `translateY(-${movePercent}px)`;

    // Второе изображение движется вниз
    this.images[1].style.transform = `translateY(${movePercent}px)`;
  }
}
