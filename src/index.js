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
      [`@media screen and (max-width: 800px)`]: {
        p: {
          fontSize: "0.7rem",
        },
      },
      p: {
        fontSize: { md: "0.7rem", lg: "0.75rem", sm: "0.6rem" },
      },
    }),
  },
  colors: {
    brown: {
      100: "#efeeea",
      200: "#cfccc1",
      300: "#afab98",
      400: "#8f896f",
      500: "#6f6746",
      600: "#4c4527",
      700: "#39341d",
      800: "#262214",
      900: "#13110a",
    },
    brown2: {
      100: "#f5f4ef",
      200: "#e0ddce",
      300: "#ccc7ae",
      400: "#b8b18e",
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
      200: "#efe6c9",
      300: "#e8d9ad",
      400: "#e0cd92",
      500: "#d8bf77",
      600: "#ad9a5f",
      700: "#827347",
      800: "#564d30",
      900: "#2b2618",
    },
    sage: {
      100: "#eef2f0",
      200: "#dee5e1",
      300: "#cdd9d3",
      400: "#bdccc4",
      500: "#acbfb5",
      600: "#8a9991",
      700: "#67736d",
      800: "#454c48",
      900: "#222624",
    },
    green1: {
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
    green2: {
      100: "#e5e8e3",
      200: "#ccd1c7",
      300: "#b2bbaa",
      400: "#99a48e",
      500: "#7f8d72",
      600: "#66715b",
      700: "#4c5544",
      800: "#33382e",
      900: "#191c17",
    },
    green3: {
      100: "#e2e5e3",
      200: "#c5cbc6",
      300: "#a7b2aa",
      400: "#8a988d",
      500: "#6d7e71",
      600: "#57655a",
      700: "#414c44",
      800: "#2c322d",
      900: "#161917",
    },
    teal1: {
      100: "#dde3e3",
      200: "#bbc8c7",
      300: "#9aacaa",
      400: "#78918e",
      500: "#567572",
      600: "#455e5b",
      700: "#344644",
      800: "#222f2e",
      900: "#111717",
    },
    teal2: {
      100: "#d5ddde",
      200: "#abbbbd",
      300: "#82999b",
      400: "#58777a",
      500: "#2e5559",
      600: "#254447",
      700: "#1c3335",
      800: "#122224",
      900: "#091112",
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
