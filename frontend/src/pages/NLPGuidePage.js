import React from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  Paper,
  Divider,
  Button,
} from "@mui/material";
import {
  Psychology,
  AccountTree,
  FilterList,
  DataObject,
  Calculate,
  CheckCircle,
  Warning,
  Security,
  ArrowForward,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const NLPGuidePage = () => {
  const navigate = useNavigate();

  const stages = [
    {
      step: "01",
      title: "Text Normalization",
      icon: <Security sx={{ fontSize: 32, color: "#00d4ff" }} />,
      desc: "Raw text cleaning: Removes extraneous punctuation, standardizes Devanagari purna-viram (।), and normalizes URLs and phone numbers into semantic placeholders (URL_TOKEN, PHONE_TOKEN).",
      exampleInput: "बधाई हो! आपने जीते 25 लाख!! Call: +919876543210 https://kbc.fake",
      exampleOutput: "बधाई हो आपने जीते 25 लाख PHONE_TOKEN URL_TOKEN",
      badge: "Text Cleaning",
    },
    {
      step: "02",
      title: "Devanagari & Latin Tokenization",
      icon: <AccountTree sx={{ fontSize: 32, color: "#38bdf8" }} />,
      desc: "Tokenization breaks continuous sentences into atomic word tokens. Unlike Latin text, Devanagari tokens contain complex conjuncts (संयुक्ताक्षर जैसे 'प्र', 'क्त'), matras (मात्राएं), and halants (्). Our custom tokenizer preserves UTF-8 range \\u0900-\\u097F so tokens never get broken into invalid syllables.",
      exampleInput: "आपने KBC में 25 लाख रुपये जीते हैं",
      exampleOutput: "['आपने', 'KBC', 'में', '25', 'लाख', 'रुपये', 'जीते', 'हैं']",
      badge: "Word Segmentation",
    },
    {
      step: "03",
      title: "Stopwords Removal",
      icon: <FilterList sx={{ fontSize: 32, color: "#10b981" }} />,
      desc: "High-frequency grammatical filler words ('है', 'और', 'का', 'के', 'में', 'पर', 'से', 'तो', 'भी') appear in almost 100% of messages—both spam and genuine. Stripping them eliminates background noise and focuses attention purely on semantic fraud signals.",
      exampleInput: "['आपने', 'KBC', 'में', '25', 'लाख', 'रुपये', 'जीते', 'हैं']",
      exampleOutput: "['KBC', '25', 'लाख', 'रुपये', 'जीते'] (Filtered: आपने, में, हैं)",
      badge: "Noise Elimination",
    },
    {
      step: "04",
      title: "N-Gram Phrase Extraction",
      icon: <DataObject sx={{ fontSize: 32, color: "#f59e0b" }} />,
      desc: "Single words (unigrams) like 'रिचार्ज' (recharge) or 'लाख' (lakh) frequently appear in regular conversations. But contiguous pairs (bigrams) and triples (trigrams) like 'फ्री_रिचार्ज', '25_लाख', 'खाता_ब्लॉक', '10_लोगों_को_भेजें' hold over 98% correlation with malicious phishing.",
      exampleInput: "['फ्री', '5G', 'रिचार्ज', 'ऑफर']",
      exampleOutput: "['फ्री', '5G', 'रिचार्ज', 'फ्री_5G', '5G_रिचार्ज', 'फ्री_5G_रिचार्ज']",
      badge: "Contextual N-Grams",
    },
    {
      step: "05",
      title: "TF-IDF Vectorization",
      icon: <Calculate sx={{ fontSize: 32, color: "#a855f7" }} />,
      desc: "Machine learning algorithms require numeric vectors, not text. TF-IDF computes Term Frequency (how often a word appears in the message) multiplied by Inverse Document Frequency (penalizing words that appear everywhere). High scores indicate rare, high-intent fraud keywords.",
      exampleInput: "TF(t, d) = f(t, d) / |d|  ×  IDF(t) = log((1 + N)/(1 + df(t))) + 1",
      exampleOutput: "Token '25_लाख' -> TF-IDF Weight: 0.68 | Token 'है' -> TF-IDF Weight: 0.00",
      badge: "Numerical Vectors",
    },
    {
      step: "06",
      title: "Multinomial Naive Bayes",
      icon: <Psychology sx={{ fontSize: 32, color: "#ef4444" }} />,
      desc: "The classic NLP spam classifier. Using Bayes' Theorem, it calculates P(Spam | Tokens): the probability that the message is fraudulent given the observed tokens. If P(Spam | Tokens) > 0.50, the message is flagged as spam with calculated confidence.",
      exampleInput: "P(Spam | W) ∝ P(Spam) × ∏ P(w_i | Spam)",
      exampleOutput: "P(Spam) = 89.4% -> Verdict: FALSE (Spam / Phishing)",
      badge: "Probabilistic Model",
    },
  ];

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "var(--bg-primary)", py: 6 }}>
      <Container maxWidth="lg">
        {/* Header Hero */}
        <Box textAlign="center" mb={6}>
          <Chip
            icon={<Psychology sx={{ color: "#00d4ff !important" }} />}
            label="Natural Language Processing (NLP) First-Principles Guide"
            sx={{
              backgroundColor: "rgba(0, 212, 255, 0.1)",
              color: "#00d4ff",
              border: "1px solid rgba(0, 212, 255, 0.25)",
              fontWeight: 600,
              mb: 2,
            }}
          />
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: "#f8fafc",
              fontSize: { xs: "2rem", md: "2.75rem" },
              letterSpacing: "-0.03em",
              mb: 2,
            }}
          >
            How Hindi Spam Detection Actually Works
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#94a3b8",
              maxWidth: "800px",
              margin: "0 auto",
              fontSize: "1.1rem",
              lineHeight: 1.7,
            }}
          >
            Understand the complete step-by-step pipeline from raw Devanagari text to
            probabilistic classification. No black boxes—just pure NLP fundamentals.
          </Typography>
        </Box>

        {/* 6 Step Cards */}
        <Grid container spacing={3} mb={6}>
          {stages.map((st, idx) => (
            <Grid item xs={12} md={6} key={idx}>
              <Card
                sx={{
                  height: "100%",
                  backgroundColor: "var(--bg-secondary)",
                  border: "1px solid var(--border-primary)",
                  borderRadius: "14px",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: "var(--neon-blue)",
                    transform: "translateY(-3px)",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
                  },
                }}
              >
                <CardContent sx={{ p: 3.5 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Box display="flex" alignItems="center" gap={1.5}>
                      {st.icon}
                      <Typography variant="caption" sx={{ color: "var(--neon-cyan)", fontWeight: 700, fontSize: "0.85rem" }}>
                        STEP {st.step}
                      </Typography>
                    </Box>
                    <Chip label={st.badge} size="small" sx={{ backgroundColor: "rgba(255,255,255,0.06)", color: "#cbd5e1" }} />
                  </Box>

                  <Typography variant="h6" sx={{ color: "#f8fafc", fontWeight: 700, mb: 1.5 }}>
                    {st.title}
                  </Typography>

                  <Typography variant="body2" sx={{ color: "#94a3b8", lineHeight: 1.65, mb: 2.5 }}>
                    {st.desc}
                  </Typography>

                  <Box sx={{ p: 2, backgroundColor: "var(--bg-tertiary)", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                    <Typography variant="caption" sx={{ color: "#64748b", display: "block", mb: 0.5, fontWeight: 600 }}>
                      INPUT / सूत्र:
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#cbd5e1", fontFamily: "monospace", fontSize: "0.8rem", mb: 1.2 }}>
                      {st.exampleInput}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#64748b", display: "block", mb: 0.5, fontWeight: 600 }}>
                      OUTPUT / परिणाम:
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#00d4ff", fontFamily: "monospace", fontSize: "0.8rem" }}>
                      {st.exampleOutput}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Call to Action Box */}
        <Paper
          sx={{
            p: 4,
            textAlign: "center",
            background: "linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)",
            border: "1px solid rgba(0, 212, 255, 0.25)",
            borderRadius: "16px",
          }}
        >
          <Typography variant="h5" sx={{ color: "#f8fafc", fontWeight: 700, mb: 1 }}>
            Ready to test this in action?
          </Typography>
          <Typography variant="body2" sx={{ color: "#94a3b8", mb: 3, maxWidth: "600px", margin: "0 auto 24px" }}>
            Try pasting authentic WhatsApp lottery claims, fake government schemes, or official press releases into the live verification engine.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/")}
            endIcon={<ArrowForward />}
            sx={{
              background: "linear-gradient(135deg, #00d4ff 0%, #0088ff 100%)",
              color: "#0a0c10",
              fontWeight: 700,
              px: 4,
              py: 1.2,
              borderRadius: "8px",
              textTransform: "none",
              fontSize: "1rem",
              boxShadow: "0 0 20px rgba(0, 212, 255, 0.4)",
              "&:hover": {
                background: "linear-gradient(135deg, #38bdf8 0%, #00d4ff 100%)",
              },
            }}
          >
            Open Live Hindi Spam Detector
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default NLPGuidePage;
