import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import VerifyIcon from "@mui/icons-material/VerifiedUser";
import SchoolIcon from "@mui/icons-material/School";
import SpeedIcon from "@mui/icons-material/Speed";
import SearchIcon from "@mui/icons-material/Search";
import SecurityIcon from "@mui/icons-material/Security";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import GroupIcon from "@mui/icons-material/Group";
import FlashOnIcon from "@mui/icons-material/FlashOn";

const HomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const splineRef = useRef(null);

  // Animated typing effect for hero tagline
  const [displayText, setDisplayText] = useState("");
  const fullText = "Achieve mastery through challenge";

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setDisplayText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, []);

  // Remove Spline watermark aggressively
  useEffect(() => {
    const removeSplineWatermark = () => {
      const splineViewer = splineRef.current;
      if (splineViewer) {
        // Remove watermark from shadow DOM
        const observer = new MutationObserver(() => {
          const shadowRoot = splineViewer.shadowRoot;
          if (shadowRoot) {
            // Remove all elements that might be watermarks
            const watermarkSelectors = [
              '[class*="watermark"]',
              '[class*="logo"]',
              '[class*="brand"]',
              '[href*="spline"]',
              'a[target="_blank"]',
              'div[style*="position: absolute"][style*="bottom"]',
              'div[style*="position: fixed"][style*="bottom"]',
              'div[style*="z-index: 999"]',
              'div[style*="z-index: 9999"]',
            ];

            watermarkSelectors.forEach((selector) => {
              const elements = shadowRoot.querySelectorAll(selector);
              elements.forEach((el) => {
                el.style.display = "none";
                el.style.visibility = "hidden";
                el.style.opacity = "0";
                el.remove();
              });
            });

            // Also check for text content that might be watermarks
            const allElements = shadowRoot.querySelectorAll("*");
            allElements.forEach((el) => {
              if (
                el.textContent &&
                el.textContent.toLowerCase().includes("spline")
              ) {
                el.style.display = "none";
                el.remove();
              }
            });
          }
        });

        observer.observe(splineViewer, {
          childList: true,
          subtree: true,
          attributes: true,
        });

        // Also try direct removal
        setTimeout(() => {
          const shadowRoot = splineViewer.shadowRoot;
          if (shadowRoot) {
            const possibleWatermarks =
              shadowRoot.querySelectorAll("div, a, span");
            possibleWatermarks.forEach((el) => {
              const rect = el.getBoundingClientRect();
              if (
                rect.bottom > window.innerHeight - 100 ||
                el.textContent?.includes("Spline")
              ) {
                el.remove();
              }
            });
          }
        }, 2000);

        return () => observer.disconnect();
      }
    };

    const timer = setTimeout(removeSplineWatermark, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleVerifySubmit = () => {
    if (searchQuery.trim()) {
      navigate("/verify", { state: { query: searchQuery } });
    }
  };

  const features = [
    {
      icon: (
        <FlashOnIcon sx={{ fontSize: 40, color: "var(--status-verified)" }} />
      ),
      title: "Real-time Verification",
      description:
        "Get instant credibility scores with our lightning-fast AI analysis engine",
      color: "var(--status-verified)",
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40, color: "var(--neon-blue)" }} />,
      title: "Multi-format Detection",
      description:
        "Analyze text, images, videos, and URLs across multiple platforms",
      color: "var(--neon-blue)",
    },
    {
      icon: <SchoolIcon sx={{ fontSize: 40, color: "var(--neon-purple)" }} />,
      title: "Digital Literacy Hub",
      description:
        "Level up your fact-checking skills with interactive learning modules",
      color: "var(--neon-purple)",
    },
    {
      icon: (
        <TrendingUpIcon
          sx={{ fontSize: 40, color: "var(--status-questionable)" }}
        />
      ),
      title: "Trending Analysis",
      description:
        "Track viral misinformation patterns and emerging fake news trends",
      color: "var(--status-questionable)",
    },
    {
      icon: <GroupIcon sx={{ fontSize: 40, color: "var(--status-false)" }} />,
      title: "Community Network",
      description:
        "Join fact-checkers worldwide and contribute to truth verification",
      color: "var(--status-false)",
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40, color: "var(--neon-cyan)" }} />,
      title: "Cross-platform Access",
      description:
        "Verify content seamlessly via web, WhatsApp, or browser extension",
      color: "var(--neon-cyan)",
    },
  ];

  const trendingTopics = [
    "Election News",
    "Health Claims",
    "Climate Change",
    "Cryptocurrency",
    "Celebrity Rumors",
    "Breaking News",
  ];

  const verificationStats = [
    {
      label: "Content Verified",
      value: "50,000+",
      icon: <VerifyIcon sx={{ color: "var(--status-verified)" }} />,
    },
    {
      label: "Users Protected",
      value: "25,000+",
      icon: <SecurityIcon sx={{ color: "var(--neon-blue)" }} />,
    },
    {
      label: "False Claims Detected",
      value: "15,000+",
      icon: <FlashOnIcon sx={{ color: "var(--status-questionable)" }} />,
    },
    {
      label: "Accuracy Rate",
      value: "94%",
      icon: <TrendingUpIcon sx={{ color: "var(--status-verified)" }} />,
    },
  ];

  return (
    <Box sx={{ minHeight: "100vh" }}>
      {/* Full Viewport Hero Section */}
      <Box
        sx={{
          height: "100vh",
          width: "100vw",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%)",
          // Animated tech halo background pattern
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(0, 255, 255, 0.03) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(0, 200, 255, 0.02) 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, rgba(0, 150, 200, 0.02) 0%, transparent 40%)
            `,
            animation: "techHalo 20s ease-in-out infinite",
            zIndex: 1,
          },
          // Hexagonal grid pattern
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            opacity: 0.3,
            animation: "float 30s ease-in-out infinite",
            zIndex: 0,
          },
          "@keyframes techHalo": {
            "0%, 100%": {
              transform: "scale(1) rotate(0deg)",
              opacity: 0.6,
            },
            "50%": {
              transform: "scale(1.1) rotate(1deg)",
              opacity: 0.8,
            },
          },
          "@keyframes float": {
            "0%, 100%": {
              transform: "translateY(0px) rotate(0deg)",
            },
            "50%": {
              transform: "translateY(-10px) rotate(0.5deg)",
            },
          },
        }}
      >
        {/* Spline 3D Background - Overlapping with Hero */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
            overflow: "hidden",
            opacity: 0.6,
            transform: "scale(1.2)",
            "& spline-viewer": {
              width: "120%",
              height: "120%",
              display: "block",
              transform: "translate(-10%, -10%)",
            },
            // More aggressive hiding of Spline branding
            "& *": {
              "&[class*='watermark']": {
                display: "none !important",
                visibility: "hidden !important",
              },
              "&[class*='logo']": {
                display: "none !important",
                visibility: "hidden !important",
              },
              "&[class*='spline']": {
                "&:not(spline-viewer)": {
                  display: "none !important",
                  visibility: "hidden !important",
                },
              },
            },
          }}
        >
          <spline-viewer
            ref={splineRef}
            url="https://prod.spline.design/x1yiNPPhDDbQiz1c/scene.splinecode"
            style={{
              width: "120%",
              height: "120%",
              border: "none",
              background: "transparent",
              imageRendering: "auto",
              filter: "none",
              transform: "translate(-10%, -10%)",
            }}
          />
          <style>
            {`
              spline-viewer::part(logo),
              spline-viewer .spline-watermark,
              spline-viewer [class*="watermark"],
              spline-viewer [class*="logo"],
              spline-viewer [class*="spline"]:not(spline-viewer) {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
                position: absolute !important;
                left: -9999px !important;
              }
              
              spline-viewer {
                --spline-watermark: none !important;
                filter: none !important;
                opacity: 1 !important;
                visibility: visible !important;
                display: block !important;
              }
              
              spline-viewer canvas {
                image-rendering: auto !important;
                filter: none !important;
              }
              
              /* Hide any bottom-right positioned elements (likely watermarks) */
              spline-viewer > *:last-child {
                display: none !important;
              }
              
              spline-viewer div[style*="position: absolute"][style*="bottom"],
              spline-viewer div[style*="position: fixed"][style*="bottom"] {
                display: none !important;
              }
              
              /* Ensure spline is always visible and larger */
              spline-viewer {
                min-width: 120% !important;
                min-height: 120% !important;
                transform: scale(1.2) translate(-10%, -10%) !important;
              }
            `}
          </style>
        </Box>

        {/* Hero Content */}
        <Container
          maxWidth="lg"
          sx={{
            position: "relative",
            zIndex: 2,
            textAlign: "center",
            px: { xs: 3, md: 4 },
          }}
        >
          <Box sx={{ maxWidth: "900px", mx: "auto" }}>
            {/* Main Headline */}
            <Typography
              variant="h1"
              sx={{
                fontSize: {
                  xs: "2.5rem",
                  sm: "3.5rem",
                  md: "4.5rem",
                  lg: "5.5rem",
                  xl: "6rem",
                },
                fontFamily: '"Inter", sans-serif',
                fontWeight: 800,
                color: "#ffffff",
                mb: { xs: 3, md: 4 },
                lineHeight: { xs: 1.1, md: 1.05 },
                letterSpacing: "-0.02em",
                textShadow: "0 2px 20px rgba(0, 0, 0, 0.3)",
                background: "linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: "fadeInUp 1s ease-out",
                "@keyframes fadeInUp": {
                  "0%": {
                    opacity: 0,
                    transform: "translateY(30px)",
                  },
                  "100%": {
                    opacity: 1,
                    transform: "translateY(0)",
                  },
                },
              }}
            >
              Achieve mastery through challenge
            </Typography>

            {/* Subheadline */}
            <Typography
              variant="h5"
              sx={{
                fontSize: {
                  xs: "1.125rem",
                  sm: "1.25rem",
                  md: "1.5rem",
                  lg: "1.75rem",
                },
                fontFamily: '"Inter", sans-serif',
                fontWeight: 400,
                color: "#b3b3b3",
                mb: { xs: 4, md: 6 },
                maxWidth: "700px",
                mx: "auto",
                lineHeight: 1.4,
                textShadow: "0 1px 10px rgba(0, 0, 0, 0.2)",
                animation: "fadeInUp 1s ease-out 0.2s both",
              }}
            >
              Harness AI technology and community intelligence to identify and
              combat misinformation
            </Typography>

            {/* CTA Buttons */}
            <Box
              sx={{
                display: "flex",
                gap: { xs: 2, md: 3 },
                justifyContent: "center",
                flexWrap: "wrap",
                mb: { xs: 4, md: 6 },
                animation: "fadeInUp 1s ease-out 0.4s both",
              }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate("/register")}
                sx={{
                  background:
                    "linear-gradient(135deg, #00ffff 0%, #00d4ff 100%)",
                  color: "#000000",
                  fontWeight: 700,
                  fontSize: { xs: "1rem", md: "1.125rem" },
                  px: { xs: 3, md: 4 },
                  py: { xs: 1.5, md: 2 },
                  borderRadius: "12px",
                  textTransform: "none",
                  minWidth: { xs: 180, md: 220 },
                  height: { xs: 48, md: 56 },
                  boxShadow: "0 4px 20px rgba(0, 255, 255, 0.3)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #00d4ff 0%, #00b8ff 100%)",
                    boxShadow: "0 8px 40px rgba(0, 255, 255, 0.5)",
                    transform: "translateY(-2px)",
                  },
                }}
                endIcon={<VerifyIcon />}
              >
                Join MitraVerify
              </Button>

              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate("/learn")}
                sx={{
                  border: "2px solid #00ffff",
                  color: "#00ffff",
                  fontWeight: 600,
                  fontSize: { xs: "1rem", md: "1.125rem" },
                  px: { xs: 3, md: 4 },
                  py: { xs: 1.5, md: 2 },
                  borderRadius: "12px",
                  textTransform: "none",
                  minWidth: { xs: 180, md: 220 },
                  height: { xs: 48, md: 56 },
                  background: "rgba(0, 255, 255, 0.05)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    background: "rgba(0, 200, 255, 0.15)",
                    borderColor: "#00d4ff",
                    color: "#00d4ff",
                    boxShadow: "0 4px 20px rgba(0, 255, 255, 0.2)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                Learn More
              </Button>
            </Box>

            {/* Search Bar */}
            <Box
              sx={{
                maxWidth: "600px",
                mx: "auto",
                animation: "fadeInUp 1s ease-out 0.6s both",
              }}
            >
              <TextField
                fullWidth
                placeholder="Search or paste content to verify…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleVerifySubmit()}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "#666666" }} />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery && (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleVerifySubmit}
                        sx={{
                          color: "#00ffff",
                          "&:hover": {
                            backgroundColor: "rgba(0, 255, 255, 0.1)",
                            color: "#00d4ff",
                          },
                        }}
                      >
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    borderRadius: "16px",
                    border: "2px solid rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(10px)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    height: "60px",
                    "& fieldset": { border: "none" },
                    "&:hover": {
                      borderColor: "rgba(0, 255, 255, 0.3)",
                      backgroundColor: "rgba(255, 255, 255, 0.08)",
                      boxShadow: "0 4px 20px rgba(0, 255, 255, 0.1)",
                    },
                    "&.Mui-focused": {
                      borderColor: "#00ffff",
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      boxShadow: "0 4px 30px rgba(0, 255, 255, 0.2)",
                    },
                  },
                  "& .MuiOutlinedInput-input": {
                    color: "#ffffff",
                    fontSize: "1.125rem",
                    "&::placeholder": {
                      color: "#888888",
                      opacity: 1,
                    },
                  },
                }}
              />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Section Divider */}
      <Divider
        sx={{
          borderColor: "var(--border-primary)",
          opacity: 0.6,
          my: 4,
        }}
      />

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {verificationStats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Card
                className="dark-card"
                sx={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-primary)",
                  borderRadius: 2,
                  textAlign: "center",
                  p: 2,
                  "&:hover": {
                    borderColor: "var(--border-secondary)",
                    transform: "translateY(-4px)",
                    boxShadow: "var(--shadow-elevated)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <CardContent sx={{ p: "16px !important" }}>
                  <Box sx={{ mb: 1 }}>{stat.icon}</Box>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      mb: 0.5,
                      fontSize: { xs: "1.5rem", md: "2rem" },
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "var(--text-secondary)",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                    }}
                  >
                    {stat.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Section Divider */}
      <Divider
        sx={{
          borderColor: "var(--border-primary)",
          opacity: 0.6,
          my: 4,
        }}
      />

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              color: "var(--text-primary)",
              mb: 2,
              fontSize: { xs: "2rem", md: "2.5rem" },
            }}
          >
            Why Choose MitraVerify?
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "var(--text-secondary)",
              maxWidth: "600px",
              mx: "auto",
              fontSize: "1.125rem",
              fontWeight: 400,
            }}
          >
            Advanced AI technology meets community wisdom to combat
            misinformation
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                className="dark-card"
                sx={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-primary)",
                  borderRadius: 2,
                  height: "100%",
                  p: 3,
                  "&:hover": {
                    borderColor: feature.color,
                    transform: "translateY(-8px)",
                    boxShadow: `var(--shadow-elevated), 0 0 20px ${feature.color}20`,
                  },
                  transition: "all 0.4s ease",
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ mb: 3 }}>{feature.icon}</Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      mb: 2,
                      fontSize: "1.25rem",
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "var(--text-secondary)",
                      lineHeight: 1.6,
                      fontSize: "0.875rem",
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Section Divider */}
      <Divider
        sx={{
          borderColor: "var(--border-primary)",
          opacity: 0.6,
          my: 4,
        }}
      />

      {/* Trending Topics */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: "var(--text-primary)",
              mb: 2,
              fontSize: { xs: "1.75rem", md: "2.25rem" },
            }}
          >
            Trending Verifications
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "var(--text-secondary)",
              mb: 4,
              fontSize: "1rem",
            }}
          >
            Popular topics being verified by our community
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1.5,
            justifyContent: "center",
            mb: 6,
          }}
        >
          {trendingTopics.map((topic, index) => (
            <Chip
              key={index}
              label={topic}
              onClick={() =>
                navigate(`/verify?query=${encodeURIComponent(topic)}`)
              }
              className="status-badge"
              sx={{
                backgroundColor: "var(--bg-tertiary)",
                border: "1px solid var(--border-primary)",
                color: "var(--text-secondary)",
                fontWeight: 500,
                fontSize: "0.875rem",
                "&:hover": {
                  backgroundColor: "var(--bg-elevated)",
                  borderColor: "var(--neon-blue)",
                  color: "var(--text-primary)",
                  cursor: "pointer",
                  boxShadow: "var(--glow-blue)",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </Box>

        {/* Final CTA */}
        <Box
          className="glass-card"
          sx={{
            background:
              "linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)",
            border: "1px solid var(--border-primary)",
            borderRadius: 3,
            p: 6,
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "var(--text-primary)",
              mb: 2,
              fontSize: { xs: "1.5rem", md: "2rem" },
            }}
          >
            Ready to Fight Misinformation?
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "var(--text-secondary)",
              mb: 4,
              maxWidth: "500px",
              mx: "auto",
              fontSize: "1rem",
            }}
          >
            Join thousands of users who trust MitraVerify to keep them informed
            with accurate, verified information.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/register")}
            className="btn-neon btn-neon-primary"
            sx={{
              fontWeight: 600,
              fontSize: "1.125rem",
              px: 4,
              py: 1.5,
              borderRadius: "8px",
              textTransform: "none",
              minWidth: 240,
              height: 56,
            }}
            endIcon={<VerifyIcon />}
          >
            Get Started Free
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;
