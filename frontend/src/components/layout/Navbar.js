import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Chip,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Security,
  Psychology,
  Info,
  Menu as MenuIcon,
  Close as CloseIcon,
  CheckCircle,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: "Verify", path: "/", icon: <Security /> },
    { label: "NLP Architecture", path: "/nlp-basics", icon: <Psychology /> },
    { label: "About", path: "/about", icon: <Info /> },
  ];

  const handleNavigate = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "rgba(10, 12, 16, 0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        zIndex: 1100,
      }}
    >
      <Toolbar
        sx={{
          py: 1.2,
          px: { xs: 2, md: 4 },
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "1400px",
          width: "100%",
          margin: "0 auto",
        }}
      >
        {/* Brand Logo & Title */}
        <Box
          onClick={() => handleNavigate("/")}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "10px",
              background: "linear-gradient(135deg, #00d4ff 0%, #3b82f6 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 15px rgba(0, 212, 255, 0.35)",
            }}
          >
            <Security sx={{ color: "#ffffff", fontSize: 24 }} />
          </Box>
          <Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "1.1rem", md: "1.25rem" },
                  letterSpacing: "-0.02em",
                  color: "#f8fafc",
                }}
              >
                MitraVerify
              </Typography>
            </Box>
            <Typography
              variant="caption"
              sx={{
                color: "#94a3b8",
                display: "block",
                lineHeight: 1,
                fontSize: "0.72rem",
              }}
            >
              Hindi & Regional Language Spam & Phishing Detection
            </Typography>
          </Box>
        </Box>

        {/* Desktop Navigation Links */}
        {!isMobile ? (
          <Box display="flex" alignItems="center" gap={1}>
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Button
                  key={link.path}
                  onClick={() => handleNavigate(link.path)}
                  startIcon={link.icon}
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: "8px",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    textTransform: "none",
                    color: isActive ? "#00d4ff" : "#94a3b8",
                    backgroundColor: isActive
                      ? "rgba(0, 212, 255, 0.1)"
                      : "transparent",
                    border: isActive
                      ? "1px solid rgba(0, 212, 255, 0.25)"
                      : "1px solid transparent",
                    "&:hover": {
                      color: "#f8fafc",
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                    },
                  }}
                >
                  {link.label}
                </Button>
              );
            })}

            {/* Engine Status Indicator */}
            <Chip
              icon={<CheckCircle sx={{ color: "#10b981 !important", fontSize: 16 }} />}
              label="NLP Engine Active"
              size="small"
              sx={{
                ml: 2,
                backgroundColor: "rgba(16, 185, 129, 0.12)",
                color: "#10b981",
                border: "1px solid rgba(16, 185, 129, 0.25)",
                fontWeight: 600,
                fontSize: "0.75rem",
              }}
            />
          </Box>
        ) : (
          <IconButton
            onClick={() => setMobileOpen(true)}
            sx={{
              color: "#f8fafc",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "8px",
            }}
          >
            <MenuIcon />
          </IconButton>
        )}
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            backgroundColor: "#0a0c10",
            borderLeft: "1px solid rgba(255, 255, 255, 0.1)",
            p: 2,
          },
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6" sx={{ color: "#f8fafc", fontWeight: 700 }}>
            MitraVerify
          </Typography>
          <IconButton onClick={() => setMobileOpen(false)} sx={{ color: "#94a3b8" }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List>
          {navLinks.map((link) => (
            <ListItem key={link.path} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => handleNavigate(link.path)}
                selected={location.pathname === link.path}
                sx={{
                  borderRadius: "8px",
                  "&.Mui-selected": {
                    backgroundColor: "rgba(0, 212, 255, 0.1)",
                    color: "#00d4ff",
                  },
                }}
              >
                <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
                  {link.icon}
                </ListItemIcon>
                <ListItemText primary={link.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
