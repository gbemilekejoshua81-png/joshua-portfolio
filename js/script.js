/* ========================================
   Main script – theme, planner, form
   ======================================== */

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initMobileMenu();
  initPlanner();
  initContactForm();
});

/* ---------- Theme Toggle ---------- */
function initTheme() {
  const btn = document.getElementById("theme-toggle");
  const saved = localStorage.getItem("theme") || "light";
  setTheme(saved);

  if (btn) {
    btn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") || "light";
      const next = current === "light" ? "dark" : "light";
      setTheme(next);
      localStorage.setItem("theme", next);
    });
  }
}

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const btn = document.getElementById("theme-toggle");
  if (btn) {
    btn.textContent = theme === "light" ? "◐" : "◑";
    btn.setAttribute("aria-label", theme === "light" ? "Switch to dark mode" : "Switch to light mode");
  }
}

/* ---------- Mobile Menu ---------- */
function initMobileMenu() {
  const toggle = document.getElementById("menu-toggle");
  const links = document.getElementById("nav-links");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    links.classList.toggle("open");
  });

  // Close menu when a link is clicked
  links.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => links.classList.remove("open"));
  });
}

/* ---------- Academic Planner ---------- */
function initPlanner() {
  const form = document.getElementById("planner-form");
  const input = document.getElementById("task-input");
  const list = document.getElementById("task-list");
  const empty = document.getElementById("empty-state");

  if (!form || !input || !list) return;

  let tasks = JSON.parse(localStorage.getItem("joshua-tasks") || "[]");

  function save() {
    localStorage.setItem("joshua-tasks", JSON.stringify(tasks));
  }

  function render() {
    list.innerHTML = "";
    if (tasks.length === 0) {
      if (empty) empty.style.display = "block";
      return;
    }
    if (empty) empty.style.display = "none";

    tasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.className = "task-item" + (task.done ? " completed" : "");

      const check = document.createElement("input");
      check.type = "checkbox";
      check.className = "task-check";
      check.checked = task.done;
      check.addEventListener("change", () => {
        tasks[index].done = check.checked;
        save();
        render();
      });

      const span = document.createElement("span");
      span.className = "task-text";
      span.textContent = task.text;

      const del = document.createElement("button");
      del.className = "task-delete";
      del.innerHTML = "×";
      del.setAttribute("aria-label", "Delete task");
      del.addEventListener("click", () => {
        tasks.splice(index, 1);
        save();
        render();
      });

      li.appendChild(check);
      li.appendChild(span);
      li.appendChild(del);
      list.appendChild(li);
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    tasks.unshift({ text, done: false });
    save();
    input.value = "";
    render();
  });

  render();
}

/* ---------- Contact Form Validation ---------- */
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const messageInput = document.getElementById("message");
  const successBox = document.getElementById("form-success");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;

    // Reset errors
    [nameInput, emailInput, phoneInput, messageInput].forEach(el => {
      el.parentElement.classList.remove("error");
    });

    // Name
    if (!nameInput.value.trim()) {
      showError(nameInput, "Please enter your name");
      valid = false;
    }

    // Email
    const emailVal = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal) {
      showError(emailInput, "Please enter your email");
      valid = false;
    } else if (!emailRegex.test(emailVal)) {
      showError(emailInput, "Please enter a valid email address");
      valid = false;
    }

    // Phone – digits only
    const phoneVal = phoneInput.value.trim();
    if (!phoneVal) {
      showError(phoneInput, "Please enter your phone number");
      valid = false;
    } else if (!/^\d+$/.test(phoneVal)) {
      showError(phoneInput, "Phone number should contain only digits");
      valid = false;
    }

    // Message
    if (!messageInput.value.trim()) {
      showError(messageInput, "Please write a message");
      valid = false;
    }

    if (valid) {
      if (successBox) {
        successBox.style.display = "block";
        successBox.textContent = "Thank you. Your message has been received.";
      }
      form.reset();
      // Hide success after a few seconds
      setTimeout(() => {
        if (successBox) successBox.style.display = "none";
      }, 4000);
    }
  });

  function showError(input, msg) {
    const group = input.parentElement;
    group.classList.add("error");
    const err = group.querySelector(".error-msg");
    if (err) err.textContent = msg;
  }
}
