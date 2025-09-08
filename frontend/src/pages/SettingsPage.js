import React from "react";
import { Container, Typography, Box } from "@mui/material";

const SettingsPage = () => {
  return (
    <Container>
      <Box py={4}>
        <Typography
          variant="h4"
          gutterBottom
          style={{ color: "var(--text-primary)" }}
        >
          Settings
        </Typography>
        <Typography variant="body1" style={{ color: "var(--text-secondary)" }}>
          Settings page coming soon...
        </Typography>
      </Box>
    </Container>
  );
};

export default SettingsPage;
