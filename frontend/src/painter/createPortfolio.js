import React from "react";
import * as AiIcons from "react-icons/ai"
import AddImage from "./images";

export default function CreatePortfolio(props) {
    const [portfolioForm, setPortfolioForm]= React.useState({
        description : ""
    })
    const styles = {
        border : "1px",
        borderColor: "red",
        borderStyle: "solid",
        marginBottom: "-1px"
    }

    const [emptyFields, setEmpty] = React.useState([])
    const [submittedEmpty, setSubmittedEmpty] = React.useState([])
    const [correctEntry, setCorrectEntry] = React.useState(false)
    const [lenDesc, setLenDesc] = React.useState(true)
    const [disabled, setDisabled] = React.useState(false)

    const [token, setToken] = React.useState(() => JSON.parse(localStorage.getItem("REACT_TOKEN_AUTH_KEY")))

    function checkEmpty() {
        let empty = [] 
        if (portfolioForm.description === "") {
            empty.push("description")
        }
        setEmpty(empty)
    }

    function checkCred() {
        setSubmittedEmpty(emptyFields)
        if (emptyFields.length === 0)
        {
            if (portfolioForm.description.length <= 1500)
            {
                setCorrectEntry(true)
            }
            else {
                alert("Portfolio Description has to be below 1500 characters")
                setLenDesc(false)
            }
        } else {
            console.log("The following fields are empty: ", emptyFields)
            alert("Fill in all required fields!")
        }
    }

    function completePortfolioForm() {
        setPortfolioForm ({
            description : ""
        })
        setCorrectEntry(false)
    }

    React.useEffect(
        () => {
            checkEmpty()
            if (portfolioForm.description.length <= 1500)
            {
                setLenDesc(true)
            }
        }, [portfolioForm]
    )

    function updateValues(event) {
        const {name, value}= event.target
        setPortfolioForm (
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

        if (correctEntry) {
            setDisabled(true)
            const body = {
                description: portfolioForm.description
            }

            const requestOptions = {
                method: "POST",
                headers: {
                  "content-type": "application/json", //Gives description of the data I'll send
                  'Authorization' : `Bearer ${token}`
                },
                body: JSON.stringify(body)
              }
            
            fetch(`/portfolio/painter/portfolio`, requestOptions)
              .then(res => res.json())
              .then(data => {
                    console.log(data)
                    const alerts = data.message
                    alert(alerts)
                    completePortfolioForm()
                    props.handleClick()
                    props.newPort()
              })
              .catch((err) => console.log(err));
        }
    }


    return (
        <div>
            <div className="job">
                <div className="side">
                    <AiIcons.AiOutlineClose className="close" onClick={props.handleClick}/>
                </div>
                <div className="job_display">
                    <h2>Portfolio Description</h2>
                    <form onSubmit={handleSubmit}>
                        <textarea 
                            id = "description"
                            type = "text"
                            placeholder="Portfolio Description"
                            name="description"
                            value={portfolioForm.description}
                            onChange={updateValues}
                            style = {(submittedEmpty.includes("description") || !lenDesc) ? styles : null}
                            className="portfolio-desc"

                        />

                        {
                            (submittedEmpty.includes("description")) && 
                            <div>
                                <span style={{color: "red"}}>Portfolio Description is required!</span>
                            </div>
                        }
                        {
                            (!lenDesc) &&
                            <div>
                                <span style={{color: "red"}}>Portfolio Description field has more than 1500 characters!</span>
                            </div>
                        }
                        {
                            (submittedEmpty.includes("description") || !lenDesc) && 
                            <br/>
                        }
                        <div className="submit">
                            <button className="home-link2" onClick={checkCred} disabled = {disabled}>Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}