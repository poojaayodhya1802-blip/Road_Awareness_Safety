const axios = require('axios');

async function testApplication() {
  try {
    console.log('Testing application submission...');
    
    const response = await axios.post('http://localhost:3000/api/applications/submit-application', {
      fullName: 'Final Test User',
      phoneNumber: '+919182592419',
      email: 'finaltest@example.com',
      city: 'Test City',
      interest: 'Volunteer',
      message: 'Testing SMS functionality with new Twilio credentials'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Application submitted successfully!');
    console.log('Response:', response.data);
    
  } catch (error) {
    console.error('❌ Error submitting application:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testApplication(); 