import React from "react"
import NavBar from "./navbar"

interface Props {
  children?: any
}

export default function Root(props: Props) {
  return (
    <div>
      <NavBar />
      <div className="container fixedcontainer">{props.children}</div>
      <footer className="page-footer">
        <div className="container fixedcontainer">
          <hr />
          &copy; 2017 Chain Inc. Built using <a href="http://bcoin.io">
            bcoin
          </a>.
        </div>
      </footer>
    </div>
  )
}
