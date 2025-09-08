import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  LinearProgress,
  Avatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from "@mui/material";
import {
  TrendingUp,
  VerifiedUser,
  Warning,
  School,
  History,
  Share,
  Refresh,
  CheckCircle,
  Cancel,
  HelpOutline,
  TrendingDown,
  Assessment,
  Security,
  Timeline,
  Article,
  Image as ImageIcon,
  Link as LinkIcon,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import apiService from "../services/api";
import { useQuery } from "react-query";

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const DashboardPage = () => {
  const { user, userStats, statsLoading } = useAuth();
  const [tabValue, setTabValue] = useState(0);

  // Fetch verification history
  const {
    data: historyData,
    isLoading: historyLoading,
    refetch: refetchHistory,
  } = useQuery("verificationHistory", () => apiService.getHistory(1, null), {
    enabled: !!user,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch education modules progress
  const { data: educationData, isLoading: educationLoading } = useQuery(
    "educationModules",
    () => apiService.getEducationModules(),
    {
      enabled: !!user,
    }
  );

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getCredibilityColor = (score) => {
    if (score > 0.7) return "success";
    if (score > 0.4) return "warning";
    return "error";
  };

  const getCredibilityLabel = (score) => {
    if (score > 0.7) return "Likely True";
    if (score > 0.4) return "Uncertain";
    return "Likely False";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (statsLoading || historyLoading || educationLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="400px"
        >
          <CircularProgress
            sx={{
              color: "var(--neon-blue)",
              "& .MuiCircularProgress-circle": {
                strokeLinecap: "round",
              },
            }}
          />
        </Box>
      </Container>
    );
  }

  const stats = userStats || {
    total_verifications: 0,
    true_content: 0,
    false_content: 0,
    uncertain_content: 0,
    completed_modules: 0,
    recent_activity: 0,
    literacy_score: 0,
    accuracy_rate: 0,
    user_level: "Beginner",
  };

  // If user has no data, show demo data to make dashboard more engaging
  const demoMode =
    stats.total_verifications === 0 && stats.completed_modules === 0;

  const displayStats = demoMode
    ? {
        total_verifications: 12,
        true_content: 8,
        false_content: 3,
        uncertain_content: 1,
        completed_modules: 2,
        recent_activity: 5,
        literacy_score: 75,
        accuracy_rate: 67,
        user_level: "Intermediate",
      }
    : stats;

  const recentVerifications = historyData?.history?.slice(0, 5) || [];

  // Demo data for when user has no real data
  const demoVerifications = demoMode
    ? [
        {
          id: 1,
          content_type: "text",
          original_content: "Sample news article about technology...",
          result: "verified",
          confidence_score: 0.85,
          timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          analysis_summary: {
            credibility_score: 0.85,
            indicators: ["Reliable source", "Cross-verified"],
            sentiment: 0.2,
          },
        },
        {
          id: 2,
          content_type: "image",
          original_content: "Social media image post",
          result: "questionable",
          confidence_score: 0.65,
          timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          analysis_summary: {
            credibility_score: 0.65,
            indicators: ["Unverified source", "Edited content"],
            sentiment: -0.1,
          },
        },
        {
          id: 3,
          content_type: "url",
          original_content: "https://example-news-site.com/article",
          result: "false",
          confidence_score: 0.25,
          timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
          analysis_summary: {
            credibility_score: 0.25,
            indicators: ["Misleading claims", "Outdated information"],
            sentiment: -0.3,
          },
        },
      ]
    : [];

  const displayVerifications =
    recentVerifications.length > 0 ? recentVerifications : demoVerifications;
  const educationModules = educationData?.modules || [];
  const userProgress = educationData?.user_progress || {};

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box mb={4} textAlign="center" className="fade-in">
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
          Welcome back, {user?.username}!
        </Typography>
        <Typography
          variant="h5"
          sx={{
            color: "var(--text-secondary)",
            mb: 3,
            fontWeight: 400,
          }}
        >
          Your MitraVerify Dashboard - Fighting misinformation together
        </Typography>
        {demoMode && (
          <Alert
            severity="info"
            sx={{
              mb: 3,
              backgroundColor: "rgba(0, 212, 255, 0.1)",
              border: "1px solid rgba(0, 212, 255, 0.3)",
              color: "var(--text-primary)",
              borderRadius: "12px",
              "& .MuiAlert-icon": {
                color: "var(--neon-blue)",
              },
            }}
          >
            Welcome! This dashboard shows demo data to help you explore
            features. Start verifying content to see your real statistics and
            progress.
          </Alert>
        )}
        <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
          <Chip
            icon={<Assessment />}
            label={`Literacy Score: ${displayStats.literacy_score}/100`}
            className="status-badge"
            sx={{
              backgroundColor:
                displayStats.literacy_score > 70
                  ? "var(--status-verified)"
                  : displayStats.literacy_score > 40
                  ? "var(--status-questionable)"
                  : "var(--status-false)",
              color: "var(--text-primary)",
              border: `1px solid ${
                displayStats.literacy_score > 70
                  ? "var(--status-verified)"
                  : displayStats.literacy_score > 40
                  ? "var(--status-questionable)"
                  : "var(--status-false)"
              }`,
              fontWeight: 500,
              "&:hover": {
                boxShadow:
                  displayStats.literacy_score > 70
                    ? "var(--glow-green)"
                    : displayStats.literacy_score > 40
                    ? "var(--glow-orange)"
                    : "var(--glow-red)",
                transform: "translateY(-2px)",
              },
            }}
          />
          <Chip
            icon={<Security />}
            label={`${displayStats.total_verifications} Verifications`}
            className="status-badge"
            sx={{
              backgroundColor: "var(--status-processing)",
              color: "var(--text-primary)",
              border: "1px solid var(--status-processing)",
              fontWeight: 500,
              "&:hover": {
                boxShadow: "var(--glow-blue)",
                transform: "translateY(-2px)",
              },
            }}
          />
          <Chip
            icon={<School />}
            label={`Level: ${displayStats.user_level}`}
            className="status-badge"
            sx={{
              backgroundColor: "var(--neon-purple)",
              color: "var(--text-primary)",
              border: "1px solid var(--neon-purple)",
              fontWeight: 500,
              "&:hover": {
                boxShadow: "0 0 20px rgba(168, 85, 247, 0.4)",
                transform: "translateY(-2px)",
              },
            }}
          />
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            className="dark-card"
            sx={{
              height: "100%",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-primary)",
              borderRadius: "16px",
              transition: "all 0.3s ease",
              "&:hover": {
                borderColor: "var(--neon-blue)",
                boxShadow: "var(--glow-blue)",
                transform: "translateY(-4px)",
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" mb={2}>
                <Assessment
                  sx={{
                    color: "var(--neon-blue)",
                    mr: 2,
                    fontSize: 28,
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    color: "var(--text-primary)",
                    fontWeight: 600,
                  }}
                >
                  Total Verifications
                </Typography>
              </Box>
              <Typography
                variant="h2"
                sx={{
                  color: "var(--neon-blue)",
                  fontWeight: 700,
                  textShadow: "var(--glow-blue)",
                  mb: 1,
                }}
              >
                {displayStats.total_verifications}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "var(--text-secondary)",
                }}
              >
                Content pieces analyzed
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            className="dark-card"
            sx={{
              height: "100%",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-primary)",
              borderRadius: "16px",
              transition: "all 0.3s ease",
              "&:hover": {
                borderColor: "var(--status-verified)",
                boxShadow: "var(--glow-green)",
                transform: "translateY(-4px)",
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" mb={2}>
                <CheckCircle
                  sx={{
                    color: "var(--status-verified)",
                    mr: 2,
                    fontSize: 28,
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    color: "var(--text-primary)",
                    fontWeight: 600,
                  }}
                >
                  Accuracy Rate
                </Typography>
              </Box>
              <Typography
                variant="h2"
                sx={{
                  color: "var(--status-verified)",
                  fontWeight: 700,
                  textShadow: "var(--glow-green)",
                  mb: 1,
                }}
              >
                {displayStats.accuracy_rate}%
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "var(--text-secondary)",
                }}
              >
                Verification accuracy
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            className="dark-card"
            sx={{
              height: "100%",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-primary)",
              borderRadius: "16px",
              transition: "all 0.3s ease",
              "&:hover": {
                borderColor: "var(--neon-cyan)",
                boxShadow: "0 0 20px rgba(0, 255, 255, 0.4)",
                transform: "translateY(-4px)",
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" mb={2}>
                <School
                  sx={{
                    color: "var(--neon-cyan)",
                    mr: 2,
                    fontSize: 28,
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    color: "var(--text-primary)",
                    fontWeight: 600,
                  }}
                >
                  Learning Progress
                </Typography>
              </Box>
              <Typography
                variant="h2"
                sx={{
                  color: "var(--neon-cyan)",
                  fontWeight: 700,
                  textShadow: "0 0 20px rgba(0, 255, 255, 0.4)",
                  mb: 1,
                }}
              >
                {displayStats.completed_modules}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "var(--text-secondary)",
                }}
              >
                Modules completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            className="dark-card"
            sx={{
              height: "100%",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-primary)",
              borderRadius: "16px",
              transition: "all 0.3s ease",
              "&:hover": {
                borderColor: "var(--neon-purple)",
                boxShadow: "0 0 20px rgba(168, 85, 247, 0.4)",
                transform: "translateY(-4px)",
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" mb={2}>
                <TrendingUp
                  sx={{
                    color: "var(--neon-purple)",
                    mr: 2,
                    fontSize: 28,
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    color: "var(--text-primary)",
                    fontWeight: 600,
                  }}
                >
                  User Level
                </Typography>
              </Box>
              <Typography
                variant="h3"
                sx={{
                  color: "var(--neon-purple)",
                  fontWeight: 700,
                  textShadow: "0 0 20px rgba(168, 85, 247, 0.4)",
                  mb: 1,
                }}
              >
                {displayStats.user_level}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "var(--text-secondary)",
                }}
              >
                Digital literacy level
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Content Analysis Chart */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={8}>
          <Card
            className="dark-card"
            sx={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-primary)",
              borderRadius: "16px",
              transition: "all 0.3s ease",
              "&:hover": {
                borderColor: "var(--neon-blue)",
                boxShadow: "var(--glow-blue)",
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  color: "var(--text-primary)",
                  fontWeight: 600,
                  mb: 3,
                }}
              >
                Content Analysis Breakdown
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Box
                    textAlign="center"
                    p={2}
                    sx={{
                      background: "rgba(0, 255, 136, 0.1)",
                      borderRadius: "12px",
                      border: "1px solid rgba(0, 255, 136, 0.3)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: "var(--glow-green)",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    <CheckCircle
                      sx={{
                        color: "var(--status-verified)",
                        fontSize: 48,
                        mb: 2,
                        filter: "drop-shadow(var(--glow-green))",
                      }}
                    />
                    <Typography
                      variant="h3"
                      sx={{
                        color: "var(--status-verified)",
                        fontWeight: 700,
                        textShadow: "var(--glow-green)",
                        mb: 1,
                      }}
                    >
                      {displayStats.true_content}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "var(--text-primary)",
                        fontWeight: 500,
                      }}
                    >
                      Verified True
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box
                    textAlign="center"
                    p={2}
                    sx={{
                      background: "rgba(255, 136, 0, 0.1)",
                      borderRadius: "12px",
                      border: "1px solid rgba(255, 136, 0, 0.3)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: "var(--glow-orange)",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    <HelpOutline
                      sx={{
                        color: "var(--status-questionable)",
                        fontSize: 48,
                        mb: 2,
                        filter: "drop-shadow(var(--glow-orange))",
                      }}
                    />
                    <Typography
                      variant="h3"
                      sx={{
                        color: "var(--status-questionable)",
                        fontWeight: 700,
                        textShadow: "var(--glow-orange)",
                        mb: 1,
                      }}
                    >
                      {displayStats.uncertain_content}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "var(--text-primary)",
                        fontWeight: 500,
                      }}
                    >
                      Uncertain
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box
                    textAlign="center"
                    p={2}
                    sx={{
                      background: "rgba(255, 68, 68, 0.1)",
                      borderRadius: "12px",
                      border: "1px solid rgba(255, 68, 68, 0.3)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: "var(--glow-red)",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    <Cancel
                      sx={{
                        color: "var(--status-false)",
                        fontSize: 48,
                        mb: 2,
                        filter: "drop-shadow(var(--glow-red))",
                      }}
                    />
                    <Typography
                      variant="h3"
                      sx={{
                        color: "var(--status-false)",
                        fontWeight: 700,
                        textShadow: "var(--glow-red)",
                        mb: 1,
                      }}
                    >
                      {displayStats.false_content}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "var(--text-primary)",
                        fontWeight: 500,
                      }}
                    >
                      False/Misleading
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            className="dark-card"
            sx={{
              height: "100%",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-primary)",
              borderRadius: "16px",
              transition: "all 0.3s ease",
              "&:hover": {
                borderColor: "var(--neon-purple)",
                boxShadow: "0 0 20px rgba(168, 85, 247, 0.4)",
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  color: "var(--text-primary)",
                  fontWeight: 600,
                  mb: 3,
                }}
              >
                Recent Activity
              </Typography>
              <Box display="flex" alignItems="center" mb={3}>
                <Timeline
                  sx={{
                    color: "var(--neon-purple)",
                    mr: 2,
                    fontSize: 32,
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    color: "var(--text-primary)",
                    fontWeight: 500,
                  }}
                >
                  {displayStats.recent_activity} verifications
                </Typography>
              </Box>
              <Typography
                variant="body1"
                sx={{
                  color: "var(--text-secondary)",
                  mb: 2,
                }}
              >
                in last 30 days
              </Typography>
              <LinearProgress
                variant="determinate"
                value={Math.min((displayStats.recent_activity / 50) * 100, 100)}
                sx={{
                  mb: 2,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: "var(--bg-tertiary)",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "var(--neon-purple)",
                    borderRadius: 4,
                    boxShadow: "0 0 10px rgba(168, 85, 247, 0.4)",
                  },
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: "var(--text-tertiary)",
                }}
              >
                Keep up the great work!
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dashboard Tabs */}
      <Card
        className="dark-card"
        sx={{
          mb: 4,
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-primary)",
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            borderBottom: "1px solid var(--border-primary)",
            background: "var(--bg-tertiary)",
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            centered
            sx={{
              "& .MuiTab-root": {
                color: "var(--text-secondary)",
                fontWeight: 500,
                textTransform: "none",
                fontSize: "1rem",
                minHeight: 64,
                "&.Mui-selected": {
                  color: "var(--neon-blue)",
                },
                "&:hover": {
                  color: "var(--neon-cyan)",
                  backgroundColor: "rgba(0, 212, 255, 0.05)",
                },
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "var(--neon-blue)",
                height: 3,
                borderRadius: "3px 3px 0 0",
                boxShadow: "var(--glow-blue)",
              },
            }}
          >
            <Tab
              icon={<History />}
              label="Recent Verifications"
              iconPosition="start"
            />
            <Tab
              icon={<School />}
              label="Learning Progress"
              iconPosition="start"
            />
            <Tab
              icon={<Security />}
              label="Quick Actions"
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* Recent Verifications Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ p: 3 }}>
            {displayVerifications.length > 0 ? (
              <TableContainer
                sx={{
                  backgroundColor: "var(--bg-tertiary)",
                  borderRadius: "12px",
                  border: "1px solid var(--border-primary)",
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "var(--bg-secondary)" }}>
                      <TableCell
                        sx={{ color: "var(--text-primary)", fontWeight: 600 }}
                      >
                        Content
                      </TableCell>
                      <TableCell
                        sx={{ color: "var(--text-primary)", fontWeight: 600 }}
                      >
                        Type
                      </TableCell>
                      <TableCell
                        sx={{ color: "var(--text-primary)", fontWeight: 600 }}
                      >
                        Result
                      </TableCell>
                      <TableCell
                        sx={{ color: "var(--text-primary)", fontWeight: 600 }}
                      >
                        Confidence
                      </TableCell>
                      <TableCell
                        sx={{ color: "var(--text-primary)", fontWeight: 600 }}
                      >
                        Date
                      </TableCell>
                      <TableCell
                        sx={{ color: "var(--text-primary)", fontWeight: 600 }}
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {displayVerifications.map((verification) => (
                      <TableRow
                        key={verification.id}
                        sx={{
                          "&:hover": {
                            backgroundColor: "rgba(0, 212, 255, 0.05)",
                          },
                        }}
                      >
                        <TableCell>
                          <Typography
                            variant="body2"
                            noWrap
                            sx={{
                              maxWidth: 200,
                              color: "var(--text-primary)",
                            }}
                          >
                            {verification.original_content}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={
                              verification.content_type === "text" ? (
                                <Article />
                              ) : verification.content_type === "image" ? (
                                <ImageIcon />
                              ) : (
                                <LinkIcon />
                              )
                            }
                            label={verification.content_type}
                            size="small"
                            sx={{
                              backgroundColor: "var(--bg-secondary)",
                              color: "var(--text-primary)",
                              border: "1px solid var(--border-primary)",
                              "&:hover": {
                                backgroundColor: "var(--bg-elevated)",
                              },
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={getCredibilityLabel(
                              verification.analysis_summary
                                ?.credibility_score || 0
                            )}
                            size="small"
                            sx={{
                              backgroundColor:
                                getCredibilityColor(
                                  verification.analysis_summary
                                    ?.credibility_score || 0
                                ) === "success"
                                  ? "rgba(0, 255, 136, 0.2)"
                                  : getCredibilityColor(
                                      verification.analysis_summary
                                        ?.credibility_score || 0
                                    ) === "warning"
                                  ? "rgba(255, 136, 0, 0.2)"
                                  : "rgba(255, 68, 68, 0.2)",
                              color:
                                getCredibilityColor(
                                  verification.analysis_summary
                                    ?.credibility_score || 0
                                ) === "success"
                                  ? "var(--status-verified)"
                                  : getCredibilityColor(
                                      verification.analysis_summary
                                        ?.credibility_score || 0
                                    ) === "warning"
                                  ? "var(--status-questionable)"
                                  : "var(--status-false)",
                              border:
                                "1px solid " +
                                (getCredibilityColor(
                                  verification.analysis_summary
                                    ?.credibility_score || 0
                                ) === "success"
                                  ? "var(--status-verified)"
                                  : getCredibilityColor(
                                      verification.analysis_summary
                                        ?.credibility_score || 0
                                    ) === "warning"
                                  ? "var(--status-questionable)"
                                  : "var(--status-false)"),
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{ color: "var(--text-primary)" }}
                          >
                            {Math.round(
                              (verification.confidence_score || 0) * 100
                            )}
                            %
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{ color: "var(--text-secondary)" }}
                          >
                            {formatDate(verification.timestamp)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Share verification">
                            <IconButton
                              size="small"
                              sx={{
                                color: "var(--neon-blue)",
                                "&:hover": {
                                  backgroundColor: "rgba(0, 212, 255, 0.1)",
                                },
                              }}
                            >
                              <Share />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Alert
                severity="info"
                sx={{
                  backgroundColor: "rgba(0, 212, 255, 0.1)",
                  border: "1px solid rgba(0, 212, 255, 0.3)",
                  color: "var(--text-primary)",
                  "& .MuiAlert-icon": {
                    color: "var(--neon-blue)",
                  },
                }}
              >
                No verifications yet. Start by verifying some content to see
                your history here!
              </Alert>
            )}
            <Box mt={3}>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={() => refetchHistory()}
                className="btn-neon-outline"
                sx={{
                  color: "var(--neon-blue)",
                  borderColor: "var(--neon-blue)",
                  "&:hover": {
                    backgroundColor: "rgba(0, 212, 255, 0.1)",
                    borderColor: "var(--neon-cyan)",
                    color: "var(--neon-cyan)",
                  },
                }}
              >
                Refresh History
              </Button>
            </Box>
          </Box>
        </TabPanel>

        {/* Learning Progress Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {educationModules.slice(0, 6).map((module, index) => {
                const progress = userProgress[module.id] || {
                  status: "not_started",
                  score: 0,
                };

                // In demo mode, show some completed modules
                const demoProgress =
                  demoMode && index < 2
                    ? {
                        status: "completed",
                        score: 85 + index * 5,
                      }
                    : progress;

                const finalProgress = demoProgress;
                return (
                  <Grid item xs={12} md={6} key={module.id}>
                    <Card
                      className="dark-card"
                      sx={{
                        background: "var(--bg-tertiary)",
                        border: "1px solid var(--border-primary)",
                        borderRadius: "12px",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          borderColor: "var(--neon-cyan)",
                          boxShadow: "0 0 20px rgba(0, 255, 255, 0.2)",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Typography
                          variant="h6"
                          gutterBottom
                          sx={{
                            color: "var(--text-primary)",
                            fontWeight: 600,
                          }}
                        >
                          {module.title ||
                            `Module ${index + 1}: Digital Literacy`}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "var(--text-secondary)",
                            mb: 3,
                          }}
                        >
                          {module.description ||
                            "Learn to identify misinformation and verify content"}
                        </Typography>
                        <Box display="flex" alignItems="center" mb={2}>
                          <LinearProgress
                            variant="determinate"
                            value={
                              finalProgress.status === "completed"
                                ? 100
                                : finalProgress.status === "in_progress"
                                ? 50
                                : 0
                            }
                            sx={{
                              flexGrow: 1,
                              mr: 2,
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: "var(--bg-secondary)",
                              "& .MuiLinearProgress-bar": {
                                backgroundColor:
                                  finalProgress.status === "completed"
                                    ? "var(--status-verified)"
                                    : finalProgress.status === "in_progress"
                                    ? "var(--status-questionable)"
                                    : "var(--border-primary)",
                                borderRadius: 4,
                                boxShadow:
                                  finalProgress.status === "completed"
                                    ? "var(--glow-green)"
                                    : finalProgress.status === "in_progress"
                                    ? "var(--glow-orange)"
                                    : "none",
                              },
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              color: "var(--neon-cyan)",
                              fontWeight: 600,
                            }}
                          >
                            {finalProgress.status === "completed"
                              ? "100%"
                              : finalProgress.status === "in_progress"
                              ? "50%"
                              : "0%"}
                          </Typography>
                        </Box>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          mb={2}
                        >
                          <Chip
                            label={
                              finalProgress.status === "completed"
                                ? "Completed"
                                : finalProgress.status === "in_progress"
                                ? "In Progress"
                                : "Not Started"
                            }
                            size="small"
                            sx={{
                              backgroundColor:
                                finalProgress.status === "completed"
                                  ? "rgba(0, 255, 136, 0.2)"
                                  : finalProgress.status === "in_progress"
                                  ? "rgba(255, 136, 0, 0.2)"
                                  : "rgba(128, 128, 128, 0.2)",
                              color:
                                finalProgress.status === "completed"
                                  ? "var(--status-verified)"
                                  : finalProgress.status === "in_progress"
                                  ? "var(--status-questionable)"
                                  : "var(--text-tertiary)",
                              border:
                                "1px solid " +
                                (finalProgress.status === "completed"
                                  ? "var(--status-verified)"
                                  : finalProgress.status === "in_progress"
                                  ? "var(--status-questionable)"
                                  : "var(--border-primary)"),
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              color: "var(--text-secondary)",
                            }}
                          >
                            Score: {Math.round(finalProgress.score || 0)}/100
                          </Typography>
                        </Box>
                      </CardContent>
                      <CardActions sx={{ p: 3, pt: 0 }}>
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => (window.location.href = "/learn")}
                          className="btn-neon-primary"
                          sx={{
                            background:
                              "linear-gradient(135deg, var(--neon-blue), var(--neon-cyan))",
                            color: "var(--bg-primary)",
                            fontWeight: 600,
                            "&:hover": {
                              background:
                                "linear-gradient(135deg, var(--neon-cyan), var(--neon-blue))",
                              boxShadow: "var(--glow-blue)",
                              transform: "translateY(-1px)",
                            },
                          }}
                        >
                          {finalProgress.status === "completed"
                            ? "Review"
                            : finalProgress.status === "in_progress"
                            ? "Continue"
                            : "Start"}
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        </TabPanel>

        {/* Quick Actions Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <Card
                  className="dark-card"
                  sx={{
                    background: "var(--bg-tertiary)",
                    border: "1px solid var(--border-primary)",
                    borderRadius: "12px",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      borderColor: "var(--neon-blue)",
                      boxShadow: "var(--glow-blue)",
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box textAlign="center">
                      <Security
                        sx={{
                          color: "var(--neon-blue)",
                          fontSize: 48,
                          mb: 2,
                          filter: "drop-shadow(var(--glow-blue))",
                        }}
                      />
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                          color: "var(--text-primary)",
                          fontWeight: 600,
                        }}
                      >
                        Verify Text Content
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "var(--text-secondary)",
                          mb: 3,
                        }}
                      >
                        Analyze text messages, articles, and social media posts
                      </Typography>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => (window.location.href = "/verify")}
                        className="btn-neon-primary"
                        sx={{
                          background:
                            "linear-gradient(135deg, var(--neon-blue), var(--neon-cyan))",
                          color: "var(--bg-primary)",
                          fontWeight: 600,
                          "&:hover": {
                            background:
                              "linear-gradient(135deg, var(--neon-cyan), var(--neon-blue))",
                            boxShadow: "var(--glow-blue)",
                            transform: "translateY(-1px)",
                          },
                        }}
                      >
                        Start Verification
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Card
                  className="dark-card"
                  sx={{
                    background: "var(--bg-tertiary)",
                    border: "1px solid var(--border-primary)",
                    borderRadius: "12px",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      borderColor: "var(--status-verified)",
                      boxShadow: "var(--glow-green)",
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box textAlign="center">
                      <School
                        sx={{
                          color: "var(--status-verified)",
                          fontSize: 48,
                          mb: 2,
                          filter: "drop-shadow(var(--glow-green))",
                        }}
                      />
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                          color: "var(--text-primary)",
                          fontWeight: 600,
                        }}
                      >
                        Learning Modules
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "var(--text-secondary)",
                          mb: 3,
                        }}
                      >
                        Improve your digital literacy and fact-checking skills
                      </Typography>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => (window.location.href = "/learn")}
                        className="btn-neon-success"
                        sx={{
                          background:
                            "linear-gradient(135deg, var(--status-verified), #33ff99)",
                          color: "var(--bg-primary)",
                          fontWeight: 600,
                          "&:hover": {
                            background:
                              "linear-gradient(135deg, #33ff99, var(--status-verified))",
                            boxShadow: "var(--glow-green)",
                            transform: "translateY(-1px)",
                          },
                        }}
                      >
                        Continue Learning
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Card
                  className="dark-card"
                  sx={{
                    background: "var(--bg-tertiary)",
                    border: "1px solid var(--border-primary)",
                    borderRadius: "12px",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      borderColor: "var(--neon-purple)",
                      boxShadow: "0 0 20px rgba(168, 85, 247, 0.4)",
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box textAlign="center">
                      <History
                        sx={{
                          color: "var(--neon-purple)",
                          fontSize: 48,
                          mb: 2,
                          filter:
                            "drop-shadow(0 0 10px rgba(168, 85, 247, 0.4))",
                        }}
                      />
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                          color: "var(--text-primary)",
                          fontWeight: 600,
                        }}
                      >
                        View Full History
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "var(--text-secondary)",
                          mb: 3,
                        }}
                      >
                        See all your past verifications and analysis
                      </Typography>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => (window.location.href = "/history")}
                        sx={{
                          background:
                            "linear-gradient(135deg, var(--neon-purple), #8a2be2)",
                          color: "var(--text-primary)",
                          fontWeight: 600,
                          "&:hover": {
                            background:
                              "linear-gradient(135deg, #8a2be2, var(--neon-purple))",
                            boxShadow: "0 0 20px rgba(168, 85, 247, 0.4)",
                            transform: "translateY(-1px)",
                          },
                        }}
                      >
                        View History
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>
      </Card>
    </Container>
  );
};

export default DashboardPage;
