import React from "react";
import * as AiIcons from "react-icons/ai"

export default function ClientProfile (props) {
    let left = props.sidebar ? "250px" : "auto"
    const styles = {
        marginLeft: left,
        backgroundColor: "#f1f1f1",
        height: "100vh",
        overflow: "auto"
    }

    const [client, setClient]= React.useState()

    const [token, setToken] = React.useState(() => JSON.parse(localStorage.getItem("REACT_TOKEN_AUTH_KEY")))

    const requestOptions = {
        method : "GET",
        headers : {
            'content-type' : 'application/json',
            'Authorization' : `Bearer ${token}`
        }
    }

    React.useEffect (
        () => {
            fetch("/client_auth/client-signup", requestOptions)
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    setClient(data)
                })
                .catch(err => console.log(err))
        }, []
    )
    const gender = client && client.gender
    const newGender = client && gender ? gender.replace("Gender.", "") : ''

    return (
        // <div style={styles}>
        //         <main className="empty-main">
        //             <h2 className="empty-h2">client Portfolio</h2>
        //         </main>
        // </div>
        <div style={styles}>
            <div className="job">
                <div className="side">
                    <div className="delete">
                        <button className="home-link2">Your Image</button>
                    </div>
                </div>
                <div className="job_display">
                    <div className="header">
                        <h2>Client Profile</h2>
                    </div>
                    <div className='job_interior'>
                        {client && (
                            <>
                                <div className="job-details">
                                    <div className="job-info">
                                        <h3>Client Name: </h3>
                                        <p>{client.first_name} {client.last_name}</p>
                                    </div>
                                    <div className="job-info">
                                        <h3>Gender: </h3>
                                        <p>{newGender}</p>
                                    </div>
                                    <div className="job-info">
                                        <h3>Email: </h3>
                                        <p>{client.email}</p>
                                    </div>
                                    <div className="job-info">
                                        <h3>Phone Number: </h3>
                                        <p>{client.phone_number}</p>
                                    </div>
                                </div>  
                            </>
                        )}
                    </div>                    
                </div>
            </div>

        </div>
    )
}