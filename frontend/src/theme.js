import { createTheme } from "@mui/material/styles";

// Dark theme color palette (Codewars-inspired)
const colors = {
  // Dark theme base colors
  dark: {
    900: "#0a0a0a", // Deepest black
    800: "#121212", // Main background
    700: "#1a1a1a", // Card background
    600: "#242424", // Elevated surfaces
    500: "#2d2d2d", // Borders
    400: "#404040", // Disabled elements
    300: "#525252", // Secondary text
    200: "#737373", // Primary text
    100: "#a3a3a3", // Light text
    50: "#e5e5e5", // Brightest text
  },

  // Neon accent colors
  neon: {
    blue: "#00d4ff", // Primary trusted
    green: "#00ff88", // Success/verified
    cyan: "#00ffff", // Info highlights
    purple: "#a855f7", // Special features
    pink: "#f472b6", // Highlights
  },

  // Risk/warning colors
  risk: {
    red: "#ff4444", // High risk/false
    orange: "#ff8800", // Medium risk/questionable
    yellow: "#ffdd00", // Low risk/caution
  },

  // Status colors for verification
  status: {
    verified: "#00ff88", // Bright green
    questionable: "#ff8800", // Orange
    false: "#ff4444", // Red
    processing: "#00d4ff", // Blue
    insufficient: "#737373", // Gray
  },
};

// Create the dark theme
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: colors.neon.blue,
      light: "#33ddff",
      dark: "#0099cc",
      contrastText: colors.dark[900],
    },
    secondary: {
      main: colors.neon.green,
      light: "#33ff99",
      dark: "#00cc66",
      contrastText: colors.dark[900],
    },
    success: {
      main: colors.status.verified,
      light: "#33ff99",
      dark: "#00cc66",
      contrastText: colors.dark[900],
    },
    warning: {
      main: colors.status.questionable,
      light: "#ff9933",
      dark: "#cc6600",
      contrastText: colors.dark[900],
    },
    error: {
      main: colors.status.false,
      light: "#ff6666",
      dark: "#cc3333",
      contrastText: colors.dark[900],
    },
    info: {
      main: colors.neon.cyan,
      light: "#33ffff",
      dark: "#00cccc",
      contrastText: colors.dark[900],
    },
    background: {
      default: colors.dark[800], // Main background
      paper: colors.dark[700], // Card background
    },
    text: {
      primary: colors.dark[50], // White text
      secondary: colors.dark[200], // Gray text
      disabled: colors.dark[400], // Disabled text
    },
    divider: colors.dark[500],
  },

  typography: {
    fontFamily:
      '"Inter", "Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 700,
      fontSize: "3rem",
      lineHeight: 1.1,
      letterSpacing: "-0.02em",
      color: colors.dark[50],
    },
    h2: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 600,
      fontSize: "2.25rem",
      lineHeight: 1.2,
      letterSpacing: "-0.01em",
      color: colors.dark[50],
    },
    h3: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 600,
      fontSize: "1.875rem",
      lineHeight: 1.3,
      color: colors.dark[50],
    },
    h4: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 600,
      fontSize: "1.5rem",
      lineHeight: 1.4,
      color: colors.dark[50],
    },
    h5: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 600,
      fontSize: "1.25rem",
      lineHeight: 1.4,
      color: colors.dark[50],
    },
    h6: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 500,
      fontSize: "1rem",
      lineHeight: 1.5,
      color: colors.dark[50],
    },
    body1: {
      fontWeight: 400,
      fontSize: "1rem",
      lineHeight: 1.6,
      color: colors.dark[200],
    },
    body2: {
      fontWeight: 400,
      fontSize: "0.875rem",
      lineHeight: 1.6,
      color: colors.dark[300],
    },
    button: {
      fontWeight: 500,
      fontSize: "0.875rem",
      lineHeight: 1.75,
      textTransform: "none",
    },
  },

  shape: {
    borderRadius: 8,
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: colors.dark[800],
          fontFamily: '"Inter", sans-serif',
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        },
        "*": {
          scrollbarWidth: "thin",
          scrollbarColor: `${colors.dark[500]} ${colors.dark[800]}`,
        },
        "*::-webkit-scrollbar": {
          width: "8px",
        },
        "*::-webkit-scrollbar-track": {
          background: colors.dark[800],
        },
        "*::-webkit-scrollbar-thumb": {
          backgroundColor: colors.dark[500],
          borderRadius: "4px",
          "&:hover": {
            backgroundColor: colors.dark[400],
          },
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          textTransform: "none",
          fontWeight: 500,
          fontSize: "0.875rem",
          padding: "12px 24px",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: "-100%",
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
            transition: "left 0.5s",
          },
          "&:hover::before": {
            left: "100%",
          },
        },
        contained: {
          background: `linear-gradient(135deg, ${colors.neon.blue} 0%, ${colors.neon.cyan} 100%)`,
          color: colors.dark[900],
          boxShadow: `0 0 20px ${colors.neon.blue}40`,
          "&:hover": {
            background: `linear-gradient(135deg, ${colors.neon.cyan} 0%, ${colors.neon.blue} 100%)`,
            boxShadow: `0 0 30px ${colors.neon.blue}60`,
            transform: "translateY(-2px)",
          },
        },
        outlined: {
          borderColor: colors.neon.blue,
          color: colors.neon.blue,
          borderWidth: "2px",
          "&:hover": {
            borderColor: colors.neon.cyan,
            color: colors.neon.cyan,
            backgroundColor: `${colors.neon.blue}10`,
            borderWidth: "2px",
            boxShadow: `0 0 15px ${colors.neon.blue}30`,
          },
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: colors.dark[700],
          borderRadius: "12px",
          border: `1px solid ${colors.dark[500]}`,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            border: `1px solid ${colors.neon.blue}50`,
            boxShadow: `0 8px 32px ${colors.dark[900]}60, 0 0 20px ${colors.neon.blue}20`,
            transform: "translateY(-4px)",
          },
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: colors.dark[600],
            borderRadius: "8px",
            "& fieldset": {
              borderColor: colors.dark[500],
              borderWidth: "2px",
            },
            "&:hover fieldset": {
              borderColor: colors.neon.blue,
              boxShadow: `0 0 15px ${colors.neon.blue}30`,
            },
            "&.Mui-focused fieldset": {
              borderColor: colors.neon.blue,
              boxShadow: `0 0 20px ${colors.neon.blue}40`,
            },
            "& input": {
              color: colors.dark[50],
            },
          },
          "& .MuiInputLabel-root": {
            color: colors.dark[300],
            "&.Mui-focused": {
              color: colors.neon.blue,
            },
          },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: "20px",
          fontWeight: 500,
          fontSize: "0.75rem",
          border: `1px solid ${colors.dark[500]}`,
          "&:hover": {
            boxShadow: `0 0 10px ${colors.neon.blue}30`,
          },
        },
        filled: {
          "&.MuiChip-colorPrimary": {
            backgroundColor: colors.neon.blue,
            color: colors.dark[900],
          },
          "&.MuiChip-colorSecondary": {
            backgroundColor: colors.neon.green,
            color: colors.dark[900],
          },
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: `${colors.dark[700]}dd`,
          backdropFilter: "blur(10px)",
          borderBottom: `1px solid ${colors.dark[500]}`,
          boxShadow: `0 4px 20px ${colors.dark[900]}40`,
        },
      },
    },

    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
          color: colors.dark[300],
          "&.Mui-selected": {
            color: colors.neon.blue,
          },
          "&:hover": {
            color: colors.neon.cyan,
          },
        },
      },
    },

    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: colors.neon.blue,
          height: "3px",
          borderRadius: "3px 3px 0 0",
          boxShadow: `0 0 10px ${colors.neon.blue}60`,
        },
      },
    },

    MuiLinearProgress: {
      styleOverrides: {
        root: {
          backgroundColor: colors.dark[600],
          borderRadius: "8px",
          height: "8px",
        },
        bar: {
          borderRadius: "8px",
          background: `linear-gradient(90deg, ${colors.neon.blue}, ${colors.neon.cyan})`,
        },
      },
    },

    MuiSwitch: {
      styleOverrides: {
        root: {
          "& .MuiSwitch-switchBase.Mui-checked": {
            color: colors.neon.blue,
            "& + .MuiSwitch-track": {
              backgroundColor: colors.neon.blue,
            },
          },
        },
      },
    },
  },
});

// Custom theme extensions for MitraVerify
theme.custom = {
  // Neon glow effects
  glows: {
    blue: `0 0 20px ${colors.neon.blue}40`,
    green: `0 0 20px ${colors.neon.green}40`,
    red: `0 0 20px ${colors.risk.red}40`,
    orange: `0 0 20px ${colors.risk.orange}40`,
  },

  // Verification status styles
  verification: {
    verified: {
      color: colors.status.verified,
      background: `${colors.status.verified}10`,
      border: `1px solid ${colors.status.verified}30`,
      glow: `0 0 15px ${colors.status.verified}30`,
    },
    questionable: {
      color: colors.status.questionable,
      background: `${colors.status.questionable}10`,
      border: `1px solid ${colors.status.questionable}30`,
      glow: `0 0 15px ${colors.status.questionable}30`,
    },
    false: {
      color: colors.status.false,
      background: `${colors.status.false}10`,
      border: `1px solid ${colors.status.false}30`,
      glow: `0 0 15px ${colors.status.false}30`,
    },
    processing: {
      color: colors.status.processing,
      background: `${colors.status.processing}10`,
      border: `1px solid ${colors.status.processing}30`,
      glow: `0 0 15px ${colors.status.processing}30`,
    },
  },

  // Layout dimensions
  layout: {
    headerHeight: 64,
    sidebarWidth: 280,
    sidebarCollapsedWidth: 80,
  },

  // Color palette access
  colors,

  // Animation presets
  animations: {
    fadeIn: "fadeIn 0.5s ease-in-out",
    slideUp: "slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    glow: "glow 2s ease-in-out infinite alternate",
  },
};

export default theme;
