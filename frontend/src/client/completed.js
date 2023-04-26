import React from "react"

export default function CompletedJobs(props) {
    let left = props.sidebar ? "250px" : "auto"

    const styles = {
        marginLeft: left
    }

    return (
        <main className="empty-main" style={styles}>
            <h2 className="empty-h2">You have 0 completed jobs.</h2>
        </main>

        
    )

}
