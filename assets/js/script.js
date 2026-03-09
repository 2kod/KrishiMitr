'use strict';

/**
 * Add event on element
 */
const addEventOnElem = function (elem, type, callback) {
  if (elem) {
    if (elem.length && typeof elem.length !== 'undefined' && typeof elem !== 'string') { // Check if it's an array-like object
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

/**
 * Navbar Toggle (Mobile Menu)
 */
const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const navLinks = document.querySelectorAll("[data-nav-link]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = function () {
  if (navbar) navbar.classList.toggle("active");
  if (overlay) overlay.classList.toggle("active");
}

addEventOnElem(navTogglers, "click", toggleNavbar);

const closeNavbar = function () {
  if (navbar) navbar.classList.remove("active");
  if (overlay) overlay.classList.remove("active");
}

addEventOnElem(navLinks, "click", closeNavbar);

/**
 * Header Active & Back to Top Button
 */
const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

window.addEventListener("scroll", function () {
  if (window.scrollY >= 100) {
    if (header) header.classList.add("active");
    if (backTopBtn) backTopBtn.classList.add("active");
  } else {
    if (header) header.classList.remove("active");
    if (backTopBtn) backTopBtn.classList.remove("active");
  }
});

/**
 * Scroll Reveal Effect
 */
const sections = document.querySelectorAll("[data-section]");

const reveal = function () {
  for (let i = 0; i < sections.length; i++) {
    // Safety check: ensure section exists before measuring
    if (sections[i]) {
        // Triggers slightly earlier (1.2 instead of 2) so animations feel smoother
        if (sections[i].getBoundingClientRect().top < window.innerHeight / 1.2) {
          sections[i].classList.add("active");
        }
    }
  }
}

reveal();
addEventOnElem(window, "scroll", reveal);

/**
 * Language Selector (Prevents console errors when switching languages)
 */
window.changeLanguage = function(lang) {
  console.log("Language changed to:", lang);
  // Add actual translation logic here in the future
};