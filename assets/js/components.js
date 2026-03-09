// Function to load both the Header and the Footer
async function loadComponents() {
    try {
        // 1. Fetch and inject the Header
        const headerPlaceholder = document.getElementById('header-placeholder');
        if (headerPlaceholder) {
            const headerResponse = await fetch('header.html');
            const headerHTML = await headerResponse.text();
            headerPlaceholder.innerHTML = headerHTML;
            
            // Initialize mobile menu ONLY after header is loaded
            initializeMobileMenu();
            
            // Tell Firebase it's safe to look for the auth-container
            document.dispatchEvent(new Event('headerLoaded'));
        }

        // 2. Fetch and inject the Footer
        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (footerPlaceholder) {
            const footerResponse = await fetch('footer.html');
            const footerHTML = await footerResponse.text();
            footerPlaceholder.innerHTML = footerHTML;
        }

    } catch (error) {
        console.error("Error loading components:", error);
    }
}

// Mobile Menu Logic
function initializeMobileMenu() {
    const openBtn = document.querySelector('.nav-toggle-btn[aria-label="open manu"]');
    const closeBtn = document.querySelector('.nav-toggle-btn[aria-label="close menu"]');
    const navbar = document.querySelector('.navbar');
    const overlay = document.querySelector('.overlay');

    if (openBtn && navbar) {
      openBtn.addEventListener('click', (e) => {
        e.preventDefault();
        navbar.classList.add('active');
        if (overlay) overlay.classList.add('active');
        document.body.classList.add('menu-open');
      });
    }

    if (closeBtn && navbar) {
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        navbar.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        document.body.classList.remove('menu-open');
      });
    }

    if (overlay && navbar) {
      overlay.addEventListener('click', () => {
        navbar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.classList.remove('menu-open');
      });
    }
}

// Run the loader when the page opens
document.addEventListener('DOMContentLoaded', loadComponents);