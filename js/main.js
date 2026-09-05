// Integritech Solutions Inc. — main.js

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav__toggle");
  const linksWrap = document.querySelector(".nav__links-wrap");

  if (toggle && linksWrap) {
    toggle.addEventListener("click", () => {
      const isOpen = linksWrap.classList.toggle("nav__links-wrap--open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  // Services: clickable accordion list + prev/next arrows, kept in sync.
  // Exactly one dropdown is open at a time; service 1 is open by default
  // on every load (no saved state), so the list height stays predictable.
  const serviceTabs = document.querySelectorAll(".services__tab");
  const serviceDropdowns = document.querySelectorAll(".services__dropdown");
  const servicePanels = document.querySelectorAll(".services__panel-item");
  const servicePrev = document.querySelector(".services__nav-btn--prev");
  const serviceNext = document.querySelector(".services__nav-btn--next");

  if (serviceTabs.length && servicePanels.length) {
    let currentIndex = 0;

    const setActiveService = (index) => {
      currentIndex = (index + serviceTabs.length) % serviceTabs.length;

      serviceTabs.forEach((tab, i) => {
        const isActive = i === currentIndex;
        tab.classList.toggle("is-active", isActive);
        tab.setAttribute("aria-expanded", String(isActive));
      });

      serviceDropdowns.forEach((dropdown, i) => {
        dropdown.classList.toggle("is-open", i === currentIndex);
      });

      servicePanels.forEach((panel, i) => {
        panel.classList.toggle("is-active", i === currentIndex);
      });
    };

    serviceTabs.forEach((tab, i) => {
      tab.addEventListener("click", () => setActiveService(i));
    });

    if (servicePrev) {
      servicePrev.addEventListener("click", () =>
        setActiveService(currentIndex - 1),
      );
    }
    if (serviceNext) {
      serviceNext.addEventListener("click", () =>
        setActiveService(currentIndex + 1),
      );
    }
  }

  // Work: bento grid with a swappable flagship project. Clicking a
  // tile promotes that project into the large flagship slot — same
  // "one active, rest are triggers" idea as the services accordion,
  // just spatial instead of expand/collapse.
  // Work: alternating timeline. Each project is a full-width row —
  // image on one side, title/description/features/tags on the other —
  // flipping sides every other project.
  const workGrid = document.querySelector("#workGrid");

  if (workGrid) {
    const workProjects = [
      {
        title: "HRIS — HR & Payroll System",
        desc: "Our own HR platform, built to run company-wide. Payroll is fully automated, pulling directly from employee and attendance records, with dedicated payroll settings for automatic computation and bulk payroll draft generation.",
        features: [
          "Automated payroll computation tied to attendance",
          "Bulk payroll draft generation",
          "Employee, attendance, and payroll fully integrated",
        ],
        tags: ["ERP", "Automation", "Custom software"],
        image: "assets/images/ui.jpg",
      },
      {
        title: "Sales — CRM & Lead Pipeline",
        desc: "Tracks every lead from first contact to close, with a staged pipeline (New, Follow-up, Qualified, Proposal, Won/Lost) that requires logged activity and proof of follow-up before a lead can advance.",
        features: [
          "Staged pipeline: New → Follow-up → Qualified → Proposal → Won/Lost",
          "Requires logged activity + proof of follow-up to advance a lead",
          "Quotations, invoices, and stage-change history tied to each lead",
        ],
        tags: ["ERP", "CRM", "Sales pipeline"],
        image: "assets/images/ui3.jpg",
      },
      {
        title: "Accounting — Financial Dashboard",
        desc: "Company-wide financial visibility in one view — revenue, expenses, net income, and cash balance alongside AR/AP outstanding, overdue invoices, and pending approvals.",
        features: [
          "Live revenue, expenses, net income, and cash balance",
          "AR/AP outstanding, overdue invoices, pending approvals",
          "Cash flow, invoice status, and monthly revenue charted from the ledger",
        ],
        tags: ["ERP", "Accounting", "Reporting"],
        image: "assets/images/ui4.jpg",
      },
      {
        title: "Filipino Inventors Society, Inc.",
        desc: "Site for the Philippines' oldest organization of patent-holding inventors, established 1943.",
        features: [
          "Leadership profiles and organizational history",
          "Events section featuring National Inventors Week",
          "Contact form for membership inquiries",
        ],
        tags: ["Web app", "Nonprofit site"],
        image: "assets/images/ui4.png",
        link: "https://zedtech79-png.github.io/fis-web/home.html",
      },
      {
        title: "AETECH Innovations Singapore",
        desc: "Corporate site for a Singapore-based technology and consulting firm working in smart cities, education, and digital transformation.",
        features: [
          "Video hero and corporate storytelling",
          "Industry-partners section",
          "Events showcase for conferences and forums",
        ],
        tags: ["Web app", "Corporate site"],
        image: "assets/images/ui5.png",
        link: "https://aetech-innovations-singapore-websit.vercel.app/",
      },
      {
        title: "Engr. Edwin Astorga — Portfolio",
        desc: "Personal portfolio for a sustainability consultant and engineer.",
        features: [
          "Areas of expertise: ESG consulting, smart cities, green engineering",
          "Running list of professional affiliations",
          "Leadership roles and career highlights",
        ],
        tags: ["Web app", "Portfolio site"],
        image: "assets/images/ui2.png",
        link: "https://engr-edwin-astorga.github.io/portfolio/index.html",
      },
    ];

    workGrid.innerHTML = workProjects
      .map((project, i) => {
        const reverseClass = i % 2 === 1 ? " work__row--reverse" : "";
        const visitLink = project.link
          ? `<a class="work__visit" href="${project.link}" target="_blank" rel="noopener">
               Visit <i class="ti ti-external-link" aria-hidden="true" style="font-size:14px"></i>
             </a>`
          : "";

        return `
          <article class="work__row${reverseClass}">
            <span class="work__row-marker" aria-hidden="true"></span>
            <div class="work__row-image">
              <img src="${project.image}" alt="${project.title} screenshot" />
            </div>
            <div class="work__row-body">
              <h3 class="work__row-title">${project.title}</h3>
              <p class="work__row-desc">${project.desc}</p>
              <ul class="work__row-features">
                ${project.features.map((f) => `<li>${f}</li>`).join("")}
              </ul>
              <div class="work__tags-row">
                <ul class="work__tags">
                  ${project.tags.map((tag) => `<li>${tag}</li>`).join("")}
                </ul>
                ${visitLink}
              </div>
            </div>
          </article>
        `;
      })
      .join("");

    // Reveal each row (and its image) as it scrolls into view.
    const workRows = workGrid.querySelectorAll(".work__row");
    if ("IntersectionObserver" in window && workRows.length) {
      const rowObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-inview");
              rowObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.3 },
      );
      workRows.forEach((row) => rowObserver.observe(row));
    } else {
      workRows.forEach((row) => row.classList.add("is-inview"));
    }

    // Timeline progress line fills as the section scrolls through view.
    const timelineEl = document.querySelector(".work__timeline");
    const progressEl = document.querySelector("#workTimelineProgress");

    if (timelineEl && progressEl) {
      const updateProgress = () => {
        const rect = timelineEl.getBoundingClientRect();
        const viewportCenter = window.innerHeight / 2;
        const passed = viewportCenter - rect.top;
        const percent = Math.min(
          100,
          Math.max(0, (passed / rect.height) * 100),
        );
        progressEl.style.height = `${percent}%`;
      };

      updateProgress();
      window.addEventListener("scroll", updateProgress, { passive: true });
      window.addEventListener("resize", updateProgress);

      // Click-to-preview: any project image opens it full-size in a lightbox.
      const lightbox = document.querySelector("#imageLightbox");
      const lightboxImg = document.querySelector("#imageLightboxImg");

      if (lightbox && lightboxImg) {
        const openLightbox = (src, alt) => {
          lightboxImg.src = src;
          lightboxImg.alt = alt;
          lightbox.classList.add("is-open");
          lightbox.setAttribute("aria-hidden", "false");
        };

        const closeLightbox = () => {
          lightbox.classList.remove("is-open");
          lightbox.setAttribute("aria-hidden", "true");
          lightboxImg.src = "";
        };

        workGrid.querySelectorAll(".work__row-image img").forEach((img) => {
          img.addEventListener("click", () => openLightbox(img.src, img.alt));
        });

        lightbox.querySelectorAll("[data-close]").forEach((el) => {
          el.addEventListener("click", closeLightbox);
        });

        document.addEventListener("keydown", (e) => {
          if (e.key === "Escape" && lightbox.classList.contains("is-open")) {
            closeLightbox();
          }
        });
      }
    }
  }
  // Contact modal: opened from nav, header CTA, hero CTA, and footer
  // button (anything with .js-contact-trigger). Submits via EmailJS so
  // the whole flow — including success/error — stays inside the modal.
  const contactModal = document.querySelector("#contactModal");
  const contactForm = document.querySelector("#contactForm");
  const contactStatus = document.querySelector("#contactFormStatus");
  const contactTriggers = document.querySelectorAll(".js-contact-trigger");

  if (contactModal && contactForm) {
    const openModal = (e) => {
      e.preventDefault();
      contactModal.classList.add("is-open");
      contactModal.setAttribute("aria-hidden", "false");
      contactForm.querySelector("input[name='from_name']").focus();
    };

    const closeModal = () => {
      contactModal.classList.remove("is-open");
      contactModal.setAttribute("aria-hidden", "true");
    };

    contactTriggers.forEach((trigger) => {
      trigger.addEventListener("click", openModal);
    });

    contactModal.querySelectorAll("[data-close]").forEach((el) => {
      el.addEventListener("click", closeModal);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && contactModal.classList.contains("is-open")) {
        closeModal();
      }
    });

    // Replace these three with your actual EmailJS values.
    const EMAILJS_PUBLIC_KEY = "4Q5hwHzdQjtlNOJ-G";
    const EMAILJS_SERVICE_ID = "service_zeskm3r";
    const EMAILJS_TEMPLATE_ID = "template_c44s9ux";

    if (window.emailjs) {
      emailjs.init(EMAILJS_PUBLIC_KEY);
    }

    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const nameField = contactForm.querySelector("[name='from_name']");
      const emailField = contactForm.querySelector("[name='from_email']");
      const messageField = contactForm.querySelector("[name='message']");
      const submitBtn = contactForm.querySelector(".contact-form__submit");

      if (
        !nameField.value.trim() ||
        !emailField.value.trim() ||
        !messageField.value.trim()
      ) {
        contactStatus.textContent = "Please fill in every field.";
        contactStatus.dataset.state = "error";
        return;
      }

      contactStatus.textContent = "Sending...";
      contactStatus.dataset.state = "";
      submitBtn.disabled = true;

      emailjs
        .send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
          from_name: nameField.value.trim(),
          from_email: emailField.value.trim(),
          message: messageField.value.trim(),
        })
        .then(() => {
          contactStatus.textContent =
            "Message sent — we'll get back to you soon.";
          contactStatus.dataset.state = "success";
          contactForm.reset();
          submitBtn.disabled = false;
        })
        .catch(() => {
          contactStatus.textContent =
            "Something went wrong. Please try again or email us directly.";
          contactStatus.dataset.state = "error";
          submitBtn.disabled = false;
        });
    });
  }
});
