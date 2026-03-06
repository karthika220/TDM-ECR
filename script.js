/* ============================================================
   script.js — The Detailing Mafia ECR Landing Page
============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ----------------------------------------------------------
     NAVBAR – Scroll shadow + sticky behaviour
  ---------------------------------------------------------- */
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  /* ----------------------------------------------------------
     NAVBAR – Hamburger / Mobile Menu
  ---------------------------------------------------------- */
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', function () {
    mobileMenu.classList.toggle('open');
  });

  // Close mobile menu when a link is clicked
  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      mobileMenu.classList.remove('open');
    });
  });

  /* ----------------------------------------------------------
     VIDEO – Hide placeholder once video loads / plays
  ---------------------------------------------------------- */
  const video           = document.querySelector('.studio-video');
  const videoPlaceholder = document.getElementById('videoPlaceholder');

  if (video) {
    // If the video source is valid, hide the placeholder
    video.addEventListener('loadeddata', function () {
      if (videoPlaceholder) {
        videoPlaceholder.style.display = 'none';
      }
    });

    video.addEventListener('error', function () {
      // Keep placeholder visible if video fails
      if (videoPlaceholder) {
        videoPlaceholder.style.display = 'flex';
      }
    });

    // Initial check — if no valid source, show placeholder
    if (video.readyState === 0 || video.src === '' || video.src === window.location.href) {
      if (videoPlaceholder) {
        videoPlaceholder.style.display = 'flex';
      }
    }
  }

  /* ----------------------------------------------------------
     GALLERY SLIDER
  ---------------------------------------------------------- */
  const galleryTrack = document.getElementById('galleryTrack');
  const galleryPrev  = document.getElementById('galleryPrev');
  const galleryNext  = document.getElementById('galleryNext');

  if (galleryTrack && galleryPrev && galleryNext) {
    const slides         = galleryTrack.querySelectorAll('.gallery-slide');
    let currentIndex     = 0;
    const visibleCount   = getVisibleCount();

    function getVisibleCount () {
      if (window.innerWidth <= 768) return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    }

    function getSlideWidth () {
      if (slides.length === 0) return 0;
      const slide = slides[0];
      const style = window.getComputedStyle(slide);
      const gap   = parseInt(window.getComputedStyle(galleryTrack).gap) || 20;
      return slide.offsetWidth + gap;
    }

    function goTo (index) {
      const totalSlides    = slides.length;
      const visible        = getVisibleCount();
      const maxIndex       = Math.max(0, totalSlides - visible);
      currentIndex         = Math.max(0, Math.min(index, maxIndex));
      const offset         = currentIndex * getSlideWidth();
      galleryTrack.style.transform = `translateX(-${offset}px)`;
      galleryTrack.style.transition = 'transform 0.4s ease';
    }

    galleryNext.addEventListener('click', function () {
      goTo(currentIndex + 1);
    });

    galleryPrev.addEventListener('click', function () {
      goTo(currentIndex - 1);
    });

    // Recalculate on resize
    window.addEventListener('resize', function () {
      goTo(0);
    });

    // Make gallery track flex without overflow hidden on the wrapper
    galleryTrack.style.overflow  = 'hidden';
    galleryTrack.style.display   = 'flex';
  }

  /* ----------------------------------------------------------
     FAQ ACCORDION
  ---------------------------------------------------------- */
  const faqList = document.getElementById('faqList');

  if (faqList) {
    faqList.querySelectorAll('.faq-q').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const item      = btn.closest('.faq-item');
        const isOpen    = item.classList.contains('open');

        // Close all
        faqList.querySelectorAll('.faq-item').forEach(function (el) {
          el.classList.remove('open');
        });

        // Toggle clicked
        if (!isOpen) {
          item.classList.add('open');
        }
      });
    });
  }

  /* ----------------------------------------------------------
     FORM SUBMISSION (handleFormSubmit — called from HTML)
  ---------------------------------------------------------- */
  window.handleFormSubmit = function () {
    const nameInput    = document.querySelector('.hero-form-wrap input[placeholder="Name*"]');
    const phoneInput   = document.querySelector('.hero-form-wrap input[placeholder="Phone No*"]');
    const carInput     = document.querySelector('.hero-form-wrap input[placeholder="Car Model*"]');
    const serviceInput = document.querySelector('.hero-form-wrap select');

    const name    = nameInput    ? nameInput.value.trim()    : '';
    const phone   = phoneInput   ? phoneInput.value.trim()   : '';
    const car     = carInput     ? carInput.value.trim()     : '';
    const service = serviceInput ? serviceInput.value.trim() : '';

    if (!name) {
      alert('Please enter your name.');
      nameInput && nameInput.focus();
      return;
    }

    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      alert('Please enter a valid 10-digit mobile number.');
      phoneInput && phoneInput.focus();
      return;
    }

    if (!car) {
      alert('Please enter your car model.');
      carInput && carInput.focus();
      return;
    }

    if (!service) {
      alert('Please select a service.');
      serviceInput && serviceInput.focus();
      return;
    }

    // Compose WhatsApp message
    const message = encodeURIComponent(
      `Hi, I'd like to book an appointment at The Detailing Mafia ECR.\n\n` +
      `*Name:* ${name}\n` +
      `*Phone:* ${phone}\n` +
      `*Car Model:* ${car}\n` +
      `*Service:* ${service}`
    );

    const waNumber = '918925737773';
    window.open(`https://wa.me/${waNumber}?text=${message}`, '_blank');

    // Clear form
    if (nameInput)    nameInput.value    = '';
    if (phoneInput)   phoneInput.value   = '';
    if (carInput)     carInput.value     = '';
    if (serviceInput) serviceInput.value = '';
  };

  /* ----------------------------------------------------------
     SMOOTH SCROLL for anchor links
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = navbar ? navbar.offsetHeight : 0;
        const top    = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ----------------------------------------------------------
     SCROLL REVEAL — subtle fade-in on scroll
  ---------------------------------------------------------- */
  const revealEls = document.querySelectorAll(
    '.service-card, .why-card, .about-item, .faq-item, .gallery-slide'
  );

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity    = '1';
          entry.target.style.transform  = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealEls.forEach(function (el, i) {
      el.style.opacity   = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = `opacity 0.5s ease ${i * 0.06}s, transform 0.5s ease ${i * 0.06}s`;
      observer.observe(el);
    });
  }

});
