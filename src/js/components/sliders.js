import { Swiper } from "swiper";
import { Autoplay, FreeMode, Navigation, Pagination } from "swiper/modules";
Swiper.use([Navigation, Pagination, FreeMode, Autoplay]);
const prodSlider = new Swiper(".prod-slider", {
  slidesPerView: "auto",
  spaceBetween: 13,
  loop: true,
  loopedSlides: 8, // Указываем количество слайдов для правильной работы loop
  speed: 4000,
  allowTouchMove: true,
  grabCursor: true,
  freeMode: {
    enabled: true,
    momentum: false,
  },

  // Настройки автопрокрутки
  autoplay: {
    delay: 1,
    disableOnInteraction: false,
    pauseOnMouseEnter: false,
    stopOnLastSlide: false,
  },

  // Настройки для корректной работыループа
  watchSlidesProgress: true,
  observer: true,
  observeParents: true,
});

let isAutoplayPaused = false;
let autoplayResume;

// Обработчик наведения мыши
prodSlider.el.addEventListener("mouseenter", () => {
  if (!isAutoplayPaused) {
    prodSlider.autoplay.stop();
    isAutoplayPaused = true;
    clearTimeout(autoplayResume);
  }
});

// Обработчик ухода мыши
prodSlider.el.addEventListener("mouseleave", () => {
  if (isAutoplayPaused) {
    autoplayResume = setTimeout(() => {
      prodSlider.autoplay.start();
      isAutoplayPaused = false;
    }, 100);
  }
});

// Обработчик начала касания
prodSlider.el.addEventListener("touchstart", () => {
  if (!isAutoplayPaused) {
    prodSlider.autoplay.stop();
    isAutoplayPaused = true;
    clearTimeout(autoplayResume);
  }
});

// Обработчик окончания касания
prodSlider.el.addEventListener("touchend", () => {
  if (isAutoplayPaused) {
    autoplayResume = setTimeout(() => {
      prodSlider.autoplay.start();
      isAutoplayPaused = false;
    }, 100);
  }
});

// Запуск автопрокрутки при инициализации
prodSlider.autoplay.start();

// Обработчик для проверки состояния слайдера
prodSlider.on("autoplayStop", () => {
  if (!isAutoplayPaused) {
    prodSlider.autoplay.start();
  }
});
