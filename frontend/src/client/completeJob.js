import React from "react";
import * as AiIcons from "react-icons/ai"
import { Link, useNavigate } from "react-router-dom"

export default function CompleteJob(props) {
    const navigate = useNavigate()
    console.log(props.selected)

    function completeJob() {
        const body = {
            job_completed: true  
        }
        const requestOptions = {
            method: "PUT",
            headers : {
                'content-type' : 'application/json',
                'Authorization' : `Bearer ${props.token}`
            },
            body: JSON.stringify(body)
        }

        fetch(`/job/client/complete-job/${props.code}`, requestOptions)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                const alerts = data.message
                alert(alerts)
                props.getRatedJob(props.code)
                navigate("/ratings")
            })
            .catch((err) => console.log(err));
            props.back()
            props.onRefresh()
            props.handleClick()
    }
    
    function decompleteJob() {
        const body = {
            job_completed: false  
        }
        const requestOptions = {
            method: "PUT",
            headers : {
                'content-type' : 'application/json',
                'Authorization' : `Bearer ${props.token}`
            },
            body: JSON.stringify(body)
        }

        fetch(`/job/client/complete-job/${props.code}`, requestOptions)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                const alerts = data.message
                alert(alerts)
                navigate("/client/my-jobs/confirmed")
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
                    !props.completed ?
                    <h2>Is Job {props.code} Completed?</h2>
                    :
                    <h2>Remove job completion.</h2>
                    }
                </header>
                <footer>
                    {
                    !props.completed ?
                    <button className="home-link2" onClick={completeJob}>Complete Job</button>
                    :
                    <button className="home-link2" onClick={decompleteJob}>Remove Completion</button>
                    }
                </footer>
            </div>
        </div>
    )
}