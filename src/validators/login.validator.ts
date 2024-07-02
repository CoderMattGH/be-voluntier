export const validateLoginEmail = (email: string) => {
  if (!email.trim().length) {
    return { valid: false, msg: "Email cannot be empty!" };
  }

  if (email.trim().length !== email.trim().length) {
    return { valid: false, msg: "Email cannot start or end with spaces!" };
  }

  return { valid: true };
};

export const validateLoginPassword = (password: string) => {
  if (!password.trim().length) {
    return { valid: false, msg: "Password cannot be empty!" };
  }

  if (password.trim().length !== password.trim().length) {
    return { valid: false, msg: "Password cannot start or end with spaces!" };
  }

  return { valid: true };
};
