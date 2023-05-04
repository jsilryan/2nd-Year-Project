import React, { useMemo } from "react"
import Star from "../components/star"
import * as AiIcons from "react-icons/ai"

export default function Rate(props){
    const [hoverRating, setHoverRating] = React.useState(0)
    //functiongetColor(index)
    const getColor = index => {
        if(hoverRating >= index) {
            const styles = {
                color : props.ratingProps.color.filled
            }
            return styles
        } 
        else if (!hoverRating && props.rating >= index) {
            const styles = {
                color : props.ratingProps.color.filled
            }
            return styles
        } 
        else {
            const styles = {
                color : props.ratingProps.color.unfilled,
                // border: '2px solid black',
                // padding: "5px"
            }
            return styles
        }
    }

    let count = 5
    const starRating = useMemo(() => {
        return Array(props.ratingProps.count)
            .fill(0)
            .map((_, i) => i + 1)
            .map(idx => {
                return (
                    <AiIcons.AiFillStar
                        key={idx}
                        className = "stars"
                        style = {getColor(idx)}
                        onClick={() => props.onRating(idx)}
                        onMouseEnter={() => setHoverRating(idx)}
                        onMouseLeave = {() => setHoverRating(0)}
                    />
                    
                )
            })
    }, [props.ratingProps.count, props.rating, hoverRating])
    return (
        <div>
            {starRating}
        </div>
    )
}