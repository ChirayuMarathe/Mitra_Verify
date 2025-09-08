import React, { useState } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import LoginIcon from "@mui/icons-material/Login";
import SecurityIcon from "@mui/icons-material/Security";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await login(formData);
      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "var(--bg-primary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
          radial-gradient(circle at 20% 80%, rgba(0, 212, 255, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(0, 255, 136, 0.1) 0%, transparent 50%)
        `,
          pointerEvents: "none",
        },
      }}
    >
      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        <Paper
          className="glass-card"
          elevation={0}
          sx={{
            p: 5,
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-primary)",
            borderRadius: "20px",
            backdropFilter: "blur(10px)",
            boxShadow: "var(--shadow-elevated)",
          }}
        >
          {/* Header */}
          <Box textAlign="center" mb={4}>
            <SecurityIcon
              sx={{
                fontSize: 60,
                color: "var(--neon-blue)",
                mb: 2,
                filter: "drop-shadow(var(--glow-blue))",
              }}
            />
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 700,
                background: `linear-gradient(135deg, var(--neon-blue), var(--neon-cyan))`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 1,
              }}
            >
              Welcome Back
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "var(--text-secondary)",
                fontWeight: 400,
              }}
            >
              Login to MitraVerify
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "var(--text-tertiary)",
                mt: 1,
              }}
            >
              Enter your credentials to access the verification platform
            </Typography>
          </Box>

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                backgroundColor: "rgba(255, 68, 68, 0.1)",
                border: "1px solid rgba(255, 68, 68, 0.2)",
                color: "var(--text-primary)",
                borderRadius: "12px",
                "& .MuiAlert-icon": {
                  color: "var(--status-false)",
                },
              }}
            >
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username or Email"
              name="username"
              value={formData.username}
              onChange={handleChange}
              margin="normal"
              required
              placeholder="Enter your username or email"
              sx={{
                mb: 2,
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
                  fontSize: "1rem",
                  "&::placeholder": {
                    color: "var(--text-tertiary)",
                  },
                },
              }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              placeholder="Enter your password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{
                        color: "var(--text-secondary)",
                        "&:hover": {
                          color: "var(--neon-blue)",
                          backgroundColor: "rgba(0, 212, 255, 0.1)",
                        },
                      }}
                    >
                      {showPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
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
                  fontSize: "1rem",
                  "&::placeholder": {
                    color: "var(--text-tertiary)",
                  },
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              startIcon={<LoginIcon />}
              className="btn-neon btn-neon-primary"
              sx={{
                height: 56,
                fontSize: "1.1rem",
                fontWeight: 600,
                borderRadius: "12px",
                mb: 3,
                textTransform: "none",
              }}
            >
              {loading ? "Logging in..." : "Login to MitraVerify"}
            </Button>
          </form>

          <Box textAlign="center">
            <Typography variant="body2" sx={{ color: "var(--text-secondary)" }}>
              Don't have an account?{" "}
              <Link
                to="/register"
                style={{
                  color: "var(--neon-blue)",
                  textDecoration: "none",
                  fontWeight: 600,
                  transition: "color 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.color = "var(--neon-cyan)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.color = "var(--neon-blue)")
                }
              >
                Register here
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
