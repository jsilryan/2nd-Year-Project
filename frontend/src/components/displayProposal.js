import React from "react";

export default function DispProposal(props) {
    const [posted, setPosted] = React.useState()
    const [postedUnit, setPostedUnit] = React.useState()
    const now = new Date()
    const createdAt = new Date(props.proposalDate)
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
                    console.log(createdAt)
                    console.log(createdMinDiff)
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
            else if (createdSecDiff > 0) {
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
                    <h4>Proposal Posted: {posted} {postedUnit} ago.</h4>
                </div>
            </div>
            <h3>{newDesc}</h3>
        </div>
    )
}