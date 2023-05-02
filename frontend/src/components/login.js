import React from "react"
import { Link } from "react-router-dom"
import { login } from "../auth"
import { useAuth } from "../auth"
import { useNavigate } from "react-router-dom"

export default function Login(props) {

    const [loginForm, setLoginForm] = React.useState({
        email: "",
        password: ""
    })

    const logged = useAuth()

    const navigate = useNavigate() //Helps redirect the logged in user to another page - I have to push the next page to the navigate

    const [correctEntry, setCorrectEntry] = React.useState(false)

    const [passwordType, setPType] = React.useState("password")

    function togglePass() {
        if (passwordType === "password") {
            setPType("text")
        }
        else {
            setPType("password")
        }
    }

    const [emptyFields, setEmpty] = React.useState([])

    const [submittedEmpty, setSubmittedEmpty] = React.useState([])

    const styles = {
        border : "1px",
        borderColor: "red",
        borderStyle: "solid",
        marginBottom: "-1px"
    }
    
    function checkEmpty() {
        let empty = [] 

        if (loginForm.email === "") {
            empty.push("email")
        } 
        if (loginForm.password === "") {
            empty.push("password")
        } 

        setEmpty(empty)
    }

    React.useEffect(
        () => {
            checkEmpty()
        }, [loginForm]
    )

    function checkCred() {
        setSubmittedEmpty(emptyFields)
        if (emptyFields.length === 0)
        {
            // alert("Successfully logged in!")
            setCorrectEntry(true)
        } else {
            alert("Fill in all required fields!")
            console.log("The following fields are empty: ", emptyFields)
        }

    }

    function updateValues(event) {
        const {name, value} = event.target
        setLoginForm(
            prevData => {
                return {
                    ...prevData,
                    [name] : value
                }
            }

        )
        
    }

    function completeLogin() {
        setLoginForm (
            {
                email: "",
                password: ""
            }
        )
        setCorrectEntry(false);
    }

    function handleSubmit(event) {
        event.preventDefault()
        console.log(loginForm)
        if (correctEntry) {
            const body = {
                email: loginForm.email,
                password: loginForm.password
            }
            const requestOptions = {
                method: "POST",
                headers: {
                  "content-type": "application/json",
                },
                body: JSON.stringify(body),
            }
            
            fetch ("/user_auth/login", requestOptions)
                .then(
                    (res) => res.json()
                )  
                .then((data) => {
                    console.log(data)
                    console.log(logged)
                    login(data.access_token) //We will redirect the user to use page
                    if (data.user === "Client") {
                        navigate("/client/my-jobs")
                        completeLogin()
                        props.switchClient()
                        props.handleClick()
                    } else if (data.user === "Painter") {
                        navigate("/painter/bid-jobs")
                        completeLogin()
                        props.switchPainter()
                        props.handleClick()
                    } else if (data.message === "User does not exist!") {
                        alert("User does not exist!")
                    } else {
                        alert ("Password is incorrect!")
                    }
                })
                .catch((err) => console.log(err));
          
        }

    }

    return (
        <div className="home">
            <div className="empty-home">
            <div className="signup-login">
                <form onSubmit={handleSubmit} className="form">
                    <h2 className="form-title">User Login</h2>
                    <input 
                        id="email" 
                        type="email" 
                        placeholder="Email Address" 
                        name="email" 
                        value = {loginForm.email}
                        onChange={updateValues}
                        style = {(submittedEmpty.includes("email")) ? styles : null}
                    />

                    {
                        (submittedEmpty.includes("email")) && 
                        <div>
                            <span style={{color: "red"}}>Email is required!</span>
                        </div>
                    }
                    {
                        (submittedEmpty.includes("email")) && 
                        <br/>
                    }
                    <div className="names-pass">
                        <div>
                            <input 
                                id="password" 
                                type={passwordType} 
                                placeholder="Password" 
                                name="password" 
                                value = {loginForm.password}
                                onChange={updateValues}
                                className="pass-input"
                                style = {(submittedEmpty.includes("password")) ? styles : null}
                            />
                        </div>
                        <div>
                            <button type="button" className="pass-button" onClick={togglePass}>
                                {
                                    passwordType === "password" ?
                                    <img src={require("../images/show.png")} /> :
                                    <img src={require("../images/private.png")} />
                                }
                            </button>
                        </div>
                    </div>

                    {
                        (submittedEmpty.includes("password")) && 
                        <div>
                            <span style={{color: "red"}}>Password is required!</span> 
                        </div>
                    }
                    {
                        (submittedEmpty.includes("password")) && 
                        <br/>
                    }     

                    <div className="submit">
                        <button className="home-link2" onClick={checkCred}>Login</button>
                    </div>
                </form>
                <div>
                    <h3>Do not have an account? <Link to="/signup"className="login-link" onClick={props.userNavig && props.handleClick}>Sign Up</Link></h3>
                </div>
            </div>
            </div>
        </div>
    )
}