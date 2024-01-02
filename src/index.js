import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { HashRouter } from "react-router-dom";

const theme = extendTheme({
  fonts: {
    body: "Poppins",
  },
  styles: {
    global: (props) => ({
      body: {
        color: "default",
        bg: "linear-gradient(#dde3e3, #f7f2e4)",
      },
      p: {
        fontSize: { md: "0.7rem", lg: "0.9rem", sm: "0.6rem" },
      },
    }),
  },
  colors: {
    brown: {
      100: "#dfddd6",
      200: "#bfbbad",
      300: "#a09a83",
      400: "#80785a",
      500: "#605631",
      600: "#4d4527",
      700: "#3a341d",
      800: "#262214",
      900: "#13110a",
    },
    brown2: {
      100: "#ebe9df",
      200: "#d6d2be",
      300: "#c2bc9e",
      400: "#ada57d",
      500: "#998f5d",
      600: "#7a724a",
      700: "#5c5638",
      800: "#3d3925",
      900: "#1f1d13",
    },
    orange: {
      100: "#f6ece1",
      200: "#edd9c2",
      300: "#e4c6a4",
      400: "#dbb385",
      500: "#d2a067",
      600: "#a88052",
      700: "#7e603e",
      800: "#544029",
      900: "#2a2015",
    },
    yellow: {
      100: "#f7f2e4",
      200: "#efe5c8",
      300: "#e8d9ad",
      400: "#e0cc91",
      500: "#d8bf76",
      600: "#ad995e",
      700: "#827347",
      800: "#564c2f",
      900: "#2b2618",
    },
    sage: {
      100: "#eff2f0",
      200: "#dee5e1",
      300: "#ced9d3",
      400: "#bdccc4",
      500: "#adbfb5",
      600: "#8a9991",
      700: "#68736d",
      800: "#454c48",
      900: "#232624",
    },
    green: {
      100: "#ebede8",
      200: "#d7dad2",
      300: "#c2c8bb",
      400: "#aeb5a5",
      500: "#9aa38e",
      600: "#7b8272",
      700: "#5c6255",
      800: "#3e4139",
      900: "#1f211c",
    },
    teal: {
      100: "#dde3e3",
      200: "#bbc8c7",
      300: "#99acaa",
      400: "#77918e",
      500: "#557572",
      600: "#445e5b",
      700: "#334644",
      800: "#222f2e",
      900: "#111717",
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
