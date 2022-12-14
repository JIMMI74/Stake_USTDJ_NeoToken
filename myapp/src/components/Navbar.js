import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";
import logo from "../logo.png";

const Navbar = (props) => {
  return (
    <nav className="App-nav">
      <div className="nav-center">
        <div className="nav-header">
          <img src={logo} className="logo" alt="logo" />
          <button className="nav-toggle">
            <i className="fas fa-bars"></i>
          </button>
        </div>

        <ul className="nav-links">
          <li>
            <a className="App-a" href="./index.html">
              home
            </a>
          </li>
          <li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </li>
          <li>
            <li>
              <Link to="/logout">Logout</Link>
            </li>
          </li>
          <li>
            <li>
              <Link to="/user">User</Link>
            </li>
          </li>
          <li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </li>
        </ul>
        <small>
          <p className="App-p">ACCOUNT NUMBER : {props.account} </p>
        </small>

        <ul className="social-icons">
          <a href="https://www.facebook.com">
            <FontAwesomeIcon size="2x" icon={faFacebook} />{" "}
            {/* le size sono in XS LG SX*/}
          </a>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
