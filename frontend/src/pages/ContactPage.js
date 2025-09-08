import React from "react";
import { Container, Typography, Box } from "@mui/material";

const ContactPage = () => {
  return (
    <Container>
      <Box py={4}>
        <Typography
          variant="h4"
          gutterBottom
          style={{ color: "var(--text-primary)" }}
        >
          Contact
        </Typography>
        <Typography variant="body1" style={{ color: "var(--text-secondary)" }}>
          Contact page coming soon...
        </Typography>
      </Box>
    </Container>
  );
};

export default ContactPage;
