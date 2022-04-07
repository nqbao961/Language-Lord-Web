export function validateEmail(email: string) {
  if (/^\w+([\+\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return true;
  }
  return false;
}

export function validatePhone(phone: string) {
  if (/\+?[0-9]+/.test(phone)) {
    return true;
  }
  return false;
}

/**
 * At least 7 char, 1 upper case, 1 number, 1 special
 */
export function validatePassword(password: string) {
  if (
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[`~!@#$%^&*()_\-+=<>,.?/\\])[\w\d`~!@#$%^&*()_\-+=<>,.?/\\]{7,}$/.test(
      password
    )
  ) {
    return true;
  }
  return false;
}
