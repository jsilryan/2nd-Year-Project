import React from "react"
import {Link} from "react-router-dom"
import * as FaIcons from "react-icons/fa"
import * as AiIcons from "react-icons/ai"
import * as IoIcons from "react-icons/io"
import * as RiIcons from "react-icons/ri"
import * as GrIcons from "react-icons/gr"
import * as GiIcons from "react-icons/gi"
import {SidebarData} from "./SidebarData"
import Submenu from "./SubMenu"

export default function Sidebar(props) {

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
                        {SidebarData.map((item, index)=> {
                            return item.title === "Log Out" ?
                            <Submenu item={item} key = {index} goToLogin = {props.goToLogin} getPage = {props.getPage}/> :
                            <Submenu item={item} key = {index}/> 
                        })}
                    </wrap>
                </div>
            </div>
        </div>
    )
}