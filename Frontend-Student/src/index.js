/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "App";
// import { AuthContextProvider } from "context";
import { Auth0Provider } from '@auth0/auth0-react';
// Material Dashboard 2 React Context Provider
import { MaterialUIControllerProvider } from "context";
import AuthContextProvider from "context/AuthContextProvider";
import { YoutubeProvider } from "context/YoutubeContext";
const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
import { useAuth } from "context/AuthContextProvider";
root.render(
  <BrowserRouter>
      <MaterialUIControllerProvider>
        <Auth0Provider
         domain="dev-jqdpzmerrbp60het.us.auth0.com"
         clientId="WdrInfkpicHG5Ci0sB9N51JUOkvVCqWG"
         authorizationParams={{
           //  redirect_uri: window.location.origin
           redirect_uri: 'http://localhost:3000/dashboard',
          }}
          cacheLocation="localstorage" >
           <AuthContextProvider>
           <YoutubeProvider>
          <App />
           </YoutubeProvider>
    </AuthContextProvider>
          </Auth0Provider>
      </MaterialUIControllerProvider>
  </BrowserRouter>
);