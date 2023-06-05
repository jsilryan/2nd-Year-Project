import React from "react";
import { useNavigate } from "react-router-dom";
import * as AiIcons from "react-icons/ai"

export default function CreateContract(props) {
    const [contractForm, setContractForm] = React.useState({
        materials : "",
        exteriorLumpsum : "",
        interiorPreparation : "",
        interiorFinishing : "",
        totalPaymentAmount : "",
        clientSign: false
    })
    const [job, setJob] = React.useState(null)

    let left = props.sidebar ? "250px" : "auto"

    const styles1 = {
        marginLeft: left
    }

    const navigate = useNavigate() 
    const [token, setToken] = React.useState(() => JSON.parse(localStorage.getItem("REACT_TOKEN_AUTH_KEY")))
    const [emptyFields, setEmpty] = React.useState([])
    const [submittedEmpty, setSubmittedEmpty] = React.useState([])
    const [correctEntry, setCorrectEntry] = React.useState(false)
    const [disabled, setDisabled] = React.useState(false)

    const now = new Date()

    const jobRequestOptions = {
        method : "GET",
        headers : {
            'content-type' : 'application/json',
            'Authorization' : `Bearer ${token}`
        }
    }
    let link = "/job/job/"
    let code = props.jsc
    let url = link + code

    React.useEffect (
        () => {
            fetch(url, jobRequestOptions)
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    setJob(data)
                })
                .catch(err => console.log(err))
        }, []
    )
    const Prop_Location = job && job.property_location
    const Property_Type = job && job.property_type
    const Job_Type = job && job.job_type
    const Contract_Type = job && job.contract_type

    const propLoc = job && Prop_Location ? Prop_Location.replace("Prop_Location.", "") : ''
    const propType = job && Property_Type ? Property_Type.replace("Property_Type.", "") : ''
    const jobType = job && Job_Type ? Job_Type.replace("Job_Type.", "") : '' 
    const contractType = Contract_Type ? Contract_Type.replace("Contract_Type.", "") : ''

    const styles = {
        border : "1px",
        borderColor: "red",
        borderStyle: "solid",
        marginBottom: "-1px"
    }

    function checkEmpty() {
        let empty = [] 
        if (contractForm.totalPaymentAmount === "") {
            empty.push("totalPaymentAmount")
        }
        if (contractForm.clientSign === "") {
            empty.push("clientSign")
        }
        if (job && job.contract_type === "Contract_Type.material") {
            if (contractForm.materials === ""){
                empty.push("materials")
            }
        }
        if (job && job.job_type === "Job_Type.exterior" || job && job.job_type === "Job_Type.both") {
            if (contractForm.exteriorLumpsum === "") {
                empty.push("exteriorLumpsum")
            }
        }
        if (job && job.job_type === "Job_Type.interior" || job && job.job_type === "Job_Type.both") {
            if (contractForm.interiorPreparation === "") {
                empty.push("interiorPreparation")
            }
            if (contractForm.interiorFinishing === "") {
                empty.push("interiorFinishing")
            }
        }
        setEmpty(empty)
    }

    function checkCred() {
        setSubmittedEmpty(emptyFields)
        if (emptyFields.length === 0)
        {
            setCorrectEntry(true)
        }
        else {
            console.log("The following fields are empty: ", emptyFields)
            alert("Fill in all required fields!")
        }
    }

    function completeContractForm() {
        setContractForm ({
            materials : "",
            exteriorLumpsum : "",
            interiorPreparation : "",
            interiorFinishing : "",
            totalPaymentAmount : "",
            clientSign : false
        })
        setCorrectEntry(false)
    }

    const units = job && job.total_rooms
    function totalAmount() {
        let totalPayment, sum
        if (job && job.job_type === "Job_Type.Exterior") {
            totalPayment = contractForm.exteriorLumpsum
        }
        else if (job && job.job_type === "Job_Type.Interior") {
            sum = parseFloat(contractForm.interiorPreparation) + parseFloat(contractForm.interiorFinishing);
            totalPayment = sum *units
        } 
        else {
            sum = parseFloat(contractForm.interiorPreparation) + parseFloat(contractForm.interiorFinishing);
            totalPayment = parseFloat(sum * (job && job.total_rooms)) + parseFloat(contractForm.exteriorLumpsum)
        }
        
        setContractForm (
            prevData => {
                return {
                    ...prevData,
                    totalPaymentAmount : totalPayment
                }
            }
        )
    }

    React.useEffect (
        () => {
            checkEmpty()
            totalAmount()
        }, [contractForm]
    )

    function updateValues(event) {
        const {name, value, type, checked} = event.target
        setContractForm(
            prevData => {
                return {
                    ...prevData,
                    [name] : type === "checkbox" ? checked : value
                }
            }
        )
    }

    function handleSubmit(event) {
        event.preventDefault()
        console.log(contractForm)

        if (correctEntry) {
            setDisabled(true)
            const body = {
                materials : contractForm.materials,
                exterior_lumpsum : contractForm.exteriorLumpsum,
                interior_preparation : contractForm.interiorPreparation,
                interior_finishing : contractForm.interiorFinishing,
                total_payment_amount: contractForm.totalPaymentAmount,
                client_sign: contractForm.clientSign
            }

            const requestOptions = {
                method: "POST",
                headers: {
                  "content-type": "application/json", //Gives description of the data I'll send
                  'Authorization' : `Bearer ${token}`
                },
                body: JSON.stringify(body)
              }
            
            fetch(`/contract/client/job/${props.jsc}/contract`, requestOptions)
              .then(res => res.json())
              .then(data => {
                    console.log(data)
                    const alerts = data.message
                    alert(alerts)
                    completeContractForm()
                    navigate("/client/contracts/pending")
              })
              .catch((err) => console.log(err));
        }
    }

    return(
        <div style = {styles1} className="job">
            <div className="side">
                <AiIcons.AiOutlineClose className="close" onClick={props.handleClick}/>
            </div>
            <div className='job_display'>
                <div className="header">
                    <h1>Contract:</h1>
                </div>
                <div className="job_interior">
                    <p>The Painting Contract is made on {now.toLocaleString()} by and between {} (Property Owner) and {} (Painter). 
                    The conditions bind both Property Owner and Painter, jointly and severally.</p>   
                </div>
                <div className="header">
                    <h3>Job Details for Job {code}:</h3>
                </div>
                <div className="job_interior" >
                    <p className="job_det"><span className="font-bold">Job Name:</span> <span className="real_info">{job && job.job_name}</span></p>
                    <p className="job_det"><span className="font-bold">Job Description:</span> <span className="real_info">{job && job.job_description}</span></p>
                    <p className="job_det"><span className="font-bold">Property Location:</span> <span className="real_info">{propLoc}</span></p>
                    <p className="job_det"><span className="font-bold">Property Type:</span> <span className="real_info">{propType}</span></p>
                    <p className="job_det"><span className="font-bold">Job Type:</span> <span className="real_info">{jobType}</span></p>  
                    <p className="job_det"><span className="font-bold">Contract Type:</span> <span className="real_info">{contractType}</span></p>     
                    <p className="job_det"><span className="font-bold">Total Units:</span> <span className="real_info">{job && job.total_rooms}</span></p>     
                    <p className="job_det"><span className="font-bold">Total Floors:</span> <span className="real_info">{job && job.total_floors}</span></p>
                    <p className="job_det"><span className="font-bold">Start Date:</span> <span className="real_info">{job && job.start_date}</span></p>
                    <p className="job_det"><span className="font-bold">End Date:</span> <span className="real_info">{job && job.end_date}</span></p>  
                    <p className="job_det"><span className="font-bold">Payment Amount:</span> 
                        <span className="real_info"><span className="font-bold">Kshs. {contractForm.totalPaymentAmount}</span></span>
                    </p>
                </div>
                
                <div>
                    <form className="form" onSubmit={handleSubmit}>
                        {
                            job && job.contract_type === "Contract_Type.Material" &&
                            <div>
                                <h4>Job Materials:</h4>
                                <textarea 
                                    id = "materials"
                                    type = "text"
                                    placeholder="Materials"
                                    name="materials"
                                    value={contractForm.materials}
                                    onChange={updateValues}
                                    style = {(submittedEmpty.includes("materials")) ? styles : null}
                                    className="job-desc"
                                />
                                {
                                    (submittedEmpty.includes("materials")) && 
                                    <div>
                                        <span style={{color: "red"}}>Materials is required!</span>
                                    </div>
                                }
                                {/*Material description length*/}
                                {
                                    (submittedEmpty.includes("materials")) && 
                                    <br/>
                                }
                            </div>
                            }
                            {
                            (job && job.job_type === "Job_Type.Exterior" || job && job.job_type === "Job_Type.Both") &&
                            <div>
                                <h4>Enter Total Exterior Amount - Exterior Lumpsum: (Can be edited before the proposal is signed):</h4>
                                <h5>This is your estimation for the total amount you will pay to have the exterior walls, roof and all other exterior parts of your building painted.</h5>
                        
                                <input 
                                    id = "exteriorLumpsum"
                                    type = "number"
                                    placeholder="Exterior Lumpsum"
                                    name = "exteriorLumpsum"
                                    value = {contractForm.exteriorLumpsum}
                                    onChange={updateValues}
                                    style = {(submittedEmpty.includes("exteriorLumpsum")) ? styles : null}

                                />
                                {
                                    (submittedEmpty.includes("exteriorLumpsum")) && 
                                    <div>
                                        <span style={{color: "red"}}>Temporary Exterior Lumpsum is required!</span>
                                    </div>
                                }
                                {
                                    (submittedEmpty.includes("exteriorLumpsum")) && 
                                    <br/>
                                }
                            </div>
                            }
                            {
                            (job && job.job_type === "Job_Type.Interior" || job && job.job_type === "Job_Type.Both") &&
                            <div>
                                <h4>Enter Total Interior Amount per Unit: (Can be edited before the proposal is signed):</h4>
                                <div>
                                    <h5>Interior Preparation Amount per Unit:</h5>
                                    <input 
                                        id = "interiorPreparation"
                                        type = "number"
                                        placeholder="Interior Preparation"
                                        name = "interiorPreparation"
                                        value = {contractForm.interiorPreparation}
                                        onChange={updateValues}
                                        style = {(submittedEmpty.includes("interiorPreparation")) ? styles : null}

                                    />
                                    {
                                        (submittedEmpty.includes("interiorPreparation")) && 
                                        <div>
                                            <span style={{color: "red"}}>Interior Preparation per Unit is required!</span>
                                        </div>
                                    }
                                    {
                                        (submittedEmpty.includes("interiorPreparation")) && 
                                        <br/>
                                    }
                                    <h5>Interior Finishing Amount per Unit:</h5>
                                    <input 
                                        id = "interiorFinishing"
                                        type = "number"
                                        placeholder="Interior Finishing"
                                        name = "interiorFinishing"
                                        value = {contractForm.interiorFinishing}
                                        onChange={updateValues}
                                        style = {(submittedEmpty.includes("interiorFinishing")) ? styles : null}

                                    />
                                    {
                                        (submittedEmpty.includes("interiorFinishing")) && 
                                        <div>
                                            <span style={{color: "red"}}>Interior Finishing Amount is required!</span>
                                        </div>
                                    }
                                    {
                                        (submittedEmpty.includes("interiorFinishing")) && 
                                        <br/>
                                    }
                                </div>
                            </div>
                            }
                        <fieldset
                            style = {(submittedEmpty.includes("clientSign")) ? styles : null}
                            className="checkbox"
                        >
                            <legend><h4>Do you agree to the Terms and Conditions of the Contract?</h4></legend>
                            <input 
                                id = "clientSign"
                                type = "checkbox"
                                name = "clientSign"
                                checked = {contractForm.clientSign}
                                onChange={updateValues}
                            />
                            <label htmlFor="clientSign">Yes, I agree</label>
                        </fieldset>
                        <div>
                            <h3 style = {{color : "red"}}>DISCLAIMER:</h3>
                            <h4>This Contract is bound to be edited once you deliberate with the painter before or after he/she does a site visit of your property.</h4>
                            <h4>To edit after contract creation, you will click the update contract button and it will allow you to make changes to the contract as discussed with the painter.</h4>
                            <h4>Once both you and the Painter have signed, you can only terminate it via proper judicial action hence pay attention to detail before signing.</h4>
                        </div>
                        <div className="submit">
                            <button className="home-link2" onClick={checkCred} disabled = {disabled}>Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}