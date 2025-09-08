import fs from 'fs';
import nodemailer, { SendMailOptions, SentMessageInfo } from 'nodemailer';
import path from 'path';

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: false,
  auth: {
    user: process.env.MAIL_ADDRESS,
    pass: process.env.MAIL_PASSWORD
  }
});

export interface TemplateData {
  [key: string]: string | number | boolean;
}

export interface EmailOptions extends Omit<SendMailOptions, 'html'> {
  template?: string;
  templateData?: TemplateData;
  html?: string;
}

const templateCache = new Map<string, string>();

/**
 * Get and cache HTML template
 */
function getTemplate(templateName: string): string {
  if (templateCache.has(templateName)) {
    return templateCache.get(templateName)!;
  }

  try {
    const templatePath = path.join(
      __dirname,
      'templates',
      `${templateName}.html`
    );
    const template = fs.readFileSync(templatePath, 'utf-8');

    templateCache.set(templateName, template);
    return template;
  } catch (error) {
    throw new Error(`Email template '${templateName}' not found`);
  }
}

/**
 * Render template with data
 */
function renderTemplate(templateName: string, data: TemplateData): string {
  const template = getTemplate(templateName);

  // Replace placeholders like {{name}} with actual data
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return data[key]?.toString() || match;
  });
}

/**
 * Send email with optional template support
 *
 * @param options - Email options with template support
 * @returns Promise<SentMessageInfo>
 *
 * @example
 * // Using template
 * sendMail({
 *   to: 'user@example.com',
 *   subject: 'Welcome!',
 *   template: 'welcome',
 *   templateData: { name: 'John', email: 'john@example.com' }
 * });
 *
 * // Using raw HTML (backward compatibility)
 * sendMail({
 *   to: 'user@example.com',
 *   subject: 'Welcome!',
 *   html: '<h1>Welcome!</h1>'
 * });
 */
export function sendMail(options: EmailOptions): Promise<SentMessageInfo> {
  let html = options.html;

  if (options.template) {
    html = renderTemplate(options.template, options.templateData || {});
  }

  const mailOptions: SendMailOptions = {
    from: `${process.env.MAIL_FROM_NAME || 'Your App'} <${process.env.MAIL_ADDRESS}>`,
    ...options,
    html
  };

  // Remove custom properties before sending
  delete (mailOptions as any).template;
  delete (mailOptions as any).templateData;

  return transporter.sendMail(mailOptions);
}

/**
 * Clear template cache (useful for development)
 */
export function clearTemplateCache(): void {
  templateCache.clear();
}
