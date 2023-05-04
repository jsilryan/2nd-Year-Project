import React from "react";
import * as AiIcons from "react-icons/ai"
import { Link, useNavigate } from "react-router-dom"

export default function DeleteContract(props) {

    const navigate = useNavigate() 
    function deleteContract() {
        const requestOptions = {
            method: "DELETE",
            headers : {
                'content-type' : 'application/json',
                'Authorization' : `Bearer ${props.token}`
            }
        }

        fetch(`/contract/contract/${props.code}`, requestOptions)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                const alerts = data.message
                alert(alerts)
                navigate("/client/contracts/pending")
                // const reload = window.location.reload()
                // reload()
            })
            .catch((err) => console.log(err));

        props.back()
        props.onRefresh()
    }

    return (
        <div className="modalBg">
            <div className="modalContainer">
                <header>
                    <AiIcons.AiOutlineClose className="close" onClick={props.back}/>
                    <h2>Are you sure you want to delete Contract {props.code}?</h2>
                </header>
                <footer>
                    <button className="home-link2" onClick={deleteContract}>Delete Contract</button>
                </footer>
            </div>
        </div>
    )
}