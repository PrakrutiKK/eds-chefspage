import { readBlockConfig } from '../../scripts/aem.js';

const DEFAULT_SUCCESS = 'Thank you! We\'ll be in touch soon.';
const ERROR_MESSAGE = 'Something went wrong. Please try again.';

const FIELDS = [
  {
    name: 'firstName',
    label: 'First name',
    type: 'text',
    autocomplete: 'given-name',
    maxLength: 50,
    messages: { valueMissing: 'Please enter your first name.' },
  },
  {
    name: 'lastName',
    label: 'Last name',
    type: 'text',
    autocomplete: 'family-name',
    maxLength: 50,
    messages: { valueMissing: 'Please enter your last name.' },
  },
  {
    name: 'mobile',
    label: 'Mobile number',
    type: 'tel',
    autocomplete: 'tel',
    pattern: '\\+?[0-9]{8,15}',
    placeholder: '+31612345678',
    messages: {
      valueMissing: 'Please enter your mobile number.',
      patternMismatch: 'Enter 8 to 15 digits, optionally starting with +.',
    },
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    autocomplete: 'email',
    pattern: '[^@\\s]+@[^@\\s]+\\.[^@\\s]+',
    placeholder: 'name@example.com',
    messages: {
      valueMissing: 'Please enter your email address.',
      typeMismatch: 'Please enter a valid email address.',
      patternMismatch: 'Please enter a valid email address.',
    },
  },
];

function createField(field, formId) {
  const id = `${formId}-${field.name}`;
  const wrapper = document.createElement('div');
  wrapper.className = 'reach-out-form-field';

  const label = document.createElement('label');
  label.htmlFor = id;
  label.textContent = field.label;
  const marker = document.createElement('span');
  marker.className = 'reach-out-form-required';
  marker.setAttribute('aria-hidden', 'true');
  marker.textContent = '*';
  label.append(marker);

  const input = document.createElement('input');
  input.id = id;
  input.name = field.name;
  input.type = field.type;
  input.required = true;
  input.autocomplete = field.autocomplete;
  if (field.maxLength) input.maxLength = field.maxLength;
  if (field.pattern) input.pattern = field.pattern;
  if (field.placeholder) input.placeholder = field.placeholder;

  const error = document.createElement('p');
  error.id = `${id}-error`;
  error.className = 'reach-out-form-error';
  error.setAttribute('aria-live', 'polite');
  input.setAttribute('aria-describedby', error.id);

  wrapper.append(label, input, error);
  return wrapper;
}

// spam trap: hidden from people and assistive tech, but bots tend to fill it in.
// "_gotcha" is the field name Formspree uses to silently drop spam.
function createHoneypot(formId) {
  const wrapper = document.createElement('div');
  wrapper.className = 'reach-out-form-hp';
  wrapper.setAttribute('aria-hidden', 'true');
  const label = document.createElement('label');
  label.htmlFor = `${formId}-gotcha`;
  label.textContent = 'Leave this field empty';
  const input = document.createElement('input');
  input.id = `${formId}-gotcha`;
  input.name = '_gotcha';
  input.type = 'text';
  input.tabIndex = -1;
  input.autocomplete = 'off';
  wrapper.append(label, input);
  return wrapper;
}

function getErrorMessage(input) {
  const field = FIELDS.find((f) => f.name === input.name);
  const { validity } = input;
  const key = ['valueMissing', 'typeMismatch', 'patternMismatch'].find((k) => validity[k]);
  return key ? field.messages[key] || field.messages.valueMissing : '';
}

function validateInput(input) {
  input.value = input.value.trim();
  const message = input.checkValidity() ? '' : getErrorMessage(input);
  input.setAttribute('aria-invalid', message ? 'true' : 'false');
  input.closest('.reach-out-form-field').classList.toggle('invalid', !!message);
  document.getElementById(input.getAttribute('aria-describedby')).textContent = message;
  return !message;
}

async function submitForm(form, endpoint) {
  const body = new URLSearchParams(new FormData(form));
  body.append('page', window.location.pathname);
  // form-encoded POST with an Accept header is a simple request, so no CORS preflight is needed.
  // Accept: application/json makes services like Formspree reply with JSON instead of a redirect.
  const resp = await fetch(endpoint, { method: 'POST', body, headers: { Accept: 'application/json' } });
  if (!resp.ok) throw new Error(`Submission failed: ${resp.status}`);
  const result = await resp.json().catch(() => ({}));
  if (result.result && result.result !== 'success') throw new Error(result.error || 'Submission rejected');
}

/**
 * loads and decorates the block
 * @param {Element} block The block element
 */
export default async function decorate(block) {
  const config = readBlockConfig(block);
  const endpoint = config.endpoint || '';
  // "success-message" from documents, "successmessage" from the Universal Editor model
  const successMessage = config['success-message'] || config.successmessage || DEFAULT_SUCCESS;
  const formId = `reach-out-form-${document.querySelectorAll('.reach-out-form form').length + 1}`;

  const form = document.createElement('form');
  form.noValidate = true;
  form.id = formId;
  form.append(...FIELDS.map((field) => createField(field, formId)), createHoneypot(formId));

  const status = document.createElement('p');
  status.className = 'reach-out-form-status';
  status.setAttribute('role', 'status');

  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.className = 'button primary';
  submit.textContent = 'Send';
  const actions = document.createElement('div');
  actions.className = 'reach-out-form-actions';
  actions.append(submit);
  form.append(status, actions);

  const inputs = [...form.querySelectorAll('.reach-out-form-field input')];
  const honeypot = form.querySelector('input[name="_gotcha"]');

  const showSuccess = () => {
    const success = document.createElement('p');
    success.className = 'reach-out-form-success';
    success.setAttribute('role', 'status');
    success.tabIndex = -1;
    success.textContent = successMessage;
    form.replaceWith(success);
    success.focus();
  };
  inputs.forEach((input) => {
    input.addEventListener('blur', () => { if (input.value) validateInput(input); });
    input.addEventListener('input', () => {
      if (input.getAttribute('aria-invalid') === 'true') validateInput(input);
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const invalid = inputs.filter((input) => !validateInput(input));
    if (invalid.length) {
      invalid[0].focus();
      return;
    }
    // bots get the normal thank-you, but nothing is sent
    if (honeypot.value) {
      showSuccess();
      return;
    }
    status.textContent = '';
    status.classList.remove('error');
    if (!endpoint) {
      status.textContent = ERROR_MESSAGE;
      status.classList.add('error');
      return;
    }
    submit.disabled = true;
    submit.textContent = 'Sending…';
    try {
      await submitForm(form, endpoint);
      showSuccess();
    } catch (err) {
      status.textContent = ERROR_MESSAGE;
      status.classList.add('error');
      submit.disabled = false;
      submit.textContent = 'Send';
    }
  });

  block.replaceChildren(form);
}
