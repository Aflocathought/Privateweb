import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { FluentProvider, teamsLightTheme } from "@fluentui/react-components";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <FluentProvider theme={teamsLightTheme}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </FluentProvider>
);
