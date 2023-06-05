import React from "react";
import * as AiIcons from "react-icons/ai"
import { Bar } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend 
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

export default function Ratings(props) {

    const [data, setData] = React.useState()

    const ratingNumbers = [
        1,2,3,4,5
    ]

    console.log(props.ratings)

    React.useEffect (
        () => {
            if (props.ratings) {
                const newData = props.ratings.map (rating => {
                    const jobNumber = {
                        newRating: rating.rating_no,
                        jobID : rating.job_id
                    }
                    return {
                        ...jobNumber
                    }
                })

                const dataRating = newData.reduce((acc, rates) => {
                    const {newRating} = rates
                    if (acc[newRating]) {
                        acc[newRating] += 1
                    }
                    else {
                        acc[newRating] = 1
                    }
                    return acc
                }, {})

                setData(dataRating)
            }
        }, [props.ratings]
    )
    
    return (
        <div className="job">
            <div className="side">
                <AiIcons.AiOutlineClose className="close" onClick={props.handleClick}/>
            </div>
            <div className="job_display">
                <div className="header">
                    <h2>Your Ratings</h2>
                </div>
                <div>
                    {
                    props.ratings && props.ratings.length > 0 ?
                    <div>
                        <h3>Jobs per Rating:</h3>
                        <div className="App" style={{ width: "600px", height: "400px" }}>
                            <Bar 
                                data = {{
                                    labels: ratingNumbers,
                                    datasets: [
                                        {
                                            label: "Number of Jobs",
                                            data: ratingNumbers.map((rating) => data && data[rating] ? data[rating] : 0),
                                            backgroundColor: [
                                              "rgba(255, 99, 132, 0.6)",
                                              "rgba(54, 162, 235, 0.6)",
                                              "rgba(255, 206, 86, 0.6)",
                                              "rgba(75, 192, 192, 0.6)",
                                              "rgba(153, 102, 255, 0.6)",
                                            ],
                                        }
                                    ]
                                }}
                            /> 
                        </div> 
                    </div> 
                    :
                    <div>
                        <h3 style = {{fontWeight : "normal"}}>You have not completed any job yet to get ratings!</h3>
                    </div>   
                    }  
                
                </div>
            </div>
        
        </div>
    )
}