import React from "react"

export default function Star(props) {
    let starIcon = props.isFilled ? require("../images/stargold.png") : require("../images/star.png")

    return (
        <img className = "stars" src = {starIcon} onClick = {props.handleClick}/>         
    )
}