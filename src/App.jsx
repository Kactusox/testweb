import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./homepage/home";
import Pages from "./pages/pages";
import About from "./pages/about";
import Contact from "./pages/contact";
import Layout from "./navigation/Layout";
import Login from "./registrationpages/login";
import Signin from "./registrationpages/signin";
import CarDetails from "./pages/searchresult";
import CarManagement from "./adminpage/adminCarManagement";
import Inbox from "./adminpage/admininbox";
import PrivateRoutes from "./components/PrivateRoutes";
import ScrollToTop from "./components/ScrollToTop";
import AdminDashboard from './adminpage/Admindashboard'
import AdminCompany from "./adminpage/AdminCompany";
import UserManagement from "./adminpage/usermanagement";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="App">
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/pages" element={<Pages />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/searchresult" element={<CarDetails />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/signin" element={<Signin />} />

          <Route element={<PrivateRoutes />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin-company" element={<AdminCompany />} />
            <Route path="/admin-car" element={<CarManagement />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/inbox" element={<Inbox />} />
          </Route>

        </Routes>
      </div>
    </Router>
  );
}

export default App;
// npm install -g npm@latest