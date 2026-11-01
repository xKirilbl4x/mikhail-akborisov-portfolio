const yearElement = document.querySelector("#current-year");
const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector(".navigation");
const hero = document.querySelector(".hero");
const heroSlides = [...document.querySelectorAll(".hero__slide")];
const heroDots = [...document.querySelectorAll(".hero__dot")];
let activeSlide = 0;
let slideTimer;
yearElement.textContent = new Date().getFullYear();

menuButton.addEventListener("click", () => {
  const isOpen = navigation.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Закрыть меню" : "Открыть меню");
});

navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    navigation.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Открыть меню");
  }
});

const isMobileDevice = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

document.querySelectorAll(".app-link").forEach((link) => {
  link.addEventListener("click", (event) => {
    if (!isMobileDevice) return;

    event.preventDefault();
    const appUrl = link.dataset.appUrl;
    const webUrl = link.dataset.webUrl;
    let fallbackTimer;

    const cancelFallback = () => {
      window.clearTimeout(fallbackTimer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", cancelFallback);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) cancelFallback();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", cancelFallback, { once: true });

    fallbackTimer = window.setTimeout(() => {
      cancelFallback();
      window.location.assign(webUrl);
    }, 1400);

    window.location.assign(appUrl);
  });
});

const showSlide = (index) => {
  activeSlide = (index + heroSlides.length) % heroSlides.length;

  heroSlides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === activeSlide);
  });

  heroDots.forEach((dot, dotIndex) => {
    const isActive = dotIndex === activeSlide;
    dot.classList.toggle("is-active", isActive);
    dot.toggleAttribute("aria-current", isActive);
  });
};

const startSlider = () => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  window.clearInterval(slideTimer);
  slideTimer = window.setInterval(() => showSlide(activeSlide + 1), 6000);
};

heroDots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    showSlide(index);
    startSlider();
  });
});

hero.addEventListener("mouseenter", () => window.clearInterval(slideTimer));
hero.addEventListener("mouseleave", startSlider);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    window.clearInterval(slideTimer);
  } else {
    startSlider();
  }
});

startSlider();

