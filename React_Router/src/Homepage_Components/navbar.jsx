import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./home";
import Nav from "./nav";
import "./nav.css";
import Dashboard from "./dashboard";
const Navbar = () => {
  return (
    <>
      <Nav />

      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
      </Routes>
    </>
  );
};

export default Navbar;
