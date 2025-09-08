import React from "react";
import { Box, Container, Typography, Link, Grid, Chip } from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import SchoolIcon from "@mui/icons-material/School";
import BusinessIcon from "@mui/icons-material/Business";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "var(--bg-primary)",
        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        color: "var(--text-primary)",
        py: 6,
        mt: "auto",
      }}
    >
      <Container maxWidth="lg">
        {/* Main Brand Section */}
        <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              backgroundColor: "var(--brand-red)",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <VerifiedUserIcon sx={{ color: "white", fontSize: 28 }} />
          </Box>
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontFamily: '"IBM Plex Sans", sans-serif',
                fontWeight: 600,
                color: "var(--text-primary)",
                mb: 0.5,
              }}
            >
              2025 MitraVerify
            </Typography>
          </Box>
        </Box>

        {/* Top Verification Categories */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            sx={{
              color: "var(--text-primary)",
              mb: 2,
              fontFamily: '"IBM Plex Sans", sans-serif',
              fontWeight: 500,
            }}
          >
            Top Categories
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {[
              "News",
              "Health",
              "Politics",
              "Science",
              "Technology",
              "Social Media",
              "Images",
              "Videos",
              "WhatsApp",
              "Facebook",
              "Twitter",
              "Instagram",
            ].map((category) => (
              <Chip
                key={category}
                label={category}
                size="small"
                sx={{
                  backgroundColor: "var(--bg-secondary)",
                  color: "var(--text-secondary)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  "&:hover": {
                    backgroundColor: "var(--bg-tertiary)",
                    color: "var(--text-primary)",
                  },
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Footer Links */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="h6"
              sx={{
                color: "var(--text-primary)",
                mb: 2,
                fontFamily: '"IBM Plex Sans", sans-serif',
                fontWeight: 500,
                fontSize: "1rem",
              }}
            >
              PLATFORM
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link
                href="/verify"
                sx={{
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  "&:hover": { color: "var(--text-primary)" },
                }}
              >
                Fact Check
              </Link>
              <Link
                href="/history"
                sx={{
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  "&:hover": { color: "var(--text-primary)" },
                }}
              >
                Verification History
              </Link>
              <Link
                href="/dashboard"
                sx={{
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  "&:hover": { color: "var(--text-primary)" },
                }}
              >
                Dashboard
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="h6"
              sx={{
                color: "var(--text-primary)",
                mb: 2,
                fontFamily: '"IBM Plex Sans", sans-serif',
                fontWeight: 500,
                fontSize: "1rem",
              }}
            >
              DEVELOPERS
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link
                href="/about"
                sx={{
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  "&:hover": { color: "var(--text-primary)" },
                }}
              >
                About
              </Link>
              <Link
                href="/contact"
                sx={{
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  "&:hover": { color: "var(--text-primary)" },
                }}
              >
                Partner Schools
              </Link>
              <Link
                href="#"
                sx={{
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  "&:hover": { color: "var(--text-primary)" },
                }}
              >
                Get Hired
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="h6"
              sx={{
                color: "var(--text-primary)",
                mb: 2,
                fontFamily: '"IBM Plex Sans", sans-serif',
                fontWeight: 500,
                fontSize: "1rem",
              }}
            >
              EDUCATORS
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link
                href="/learn"
                sx={{
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  "&:hover": { color: "var(--text-primary)" },
                }}
              >
                Learning Modules
              </Link>
              <Link
                href="#"
                sx={{
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  "&:hover": { color: "var(--text-primary)" },
                }}
              >
                Assess Students
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="h6"
              sx={{
                color: "var(--text-primary)",
                mb: 2,
                fontFamily: '"IBM Plex Sans", sans-serif',
                fontWeight: 500,
                fontSize: "1rem",
              }}
            >
              COMPANIES
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link
                href="#"
                sx={{
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  "&:hover": { color: "var(--text-primary)" },
                }}
              >
                Skill Assessments
              </Link>
              <Link
                href="#"
                sx={{
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  "&:hover": { color: "var(--text-primary)" },
                }}
              >
                Find Candidates
              </Link>
            </Box>
          </Grid>
        </Grid>

        {/* Bottom Section */}
        <Box
          sx={{
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            pt: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 3,
              flexWrap: "wrap",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: "var(--text-secondary)",
                fontFamily: '"IBM Plex Sans", sans-serif',
              }}
            >
              © 2025 MitraVerify. All rights reserved.
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "var(--text-secondary)",
                fontFamily: '"IBM Plex Sans", sans-serif',
              }}
            >
              Built for Google Cloud Hackathon 2025
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Link
                href="/privacy"
                sx={{
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  fontSize: "0.875rem",
                  "&:hover": { color: "var(--text-primary)" },
                }}
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                sx={{
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  fontSize: "0.875rem",
                  "&:hover": { color: "var(--text-primary)" },
                }}
              >
                Terms of Service
              </Link>
              <Link
                href="/about"
                sx={{
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  fontSize: "0.875rem",
                  "&:hover": { color: "var(--text-primary)" },
                }}
              >
                About
              </Link>
            </Box>
          </Box>

          {/* Social Links */}
          <Box sx={{ display: "flex", gap: 1 }}>
            <Link
              href="#"
              sx={{
                color: "var(--text-secondary)",
                "&:hover": { color: "var(--text-primary)" },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 32,
                height: 32,
              }}
            >
              <TwitterIcon fontSize="small" />
            </Link>
            <Link
              href="#"
              sx={{
                color: "var(--text-secondary)",
                "&:hover": { color: "var(--text-primary)" },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 32,
                height: 32,
              }}
            >
              <LinkedInIcon fontSize="small" />
            </Link>
            <Link
              href="#"
              sx={{
                color: "var(--text-secondary)",
                "&:hover": { color: "var(--text-primary)" },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 32,
                height: 32,
              }}
            >
              <GitHubIcon fontSize="small" />
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
