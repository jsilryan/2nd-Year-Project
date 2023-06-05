import React from "react";
import * as AiIcons from "react-icons/ai"
import AddImage from "./images";
import CreatePortfolio from "./createPortfolio";
import AllImages from "./allImages";
import SpecificImage from "./specificImage";
import UpdatePortfolio from "./updatePortfolio";
import DeletePortfolio from "./deletePortfolio";

export default function Portfolio(props) {
    const [painterPortfolio, setPainterPortfolio]= React.useState()

    const [token, setToken] = React.useState(() => JSON.parse(localStorage.getItem("REACT_TOKEN_AUTH_KEY")))

    const requestOptions = {
        method : "GET",
        headers : {
            'content-type' : 'application/json',
            'Authorization' : `Bearer ${token}`
        }
    }
    const [portfolioNumber, setPortfolioNumber] = React.useState()

    const [newPortfolio, setNewPortfolio] = React.useState(false)

    function changeNewPort () {
        setNewPortfolio(!newPortfolio)
    }
    let url =  `/portfolio/client/proposal/${props.user && props.code}/painter/portfolio`
    let newUrl = props.user ? url : "/portfolio/painter/portfolio"
    React.useEffect (
        () => {
            fetch(newUrl, requestOptions)
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    setPortfolioNumber(data.length)
                    setPainterPortfolio(data)
                })
                .catch(err => console.log(err))
        }, [newPortfolio]
    )
    const code = painterPortfolio && painterPortfolio.portfolio_short_code;

    console.log(painterPortfolio)

    const [addPortfolio, setAddPortfolio] = React.useState(false)

    function changePortfolio() {
        setAddPortfolio(!addPortfolio)
    }

    const [oneImage, setOneImage] = React.useState(false)

    //Display 1 image
    const [imageShortCode, setIShortCode] = React.useState("")

    function getOneImage (isc) {
        setOneImage(true)
        setIShortCode(isc)
    }

    function hideImg () {
        setOneImage(false)
        setIShortCode()
    }

    const [openImages, setImages] = React.useState(false)
    function switchImages() {
        setImages(!openImages)
    }
    //Get Number of Images
    const [numImages, setNumImages] = React.useState()
    function getNumImages (num) {
        setNumImages(num)
    }
    const leftArrowStyles = {
        transform: "translate (0, -50%)",
        left: "32px",
        fontSize: "45px",
        color: "#4A4E74",
        // zIndex: 1,
        cursor: "pointer"
    }
    const rightArrowStyles = {
        transform: "translate (0, -50%)",
        right: "32px",
        fontSize: "45px",
        color: "#4A4E74",
        // zIndex: 1,
        cursor: "pointer"
    }
    const slider = {
        height: "100%",
        width: "100%",
        position : "relative",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
    }
    const normal = {
        fontWeight: "normal"
    }
    const [currentIndex, setCurrentIndex] = React.useState(0)
    function goToPrevious () {
        const isFirstSlide = currentIndex === 0
        const newIndex = isFirstSlide ? numImages - 1 : currentIndex - 1
        setCurrentIndex(newIndex)
      }

    function goToNext() {
    const isLastSlide = currentIndex === numImages - 1
    const newIndex = isLastSlide ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
    }
    const [update, setUpdate] = React.useState(false) 

    function openUpdate () {
        setUpdate(true)
    }

    function closeUpdate() {
        setUpdate(false)
    }

    const [onDelete, setOnDelete] = React.useState(false)

    function openDelete() {
        setOnDelete(true)
    }

    function closeDelete() {
        setOnDelete(false)
    }

    const jobStyle = (!onDelete ) ? "job" : "job-opaque"
    const jobDisplay = (!onDelete ) ? "job_display" : "job_display_opaque"
    const sideDisplay = (!onDelete ) ? "side" : "side_opaque"

    const [avgRating, setAvgRating] = React.useState()
    React.useEffect(
        () => {
            if (props.user) {
            fetch(`/rating/painter/${painterPortfolio && painterPortfolio.painter_id}/ratings`, requestOptions)
                .then(res => res.json())
                .then(data => {
                    console.log(data.length)
                    let message
                    if (data.msg){
                        message = data.msg
                    }
                    let totalRating = 0
                    let newAvgRating 
                    for (let i = 0; i < data.length; i++) {
                        totalRating = totalRating + data[i].rating_no
                    }
                    newAvgRating = totalRating / data.length
                    setAvgRating(newAvgRating)
                })
                .catch(err => console.log(err))

            }
        }, [painterPortfolio]
    )
        console.log(avgRating)
    
    const [hoverRating, setHoverRating] = React.useState(!props.user ? props.avgRating : avgRating)
    
    const [ratingProps, setRatingProps] = React.useState({
        count: 5,
        color: {
            filled : "#F0CE0A",
            unfilled: "#baa3ba"
        },
        width: "50px",
        height: "50px"
    })
    //functiongetColor(index)
    const getColor = index => {
        if(hoverRating >= index) {
            const styles = {
                color : ratingProps.color.filled,
                width: ratingProps.width,
                height: ratingProps.height
            }
            return styles
        } 
        else if (!hoverRating && !props.user ? props.avgRating : avgRating >= index) {
            const styles = {
                color : ratingProps.color.filled,
                width: ratingProps.width,
                height: ratingProps.height
            }
            return styles
        } 
        else {
            const styles = {
                color : ratingProps.color.unfilled,
                width: ratingProps.width,
                height: ratingProps.height
                // border: '2px solid black',
                // padding: "5px"
            }
            return styles
        }
    }

    const starRating = React.useMemo(() => {
        return Array(ratingProps.count)
            .fill(0)
            .map((_, i) => i + 1)
            .map(idx => {
                return (
                    <AiIcons.AiFillStar
                        key={idx}
                        className = "stars"
                        style = {getColor(idx)}
                    />
                    
                )
            })
    }, [avgRating, props.avgRating])


    return (
        <div>
        {
            portfolioNumber === 0 ?
            !props.user ?
            !addPortfolio ?
            <div className="job">
                <div className="side">
                    <AiIcons.AiOutlineClose className="close" onClick={props.switchPortfolio}/>
                </div>
                <div className="job_display">
                    <h2 className="empty-h2">You currently do not have a portfolio.</h2>
                    <h4 className='port-h4'>Your chance to add Images and a description of your work to wow Clients.</h4>
                    <button className="home-link2" onClick={changePortfolio}>Create one now</button>
                </div>
            </div>
            :
            <CreatePortfolio handleClick= {changePortfolio} newPort = {changeNewPort}/>
            :
            <div className="job">
                <div className="side">
                    <AiIcons.AiOutlineClose className="close" onClick={props.close}/>
                </div>
                <div className="job_display">
                    <h2 className="empty-h2">Painter does not have a portfolio, yet.</h2>
                </div>
            </div>
            // <main className="empty-main">
            //     <h2 className="empty-h2">Painter does not have a portfolio, yet.</h2>
            // </main>
            :
            !openImages && !update?
            !oneImage && !onDelete?
            <div className={jobStyle}>
                <div className={sideDisplay}>
                    <AiIcons.AiOutlineClose className="close" onClick={!props.user ? props.switchPortfolio : props.close}/>
                    
                    {!props.user && numImages <= 10 && (
                        <div className="delete">
                            <button onClick={switchImages} className="home-link2">Add Images</button>
                        </div>
                    )}
                    {!props.user && (
                        <div className="delete">
                            <button onClick = {openUpdate} className="home-link2">Edit Portfolio</button>
                        </div>
                    )}
                    {!props.user && (
                        <div className="delete">
                            <button onClick = {openDelete} className="home-link2">Delete Portfolio</button>
                        </div>
                    )}
                    
                </div>
                <div className={jobDisplay}>
                    <div className="header">
                        <h2>{painterPortfolio && painterPortfolio.painter_first_name}{'s'.endsWith(painterPortfolio && painterPortfolio.painter_first_name.slice(-1).toLowerCase())
                            ? "'" : "'s"} Portfolio:</h2>
                    </div>
                    <div className="job-details">
                        <div className="job-info">
                            <h3>Painter Name: </h3>
                            <p>{painterPortfolio && painterPortfolio.painter_first_name} {painterPortfolio && painterPortfolio.painter_last_name}</p>
                        </div>
                        <div className="job-info">
                            <h3>Average Rating:</h3>
                            {
                                !props.user ?
                                props.avgRating ?
                                <div>
                                    {starRating}
                                    <p>{props.avgRating.toFixed(1)}</p>
                                </div>
                                :
                                <p>You do not have any ratings yet!</p>
                                :
                                avgRating ?
                                <div>
                                    {starRating}
                                    <p>{avgRating.toFixed(1)}</p>
                                </div>
                                :
                                <p>{painterPortfolio && painterPortfolio.painter_first_name} does not have any ratings yet.</p>
                            }
                            
                        </div>
                        <div className="job-info">
                            <h3>Portfolio Description: </h3>
                            <p>{painterPortfolio && painterPortfolio.description}</p>
                        </div>
                    </div>
                    <div>
                        <AllImages code = {code} painterPortfolio = {painterPortfolio} handleClick = {getOneImage} 
                            num = {getNumImages} index = {currentIndex} proposalCode = {props.user && props.code}
                            user = {props.user && props.user} onDelete = {onDelete}
                        />
                        <div style = {slider}>
                            <div className = "arrow" style = {leftArrowStyles} onClick = {goToPrevious} >&lt;</div>
                            <h4>Image {currentIndex+1} / {numImages} {!props.user && <span style={normal}>--- 10 Images Max</span>}</h4>
                            <div className = "arrow" style = {rightArrowStyles} onClick = {goToNext}>&gt;</div>
                        </div>
                    </div>
                    
                </div>
            </div>
            :
            <div>
            {
                oneImage &&
                <SpecificImage handleClick ={hideImg} isc = {imageShortCode} newPort = {changeNewPort} user = {props.user}/>
            }
            {
                onDelete && 
                <DeletePortfolio back = {closeDelete} token = {token} newPort = {changeNewPort} code = {painterPortfolio && painterPortfolio.portfolio_short_code}/>
            }
            </div>
            :
            <div>
            {
                openImages &&
                <AddImage switchPortfolio = {switchImages} code = {code} newPort = {changeNewPort} numImages = {numImages}/>
            }
            {
                update &&
                <UpdatePortfolio handleClick = {closeUpdate} newPort = {changeNewPort}/>
            }
            </div>
        }
        </div>
    )
}