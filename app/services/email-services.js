import mail from "@sendgrid/mail";

mail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async (to, subject, text) => {
	const msg = {
		to,
		from: process.env.EMAIL_FROM,
		subject,
		text,
	};

	try {
		await mail.send(msg);
		return "success";
	} catch (error) {
		console.error("Error sending email:", error);
		return "bad request";
	}
};
