import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { BrowserRouter as Router } from "react-router-dom";
import MainRoutes from "./routes";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { injectStore } from "./api";

const theme = createTheme();
injectStore(store);

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Router>
            <MainRoutes />
          </Router>
        </PersistGate>
      </Provider>
    </ThemeProvider>
  );
};

export default App;
