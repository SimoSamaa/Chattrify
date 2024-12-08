
const usePasswordStrength = (password: string) => {
  const regExpLower = /[a-z]/;
  const regExpUpper = /[A-Z]/;
  const regExpMedium = /\d/;
  const regExpStrong = /[!@#$%^&*?_~\-()]/;


  const hasLower = password.match(regExpLower);
  const hasUpper = password.match(regExpUpper);
  const mediumMatch = password.match(regExpMedium);
  const strongMatch = password.match(regExpStrong);
  const weakMatch = hasLower && hasUpper;

  if (weakMatch && mediumMatch && strongMatch) {
    return ["weak", "medium", "strong"];
  } else if (
    (weakMatch && mediumMatch) ||
    (weakMatch && strongMatch) ||
    (mediumMatch && strongMatch)
  ) {
    return ["weak", "medium"];
  } else if (weakMatch || mediumMatch || strongMatch) {
    return ["weak"];
  } else {
    return [];
  }
};

export default usePasswordStrength;