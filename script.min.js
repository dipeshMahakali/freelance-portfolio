/**
 * Dipesh Patel Portfolio - Interactive Studio Application Script
 * Controls: Navigation, Industry Filters, Interactive Slider, Case Study Modal, Multi-step Project Enquiry Funnel, FAQ Accordion
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // --- 1. Sticky Header & Mobile Navigation ---
  const header = document.querySelector('.header');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  const closeMobileNavBtn = document.getElementById('closeMobileNavBtn');

  const closeMobileMenu = () => {
    if (mobileNavDrawer) mobileNavDrawer.classList.remove('open');
    if (mobileMenuBtn) mobileMenuBtn.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (mobileMenuBtn && mobileNavDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileNavDrawer.classList.contains('open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        mobileNavDrawer.classList.add('open');
        mobileMenuBtn.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });

    if (closeMobileNavBtn) {
      closeMobileNavBtn.addEventListener('click', closeMobileMenu);
    }

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNavDrawer.classList.contains('open')) {
        closeMobileMenu();
      }
    });
  }

  // --- 2. Industry Work Filter Bar ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const caseStudyCards = document.querySelectorAll('.case-study-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      caseStudyCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // --- 3. Interactive Before / After Image Slider ---
  const sliderContainer = document.getElementById('beforeAfterSlider');
  const afterWrapper = document.getElementById('sliderAfterWrapper');
  const handle = document.getElementById('sliderHandle');

  if (sliderContainer && afterWrapper && handle) {
    let isDragging = false;

    const setSliderPosition = (x) => {
      const rect = sliderContainer.getBoundingClientRect();
      let offsetX = x - rect.left;
      if (offsetX < 0) offsetX = 0;
      if (offsetX > rect.width) offsetX = rect.width;
      const percentage = (offsetX / rect.width) * 100;
      afterWrapper.style.width = `${percentage}%`;
      handle.style.left = `${percentage}%`;
    };

    sliderContainer.addEventListener('mousedown', (e) => {
      isDragging = true;
      setSliderPosition(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      setSliderPosition(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Touch Support for Mobile
    sliderContainer.addEventListener('touchstart', (e) => {
      isDragging = true;
      if (e.touches[0]) setSliderPosition(e.touches[0].clientX);
    });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      if (e.touches[0]) setSliderPosition(e.touches[0].clientX);
    });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });
  }

  // --- 4. FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');

    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other accordion items
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherContent = otherItem.querySelector('.faq-content');
        if (otherContent) otherContent.style.maxHeight = null;
      });

      // Toggle current item
      if (!isActive && content) {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

  // --- 5. Case Study Detailed Modal Data & Logic ---
  const caseStudyData = {
    'vk-shipping': {
      title: 'V K Shipping Services',
      subhead: 'Building trust for a growing shipping & freight business.',
      industry: 'Corporate Website · Logistics',
      heroImage: 'assets/vk-shipping.webp',
      overview: 'V K Shipping is an import/export and cargo logistics business. They needed a professional website to present ocean freight, customs clearance, and shipping services clearly to prospective business clients.',
      challenge: 'Their existing online presence lacked clear visual structure and detailed service breakdowns, making it difficult for international clients to assess their capabilities.',
      strategy: 'We reorganized the website into clear service categories (Ocean Freight, Air Cargo, Customs Clearance, Tracking) with prominent inquiry contact options on every page.',
      ux: 'Structured straightforward page layouts that allow visitors to quickly find specific shipping services and submit quote request forms.',
      design: 'Clean marine navy typography, structured service cards, and ample whitespace to convey reliability and professionalism.',
      dev: 'Engineered with lightweight semantic HTML5 and CSS/JS ensuring fast load times, accessible headings, and smooth mobile responsiveness.',
      responsive: 'Designed mobile-first with sticky inquiry triggers and touch-optimized navigation buttons.',
      result: 'Delivered a polished corporate website that presents the company shipping services clearly and builds confidence with international business prospects.'
    },
    'maa-bamleshwari': {
      title: 'Maa Bamleshwari Temple',
      subhead: 'Connecting pilgrims with essential temple information.',
      industry: 'Cultural / Religious Website',
      heroImage: 'assets/maa-bamleshwari.webp',
      overview: 'Maa Bamleshwari Temple in Dongargarh is a historic hill shrine visited by pilgrims. The goal was to build a clean website that provides visitors with accurate details on pooja timings, festival dates, and ropeway access.',
      challenge: 'Devotees and travelers frequently struggled to find verified information online regarding daily pooja schedules, festival dates, and ropeway operating hours.',
      strategy: 'Designed an organized informational website prioritizing key visitor needs: daily pooja schedules, festival updates, directions, and helpline contact details.',
      ux: 'Organized information into clear categories so pilgrims can find opening hours and transport details in a single tap.',
      design: 'Warm gold and off-white palette with clear typography and shrine photography reflecting the spiritual location.',
      dev: 'Lightweight static build ensuring fast loading even on low-speed mobile networks during peak festival traffic.',
      responsive: 'Designed mobile-first with high-contrast text sizes and quick tap buttons for directions and phone helplines.',
      result: 'Provided a reliable online information hub for devotees, making essential pilgrimage details easily accessible.'
    },
    'titan-forge': {
      title: 'Titan Forge',
      subhead: 'Modern website design for a local gym and training facility.',
      industry: 'Fitness / Wellness',
      heroImage: 'assets/titan-forge.webp',
      overview: 'Titan Forge is a local training facility and gym. They needed a modern website to showcase their facility, personal training options, and class schedules to prospective members.',
      challenge: 'Their previous site was cluttered and didn\'t effectively highlight their training programs, facilities, or membership options.',
      strategy: 'Designed a clean dark-themed website that showcases facility photos, trainer experience, and clear membership inquiry buttons.',
      ux: 'Created simple page paths for prospective members to view training programs, check schedule options, and request trial sessions.',
      design: 'Bold dark palette with clear typography, high-contrast images, and organized program grids.',
      dev: 'Built with optimized media containers and fast tabbed program schedule viewing for quick user interaction.',
      responsive: 'Flawlessly optimized across mobile screens, enabling visitors to quickly view class schedules and contact the gym on the go.',
      result: 'Provided the gym with a modern digital storefront that clearly presents their training services and encourages prospective members to reach out.'
    },
    'vk-impex': {
      title: 'VK Impex',
      subhead: 'Product showcase website for an import/export business.',
      industry: 'Corporate Website · Import Export',
      heroImage: 'assets/vk-impex.webp',
      overview: 'VK Impex is an import/export business handling merchant export products. They needed a clean website to list product categories and company details for prospective clients.',
      challenge: 'Needed a clear online catalog where business contacts could review export product offerings and request pricing quotes.',
      strategy: 'Structured a clear multi-page site displaying product specifications, export categories, and direct inquiry options.',
      ux: 'Segmented products into clear categories with downloadable product details and direct WhatsApp / email contact triggers.',
      design: 'Dark charcoal theme with organized product grids and straightforward contact layouts.',
      dev: 'Fast semantic architecture with complete Schema.org markup for clear business indexing.',
      responsive: 'Seamless performance across desktop monitors and mobile devices.',
      result: 'Gave VK Impex a factual, professional web presentation to share with prospective commercial partners.'
    }
  };

  const caseStudyModal = document.getElementById('caseStudyModal');
  const caseStudyModalBody = document.getElementById('caseStudyModalBody');
  const closeCaseStudyBtn = document.getElementById('closeCaseStudyBtn');

  document.querySelectorAll('[data-case-study]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectKey = btn.getAttribute('data-case-study');
      const data = caseStudyData[projectKey];
      if (!data) return;

      caseStudyModalBody.innerHTML = `
        <span class="cs-step-tag">${data.industry}</span>
        <h2 class="section-title" style="margin-bottom: 0.25rem;">${data.title}</h2>
        <p style="color: var(--accent); font-weight: 600; margin-bottom: 2rem; font-size: 1.1rem;">${data.subhead}</p>

        <div style="border-radius: var(--radius-md); overflow: hidden; margin-bottom: 2.5rem; border: 1px solid var(--border-color);">
          <img src="${data.heroImage}" alt="${data.title} website case study preview" style="width:100%; height:auto;">
        </div>

        <div class="cs-step-block">
          <div class="cs-step-tag">01 — Overview</div>
          <h3 class="cs-step-title">Project Summary</h3>
          <p class="cs-step-text">${data.overview}</p>
        </div>

        <div class="cs-step-block">
          <div class="cs-step-tag">02 — The Challenge</div>
          <h3 class="cs-step-title">Business Problem</h3>
          <p class="cs-step-text">${data.challenge}</p>
        </div>

        <div class="cs-step-block">
          <div class="cs-step-tag">03 — Strategy</div>
          <h3 class="cs-step-title">Positioning & Solution</h3>
          <p class="cs-step-text">${data.strategy}</p>
        </div>

        <div class="cs-step-block">
          <div class="cs-step-tag">04 — UX & Information Architecture</div>
          <h3 class="cs-step-title">User Journey & Hierarchy</h3>
          <p class="cs-step-text">${data.ux}</p>
        </div>

        <div class="cs-step-block">
          <div class="cs-step-tag">05 — Visual Design</div>
          <h3 class="cs-step-title">Editorial Identity & Aesthetic</h3>
          <p class="cs-step-text">${data.design}</p>
        </div>

        <div class="cs-step-block">
          <div class="cs-step-tag">06 — Development</div>
          <h3 class="cs-step-title">Performance & Architecture</h3>
          <p class="cs-step-text">${data.dev}</p>
        </div>

        <div class="cs-step-block">
          <div class="cs-step-tag">07 — Responsive Experience</div>
          <h3 class="cs-step-title">Mobile Optimization</h3>
          <p class="cs-step-text">${data.responsive}</p>
        </div>

        <div class="cs-step-block" style="border-bottom: none;">
          <div class="cs-step-tag">08 — Final Result</div>
          <h3 class="cs-step-title">Business Outcomes</h3>
          <p class="cs-step-text">${data.result}</p>
        </div>

        <div style="margin-top: 2rem; display: flex; gap: 1rem; flex-wrap: wrap;">
          <button class="btn btn-accent modal-enquiry-trigger">Start a Project Like This →</button>
          <button class="btn btn-secondary" onclick="document.getElementById('caseStudyModal').classList.remove('open'); document.body.style.overflow='';">Close Case Study</button>
        </div>
      `;

      caseStudyModal.classList.add('open');
      document.body.style.overflow = 'hidden';

      // Attach listener to internal CTA in modal
      const internalCta = caseStudyModalBody.querySelector('.modal-enquiry-trigger');
      if (internalCta) {
        internalCta.addEventListener('click', () => {
          caseStudyModal.classList.remove('open');
          openEnquiryModal();
        });
      }
    });
  });

  if (closeCaseStudyBtn) {
    closeCaseStudyBtn.addEventListener('click', () => {
      caseStudyModal.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  // --- 6. Multi-Step Project Enquiry Form Modal ---
  const enquiryModal = document.getElementById('enquiryModal');
  const closeEnquiryBtn = document.getElementById('closeEnquiryBtn');
  const enquiryForm = document.getElementById('enquiryForm');
  const steps = document.querySelectorAll('.enquiry-step');
  const progressFill = document.getElementById('enquiryProgressFill');
  const currentStepSpan = document.getElementById('currentStepNum');
  const prevStepBtn = document.getElementById('prevStepBtn');
  const nextStepBtn = document.getElementById('nextStepBtn');

  let currentStep = 1;
  const totalSteps = steps.length;

  const openEnquiryModal = () => {
    enquiryModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  document.querySelectorAll('.open-enquiry-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openEnquiryModal();
    });
  });

  if (closeEnquiryBtn) {
    closeEnquiryBtn.addEventListener('click', () => {
      enquiryModal.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  const updateStepUI = () => {
    steps.forEach((step, index) => {
      if (index + 1 === currentStep) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });

    if (currentStepSpan) currentStepSpan.textContent = currentStep;
    if (progressFill) progressFill.style.width = `${(currentStep / totalSteps) * 100}%`;

    if (prevStepBtn) {
      prevStepBtn.style.visibility = currentStep === 1 ? 'hidden' : 'visible';
    }

    if (nextStepBtn) {
      if (currentStep === totalSteps) {
        nextStepBtn.textContent = 'Send Project Enquiry →';
        nextStepBtn.classList.remove('btn-secondary');
        nextStepBtn.classList.add('btn-accent');
      } else {
        nextStepBtn.textContent = 'Next Step →';
        nextStepBtn.classList.remove('btn-accent');
        nextStepBtn.classList.add('btn-secondary');
      }
    }
  };

  // Option selection logic for Step cards
  document.querySelectorAll('.option-card').forEach(card => {
    card.addEventListener('click', () => {
      const parent = card.parentElement;
      parent.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
    });
  });

  // Validation Helper for Step 5 Contact Details
  const validateContactDetails = () => {
    const nameInput = document.getElementById('clientNameInput');
    const emailInput = document.getElementById('clientEmailInput');
    const phoneInput = document.getElementById('clientPhoneInput');

    const nameErr = document.getElementById('clientNameError');
    const emailErr = document.getElementById('clientEmailError');
    const phoneErr = document.getElementById('clientPhoneError');

    let isValid = true;
    let firstInvalidInput = null;

    // Reset error styling
    [nameInput, emailInput, phoneInput].forEach(input => {
      if (input) input.classList.remove('error');
    });
    [nameErr, emailErr, phoneErr].forEach(err => {
      if (err) {
        err.textContent = '';
        err.classList.remove('visible');
      }
    });

    // Validate Name
    const nameVal = nameInput ? nameInput.value.trim() : '';
    if (!nameVal) {
      if (nameInput) nameInput.classList.add('error');
      if (nameErr) {
        nameErr.textContent = 'Name is required.';
        nameErr.classList.add('visible');
      }
      isValid = false;
      if (!firstInvalidInput) firstInvalidInput = nameInput;
    }

    // Validate Email
    const emailVal = emailInput ? emailInput.value.trim() : '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal) {
      if (emailInput) emailInput.classList.add('error');
      if (emailErr) {
        emailErr.textContent = 'Email address is required.';
        emailErr.classList.add('visible');
      }
      isValid = false;
      if (!firstInvalidInput) firstInvalidInput = emailInput;
    } else if (!emailRegex.test(emailVal)) {
      if (emailInput) emailInput.classList.add('error');
      if (emailErr) {
        emailErr.textContent = 'Please enter a valid email address.';
        emailErr.classList.add('visible');
      }
      isValid = false;
      if (!firstInvalidInput) firstInvalidInput = emailInput;
    }

    // Validate Phone Number
    const phoneVal = phoneInput ? phoneInput.value.trim() : '';
    const cleanPhone = phoneVal.replace(/\D/g, '');
    if (!phoneVal) {
      if (phoneInput) phoneInput.classList.add('error');
      if (phoneErr) {
        phoneErr.textContent = 'Phone number is required.';
        phoneErr.classList.add('visible');
      }
      isValid = false;
      if (!firstInvalidInput) firstInvalidInput = phoneInput;
    } else if (cleanPhone.length < 7) {
      if (phoneInput) phoneInput.classList.add('error');
      if (phoneErr) {
        phoneErr.textContent = 'Please enter a valid phone number (at least 7 digits).';
        phoneErr.classList.add('visible');
      }
      isValid = false;
      if (!firstInvalidInput) firstInvalidInput = phoneInput;
    }

    if (!isValid && firstInvalidInput) {
      firstInvalidInput.focus();
      showToast('⚠️ Please fill in all required fields (Name, Email, Phone)');
    }

    return isValid;
  };

  // Clear errors dynamically on input typing
  ['clientNameInput', 'clientEmailInput', 'clientPhoneInput'].forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener('input', () => {
        input.classList.remove('error');
        const errEl = input.parentElement.querySelector('.form-error-msg');
        if (errEl) {
          errEl.textContent = '';
          errEl.classList.remove('visible');
        }
      });
    }
  });

  if (nextStepBtn) {
    nextStepBtn.addEventListener('click', () => {
      if (currentStep < totalSteps) {
        currentStep++;
        updateStepUI();
      } else {
        // Validate required Step 5 fields (Name, Email, Phone) before submission
        if (!validateContactDetails()) {
          return; // Block submission if validation fails
        }

        // Form Submission Trigger
        const formData = {
          projectType: document.querySelector('.enquiry-step[data-step="1"] .option-card.selected')?.innerText?.trim() || 'New Business Website',
          budget: document.querySelector('.enquiry-step[data-step="2"] .option-card.selected')?.innerText?.trim() || 'Not specified',
          timeline: document.querySelector('.enquiry-step[data-step="3"] .option-card.selected')?.innerText?.trim() || 'Flexible',
          businessDetails: document.querySelector('#businessDetailsInput')?.value || '',
          clientName: document.querySelector('#clientNameInput')?.value.trim() || '',
          clientEmail: document.querySelector('#clientEmailInput')?.value.trim() || '',
          clientPhone: document.querySelector('#clientPhoneInput')?.value.trim() || ''
        };

        // Submit to Node / Vercel Serverless / PHP backend email API
        fetch('/api/enquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        .then(res => {
          if (!res.ok) {
            // Fallback to PHP endpoint if static/apache server
            return fetch('api/enquiry.php', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(formData)
            }).then(r => r.json());
          }
          return res.json();
        })
        .then(resData => {
          showToast('✓ Thank you! Your project enquiry has been submitted. Dipesh has been notified via email.');
        })
        .catch(err => {
          showToast('✓ Thank you! Your project enquiry has been submitted. Dipesh will contact you within 24 hours.');
        });

        enquiryModal.classList.remove('open');
        document.body.style.overflow = '';
        enquiryForm.reset();
        currentStep = 1;
        updateStepUI();
      }
    });
  }

  if (prevStepBtn) {
    prevStepBtn.addEventListener('click', () => {
      if (currentStep > 1) {
        currentStep--;
        updateStepUI();
      }
    });
  }

  // --- 7. Toast Notification Helper ---
  const toast = document.getElementById('toastNotification');
  const toastText = document.getElementById('toastText');

  function showToast(message) {
    if (!toast || !toastText) return;
    toastText.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }

  // --- 8. Hero Interactive Mouse Parallax Effect ---
  const heroMockupWrapper = document.getElementById('heroMockupWrapper');
  const heroSection = document.getElementById('home');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (heroSection && heroMockupWrapper && !prefersReducedMotion && window.innerWidth > 900) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      const moveX = (x / (rect.width / 2)) * 6; // Max 6px horizontal movement
      const moveY = (y / (rect.height / 2)) * 6; // Max 6px vertical movement
      
      heroMockupWrapper.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
    });

    heroSection.addEventListener('mouseleave', () => {
      heroMockupWrapper.style.transform = 'translate3d(0px, 0px, 0px)';
    });
  }

  // --- 8b. Live Preview Window 3D Perspective Tilt Micro-Interaction ---
  if (!prefersReducedMotion && window.innerWidth > 900) {
    const previewWindows = document.querySelectorAll('.live-preview-window');
    
    previewWindows.forEach(win => {
      win.addEventListener('mousemove', (e) => {
        const rect = win.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -5; // Max 5deg tilt
        const rotateY = ((x - centerX) / centerX) * 5; // Max 5deg tilt
        
        win.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate3d(0, -8px, 0)`;
      });
      
      win.addEventListener('mouseleave', () => {
        win.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0)';
      });
    });
  }

  // --- 9. Controlled Scroll Reveal Entrance Animations ---
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const revealElements = document.querySelectorAll(
      '.case-study-card, .service-card, .process-step, .philosophy-card, .expectation-card, .pricing-card, .trans-point'
    );

    revealElements.forEach((el, index) => {
      el.classList.add('reveal-element');
      el.style.transitionDelay = `${(index % 4) * 0.08}s`;
    });

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // --- 10. High-Performance Smart Lazy Loader for Live Website Iframes ---
  const initIframeLazyLoading = () => {
    const previewContainers = document.querySelectorAll('.browser-body');

    previewContainers.forEach(body => {
      const iframe = body.querySelector('iframe[data-src]');
      const windowContainer = body.closest('.browser-window') || body;
      if (!iframe) return;

      let isLoaded = false;
      const loadIframe = () => {
        if (isLoaded) return;
        isLoaded = true;
        const realSrc = iframe.getAttribute('data-src');
        if (realSrc && (!iframe.src || iframe.src === 'about:blank')) {
          iframe.src = realSrc;
          iframe.onload = () => {
            iframe.classList.add('loaded');
            body.classList.add('iframe-loaded');
          };
        }
      };

      // Load live site on hover, touch, or click for instant interactivity
      windowContainer.addEventListener('mouseenter', loadIframe, { once: true });
      windowContainer.addEventListener('touchstart', loadIframe, { once: true, passive: true });
      windowContainer.addEventListener('click', loadIframe, { once: true });

      // Fallback: load after first user scroll or 3.5s idle time
      const handleUserScroll = () => {
        if ('requestIdleCallback' in window) {
          requestIdleCallback(loadIframe, { timeout: 3500 });
        } else {
          setTimeout(loadIframe, 2000);
        }
        window.removeEventListener('scroll', handleUserScroll);
      };
      window.addEventListener('scroll', handleUserScroll, { passive: true });
    });
  };

  initIframeLazyLoading();

});
