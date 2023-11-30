import React, { useState } from 'react';
import emailjs from 'emailjs-com';

const SendEmailComponent = ({ userEmail, subject, emailBody }) => {
  const [status, setStatus] = useState('');

  const sendEmail = () => {
    const templateParams = {
      to_email: userEmail,
      subject: subject,
      message: emailBody,
    };

    emailjs.send('service_nqwg6zm', 'template_9l9lkns', templateParams, 'EWuMjZX2o9kN1Bdmh')
      .then(response => {
        console.log('Email successfully sent!', response.status, response.text);
        setStatus('Email sent successfully');
      }, err => {
        console.error('Failed to send email. Error: ', err);
        setStatus('Failed to send email');
      });
  };

  return (
    <div>
      <button onClick={sendEmail}>Send Email</button>
      {status && <p>{status}</p>}
    </div>
  );
};

export default SendEmailComponent;
