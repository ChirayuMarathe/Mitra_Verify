import React from "react";
import { Container, Typography, Box } from "@mui/material";

const TermsPage = () => {
  return (
    <Container>
      <Box py={4}>
        <Typography
          variant="h4"
          gutterBottom
          style={{ color: "var(--text-primary)" }}
        >
          Terms of Service
        </Typography>
        <Typography variant="body1" style={{ color: "var(--text-secondary)" }}>
          Terms of service coming soon...
        </Typography>
      </Box>
    </Container>
  );
};

export default TermsPage;
