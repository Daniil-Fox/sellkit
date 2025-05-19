import { validateForms } from "./../functions/validate-forms.js";

const modal = document.querySelector(".modal");
const modalThanks = modal.querySelector(".modal__thankyou");
const rules1 = [
  {
    ruleSelector: ".input-name",
    rules: [
      {
        rule: "minLength",
        value: 3,
        errorMessage: "Минимальная длина 3 символа",
      },
      {
        rule: "required",
        value: true,
        errorMessage: "Поле обязательно для заполнения",
      },
    ],
  },
  {
    ruleSelector: ".input-tel",
    tel: true,
    telError: "Введите корректный телефон",
    rules: [
      {
        rule: "required",
        value: true,
        errorMessage: "Поле обязательно для заполнения",
      },
    ],
  },
  {
    ruleSelector: ".input-project",
    rules: [
      {
        rule: "required",
        errorMessage: "Поле обязательно для заполнения",
      },
    ],
  },
  {
    ruleSelector: ".input-city",
    rules: [
      {
        rule: "required",
        errorMessage: "Поле обязательно для заполнения",
      },
    ],
  },
];
const rules2 = [
  {
    ruleSelector: ".input-name",
    rules: [
      {
        rule: "minLength",
        value: 3,
        errorMessage: "Минимальная длина 3 символа",
      },
      {
        rule: "required",
        value: true,
        errorMessage: "Поле обязательно для заполнения",
      },
    ],
  },
  {
    ruleSelector: ".input-tel",
    tel: true,
    telError: "Введите корректный телефон",
    rules: [
      {
        rule: "required",
        value: true,
        errorMessage: "Поле обязательно для заполнения",
      },
    ],
  },
  {
    ruleSelector: ".input-project",
    rules: [
      {
        rule: "required",
        errorMessage: "Поле обязательно для заполнения",
      },
    ],
  },
  {
    ruleSelector: ".input-city",
    rules: [
      {
        rule: "required",
        errorMessage: "Поле обязательно для заполнения",
      },
    ],
  },
];

const afterForm = () => {
  if (modal) {
    modal.classList.add("active");
    modal.classList.add("thankyou-active");
  }
};
const afterFormModal = () => {
  if (modal) {
    modal.classList.add("thankyou-active");
  }
};

if (document.querySelector(".cta__form")) {
  validateForms(".cta__form", rules1, [], afterForm);
}

if (document.querySelector(".modal__form")) {
  validateForms(".modal__form", rules2, [], afterFormModal);
}
