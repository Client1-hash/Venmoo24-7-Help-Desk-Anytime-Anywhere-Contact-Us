const formSteps = [
  {
    question: "What type of business do you own?",
    type: "flexbox",
    name: "businessType",
    options: [
      { label: "Sole Proprietor", icon: "fas fa-user" },
      { label: "Partnership", icon: "fas fa-handshake" },
      { label: "C Corporation", icon: "fas fa-building" },
      { label: "S Corporation", icon: "fas fa-industry" },
    ],
  },
  {
    question: "How much do you need?",
    type: "range",
    name: "amount",
    min: 10000,
    max: 100000,
    step: 10000,
  },
  {
    question: "What are you getting the financing for?",
    type: "dropdown",
    name: "category",
    options: ["Choose...", "Expansion", "Equipment Purchase", "Puchase a vehicle","Inventory","Payroll", "Marketing","Commercial real estate","Remodel my location"]
  },
  {
    question: "How quickly do you need the money?",
    type: "list",
    name: "urgency",
    options: [
      "Within a week",
      "Within 2 weeks",
      "Within a month",
      "Unsure, just browsing rates"
    ]
  },
  { question: "What's your average monthly revenue?", type: "number", name: "monthly_revenue" },
  {
    question: "What’s your estimated personal credit score?",
    type: "list",
    name: "urgency",
    options: [
      "Excellent (720+)",
      "Good (680-719)",
      "Fair (640-679)",
      "Poor (639 or less)"
    ]
  },
  { question: "Where is your business located?", type: "number", name: "zip" },
  { question: "What is the name of your business?", type: "text", name: "business_name" },
  { question: "What is your phone number?", type: "number", name: "phone" },

];

let currentStep = 0;
const userData = {};

const formStepContainer = document.getElementById("form-step");
const continueButton = document.getElementById("continue-btn");
const progressBar = document.getElementById("progress-bar");

function updateProgressBar() {
  const progress = (currentStep / formSteps.length) * 100;
  progressBar.style.width = `${progress}%`;
}

function renderStep() {
  if (currentStep < formSteps.length) {
    const step = formSteps[currentStep];

    // Show Continue button by default
    continueButton.style.display = "inline-block";

    if (step.type === "flexbox") {
      continueButton.style.display = "none"; // Hide for flexbox

      formStepContainer.innerHTML = `
        <h3>${step.question}</h3>
        <div class="option-container">
          ${step.options.map(option => `
            <div class="option-box" data-value="${option.label}">
              <i class="${option.icon} icon"></i> 
              <p>${option.label}</p>
            </div>
          `).join("")}
        </div>
      `;

      document.querySelectorAll(".option-box").forEach(box => {
        box.addEventListener("click", function () {
          document.querySelectorAll(".option-box").forEach(b => b.classList.remove("selected"));
          this.classList.add("selected");
          userData[step.name] = this.getAttribute("data-value");

          // Auto move to next step
          currentStep++;
          setTimeout(() => renderStep(), 300);
        });
      });
    }

    else if (step.type === "range") {
      formStepContainer.innerHTML = `
        <h3>${step.question}</h3>
        <p id="range-value">$<span>${step.min}</span></p>
        <input type="range" id="range-input" name="${step.name}" min="${step.min}" max="${step.max}" step="${step.step}" value="${step.min}">
        <div class="range-btw">
          <p>$10,000</p>
          <p>$1M</p>
        </div>
      `;

      const rangeInput = document.getElementById("range-input");
      const rangeValue = document.getElementById("range-value");

      rangeInput.addEventListener("input", () => {
        rangeValue.textContent = '$' + rangeInput.value;
      });
    }

    else if (step.type === "list") {
      continueButton.style.display = "none"; // Hide for list step

      formStepContainer.innerHTML = `
        <h3>${step.question}</h3>
        <ul class="list-options">
          ${step.options.map(option => `
            <li class="list-option" data-value="${option}">${option}</li>
          `).join("")}
        </ul>
      `;

      document.querySelectorAll(".list-option").forEach(item => {
        item.addEventListener("click", function () {
          document.querySelectorAll(".list-option").forEach(el => el.classList.remove("selected"));
          this.classList.add("selected");
          userData[step.name] = this.getAttribute("data-value");

          // Auto move to next step
          currentStep++;
          setTimeout(() => renderStep(), 300);
        });
      });
    }
    else if (step.type === "dropdown") {
      formStepContainer.innerHTML = `
        <h3>${step.question}</h3>
        <select id="dropdown-input">
          
          ${step.options.map(option => `
            <option value="${option}">${option}</option>
          `).join("")}
        </select>
      `;
    }
    else {
      formStepContainer.innerHTML = `
        <h3>${step.question}</h3>
        <input type="${step.type}" id="input-field" name="${step.name}" required>
      `;
    }

  } else {
    showSummary();
  }

  updateProgressBar();
}

function showSummary() {
  formStepContainer.innerHTML = "";
  continueButton.style.display = "none";
  progressBar.style.width = "100%";

  const popup = document.getElementById("popup-modal");
  popup.classList.remove("hidden");

  document.getElementById("close-popup").addEventListener("click", () => {
    popup.classList.add("hidden");
  });
}

continueButton.addEventListener("click", () => {
  const step = formSteps[currentStep];

  if (step.type === "flexbox" || step.type === "list") return; // Handled by click

  if (step.type === "range") {
    const rangeInput = document.getElementById("range-input");
    userData[step.name] = rangeInput.value;
  }else if (step.type === "dropdown") {
    const dropdown = document.getElementById("dropdown-input");
    if (dropdown.value === "") {
      alert("Please select an option.");
      return;
    }
    userData[step.name] = dropdown.value;
  } else {
    const inputField = document.getElementById("input-field");
    if (inputField.value.trim() === "") {
      alert("Please enter a response.");
      return;
    }
    userData[step.name] = inputField.value;
  }

  currentStep++;
  renderStep();
});

// Start the form
renderStep();
