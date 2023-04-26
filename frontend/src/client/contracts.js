import React from "react"

export default function Contracts(props) {
    let left = props.sidebar ? "250px" : "auto"

    const styles = {
        marginLeft: left
    }

    return (
        <main className="empty-main" style={styles}>
            <h2 className="empty-h2">You have 0 contracts.</h2>
        </main>

        
    )

}




