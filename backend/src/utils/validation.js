const PASSWORD_REGEX =
  /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateUser = (data, isCreate = true) => {
  const errors = [];
  if (data.name !== undefined) {
    if (data.name.length < 20)
      errors.push("Name must be at least 20 characters");
    if (data.name.length > 60)
      errors.push("Name must be at most 60 characters");
  }
  if (data.email !== undefined && !EMAIL_REGEX.test(String(data.email).trim()))
    errors.push("Email must be a valid email address");
  if (data.address !== undefined && data.address.length > 400)
    errors.push("Address must be at most 400 characters");
  if (
    isCreate &&
    data.password !== undefined &&
    !PASSWORD_REGEX.test(data.password)
  )
    errors.push(
      "Password must be 8-16 characters with at least one uppercase letter and one special character",
    );
  return errors;
};

const validateStore = (data) => {
  const errors = [];
  if (data.name !== undefined) {
    if (data.name.length < 20)
      errors.push("Store name must be at least 20 characters");
    if (data.name.length > 60)
      errors.push("Store name must be at most 60 characters");
  }
  if (data.email !== undefined && !EMAIL_REGEX.test(String(data.email).trim()))
    errors.push("Email must be a valid email address");
  if (data.address !== undefined && data.address.length > 400)
    errors.push("Address must be at most 400 characters");
  return errors;
};

const validateRating = (rating) => {
  const n = Number(rating);
  if (!Number.isInteger(n) || n < 1 || n > 5)
    return ["Rating must be an integer from 1 to 5"];
  return [];
};

const validatePassword = (password) => {
  if (!PASSWORD_REGEX.test(password))
    return [
      "Password must be 8-16 characters with at least one uppercase letter and one special character",
    ];
  return [];
};

module.exports = {
  validateUser,
  validateStore,
  validateRating,
  validatePassword,
};
