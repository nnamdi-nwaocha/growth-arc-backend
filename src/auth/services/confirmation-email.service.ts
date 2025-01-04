import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailService {
    private resend: Resend;

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.getOrThrow<string>('RESEND_API_KEY');
        this.resend = new Resend(apiKey);
    }

    async sendConfirmationEmail(email: string, token: string) {
        const frontendUrl = this.configService.getOrThrow<string>('FRONTEND_URL');
        const url = `${frontendUrl}/login?token=${token}`; // Replace with your frontend URL
        try {
            const response = await this.resend.emails.send({
                from: 'Growth Arc <no-reply@ideate.cc>',
                to: email,
                subject: 'Confirm your email address',
                html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirm Your Email Address</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f0f0f0; margin: 0; padding: 0;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="max-width: 600px; margin: auto; background-color: #ffffff;">
        <tr>
            <td style="padding: 40px 20px; text-align: center;">
                <h1 style="color: #333333; margin-bottom: 20px; font-size: 24px;">Your Journey Begins✨</h1>
                <p style="color: #666666; margin-bottom: 30px; font-size: 16px; line-height: 1.5;">Thank you for signing up! Please click the button below to confirm your email address.</p>
                <a href="${url}" style="display: inline-block; background-color: #FFB200; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: bold; font-size: 16px;">Confirm Email</a>
            </td>
        </tr>
    </table>
</body>
</html>
`,
            });
            console.log('Email sent successfully:', response);
            return response;
        } catch (error) {
            console.error('Error sending email:', error);
            throw new InternalServerErrorException('Failed to send confirmation email');
        }
    }
}