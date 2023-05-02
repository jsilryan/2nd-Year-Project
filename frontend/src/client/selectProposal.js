import React from "react";
import * as AiIcons from "react-icons/ai"
import { Link, useNavigate } from "react-router-dom"

export default function SelectProposal(props) {
    const navigate = useNavigate()
    console.log(props.selected)

    const proposalSelection = props.selected
    
    function selectProposal() {
        const body = {
            proposal_selection: true  
        }
        const requestOptions = {
            method: "PUT",
            headers : {
                'content-type' : 'application/json',
                'Authorization' : `Bearer ${props.token}`
            },
            body: JSON.stringify(body)
        }

        fetch(`/proposal/proposals/${props.code}`, requestOptions)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                const alerts = data.message
                alert(alerts)
                navigate("/client/proposals")
                // const reload = window.location.reload()
                // reload()
            })
            .catch((err) => console.log(err));
            props.back()
            props.onRefresh()
            props.handleClick()

    }

    function deselectProposal() {
        const body = {
            proposal_selection: false  
        }
        const requestOptions = {
            method: "PUT",
            headers : {
                'content-type' : 'application/json',
                'Authorization' : `Bearer ${props.token}`
            },
            body: JSON.stringify(body)
        }

        fetch(`/proposal/proposals/${props.code}`, requestOptions)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                const alerts = data.message
                alert(alerts)
                navigate("/client/proposals")
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
                    {
                    proposalSelection === false ?
                    <h2>Are you sure you want to select Proposal {props.code}?</h2>
                    :
                    <h2>Are you sure you want to deselect Proposal {props.code}?</h2>
                    }
                </header>
                <footer>
                    {
                    proposalSelection === false ?
                    <button className="home-link2" onClick={selectProposal}>Select Proposal</button>
                    :
                    <button className="home-link2" onClick={deselectProposal}>Deselect Proposal</button>
                    }
                </footer>
            </div>
        </div>
    )
}