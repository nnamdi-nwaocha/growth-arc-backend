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
        const url = `http://localhost:3000/auth/confirm-email?token=${token}`; // Replace with your frontend URL
        try {
            const response = await this.resend.emails.send({
                from: 'Growth Arc <no-reply@ideate.cc>',
                to: email,
                subject: 'Confirm your email address',
                html: `
<div style="font-family: Arial, sans-serif; background-color: #f0f0f0; margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; height: 100vh;">
    <div style="background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); text-align: center; max-width: 400px;">
        <h1 style="color: #333333; margin-bottom: 20px;">Your Journey Begins✨</h1>
        <p style="color: #666666; margin-bottom: 30px;">Thank you for signing up! Please click the button below to confirm your email address.</p>
        <a href="${url}" style="display: inline-block; background-color: #FFB200; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: bold; transition: background-color 0.3s ease;">Confirm Email</a>
    </div>
</div>
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