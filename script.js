/* ===== Clean JS: mobile nav + typing + active section + year ===== */

(function () {
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Mobile nav
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");

  function setExpanded(v) {
    if (!toggle) return;
    toggle.setAttribute("aria-expanded", String(v));
  }

  function openNav() {
    if (!nav || !toggle) return;
    nav.classList.add("is-open");
    toggle.setAttribute("aria-label", "Close menu");
    setExpanded(true);
  }

  function closeNav() {
    if (!nav || !toggle) return;
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-label", "Open menu");
    setExpanded(false);
  }

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.contains("is-open") ? closeNav() : openNav();
    });

    // Close on link click (mobile)
    nav.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => closeNav());
    });

    // Close if click outside
    document.addEventListener("click", (e) => {
      const t = e.target;
      if (!nav.classList.contains("is-open")) return;
      if (t === toggle || toggle.contains(t) || nav.contains(t)) return;
      closeNav();
    });

    // Close on ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeNav();
    });
  }

  // Typing effect
  const typingEl = document.getElementById("typing");
  const lines = [
    "Cybersecurity & Incident Response Engineer.",
    "SOC • SIEM • Threat Hunting • Detection Engineering.",
    "Security automation, labs, and practical investigations.",
  ];

  if (typingEl && !prefersReduced) {
    let line = 0,
      i = 0,
      deleting = false;

    const tick = () => {
      const current = lines[line];
      typingEl.textContent = deleting
        ? current.slice(0, i--)
        : current.slice(0, i++);

      if (!deleting && i > current.length + 6) deleting = true;
      if (deleting && i < 0) {
        deleting = false;
        line = (line + 1) % lines.length;
        i = 0;
      }

      const delay = deleting ? 22 : 40;
      setTimeout(tick, delay);
    };
    tick();
  } else if (typingEl) {
    typingEl.textContent = lines[0];
  }

  // Active section highlight
  const links = Array.from(document.querySelectorAll(".nav__link")).filter(
    (a) => a.getAttribute("href")?.startsWith("#"),
  );

  const sections = links
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  if (sections.length && links.length) {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;
        const id = "#" + visible.target.id;

        links.forEach((a) =>
          a.classList.toggle("is-active", a.getAttribute("href") === id),
        );
      },
      { root: null, threshold: [0.25, 0.5, 0.75] },
    );

    sections.forEach((s) => obs.observe(s));
  }

  // Scroll animations for sections
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    },
  );

  document.querySelectorAll(".section").forEach((section) => {
    sectionObserver.observe(section);
  });

  // Smooth scroll parallax effect for hero media
  if (!prefersReduced) {
    const heroMedia = document.querySelector(".hero__media");
    const avatarRing = document.querySelector(".avatar__ring");
    let ticking = false;

    function handleParallax() {
      const scrolled = window.pageYOffset;
      if (heroMedia && scrolled < window.innerHeight) {
        const parallaxValue = scrolled * 0.25;
        heroMedia.style.transform = `translateY(${parallaxValue}px)`;
        if (avatarRing) {
          avatarRing.style.transform = `rotate(${scrolled * 0.08}deg)`;
        }
      }
      ticking = false;
    }

    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          window.requestAnimationFrame(handleParallax);
          ticking = true;
        }
      },
      { passive: true },
    );
  }

  // Smooth topbar shadow on scroll
  let lastScroll = 0;
  const topbar = document.querySelector(".topbar");

  function handleTopbarScroll() {
    const currentScroll = window.pageYOffset;
    if (topbar) {
      if (currentScroll > 50) {
        topbar.classList.add("scrolled");
      } else {
        topbar.classList.remove("scrolled");
      }
    }
    lastScroll = currentScroll;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleTopbarScroll();
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true },
  );

  // Smooth reveal animations for cards and certs with better performance
  const cardObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0) scale(1)";
            entry.target.style.transition =
              "all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
          }, index * 30);
          cardObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.05,
      rootMargin: "0px 0px -50px 0px",
    },
  );

  document
    .querySelectorAll(".card, .cert, .profile, .contact__item")
    .forEach((el) => {
      cardObserver.observe(el);
    });

  // Optimize scroll performance with requestAnimationFrame
  let scrollTicking = false;

  function optimizedScroll() {
    scrollTicking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!scrollTicking) {
        window.requestAnimationFrame(optimizedScroll);
        scrollTicking = true;
      }
    },
    { passive: true },
  );

  // Smooth mouse move parallax effect for hero content
  if (!prefersReduced) {
    const heroContent = document.querySelector(".hero__content");
    const heroMedia = document.querySelector(".hero__media");
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    document.addEventListener("mousemove", (e) => {
      if (!heroContent || !heroMedia) return;

      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      mouseX = (clientX / innerWidth - 0.5) * 20;
      mouseY = (clientY / innerHeight - 0.5) * 20;
    });

    // Smooth interpolation for mouse parallax
    function smoothParallax() {
      currentX += (mouseX - currentX) * 0.1;
      currentY += (mouseY - currentY) * 0.1;

      if (heroContent) {
        heroContent.style.transform = `translate(${currentX * 0.3}px, ${currentY * 0.3}px)`;
      }
      if (heroMedia) {
        heroMedia.style.transform = `translate(${-currentX * 0.2}px, ${-currentY * 0.2}px)`;
      }

      requestAnimationFrame(smoothParallax);
    }
    smoothParallax();
  }
})();
