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
  const workGrid = document.querySelector("#workGrid");

  if (workGrid) {
    const workProjects = [
      {
        title: "HRIS — HR & Payroll System",
        desc: "Our own HR platform, built to run company-wide. Payroll is fully automated, pulling directly from employee and attendance records, with dedicated payroll settings for automatic computation and bulk payroll draft generation.",
        tags: ["ERP", "Automation", "Custom software"],
        image: "assets/images/ui.jpg",
      },
      {
        title: "Sales — CRM & Lead Pipeline",
        desc: "Tracks every lead from first contact to close, with a staged pipeline (New, Follow-up, Qualified, Proposal, Won/Lost) that requires logged activity and proof of follow-up before a lead can advance. Quotations, invoices, and a full stage-change history are tied to each lead automatically.",
        tags: ["ERP", "CRM", "Sales pipeline"],
        image: "assets/images/ui3.jpg",
      },
      {
        title: "Accounting — Financial Dashboard",
        desc: "Company-wide financial visibility in one view — revenue, expenses, net income, and cash balance alongside AR/AP outstanding, overdue invoices, and pending approvals. Cash flow, invoice status, and monthly revenue are charted live from the general ledger.",
        tags: ["ERP", "Accounting", "Reporting"],
        image: "assets/images/ui4.jpg",
      },
      {
        title: "Filipino Inventors Society, Inc.",
        desc: "Site for the Philippines' oldest organization of patent-holding inventors, established 1943. Covers leadership profiles, the organization's history, an events section featuring National Inventors Week, and a contact form for membership inquiries.",
        tags: ["Web app", "Nonprofit site"],
        image: "assets/images/ui4.png",
        link: "https://zedtech79-png.github.io/fis-web/home.html",
      },
      {
        title: "AETECH Innovations Singapore",
        desc: "Corporate site for a Singapore-based technology and consulting firm working in smart cities, education, and digital transformation. Includes a video hero, an industry-partners section, and an events showcase for conferences and forums the company has been part of.",
        tags: ["Web app", "Corporate site"],
        image: "assets/images/ui5.png",
        link: "https://aetech-innovations-singapore-websit.vercel.app/",
      },
      {
        title: "Engr. Edwin Astorga — Portfolio",
        desc: "Personal portfolio for a sustainability consultant and engineer, covering areas of expertise in ESG consulting, smart cities, and green engineering, plus a running list of professional affiliations and leadership roles.",
        tags: ["Web app", "Portfolio site"],
        image: "assets/images/ui2.png",
        link: "https://engr-edwin-astorga.github.io/portfolio/index.html",
      },
    ];

    let order = workProjects.map((_, i) => i);

    const renderWork = () => {
      workGrid.innerHTML = "";

      const flagship = workProjects[order[0]];
      const flagshipEl = document.createElement("article");
      flagshipEl.className = "work__flagship";
      flagshipEl.innerHTML = `
        <div class="work__flagship-image">
          <img src="${flagship.image}" alt="${flagship.title} screenshot" />
        </div>
        <div class="work__flagship-body">
          <h3 class="work__flagship-title">${flagship.title}</h3>
          <p class="work__flagship-desc">${flagship.desc}</p>
          <div class="work__tags-row">
            <ul class="work__tags">
              ${flagship.tags.map((tag) => `<li>${tag}</li>`).join("")}
            </ul>
            <a class="work__visit" href="${flagship.link}" target="_blank" rel="noopener">
              Visit <i class="ti ti-external-link" aria-hidden="true" style="font-size:14px"></i>
            </a>
          </div>
        </div>
      `;
      workGrid.appendChild(flagshipEl);

      order.slice(1).forEach((projectIndex) => {
        const project = workProjects[projectIndex];
        const tile = document.createElement("button");
        tile.className = "work__tile";
        tile.setAttribute("aria-label", `View ${project.title}`);
        tile.innerHTML = `
          <div class="work__tile-image">
            <img src="${project.image}" alt="${project.title} thumbnail" />
          </div>
          <span class="work__tile-title">${project.title}</span>
        `;
        tile.addEventListener("click", () => {
          order = [projectIndex, ...order.filter((i) => i !== projectIndex)];
          renderWork();
        });
        workGrid.appendChild(tile);
      });
    };

    renderWork();
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
