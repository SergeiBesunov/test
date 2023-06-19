const BODY = document.querySelector('body');

const BURGER_MENU = document.querySelector('#burger');
const BURGER_CLOSE = document.querySelector('#burger-close');

const MODAL_FORM = document.querySelector('#form');
const MODAL_CONTENT = MODAL_FORM.querySelector('.modal__content');
const FORM_CLOSE = MODAL_FORM.querySelector('.modal__close');

const MODAL_THANKYOU = document.querySelector('#thankyou');
const MODAL_CONTENT_THANKYOU = MODAL_THANKYOU.querySelector('.modal__content');
const THANKYOU_CLOSE = MODAL_THANKYOU.querySelector('.modal__close');
const THANKYOU_BTN_CLOSE = MODAL_THANKYOU.querySelector('.thankyou__btn');

const COOKIES = document.querySelector('#cookies');

function displayThankYou() {
   MODAL_THANKYOU.classList.add('modal--active');
   MODAL_CONTENT_THANKYOU.classList.add('modal--active');
   MODAL_THANKYOU.addEventListener('click', handleClickCloseModal);
   BODY.style.overflow = 'hidden';
}
function displayСookies() {
   setTimeout(() => {
      COOKIES.classList.add('cookies--active');
   }, 1500);
   COOKIES.addEventListener('click', handleClickCloseCookies);
}

function closeModalForm() {
   MODAL_FORM.classList.remove('modal--active');
   MODAL_CONTENT.classList.remove('modal--active');
   MODAL_FORM.removeEventListener('click', handleClickCloseModal);
   BODY.style.overflow = 'visible';
}
function closeModalThankYou() {
   MODAL_THANKYOU.classList.remove('modal--active');
   MODAL_CONTENT_THANKYOU.classList.remove('modal--active');
   MODAL_THANKYOU.removeEventListener('click', handleClickCloseModal);
   BODY.style.overflow = 'visible';
}
function closeCookies() {
   COOKIES.classList.remove('cookies--active');
   COOKIES.removeEventListener('click', handleClickCloseCookies);
}

function handleClickCloseCookies({ target }) {
   if (target.hasAttribute('data-close-cookies')) {
      closeCookies();
   }
}
function handleClickcloseBurger() {
   if (BURGER_MENU.classList.contains('burger--active')) {
      BURGER_MENU.classList.remove('burger--active');
      BURGER_CLOSE.removeEventListener('click', handleClickcloseBurger);
      BODY.style.overflow = 'visible';
   }
}
function handleClickCloseModal({ target }) {
   if (target === MODAL_FORM || target === FORM_CLOSE) {
      closeModalForm();
   } else if (
      target === MODAL_THANKYOU ||
      target === THANKYOU_CLOSE ||
      target === THANKYOU_BTN_CLOSE
   ) {
      closeModalThankYou();
   }
}

document.addEventListener('DOMContentLoaded', displayСookies);



// -- Контроллер -- 
document.addEventListener('click', ({ target }) => {
   if (target.classList.contains('burger-menu')) {
      BURGER_MENU.classList.add('burger--active');
      BURGER_CLOSE.addEventListener('click', handleClickcloseBurger);
      BODY.style.overflow = 'hidden';
   }

   if (target.hasAttribute('data-open-modal')) {
      MODAL_FORM.classList.add('modal--active');
      MODAL_CONTENT.classList.add('modal--active');
      MODAL_FORM.addEventListener('click', handleClickCloseModal);
      BODY.style.overflow = 'hidden';
   }
});



// -- Валидация формы --
const FORM_CONTACTS = document.querySelector('.form');
const FORM_BTN = FORM_CONTACTS.querySelector('.form__btn');
const requiredTextFields = FORM_CONTACTS.querySelectorAll('.required-textield');
const FORM_ERROR = FORM_CONTACTS.querySelector('#form-error-text');

function validateTextields() {
   let check = true;

   requiredTextFields.forEach((elem) => {
      let input = elem.querySelector('.form__item-input');
      let errorElement = elem.querySelector('.form__item-error');

      if (input.value.trim() === '') {
         check = false;
         input.classList.add('form__item-input--error');
         errorElement.textContent = 'This field is required.';
      } else {
         input.classList.remove('form__item-input--error');
         errorElement.textContent = '';
      }
   });

   return check;
}

FORM_CONTACTS.addEventListener('submit', (e) => {
   e.preventDefault();

   if (validateTextields()) {
      closeModalForm();
      setTimeout(displayThankYou, 200);
      FORM_ERROR.textContent = '';
   } else {
      FORM_ERROR.textContent = 'Please fill in all required fields';
   }
});

requiredTextFields.forEach((elem) => {
   let input = elem.querySelector('.form__item-input');
   input.addEventListener('input', checkedRequiredTextFields);
});

function checkedRequiredTextFields() {
   let values = '';
   requiredTextFields.forEach((elem) => {
      let input = elem.querySelector('.form__item-input');
      if (input.value !== '') {
        console.log(input.value)
         values += input.value;
      }
   });
   if (values.trim() === '' && !FORM_BTN.classList.contains('form__btn--disabled')) {
      FORM_BTN.classList.add('form__btn--disabled');
   } else if (values.trim() !== '' && FORM_BTN.classList.contains('form__btn--disabled')) {
      FORM_BTN.classList.remove('form__btn--disabled');
   }
}



// -- Маска телефона --
const inputTel = document.querySelector('[data-tel-input]');
let getInputNumbersValue = (input) => {
   return input.value.replace(/\D/g, '');
};

let onPhoneInput = function (e) {
   let input = e.target;
   let inputNumbersValue = getInputNumbersValue(input);
   let formattedInputValue = '';
   let selectionStart = input.selectionStart;

   if (!inputNumbersValue) {
      return (input.value = '');
   }

   if (input.value.length != selectionStart) {
      if (e.data && /\D/g.test(e.data)) {
         input.value = inputNumbersValue;
      }
      return;
   }

   if (inputNumbersValue[0] !== '7') inputNumbersValue = '7' + inputNumbersValue;

   let firstSymbol = '+7';
   formattedInputValue = firstSymbol + '';

   if (inputNumbersValue.length > 1) {
      formattedInputValue += '(' + inputNumbersValue.substring(1, 4);
   }
   if (inputNumbersValue.length >= 5) {
      formattedInputValue += ') ' + inputNumbersValue.substring(4, 7);
   }
   if (inputNumbersValue.length >= 8) {
      formattedInputValue += '-' + inputNumbersValue.substring(7, 9);
   }
   if (inputNumbersValue.length >= 10) {
      formattedInputValue += '-' + inputNumbersValue.substring(9, 11);
   }
   input.value = formattedInputValue;
};

let onPhoneKeyDown = function (e) {
   let input = e.target;
   if (e.keyCode == 8 && getInputNumbersValue(input).length == 1) {
      input.value = '';
   }
};

inputTel.addEventListener('input', onPhoneInput);
inputTel.addEventListener('keydown', onPhoneKeyDown);
