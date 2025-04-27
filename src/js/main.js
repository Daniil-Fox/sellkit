import "./_components.js";
import { burger } from "./functions/burger.js";

const svgPaths = document.querySelectorAll(".spider path");

if (svgPaths.length > 0) {
  const items = document.querySelectorAll(".integrate__item");
  const logo = document.querySelector(".int-logo");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          logo.classList.add("animate");
          setTimeout(() => {
            svgPaths.forEach((path) => {
              path.style.animation = "draw 8s forwards 0.4s";
            });
            items.forEach((item) => {
              item.style.opacity = 1;
            });
            observer.unobserve(entry.target);
          }, 1300);
        }
      });
    },
    {
      threshold: 1,
    }
  );

  observer.observe(logo);
}

const mapPath = document.querySelector(".map-path");

if (mapPath) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add("animate");
            observer.unobserve(entry.target);
          }, 1000);
        }
      });
    },
    {
      threshold: 1,
    }
  );

  document.querySelectorAll(".map-path").forEach((path) => {
    observer.observe(path);
  });
}
