import twilio from 'twilio';

// Use environment variables or mock if not available
const accountSid = process.env.TWILIO_ACCOUNT_SID || 'mock_sid';
const authToken = process.env.TWILIO_AUTH_TOKEN || 'mock_token';
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER || '+1234567890';
const dispatchPhoneNumber = process.env.POLICE_DISPATCH_PHONE || '+0987654321';

let client;
try {
  // Only initialize actual client if not mock
  if (accountSid !== 'mock_sid') {
    client = twilio(accountSid, authToken);
  }
} catch (err) {
  console.warn("Twilio failed to initialize. Falling back to mock.");
}

export const sendEmergencySMS = async (alertType, message, lat, lng) => {
  const smsBody = `CRITICAL ALERT [${alertType}]: ${message}\nLocation: https://maps.google.com/?q=${lat},${lng}`;

  if (client) {
    try {
      await client.messages.create({
        body: smsBody,
        from: twilioPhoneNumber,
        to: dispatchPhoneNumber
      });
      console.log(`✅ [Twilio] SMS dispatched to ${dispatchPhoneNumber}`);
    } catch (error) {
      console.error(`❌ [Twilio] Failed to send SMS:`, error.message);
    }
  } else {
    // Mock delivery for testing without credentials
    console.log('\n=======================================');
    console.log('📱 [MOCK SMS DISPATCHED]');
    console.log(`To: ${dispatchPhoneNumber}`);
    console.log(`Message: \n${smsBody}`);
    console.log('=======================================\n');
  }
};
