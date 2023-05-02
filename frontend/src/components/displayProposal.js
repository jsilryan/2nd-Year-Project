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

    React.useEffect(
        () => {
            if(createdDaysDiff > 1) {
                setPosted(createdDaysDiff)
                if (createdDaysDiff === 1)
                {
                    setPostedUnit("day")
                }
                else {
                    setPostedUnit("days")
                }
            } 
            else if (createdHoursDiff > 1) {
                setPosted(createdHoursDiff)
                if (createdHoursDiff === 1)
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
                if (createdMinDiff === 1)
                {
                    setPostedUnit("minute")
                }
                else {
                    setPostedUnit("minutes")
                }
            }
            else if (createdSecDiff > 0) {
                setPosted(createdSecDiff)
                if (createdSecDiff === 1)
                {
                    setPostedUnit("second")
                }
                else {
                    setPostedUnit("seconds")
                }
            }
            else {
                setPosted(createdMsDiff)
                if (createdMsDiff === 1)
                {
                    setPostedUnit("millisecond")
                }
                else {
                    setPostedUnit("milliseconds")
                }
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
            <h3>{props.description}</h3>
        </div>
    )
}