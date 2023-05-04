import React from "react";
import * as AiIcons from "react-icons/ai"
import { Link, useNavigate } from "react-router-dom"

export default function PainterSignContract(props) {
    const navigate = useNavigate()

    const painterSign = props.painterSign
    
    function selectContract() {
        const body = {
            painter_sign: true  
        }
        const requestOptions = {
            method: "PUT",
            headers : {
                'content-type' : 'application/json',
                'Authorization' : `Bearer ${props.token}`
            },
            body: JSON.stringify(body)
        }

        fetch(`/contract/contract/${props.code}`, requestOptions)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                const alerts = data.message
                alert(alerts)
                props.back()
                props.onContractRefresh()
                props.onRefresh()
                navigate("/painter/contracts/pending")
            })
            .catch((err) => console.log(err));

    }

    function deselectContract() {
        const body = {
            painter_sign: false  
        }
        const requestOptions = {
            method: "PUT",
            headers : {
                'content-type' : 'application/json',
                'Authorization' : `Bearer ${props.token}`
            },
            body: JSON.stringify(body)
        }

        fetch(`/contract/contract/${props.code}`, requestOptions)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                const alerts = data.message
                alert(alerts)
                props.back()
                props.onRefresh()
                props.onContractRefresh()
                navigate("/painter/contracts/pending")
            })
            .catch((err) => console.log(err));
    }

    return (
        <div className="modalBg">
            <div className="modalContainer">
                <header>
                    <AiIcons.AiOutlineClose className="close" onClick={props.back}/>
                    {
                    painterSign === false ?
                    <h2>Are you sure you want to sign Contract {props.code}?</h2>
                    :
                    <h2>Are you sure you want to cancel Contract {props.code}?</h2>
                    }
                </header>
                <footer>
                    {
                    painterSign === false ?
                    <button className="home-link2" onClick={selectContract}>Sign Contract</button>
                    :
                    <button className="home-link2" onClick={deselectContract}>Cancel Contract</button>
                    }
                </footer>
            </div>
        </div>
    )
}