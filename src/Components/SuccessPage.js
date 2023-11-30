import React from 'react';
import { Typography, Container, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SuccessPage = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/'); // Navigate back to the homepage or another relevant page
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Congratulations!
      </Typography>
      <Typography variant="body1" gutterBottom>
        Your order has been received. Someone will reach out to you soon.
      </Typography>
      <Button variant="contained" color="primary" onClick={handleBackToHome}>
        Back to Home
      </Button>
    </Container>
  );
};

export default SuccessPage;
