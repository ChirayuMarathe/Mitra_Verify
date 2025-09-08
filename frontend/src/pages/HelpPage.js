import React from "react";
import { Container, Typography, Box } from "@mui/material";

const HelpPage = () => {
  return (
    <Container>
      <Box py={4}>
        <Typography
          variant="h4"
          gutterBottom
          style={{ color: "var(--text-primary)" }}
        >
          Help & Support
        </Typography>
        <Typography variant="body1" style={{ color: "var(--text-secondary)" }}>
          Help page coming soon...
        </Typography>
      </Box>
    </Container>
  );
};

export default HelpPage;
