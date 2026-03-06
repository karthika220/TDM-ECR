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
     VIDEO – Autoplay with loop, hide placeholder
  ---------------------------------------------------------- */
  const video           = document.querySelector('.studio-video');
  const videoPlaceholder = document.getElementById('videoPlaceholder');

  if (video) {
    // Hide placeholder immediately — video has autoplay attribute
    if (videoPlaceholder) {
      videoPlaceholder.style.display = 'none';
    }

    // Attempt to play programmatically (some browsers block autoplay)
    var playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.then(function () {
        // Autoplay started successfully
        if (videoPlaceholder) {
          videoPlaceholder.style.display = 'none';
        }
      }).catch(function () {
        // Autoplay was blocked, show placeholder with play button
        if (videoPlaceholder) {
          videoPlaceholder.style.display = 'flex';
          videoPlaceholder.style.cursor = 'pointer';
          videoPlaceholder.addEventListener('click', function () {
            video.muted = true;
            video.play();
            videoPlaceholder.style.display = 'none';
          });
        }
      });
    }

    // When video data loads, ensure placeholder is hidden
    video.addEventListener('canplay', function () {
      if (videoPlaceholder) {
        videoPlaceholder.style.display = 'none';
      }
    });
  }

  /* ----------------------------------------------------------
     GALLERY SLIDER
  ---------------------------------------------------------- */
  const galleryTrack = document.getElementById('galleryTrack');
  const galleryPrev  = document.getElementById('galleryPrev');
  const galleryNext  = document.getElementById('galleryNext');

  if (galleryTrack && galleryPrev && galleryNext) {
    const slides     = galleryTrack.querySelectorAll('.gallery-slide');
    let currentIndex = 0;

    function getVisibleCount () {
      if (window.innerWidth <= 480) return 1;
      if (window.innerWidth <= 768) return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    }

    function updateSlider () {
      var visible     = getVisibleCount();
      var totalSlides = slides.length;
      var maxIndex    = Math.max(0, totalSlides - visible);

      if (currentIndex > maxIndex) currentIndex = maxIndex;
      if (currentIndex < 0) currentIndex = 0;

      // Calculate the percentage offset based on visible count
      var gap = 20; // gap in px between slides
      var trackWidth = galleryTrack.offsetWidth;
      var slideWidth = (trackWidth - (visible - 1) * gap) / visible;
      var offset = currentIndex * (slideWidth + gap);

      galleryTrack.style.transform = 'translateX(-' + offset + 'px)';
    }

    galleryNext.addEventListener('click', function () {
      var visible  = getVisibleCount();
      var maxIndex = Math.max(0, slides.length - visible);
      if (currentIndex < maxIndex) {
        currentIndex++;
        updateSlider();
      }
    });

    galleryPrev.addEventListener('click', function () {
      if (currentIndex > 0) {
        currentIndex--;
        updateSlider();
      }
    });

    // Recalculate on resize
    window.addEventListener('resize', function () {
      updateSlider();
    });

    // Initial positioning
    updateSlider();
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

    if (!phone || !/^\d{10}$/.test(phone)) {
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

    // Clear form
    if (nameInput)    nameInput.value    = '';
    if (phoneInput)   phoneInput.value   = '';
    if (carInput)     carInput.value     = '';
    if (serviceInput) serviceInput.value = '';

    // Redirect to thank you page
    window.location.href = 'thankyou.html';
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
     GA4 CONVERSION EVENTS
     ─────────────────────
     3 Conversion Events tracked across the landing page:
       1. whatsapp_click  → All WhatsApp buttons (navbar, floating, any)
       2. call_click      → All Call buttons (Call Now, floating call)
       3. form_submission → Fires ONLY on thankyou.html page load
     ─────────────────────
     These events push to dataLayer for GTM to pick up.
     In GTM: Create Custom Event triggers matching these names.
     In GA4: Mark these as Conversions.
     In Google Ads: Import these GA4 conversions.
  ---------------------------------------------------------- */

  // ── CONVERSION 1: WhatsApp Click ──
  // Groups ALL WhatsApp buttons into one single conversion event
  document.querySelectorAll('a[href*="wa.me"]').forEach(function (el) {
    el.addEventListener('click', function () {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'whatsapp_click',
        'button_location': el.classList.contains('floating-whatsapp') ? 'floating' :
                           el.classList.contains('btn-whatsapp-nav') ? 'navbar' : 'inline'
      });
    });
  });

  // ── CONVERSION 2: Call Click ──
  // Groups ALL Call buttons into one single conversion event
  document.querySelectorAll('a[href^="tel:"]').forEach(function (el) {
    el.addEventListener('click', function () {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'call_click',
        'button_location': el.classList.contains('floating-call') ? 'floating' :
                           el.closest('.section-services') ? 'services' :
                           el.closest('.section-cta-banner') ? 'cta_banner' :
                           el.closest('.section-feature') ? 'ppf_section' :
                           el.closest('.location-btns') ? 'location' : 'other'
      });
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
      el.style.transition = 'opacity 0.5s ease ' + (i * 0.06) + 's, transform 0.5s ease ' + (i * 0.06) + 's';
      observer.observe(el);
    });
  }

});
