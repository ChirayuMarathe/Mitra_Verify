import React, { useState, useRef } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Paper,
  Chip,
  Alert,
  CircularProgress,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Security,
  Send,
  CheckCircle,
  Warning,
  Error,
  Info,
  ExpandMore,
  Share,
  BookmarkAdd,
  Feedback,
  Photo as ImageIcon,
  Link as LinkIcon,
  Article,
  ContentCopy,
  CloudUpload,
  Analytics as Analysis,
  Psychology,
  Gavel,
  Source,
  Timeline,
  TrendingUp,
  School,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import apiService from "../services/api";
import { useMutation } from "react-query";

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`verify-tabpanel-${index}`}
      aria-labelledby={`verify-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}

const VerifyPage = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [textContent, setTextContent] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [urlContent, setUrlContent] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [language, setLanguage] = useState("auto");
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState("");
  const fileInputRef = useRef(null);

  const verifyMutation = useMutation((data) => apiService.verifyContent(data), {
    onSuccess: (result) => {
      setVerificationResult(result);
      setVerifying(false);
    },
    onError: (error) => {
      console.error("Verification failed:", error);
      setVerifying(false);
      setVerificationResult({
        error: "Verification failed. Please try again.",
        result: "error",
      });
    },
  });

  const analyzeImageMutation = useMutation(
    (imageFile) => apiService.analyzeImage(imageFile),
    {
      onSuccess: (result) => {
        setVerificationResult(result);
        setVerifying(false);
      },
      onError: (error) => {
        console.error("Image analysis failed:", error);
        setVerifying(false);
        setVerificationResult({
          error: "Image analysis failed. Please try again.",
          result: "error",
        });
      },
    }
  );

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setVerificationResult(null);
    setTextContent("");
    setSelectedFile(null);
    setUrlContent("");
  };

  const handleTextVerification = () => {
    if (!textContent.trim()) return;

    setVerifying(true);
    setVerificationResult(null);

    verifyMutation.mutate({
      content: textContent,
      content_type: "text",
      language: language === "auto" ? "auto-detect" : language,
    });
  };

  const handleImageVerification = () => {
    if (!selectedFile) return;

    setVerifying(true);
    setVerificationResult(null);

    analyzeImageMutation.mutate(selectedFile);
  };

  const handleUrlVerification = () => {
    if (!urlContent.trim()) return;

    setVerifying(true);
    setVerificationResult(null);

    verifyMutation.mutate({
      content: urlContent,
      content_type: "url",
      language: language === "auto" ? "auto-detect" : language,
    });
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const getResultColor = (result) => {
    switch (result) {
      case "verified":
        return "success";
      case "likely_true":
        return "success";
      case "uncertain":
        return "warning";
      case "likely_false":
        return "error";
      case "false":
        return "error";
      case "error":
        return "error";
      default:
        return "info";
    }
  };

  const getResultIcon = (result) => {
    switch (result) {
      case "verified":
      case "likely_true":
        return <CheckCircle />;
      case "uncertain":
        return <Warning />;
      case "likely_false":
      case "false":
        return <Error />;
      default:
        return <Info />;
    }
  };

  const getResultText = (result) => {
    switch (result) {
      case "verified":
        return "Verified True";
      case "likely_true":
        return "Likely True";
      case "uncertain":
        return "Uncertain";
      case "likely_false":
        return "Likely False";
      case "false":
        return "False/Misleading";
      default:
        return "Analysis Complete";
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return "success";
    if (confidence >= 0.6) return "warning";
    return "error";
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const handleShare = () => {
    if (navigator.share && verificationResult) {
      navigator.share({
        title: "MitraVerify Analysis Result",
        text: `Content verified with ${Math.round(
          (verificationResult.confidence_score || 0) * 100
        )}% confidence`,
        url: window.location.href,
      });
    }
  };

  const submitFeedback = () => {
    // In a real app, you'd submit this to your API
    console.log("Feedback submitted:", {
      rating: userRating,
      comment: userComment,
    });
    setFeedbackOpen(false);
    setUserRating(0);
    setUserComment("");
  };

  const sampleTexts = [
    "Breaking: Government announces new policy that will shock everyone!",
    "Scientists discover miracle cure that doctors don't want you to know about",
    "The Reserve Bank of India announced new monetary policy measures to control inflation",
    "WhatsApp will start charging users from next month - Share to save your account",
  ];

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
          Content Verification Center
        </Typography>
        <Typography
          variant="h5"
          sx={{
            color: "var(--text-secondary)",
            mb: 3,
            fontWeight: 400,
          }}
        >
          Analyze text, images, and URLs for misinformation using AI-powered
          tools
        </Typography>
        <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
          <Chip
            icon={<Security />}
            label="AI-Powered Analysis"
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
            icon={<Analysis />}
            label="Real-time Results"
            className="status-badge"
            sx={{
              backgroundColor: "var(--status-verified)",
              color: "var(--text-primary)",
              border: "1px solid var(--status-verified)",
              fontWeight: 500,
              "&:hover": {
                boxShadow: "var(--glow-green)",
                transform: "translateY(-2px)",
              },
            }}
          />
          <Chip
            icon={<School />}
            label="Educational Insights"
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

      {/* Verification Tabs */}
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
            <Tab icon={<Article />} label="Text Content" iconPosition="start" />
            <Tab icon={<ImageIcon />} label="Images" iconPosition="start" />
            <Tab
              icon={<LinkIcon />}
              label="URLs & Links"
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* Text Verification Tab */}
        <TabPanel value={tabValue} index={0}>
          <CardContent sx={{ p: 4 }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  multiline
                  rows={8}
                  label="Enter text content to verify"
                  placeholder="Paste the text message, article, or social media post you want to verify..."
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  variant="outlined"
                  sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "var(--bg-tertiary)",
                      borderRadius: "12px",
                      border: "2px solid var(--border-primary)",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      "& fieldset": { border: "none" },
                      "&:hover": {
                        borderColor: "var(--neon-blue)",
                        boxShadow: "var(--glow-blue)",
                      },
                      "&.Mui-focused": {
                        borderColor: "var(--neon-blue)",
                        boxShadow: "var(--glow-blue)",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "var(--text-secondary)",
                      "&.Mui-focused": {
                        color: "var(--neon-blue)",
                      },
                    },
                    "& textarea": {
                      color: "var(--text-primary)",
                      "&::placeholder": {
                        color: "var(--text-tertiary)",
                      },
                    },
                  }}
                />

                <Box display="flex" gap={2} alignItems="center" mb={3}>
                  <FormControl sx={{ minWidth: 140 }}>
                    <InputLabel sx={{ color: "var(--text-secondary)" }}>
                      Language
                    </InputLabel>
                    <Select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      label="Language"
                      sx={{
                        backgroundColor: "var(--bg-tertiary)",
                        borderRadius: "8px",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "var(--border-primary)",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "var(--neon-blue)",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "var(--neon-blue)",
                        },
                        "& .MuiSelect-select": {
                          color: "var(--text-primary)",
                        },
                      }}
                    >
                      <MenuItem value="auto">Auto-detect</MenuItem>
                      <MenuItem value="en">English</MenuItem>
                      <MenuItem value="hi">Hindi</MenuItem>
                      <MenuItem value="bn">Bengali</MenuItem>
                      <MenuItem value="ta">Tamil</MenuItem>
                      <MenuItem value="te">Telugu</MenuItem>
                    </Select>
                  </FormControl>

                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<Security />}
                    onClick={handleTextVerification}
                    disabled={!textContent.trim() || verifying}
                    className="btn-neon btn-neon-primary"
                    sx={{
                      ml: "auto",
                      minWidth: 200,
                      height: 48,
                      fontSize: "1rem",
                      fontWeight: 600,
                    }}
                  >
                    {verifying ? "Analyzing..." : "Verify Content"}
                  </Button>
                </Box>

                {verifying && (
                  <Box
                    mb={3}
                    className="glass-card"
                    sx={{ p: 3, borderRadius: "12px" }}
                  >
                    <LinearProgress
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: "var(--bg-tertiary)",
                        "& .MuiLinearProgress-bar": {
                          background: `linear-gradient(90deg, var(--neon-blue), var(--neon-cyan))`,
                          borderRadius: 4,
                        },
                      }}
                    />
                    <Typography
                      variant="body2"
                      textAlign="center"
                      mt={2}
                      sx={{ color: "var(--text-secondary)" }}
                    >
                      Analyzing content using AI models...
                    </Typography>
                  </Box>
                )}
              </Grid>

              <Grid item xs={12} md={4}>
                <Paper
                  className="dark-card"
                  sx={{
                    p: 3,
                    background: "var(--bg-tertiary)",
                    border: "1px solid var(--border-primary)",
                    borderRadius: "12px",
                  }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ color: "var(--text-primary)" }}
                  >
                    Try Sample Texts
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "var(--text-secondary)", mb: 2 }}
                  >
                    Click on any sample to test our verification system:
                  </Typography>
                  {sampleTexts.map((sample, index) => (
                    <Button
                      key={index}
                      variant="outlined"
                      fullWidth
                      className="btn-neon-outline"
                      sx={{
                        mb: 1,
                        textAlign: "left",
                        justifyContent: "flex-start",
                        height: "auto",
                        py: 1.5,
                        borderColor: "var(--border-primary)",
                        color: "var(--text-secondary)",
                        "&:hover": {
                          borderColor: "var(--neon-blue)",
                          backgroundColor: "rgba(0, 212, 255, 0.05)",
                          color: "var(--neon-blue)",
                        },
                      }}
                      onClick={() => setTextContent(sample)}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {sample.substring(0, 50)}...
                      </Typography>
                    </Button>
                  ))}
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </TabPanel>

        {/* Image Verification Tab */}
        <TabPanel value={tabValue} index={1}>
          <CardContent sx={{ p: 4 }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <Paper
                  className="glass-card"
                  sx={{
                    p: 4,
                    textAlign: "center",
                    border: "2px dashed var(--border-primary)",
                    borderRadius: "16px",
                    cursor: "pointer",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    background: "var(--bg-tertiary)",
                    "&:hover": {
                      borderColor: "var(--neon-blue)",
                      boxShadow: "var(--glow-blue)",
                      transform: "translateY(-4px)",
                    },
                  }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <CloudUpload
                    sx={{
                      fontSize: 48,
                      color: "var(--text-secondary)",
                      mb: 2,
                      transition: "color 0.3s ease",
                    }}
                  />
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ color: "var(--text-primary)" }}
                  >
                    Upload Image for Analysis
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "var(--text-secondary)", mb: 2 }}
                  >
                    Drag and drop an image here, or click to select a file
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "var(--text-tertiary)" }}
                  >
                    Supported formats: JPG, PNG, GIF, WebP (Max 10MB)
                  </Typography>

                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    accept="image/*"
                    onChange={handleFileSelect}
                  />
                </Paper>

                {selectedFile && (
                  <Box mt={3}>
                    <Alert
                      severity="info"
                      sx={{
                        mb: 2,
                        backgroundColor: "rgba(0, 212, 255, 0.1)",
                        border: "1px solid rgba(0, 212, 255, 0.2)",
                        color: "var(--text-primary)",
                        "& .MuiAlert-icon": {
                          color: "var(--neon-blue)",
                        },
                      }}
                    >
                      <Typography variant="body2">
                        Selected: {selectedFile.name} (
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                      </Typography>
                    </Alert>

                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<Analysis />}
                      onClick={handleImageVerification}
                      disabled={verifying}
                      className="btn-neon btn-neon-primary"
                      fullWidth
                      sx={{ height: 48, fontSize: "1rem", fontWeight: 600 }}
                    >
                      {verifying ? "Analyzing Image..." : "Analyze Image"}
                    </Button>
                  </Box>
                )}

                {verifying && (
                  <Box
                    mt={3}
                    className="glass-card"
                    sx={{ p: 3, borderRadius: "12px" }}
                  >
                    <LinearProgress
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: "var(--bg-tertiary)",
                        "& .MuiLinearProgress-bar": {
                          background: `linear-gradient(90deg, var(--neon-blue), var(--neon-cyan))`,
                          borderRadius: 4,
                        },
                      }}
                    />
                    <Typography
                      variant="body2"
                      textAlign="center"
                      mt={2}
                      sx={{ color: "var(--text-secondary)" }}
                    >
                      Analyzing image for manipulation, extracting text,
                      checking metadata...
                    </Typography>
                  </Box>
                )}
              </Grid>

              <Grid item xs={12} md={4}>
                <Paper
                  className="dark-card"
                  sx={{
                    p: 3,
                    background: "var(--bg-tertiary)",
                    border: "1px solid var(--border-primary)",
                    borderRadius: "12px",
                  }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ color: "var(--text-primary)" }}
                  >
                    Image Analysis Features
                  </Typography>
                  <List dense>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Security sx={{ color: "var(--neon-blue)" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Manipulation Detection"
                        secondary="Identify edited or doctored images"
                        sx={{
                          "& .MuiListItemText-primary": {
                            color: "var(--text-primary)",
                            fontWeight: 500,
                          },
                          "& .MuiListItemText-secondary": {
                            color: "var(--text-secondary)",
                          },
                        }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Article sx={{ color: "var(--neon-green)" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Text Extraction"
                        secondary="Extract and verify text within images"
                        sx={{
                          "& .MuiListItemText-primary": {
                            color: "var(--text-primary)",
                            fontWeight: 500,
                          },
                          "& .MuiListItemText-secondary": {
                            color: "var(--text-secondary)",
                          },
                        }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Source sx={{ color: "var(--neon-cyan)" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Reverse Search"
                        secondary="Find original sources and contexts"
                        sx={{
                          "& .MuiListItemText-primary": {
                            color: "var(--text-primary)",
                            fontWeight: 500,
                          },
                          "& .MuiListItemText-secondary": {
                            color: "var(--text-secondary)",
                          },
                        }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Info sx={{ color: "var(--neon-purple)" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Metadata Analysis"
                        secondary="Check creation date, location, device"
                        sx={{
                          "& .MuiListItemText-primary": {
                            color: "var(--text-primary)",
                            fontWeight: 500,
                          },
                          "& .MuiListItemText-secondary": {
                            color: "var(--text-secondary)",
                          },
                        }}
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </TabPanel>

        {/* URL Verification Tab */}
        <TabPanel value={tabValue} index={2}>
          <CardContent sx={{ p: 4 }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  label="Enter URL to verify"
                  placeholder="https://example.com/article-to-verify"
                  value={urlContent}
                  onChange={(e) => setUrlContent(e.target.value)}
                  variant="outlined"
                  sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "var(--bg-tertiary)",
                      borderRadius: "12px",
                      border: "2px solid var(--border-primary)",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      "& fieldset": { border: "none" },
                      "&:hover": {
                        borderColor: "var(--neon-blue)",
                        boxShadow: "var(--glow-blue)",
                      },
                      "&.Mui-focused": {
                        borderColor: "var(--neon-blue)",
                        boxShadow: "var(--glow-blue)",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "var(--text-secondary)",
                      "&.Mui-focused": {
                        color: "var(--neon-blue)",
                      },
                    },
                    "& input": {
                      color: "var(--text-primary)",
                      "&::placeholder": {
                        color: "var(--text-tertiary)",
                      },
                    },
                  }}
                />

                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Security />}
                  onClick={handleUrlVerification}
                  disabled={!urlContent.trim() || verifying}
                  className="btn-neon btn-neon-primary"
                  fullWidth
                  sx={{ height: 48, fontSize: "1rem", fontWeight: 600 }}
                >
                  {verifying ? "Analyzing URL..." : "Verify URL"}
                </Button>

                {verifying && (
                  <Box
                    mt={3}
                    className="glass-card"
                    sx={{ p: 3, borderRadius: "12px" }}
                  >
                    <LinearProgress
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: "var(--bg-tertiary)",
                        "& .MuiLinearProgress-bar": {
                          background: `linear-gradient(90deg, var(--neon-blue), var(--neon-cyan))`,
                          borderRadius: 4,
                        },
                      }}
                    />
                    <Typography
                      variant="body2"
                      textAlign="center"
                      mt={2}
                      sx={{ color: "var(--text-secondary)" }}
                    >
                      Fetching content, analyzing domain reputation, checking
                      sources...
                    </Typography>
                  </Box>
                )}
              </Grid>

              <Grid item xs={12} md={4}>
                <Paper
                  className="dark-card"
                  sx={{
                    p: 3,
                    background: "var(--bg-tertiary)",
                    border: "1px solid var(--border-primary)",
                    borderRadius: "12px",
                  }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ color: "var(--text-primary)" }}
                  >
                    URL Analysis Features
                  </Typography>
                  <List dense>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Source sx={{ color: "var(--neon-blue)" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Domain Reputation"
                        secondary="Check credibility of the website"
                        sx={{
                          "& .MuiListItemText-primary": {
                            color: "var(--text-primary)",
                            fontWeight: 500,
                          },
                          "& .MuiListItemText-secondary": {
                            color: "var(--text-secondary)",
                          },
                        }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Article sx={{ color: "var(--neon-green)" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Content Analysis"
                        secondary="Analyze the article or page content"
                        sx={{
                          "& .MuiListItemText-primary": {
                            color: "var(--text-primary)",
                            fontWeight: 500,
                          },
                          "& .MuiListItemText-secondary": {
                            color: "var(--text-secondary)",
                          },
                        }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Timeline sx={{ color: "var(--neon-cyan)" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Source Tracking"
                        secondary="Trace original sources and references"
                        sx={{
                          "& .MuiListItemText-primary": {
                            color: "var(--text-primary)",
                            fontWeight: 500,
                          },
                          "& .MuiListItemText-secondary": {
                            color: "var(--text-secondary)",
                          },
                        }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Security
                          sx={{ color: "var(--status-questionable)" }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary="Safety Check"
                        secondary="Identify malicious or phishing sites"
                        sx={{
                          "& .MuiListItemText-primary": {
                            color: "var(--text-primary)",
                            fontWeight: 500,
                          },
                          "& .MuiListItemText-secondary": {
                            color: "var(--text-secondary)",
                          },
                        }}
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </TabPanel>
      </Card>

      {/* Verification Results */}
      {verificationResult && !verificationResult.error && (
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
          <CardContent sx={{ p: 4 }}>
            <Box display="flex" alignItems="center" mb={4}>
              <Avatar
                sx={{
                  bgcolor:
                    getResultColor(verificationResult.result) === "success"
                      ? "var(--status-verified)"
                      : getResultColor(verificationResult.result) === "warning"
                      ? "var(--status-questionable)"
                      : getResultColor(verificationResult.result) === "error"
                      ? "var(--status-false)"
                      : "var(--status-processing)",
                  mr: 3,
                  width: 64,
                  height: 64,
                  boxShadow:
                    getResultColor(verificationResult.result) === "success"
                      ? "var(--glow-green)"
                      : getResultColor(verificationResult.result) === "warning"
                      ? "var(--glow-orange)"
                      : getResultColor(verificationResult.result) === "error"
                      ? "var(--glow-red)"
                      : "var(--glow-blue)",
                }}
              >
                {getResultIcon(verificationResult.result)}
              </Avatar>
              <Box>
                <Typography
                  variant="h4"
                  gutterBottom
                  sx={{
                    color: "var(--text-primary)",
                    fontWeight: 600,
                  }}
                >
                  {getResultText(verificationResult.result)}
                </Typography>
                <Box display="flex" alignItems="center" gap={2}>
                  <Typography
                    variant="h6"
                    sx={{ color: "var(--text-secondary)" }}
                  >
                    Confidence:{" "}
                    {Math.round(
                      (verificationResult.confidence_score || 0) * 100
                    )}
                    %
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(verificationResult.confidence_score || 0) * 100}
                    sx={{
                      width: 200,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: "var(--bg-tertiary)",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor:
                          getConfidenceColor(
                            verificationResult.confidence_score || 0
                          ) === "success"
                            ? "var(--status-verified)"
                            : getConfidenceColor(
                                verificationResult.confidence_score || 0
                              ) === "warning"
                            ? "var(--status-questionable)"
                            : "var(--status-false)",
                        borderRadius: 4,
                      },
                    }}
                  />
                </Box>
              </Box>
              <Box ml="auto" display="flex" gap={1}>
                <Tooltip title="Copy Results">
                  <IconButton
                    onClick={() =>
                      copyToClipboard(
                        JSON.stringify(verificationResult, null, 2)
                      )
                    }
                    sx={{
                      color: "var(--text-secondary)",
                      "&:hover": {
                        color: "var(--neon-blue)",
                        backgroundColor: "rgba(0, 212, 255, 0.1)",
                      },
                    }}
                  >
                    <ContentCopy />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Share">
                  <IconButton
                    onClick={handleShare}
                    sx={{
                      color: "var(--text-secondary)",
                      "&:hover": {
                        color: "var(--neon-green)",
                        backgroundColor: "rgba(0, 255, 136, 0.1)",
                      },
                    }}
                  >
                    <Share />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Provide Feedback">
                  <IconButton
                    onClick={() => setFeedbackOpen(true)}
                    sx={{
                      color: "var(--text-secondary)",
                      "&:hover": {
                        color: "var(--neon-cyan)",
                        backgroundColor: "rgba(0, 255, 255, 0.1)",
                      },
                    }}
                  >
                    <Feedback />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            {/* Processing Time */}
            <Box textAlign="center" mt={4}>
              <Typography
                variant="caption"
                sx={{ color: "var(--text-tertiary)" }}
              >
                Analysis completed in{" "}
                {verificationResult.processing_time || 0.5} seconds •
                Verification ID: {verificationResult.verification_id || "N/A"}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {verificationResult?.error && (
        <Alert
          severity="error"
          sx={{
            mb: 4,
            backgroundColor: "rgba(255, 68, 68, 0.1)",
            border: "1px solid rgba(255, 68, 68, 0.2)",
            color: "var(--text-primary)",
            borderRadius: "12px",
            "& .MuiAlert-icon": {
              color: "var(--status-false)",
            },
          }}
        >
          <Typography variant="h6" gutterBottom>
            Verification Failed
          </Typography>
          <Typography>{verificationResult.error}</Typography>
        </Alert>
      )}

      {/* Tips Section */}
      <Card
        className="dark-card"
        sx={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-primary)",
          borderRadius: "16px",
        }}
      >
        <CardContent sx={{ p: 4 }}>
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
            Verification Tips
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box textAlign="center" className="slide-up">
                <Psychology
                  sx={{
                    fontSize: 48,
                    color: "var(--neon-blue)",
                    mb: 2,
                    filter: "drop-shadow(var(--glow-blue))",
                  }}
                />
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ color: "var(--text-primary)", fontWeight: 600 }}
                >
                  Think Critically
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "var(--text-secondary)", lineHeight: 1.6 }}
                >
                  Question emotional appeals and sensational claims. Ask
                  yourself: "Does this seem too good/bad to be true?"
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box textAlign="center" className="slide-up">
                <Source
                  sx={{
                    fontSize: 48,
                    color: "var(--neon-green)",
                    mb: 2,
                    filter: "drop-shadow(var(--glow-green))",
                  }}
                />
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ color: "var(--text-primary)", fontWeight: 600 }}
                >
                  Check Sources
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "var(--text-secondary)", lineHeight: 1.6 }}
                >
                  Verify the credibility of sources. Look for author
                  information, publication date, and references to original
                  research.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box textAlign="center" className="slide-up">
                <TrendingUp
                  sx={{
                    fontSize: 48,
                    color: "var(--status-questionable)",
                    mb: 2,
                    filter: "drop-shadow(var(--glow-orange))",
                  }}
                />
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ color: "var(--text-primary)", fontWeight: 600 }}
                >
                  Cross-Reference
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "var(--text-secondary)", lineHeight: 1.6 }}
                >
                  Check multiple reliable sources. If only one source reports
                  it, be skeptical until confirmed elsewhere.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Feedback Dialog */}
      <Dialog
        open={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid var(--border-primary)",
            borderRadius: "16px",
          },
        }}
      >
        <DialogTitle sx={{ color: "var(--text-primary)" }}>
          Provide Feedback
        </DialogTitle>
        <DialogContent>
          <Typography
            variant="body1"
            gutterBottom
            sx={{ color: "var(--text-secondary)" }}
          >
            How accurate do you think this analysis was?
          </Typography>
          <Box display="flex" alignItems="center" mb={3}>
            <Typography
              variant="body2"
              sx={{ mr: 2, color: "var(--text-secondary)" }}
            >
              Rating:
            </Typography>
            <Rating
              value={userRating}
              onChange={(event, newValue) => setUserRating(newValue)}
              sx={{
                "& .MuiRating-iconFilled": {
                  color: "var(--neon-blue)",
                },
                "& .MuiRating-iconEmpty": {
                  color: "var(--text-tertiary)",
                },
              }}
            />
          </Box>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Additional Comments (optional)"
            value={userComment}
            onChange={(e) => setUserComment(e.target.value)}
            placeholder="Tell us how we can improve our analysis..."
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "var(--bg-tertiary)",
                borderRadius: "8px",
                "& fieldset": {
                  borderColor: "var(--border-primary)",
                },
                "&:hover fieldset": {
                  borderColor: "var(--neon-blue)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "var(--neon-blue)",
                },
              },
              "& .MuiInputLabel-root": {
                color: "var(--text-secondary)",
                "&.Mui-focused": {
                  color: "var(--neon-blue)",
                },
              },
              "& textarea": {
                color: "var(--text-primary)",
                "&::placeholder": {
                  color: "var(--text-tertiary)",
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setFeedbackOpen(false)}
            sx={{ color: "var(--text-secondary)" }}
          >
            Cancel
          </Button>
          <Button
            onClick={submitFeedback}
            variant="contained"
            className="btn-neon btn-neon-primary"
          >
            Submit Feedback
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default VerifyPage;
