import "./_components.js";
import { burger } from "./functions/burger.js";

const svgPaths = document.querySelectorAll(".spider path");

if (svgPaths.length > 0) {
  const items = document.querySelectorAll(".integrate__item");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          svgPaths.forEach((path) => {
            path.style.animation = "draw 5s forwards 0.4s";
          });
          items.forEach((item) => {
            item.style.opacity = 1;
          });
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.9,
    }
  );

  observer.observe(document.querySelector(".spider"));
}
