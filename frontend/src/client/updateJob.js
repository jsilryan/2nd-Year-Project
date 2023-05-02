import React from "react";
import * as AiIcons from "react-icons/ai"
import { useNavigate } from "react-router-dom"

export default function UpdateJob(props) {
    const Prop_Location = props.job.property_location
    const Property_Type = props.job.property_type
    const Job_Type = props.job.job_type
    const propLoc = Prop_Location ? Prop_Location.replace("Prop_Location.", "") : ''
    const propType = Property_Type ? Property_Type.replace("Property_Type.", "") : ''
    const jobType = Job_Type ? Job_Type.replace("Job_Type.", "") : ''

    const [jobForm, setJobForm] = React.useState({
        jobName : props.job.job_name,
        jobDescription : props.job.job_description,
        propLocation : propLoc,
        propType : propType,
        jobType : jobType,
        totalFloors : props.job.total_floors,
        totalRooms : props.job.total_rooms,
        startDate: props.job.start_date,
        endDate : props.job.end_date,
        maxProposals : props.job.max_proposals
    })

    let left = props.sidebar ? "250px" : "auto"

    const styles1 = {
        marginLeft: left
    }


    const navigate = useNavigate() 
    const [token, setToken] = React.useState(() => JSON.parse(localStorage.getItem("REACT_TOKEN_AUTH_KEY")))
    const [emptyFields, setEmpty] = React.useState([])
    const [submittedEmpty, setSubmittedEmpty] = React.useState([])
    const [correctEntry, setCorrectEntry] = React.useState(false)
    const [lenName, setLenName] = React.useState(true)
    const [lenDesc, setLenDesc] = React.useState(true)
    const [checkStart, setCheckStart] = React.useState(true)
    const [checkEnd, setCheckEnd] = React.useState(true)

    const styles = {
        border : "1px",
        borderColor: "red",
        borderStyle: "solid",
        marginBottom: "-1px"
    }

    function checkEmpty() {
        let empty = [] 
        if (jobForm.jobName === "") {
            empty.push("jobName")
        }
        if (jobForm.jobDescription === "") {
            empty.push("jobDescription")
        }
        if (jobForm.propLocation === "") {
            empty.push("propLocation")
        }
        if (jobForm.propType === "") {
            empty.push("propType")
        }
        if (jobForm.jobType === "") {
            empty.push("jobType")
        }
        if (jobForm.totalFloors === "") {
            empty.push("totalFloors")
        }
        if (jobForm.totalRooms === "") {
            empty.push("totalRooms")
        }
        if (jobForm.startDate === "") {
            empty.push("startDate")
        }
        if (jobForm.endDate === "") {
            empty.push("endDate")
        }
        if (jobForm.maxProposals === "") {
            empty.push("maxProposals")
        }
        setEmpty(empty)
    }

    function checkCred() {
        setSubmittedEmpty(emptyFields)
        if (emptyFields.length === 0)
        {
            if (jobForm.jobName.length <= 100)
            {
                if (jobForm.jobDescription.length <= 1000)
                {
                    if (jobForm.startDate >= new Date().toISOString().slice(0, 10))
                    {
                        if (jobForm.endDate > new Date().toISOString().slice(0, 10))
                        {
                            if (jobForm.endDate > jobForm.startDate) 
                            {
                                setCorrectEntry(true)
                            }
                            else {
                                alert("End Date cannot come before Start Date!")
                                setCheckEnd(false)
                            }
                        } else {
                            alert("End Date cannot come before Current Date!")
                            setCheckEnd(false)
                        }
                    } else {
                        alert("Start Date cannot come before Current Date!")
                        setCheckStart(false)
                    }
                } else {
                    alert("Job Description Date has to be below 1000 characters")
                    setLenDesc(false)
                }
            } else {
                alert("Job Name has to be below 100 characters!")
                setLenName(false)
            }
        } else {
            console.log("The following fields are empty: ", emptyFields)
            alert("Fill in all required fields!")
        }
    }

    function completeJobForm() {
        setJobForm ({
            jobName : "",
            jobDescription : "",
            propLocation : "",
            propType : "",
            jobType : "",
            totalFloors : "",
            totalRooms : "",
            startDate: "",
            endDate : "",
            maxProposals : ""
        })
        setCorrectEntry(false)
    }

    React.useEffect(
        () => {
            console.log(jobForm)
            checkEmpty()
            if (jobForm.jobName.length <= 100)
            {
                setLenName(true)
            }
            if (jobForm.jobDescription.length <= 1000)
            {
                setLenDesc(true)
            }
            if (jobForm.startDate >= new Date().toISOString().slice(0, 10))
            {
                setCheckStart(true)
            }
            if (jobForm.endDate > new Date().toISOString().slice(0, 10))
            {
                setCheckEnd(true)
            }
            if (jobForm.endDate > jobForm.startDate) 
            {
                setCheckEnd(true)
            }

        }, [jobForm]
    )

    function updateValues(event) {
        const {name, value}= event.target
        setJobForm (
            prevData => {
                return {
                    ...prevData,
                    [name] : value
                }
            }
        )
    }

    function handleSubmit(event) {
        event.preventDefault()
        console.log(jobForm)

        if (correctEntry) {
            const body = {
                job_name: jobForm.jobName,
                job_description: jobForm.jobDescription,
                property_location: jobForm.propLocation,
                property_type: jobForm.propType,
                job_type: jobForm.jobType,
                total_floors: jobForm.totalFloors,
                total_rooms: jobForm.totalRooms,
                start_date: jobForm.startDate,
                end_date: jobForm.endDate,
                max_proposals: jobForm.maxProposals
            }

            const requestOptions = {
                method: "PUT",
                headers: {
                  "content-type": "application/json", //Gives description of the data I'll send
                  'Authorization' : `Bearer ${token}`
                },
                body: JSON.stringify(body)
              }
            
            fetch(`/job/client/job/${props.code}`, requestOptions)
              .then(res => res.json())
              .then(data => {
                    console.log(data)
                    const alerts = data.message
                    alert(alerts)
                    navigate("/client/my-jobs")
                    completeJobForm()
                    props.onJobRefresh()
                    props.onRefresh()
                    closeModal()
                    // const reload = window.location.reload()
                    // reload()
              })
              .catch((err) => console.log(err));
        }
    }

    function closeModal() {
        props.closeModal(false)
    }
    return (
            <div className="job">
                <div className="side">
                    <AiIcons.AiOutlineClose className="close" onClick={closeModal}/>
                </div>
                <div className="form_display">                    
                    <form className="form" onSubmit={handleSubmit}>
                        <h2 className="form-title">Update Job:</h2>
                        <input
                            id = "jobName"
                            type = "text"
                            placeholder = "Job Name"
                            name = "jobName"
                            value = {jobForm.jobName}
                            onChange={updateValues}
                            style = {(submittedEmpty.includes("jobName")) ? styles : null}
                        />
                        {
                            (submittedEmpty.includes("jobName")) && 
                            <div>
                                <span style={{color: "red"}}>Job Name is required!</span>
                            </div>
                        }
                        {
                            (!lenName) &&
                            <div>
                                <span style={{color: "red"}}>Job name field has more than 100 characters!</span>
                            </div>
                        }
                        {
                            (submittedEmpty.includes("jobName") || !lenName) && 
                            <br/>
                        }
                        <fieldset
                            style = {(submittedEmpty.includes("jobDescription")) ? styles : null}
                        >
                            <legend>Job Description</legend>
                            <textarea 
                                id = "jobDescription"
                                type = "text"
                                placeholder="Job Description"
                                name="jobDescription"
                                value={jobForm.jobDescription}
                                onChange={updateValues}
                                style = {(submittedEmpty.includes("jobDescription")) ? styles : null}
                                className="job-desc"
                            />
                        </fieldset>
                        {
                            (submittedEmpty.includes("jobDescription")) && 
                            <div>
                                <span style={{color: "red"}}>Job Description is required!</span>
                            </div>
                        }
                        {
                            (!lenDesc) &&
                            <div>
                                <span style={{color: "red"}}>Job Description field has more than 1000 characters!</span>
                            </div>
                        }
                        {
                            (submittedEmpty.includes("jobDescription") || !lenDesc) && 
                            <br/>
                        }
                        <fieldset
                            style = {(submittedEmpty.includes("propLocation")) ? styles : null}
                        >
                            <legend>Property Location</legend>
                            <select 
                                id="propLocation" 
                                name="propLocation" 
                                value={jobForm.propLocation} 
                                className="area"
                                onChange={updateValues}
                                style={(submittedEmpty.includes("propLocation")) ? styles : null}
                            >
                                <option value="">--Choose--</option>
                                <option value="DagorettiNorth" selected={jobForm.propLocation === "DagorettiNorth"}>Dagoretti North</option>
                                <option value="DagorettiSouth" selected={jobForm.propLocation === "DagorettiSouth"}>Dagoretti South</option>
                                <option value="EmbakasiCentral" selected={jobForm.propLocation === "EmbakasiCentral"}>Embakasi Central</option>
                                <option value="EmbakasiEast" selected={jobForm.propLocation === "EmbakasiEast"}>Embakasi East</option>
                                <option value="EmbakasiNorth" selected={jobForm.propLocation === "EmbakasiNorth"}>Embakasi North</option>
                                <option value="EmbakasiSouth" selected={jobForm.propLocation === "EmbakasiSouth"}>Embakasi South</option>
                                <option value="EmbakasiWest" selected={jobForm.propLocation === "EmbakasiWest"}>Embakasi West</option>
                                <option value="Kamukunji" selected={jobForm.propLocation === "Kamukunji"}>Kamukunji</option>
                                <option value="Kasarani" selected={jobForm.propLocation === "Kasarani"}>Kasarani</option>
                                <option value="Kibra" selected={jobForm.propLocation === "Kibra"}>Kibra</option>
                                <option value="Langata" selected={jobForm.propLocation === "Langata"}>Lang'ata</option>
                                <option value="Makadara" selected={jobForm.propLocation === "Makadara"}>Makadara</option>
                                <option value="Mathare" selected={jobForm.propLocation === "Mathare"}>Mathare</option>
                                <option value="NairobiCentral" selected={jobForm.propLocation === "NairobiCentral"}>Nairobi Central</option>
                                <option value="Roysambu" selected={jobForm.propLocation === "Roysambu"}>Roysambu</option>
                                <option value="Ruaraka" selected={jobForm.propLocation === "Ruaraka"}>Ruaraka</option>
                                <option value="Starehe" selected={jobForm.propLocation === "Starehe"}>Starehe</option> 
                                <option value="Westlands" selected={jobForm.propLocation === "Westlands"}>Westlands</option> 
                            </select>

                        </fieldset>
                        {
                            (submittedEmpty.includes("propLocation")) && 
                            <div>
                                <span style={{color: "red"}}>Property Location is required!</span>
                            </div>
                        }

                        {
                            (submittedEmpty.includes("propLocation")) && 
                            <br/>
                        }
                        <fieldset
                            style = {(submittedEmpty.includes("propType")) ? styles : null}
                        
                        >
                            <legend>Property Type</legend>
                            <select
                                id="propType"
                                name="propType"
                                value={jobForm.propType}
                                onChange={updateValues}
                                className="area"
                            >
                                <option value="">--Choose--</option>
                                <option value="Residential">Residential</option>
                                <option value="Commercial">Commercial</option>
                                <option value="Industrial">Industrial</option>
                                <option value="Institutional">Institutional</option>
                            </select>

                        </fieldset>
                        {
                            (submittedEmpty.includes("propType")) && 
                            <div>
                                <span style={{color: "red"}}>Property Type is required!</span>
                            </div>
                        }

                        {
                            (submittedEmpty.includes("propType")) && 
                            <br/>
                        }
                        <fieldset
                            style = {(submittedEmpty.includes("jobType")) ? styles : null}
                        >
                            <legend>Job Type</legend>
                            <select
                                id = "jobType"
                                name = "jobType"
                                value = {jobForm.jobType}
                                onChange={updateValues}
                                className="area"
                                style = {(submittedEmpty.includes("jobType")) ? styles : null}
                            >
                                <option value="">--Choose--</option>
                                <option value="Exterior">Exterior</option>'
                                <option value="Interior">Interior</option>'
                                <option value="Both">Both</option>'
                            </select>
                        </fieldset>
                        {
                            (submittedEmpty.includes("jobType")) && 
                            <div>
                                <span style={{color: "red"}}>Job Type is required!</span>
                            </div>
                        }

                        {
                            (submittedEmpty.includes("jobType")) && 
                            <br/>
                        }

                        <input 
                            id="totalFloors"
                            name="totalFloors"
                            placeholder="Total Floors"
                            type="number"
                            value={jobForm.totalFloors}
                            onChange={updateValues}
                            style = {(submittedEmpty.includes("totalFloors")) ? styles : null}
                        />
                        {
                            (submittedEmpty.includes("totalFloors")) && 
                            <div>
                                <span style={{color: "red"}}>Total Floors is required!</span>
                            </div>
                        }

                        {
                            (submittedEmpty.includes("totalFloors")) && 
                            <br/>
                        }

                        <input 
                            id="totalRooms"
                            name="totalRooms"
                            placeholder="Total Rooms"
                            type="number"
                            value={jobForm.totalRooms}
                            onChange={updateValues}
                            style = {(submittedEmpty.includes("totalRooms")) ? styles : null}
                        />
                        {
                            (submittedEmpty.includes("totalRooms")) && 
                            <div>
                                <span style={{color: "red"}}>Total Rooms is required!</span>
                            </div>
                        }

                        {
                            (submittedEmpty.includes("totalRooms")) && 
                            <br/>
                        }
                        <div >
                            <fieldset 
                                style = {(submittedEmpty.includes("startDate")) ? styles : null}
                            >
                                <legend>Start Date</legend>
                                <input 
                                    id="startDate"
                                    name="startDate"
                                    type="date"
                                    value={jobForm.startDate}
                                    onChange={updateValues}
                                    style = {(submittedEmpty.includes("startDate")) ? styles : null}
                                />
                            </fieldset>
                            <fieldset 
                                style = {(submittedEmpty.includes("endDate")) ? styles : null}
                            >
                                <legend>End Date</legend>
                                <input 
                                    id="endDate"
                                    name="endDate"
                                    type="date"
                                    value={jobForm.endDate}
                                    onChange={updateValues}
                                    style = {(submittedEmpty.includes("endDate")) ? styles : null}
                                />
                            </fieldset>
                        </div>
                        {
                            (submittedEmpty.includes("startDate") || submittedEmpty.includes("endDate")) &&
                            <div>
                                <span style={{color: "red"}}>Start date and End date fields are required!</span>
                            </div>
                        }
                        {
                            (!checkStart) &&
                            <div>
                                <span style={{color: "red"}}>
                                    Start Date cannot come before the Current Date. 
                                </span>
                            </div>
                        }
                        {
                            (!checkEnd) &&
                            <div>
                                <span style={{color: "red"}}>
                                    End Date cannot come before Start Date or Current Date.
                                </span>
                            </div>
                        }
                        {
                            (submittedEmpty.includes("startDate") || submittedEmpty.includes("endDate") || !checkStart || !checkEnd) &&
                            <br/>
                        }
                        <input 
                            id = "maxProposals"
                            name = "maxProposals"
                            placeholder="Maximum number of Proposals"
                            type="number"
                            value={jobForm.maxProposals}
                            onChange={updateValues}
                            style = {(submittedEmpty.includes("maxProposals")) ? styles : null}
                        />

                        {
                            (submittedEmpty.includes("maxProposals")) && 
                            <div>
                                <span style={{color: "red"}}>Maximum Proposals Number is required!</span>
                            </div>
                        }

                        {
                            (submittedEmpty.includes("maxProposals")) && 
                            <br/>
                        }
                    
                        <div className="submit">
                            <button className="home-link2" onClick={checkCred}>Submit</button>
                        </div>
                    </form>
                </div>
            </div>
    )
}