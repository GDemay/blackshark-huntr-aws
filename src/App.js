import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, Grid, Typography, Paper } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Form from './Components/Form';
import SuccessPage from './Components/SuccessPage'; // Make sure to create this component

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Container maxWidth="lg">

            {/* Form and Success Page Area */}
            <Grid item xs={12} md={6}>
              <Paper elevation={3} style={{ padding: '20px' }}>
                <Routes>
                  <Route path="/" element={<Form />} />
                  <Route path="/success" element={<SuccessPage />} />
                </Routes>
              </Paper>
            </Grid>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
