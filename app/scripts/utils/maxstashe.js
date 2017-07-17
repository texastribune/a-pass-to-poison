const TEMPLATE_DELIMITER = new RegExp(/\{\{|\}\}/);

export function renderTemplate(string, context) {
  return string
    .split(TEMPLATE_DELIMITER)
    .map(function parse(token, idx) {
      return idx % 2 === 0 ? token : context[token];
    })
    .join('');
}

export function compileTemplate(string) {
  const template = string.split(TEMPLATE_DELIMITER);

  return function render(context) {
    return template
      .map(function parse(token, idx) {
        return idx % 2 === 0 ? token : context[token];
      })
      .join('');
  };
}
