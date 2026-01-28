'use strict';

const addEventOnElem = function (elem, type, callback) {
    // Check if elem is an iterable collection (like NodeList or HTMLCollection)
    // and if it has a 'length' property and is not a string or a simple object.
    if (elem && typeof elem.length === 'number' && typeof elem !== 'string' && !(elem instanceof Element)) {
        for (let i = 0; i < elem.length; i++) {
            elem[i].addEventListener(type, callback);
        }
    } else if (elem) { // If it's a single element and not null/undefined
        elem.addEventListener(type, callback);
    } else {
        console.warn('Attempted to add event listener to a null or undefined element.', elem);
    }
}

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