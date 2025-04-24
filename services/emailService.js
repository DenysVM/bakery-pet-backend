const { renderEmailTemplate } = require('../emailTemplates/renderEmailTemplate');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const transporter = require('../config/email.config');

// Загрузка локали по языку
function getLocale(language) {
  const lang = ['en', 'ru', 'uk', 'pl'].includes(language) ? language : 'en';
  try {
    return require(path.join(__dirname, '..', 'locales', `${lang}.json`));
  } catch (error) {
    console.warn(`Локаль "${lang}" не найдена, используется "en".`);
    return require(path.join(__dirname, '..', 'locales', 'en.json'));
  }
}

// Получить переводы для конкретного email-типа
function getEmailTranslations(language, emailType) {
  const locale = getLocale(language);
  return locale.emails[emailType];
}

// Скомпилировать шаблон письма
function compileTemplate(templateName, data) {
  const filePath = path.join(__dirname, '..', 'emailTemplates', `${templateName}.hbs`);
  const source = fs.readFileSync(filePath, 'utf-8');
  const compiledTemplate = handlebars.compile(source);
  return compiledTemplate(data);
}

// Общая функция отправки писем
async function sendEmail(to, subject, templateName, templateData = {}) {
  try {
    const html = compileTemplate(templateName, templateData);
    const senderEmail = process.env.SPARKPOST_SENDER;

    if (!senderEmail) {
      throw new Error('SPARKPOST_SENDER не задан в .env');
    }

    const mailOptions = {
      from: senderEmail,
      to,
      subject,
      html,
    };

    return await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(`Ошибка при отправке письма (${templateName}):`, error);
    throw error;
  }
}

// -------------------------
// Письмо подтверждения email
// -------------------------
async function sendRegistrationEmail(user, verificationLink) {
  const translations = getEmailTranslations(user.language, 'registration');
  return sendEmail(
    user.email,
    translations.title,
    'registration',
    {
      username: user.firstName,
      verificationLink,
      translations,
    }
  );
}

// -------------------------
// Сброс пароля
// -------------------------
async function sendResetPasswordEmail(user, resetLink) {
  const translations = getEmailTranslations(user.language, 'resetPassword');
  return sendEmail(
    user.email,
    translations.title,
    'resetPassword',
    {
      username: user.firstName,
      resetLink,
      translations,
    }
  );
}

// -------------------------
// Статус заказа
// -------------------------
async function sendOrderStatusUpdateEmail(userEmail, userName, orderNumber, status, language = 'en') {

  console.log('[EMAIL][OrderStatus] Preparing to send status update email...');
  console.log('Email:', userEmail);
  console.log('User:', userName);
  console.log('OrderNumber:', orderNumber);
  console.log('Status:', status);
  console.log('Language:', language);

  const translations = getEmailTranslations(language, 'orderStatus');
  return sendEmail(
    userEmail,
    translations.title,
    'orderNotification',
    {
      username: userName,
      orderStatus: status,
      orderNumber,
      // orderLink: `https://cozybakery.com/orders/${orderNumber}`,
      translations,
    }
  );
}

// -------------------------
// Трекинг-номер (Новая Почта)
// -------------------------
async function sendTrackingNumberEmail(userEmail, userName, orderNumber, trackingNumber, language = 'en') {
  
  console.log('[EMAIL][TrackingNumber] Preparing to send tracking email...');
  console.log('Email:', userEmail);
  console.log('User:', userName);
  console.log('OrderNumber:', orderNumber);
  console.log('TrackingNumber:', trackingNumber);
  console.log('Language:', language);

  const translations = getEmailTranslations(language, 'trackingNumber');
  return sendEmail(
    userEmail,
    translations.title,
    'orderNotification',
    {
      username: userName,
      orderStatus: 'shipped', 
      trackingNumber,
      orderNumber,
      orderLink: `https://cozybakery.com/orders/${orderNumber}`,
      translations,
    }
  );
}



module.exports = {
  sendRegistrationEmail,
  sendResetPasswordEmail,
  sendOrderStatusUpdateEmail,
  sendTrackingNumberEmail,
  sendEmail,
};
