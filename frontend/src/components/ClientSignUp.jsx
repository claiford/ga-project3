import React, { useState } from "react";
import axios from "axios";
import { Alert, Container, TextField, Button } from "@mui/material";

const ClientSignUp = ({ clientInfo, setClientInfo }) => {
  const [error, setError] = useState(null);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showSuccessBar, setShowSuccessBar] = useState(false);
  const [success, setSuccess] = useState(null);

  const handleInputChange = (e, key) => {
    const updatedClientInfo = { ...clientInfo, [key]: e.target.value };
    setClientInfo(updatedClientInfo);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!clientInfo.name || !clientInfo.email || !clientInfo.password) {
      setError("All fields are required");
      setShowErrorMessage(true);
    }
    // API call
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/signup`,
        clientInfo
      );
      // console.log("Sign up response: ", response);
      if (response.status === 200) {
        setShowSuccessBar(true);
        setSuccess(response.data.message || "Sign up successful.");
        // Reset form fields
        setClientInfo({
          name: "",
          email: "",
          password: "",
        });
      } else {
        const data = response.data;
        setError(data.message || "Sign up failed.");
        setShowErrorMessage(true);
      }
    } catch (err) {
      console.log(err);
      setShowErrorMessage(true);
    }
    setTimeout(() => {
      setShowErrorMessage(false);
      setShowSuccessBar(false);
    }, 3000);
  };

  return (
    <Container maxWidth="xs">
      <form onSubmit={handleSubmitForm}>
        <TextField
          sx={{ height: 40 }}
          label="Name"
          type="text"
          fullWidth
          margin="normal"
          value={clientInfo.name}
          onChange={(e) => handleInputChange(e, "name")}
        />
        <TextField
          sx={{ height: 40 }}
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={clientInfo.email}
          onChange={(e) => handleInputChange(e, "email")}
        />
        <TextField
          sx={{ height: 40 }}
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={clientInfo.password}
          onChange={(e) => handleInputChange(e, "password")}
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          fullWidth
          size="large"
          sx={{ marginTop: "1rem", marginBottom: "2rem" }}
        >
          Sign up as Client
        </Button>
        {/* <Typography sx={{ color: "red" }}> */}
        {showErrorMessage && (
          <Alert severity="error">
            <span>{error}</span>
          </Alert>
        )}
        {/* </Typography> */}
      </form>
      {showSuccessBar && (
        <Alert severity="success">
          <span>{success}</span>
        </Alert>
      )}
    </Container>
  );
};

export default ClientSignUp;
