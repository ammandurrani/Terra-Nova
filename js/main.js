// Smooth scroll for navigation links
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href.startsWith('#')) {
      e.preventDefault();
      document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
      this.classList.add('active');
      const target = document.querySelector(href);
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 70,
          behavior: 'smooth'
        });
      }
    }
  });
});

// Simple form validation for consultation forms (if any)
document.querySelectorAll('.consultation form').forEach(form => {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    let valid = true;
    form.querySelectorAll('input, textarea').forEach(input => {
      if (!input.value.trim()) {
        input.style.borderColor = '#e89b3c';
        valid = false;
      } else {
        input.style.borderColor = '#ccc';
      }
    });
    if (valid) {
      alert('Thank you for your request! We will contact you soon.');
      form.reset();
    }
  });
});

/* Contact form submission (modal removed) */
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    let valid = true;
    // Validate required fields
    const name = contactForm.querySelector('#contact-name');
    const email = contactForm.querySelector('#contact-email');
    const vision = contactForm.querySelector('#contact-vision');
    [name, email, vision].forEach(input => {
      if (!input.value.trim()) {
        input.style.borderColor = '#e89b3c';
        valid = false;
      } else {
        input.style.borderColor = '#ccc';
      }
    });
    if (valid) {
      alert('Thank you for your request! We will contact you soon.');
      contactForm.reset();
    }
  });
}

/* Removed old hero title text swap on scroll (no longer needed) */

// Hide navbar as soon as scroll starts, show if scrolling up
(function() {
  const navbar = document.getElementById('navbar');
  let lastScrollY = window.scrollY;
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY) {
          // Scrolling down
          navbar.classList.add('hide');
        } else {
          // Scrolling up
          navbar.classList.remove('hide');
        }
        lastScrollY = currentScrollY;
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();

/**
 * Parallax Zoom Effect for Portfolio Center Image
 * (Patched: always applies after carousel render)
 */
let portfolioCenterObserver = null;
let lastObservedCenterImg = null;
function updatePortfolioZoom() {
  const centerImg = document.querySelector('.portfolio-carousel .carousel-image.center');
  if (!centerImg) return;
  // Calculate scale: zoom in as you scroll down, zoom out as you scroll up
  // Let's map window.scrollY from 0-600px to scale 1-1.2 (clamped)
  const minScroll = 0;
  const maxScroll = 600;
  const minScale = 1;
  const maxScale = 1.2;
  const scrollY = window.scrollY;
  const scale =
    scrollY <= minScroll
      ? minScale
      : scrollY >= maxScroll
      ? maxScale
      : minScale + ((maxScale - minScale) * (scrollY - minScroll)) / (maxScroll - minScroll);
  centerImg.setAttribute(
    'style',
    `transform: scale(${scale}) !important;` +
    'transition: transform 0.2s cubic-bezier(0.4,0,0.2,1);' +
    'z-index: 2;' +
    'will-change: transform;'
  );
}

// Observe the center image for intersection with viewport
function observePortfolioCenterImage() {
  const centerImg = document.querySelector('.portfolio-carousel .carousel-image.center');
  if (!centerImg) return;
  if (portfolioCenterObserver) {
    if (lastObservedCenterImg) {
      portfolioCenterObserver.unobserve(lastObservedCenterImg);
    }
  } else {
    portfolioCenterObserver = new window.IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // When center image enters viewport, apply zoom effect
          updatePortfolioZoom();
          window.addEventListener('scroll', updatePortfolioZoom, { passive: true });
        } else {
          // When center image leaves viewport, reset scale and remove scroll listener
          entry.target.setAttribute(
            'style',
            'transform: scale(1) !important; transition: transform 0.2s cubic-bezier(0.4,0,0.2,1); z-index: 2; will-change: transform;'
          );
          window.removeEventListener('scroll', updatePortfolioZoom, { passive: true });
        }
      });
    }, { threshold: 0.2 });
  }
  portfolioCenterObserver.observe(centerImg);
  lastObservedCenterImg = centerImg;
}

window.addEventListener('DOMContentLoaded', () => {
  updatePortfolioZoom();
  observePortfolioCenterImage();
});

/**
 * Clientele Section Slide-in Parallax Effect
 */
(function() {
  const clienteleText = document.querySelector('.exterior .interior-text');
  if (!clienteleText) return;

  function handleIntersection(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        clienteleText.classList.add('clientele-slide-in');
        clienteleText.classList.remove('clientele-hidden');
        observer.unobserve(clienteleText);
      }
    });
  }

  const observer = new window.IntersectionObserver(handleIntersection, {
    threshold: 0.3
  });

  observer.observe(clienteleText);
})();

/**
 * Hero title scroll-based fade and parallax
 */
(function() {
  const heroTitle = document.querySelector('.hero-title');
  if (!heroTitle) return;
  const originalSpan = heroTitle.querySelector('.hero-title-original');
  const scrolledSpan = heroTitle.querySelector('.hero-title-scrolled');
  if (!originalSpan || !scrolledSpan) return;

  function updateFadeAndParallax() {
    const scrollY = window.scrollY;

    // Fade out original as scrollY goes 0 → 20px
    let origOpacity = 1;
    if (scrollY > 0 && scrollY < 20) {
      origOpacity = 1 - (scrollY / 20);
    } else if (scrollY >= 20) {
      origOpacity = 0;
    }
    originalSpan.style.opacity = origOpacity;

    // Fade in scrolled as scrollY goes 10px → 100px, hold, then fade out 350px → 500px
    let scrolledOpacity = 0;
    if (scrollY >= 10 && scrollY < 100) {
      scrolledOpacity = (scrollY - 10) / 90;
    } else if (scrollY >= 100 && scrollY < 350) {
      scrolledOpacity = 1;
    } else if (scrollY >= 350 && scrollY < 500) {
      scrolledOpacity = 1 - ((scrollY - 350) / 150);
    } else if (scrollY >= 500) {
      scrolledOpacity = 0;
    }
    scrolledSpan.style.opacity = scrolledOpacity;
  }

  window.addEventListener('scroll', updateFadeAndParallax);
  // Initialize on load
  updateFadeAndParallax();
})();

/**
 * Portfolio Carousel Logic
 */
(function() {
  const imageFiles = [
    "images/portfolio1.jpg",
    "images/portfolio2.jpg",
    "images/portfolio3.jpg",
    "images/portfolio4.jpg",
    "images/portfolio5.png"
  ];
  const altTexts = [
    "Portfolio 1",
    "Portfolio 2",
    "Portfolio 3",
    "Portfolio 4",
    "Portfolio 5"
  ];

  const carousel = document.querySelector('.portfolio-carousel');
  if (!carousel) return;

  const imagesContainer = carousel.querySelector('.carousel-images');
  const leftArrow = carousel.querySelector('.carousel-arrow.left');
  const rightArrow = carousel.querySelector('.carousel-arrow.right');

  let centerIdx = 1; // Start with 2nd image as center

  function getIndices(center, total) {
    // Returns [left, center, right] indices, wrapping around
    const left = (center - 1 + total) % total;
    const right = (center + 1) % total;
    return [left, center, right];
  }

  function renderCarousel() {
    const [leftIdx, centerIdxNow, rightIdx] = getIndices(centerIdx, imageFiles.length);
    imagesContainer.innerHTML = "";

    // Left image
    const leftImg = document.createElement("img");
    leftImg.src = imageFiles[leftIdx];
    leftImg.alt = altTexts[leftIdx];
    leftImg.className = "carousel-image left";
    imagesContainer.appendChild(leftImg);

    // Center image
    const centerImg = document.createElement("img");
    centerImg.src = imageFiles[centerIdxNow];
    centerImg.alt = altTexts[centerIdxNow];
    centerImg.className = "carousel-image center";
    imagesContainer.appendChild(centerImg);

    // Right image
    const rightImg = document.createElement("img");
    rightImg.src = imageFiles[rightIdx];
    rightImg.alt = altTexts[rightIdx];
    rightImg.className = "carousel-image right";
    imagesContainer.appendChild(rightImg);

    // (Zoom effect is now only updated on scroll)
    updatePortfolioZoom();
    observePortfolioCenterImage();
  }

  function goLeft() {
    centerIdx = (centerIdx - 1 + imageFiles.length) % imageFiles.length;
    renderCarousel();
  }

  function goRight() {
    centerIdx = (centerIdx + 1) % imageFiles.length;
    renderCarousel();
  }

  leftArrow.addEventListener('click', goLeft);
  rightArrow.addEventListener('click', goRight);

  // Keyboard navigation
  carousel.addEventListener('keydown', function(e) {
    if (e.key === "ArrowLeft") {
      goLeft();
    } else if (e.key === "ArrowRight") {
      goRight();
    }
  });

  // Make carousel focusable for keyboard navigation
  carousel.tabIndex = 0;

  // Initial render
  renderCarousel();
})();
