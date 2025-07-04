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

// Simple form validation
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
