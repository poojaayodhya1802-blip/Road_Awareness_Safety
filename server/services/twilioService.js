const twilio = require('twilio');

class TwilioService {
  constructor() {
    // Only initialize Twilio client if credentials are provided
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      this.client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
    } else {
      this.client = null;
      console.log('Twilio credentials not provided - SMS notifications will be disabled');
    }
    
    this.fromNumber = process.env.TWILIO_PHONE_NUMBER || '+16089276452';
    this.adminNumber = process.env.ADMIN_PHONE_NUMBER;
  }

  async sendSMS(to, message) {
    try {
      if (!this.client || !this.fromNumber) {
        console.warn('Twilio not configured, skipping SMS');
        return { success: false, message: 'Twilio not configured' };
      }

      // Validate phone number
      if (!to || typeof to !== 'string') {
        console.warn('Invalid phone number provided:', to);
        return { success: false, message: 'Invalid phone number' };
      }

      // Clean and format phone number
      let formattedNumber = to.replace(/\s+/g, '').replace(/[^\d+]/g, '');
      
      // Ensure phone number is in E.164 format
      if (!formattedNumber.startsWith('+')) {
        // If no country code, assume India (+91)
        formattedNumber = '+91' + formattedNumber.replace(/\D/g, '');
      }

      // Remove any extra spaces or special characters
      formattedNumber = formattedNumber.trim();

      console.log(`Attempting to send SMS to: ${formattedNumber} from: ${this.fromNumber}`);
      console.log(`Message length: ${message.length} characters`);

      const result = await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: formattedNumber
      });

      console.log(`SMS sent successfully: ${result.sid}`);
      console.log(`Message status: ${result.status}`);
      return { success: true, sid: result.sid, status: result.status };
    } catch (error) {
      console.error('SMS sending failed:', error.message);
      console.error('Error code:', error.code);
      console.error('Error details:', error);
      
      // Log specific Twilio error information
      if (error.moreInfo) {
        console.error('More info:', error.moreInfo);
      }
      
      return { success: false, error: error.message, code: error.code };
    }
  }

  async notifyAdminApplication(application) {
    // Don't send admin notification if admin number is not provided or same as Twilio number
    if (!this.adminNumber || this.adminNumber === this.fromNumber) {
      console.log('Admin number not provided or same as Twilio number, logging application instead:');
      console.log('=== NEW VOLUNTEER APPLICATION ===');
      console.log(`Name: ${application.fullName}`);
      console.log(`Phone: ${application.phoneNumber}`);
      console.log(`Email: ${application.email}`);
      console.log(`City: ${application.city}`);
      console.log(`Interest: ${application.interest}`);
      console.log(`Message: ${application.message}`);
      console.log(`Submitted: ${new Date(application.submittedAt).toLocaleString()}`);
      console.log('================================');
      return { success: true, message: 'Application logged to console' };
    }

    const message = `🚨 NEW VOLUNTEER APPLICATION\n\n` +
      `Name: ${application.fullName}\n` +
      `Phone: ${application.phoneNumber}\n` +
      `Email: ${application.email}\n` +
      `City: ${application.city}\n` +
      `Interest: ${application.interest}\n` +
      `Message: ${application.message.substring(0, 100)}${application.message.length > 100 ? '...' : ''}\n\n` +
      `Submitted: ${new Date(application.submittedAt).toLocaleString()}`;

    return await this.sendSMS(this.adminNumber, message);
  }

  async notifyAdminHazard(hazard) {
    // Don't send admin notification if admin number is not provided or same as Twilio number
    if (!this.adminNumber || this.adminNumber === this.fromNumber) {
      console.log('Admin number not provided or same as Twilio number, logging hazard instead:');
      console.log('=== NEW HAZARD REPORT ===');
      console.log(`Reporter: ${hazard.reporterName}`);
      console.log(`Phone: ${hazard.phoneNumber}`);
      console.log(`Type: ${hazard.hazardType}`);
      console.log(`Location: ${hazard.location.address}`);
      console.log(`Description: ${hazard.description}`);
      console.log(`Priority: ${hazard.priority.toUpperCase()}`);
      console.log(`Reported: ${new Date(hazard.reportedAt).toLocaleString()}`);
      console.log('========================');
      return { success: true, message: 'Hazard logged to console' };
    }

    const message = `🚨 NEW HAZARD REPORT\n\n` +
      `Reporter: ${hazard.reporterName}\n` +
      `Phone: ${hazard.phoneNumber}\n` +
      `Type: ${hazard.hazardType}\n` +
      `Location: ${hazard.location.address}\n` +
      `Description: ${hazard.description.substring(0, 100)}${hazard.description.length > 100 ? '...' : ''}\n` +
      `Priority: ${hazard.priority.toUpperCase()}\n\n` +
      `Reported: ${new Date(hazard.reportedAt).toLocaleString()}`;

    return await this.sendSMS(this.adminNumber, message);
  }

  async sendConfirmationSMS(phoneNumber, type, referenceId) {
    let message;
    
    if (type === 'application') {
      message = `✅ Thank you for your application!\n\n` +
        `Your volunteer/event participation application has been received successfully.\n` +
        `Reference ID: ${referenceId}\n\n` +
        `We will contact you soon with further details.\n\n` +
        `Road Safety Awareness Portal`;
    } else if (type === 'hazard') {
      message = `✅ Hazard Report Received!\n\n` +
        `Thank you for reporting this road hazard.\n` +
        `Reference ID: ${referenceId}\n\n` +
        `Our team will review and take necessary action.\n\n` +
        `Road Safety Awareness Portal`;
    }

    return await this.sendSMS(phoneNumber, message);
  }
}

module.exports = new TwilioService(); 