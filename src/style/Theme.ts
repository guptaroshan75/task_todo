import { createTheme } from "@mui/material/styles";
import { CONSTANTS } from "../utils/staticData";

declare module "@mui/material/styles" {
  interface Palette {
    sidebar: {
      lighter: string;
      main: string;
    };
    navbar: {
      main: string;
      contrastText: string;
    };
    button: {
      main: string;
    };
    disabled: {
      main: string;
      text: string;
    };
    brown: {
      contrastText: string;
      dark: string;
    };
  }

  interface PaletteOptions {
    sidebar?: {
      lighter: string;
      main: string;
    };
    navbar?: {
      main: string;
      contrastText: string;
    };
    button?: {
      main: string;
    };
    disabled?: {
      main: string;
      text: string;
    };
    brown?: {
      contrastText: string;
      dark: string;
    };
  }
}

export const theme = (mode: "light" | "dark") => {
  const themeColor =
    localStorage.getItem(CONSTANTS.localStorageTheme) || "#D4902B";

  return createTheme({
    palette: {
      mode,
      primary: {
        main: themeColor,
        light: "#FFDEAD",
      },
      secondary: {
        light: "#FFEACC",
        main: "#D4902B",
      },
      sidebar: {
        lighter: "rgb(255, 225, 225)",
        main: "#D4902B1A",
      },
      navbar: {
        main: "#fff",
        contrastText: "#000",
      },
      button: {
        main: "#FE0000",
      },
      error: {
        main: "#e40808",
      },
      success: {
        main: "#048e3b",
      },
      warning: {
        main: "#ff7b54",
      },
      disabled: {
        main: "#ADADAD",
        text: "#4A5A6BBF",
      },
      brown: {
        contrastText: "#fff",
        dark: "#5E0001",
      },
    },
    typography: {
      fontFamily: ["Public Sans"].join(","),
    },
    components: {
      MuiTypography: {
        styleOverrides: {
          root: {
            fontSize: CONSTANTS.fontSize,
          },
          h3: {
            fontSize: CONSTANTS.fontSizeReg,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: "rgba(100, 100, 111, 0.15) 0px 7px 25px 0px",
          },
        },
      },
      MuiAutocomplete: {
        styleOverrides: {
          option: {
            fontSize: CONSTANTS.fontSize,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              fontSize: CONSTANTS.fontSizeCompany,
            },
            label: {
              fontSize: CONSTANTS.fontSizeCompany,
            },
          },
        },
      },
    },
  });
};