import React from "react";
import { Box, Container, Typography, Grid, Link, Chip, Divider } from "@mui/material";
import { Security, FactCheck, Public, School, OpenInNew } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const factCheckPartners = [
    { name: "PIB Fact Check (भारत सरकार)", url: "https://factcheck.pib.gov.in" },
    { name: "विश्वास न्यूज़ (Vishvas News)", url: "https://www.vishvasnews.com" },
    { name: "बूम हिंदी (BOOM FactCheck)", url: "https://hindi.boomlive.in" },
    { name: "ऑल्ट न्यूज़ हिंदी (Alt News)", url: "https://hindi.altnews.in" },
  ];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "rgba(10, 12, 16, 0.95)",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        color: "#94a3b8",
        pt: 6,
        pb: 4,
        mt: "auto",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} mb={4}>
          {/* Brand Info */}
          <Grid item xs={12} md={5}>
            <Box display="flex" alignItems="center" gap={1.5} mb={2}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "8px",
                  background: "linear-gradient(135deg, #00d4ff 0%, #3b82f6 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Security sx={{ color: "#ffffff", fontSize: 20 }} />
              </Box>
              <Typography variant="h6" sx={{ color: "#f8fafc", fontWeight: 700 }}>
                MitraVerify
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: "#94a3b8", lineHeight: 1.7, mb: 2 }}>
              High-accuracy Hindi and Indian regional language verification platform engineered to detect
              phishing emails, WhatsApp forwards, lottery scams, and financial fraud using Devanagari tokenization,
              N-grams, TF-IDF vectorization, and Multinomial Naive Bayes classification.
            </Typography>
            <Chip
              label="100% Client Privacy • Local NLP Engine"
              size="small"
              sx={{
                backgroundColor: "rgba(0, 212, 255, 0.08)",
                color: "#38bdf8",
                border: "1px solid rgba(0, 212, 255, 0.2)",
                fontSize: "0.75rem",
              }}
            />
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2" sx={{ color: "#f8fafc", fontWeight: 700, mb: 2 }}>
              NAVIGATION
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              <Link
                component="button"
                onClick={() => navigate("/")}
                sx={{ color: "#94a3b8", textAlign: "left", textDecoration: "none", "&:hover": { color: "#00d4ff" } }}
              >
                Verification Console
              </Link>
              <Link
                component="button"
                onClick={() => navigate("/nlp-basics")}
                sx={{ color: "#94a3b8", textAlign: "left", textDecoration: "none", "&:hover": { color: "#00d4ff" } }}
              >
                NLP Architecture
              </Link>
              <Link
                component="button"
                onClick={() => navigate("/about")}
                sx={{ color: "#94a3b8", textAlign: "left", textDecoration: "none", "&:hover": { color: "#00d4ff" } }}
              >
                About MitraVerify
              </Link>
            </Box>
          </Grid>

          {/* Fact Check Resources */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle2" sx={{ color: "#f8fafc", fontWeight: 700, mb: 2 }}>
              VERIFICATION & CYBER DEFENSE
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              {factCheckPartners.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: "#94a3b8",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    textDecoration: "none",
                    "&:hover": { color: "#00d4ff" },
                  }}
                >
                  {item.name} <OpenInNew sx={{ fontSize: 13, ml: 0.5 }} />
                </Link>
              ))}
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.08)", mb: 3 }} />

        {/* Bottom copyright */}
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          <Typography variant="caption" sx={{ color: "#64748b" }}>
            © 2026 MitraVerify. Developed for Indian Language Misinformation & Spam Defense.
          </Typography>
          <Typography variant="caption" sx={{ color: "#64748b" }}>
            NLP Architecture: Devanagari Tokenization • TF-IDF • MultinomialNB
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
