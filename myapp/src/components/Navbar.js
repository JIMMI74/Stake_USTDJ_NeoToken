
import React, {useEffect, useState} from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import logo from '../logo.png'





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
            <a href="./about.html">about</a>
          </li>
          <li>
            <a href="./projects.html">projects</a>
          </li>
          <li>
            <a href="./contact.html">contact</a>
          </li>
        </ul>
        <small>
          <p className="App-p">ACCOUNT NUMBER : {props.account} </p>
        </small>

        <ul className="social-icons">
          <li>
            <a href="https://www.facebook.com">
              <FontAwesomeIcon size="2x" icon={faFacebook} />{" "}
              {/* le size sono in XS LG SX*/}
            </a>
          </li>
          <li>
            <a href="https://www.youtube.com">
              <i className="fab fa-youtube"></i>
            </a>
          </li>
          <li>
            <a href="https://www.twitter.com">
              <i className="fab fa-twitter"></i>
            </a>
          </li>
          <li>
            <a href="https://www.linkedin.com">
              <i className="fab fa-linkedin"></i>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};




export default Navbar;