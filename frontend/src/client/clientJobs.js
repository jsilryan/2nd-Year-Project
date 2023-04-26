import React from 'react'
import { Link } from "react-router-dom"

//Display all jobs with their job title and a part of their description
//On hover -> darken color a bit
//On click it should take me to a page displaying the content of the job
//Register new job button onclick -> takes you to CreateJob 
export default function DisplayJobs(props) {

    return (
        <div className='jobs_display' onClick={props.handleClick}>
            <h2>{props.name}</h2>
            <h3>{props.description}</h3>
        </div>
    )
}