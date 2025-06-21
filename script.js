// script.js
let currentFilter = 'all';
let currentSlide = 0;
document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-links a");
  const darkToggle = document.getElementById("darkToggle");
  const navMenu = document.getElementById("navMenu");
  const navLinkElements = document.querySelectorAll("#navMenu a");

  const body = document.body;

  // === ScrollSpy Navigation ===
  const updateActiveLink = () => {
    const scrollY = window.scrollY;
    const sections = document.querySelectorAll("section");

    let currentSection = null;
    let maxVisibleHeight = 0;

    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);

      if (visibleHeight > maxVisibleHeight && visibleHeight > 100) { // ensures real visibility
        maxVisibleHeight = visibleHeight;
        currentSection = section.getAttribute("id");
      }
    });

    document.querySelectorAll(".nav-links a").forEach(link => {
      link.classList.remove("active");
      if (currentSection && link.getAttribute("href").includes(currentSection)) {
        link.classList.add("active");
      }
    });
  };

  // === Reveal Sections on Scroll ===
  const revealSections = () => {
    const triggerBottom = window.innerHeight - 100;

    sections.forEach(section => {
      const sectionTop = section.getBoundingClientRect().top;
      if (sectionTop < triggerBottom) {
        section.classList.add("active");
      }
    });
  };

  // === Dark Mode ===
  const enableDark = () => {
    body.classList.add("dark");
    localStorage.setItem("theme", "dark");
  };

  const disableDark = () => {
    body.classList.remove("dark");
    localStorage.setItem("theme", "light");
  };

  darkToggle.addEventListener("click", () => {
    if (body.classList.contains("dark")) {
      disableDark();
    } else {
      enableDark();
    }
  });

  if (localStorage.getItem("theme") === "dark") {
    enableDark();
  }

  window.addEventListener("scroll", () => {
    updateActiveLink();
    revealSections();
  });

  updateActiveLink();
  revealSections();

  // Hamburger Toggle
  const hamburger = document.getElementById("hamburger");

  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  });

  // Close menu when clicking outside
  document.addEventListener("click", (event) => {
    const isClickInsideMenu = navMenu.contains(event.target);
    const isClickOnHamburger = hamburger.contains(event.target);

    if (!isClickInsideMenu && !isClickOnHamburger) {
      navMenu.classList.remove("active");
    }
  });

  // Collapse when any link is clicked (optional)
  navLinkElements.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
    });
  });



  // === Typing Animation ===
  // ✅ Final version — no duplicate calls
  const typingText = document.getElementById("typing-text");
  const phrases = [
    "B.Tech CSE-IoT Student",
    "Web Developer",
    "AI Enthusiast",
    "IoT Explorer"
  ];

  let phraseIndex = 0;
  let letterIndex = 0;
  let isDeleting = false;
  let currentText = "";

  if (typingText) {
    function typeEffect() {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        currentText = currentPhrase.substring(0, letterIndex--);
      } else {
        currentText = currentPhrase.substring(0, letterIndex++);
      }

      typingText.textContent = currentText;

      if (!isDeleting && letterIndex === currentPhrase.length + 1) {
        isDeleting = true;
        setTimeout(typeEffect, 1000);
      } else if (isDeleting && letterIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(typeEffect, 300);
      } else {
        setTimeout(typeEffect, isDeleting ? 60 : 100);
      }
    }

    typeEffect(); // ✅ this is the only call you need
  }


  // === Modal Logic ===
  window.openModal = function () {
    document.getElementById("projectModal").style.display = "block";
  };

  window.closeModal = function () {
    document.getElementById("projectModal").style.display = "none";
  };

  window.onclick = function (event) {
    const modal = document.getElementById("projectModal");
    if (event.target == modal) modal.style.display = "none";
  };

  // === Certificate Filter Logic ===

  const filterButtons = document.querySelectorAll(".filter-btn");
  const certBlocks = document.querySelectorAll(".cert-card");

  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      currentFilter = btn.getAttribute("data-category"); // 🟢 TRACK CURRENT FILTER

      certBlocks.forEach(block => {
        const blockCat = block.getAttribute("data-category");
        block.style.display = (currentFilter === "all" || blockCat === currentFilter) ? "block" : "none";
      });
    });
  });


  // === Dot Tooltip Logic ===
  const tooltip = document.getElementById("tooltip");
  const dots = document.querySelectorAll(".dot");

  dots.forEach(dot => {
    dot.addEventListener("mouseenter", (e) => {
      tooltip.textContent = dot.getAttribute("data-info");
      tooltip.style.display = "block";
      tooltip.style.left = e.pageX + 10 + "px";
      tooltip.style.top = e.pageY - 40 + "px";
    });

    dot.addEventListener("mousemove", (e) => {
      tooltip.style.left = e.pageX + 10 + "px";
      tooltip.style.top = e.pageY - 40 + "px";
    });

    dot.addEventListener("mouseleave", () => {
      tooltip.style.display = "none";
    });
  });
});

//remove hash about or #resume etc. after page refresh so that the page loads again

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

window.addEventListener("beforeunload", function () {
  window.scrollTo(0, 0);
});

window.addEventListener("load", function () {
  // Remove hash if any
  if (window.location.hash) {
    window.location.href = window.location.pathname;
  } else {
    setTimeout(() => window.scrollTo(0, 0), 0);
  }
});;


//FOR CAROUSEL 

// Fixing carousel to show all items in same category with clean layout and navigation

function openCarousel(category, clickedCard = null) {
  const track = document.getElementById('carousel-track');
  const modal = document.getElementById('carouselModal');
  const titleEl = document.querySelector('.carousel-title');
  const allCerts = Array.from(document.querySelectorAll('.cert-card'));

  const filtered = category === 'all'
    ? allCerts
    : allCerts.filter(card => card.dataset.category === category);

  titleEl.textContent = category === 'all'
    ? 'All Certifications'
    : `${category.charAt(0).toUpperCase() + category.slice(1)} Certifications`;

  track.innerHTML = '';
  let matchedIndex = 0;
  const clickedId = clickedCard?.getAttribute('data-id');

  filtered.forEach((card, i) => {
    const img = card.querySelector('img').src;
    const title = card.querySelector('.cert-title')?.textContent || 'Untitled';
    const company = card.querySelector('.cert-company')?.textContent || '';

    const slide = document.createElement('div');
    slide.className = 'carousel-slide';

    let titleHTML = `<p class="fw-bold">${title}</p>`;

    if (card.getAttribute('data-id') === 'Professional_skills_ibm') {
      const badgeURL = 'https://www.credly.com/badges/53c9bdd6-361b-4465-8799-1af16dbe251d';
      titleHTML = `<p class="fw-bold">${title} – <a href="${badgeURL}" target="_blank" style="color: var(--accent); text-decoration: underline;">View Badge</a></p>`;
    }

    if (card.getAttribute('data-id') === 'Job_essentials_ibm') {
      const badgeURL = 'https://www.credly.com/badges/25cc473c-c404-4a72-a19b-8813114d9686/public_url';
      titleHTML = `<p class="fw-bold">${title} – <a href="${badgeURL}" target="_blank" style="color: var(--accent); text-decoration: underline;">View Badge</a></p>`;
    }

    slide.innerHTML = `
      <img src="${img}" alt="${title}">
      ${titleHTML}
      <p style="color: var(--accent);">${company}</p>
    `;

    if (card.getAttribute('data-id') === clickedId) {
      matchedIndex = i;
    }

    track.appendChild(slide);
  });

  currentSlide = matchedIndex;
  modal.style.display = 'flex';
  requestAnimationFrame(() => updateCarousel());

  setTimeout(() => {
    document.addEventListener("click", handleClickOutsideCarousel);
  }, 0);
}

function closeCarousel() {
  document.getElementById('carouselModal').style.display = 'none';
  document.removeEventListener("click", handleClickOutsideCarousel);
}

function handleClickOutsideCarousel(e) {
  const modal = document.getElementById("carouselModal");
  const box = document.querySelector(".carousel-box");

  if (modal.style.display === "flex" && !box.contains(e.target)) {
    closeCarousel();
  }
}

function updateCarousel() {
  const track = document.getElementById('carousel-track');
  const slides = Array.from(track.children);
  if (!slides[currentSlide]) return;

  slides[currentSlide].scrollIntoView({
    behavior: 'smooth',
    block: 'nearest',
    inline: 'center'
  });
}

function moveSlide(direction) {
  const track = document.getElementById('carousel-track');
  const slides = track.children;
  currentSlide = (currentSlide + direction + slides.length) % slides.length;
  updateCarousel();
}

document.querySelectorAll('.cert-card').forEach(card => {
  card.addEventListener('click', () => {
    openCarousel(currentFilter, card);
  });
});
