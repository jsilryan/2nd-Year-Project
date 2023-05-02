import React from "react";
import { Link, useNavigate } from "react-router-dom"
import * as AiIcons from "react-icons/ai"

export default function UpdateProposal(props) {
    const [proposalForm, setProposalForm] = React.useState({
        proposalName : props.proposal.proposal_name,
        proposalDescription : props.proposal.proposal_description
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

    const styles = {
        border : "1px",
        borderColor: "red",
        borderStyle: "solid",
        marginBottom: "-1px"
    }

    function checkEmpty() {
        let empty = [] 
        if (proposalForm.proposalName === "") {
            empty.push("proposalName")
        }
        if (proposalForm.proposalDescription === "") {
            empty.push("proposalDescription")
        }
        setEmpty(empty)
    }

    function checkCred() {
        setSubmittedEmpty(emptyFields)
        if (emptyFields.length === 0)
        {
            if (proposalForm.proposalName.length <= 100)
            {
                if (proposalForm.proposalDescription.length <= 1000)
                {
                    setCorrectEntry(true)
                }
                else {
                    alert("Proposal Description Date has to be below 1000 characters")
                    setLenDesc(false)
                }
            } else {
                alert("Proposal Name has to be below 100 characters!")
                setLenName(false)
            }
        } else {
            console.log("The following fields are empty: ", emptyFields)
            alert("Fill in all required fields!")
        }
    }

    function completeProposalForm() {
        setProposalForm ({
            proposalName : "",
            proposalDescription : ""
        })
        setCorrectEntry(false)
    }

    React.useEffect(
        () => {
            checkEmpty()
            if (proposalForm.proposalName.length <= 100)
            {
                setLenName(true)
            }
            if (proposalForm.proposalDescription.length <= 1000)
            {
                setLenDesc(true)
            }
        }, [proposalForm]
    )

    function updateValues(event) {
        const {name, value}= event.target
        setProposalForm (
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
        console.log(proposalForm)

        if (correctEntry) {
            const body = {
                proposal_name: proposalForm.proposalName,
                proposal_description: proposalForm.proposalDescription
            }

            const requestOptions = {
                method: "PUT",
                headers: {
                  "content-type": "application/json", //Gives description of the data I'll send
                  'Authorization' : `Bearer ${token}`
                },
                body: JSON.stringify(body)
              }
            
            fetch(`/proposal/proposals/${props.code}`, requestOptions)
              .then(res => res.json())
              .then(data => {
                    console.log(data)
                    const alerts = data.message
                    alert(alerts)
                    navigate("/painter/proposals")
                    completeProposalForm()
                    props.onProposalRefresh()
                    props.onRefresh()
                    props.closeModal()
              })
              .catch((err) => console.log(err));
        }
    }

    return (
        <div style = {styles1} className="job">
            <div className="side">
                <AiIcons.AiOutlineClose className="close" onClick={props.closeModal}/>
            </div>
            <div className="form_display">
                <form className="form" onSubmit={handleSubmit}>
                    <h2 className="form-title">Update Proposal</h2>
                    <input
                        id = "proposalName"
                        type = "text"
                        placeholder = "Proposal Name"
                        name = "proposalName"
                        value = {proposalForm.proposalName}
                        onChange={updateValues}
                        style = {(submittedEmpty.includes("proposalName")) ? styles : null}
                    />
                    {
                        (submittedEmpty.includes("proposalName")) && 
                        <div>
                            <span style={{color: "red"}}>Proposal Name is required!</span>
                        </div>
                    }
                    {
                        (!lenName) &&
                        <div>
                            <span style={{color: "red"}}>Proposal name field has more than 100 characters!</span>
                        </div>
                    }
                    {
                        (submittedEmpty.includes("proposalName") || !lenName) && 
                        <br/>
                    }
                    <fieldset
                        style = {(submittedEmpty.includes("proposalDescription")) ? styles : null}
                    >
                        <legend>Proposal Description</legend>
                        <textarea 
                            id = "proposalDescription"
                            type = "text"
                            placeholder="Proposal Description"
                            name="proposalDescription"
                            value={proposalForm.proposalDescription}
                            onChange={updateValues}
                            style = {(submittedEmpty.includes("proposalDescription")) ? styles : null}
                            className="job-desc"
                        />
                    </fieldset>
                    {
                        (submittedEmpty.includes("proposalDescription")) && 
                        <div>
                            <span style={{color: "red"}}>Proposal Description is required!</span>
                        </div>
                    }
                    {
                        (!lenDesc) &&
                        <div>
                            <span style={{color: "red"}}>Proposal Description field has more than 1000 characters!</span>
                        </div>
                    }
                    {
                        (submittedEmpty.includes("proposalDescription") || !lenDesc) && 
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