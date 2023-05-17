import React from "react";
import DisplayImage from "./dispImg";

export default function AllImages(props) {
    const [portfolioImages, setPortfolioImages] = React.useState()

    const [token, setToken] = React.useState(() => JSON.parse(localStorage.getItem("REACT_TOKEN_AUTH_KEY")))

    const requestOptions = {
        method : "GET",
        headers : {
            'content-type' : 'application/json',
            'Authorization' : `Bearer ${token}`
        }
    }
    let url = props.user && `/images/client/proposal/${props.user && props.proposalCode}/painter/portfolio/images`
    let newUrl = props.user ? url : `/images/portfolio/${props.code}/image`

    React.useEffect(() => {
        if (props.code) {
          fetch(newUrl, requestOptions)
            .then(res => res.json())
            .then(data => {
              console.log(data);
              console.log(data.length)
              props.num(data.length)
              setPortfolioImages(data);
            })
            .catch(err => console.log(err));
        }
      }, [props.painterPortfolio]);


    const slide = {
        borderRadius: "5px",
    }
      return (
        <div>
            {                  
                portfolioImages && 
                <div>
                    <div className="header">
                        {
                        !props.user ?
                        <h3>Your Portfolio Images:</h3>
                        :
                        <h3>{props.painterPortfolio && props.painterPortfolio.painter_first_name}{'s'.endsWith(props.painterPortfolio && props.painterPortfolio.painter_first_name.slice(-1).toLowerCase())
                            ? "'" : "'s"} Portfolio Images:</h3>
                        }
                    </div>
                    <div>
                        <DisplayImage image = {portfolioImages[props.index]} key = {portfolioImages[props.index].image_short_code} 
                        handleClick = {() => props.handleClick(portfolioImages[props.index].image_short_code)} style = {slide}
                        />
                    </div>
                </div>
            }
        {/* {
            portfolioImages && portfolioImages.map((image) => {
                return (
                    <div>
                        <DisplayImage image = {image} key = {image.image_short_code} handleClick = {() => props.handleClick(image.image_short_code)}/>
                    </div>
                )   
            })
        } */}
        </div>
      )
}