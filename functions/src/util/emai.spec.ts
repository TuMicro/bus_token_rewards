import { mailSender } from "./email";

describe("Email", () => {
  it("should be able to send an email", async () => {
    await mailSender({
      to: "josuejulcarima@gmail.com",
      from: 'hola@turuta.pe', // Use the email address or domain you verified above
      subject: 'Recibiste tus BUS tokens 😊',
      text: `oki`,
    });
  });
});