import React from "react"
import {Link} from "react-router-dom"
import * as FaIcons from "react-icons/fa"
import * as AiIcons from "react-icons/ai"
import { PainterSidebarData } from "./painterSideData"
import PainterSubmenu from "./painterSubmenu"

export default function PainterSidebar(props) {

    let left = props.sidebar ? "0" : "-100%"
    let width = props.sidebar ? "250px" : "auto"

    const styles = {
        width: width
    }
    const styles1 = {
        left: left
    }

    return (
        <div className="sidebar">
            <div className="icon">
                <navicon className="bars" to="">
                    <FaIcons.FaBars className="fa" style = {styles} onClick={props.handleClick}/>
                </navicon>
                <div className="sidebar-nav" style = {styles1}>
                    <wrap className="wrap">
                        <navicon to="">
                            <AiIcons.AiOutlineClose className="fa" onClick={props.handleClick}/>
                        </navicon>
                        {PainterSidebarData.map((item, index)=> {
                            return item.title === "Log Out" ?
                            <PainterSubmenu item={item} key = {index} goToLogin = {props.goToLogin} getPage = {props.getPage}/> :
                            <PainterSubmenu item={item} key = {index}/> 
                        })}
                    </wrap>
                </div>
            </div>
        </div>
    )
}