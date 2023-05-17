import React from "react";
import * as AiIcons from "react-icons/ai"
import AddImage from "./images";
import Portfolio from "./painterPortfolio";

export default function PainterProfile (props) {
    let left = props.sidebar ? "250px" : "auto"
    const styles = {
        marginLeft: left,
        backgroundColor: "#f1f1f1",
        height: "100vh",
        overflow: "auto"
    }

    const [painter, setPainter]= React.useState()
    const [painterPortfolio, setPainterPortfolio]= React.useState()

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
            fetch("/painter_auth/painter-signup", requestOptions)
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    setPainter(data)
                })
                .catch(err => console.log(err))
        }, []
    )

    React.useEffect (
        () => {
            fetch("/portfolio/painter/portfolio", requestOptions)
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    setPainterPortfolio(data)
                })
                .catch(err => console.log(err))
        }, []
    )
    console.log(painterPortfolio)
    const gender = painter && painter.gender
    const Prop_Location = painter && painter.area
    const newGender = painter && gender ? gender.replace("Gender.", "") : ''
    const propLoc = painter && Prop_Location ? Prop_Location.replace("Prop_Location.", "") : ''

    const [openPortfolio, setPortfolio] = React.useState(false)

    function switchPortfolio() {
        setPortfolio(!openPortfolio)
    }
    let code = painterPortfolio && painterPortfolio.portfolio_short_code

    return (
        // <div style={styles}>
        //         <main className="empty-main">
        //             <h2 className="empty-h2">Painter Portfolio</h2>
        //         </main>
        // </div>
        <div style={styles}>
            {
            !openPortfolio ?
            <div className="job">
                <div className="side">
                    <div className="delete">
                        <button onClick={switchPortfolio} className="home-link2">Your Portfolio</button>
                    </div>
                </div>
                <div className="job_display">
                    <div className="header">
                        <h2>Painter Profile</h2>
                    </div>
                    <div className='job_interior'>
                        {painter && (
                            <>
                                <div className="job-details">
                                    <div className="job-info">
                                        <h3>Painter Name: </h3>
                                        <p>{painter.first_name} {painter.last_name}</p>
                                    </div>
                                    <div className="job-info">
                                        <h3>Gender: </h3>
                                        <p>{newGender}</p>
                                    </div>
                                    <div className="job-info">
                                        <h3>Area: </h3>
                                        <p>{propLoc}</p>
                                    </div>
                                    <div className="job-info">
                                        <h3>Email: </h3>
                                        <p>{painter.email}</p>
                                    </div>
                                    <div className="job-info">
                                        <h3>Phone Number: </h3>
                                        <p>{painter.phone_number}</p>
                                    </div>
                                </div>  
                            </>
                        )}
                    </div>                    
                </div>
            </div>
            :
            <Portfolio switchPortfolio = {switchPortfolio}/>
            }

        </div>
    )
}