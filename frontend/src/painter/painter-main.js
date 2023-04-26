import React from "react"

export default function PainterMain(props) {
    let left = props.sidebar ? "250px" : "auto"

    const styles = {
        marginLeft: left
    }

    return (
        <main className="empty-main" style={styles}>
            <h2 className="empty-h2">You do not have any jobs</h2>
            <button className="empty-button">Bid for one now</button>
        </main>

        
    )

}
