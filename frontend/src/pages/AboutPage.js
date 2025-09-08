import React from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Divider,
} from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";
import PeopleIcon from "@mui/icons-material/People";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SchoolIcon from "@mui/icons-material/School";

const AboutPage = () => {
  const stats = [
    {
      label: "Content Verified",
      value: "50K+",
      icon: <SecurityIcon />,
      color: "var(--neon-blue)",
    },
    {
      label: "Active Users",
      value: "10K+",
      icon: <PeopleIcon />,
      color: "var(--neon-green)",
    },
    {
      label: "Accuracy Rate",
      value: "94%",
      icon: <TrendingUpIcon />,
      color: "var(--neon-cyan)",
    },
    {
      label: "Learning Modules",
      value: "25+",
      icon: <SchoolIcon />,
      color: "var(--neon-purple)",
    },
  ];

  return (
    <Box sx={{ minHeight: "100vh", background: "var(--bg-primary)", py: 4 }}>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box textAlign="center" mb={6} className="fade-in">
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontSize: { xs: "2.5rem", md: "3.5rem" },
              fontWeight: 700,
              background: `linear-gradient(135deg, var(--neon-blue), var(--neon-cyan))`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: 2,
              textShadow: "var(--glow-blue)",
            }}
          >
            About MitraVerify
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: "var(--text-secondary)",
              mb: 3,
              fontWeight: 400,
              maxWidth: 800,
              mx: "auto",
            }}
          >
            Empowering India with AI-powered tools to combat misinformation and
            build a more informed digital society
          </Typography>
        </Box>

        {/* Section Divider */}
        <Divider
          sx={{
            borderColor: "var(--border-primary)",
            opacity: 0.6,
            my: 4,
          }}
        />

        {/* Mission Section */}
        <Card
          className="dark-card"
          sx={{
            mb: 6,
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-primary)",
            borderRadius: "16px",
          }}
        >
          <CardContent sx={{ p: 5 }}>
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                color: "var(--text-primary)",
                fontWeight: 600,
                textAlign: "center",
                mb: 4,
              }}
            >
              Our Mission
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "var(--text-secondary)",
                lineHeight: 1.7,
                textAlign: "center",
                maxWidth: 900,
                mx: "auto",
              }}
            >
              MitraVerify is dedicated to fighting misinformation in India
              through advanced AI technology, educational resources, and
              community-driven fact-checking. We believe that access to accurate
              information is fundamental to democracy and social progress.
            </Typography>
          </CardContent>
        </Card>

        {/* Section Divider */}
        <Divider
          sx={{
            borderColor: "var(--border-primary)",
            opacity: 0.6,
            my: 4,
          }}
        />

        {/* Stats Grid */}
        <Grid container spacing={4} mb={6}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Card
                className="dark-card slide-up"
                sx={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-primary)",
                  borderRadius: "12px",
                  textAlign: "center",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    borderColor: stat.color,
                    boxShadow: `0 8px 32px rgba(0,0,0,0.3), 0 0 20px ${stat.color}30`,
                    transform: "translateY(-8px)",
                    "& .stat-icon": {
                      color: stat.color,
                      transform: "scale(1.1)",
                      filter: `drop-shadow(0 0 15px ${stat.color}60)`,
                    },
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    className="stat-icon"
                    sx={{
                      color: "var(--text-secondary)",
                      mb: 2,
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      fontSize: 40,
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Typography
                    variant="h3"
                    sx={{
                      color: "var(--text-primary)",
                      fontWeight: 700,
                      mb: 1,
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "var(--text-secondary)",
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

        {/* Section Divider */}
        <Divider
          sx={{
            borderColor: "var(--border-primary)",
            opacity: 0.6,
            my: 4,
          }}
        />

        {/* Technology Section */}
        <Card
          className="dark-card"
          sx={{
            mb: 6,
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-primary)",
            borderRadius: "16px",
          }}
        >
          <CardContent sx={{ p: 5 }}>
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                color: "var(--text-primary)",
                fontWeight: 600,
                textAlign: "center",
                mb: 4,
              }}
            >
              Powered by Advanced AI
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Box textAlign="center">
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ color: "var(--neon-blue)", fontWeight: 600 }}
                  >
                    Natural Language Processing
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: "var(--text-secondary)", lineHeight: 1.6 }}
                  >
                    Advanced NLP models analyze text content for credibility,
                    bias detection, and fact verification across multiple Indian
                    languages.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box textAlign="center">
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ color: "var(--neon-green)", fontWeight: 600 }}
                  >
                    Image Verification
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: "var(--text-secondary)", lineHeight: 1.6 }}
                  >
                    Computer vision algorithms detect image manipulation,
                    reverse image searches, and metadata analysis.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box textAlign="center">
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ color: "var(--neon-cyan)", fontWeight: 600 }}
                  >
                    Source Verification
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: "var(--text-secondary)", lineHeight: 1.6 }}
                  >
                    Real-time analysis of source credibility, cross-referencing
                    with trusted databases and fact-checking organizations.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Section Divider */}
        <Divider
          sx={{
            borderColor: "var(--border-primary)",
            opacity: 0.6,
            my: 4,
          }}
        />

        {/* Impact Section */}
        <Box
          textAlign="center"
          className="glass-card"
          sx={{
            p: 6,
            borderRadius: "16px",
            background:
              "linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(0, 255, 136, 0.1) 100%)",
            border: "1px solid rgba(0, 212, 255, 0.2)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              mb: 3,
              color: "var(--text-primary)",
              fontWeight: 700,
            }}
          >
            Building a Fact-Based Future
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mb: 4,
              color: "var(--text-secondary)",
              maxWidth: 800,
              mx: "auto",
              lineHeight: 1.6,
            }}
          >
            Together, we're creating a digital environment where truth prevails
            over misinformation. Every verification contributes to a more
            informed and resilient society.
          </Typography>
          <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
            <Chip
              label="Evidence-Based"
              sx={{
                backgroundColor: "var(--status-verified)",
                color: "var(--text-primary)",
                fontWeight: 500,
              }}
            />
            <Chip
              label="Community-Driven"
              sx={{
                backgroundColor: "var(--neon-blue)",
                color: "var(--text-primary)",
                fontWeight: 500,
              }}
            />
            <Chip
              label="Transparent"
              sx={{
                backgroundColor: "var(--neon-cyan)",
                color: "var(--text-primary)",
                fontWeight: 500,
              }}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default AboutPage;
