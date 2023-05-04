import React from "react";
import { Link, useNavigate } from "react-router-dom"
import Rate from "./rate";
import * as AiIcons from "react-icons/ai"

export default function RatePainter(props) {
    const [rating, setRating] = React.useState()
    const [token, setToken] = React.useState(() => JSON.parse(localStorage.getItem("REACT_TOKEN_AUTH_KEY")))
    const navigate = useNavigate()
    console.log(props.ratedJob)
    
    const [ratingProps, setRatingProps] = React.useState({
        count: 5,
        color: {
            filled : "#F0CE0A",
            unfilled: "#baa3ba"
        }
    })
    React.useEffect(
        () => {
            console.log(typeof rating)
        }, [rating]
    )
    

    function ratePainter() {
        const body = {
            rating_no: rating  
        }
        const requestOptions = {
            method: "POST",
            headers : {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${token}`
            },
            body: JSON.stringify(body)
        }
        console.log(body)

        fetch(`/rating/client/job/${props.ratedJob}/rating`, requestOptions)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                const alerts = data.message
                alert(alerts)
                navigate("/client/my-jobs/completed")
                // const reload = window.location.reload()
                // reload()
            })
            .catch((err) => console.log(err));

    }

    function onRating(rate) {
        setRating(rate)
    }

    return (
        <div className = "empty-rating">
            <div className="rating_display">
                <h2>Rate your painter:</h2>
                <Rate rating = {rating} onRating = {onRating} ratingProps = {ratingProps}/>
                {
                rating !== "" &&
                <div className="delete">
                    <button onClick = {ratePainter} className="home-link2">Done</button>
                </div>
                }
            </div>
        </div>

    )
}