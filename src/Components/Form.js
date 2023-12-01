import React, { useState, useEffect } from 'react';
import {
  Typography,
  Grid,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  FormHelperText,
  Checkbox,
  Link,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import emailjs from 'emailjs-com';

const Form = () => {
  
  const [subscriptionDuration, setSubscriptionDuration] = useState('1-month');
  const [numUsers, setNumUsers] = useState(0);
  const [additionalStorage, setAdditionalStorage] = useState(100);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [additionalInformation, setAdditionalInformation] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [reviewOffer, setReviewOffer] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [emailStatus, setEmailStatus] = useState('');

  const alwaysOnGPU = true;
  const totalPriceFor10UsersPerYear = 1296000;
  const storageOptions = { 100: 200, 200: 400, 300: 600, 400: 800, 500: 1000, 600: 1200, 700: 1400, 800: 1600, 900: 1800, 1000: 2000 };
  const basePrices = { "1-month": 15000, "3-months": 45000, "6-months": 90000, "1-year": 162000 };
  const gpuCost = { "1-month": 5000, "3-months": 15000, "6-months": 30000, "1-year": 54000 };
  const subscriptionDurationMonths = { "1-month": 1, "3-months": 3, "6-months": 6, "1-year": 12 };
  const pricePerUser = { "1-month": 120000, "3-months": 360000, "6-months": 720000, "1-year": 1296000 };
  const [isLoading, setIsLoading] = useState(false); // New state for loading


  
  const navigate = useNavigate();

  useEffect(() => {
    let price = basePrices[subscriptionDuration] || 0;
    const monthlyStorageCost = storageOptions[additionalStorage] || 0;
    const totalStorageCost = monthlyStorageCost * (subscriptionDurationMonths[subscriptionDuration] || 0);
    price += totalStorageCost;
    price += gpuCost[subscriptionDuration] || 0;
    const userBasedPricePerYear = (totalPriceFor10UsersPerYear / 10) * numUsers;
    price += userBasedPricePerYear;
    setTotalPrice(price);
  }, [subscriptionDuration, additionalStorage, numUsers]);

  const validateForm = () => {
    const errors = {};
    if (!name.trim()) errors.name = 'Name is required';
    if (!email.trim()) errors.email = 'Email is required';
    if (!companyName.trim()) errors.companyName = 'Company name is required';
    if (!companyAddress.trim()) errors.companyAddress = 'Company address is required';
    if (numUsers < 0) errors.numUsers = 'Number of users must be at least 0';
    if (additionalStorage <= 0) errors.additionalStorage = 'Additional storage must be selected';
    if (!termsAgreed) errors.termsAgreed = 'You must agree to the terms';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (isValid) setReviewOffer(true); // Open the review offer dialog only if the form is valid
  };

  const handleClose = () => {
    setReviewOffer(false);
    setEmailStatus(''); // Reset email status
  };


  const sendEmail = () => {
    setIsLoading(true); // Start loading when email sending process begins
  
    const emailContent = `Subscription Duration: ${subscriptionDuration}, ` +
      `Number of Users: ${numUsers}, ` +
      `Additional Storage: ${additionalStorage} GB, ` +
      `Always-On GPU: ${alwaysOnGPU ? "Yes" : "No"}, ` +
      `Additional Information: ${additionalInformation}, ` +
      `Total Price: $${totalPrice.toLocaleString()}, ` +
      `Name: ${name}, ` +
      `Email: ${email}, ` +
      `Company Name: ${companyName}, ` +
      `Company Address: ${companyAddress}, `;
  
    const templateParamsToCompany = {
      to_email: 'no-reply@blackshark.ai', // Replace with your company email
      subject: "New Subscription Order",
      message: emailContent,
      to_name: 'Blackshark.ai', // Replace with your company's name
      from_name: name,
    };
  
    const templateParamsToCustomer = {
      to_email: email,
      subject: "Your Subscription Order Confirmation",
      message: emailContent,
      to_name: name,
      from_name: 'Blackshark.ai', // Replace with your company's name
    };
  
    // Send email to the company
    emailjs.send('service_nqwg6zm', 'template_9l9lkns', templateParamsToCompany, 'EWuMjZX2o9kN1Bdmh')
      .then(response => {
        console.log('Email to company successfully sent!', response.status, response.text);
        setEmailStatus('Email sent successfully');
        // Send email to the customer
        return emailjs.send('service_nqwg6zm', 'template_5ijzfcx', templateParamsToCustomer, 'EWuMjZX2o9kN1Bdmh');
      })
      .then(response => {
        console.log('Email to customer successfully sent!', response.status, response.text);
        navigate('/success'); // Navigate to the success page
      })
      .catch(err => {
        console.error('Failed to send email. Error: ', err);
        setEmailStatus('Failed to send email');
      })
      .finally(() => {
        setIsLoading(false); // Stop loading regardless of email success or failure
      });
  };
  

  const handleProceed = () => {
    sendEmail();
  };

  return (
    <>
    <form onSubmit={handleFormSubmit}>
      <Typography variant="h6" gutterBottom>
        Subscription Details
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
        <FormControl fullWidth error={!!formErrors.numUsers}>
            <InputLabel>Subscription Duration</InputLabel>
            <Select
              value={subscriptionDuration}
              onChange={(e) => setSubscriptionDuration(e.target.value)}
            >
              <MenuItem value="1-month">1 month</MenuItem>
              <MenuItem value="3-months">3 months</MenuItem>
              <MenuItem value="6-months">6 months</MenuItem>
              <MenuItem value="1-year">1 year</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
    <TextField
        label="Number of Users"
        fullWidth
        type="number"
        value={numUsers}
        onChange={(e) => {
            // Ensure the value is between 1 and 50
            const newValue = Math.min(Math.max(parseInt(e.target.value, 10), 0), 50);
            setNumUsers(newValue);
        }}
        inputProps={{
            min: 0,
            max: 50,  // Update this value to 50
        }}
    />
</Grid>


        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Additional Storage</InputLabel>
            <Select
              value={additionalStorage}
              onChange={(e) => setAdditionalStorage(e.target.value)}
            >
              {Object.keys(storageOptions).map((size) => (
                <MenuItem key={size} value={size}>
                  {size} GB
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>


        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={alwaysOnGPU}
                disabled={true}
              />
            }
            label="Always-On GPU"
          />
        </Grid>
      </Grid>

      <Typography variant="h6" gutterBottom>
        Your Information
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Name"
            required
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Email"
            fullWidth
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Company Name"
            fullWidth
            value={companyName}
            required
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Company Address"
            fullWidth
            value={companyAddress}
            onChange={(e) => setCompanyAddress(e.target.value)}
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            label="Additional Information"
            fullWidth
            multiline
            rows={1}
            value={additionalInformation}
            onChange={(e) => setAdditionalInformation(e.target.value)}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
              />
            }
            label={
              <span>
                I agree to the&nbsp;
                <Link
                  href="/terms-and-conditions" // Replace with the actual link
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms and Conditions
                </Link>
              </span>
            }
          />
          <FormHelperText>{formErrors.termsAgreed}</FormHelperText>
        </Grid>
      </Grid>

      <Typography variant="h5" gutterBottom>
        Total Price: ${totalPrice.toLocaleString()}
      </Typography>

      <Button type="submit" variant="contained" color="primary">
        Review Order
      </Button>
    </form>


      <Dialog open={reviewOffer} onClose={handleClose}>
      <DialogTitle>Review Your Offer</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please review your selections before proceeding:
          </DialogContentText>
          <Typography gutterBottom>
            Subscription Duration: {subscriptionDuration}
          </Typography>
          <Typography gutterBottom>
            Number of Users: {numUsers}
          </Typography>
          <Typography gutterBottom>
            Additional Storage: {additionalStorage} GB
          </Typography>
          <Typography gutterBottom>
            Always-On GPU: {alwaysOnGPU ? "Yes" : "No"}
          </Typography>
          <Typography gutterBottom>
            Additional Information: {additionalInformation}
          </Typography>
          <Typography gutterBottom>
            Total Price: ${totalPrice.toLocaleString()}
          </Typography>
          <DialogContentText>
            By clicking "Proceed," you agree to send us an email with your selections. We will process your order and respond within 24 hours.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleProceed} 
            color="primary" 
            autoFocus
            disabled={isLoading} // Disable button when loading
          >
            {isLoading ? 'Processing...' : 'Proceed'} {/* Change text based on loading state */}
          </Button>
        </DialogActions>
      </Dialog>
      {emailStatus && <p>{emailStatus}</p>} {/* Display email status */}
    </>
  );
};

export default Form;
