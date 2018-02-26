exports.validationErrors = ({ errors: rawErrors }) => {
  let errors;
  console.log(rawErrors);
  try {
    errors = Object.keys(rawErrors).map(key => ({
      attribute: rawErrors[key].path,
      type: rawErrors[key].kind,
      message: rawErrors[key].message
    }));
  } catch (error) {
    errors = error;
  }
  return errors;
};
