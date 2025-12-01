"use strict";

/**
 * PRELOAD
 *
 * loading will be end after document is loaded
 */

const preloader = document.querySelector("[data-preaload]");

window.addEventListener("load", function () {
  preloader.classList.add("loaded");
  document.body.classList.add("loaded");
  
  // Side menu removed - no navbar handling needed
});

/**
 * add event listener on multiple elements
 */

const addEventOnElements = function (elements, eventType, callback) {
  for (let i = 0, len = elements.length; i < len; i++) {
    elements[i].addEventListener(eventType, callback);
  }
};

/**
 * NAVBAR - Removed side menu functionality
 */

/**
 * HEADER & BACK TOP BTN
 */

const header = document.querySelector("[data-header]");
let backTopBtn = document.querySelector("[data-back-top-btn]");
const serviceSection = document.querySelector("#service-section");

let lastScrollPos = 0;

// Ensure back to top button is hidden on page load
if (backTopBtn) {
  backTopBtn.classList.remove("active");
}

// Back to top button click handler - use event delegation for reliability
document.addEventListener("click", function(e) {
  if (e.target.closest("[data-back-top-btn]")) {
    e.preventDefault();
    e.stopPropagation();
    
    // Scroll to top smoothly
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
    
    // Also try scrolling the document elements directly as fallback
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }
});

const hideHeader = function () {
  const isScrollBottom = lastScrollPos < window.scrollY;
  if (isScrollBottom) {
    header.classList.add("hide");
  } else {
    header.classList.remove("hide");
  }

  lastScrollPos = window.scrollY;
};

// Throttle scroll handler for better performance
let scrollTimeout;
const handleScroll = function () {
  // Get back to top button if not already set
  if (!backTopBtn) {
    backTopBtn = document.querySelector("[data-back-top-btn]");
  }
  
  // Show back to top button only after scrolling down significantly (middle of page)
  if (backTopBtn) {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    // Show button after scrolling down at least 1.5 viewport heights (middle of page)
    const showThreshold = windowHeight * 1.5;
    
    if (scrollPosition >= showThreshold) {
      backTopBtn.classList.add("active");
    } else {
      backTopBtn.classList.remove("active");
    }
  }
  
  if (window.scrollY >= 50) {
    header.classList.add("active");
    hideHeader();
  } else {
    header.classList.remove("active");
  }
};

// Use passive listener and throttle for better performance
window.addEventListener("scroll", function () {
  if (!scrollTimeout) {
    requestAnimationFrame(() => {
      handleScroll();
      scrollTimeout = null;
    });
    scrollTimeout = true;
  }
}, { passive: true });


/**
 * HERO SLIDER
 */

const heroSlider = document.querySelector("[data-hero-slider]");
const heroSliderItems = document.querySelectorAll("[data-hero-slider-item]");
const heroSliderPrevBtn = document.querySelector("[data-prev-btn]");
const heroSliderNextBtn = document.querySelector("[data-next-btn]");

let currentSlidePos = 0;
let lastActiveSliderItem = heroSliderItems[0];

const updateSliderPos = function () {
  lastActiveSliderItem.classList.remove("active");
  heroSliderItems[currentSlidePos].classList.add("active");
  lastActiveSliderItem = heroSliderItems[currentSlidePos];
};

const slideNext = function () {
  if (currentSlidePos >= heroSliderItems.length - 1) {
    currentSlidePos = 0;
  } else {
    currentSlidePos++;
  }

  updateSliderPos();
};

heroSliderNextBtn.addEventListener("click", slideNext);

const slidePrev = function () {
  if (currentSlidePos <= 0) {
    currentSlidePos = heroSliderItems.length - 1;
  } else {
    currentSlidePos--;
  }

  updateSliderPos();
};

heroSliderPrevBtn.addEventListener("click", slidePrev);

/**
 * auto slide
 */

let autoSlideInterval;
let isPaused = false;

const autoSlide = function () {
  if (isPaused) return;
  autoSlideInterval = setInterval(function () {
    if (!isPaused) {
      slideNext();
    }
  }, 7000);
};

const pauseAutoSlide = function () {
  isPaused = true;
  clearInterval(autoSlideInterval);
};

const resumeAutoSlide = function () {
  isPaused = false;
  autoSlide();
};

addEventOnElements(
  [heroSliderNextBtn, heroSliderPrevBtn],
  "mouseover",
  pauseAutoSlide
);

addEventOnElements(
  [heroSliderNextBtn, heroSliderPrevBtn],
  "mouseout",
  resumeAutoSlide
);

// Pause on mobile touch for better performance
if ('ontouchstart' in window) {
  addEventOnElements(
    [heroSliderNextBtn, heroSliderPrevBtn],
    "touchstart",
    pauseAutoSlide
  );
}

window.addEventListener("load", autoSlide);

/**
 * PARALLAX EFFECT
 */

const parallaxItems = document.querySelectorAll("[data-parallax-item]");

let x, y;

window.addEventListener("mousemove", function (event) {
  x = (event.clientX / window.innerWidth) * 10 - 5;
  y = (event.clientY / window.innerHeight) * 10 - 5;

  // reverse the number eg. 20 -> -20, -5 -> 5
  x = x - x * 2;
  y = y - y * 2;

  for (let i = 0, len = parallaxItems.length; i < len; i++) {
    x = x * Number(parallaxItems[i].dataset.parallaxSpeed);
    y = y * Number(parallaxItems[i].dataset.parallaxSpeed);
    parallaxItems[i].style.transform = `translate3d(${x}px, ${y}px, 0px)`;
  }
});

/**
 * FORM SUBMISSION AND EMAIL HANDLING
 */

const emailButton = document.getElementById("emailButton");

emailButton.addEventListener("click", function () {
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const person = document.getElementById("person").value;
  const startDate = document.getElementById("startDate").value;
  const reservationTime = document.getElementById("reservationTime").value;
  const address = document.getElementById("address").value;
  const message = document.getElementById("message").value;

  if (!name || !phone || !startDate || !reservationTime || !address) {
    alert("Bitte füllen Sie alle Pflichtfelder aus.");
    return;
  }

  if (person < 50) {
    alert("Die Anzahl der Personen muss mindestens 50 betragen.");
    return;
  }

  const email = "bellabiladipizza@gmail.com";
  const subject = "Booking Request";
  const body = `Name: ${name}%0D%0APhone: ${phone}%0D%0APersons: ${person}%0D%0ADate: ${startDate}%0D%0ATime: ${reservationTime}%0D%0AAddress: ${address}%0D%0AMessage: ${message}`;

  const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;

  // Open default email client with pre-filled data
  window.location.href = mailtoLink;
});
