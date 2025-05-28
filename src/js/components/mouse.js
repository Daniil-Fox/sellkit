// Проверка на мобильное устройство
const isMobile = window.innerWidth < 768;

document.addEventListener("DOMContentLoaded", () => {
  if (!isMobile) {
    const mouseElem = document.querySelector(".mouse");
    if (!mouseElem) return; // Если элемент курсора не найден, выходим

    // Для основного курсора - используем transform
    // CSS для .mouse должен быть типа: position: fixed; left: 0; top: 0; pointer-events: none;
    // transform: translate3d(var(--mouse-x, 0px), var(--mouse-y, 0px), 0); (для плавности через CSS transition, если нужно)
    // или напрямую через JS, как здесь.
    // Начальное положение может быть скрыто (например, transform: scale(0)) и появляться при первом движении
    let rafId;
    window.addEventListener("mousemove", (e) => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      rafId = requestAnimationFrame(() => {
        // Используем translate3d для лучшей производительности (аппаратное ускорение)
        mouseElem.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      });
    });

    // Делегирование событий для изменения состояния курсора на ссылках и кнопках
    document.body.addEventListener("mouseover", (e) => {
      if (e.target.closest("a") || e.target.closest("button")) {
        mouseElem.classList.add("hovered");
      }
    });

    document.body.addEventListener("mouseout", (e) => {
      if (e.target.closest("a") || e.target.closest("button")) {
        mouseElem.classList.remove("hovered");
      }
    });

    // Общие mousedown/mouseup для эффекта "active" на курсоре
    document.body.addEventListener("mousedown", (e) => {
      mouseElem.classList.add("active");
    });

    document.body.addEventListener("mouseup", (e) => {
      mouseElem.classList.remove("active");
    });

    // Эффект "oreal" для [data-mouse-oreal]
    const orealZones = document.querySelectorAll("[data-mouse-oreal]");
    orealZones.forEach((zone) => {
      const orealChild = document.createElement("div"); // Переименовал, чтобы не конфликтовать с переменной oreal в других контекстах, если они есть
      orealChild.classList.add("oreal");

      // Убедимся, что у зоны есть position, иначе absolute/relative позиционирование orealChild будет относительно другого предка
      if (getComputedStyle(zone).position === "static") {
        zone.style.position = "relative";
      }
      zone.append(orealChild);

      const orealWidth = orealChild.offsetWidth;
      const orealHeight = orealChild.offsetHeight;
      let zoneRect = null;
      let orealRafId;

      zone.addEventListener("mouseenter", () => {
        orealChild.style.opacity = "1";
      });

      zone.addEventListener("mouseleave", () => {
        orealChild.style.opacity = "0";
        zoneRect = null;
        if (orealRafId) {
          cancelAnimationFrame(orealRafId);
        }
      });

      zone.addEventListener("mousemove", (e) => {
        zoneRect = zone.getBoundingClientRect();
        // Вычисляем позицию относительно текущего элемента zone
        const x = e.clientX - zoneRect.left - orealWidth / 2;
        const y = e.clientY - zoneRect.top - orealHeight / 2;

        if (orealRafId) {
          cancelAnimationFrame(orealRafId);
        }
        // Анимируем orealChild через requestAnimationFrame
        orealRafId = requestAnimationFrame(() => {
          orealChild.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        });
      });
    });

    // Эффект для [data-mouse-blue]
    const blueZones = document.querySelectorAll("[data-mouse-blue]");
    blueZones.forEach((zone) => {
      zone.addEventListener("mouseenter", (e) => {
        mouseElem.classList.add("white");
      });
      zone.addEventListener("mouseleave", (e) => {
        mouseElem.classList.remove("white");
      });
    });
  } else {
    // Удаляем элемент курсора на мобильных устройствах
    const mouseElem = document.querySelector(".mouse");
    if (mouseElem) {
      mouseElem.remove();
    }
  }
});
