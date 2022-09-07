import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { BrowserRouter as Router } from "react-router-dom";
import MainRoutes from "./routes";

const theme = createTheme();
const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <MainRoutes />
      </Router>
    </ThemeProvider>
  );
};

export default App;
