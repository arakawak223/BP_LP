/**
 * ベスト・パートナーズ LP JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modules
  initHeader();
  initHamburgerMenu();
  initSmoothScroll();
  initFAQ();
  initFormValidation();
  initScrollAnimations();
  initChartAnimations();
});

/**
 * Header scroll effect
 */
function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  let lastScrollY = window.scrollY;
  let ticking = false;

  function updateHeader() {
    const scrollY = window.scrollY;

    if (scrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScrollY = scrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    }
  });
}

/**
 * Hamburger menu toggle
 */
function initHamburgerMenu() {
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');

  if (!hamburger || !nav) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    nav.classList.toggle('active');
    document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
  });

  // Close menu when clicking on nav links
  const navLinks = nav.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      nav.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const headerHeight = document.getElementById('header')?.offsetHeight || 0;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });
}

/**
 * FAQ accordion
 */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current item
      item.classList.toggle('active');
      question.setAttribute('aria-expanded', !isActive);
    });
  });
}

/**
 * Form validation and submission
 */
function initFormValidation() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Simple validation
    const errors = [];

    if (!data.company?.trim()) {
      errors.push('会社名を入力してください');
    }

    if (!data.name?.trim()) {
      errors.push('お名前を入力してください');
    }

    if (!data.email?.trim()) {
      errors.push('メールアドレスを入力してください');
    } else if (!isValidEmail(data.email)) {
      errors.push('正しいメールアドレスを入力してください');
    }

    if (!data.tel?.trim()) {
      errors.push('電話番号を入力してください');
    }

    if (!data.privacy) {
      errors.push('プライバシーポリシーに同意してください');
    }

    if (errors.length > 0) {
      alert(errors.join('\n'));
      return;
    }

    // Build email body
    const subject = encodeURIComponent('【人材紹介LP】お問い合わせ');
    const body = encodeURIComponent(
      `以下の内容でお問い合わせがありました。\n\n` +
      `■ 会社名\n${data.company}\n\n` +
      `■ 部署名\n${data.department || '（未入力）'}\n\n` +
      `■ お名前\n${data.name}\n\n` +
      `■ 役職\n${data.position || '（未入力）'}\n\n` +
      `■ メールアドレス\n${data.email}\n\n` +
      `■ 電話番号\n${data.tel}\n\n` +
      `■ ご相談内容\n${data.message || '（未入力）'}\n`
    );

    // Open mail client with pre-filled content
    window.location.href = `mailto:info@best-partners.co.jp?subject=${subject}&body=${body}`;

    // Show confirmation
    alert('メールソフトが起動します。\n内容をご確認の上、送信してください。');
  });
}

/**
 * Email validation helper
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Scroll animations using Intersection Observer
 */
function initScrollAnimations() {
  const animateElements = document.querySelectorAll(
    '.problem-card, .reason-card, .result-card, .flow-item, .consultant-card, .faq-item'
  );

  if (!animateElements.length) return;

  // Add initial state
  animateElements.forEach(el => {
    el.classList.add('animate-on-scroll');
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
  );

  animateElements.forEach(el => observer.observe(el));
}

/**
 * Chart animations
 */
function initChartAnimations() {
  const chartBars = document.querySelectorAll('.chart-bar-fill');

  if (!chartBars.length) return;

  // Store original widths and reset to 0
  chartBars.forEach(bar => {
    bar.dataset.width = bar.style.width;
    bar.style.width = '0%';
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          setTimeout(() => {
            bar.style.width = bar.dataset.width;
          }, 200);
          observer.unobserve(bar);
        }
      });
    },
    {
      threshold: 0.5
    }
  );

  chartBars.forEach(bar => observer.observe(bar));

  // Animate stat numbers
  const statNumbers = document.querySelectorAll('.stat-number, .result-number .number');

  statNumbers.forEach(el => {
    const finalValue = parseInt(el.textContent, 10);
    if (isNaN(finalValue)) return;

    el.dataset.value = finalValue;
    el.textContent = '0';
  });

  const numberObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateNumber(entry.target);
          numberObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.5
    }
  );

  statNumbers.forEach(el => {
    if (el.dataset.value) {
      numberObserver.observe(el);
    }
  });
}

/**
 * Animate number counting up
 */
function animateNumber(element) {
  const finalValue = parseInt(element.dataset.value, 10);
  const duration = 1500;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function (ease-out)
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const currentValue = Math.floor(easeOut * finalValue);

    element.textContent = currentValue.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = finalValue.toLocaleString();
    }
  }

  requestAnimationFrame(update);
}

/**
 * Utility: Debounce function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Utility: Throttle function
 */
function throttle(func, limit) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
