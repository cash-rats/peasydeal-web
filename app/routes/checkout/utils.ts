// Validates phone input value and writes any validation message to the input element.
// Returns true when valid, false otherwise.
export const validatePhoneInput = (input: HTMLInputElement | null): boolean => {
  if (!input) return true;

  input.setCustomValidity('');

  const rawPhone = input.value;
  const phone = rawPhone.replace(/\s+/g, '');

  const phoneIsNum = /^\+?[0-9]+$/.test(phone);
  if (!phoneIsNum) {
    input.setCustomValidity('Phone must contain only numbers');
    input.reportValidity();
    return false;
  }

  if (phone.length <= 3) {
    input.setCustomValidity('The phone number seems too short.');
    input.reportValidity();
    return false;
  }

  return true;
};
