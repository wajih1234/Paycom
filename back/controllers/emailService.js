const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendResetEmail(to, resetLink) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Paycom <onboarding@resend.dev>', 
      to,
      subject: 'Password Reset Request',
      html: `<p>You forget your password and need to reset it .</p>
             <p>Click <a href="${resetLink}">here</a> to reset your password.</p>
             <p>If you did not request this, ignore this email.</p>`
    });

    if (error) {
      console.error('Error sending reset email:', error);
      return false;
    }

    console.log('Reset email sent:', data);
    return true;
  } catch (err) {
    console.error('Error in sendResetEmail:', err);
    return false;
  }
}

module.exports = sendResetEmail;
