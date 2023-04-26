import React from "react"
import {Link} from "react-router-dom"

export default function PainterSubmenu(props) {

    const [subnav, setSubnav] = React.useState(false)

    function showSubnav () {
        setSubnav(!subnav)
    }

    return (
        <div>
            <Link
                className="sidebar-link" to = {props.item.path} 
                onClick={
                    props.getPage ?
                    props.goToLogin :
                    props.item.subnav && showSubnav 
                }
            >
                <div>
                    {props.item.icon}
                    <label className="sidebar-label">
                        {props.item.title}
                    </label>
                </div>
                <div>
                    {
                    props.item.subnav && subnav 
                        ? props.item.iconOpened 
                        : props.item.subnav 
                        ? props.item.iconClosed 
                        : null
                    }
                </div>
            </Link>
            {
                subnav && props.item.subnav.map((item, index) => {
                    return (
                        <Link to = {item.path} className="dropdown-link" key={index}>
                            {item.icon}
                            <label className="sidebar-label">
                                {item.title}
                            </label>
                        </Link>
                    )
                })
            }
        </div>
    )
}