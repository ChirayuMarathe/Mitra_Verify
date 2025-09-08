import React from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Box py={8} textAlign="center">
        <Typography
          variant="h2"
          gutterBottom
          style={{ color: "var(--text-primary)" }}
        >
          404
        </Typography>
        <Typography
          variant="h5"
          gutterBottom
          style={{ color: "var(--text-primary)" }}
        >
          Page Not Found
        </Typography>
        <Typography
          variant="body1"
          paragraph
          style={{ color: "var(--text-secondary)" }}
        >
          The page you're looking for doesn't exist.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/")}
          className="btn-neon"
        >
          Go Home
        </Button>
      </Box>
    </Container>
  );
};

export default NotFoundPage;
