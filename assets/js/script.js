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
  
  // Ensure navbar is hidden after page load
  if (navbar && !navbar.classList.contains("active")) {
    navbar.style.display = "none";
    navbar.style.transform = "translateX(-100%)";
    navbar.style.visibility = "hidden";
    navbar.style.opacity = "0";
    navbar.style.clipPath = "inset(0 0 0 100%)";
    navbar.style.webkitClipPath = "inset(0 0 0 100%)";
    navbar.style.pointerEvents = "none";
  }
  if (overlay && !overlay.classList.contains("active")) {
    overlay.style.opacity = "0";
    overlay.style.visibility = "hidden";
  }
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
 * NAVBAR
 */

const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const overlay = document.querySelector("[data-overlay]");

// Ensure navbar is hidden immediately on page load (before CSS loads)
if (navbar) {
  navbar.classList.remove("active");
  // Set inline styles immediately to prevent flash of visible sidebar
  navbar.style.display = "none";
  navbar.style.transform = "translateX(-100%)";
  navbar.style.visibility = "hidden";
  navbar.style.opacity = "0";
  navbar.style.clipPath = "inset(0 0 0 100%)";
  navbar.style.webkitClipPath = "inset(0 0 0 100%)";
  navbar.style.pointerEvents = "none";
}

if (overlay) {
  overlay.classList.remove("active");
  overlay.style.opacity = "0";
  overlay.style.visibility = "hidden";
}

const toggleNavbar = function () {
  const isActive = navbar.classList.contains("active");
  
  if (isActive) {
    // Closing navbar
    navbar.classList.remove("active");
    overlay.classList.remove("active");
    document.body.classList.remove("nav-active");
    // Hide completely after transition
    setTimeout(() => {
      if (!navbar.classList.contains("active")) {
        navbar.style.display = "none";
        navbar.style.transform = "translateX(-100%)";
        navbar.style.visibility = "hidden";
        navbar.style.opacity = "0";
        navbar.style.clipPath = "inset(0 0 0 100%)";
        navbar.style.webkitClipPath = "inset(0 0 0 100%)";
        navbar.style.pointerEvents = "none";
      }
    }, 400);
  } else {
    // Opening navbar - remove inline display first
    navbar.style.display = "";
    navbar.style.transform = "";
    navbar.style.visibility = "";
    navbar.style.opacity = "";
    navbar.style.clipPath = "";
    navbar.style.webkitClipPath = "";
    navbar.style.pointerEvents = "";
    // Small delay to ensure display is set before adding active class
    requestAnimationFrame(() => {
      navbar.classList.add("active");
      overlay.classList.add("active");
      document.body.classList.add("nav-active");
    });
  }
};

addEventOnElements(navTogglers, "click", toggleNavbar);

// Prevent navbar from closing when clicking inside it
navbar.addEventListener("click", function (e) {
  e.stopPropagation();
});

// Close navbar when clicking on overlay
overlay.addEventListener("click", function () {
  if (navbar.classList.contains("active")) {
    toggleNavbar();
  }
});

// Close navbar when clicking on a link
const navbarLinks = document.querySelectorAll(".navbar-link");
navbarLinks.forEach(link => {
  link.addEventListener("click", function () {
    // Small delay to allow navigation
    setTimeout(() => {
      if (navbar.classList.contains("active")) {
        toggleNavbar();
      }
    }, 300);
  });
});

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

window.addEventListener("scroll", function () {
  // Don't hide header if navbar is open
  if (navbar.classList.contains("active")) {
    return;
  }
  
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
});


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

const autoSlide = function () {
  autoSlideInterval = setInterval(function () {
    slideNext();
  }, 7000);
};

addEventOnElements(
  [heroSliderNextBtn, heroSliderPrevBtn],
  "mouseover",
  function () {
    clearInterval(autoSlideInterval);
  }
);

addEventOnElements(
  [heroSliderNextBtn, heroSliderPrevBtn],
  "mouseout",
  autoSlide
);

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
