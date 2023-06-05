import React from "react";
import * as AiIcons from "react-icons/ai"
import AddImage from "./images";
import Portfolio from "./painterPortfolio";
import Earnings from "./earnings";
import Ratings from "./painterRatings";

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

    const [signedContracts, setSignedContracts] = React.useState([])
    const [avgRating, setAvgRating] = React.useState()
    const [totalAmount, setTotalAmount] = React.useState()
    const [ratings, setRatings] = React.useState()
    const [contractNumber, setContractNumber] = React.useState()
    let message
    React.useEffect(
        () => {
            fetch("/contract/signed", requestOptions)
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    console.log(data.length)
                    data && setContractNumber(data.length)
                    if (data.msg){
                        message = data.msg
                    }
                    setSignedContracts(data)
                    let total = 0
                    for (let i = 0; i < data.length; i++){
                        let amount = data[i].total_payment_amount
                        total = total + amount
                    }
                    setTotalAmount(total)
                })
                .catch(err => console.log(err))

        }, []
    )

    React.useEffect(
        () => {
            // contractNumber > 0 &&
            fetch('/rating/painter/ratings', requestOptions)
                .then(res => res.json())
                .then(data => {
                    console.log(data.length)
                    if (data.msg){
                        message = data.msg
                    }
                    setRatings(data)
                    let totalRating = 0
                    let newAvgRating 
                    for (let i = 0; i < data.length; i++) {
                        totalRating = totalRating + data[i].rating_no
                    }
                    newAvgRating = totalRating / data.length
                    setAvgRating(newAvgRating)
                })
                .catch(err => console.log(err))

            
        }, []
    )

    console.log(totalAmount)
    console.log(ratings)

    const [checkAmount, setAmount] = React.useState(false)

    function openAmount() {
        setAmount(true)
    }

    function closeAmount (){
        setAmount(false)
    }

    const [rate, setRate] = React.useState(false)

    
    React.useEffect(() => {
        console.log("Rate state:", rate);
    }, [rate]);

    function openRate() {
        setRate(true);
    }
    function closeRate() {
        setRate(false)
    }

    return (
        // <div style={styles}>
        //         <main className="empty-main">
        //             <h2 className="empty-h2">Painter Portfolio</h2>
        //         </main>
        // </div>
        <div style={styles}>
            {
            !openPortfolio && !checkAmount && !rate ?
            <div className="job">
                <div className="side">
                    <div className="delete">
                        <button onClick={switchPortfolio} className="home-link2">Your Portfolio</button>
                    </div>
                    <div className="delete">
                        <button onClick = {openAmount} className="home-link2">Your Earnings</button>
                    </div>
                    <div className="delete">
                        <button onClick={openRate} className="home-link2">Your Ratings</button>
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
            <div>
            {
                openPortfolio &&
                <Portfolio switchPortfolio = {switchPortfolio} avgRating = {avgRating}/>
            }
            {
                checkAmount &&
                <div>
                    <Earnings handleClick = {closeAmount} contracts = {signedContracts}/>
                    
                </div>
            }
            {
                rate &&
                <Ratings handleClick = {closeRate} ratings = {ratings}/>
            }
            </div>
            }

        </div>
    )
}