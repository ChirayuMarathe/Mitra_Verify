import React from "react";
import { Container, Typography, Box } from "@mui/material";

const PrivacyPage = () => {
  return (
    <Container>
      <Box py={4}>
        <Typography
          variant="h4"
          gutterBottom
          style={{ color: "var(--text-primary)" }}
        >
          Privacy Policy
        </Typography>
        <Typography variant="body1" style={{ color: "var(--text-secondary)" }}>
          Privacy policy coming soon...
        </Typography>
      </Box>
    </Container>
  );
};

export default PrivacyPage;
