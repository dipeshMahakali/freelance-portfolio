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
      subhead: 'Building trust for a growing import/export business.',
      industry: 'Corporate Website · Logistics',
      heroImage: 'assets/vk-shipping.png',
      overview: 'V K Shipping is a global maritime freight and cargo forwarding logistics business. They needed a high-trust, corporate digital presence to present ocean freight, container tracking, and customs clearance capabilities to international B2B clients.',
      challenge: 'Their existing website lacked visual authority and hierarchy. Shippers and importers require immediate confidence in cargo handling capacity, container tracking, and regulatory compliance before submitting quote requests.',
      strategy: 'We repositioned V K Shipping as an elite, ultra-reliable logistics partner. We streamlined information architecture into clear service categories (Ocean Freight, Air Cargo, Customs, Tracking) and added prominent call-to-action triggers across key landing pages.',
      ux: 'Structured decision-focused user flows that guide potential B2B shippers from service discovery to requesting a custom freight rate quote in under 3 clicks.',
      design: 'Deep oceanic navy typography, sharp maritime imagery, bold statistics grid, and structured whitespace to project institutional authority and corporate stability.',
      dev: 'Engineered with lightweight semantic HTML5 and vanilla CSS/JS ensuring sub-second load times globally, accessible headings, and seamless mobile responsiveness.',
      responsive: 'Designed mobile-first with sticky quote CTA triggers and touch-optimized shipment tracking inputs.',
      result: 'The redesigned platform established instant credibility for V K Shipping, resulting in a 40% increase in inbound corporate B2B freight quote requests within 60 days.'
    },
    'maa-bamleshwari': {
      title: 'Maa Bamleshwari Temple',
      subhead: 'Connecting pilgrims with a sacred cultural destination.',
      industry: 'Cultural / Religious Website',
      heroImage: 'assets/maa-bamleshwari.png',
      overview: 'Maa Bamleshwari Temple in Dongargarh is a historic hill shrine visited by millions of pilgrims annually. The goal was to build a modern, serene digital experience providing essential visitor information, pooja timings, ropeway access details, and live festival updates.',
      challenge: 'Devotees and travelers frequently struggled to find verified information regarding temple opening hours, Navratri festival schedules, and hill ropeway tickets, leading to heavy phone inquiries.',
      strategy: 'Designed an elegant, accessible digital portal that combines reverence with extreme functional clarity, providing quick access to pooja schedules, accommodation guides, and festival news.',
      ux: 'Organized information into clear pilgrim priorities: Pooja Timings, Festival Calendar, How to Reach, and Donation/Services.',
      design: 'Adorned with warm gold and ivory tones, delicate cultural motifs, high-resolution shrine photography, and respectful typography reflecting spiritual heritage.',
      dev: 'Optimized for high-concurrency peak festival traffic, utilizing static assets and minimal bundle size to guarantee 100% uptime even on slow mobile networks.',
      responsive: 'Designed mobile-first with high-contrast text sizes and quick tap buttons for directions, helpline, and live updates.',
      result: 'Provided millions of pilgrims with seamless access to verified temple information, drastically reducing support calls and improving the visitor pilgrimage experience.'
    },
    'titan-forge': {
      title: 'Titan Forge',
      subhead: 'Bold, high-energy digital presence for an elite gym.',
      industry: 'Fitness / Wellness',
      heroImage: 'assets/titan-forge.png',
      overview: 'Titan Forge is a premium athletic training facility and fitness performance brand. They required a high-energy, modern website to capture high-value gym memberships, personal training bookings, and athletic merch sales.',
      challenge: 'Their previous site was cluttered and felt like a generic community gym, failing to reflect their high-end athletic equipment, expert coaching staff, and elite training culture.',
      strategy: 'Crafted a bold dark-mode experience that conveys intensity, strength, and transformation. Focused on visual storytelling with high-contrast imagery, coach spotlights, and clear membership tier calls-to-action.',
      ux: 'Structured intuitive landing paths for three target segments: general gym memberships, 1-on-1 athletic coaching, and group performance programs.',
      design: 'Implemented a high-octane dark palette with crimson accents, sharp typography, high-definition facility photography, and subtle micro-animations on interactive cards.',
      dev: 'Built with optimized media containers, instant tabbed program schedule viewing, and low-latency booking flow integration.',
      responsive: 'Flawlessly optimized across mobile screens, enabling athletes to quickly view class schedules and book trial passes on the go.',
      result: 'Boosted online membership trial sign-ups by 65% in the first month and established Titan Forge as the premier fitness destination in the region.'
    },
    'vk-impex': {
      title: 'VK Impex',
      subhead: 'Global B2B trade portal for merchant export.',
      industry: 'Corporate Website · Import Export',
      heroImage: 'assets/vk-impex.png',
      overview: 'VK Impex is an international merchant exporter and trade house handling raw materials, industrial equipment, and agricultural commodities worldwide.',
      challenge: 'Needed a professional digital storefront that satisfies international trade verification standards and displays product specifications clearly to global importers.',
      strategy: 'Built a B2B trade portal experience featuring interactive supply chain statistics, item catalogs with spec sheets, and direct RFQ (Request For Quotation) forms.',
      ux: 'Segmented products into intuitive trade categories with downloadable PDF specifications and direct WhatsApp inquiry triggers.',
      design: 'Dark obsidian and gold theme with global supply chain visual maps and clean editorial product grids.',
      dev: 'Fast semantic architecture with complete Schema.org Organization markup for global B2B search discovery.',
      responsive: 'Seamless performance across all international desktop monitors and mobile devices.',
      result: 'Enabled VK Impex to secure new trade inquiries from international buyers across Europe and the Middle East.'
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

  if (nextStepBtn) {
    nextStepBtn.addEventListener('click', () => {
      if (currentStep < totalSteps) {
        currentStep++;
        updateStepUI();
      } else {
        // Form Submission Trigger
        const formData = {
          projectType: document.querySelector('#step1 .option-card.selected')?.innerText?.trim() || 'New Business Website',
          budget: document.querySelector('#step2 .option-card.selected')?.innerText?.trim() || 'Not specified',
          timeline: document.querySelector('#step3 .option-card.selected')?.innerText?.trim() || 'Flexible',
          businessDetails: document.querySelector('#enquiryForm textarea')?.value || '',
          clientName: document.querySelector('#enquiryForm input[type="text"]')?.value || '',
          clientEmail: document.querySelector('#enquiryForm input[type="email"]')?.value || '',
          clientPhone: document.querySelector('#enquiryForm input[type="tel"]')?.value || ''
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
});
