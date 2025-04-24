const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');

const renderEmailTemplate = (templateName, type, data, lang = 'en') => {
  const templatePath = path.join(__dirname, `${templateName}.hbs`);
  const templateSource = fs.readFileSync(templatePath, 'utf8');
  const template = Handlebars.compile(templateSource);

  let translations;
  try {
    const all = require(`./translations/${lang}.json`);
    translations = all[type] || all['orderStatus'];
  } catch (e) {
    const fallback = require(`./translations/en.json`);
    translations = fallback[type];
  }

  return template({
    translations,
    username: data.username,
    orderStatus: data.status,
    trackingNumber: data.trackingNumber,
    orderLink: data.orderLink
  });
};

module.exports = { renderEmailTemplate };
