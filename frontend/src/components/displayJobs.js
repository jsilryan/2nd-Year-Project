import React from 'react'
import { Link } from "react-router-dom"

//Display all jobs with their job title and a part of their description
//On hover -> darken color a bit
//On click it should take me to a page displaying the content of the job
//Register new job button onclick -> takes you to CreateJob 
export default function DisplayJobs(props) {
    const [posted, setPosted] = React.useState()
    const [postedUnit, setPostedUnit] = React.useState()
    const dateStart = new Date(props.start)
    const dateEnd = new Date(props.end)
    const diffMs = Math.abs(dateEnd - dateStart);
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const now = new Date()
    const createdAt = new Date(props.created_at)
    const createdMsDiff = Math.abs(now - createdAt)
    const createdSecDiff = Math.ceil(createdMsDiff / (1000));
    const createdMinDiff = Math.ceil(createdMsDiff / (1000 * 60));
    const createdHoursDiff = Math.ceil(createdMsDiff / (1000 * 60 * 60));
    const createdDaysDiff = Math.ceil(createdMsDiff / (1000 * 60 * 60 * 24)); 

    const [newDesc, setNewDesc] = React.useState()

    React.useEffect(
        () => {
            if(createdDaysDiff > 1) {
                setPosted(createdDaysDiff)
                if (createdDaysDiff < 2)
                {
                    setPostedUnit("day")
                }
                else {
                    setPostedUnit("days")
                }
            } 
            else if (createdHoursDiff > 1) {
                setPosted(createdHoursDiff)
                if (createdHoursDiff < 2)
                {
                    setPostedUnit("hour")
                }
                else {
                    setPostedUnit("hours")
                }
            }
            else if (createdMinDiff > 1) {
                setPosted(createdMinDiff)
                if (createdMinDiff < 2)
                {
                    setPostedUnit("minute")
                }
                else {
                    setPostedUnit("minutes")
                }
            }
            else if (createdSecDiff > 1) {
                setPosted(createdSecDiff)
                if (createdSecDiff < 2)
                {
                    setPostedUnit("second")
                }
                else {
                    setPostedUnit("seconds")
                }
            }
            else {
                setPosted(createdMsDiff)
                if (createdMsDiff < 2)
                {
                    setPostedUnit("millisecond")
                }
                else {
                    setPostedUnit("milliseconds")
                }
            } 
            if (props.description.length <= 100) {
                setNewDesc(props.description)
            } else {
                const words = props.description.split(" ");
                const newSentence = words.slice(0, 30).join(" ")+ "...";
                setNewDesc(newSentence)
            }
        
        }, [now]
    )
    return (
        <div className='jobs_display' onClick={props.handleClick}>
            <h2>{props.name}</h2>
            <div className='job_center'>
                <div className='duration'>
                    <h4>Duration: {diffDays} days.</h4>
                </div>
                <div className='duration'>
                    <h4>Posted: {posted} {postedUnit} ago.</h4>
                </div>
            </div>
            <h3>{newDesc}</h3>
        </div> 
    )
}