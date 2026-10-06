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
  Email as EmailIcon,
  AlternateEmail,
  AttachFile,
  MarkEmailRead,
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
  const [emailSubject, setEmailSubject] = useState("");
  const [emailSender, setEmailSender] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [urlContent, setUrlContent] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [language, setLanguage] = useState("hi");
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
    setEmailSubject("");
    setEmailSender("");
    setEmailBody("");
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

  const handleEmailVerification = () => {
    if (!emailSubject.trim() && !emailBody.trim()) return;

    setVerifying(true);
    setVerificationResult(null);

    const fullContent = `विषय: ${emailSubject}\nप्रेषक: ${emailSender}\n\n${emailBody}`.trim();
    verifyMutation.mutate({
      subject: emailSubject,
      sender: emailSender,
      body: emailBody,
      content: fullContent,
      content_type: "email",
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
      case "likely_true":
        return "success";
      case "questionable":
      case "uncertain":
        return "warning";
      case "likely_false":
      case "false":
      case "spam":
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
      case "questionable":
      case "uncertain":
        return <Warning />;
      case "likely_false":
      case "false":
      case "spam":
        return <Error />;
      default:
        return <Info />;
    }
  };

  const getResultText = (result) => {
    switch (result) {
      case "verified":
        return "Verified Legitimate & Safe";
      case "likely_true":
        return "Likely Authentic";
      case "questionable":
      case "uncertain":
        return "Suspicious / Unverified Content";
      case "likely_false":
        return "Likely Deceptive";
      case "false":
      case "spam":
        return "Phishing / Spam Detected";
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
    console.log("Feedback submitted:", {
      rating: userRating,
      comment: userComment,
    });
    setFeedbackOpen(false);
    setUserRating(0);
    setUserComment("");
  };

  const sampleCases = [
    {
      title: "KBC ₹25 Lakh Lottery Scam",
      tag: "Lottery Fraud",
      isSpam: true,
      text: "बधाई हो! आपने KBC (कौन बनेगा करोड़पति) में 25 लाख रुपये की लॉटरी जीती है। अपनी धनराशि प्राप्त करने के लिए तुरंत इस नंबर +919876543210 पर व्हाट्सएप करें या लिंक पर क्लिक करें।",
    },
    {
      title: "Free 3-Month 5G Recharge Scam",
      tag: "Free Recharge Fraud",
      isSpam: true,
      text: "सभी भारतीय नागरिकों को 3 महीने का 5G फ्री रिचार्ज दिया जा रहा है। ऑफर केवल आज रात 12 बजे तक मान्य है। तुरंत नीचे दिए गए लिंक पर क्लिक करके अपना मोबाइल नंबर दर्ज करें: http://free-5g-recharge.xyz",
    },
    {
      title: "PM Free Laptop Yojana Scam",
      tag: "Fake Govt Scheme",
      isSpam: true,
      text: "प्रधानमंत्री फ्री लैपटॉप योजना 2026 के तहत सभी 10वीं और 12वीं पास छात्रों को मुफ्त लैपटॉप बांटे जा रहे हैं। आवेदन करने और सूची में नाम देखने के लिए तुरंत फॉर्म भरें।",
    },
    {
      title: "Electricity Disconnection Threat",
      tag: "Utility Bill Phishing",
      isSpam: true,
      text: "प्रिय उपभोक्ता, आपका पिछला बिजली बिल अपडेट न होने के कारण आज रात 9:30 बजे बिजली काट दी जाएगी। तुरंत हमारे बिजली अधिकारी से संपर्क करें और यह APK फाइल डाउनलोड करें।",
    },
    {
      title: "Miracle Herbal Cure Scam",
      tag: "Fake Medical Claim",
      isSpam: true,
      text: "इस चमत्कारी नुस्खे से केवल 3 दिनों में ब्लड शुगर और डायबिटीज हमेशा के लिए जड़ से खत्म! इसे तुरंत 10 लोगों को शेयर करें।",
    },
    {
      title: "RBI Monetary Policy Repo Rate Notice",
      tag: "Official News (Safe)",
      isSpam: false,
      text: "भारतीय रिजर्व बैंक (RBI) ने मौद्रिक नीति समिति की बैठक में प्रमुख रेपो दर को 6.5 प्रतिशत पर अपरिवर्तित रखने का निर्णय लिया है।",
    },
    {
      title: "IMD Heavy Rain Alert Notice",
      tag: "Official Alert (Safe)",
      isSpam: false,
      text: "मौसम विभाग (IMD) ने तटीय क्षेत्रों में अगले 48 घंटों में भारी बारिश और तेज हवाओं की चेतावनी जारी की है। नागरिकों को सावधानी बरतने की सलाह दी गई है।",
    },
  ];

  const sampleEmailCases = [
    {
      title: "Income Tax Refund Phishing Email",
      tag: "Tax Refund Scam",
      isSpam: true,
      subject: "आयकर विभाग (IT Dept): आपका ₹42,500 का टैक्स रिफंड स्वीकृत",
      sender: "refund-tax@incometax-gov-update.xyz",
      body: "प्रिय करदाता,\n\nआपके वित्तीय वर्ष 2024-25 का आयकर रिफंड स्वीकृत कर दिया गया है। कुल रिफंड राशि: ₹42,500।\nराशि सीधे बैंक खाते में प्राप्त करने के लिए कृपया नीचे दिए गए लिंक पर अपने नेट बैंकिंग क्रेडेंशियल और पैन कार्ड से 24 घंटे के भीतर लॉगिन करें:\nhttp://it-refund-portal.xyz/claim\n\nओटीपी दर्ज करने के 2 घंटे के भीतर रिफंड राशि जमा कर दी जाएगी।",
    },
    {
      title: "SBI NetBanking Block Threat Email",
      tag: "Banking Phishing",
      isSpam: true,
      subject: "तत्काल सूचना: आपका एसबीआई खाता 24 घंटे में ब्लॉक हो जाएगा",
      sender: "security-alerts@sbi-online-update.top",
      body: "प्रिय ग्राहक,\n\nभारतीय स्टेट बैंक (SBI) द्वारा आपका नेट बैंकिंग खाता निष्क्रिय किया जा रहा है क्योंकि आपका पैन कार्ड और ई-केवाईसी अपडेट नहीं है।\nअपने खाते को ब्लॉक होने से बचाने के लिए तुरंत संलग्न सुरक्षा फॉर्म डाउनलोड करें अथवा नीचे दिए गए लिंक पर लॉगिन करके सत्यापन पूरा करें:\nhttp://sbi-kyc-verify.top/login\n\nअनदेखा करने पर आपका डेबिट कार्ड भी बंद कर दिया जाएगा।",
    },
    {
      title: "Google India WFH Job Scam Email",
      tag: "Fake Job Offer",
      isSpam: true,
      subject: "बधाई! गूगल इंडिया में डाटा एंट्री जॉब ऑफर लेटर - मासिक वेतन ₹50,000",
      sender: "hr-careers@google-india-jobs.work",
      body: "प्रिय उम्मीदवार,\n\nआपका चयन गूगल इंडिया में वर्क फ्रॉम होम (घर बैठे काम) डाटा एंट्री ऑपरेटर पद के लिए हो गया है।\nमासिक वेतन: ₹50,000 + लैपटॉप व इंटरनेट भत्ता।\nअपना जॉब ऑफर लेटर डाउनलोड करने और पहचान सत्यापन के लिए केवल ₹999 का पंजीकरण शुल्क तुरंत जमा करें। ऑफर केवल आज रात 12 बजे तक मान्य है।",
    },
    {
      title: "HDFC Pre-Approved Credit Card Phishing",
      tag: "Credit Card Fraud",
      isSpam: true,
      subject: "विशेष ऑफर: प्री-एप्रूव्ड एचडीएफसी क्रेडिट कार्ड ₹5,00,000 लिमिट",
      sender: "card-approval@hdfc-offers.click",
      body: "प्रिय उपभोक्ता,\n\nआपके अच्छे क्रेडिट स्कोर के आधार पर आपको ₹5 लाख की पूर्व-स्वीकृत सीमा वाला लाइफटाइम फ्री क्रेडिट कार्ड दिया जा रहा है।\nकार्ड तुरंत एक्टिवेट करने के लिए लिंक पर क्लिक करके अपना बैंक विवरण और सीवीवी दर्ज करें।",
    },
    {
      title: "Genuine SBI UPI Transaction Alert",
      tag: "Legitimate Alert (Safe)",
      isSpam: false,
      subject: "आपके खाते से ₹1,500 का यूपीआई भुगतान सफल",
      sender: "alerts@sbi.co.in",
      body: "प्रिय ग्राहक,\n\nआपके खाता संख्या XXXXXXXX1234 से ₹1,500.00 का यूपीआई डेबिट सफलतापूर्वक संपन्न हुआ है।\nसंदर्भ संख्या (UTR): 402910482910।\nदिनांक: 06-10-2026 18:24 IST।\nउपलब्ध शेष राशि: ₹18,450.00।\nयदि आपने यह लेन-देन नहीं किया है, तो तुरंत 1800-11-2211 पर कॉल करें।",
    },
    {
      title: "Genuine Income Tax ITR-V Receipt",
      tag: "Official Receipt (Safe)",
      isSpam: false,
      subject: "आयकर विवरणी (ITR) सत्यापन पावती वर्ष 2025-26",
      sender: "donotreply@incometax.gov.in",
      body: "प्रिय करदाता,\n\nनिर्धारण वर्ष 2025-26 के लिए आपकी आयकर विवरणी (ITR-1) सफलतापूर्वक ई-सत्यापित हो गई है।\nस्वीकृति संख्या: 8920192837492।\nआप ई-फाइलिंग पोर्टल पर लॉगिन करके अपनी पावती (ITR-V) डाउनलोड कर सकते हैं।\nयह एक प्रणाली-जनित ईमेल है, इसका उत्तर न दें।",
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box mb={4} textAlign="center" className="fade-in">
        <Chip
          label="AI Threat Intelligence • Hindi & Regional Language Security"
          size="small"
          sx={{
            mb: 2,
            backgroundColor: "rgba(0, 212, 255, 0.08)",
            color: "#38bdf8",
            border: "1px solid rgba(0, 212, 255, 0.25)",
            fontWeight: 600,
            fontSize: "0.8rem",
          }}
        />
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontSize: { xs: "2.3rem", md: "3.25rem" },
            fontWeight: 800,
            letterSpacing: "-0.03em",
            background: `linear-gradient(135deg, #f8fafc 30%, #38bdf8 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 1.5,
          }}
        >
          MitraVerify
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: "var(--text-secondary)",
            mb: 3,
            fontWeight: 400,
            maxWidth: 780,
            mx: "auto",
            fontSize: { xs: "0.95rem", md: "1.1rem" },
            lineHeight: 1.6,
          }}
        >
          Accurate spam, phishing email, and scam verification engine for Hindi, Hinglish, and Indian regional languages powered by first-principles NLP (Devanagari Tokenization, Stopwords Filtering, TF-IDF Vectorization, and Multinomial Naive Bayes).
        </Typography>
        <Box display="flex" justifyContent="center" gap={1.5} flexWrap="wrap">
          <Chip
            icon={<Security sx={{ color: "#00d4ff !important" }} />}
            label="Devanagari & Latin NLP Engine"
            sx={{
              backgroundColor: "rgba(0, 212, 255, 0.1)",
              color: "#f8fafc",
              border: "1px solid rgba(0, 212, 255, 0.2)",
              fontWeight: 500,
            }}
          />
          <Chip
            icon={<Analysis sx={{ color: "#10b981 !important" }} />}
            label="Real-time Token Inspector"
            sx={{
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              color: "#f8fafc",
              border: "1px solid rgba(16, 185, 129, 0.2)",
              fontWeight: 500,
            }}
          />
          <Chip
            icon={<School sx={{ color: "#a855f7 !important" }} />}
            label="Cyber Defense & PIB Connected"
            sx={{
              backgroundColor: "rgba(168, 85, 247, 0.1)",
              color: "#f8fafc",
              border: "1px solid rgba(168, 85, 247, 0.2)",
              fontWeight: 500,
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
            <Tab icon={<Article />} label="Text & WhatsApp Messages" iconPosition="start" />
            <Tab icon={<EmailIcon />} label="Spam & Phishing Email" iconPosition="start" />
            <Tab icon={<ImageIcon />} label="Image OCR" iconPosition="start" />
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
                    sx={{ color: "var(--text-primary)", fontWeight: 700, mb: 0.5 }}
                  >
                    Quick Test Cases
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "var(--text-secondary)", display: "block", mb: 2 }}
                  >
                    Click any scenario to populate the Hindi NLP detector:
                  </Typography>

                  <Box display="flex" flexDirection="column" gap={1.5}>
                    {sampleCases.map((sample, index) => (
                      <Paper
                        key={index}
                        onClick={() => setTextContent(sample.text)}
                        sx={{
                          p: 1.8,
                          cursor: "pointer",
                          backgroundColor: "var(--bg-secondary)",
                          border: "1px solid var(--border-primary)",
                          borderRadius: "10px",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            borderColor: sample.isSpam ? "var(--status-false)" : "var(--status-verified)",
                            backgroundColor: "rgba(255, 255, 255, 0.03)",
                            transform: "translateX(4px)",
                          },
                        }}
                      >
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                          <Typography variant="subtitle2" sx={{ color: "var(--text-primary)", fontWeight: 600, fontSize: "0.88rem" }}>
                            {sample.title}
                          </Typography>
                          <Chip
                            label={sample.tag}
                            size="small"
                            sx={{
                              fontSize: "0.7rem",
                              height: 20,
                              fontWeight: 600,
                              backgroundColor: sample.isSpam ? "rgba(239, 68, 68, 0.15)" : "rgba(16, 185, 129, 0.15)",
                              color: sample.isSpam ? "#f87171" : "#34d399",
                              border: sample.isSpam ? "1px solid rgba(239, 68, 68, 0.3)" : "1px solid rgba(16, 185, 129, 0.3)",
                            }}
                          />
                        </Box>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "var(--text-tertiary)",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            lineHeight: 1.4,
                          }}
                        >
                          {sample.text}
                        </Typography>
                      </Paper>
                    ))}
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </TabPanel>

        {/* Email Spam & Phishing Verification Tab */}
        <TabPanel value={tabValue} index={1}>
          <CardContent sx={{ p: 4 }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <Box mb={2}>
                  <TextField
                    fullWidth
                    label="Email Subject"
                    placeholder="e.g. आयकर विभाग: आपका ₹42,500 का टैक्स रिफंड स्वीकृत"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    variant="outlined"
                    sx={{
                      mb: 2,
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "var(--bg-tertiary)",
                        borderRadius: "10px",
                        border: "1px solid var(--border-primary)",
                        "& fieldset": { border: "none" },
                        "&:hover": { borderColor: "var(--neon-blue)" },
                        "&.Mui-focused": { borderColor: "var(--neon-blue)" },
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Sender Email Address"
                    placeholder="e.g. refund-tax@incometax-gov-update.xyz or alerts@sbi.co.in"
                    value={emailSender}
                    onChange={(e) => setEmailSender(e.target.value)}
                    variant="outlined"
                    sx={{
                      mb: 2,
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "var(--bg-tertiary)",
                        borderRadius: "10px",
                        border: "1px solid var(--border-primary)",
                        "& fieldset": { border: "none" },
                        "&:hover": { borderColor: "var(--neon-blue)" },
                        "&.Mui-focused": { borderColor: "var(--neon-blue)" },
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    multiline
                    rows={7}
                    label="Email Body / Content"
                    placeholder="Paste the full email text, including links, attachment names, or instructions..."
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    variant="outlined"
                    sx={{
                      mb: 2.5,
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "var(--bg-tertiary)",
                        borderRadius: "12px",
                        border: "2px solid var(--border-primary)",
                        "& fieldset": { border: "none" },
                        "&:hover": { borderColor: "var(--neon-blue)" },
                        "&.Mui-focused": { borderColor: "var(--neon-blue)" },
                      },
                    }}
                  />
                </Box>

                <Box display="flex" gap={2} alignItems="center" mb={3}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<EmailIcon />}
                    onClick={handleEmailVerification}
                    disabled={(!emailSubject.trim() && !emailBody.trim()) || verifying}
                    sx={{
                      ml: "auto",
                      minWidth: 240,
                      height: 48,
                      fontSize: "1rem",
                      fontWeight: 600,
                      background: "linear-gradient(135deg, #00d4ff 0%, #0088ff 100%)",
                      color: "#0a0c10",
                      "&:hover": {
                        background: "linear-gradient(135deg, #38bdf8 0%, #00d4ff 100%)",
                      },
                    }}
                  >
                    {verifying ? "Analyzing Email..." : "Analyze Email for Spam"}
                  </Button>
                </Box>

                {verifying && (
                  <Box mb={3} className="glass-card" sx={{ p: 3, borderRadius: "12px" }}>
                    <LinearProgress
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: "var(--bg-tertiary)",
                        "& .MuiLinearProgress-bar": {
                          background: `linear-gradient(90deg, var(--neon-blue), var(--neon-cyan))`,
                        },
                      }}
                    />
                    <Typography variant="body2" textAlign="center" mt={2} sx={{ color: "var(--text-secondary)" }}>
                      Analyzing email headers, sender domain reputation, and Devanagari phishing hooks...
                    </Typography>
                  </Box>
                )}
              </Grid>

              {/* Email Sample Cases Sidebar */}
              <Grid item xs={12} md={4}>
                <Paper
                  sx={{
                    p: 3,
                    background: "var(--bg-tertiary)",
                    border: "1px solid var(--border-primary)",
                    borderRadius: "12px",
                  }}
                >
                  <Typography variant="h6" sx={{ color: "var(--text-primary)", fontWeight: 700, mb: 0.5 }}>
                    Email Phishing Test Cases
                  </Typography>
                  <Typography variant="caption" sx={{ color: "var(--text-secondary)", display: "block", mb: 2 }}>
                    Click any sample to test Hindi spam email detection:
                  </Typography>

                  <Box display="flex" flexDirection="column" gap={1.5}>
                    {sampleEmailCases.map((sample, index) => (
                      <Paper
                        key={index}
                        onClick={() => {
                          setEmailSubject(sample.subject);
                          setEmailSender(sample.sender);
                          setEmailBody(sample.body);
                        }}
                        sx={{
                          p: 1.8,
                          cursor: "pointer",
                          backgroundColor: "var(--bg-secondary)",
                          border: "1px solid var(--border-primary)",
                          borderRadius: "10px",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            borderColor: sample.isSpam ? "var(--status-false)" : "var(--status-verified)",
                            backgroundColor: "rgba(255, 255, 255, 0.03)",
                            transform: "translateX(4px)",
                          },
                        }}
                      >
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                          <Typography variant="subtitle2" sx={{ color: "var(--text-primary)", fontWeight: 600, fontSize: "0.85rem" }}>
                            {sample.title}
                          </Typography>
                          <Chip
                            label={sample.tag}
                            size="small"
                            sx={{
                              fontSize: "0.68rem",
                              height: 20,
                              fontWeight: 600,
                              backgroundColor: sample.isSpam ? "rgba(239, 68, 68, 0.15)" : "rgba(16, 185, 129, 0.15)",
                              color: sample.isSpam ? "#f87171" : "#34d399",
                              border: sample.isSpam ? "1px solid rgba(239, 68, 68, 0.3)" : "1px solid rgba(16, 185, 129, 0.3)",
                            }}
                          />
                        </Box>
                        <Typography variant="caption" sx={{ color: "var(--neon-cyan)", display: "block", mb: 0.5 }}>
                          Subject: {sample.subject.substring(0, 42)}...
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "var(--text-tertiary)",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            lineHeight: 1.35,
                          }}
                        >
                          {sample.body}
                        </Typography>
                      </Paper>
                    ))}
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </TabPanel>

        {/* Image Verification Tab */}
        <TabPanel value={tabValue} index={2}>
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
        <TabPanel value={tabValue} index={3}>
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

            {/* Educational Tip Alert */}
            {verificationResult.educational_tip && (
              <Alert
                severity={
                  verificationResult.result === "verified"
                    ? "success"
                    : verificationResult.result === "false"
                    ? "error"
                    : "warning"
                }
                sx={{
                  mb: 3,
                  borderRadius: "12px",
                  fontSize: "1rem",
                  lineHeight: 1.6,
                }}
              >
                {verificationResult.educational_tip}
              </Alert>
            )}

            {/* Matched Spam/Misinformation Categories */}
            {verificationResult.analysis_details?.categories_detected?.length > 0 && (
              <Box mb={3} display="flex" flexWrap="wrap" gap={1} alignItems="center">
                <Typography variant="body2" sx={{ color: "var(--text-secondary)", mr: 1, fontWeight: 600 }}>
                  Detected Threat Patterns:
                </Typography>
                {verificationResult.analysis_details.categories_detected.map((cat, idx) => (
                  <Chip
                    key={idx}
                    label={cat}
                    color="error"
                    size="small"
                    sx={{ fontWeight: 600, borderRadius: "6px" }}
                  />
                ))}
              </Box>
            )}

            {/* Email Phishing Diagnostics Panel */}
            {verificationResult.email_details && (
              <Accordion
                defaultExpanded
                sx={{
                  mb: 3,
                  backgroundColor: "var(--bg-tertiary)",
                  borderRadius: "12px !important",
                  border: "1px solid var(--border-primary)",
                  "&:before": { display: "none" },
                }}
              >
                <AccordionSummary expandIcon={<ExpandMore sx={{ color: "var(--neon-blue)" }} />}>
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <EmailIcon sx={{ color: "var(--neon-cyan)" }} />
                    <Typography variant="subtitle1" sx={{ color: "var(--text-primary)", fontWeight: 600 }}>
                      Email Phishing & Domain Diagnostics
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    {/* Sender Domain Analysis */}
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 2.2, background: "var(--bg-secondary)", borderRadius: "8px", height: "100%", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          <AlternateEmail sx={{ color: verificationResult.email_details.sender_analysis?.is_suspicious ? "#ef4444" : "#10b981", fontSize: 20 }} />
                          <Typography variant="subtitle2" sx={{ color: "var(--text-primary)", fontWeight: 600 }}>
                            Sender Domain Reputation
                          </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: "var(--text-secondary)", display: "block" }}>
                          Sender: <strong>{verificationResult.email_details.sender || "Not Provided"}</strong>
                        </Typography>
                        <Typography variant="caption" sx={{ color: "var(--text-tertiary)", display: "block", mb: 1 }}>
                          Domain: {verificationResult.email_details.sender_analysis?.domain || "N/A"}
                        </Typography>
                        <Chip
                          label={
                            verificationResult.email_details.sender_analysis?.is_suspicious
                              ? "🚨 Suspicious / Spoofed Domain"
                              : verificationResult.email_details.sender_analysis?.is_trusted
                              ? "✅ Verified Official Domain"
                              : "Standard Domain"
                          }
                          size="small"
                          sx={{
                            backgroundColor: verificationResult.email_details.sender_analysis?.is_suspicious
                              ? "rgba(239, 68, 68, 0.15)"
                              : "rgba(16, 185, 129, 0.15)",
                            color: verificationResult.email_details.sender_analysis?.is_suspicious ? "#f87171" : "#34d399",
                            fontWeight: 600,
                            mb: 1,
                          }}
                        />
                        <Typography variant="caption" sx={{ color: "var(--text-secondary)", display: "block", lineHeight: 1.5 }}>
                          {verificationResult.email_details.sender_analysis?.reason}
                        </Typography>
                      </Paper>
                    </Grid>

                    {/* Subject Line & Attachment Hazards */}
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 2.2, background: "var(--bg-secondary)", borderRadius: "8px", height: "100%", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          <AttachFile sx={{ color: verificationResult.email_details.attachment_analysis?.has_risky_attachment ? "#ef4444" : "#38bdf8", fontSize: 20 }} />
                          <Typography variant="subtitle2" sx={{ color: "var(--text-primary)", fontWeight: 600 }}>
                            Subject Analysis & Attachment Hazards
                          </Typography>
                        </Box>
                        {verificationResult.email_details.subject && (
                          <Typography variant="caption" sx={{ color: "var(--neon-cyan)", display: "block", mb: 0.5 }}>
                            Subject: "{verificationResult.email_details.subject}"
                          </Typography>
                        )}
                        <Typography variant="caption" sx={{ color: "var(--text-secondary)", display: "block", mb: 1 }}>
                          Attachment Status: {verificationResult.email_details.attachment_analysis?.warning}
                        </Typography>
                        {verificationResult.email_details.urgent_ctas_detected?.length > 0 && (
                          <Box mt={1}>
                            <Typography variant="caption" sx={{ color: "#f87171", fontWeight: 600, display: "block", mb: 0.5 }}>
                              Urgency & Threat CTAs Detected:
                            </Typography>
                            <Box display="flex" flexWrap="wrap" gap={0.5}>
                              {verificationResult.email_details.urgent_ctas_detected.map((cta, i) => (
                                <Chip key={i} label={cta} size="small" sx={{ fontSize: "0.7rem", height: 22, backgroundColor: "rgba(239, 68, 68, 0.2)", color: "#fca5a5" }} />
                              ))}
                            </Box>
                          </Box>
                        )}
                      </Paper>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            )}

            {/* NLP Pipeline Analysis Details */}
            {verificationResult.nlp_tokenization && (
              <Accordion
                defaultExpanded
                sx={{
                  mb: 3,
                  backgroundColor: "var(--bg-tertiary)",
                  borderRadius: "12px !important",
                  border: "1px solid var(--border-primary)",
                  "&:before": { display: "none" },
                }}
              >
                <AccordionSummary expandIcon={<ExpandMore sx={{ color: "var(--neon-blue)" }} />}>
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Analysis sx={{ color: "var(--neon-blue)" }} />
                    <Typography variant="subtitle1" sx={{ color: "var(--text-primary)", fontWeight: 600 }}>
                      NLP Pipeline Breakdown
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Paper sx={{ p: 2, background: "var(--bg-secondary)", borderRadius: "8px" }}>
                        <Typography variant="caption" sx={{ color: "var(--text-secondary)" }}>
                          1. Tokenization
                        </Typography>
                        <Typography variant="h6" sx={{ color: "var(--neon-cyan)", my: 0.5 }}>
                          {verificationResult.nlp_tokenization.raw_tokens_count} Tokens
                        </Typography>
                        <Typography variant="caption" sx={{ color: "var(--text-tertiary)" }}>
                          Multi-script Devanagari & word segmentation
                        </Typography>
                      </Paper>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Paper sx={{ p: 2, background: "var(--bg-secondary)", borderRadius: "8px" }}>
                        <Typography variant="caption" sx={{ color: "var(--text-secondary)" }}>
                          2. Stopwords Filtering
                        </Typography>
                        <Typography variant="h6" sx={{ color: "var(--neon-green)", my: 0.5 }}>
                          {verificationResult.nlp_tokenization.filtered_tokens_count} Clean Tokens
                        </Typography>
                        <Typography variant="caption" sx={{ color: "var(--text-tertiary)" }}>
                          Grammatical filler words stripped
                        </Typography>
                      </Paper>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Paper sx={{ p: 2, background: "var(--bg-secondary)", borderRadius: "8px" }}>
                        <Typography variant="caption" sx={{ color: "var(--text-secondary)" }}>
                          3. Naive Bayes Probability
                        </Typography>
                        <Typography variant="h6" sx={{ color: "var(--neon-purple)", my: 0.5 }}>
                          {Math.round((verificationResult.nlp_tokenization.ml_naive_bayes_spam_probability || 0) * 100)}% Spam Prob
                        </Typography>
                        <Typography variant="caption" sx={{ color: "var(--text-tertiary)" }}>
                          TF-IDF + MultinomialNB Classifier
                        </Typography>
                      </Paper>
                    </Grid>

                    {verificationResult.nlp_tokenization.spam_tokens_detected?.length > 0 && (
                      <Grid item xs={12}>
                        <Box sx={{ p: 2, background: "rgba(255, 68, 68, 0.08)", borderRadius: "8px", border: "1px solid rgba(255, 68, 68, 0.2)" }}>
                          <Typography variant="body2" sx={{ color: "var(--status-false)", fontWeight: 600, mb: 1 }}>
                            Flagged Spam N-Grams & Fraud Indicators:
                          </Typography>
                          <Box display="flex" flexWrap="wrap" gap={1}>
                            {verificationResult.nlp_tokenization.spam_tokens_detected.map((tok, idx) => (
                              <Chip
                                key={idx}
                                label={tok}
                                size="small"
                                sx={{
                                  backgroundColor: "rgba(255, 68, 68, 0.2)",
                                  color: "#ff6b6b",
                                  fontWeight: 600,
                                }}
                              />
                            ))}
                          </Box>
                        </Box>
                      </Grid>
                    )}

                    {verificationResult.nlp_tokenization.sample_tokens?.length > 0 && (
                      <Grid item xs={12}>
                        <Box sx={{ p: 2, background: "var(--bg-secondary)", borderRadius: "8px" }}>
                          <Typography variant="caption" sx={{ color: "var(--text-secondary)", display: "block", mb: 1 }}>
                            Processed Informative Tokens:
                          </Typography>
                          <Box display="flex" flexWrap="wrap" gap={0.8}>
                            {verificationResult.nlp_tokenization.sample_tokens.slice(0, 20).map((tok, idx) => (
                              <Chip
                                key={idx}
                                label={tok}
                                size="small"
                                variant="outlined"
                                sx={{ color: "var(--text-primary)", borderColor: "var(--border-primary)" }}
                              />
                            ))}
                          </Box>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            )}

            {/* Fact Check & Cyber Defense Sources */}
            {verificationResult.sources?.length > 0 && (
              <Box mb={3}>
                <Typography variant="subtitle2" sx={{ color: "var(--text-secondary)", mb: 1.5, fontWeight: 600 }}>
                  Official Verification & Cyber Defense Portals:
                </Typography>
                <Grid container spacing={1.5}>
                  {verificationResult.sources.map((src, idx) => (
                    <Grid item xs={12} sm={6} key={idx}>
                      <Paper
                        component="a"
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          p: 1.5,
                          display: "block",
                          textDecoration: "none",
                          background: "var(--bg-tertiary)",
                          border: "1px solid var(--border-primary)",
                          borderRadius: "8px",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            borderColor: "var(--neon-blue)",
                            transform: "translateY(-2px)",
                          },
                        }}
                      >
                        <Typography variant="body2" sx={{ color: "var(--neon-blue)", fontWeight: 600 }}>
                          {src.name} ↗
                        </Typography>
                        <Typography variant="caption" sx={{ color: "var(--text-secondary)" }}>
                          {src.description}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

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
