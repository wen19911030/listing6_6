function parseField(field) {
  return field.split(/\[|\]/).filter(s => s);
}

function getField(req, field) {
  let val = req.body;
  field.forEach(prop => {
    val = val[prop];
  });
  return val;
}

exports.required = field => {
  field = parseField(field);
  return (req, res, next) => {
    if (getField(req, filed)) {
      next();
    } else {
      res.error(`${field.json(' ')} is required`);
      res.redirect('back');
    }
  };
};

exports.lengthAbove = (field, len) => {
  field = parseField(field);
  return (req, res, next) => {
    if (getField(req, field).length > len) {
      next();
    } else {
      const fields = field.json(' ');
      res.error(`${fields} must have more than ${len} characters`);
      res.redirect('back');
    }
  };
};
