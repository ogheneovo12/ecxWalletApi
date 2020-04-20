function validateInput(arr, expose) {
  let error = "";
  const validatePassword = (password) => {
    if (password.length < 5) {
      error += "password must be a minimum of 5 characters, ";

      return false;
    }
    return true;
  };
  const validatePin = (pin) => {
    if (!/[0-9]/.test(pin)) {
      error += "pin must be valid numbers, ";
      return false;
    }
    if (pin.length < 4 || pin.length > 4) {
      error += "pin must be 4 characters long, ";

      return false;
    }
    return true;
  };
  const validateEmail = (email) => {
    let mailFormat = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
    if (!mailFormat.test(email)) {
      error += "invalid email format";
      return false;
    }
    return true;
  };
  const validateUsername = (username) => {
    //only check for length
    if (username == "" || typeof username == "undefined") {
      error += "invalid username";
      return false;
    }
    return true;
  };
  if (arr) {
    arr.forEach(({ type, value }) => {
      switch (type) {
        case "password":
          validatePassword(value);
          break;
        case "email":
          validateEmail(value);
          break;
        case "username":
          validateUsername(value);
          break;
        case "pin":
          validatePin(value);
          break;
      }
    });
  }
  if (expose) {
    switch (expose) {
      case "all":
        return { validatePassword, validateEmail, validateUsername };
        break;
      case "password":
        return validatePassword;
        break;
      case "email":
        return validateEmail;
        break;
      case "username":
        return validateUsername;
        break;
      case "username":
        return validatePin;
        break;
      default:
        console.error({ error: "please use email,password,username or all" });
        break;
    }
  }
  return error;
}
module.exports = validateInput;
