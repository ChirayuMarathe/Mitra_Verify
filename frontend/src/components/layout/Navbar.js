import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  AccountCircle,
  Dashboard,
  Security,
  School,
  History,
  Settings,
  ExitToApp,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);

  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    handleUserMenuClose();
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleUserMenuClose();
    handleMobileMenuClose();
  };

  // Left side navigation items
  const leftNavItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Verify", path: "/verify" },
  ];

  // Right side navigation items
  const rightNavItems = [
    { label: "Learn", path: "/learn" },
    { label: "History", path: "/history" },
    { label: "About", path: "/about" },
  ];

  const userMenuItems = [
    { label: "Profile", path: "/profile", icon: <AccountCircle /> },
    { label: "Settings", path: "/settings", icon: <Settings /> },
  ];

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "linear-gradient(135deg, #0a0a0a 0%, #111111 100%)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
        zIndex: 1100,
      }}
    >
      <Toolbar
        sx={{
          py: 1.5,
          px: { xs: 2, md: 4 },
          maxWidth: "100%",
          width: "100%",
          margin: "0 auto",
        }}
      >
        {/* Mobile Menu Button */}
        {isMobile && (
          <IconButton
            onClick={handleMobileMenuOpen}
            sx={{
              color: "#ffffff",
              mr: 2,
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Desktop Navigation Layout */}
        {!isMobile ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            {/* Left Navigation */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                minWidth: 0,
                flex: 1,
              }}
            >
              {(user ? leftNavItems : []).map((item) => (
                <Button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    color: "#ffffff",
                    textTransform: "none",
                    fontWeight: 500,
                    fontSize: "0.95rem",
                    fontFamily: '"Inter", sans-serif',
                    px: 0,
                    py: 1,
                    minWidth: "auto",
                    position: "relative",
                    "&:hover": {
                      color: "#ffffff",
                      backgroundColor: "transparent",
                      "&::after": {
                        transform: "scaleX(1)",
                      },
                    },
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: -2,
                      left: 0,
                      right: 0,
                      height: "2px",
                      backgroundColor: "#ffffff",
                      transform: "scaleX(0)",
                      transformOrigin: "center",
                      transition: "transform 0.2s ease-in-out",
                    },
                    transition: "color 0.2s ease",
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>

            {/* Center Logo */}
            <Typography
              variant="h6"
              component="div"
              sx={{
                cursor: "pointer",
                fontWeight: 700,
                color: "#ffffff",
                fontSize: "1.5rem",
                fontFamily: '"Inter", sans-serif',
                letterSpacing: "-0.02em",
                textAlign: "center",
                flex: "0 0 auto",
                mx: 4,
                "&:hover": {
                  color: "#f0f0f0",
                },
                transition: "color 0.2s ease",
              }}
              onClick={() => navigate("/")}
            >
              MitraVerify
            </Typography>

            {/* Right Navigation */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                minWidth: 0,
                flex: 1,
                justifyContent: "flex-end",
              }}
            >
              {(user ? rightNavItems : rightNavItems).map((item) => (
                <Button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    color: "#ffffff",
                    textTransform: "none",
                    fontWeight: 500,
                    fontSize: "0.95rem",
                    fontFamily: '"Inter", sans-serif',
                    px: 0,
                    py: 1,
                    minWidth: "auto",
                    position: "relative",
                    "&:hover": {
                      color: "#ffffff",
                      backgroundColor: "transparent",
                      "&::after": {
                        transform: "scaleX(1)",
                      },
                    },
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: -2,
                      left: 0,
                      right: 0,
                      height: "2px",
                      backgroundColor: "#ffffff",
                      transform: "scaleX(0)",
                      transformOrigin: "center",
                      transition: "transform 0.2s ease-in-out",
                    },
                    transition: "color 0.2s ease",
                  }}
                >
                  {item.label}
                </Button>
              ))}

              {/* Auth Buttons */}
              <Box
                sx={{ ml: 2, display: "flex", alignItems: "center", gap: 1 }}
              >
                {user ? (
                  <IconButton onClick={handleUserMenuOpen} sx={{ p: 0 }}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: "#cc2936",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                      }}
                    >
                      {user.username?.charAt(0).toUpperCase()}
                    </Avatar>
                  </IconButton>
                ) : (
                  <>
                    <Button
                      onClick={() => navigate("/login")}
                      sx={{
                        color: "#ffffff",
                        textTransform: "none",
                        fontWeight: 500,
                        fontSize: "0.95rem",
                        fontFamily: '"Inter", sans-serif',
                        px: 2,
                        py: 1,
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                        },
                      }}
                    >
                      Login
                    </Button>
                    <Button
                      onClick={() => navigate("/register")}
                      sx={{
                        backgroundColor: "#cc2936",
                        color: "#ffffff",
                        textTransform: "none",
                        fontWeight: 600,
                        fontSize: "0.95rem",
                        fontFamily: '"Inter", sans-serif',
                        px: 2.5,
                        py: 1,
                        borderRadius: "6px",
                        "&:hover": {
                          backgroundColor: "#e63946",
                          boxShadow: "0 0 20px rgba(204, 41, 54, 0.3)",
                        },
                        transition: "all 0.2s ease",
                      }}
                    >
                      Sign up
                    </Button>
                  </>
                )}
              </Box>
            </Box>
          </Box>
        ) : (
          /* Mobile Layout */
          <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                cursor: "pointer",
                fontWeight: 700,
                color: "#ffffff",
                fontSize: "1.25rem",
                fontFamily: '"Inter", sans-serif',
                flexGrow: 1,
                textAlign: "center",
                "&:hover": {
                  color: "#f0f0f0",
                },
                transition: "color 0.2s ease",
              }}
              onClick={() => navigate("/")}
            >
              MitraVerify
            </Typography>

            {/* Mobile Auth Buttons */}
            {user ? (
              <IconButton onClick={handleUserMenuOpen} sx={{ p: 0 }}>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: "#cc2936",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                  }}
                >
                  {user.username?.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            ) : (
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  onClick={() => navigate("/login")}
                  sx={{
                    color: "#ffffff",
                    textTransform: "none",
                    fontWeight: 500,
                    fontSize: "0.875rem",
                    px: 1.5,
                    py: 0.5,
                    minWidth: "auto",
                  }}
                >
                  Login
                </Button>
                <Button
                  onClick={() => navigate("/register")}
                  sx={{
                    backgroundColor: "#cc2936",
                    color: "#ffffff",
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    px: 1.5,
                    py: 0.5,
                    borderRadius: "6px",
                    minWidth: "auto",
                    "&:hover": {
                      backgroundColor: "#e63946",
                    },
                  }}
                >
                  Sign up
                </Button>
              </Box>
            )}
          </Box>
        )}

        {/* User Dropdown Menu */}
        {user && (
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleUserMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            PaperProps={{
              sx: {
                backgroundColor: "#1c2128",
                border: "1px solid #30363d",
                mt: 1,
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
              },
            }}
          >
            <MenuItem disabled sx={{ color: "#7d8590", fontWeight: 500 }}>
              {user.username}
            </MenuItem>
            <Divider sx={{ borderColor: "#30363d" }} />
            {userMenuItems.map((item) => (
              <MenuItem
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  color: "#c9d1d9",
                  "&:hover": { backgroundColor: "#262c36" },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {item.icon}
                  {item.label}
                </Box>
              </MenuItem>
            ))}
            <Divider sx={{ borderColor: "#30363d" }} />
            <MenuItem
              onClick={handleLogout}
              sx={{
                color: "#c9d1d9",
                "&:hover": { backgroundColor: "#262c36" },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <ExitToApp />
                Logout
              </Box>
            </MenuItem>
          </Menu>
        )}

        {/* Mobile Navigation Menu */}
        {isMobile && (
          <Menu
            anchorEl={mobileMenuAnchor}
            open={Boolean(mobileMenuAnchor)}
            onClose={handleMobileMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            PaperProps={{
              sx: {
                backgroundColor: "#1c2128",
                border: "1px solid #30363d",
                mt: 1,
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
                minWidth: 200,
              },
            }}
          >
            {[...leftNavItems, ...rightNavItems].map((item) => (
              <MenuItem
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  color: "#c9d1d9",
                  fontWeight: 500,
                  "&:hover": { backgroundColor: "#262c36" },
                }}
              >
                {item.label}
              </MenuItem>
            ))}
          </Menu>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
