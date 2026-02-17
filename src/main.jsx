import "./styles/global.css";
import "./styles/variables.css";
import "./styles/layout.css";
import "./styles/table.css";
import "./styles/form.css";
import "./styles/auth.css";


import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const savedTheme = localStorage.getItem("app-theme");
if (savedTheme === "light" || savedTheme === "dark") {
  document.body.setAttribute("data-theme", savedTheme);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
 
