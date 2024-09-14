import React, { useEffect, useRef, useState } from "react";
import "./navBar.css";
import { useNavigate } from "react-router-dom";


const NavBar = ({ title }) => {

  const navigate = useNavigate()

  const logOut = () => {

    navigate('/')
  }


  return (
    <>
      <div className="logout-container">
        <div className="logout-body">
          <div className="title">{title}</div>
          <button className="logout-func" onClick={() => logOut()}>LogOut</button>
        </div>
      </div>
    </>
  );
};

export default NavBar;
