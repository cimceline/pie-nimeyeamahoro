import nodemailer from 'nodemailer';
import config from '../config/index.js';
import { logger } from '../utils/logger.js';

class EmailService {
  constructor() {
    this.from = process.env.EMAIL_FROM || 'Celine Platform <noreply@celine-platform.com>';
    this.transporter = null;
    this.isProduction = config.isProduction;
    this.initTransporter();
  }

  initTransporter() {
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || '587', 10);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });
      logger.info('[EmailService] SMTP transporter configured');
    } else {
      logger.warn('[EmailService] No SMTP config found. Emails will be logged only.');
    }
  }

  async sendEmail(options) {
    const { to, subject, html, text } = options;

    if (!this.transporter) {
      logger.info('[EmailService] Email (no SMTP configured):', JSON.stringify({ to, subject }, null, 2));
      return { success: true, messageId: 'log-' + Date.now(), mode: 'logged' };
    }

    try {
      const info = await this.transporter.sendMail({
        from: this.from,
        to,
        subject,
        html: html || text,
        text,
      });
      logger.info('[EmailService] Email sent:', info.messageId);
      return { success: true, messageId: info.messageId, mode: 'sent' };
    } catch (error) {
      logger.error('[EmailService] Failed to send email:', error.message);
      throw error;
    }
  }

  async sendWelcome(user) {
    return this.sendEmail({
      to: user.email,
      subject: 'Welcome to Celine Platform',
      html: '<h1>Welcome!</h1><p>Thank you for joining Celine Platform.</p>',
    });
  }

  async sendNotification(user, notification) {
    return this.sendEmail({
      to: user.email,
      subject: notification.title || 'New Notification',
      html: '<h1>' + (notification.title || 'Notification') + '</h1><p>' + (notification.message || '') + '</p>',
    });
  }

  async sendNewsletter(subscribers, content) {
    const results = [];
    for (const subscriber of subscribers) {
      const result = await this.sendEmail({
        to: subscriber.email,
        subject: content.subject || 'Newsletter',
        html: content.html || content.body || '',
      });
      results.push({ email: subscriber.email, ...result });
    }
    return results;
  }

  async sendPasswordReset(user, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/reset-password?token=${resetToken}`;
    return this.sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      html: `
        <h1>Password Reset</h1>
        <p>Hello ${user.name},</p>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>This link expires in 1 hour.</p>
        <p>If you did not request this, please ignore this email.</p>
      `,
    });
  }
}

const emailService = new EmailService();
export default emailService;
export { EmailService };
