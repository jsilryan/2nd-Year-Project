import React from "react"
import PainterSidebar from "./painterSidebar"

export default function PainterNav(props) {
    return (
        <nav className="nav">
            <div className="nav-logo">
                <PainterSidebar handleClick = {props.handleClick} sidebar = {props.sidebar} goToLogin = {props.goToLogin} getPage = {props.getPage}/>
                <div className="img">
                    <img src = {require("../images/logo.png")} width = "60px" />
                    <h2>MaRangi</h2>
                </div>
            </div>
            <h4 className="check-jobs">My jobs</h4>
        </nav>
    )
}