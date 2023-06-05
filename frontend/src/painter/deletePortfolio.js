import React from "react";
import * as AiIcons from "react-icons/ai"
import { Link, useNavigate } from "react-router-dom"

export default function DeletePortfolio(props) {

    const navigate = useNavigate() 
    function deletePortfolio() {
        const requestOptions = {
            method: "DELETE",
            headers : {
                'content-type' : 'application/json',
                'Authorization' : `Bearer ${props.token}`
            }
        }

        fetch(`/portfolio/painter/portfolio`, requestOptions)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                const alerts = data.message
                alert(alerts)
            })
            .catch((err) => console.log(err));
            props.back()
            props.newPort()
    }

    return (
        <div className="modalBg">
            <div className="modalContainer">
                <header>
                    <AiIcons.AiOutlineClose className="close" onClick={props.back}/>
                    <h2>Are you sure you want to delete Portfolio {props.code}?</h2>
                </header>
                <footer>
                    <button className="home-link2" onClick={deletePortfolio}>Delete Portfolio</button>
                </footer>
            </div>
        </div>
    )
}