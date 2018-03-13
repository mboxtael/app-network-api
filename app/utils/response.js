exports.joiErrors = ({ details }) =>
  details.reduce((errors, detail) => {
    errors[detail.context.key] = {
      message: detail.message
    };
    return errors;
  }, {});
