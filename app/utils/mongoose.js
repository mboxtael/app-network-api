exports.validationErrors = ({ errors: rawErrors }) => {
  const errors = { };

  for (const key in rawErrors) {
    if (rawErrors.hasOwnProperty(key)) {
      const error = rawErrors[key];
      errors[key] = {
        type: error.kind,
        message: error.message    
      }
    }
  }

  return errors;
};
