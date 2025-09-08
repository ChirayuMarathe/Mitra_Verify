import React from "react";
import { Container, Typography, Box } from "@mui/material";

const ProfilePage = () => {
  return (
    <Container>
      <Box py={4}>
        <Typography
          variant="h4"
          gutterBottom
          style={{ color: "var(--text-primary)" }}
        >
          Profile
        </Typography>
        <Typography variant="body1" style={{ color: "var(--text-secondary)" }}>
          Profile page coming soon...
        </Typography>
      </Box>
    </Container>
  );
};

export default ProfilePage;
