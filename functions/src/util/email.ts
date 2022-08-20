import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY ?? "");

export const mailSender = async function (msg: sgMail.MailDataRequired ) {
  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error(error);

    /*if (error.response) {
      console.error(error.response.body)
    }*/
  }
};