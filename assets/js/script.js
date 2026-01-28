'use strict';

/**
 * add event on element
 */
const addEventOnElem = function (elem, type, callback) {
  if (elem) {
    if (elem.length && typeof elem.length !== 'undefined') { // Check if it's an array-like object
      for (let i = 0; i < elem.length; i++) {
        if (elem[i] && typeof elem[i].addEventListener === 'function') { // Ensure element exists and has addEventListener
          elem[i].addEventListener(type, callback);
        } else {
          console.warn("Attempted to add event listener to a non-element in a collection:", elem[i]);
        }
      }
    } else if (typeof elem.addEventListener === 'function') { // If it's a single element with addEventListener
      elem.addEventListener(type, callback);
    } else {
      console.warn("Attempted to add event listener to an invalid element:", elem);
    }
  }
}

// ... rest of your code

/**
 * navbar toggle
 */
const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const navLinks = document.querySelectorAll("[data-nav-link]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
}

addEventOnElem(navTogglers, "click", toggleNavbar);

const closeNavbar = function () {
  navbar.classList.remove("active");
  overlay.classList.remove("active");
}

addEventOnElem(navLinks, "click", closeNavbar);

/**
 * header active
 */
const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

window.addEventListener("scroll", function () {
  if (window.scrollY >= 100) {
    header.classList.add("active");
    if(backTopBtn) backTopBtn.classList.add("active"); // Safety check
  } else {
    header.classList.remove("active");
    if(backTopBtn) backTopBtn.classList.remove("active"); // Safety check
  }
});

/**
 * scroll reveal effect
 */
const sections = document.querySelectorAll("[data-section]");

const reveal = function () {
  for (let i = 0; i < sections.length; i++) {
    // Safety check: ensure section exists before measuring
    if (sections[i]) {
        if (sections[i].getBoundingClientRect().top < window.innerHeight / 2) {
          sections[i].classList.add("active");
        }
    }
  }
}

reveal();
addEventOnElem(window, "scroll", reveal);