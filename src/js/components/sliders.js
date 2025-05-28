import { Swiper } from "swiper";
import { Autoplay, FreeMode, Navigation, Pagination } from "swiper/modules";
Swiper.use([Navigation, Pagination, FreeMode, Autoplay]);

export default function initSliders() {
  const prodSliderElement = document.querySelector(".prod-slider");
  if (prodSliderElement) {
    const prodSlider = new Swiper(".prod-slider", {
      slidesPerView: "auto",
      spaceBetween: 13,
      loop: true,
      speed: 6000,
      allowTouchMove: true,
      grabCursor: true,
      freeMode: {
        enabled: true,
        momentum: false,
      },
      autoplay: {
        delay: 1,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
    });

    const handleSliderIntersection = (entries) => {
      entries.forEach((entry) => {
        if (
          !prodSlider ||
          !prodSlider.el ||
          !prodSlider.autoplay ||
          !prodSlider.params
        )
          return;

        if (entry.isIntersecting) {
          if (
            prodSlider.params.autoplay &&
            typeof prodSlider.params.autoplay === "object" &&
            prodSlider.params.autoplay.enabled !== false
          ) {
            if (!prodSlider.autoplay.running) {
              prodSlider.el.classList.remove("swiper-paused-by-observer");
              prodSlider.autoplay.start();
            }
          }
        } else {
          if (prodSlider.autoplay.running) {
            prodSlider.el.classList.add("swiper-paused-by-observer");
            prodSlider.autoplay.stop();
          }
        }
      });
    };

    const sliderObserver = new IntersectionObserver(handleSliderIntersection, {
      threshold: 0.01,
    });
    sliderObserver.observe(prodSliderElement);
  }

  // Инициализация clients__thumbs
  const clientsThumbsElement = document.querySelector(".clients__thumbs");
  if (clientsThumbsElement) {
    new Swiper(".clients__thumbs", {
      slidesPerView: "auto",
      spaceBetween: 0,
    });
  }
}
