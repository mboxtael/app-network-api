exports.responseErrors = ({ errors: rawErrors }) => {
  const errors = {};

  Object.keys(rawErrors).forEach(key => {
    const error = rawErrors[key];
    errors[key] = {
      type: error.kind,
      message: error.message
    };
  });

  return errors;
};

