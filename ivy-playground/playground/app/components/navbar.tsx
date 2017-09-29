// external imports
import React from "react"
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import ReactTooltip from "react-tooltip"

// internal imports
import Reset from "./reset"

const logo = require("../../static/images/logo.png")

const mapStateToProps = state => {
  const location = state.routing.location
  if (!location) {
    return { path: "lock" }
  }

  const pathname = location.pathname.split("/")
  if (pathname[1] === "ivy") {
    pathname.shift()
  }
  return { path: pathname[1] }
}

const Navbar = (props: { path: string }) => {
  return (
    <nav className="navbar navbar-inverse navbar-static-top">
      <div className="container fixedcontainer">
        <div className="navbar-header">
          <a className="navbar-brand" href={"/"}>
            <img src={logo} />
          </a>
        </div>
        <ReactTooltip
          id="seedButtonTooltip"
          place="bottom"
          type="error"
          effect="solid"
        />
        <ul className="nav navbar-nav navbar-right">
          <li>
            <Link to="/">Create Contract</Link>
          </li>
          <li>
            <Link to="/spend">Spend Contract</Link>
          </li>
          <Reset />
        </ul>
      </div>
    </nav>
  )
}

export default connect(mapStateToProps)(Navbar)
