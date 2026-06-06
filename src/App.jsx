import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useState, useEffect } from "react";
import Beranda from "./pages/Beranda/Dashboard";
import Topbar from "./components/Topbar";

import Login from "./pages/Auth/Login";
import GoogleCallback from "./pages/Api/GoogleCallback";
import Signup from "./pages/Auth/Signup";
import Forgot from "./pages/Auth/Forgot/ForgotPassword";
import VerifyOtp from "./pages/Auth/Forgot/VerifyReset";
import ResetPassword from "./pages/Auth/Forgot/ResetPassword";
import Result from "./pages/ResultTest/List";
import Users from "./pages/UserMerchant/List";
import TransactionMethode from "./pages/TransactionMethode/Qris/List";
import RoleUserPermission from "./pages/RoleUserPermission/List";
import RoleUser from "./pages/RoleUser/List";
import Role from "./pages/Role/List";
import Permission from "./pages/Permission/List";
import UserList from "./pages/User/List";
import Cms from "./pages/Web/Cms";
import BlogSetting from "./pages/Web/Cms";
import LandingPage from "./pages/Web/Landing";
import PrivacyPolicy from "./pages/Web/PrivacyPolicy";
import SignupForm from "./pages/Auth/SignupForm";
import OtpForm from "./pages/Auth/OtpForm";
import Setting from "./pages/Setting/Setting";
import Subscribe from "./pages/Subscribe/SubscribeModal";
import PreviewPage  from "./pages/Web/preview/PreviewPage";
import BlogList from "./pages/Web/blog/BlogList";
import BlogDetail from "./pages/Web/blog/BlogDetail";
import NotFound from "./pages/Web/NotFound";
import Cookies from "js-cookie";
import "./App.css";
import RoomClass from './pages/Class/RoomClass';

function ProtectedLayout({ onLogout }) {

  return (
    <div className="app-container">
      <Topbar onLogout={onLogout} />
      <div
        className="content"
        style={{
          paddingTop: "50px",
        }}
      >
        <Routes>
          {/* Default Indonesia routes */}
          <Route path="/setting" element={<Setting />} />
          <Route path="/room-class/list" element={<RoomClass />} />
          <Route path="/user-merchant/list" element={<Users />} />
          <Route path="/result/list" element={<Result />} />
          <Route path="/transaction-methode/qris/list" element={<TransactionMethode />} />
          <Route path="/permission/list" element={<Permission />} />
          <Route path="/role/list" element={<Role />} />
          <Route path="/role_user/list" element={<RoleUser />} />
          <Route path="/role_user_permission/list" element={<RoleUserPermission />} />
          <Route path="/user/list" element={<UserList />} />
          <Route path="/blog/content_setting" element={<Cms />} />
          <Route path="/content/setting" element={<BlogSetting />} />
          <Route path="/subscribe/list" element={<Subscribe />} />
          <Route path="/d/beranda" element={<Beranda />} />
          <Route path="/doc/prosess" element={<Document />} />

          {/* ... semua route lainnya tanpa /id */}

          {/* English routes */}
          <Route path="/en/room-class/list" element={<RoomClass />} />
          <Route path="/en/setting" element={<Setting />} />
          <Route path="/en/user-merchant/list" element={<Users />} />
          <Route path="/en/result/list" element={<Result />} />
          <Route path="/en/transaction-methode/list" element={<TransactionMethode />} />
          <Route path="/en/permission/list" element={<Permission />} />
          <Route path="/en/role/list" element={<Role />} />
          <Route path="/en/role_user/list" element={<RoleUser />} />
          <Route path="/en/role_user_permission/list" element={<RoleUserPermission />} />
          <Route path="/en/user/list" element={<UserList />} />
          <Route path="/en/content_setting" element={<Cms />} />
          <Route path="/en/blog/setting" element={<BlogSetting />} />
          <Route path="/en/subscribe/list" element={<Subscribe />} />
          <Route path="/en/preview" element={<PreviewPage  />} />
          <Route path="/en/d/beranda" element={<Beranda />} />
          <Route path="/en/doc/prosess" element={<Document />} />


          {/* ... semua route English dengan /en */}

          {/* Redirect default root */}
          <Route path="/" element={<Navigate to="/d/beranda" replace />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // default language = id
  const currentLang = location.pathname.startsWith("/en") ? "en" : "id";

  useEffect(() => {
    const accessToken = Cookies.get("token");
    const refreshToken = Cookies.get("refresh_token");
    if (accessToken || refreshToken) {
      setToken(accessToken || refreshToken);
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = () => {
    const accessToken = Cookies.get("token");
    const refreshToken = Cookies.get("refresh_token");
    if (accessToken || refreshToken) {
      setToken(accessToken || refreshToken);
    }
  };

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("refresh_token");
    localStorage.clear();
    setToken(null);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Routes>
      {/* Root */}
      <Route
        path="/"
        element={
          token ? (
            <Navigate to="/d/beranda" replace />
          ) : (
            <LandingPage />
          )
        }
      />

      {/* Public routes */}
        <Route path="/api/google/callback" element={<GoogleCallback />} />
    <Route path="/en/auth/google/callback" element={<GoogleCallback />} />
    
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/signup/form" element={<SignupForm />} />
      <Route path="/signup/otp" element={<OtpForm />} />
      <Route path="/forgot-password" element={<Forgot />} />
      <Route path="/verify-reset" element={<VerifyOtp />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/blog" element={<BlogList />} />
      <Route path="/blog/:slug" element={<BlogDetail />} />
      <Route path="/:merchant_slug" element={<PreviewPage  />} />

      {/* English routes */}
      <Route path="/en" element={<LandingPage />} />
      <Route path="/en/privacy" element={<PrivacyPolicy />} />
      <Route path="/en/signup/form" element={<SignupForm />} />
      <Route path="/en/signup/otp" element={<OtpForm />} />
      <Route path="/en/forgot-password" element={<Forgot />} />
      <Route path="/en/verify-reset" element={<VerifyOtp />} />
      <Route path="/en/reset-password" element={<ResetPassword />} />
      <Route path="/en/blog" element={<BlogList />} />
      <Route path="/en/blog/:slug" element={<BlogDetail />} />
      <Route path="/en/:merchant_slug" element={<PreviewPage  />} />

      {/* Auth routes */}
      <Route
        path="/login"
        element={token ? <Navigate to="/d/beranda" replace /> : <Login onLogin={handleLoginSuccess} />}
      />
      <Route
    path="/en/login"
    element={
      token ? <Navigate to="/end/d/beranda" replace /> : <Login onLogin={handleLoginSuccess} />
    }
  />
      <Route
        path="/signup"
        element={token ? <Navigate to="/d/beranda" replace /> : <Signup />}
      />
      <Route
        path="/en/signup"
        element={token ? <Navigate to="/en/beranda" replace /> : <Signup />}
      />

      {/* Protected routes */}
      {token && <Route path="*" element={<ProtectedLayout onLogout={() => {Cookies.remove("token"); setToken(null)}}  />} />}


      {/* Jika user belum login dan buka route protected */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
}

export default function RootApp() {
  return (
    <Router>
      <main id="main-content">
        <App />
      </main>
    </Router>
  );
}
