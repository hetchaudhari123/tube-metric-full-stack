import { useState, useEffect, useMemo, useContext } from "react";
// react-router components
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";

// Material Dashboard 2 React themes
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";

// Material Dashboard 2 React Dark Mode themes
import themeDark from "assets/theme-dark";
import themeDarkRTL from "assets/theme-dark/theme-rtl";

// RTL plugins
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

// Material Dashboard 2 React routes
import routes from "routes";

// Material Dashboard 2 React contexts
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "context";
// import Landing from "auth/login/Landing";
// Images
import brandWhite from "assets/images/logo-ct.png";
import brandDark from "assets/images/logo-ct-dark.png";

import { setupAxiosInterceptors } from "./services/interceptor";
import ProtectedRoute from "auth/login/ProtectedRoute";
import ForgotPassword from "auth/forgot-password";
import ResetPassword from "auth/reset-password";
// import Login from "auth/login";
import Register from "auth/register";
import { AuthContext } from "context";
import UserProfile from "layouts/user-profile";
import { Helmet } from "react-helmet";
import { useAuth0 } from "@auth0/auth0-react";
import Landing from "auth/login/Landing";
import Dashboard from "layouts/dashboard";
import { useAuth } from "context/AuthContextProvider";
export default function App() {
  // const authContext = useContext(AuthContext);
  // const { user,loginWithRedirect } = useAuth0()
  const { isAuthenticated, loginWithRedirect, logout } = useAuth();
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();

  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    setIsDemo(process.env.REACT_APP_IS_DEMO === "true");
  }, []);

  // Cache for the rtl
  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });

    setRtlCache(cacheRtl);
  }, []);

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Change the openConfigurator state
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  // if the token expired or other errors it logs out and goes to the login page
  const navigate = useNavigate();
  // setupAxiosInterceptors(() => {
  //   authContext.logout();
  //   navigate("/auth/login");
  // });

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }
  
      if (route.route) {
        // Handle protected routes
        if (route.type !== "auth") {
          return (
            <Route
              key={route.key}
              path={route.route}
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                {/* <> */}
                  {route.component}
                {/* </> */}
                 </ProtectedRoute>
              }
            />
          );
        }
  
        // Handle authentication routes (like login, register, etc.)
        if (route.type === "auth") {
          // console.log("I am in...")
          return (
            <Route
              key={route.key}
              path={route.route}
              element={route.component} // No ProtectedRoute wrapper
            />
          );
        }
      }
      return null;
    });
  

  const configsButton = (
    <MDBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.25rem"
      height="3.25rem"
      bgColor="white"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: "pointer" }}
      onClick={handleConfiguratorOpen}
    >
      <Icon fontSize="small" color="inherit">
        settings
      </Icon>
    </MDBox>
  );
  const isLandingPage = pathname === '/';

  return (
    <>
      {isDemo && (
        <Helmet>
          <meta
            name="keywords"
            content="creative tim, updivision, material, node.js json:api, html dashboard, node.js, react, api admin, react node.js, html css dashboard node.js, material dashboard node.js, node.js api, react material dashboard, material admin, react dashboard, react admin, web dashboard, bootstrap 5 dashboard node.js, bootstrap 5, css3 dashboard, bootstrap 5 admin node.js, material dashboard bootstrap 5 node.js, frontend, api dashboard, responsive bootstrap 5 dashboard, api, material dashboard, material node.js bootstrap 5 dashboard, json:api"
          />
          <meta
            name="description"
            content="A free full stack app powered by MUI component library, React and Node.js API, featuring dozens of handcrafted UI elements"
          />
          <meta
            itemProp="name"
            content="Material Dashboard 2 React Node.js by Creative Tim & UPDIVISION"
          />
          <meta
            itemProp="description"
            content="A free full stack app powered by MUI component library, React and Node.js API, featuring dozens of handcrafted UI elements"
          />
          <meta
            itemProp="image"
            content="https://s3.amazonaws.com/creativetim_bucket/products/157/original/react-material-dashboard-nodejs.jpg?1664786816"
          />
          <meta name="twitter:card" content="product" />
          <meta name="twitter:site" content="@creativetim" />
          <meta
            name="twitter:title"
            content="Material Dashboard 2 React Node.js by Creative Tim & UPDIVISION"
          />
          <meta
            name="twitter:description"
            content="A free full stack app powered by MUI component library, React and Node.js API, featuring dozens of handcrafted UI elements"
          />
          <meta name="twitter:creator" content="@creativetim" />
          <meta
            name="twitter:image"
            content="https://s3.amazonaws.com/creativetim_bucket/products/157/original/react-material-dashboard-nodejs.jpg?1664786816"
          />
          <meta property="fb:app_id" content="655968634437471" />
          <meta
            property="og:title"
            content="Material Dashboard 2 React Node.js by Creative Tim & UPDIVISION"
          />
          <meta property="og:type" content="article" />
          <meta
            property="og:url"
            content="https://www.creative-tim.com/live/react-material-dashboard-node.js/"
          />
          <meta
            property="og:image"
            content="https://s3.amazonaws.com/creativetim_bucket/products/157/original/react-material-dashboard-nodejs.jpg?1664786816"
          />
          <meta
            property="og:description"
            content="A free full stack app powered by MUI component library, React and Node.js API, featuring dozens of handcrafted UI elements"
          />
          <meta property="og:site_name" content="Creative Tim" />
        </Helmet>
      )}
      {direction === "rtl" ? (
        <CacheProvider value={rtlCache}>
          <ThemeProvider theme={darkMode ? themeDarkRTL : themeRTL}>
            <CssBaseline />
            {!isLandingPage && layout === "dashboard" && (
              <>
                <Sidenav
                  color={sidenavColor}
                  brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
                  brandName="Material Dashboard 2"
                  routes={routes}
                  onMouseEnter={handleOnMouseEnter}
                  onMouseLeave={handleOnMouseLeave}
                />
                <Configurator />
                {configsButton}
              </>
            )}
            {layout === "vr" && <Configurator />}

            <Routes>
            {/*   <Route path="login" element={<Navigate to="/auth/login" />} />
              <Route path="register" element={<Navigate to="/auth/register" />} />
              <Route path="forgot-password" element={<Navigate to="/auth/forgot-password" />} />
              {getRoutes(routes)} */}
              {/* <Route path="*" element={<Navigate to="/dashboard" />} /> */}
              {/* <Route path="/" element={<Navigate to="/" />} /> */}
              <Route path="dashboard" element={<Navigate to="/dashboard" />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
            
          </ThemeProvider>
        </CacheProvider>
      ) : (
        <ThemeProvider theme={darkMode ? themeDark : theme}>
          <CssBaseline />
          {!isLandingPage && layout === "dashboard" && (
            <>
              <Sidenav
                color={sidenavColor}
                brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
                brandName="Material Dashboard 2"
                routes={routes}
                onMouseEnter={handleOnMouseEnter}
                onMouseLeave={handleOnMouseLeave}
              />
              <Configurator />
              {configsButton}
            </>
          )}
          {layout === "vr" && <Configurator />}
          <Routes>
            {/* <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} /> */}
            {/* <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} /> */}
            <Route
              exact
              path="user-profile"
              element={
                // <ProtectedRoute isAuthenticated={authContext.isAuthenticated}>
                <ProtectedRoute >
                
                  <UserProfile />
                </ProtectedRoute> 
                  // {/* /* </ProtectedRoute> */ */}
              }
              key="user-profile"
            />
    
            <Route
              exact
              path="/"
              element={

                  <Landing />

              }
              key="login"
            />
            <Route
              exact
              path="dashboard"
              element={
                // <Navigate to="/dashboard" />.
                // <ProtectedRoute isAuthenticated={authContext.isAuthenticated}>
                // <ProtectedRoute isAuthenticated={isAuthenticated} value={true}>
                <ProtectedRoute>
                <Dashboard/>
                </ProtectedRoute>
                // {/* // </ProtectedRoute> */}
              }
              key="dashboard"
            />
            {getRoutes(routes)}
            <Route path="*" element={<Navigate to="/dashboard" />} />
            {/* <Route path="*" element={<Navigate to="/dashboard" />} /> */}

          </Routes>
        </ThemeProvider>
      )}
    </>
  );
}
