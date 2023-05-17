import React from "react";
import * as AiIcons from "react-icons/ai"
import { Link, useNavigate } from "react-router-dom"

export default function DeleteProposal(props) {

    const navigate = useNavigate() 
    function deleteProposal() {
        const requestOptions = {
            method: "DELETE",
            headers : {
                'content-type' : 'application/json',
                'Authorization' : `Bearer ${props.token}`
            }
        }

        fetch(`/proposal/proposals/${props.code}`, requestOptions)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                const alerts = data.message
                alert(alerts)
                navigate("/painter/bid-jobs")
                // const reload = window.location.reload()
                // reload()
            })
            .catch((err) => console.log(err));

        props.back()
        props.onRefresh()
        props.handleClick()
    }

    return (
        <div className="modalBg">
            <div className="modalContainer">
                <header>
                    <AiIcons.AiOutlineClose className="close" onClick={props.back}/>
                    <h2>Are you sure you want to delete Proposal {props.code}?</h2>
                </header>
                <footer>
                    <button className="home-link2" onClick={deleteProposal}>Delete Proposal</button>
                </footer>
            </div>
        </div>
    )
}