/**
 * Модуль прелоадера
 * Отображает анимированный прелоадер во время загрузки страницы
 */

// Класс для управления прелоадером
export default class Preloader {
  constructor() {
    this.preloader = document.querySelector(".preloader");
    this.progressBar = document.querySelector(".preloader__progress-bar");
    this.progressText = document.querySelector(".preloader__text");
    this.loaded = 0;
    this.resources = {
      images: 0,
      scripts: 0,
      styles: 0,
      total: 0,
    };
    this.isFinished = false;
    this.initialize();
  }

  // Инициализация прелоадера
  initialize() {
    if (!this.preloader) return;

    // Отключаем скролл страницы
    document.body.style.overflow = "hidden";

    // Считаем ресурсы
    this.countResources();

    // Устанавливаем минимальное время отображения (для эффекта)
    this.minDisplayTime = 1500;
    this.startTime = Date.now();

    // Запускаем обработчики
    this.trackProgress();

    // Устанавливаем максимальное время ожидания (10 секунд)
    this.startFallbackTimer(10000);
  }

  // Подсчет ресурсов на странице
  countResources() {
    // Подсчитываем изображения
    const images = document.querySelectorAll("img");
    this.resources.images = images.length;

    // Подсчитываем внешние скрипты
    const scripts = document.querySelectorAll("script[src]");
    this.resources.scripts = scripts.length;

    // Подсчитываем стили
    const styles = document.querySelectorAll('link[rel="stylesheet"]');
    this.resources.styles = styles.length;

    // Общее количество ресурсов + запас для других ресурсов
    this.resources.total =
      this.resources.images +
      this.resources.scripts +
      this.resources.styles +
      5;

    // Устанавливаем начальный прогресс (20%)
    this.updateProgress(20);
  }

  // Отслеживание загрузки ресурсов
  trackProgress() {
    // Обработчик для изображений
    const imgElements = document.querySelectorAll("img");
    let loadedImages = 0;

    imgElements.forEach((img) => {
      if (img.complete) {
        loadedImages++;
        this.incrementProgress();
      } else {
        img.addEventListener("load", () => {
          loadedImages++;
          this.incrementProgress();
        });

        img.addEventListener("error", () => {
          loadedImages++;
          this.incrementProgress();
        });
      }
    });

    // Отслеживаем загрузку HTML и ресурсов
    // Но НЕ закрываем прелоадер автоматически,
    // ждем явного вызова finishLoading
    window.addEventListener("load", () => {
      // Обновляем прогресс до 90%, остальные 10% - для инициализации matter.js
      setTimeout(() => {
        this.updateProgress(90);
      }, 500);
    });
  }

  // Увеличиваем прогресс
  incrementProgress() {
    this.loaded++;
    const progressPercentage = Math.min(
      60 + (this.loaded / this.resources.total) * 30,
      90
    );
    this.updateProgress(progressPercentage);
  }

  // Обновляем визуальный прогресс
  updateProgress(percentage) {
    if (!this.progressBar || !this.progressText) return;

    const roundedPercentage = Math.round(percentage);
    this.progressBar.style.width = `${percentage}%`;
    this.progressText.textContent = `${roundedPercentage}%`;
  }

  // Резервный таймер для завершения загрузки
  startFallbackTimer(maxWaitTime) {
    // Через указанное время в любом случае завершаем загрузку
    setTimeout(() => {
      if (!this.isFinished) {
        console.log("Preloader: Maximum wait time reached, finishing loading");
        this.finishLoading();
      }
    }, maxWaitTime || 4000);
  }

  // Публичный метод завершения загрузки
  // Может быть вызван извне для ручного закрытия прелоадера
  finishLoading() {
    // Если прелоадер уже закрыт, ничего не делаем
    if (this.isFinished) return;

    // Устанавливаем флаг завершения
    this.isFinished = true;

    const currentTime = Date.now();
    const elapsedTime = currentTime - this.startTime;

    // Если прошло меньше минимального времени, ждем
    if (elapsedTime < this.minDisplayTime) {
      setTimeout(() => {
        this.completeLoading();
      }, this.minDisplayTime - elapsedTime);
    } else {
      this.completeLoading();
    }
  }

  // Завершающие действия
  completeLoading() {
    if (!this.preloader) return;

    // Устанавливаем прогресс 100%
    this.updateProgress(100);

    // Задержка для отображения 100%
    setTimeout(() => {
      // Добавляем класс для скрытия прелоадера
      this.preloader.classList.add("loaded");

      // Разрешаем скролл
      document.body.style.overflow = "";

      // Удаляем прелоадер через 500мс (после анимации)
      setTimeout(() => {
        if (this.preloader && this.preloader.parentNode) {
          this.preloader.parentNode.removeChild(this.preloader);
        }
      }, 500);
    }, 300);
  }
}

// Инициализация прелоадера при загрузке скрипта
export function initPreloader() {
  return new Preloader();
}
