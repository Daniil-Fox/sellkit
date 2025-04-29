// Компоненты, которые необходимы сразу
import "./components/loyal-items.js";
import "./components/header.js";
import "./components/delivery.js";
import "./components/faq.js";
import "./components/plans.js";
import "./components/cards.js";
// Объявляем функцию для отложенной загрузки тяжелых компонентов
export function initHeavyComponents() {
  // Динамический импорт тяжелых компонентов
  import("./components/products.js");
  import("./components/mouse.js");
  import("./components/sliders.js");

  import("./components/romb.js");
  import("./components/aos.js");
}

// Очень тяжелые компоненты загружаем с большей задержкой
export function initVeryHeavyComponents() {
  // Проверяем наличие элементов перед загрузкой
  if (document.querySelector(".lb__canvas")) {
    import("./components/matter.js");
  }
}
