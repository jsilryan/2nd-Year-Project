import React from "react";

export default function DisplayContracts(props) {

    const [status, setStatus] = React.useState()
    React.useEffect(
        () => {
            if (props.signed === true) {
                setStatus("Contract Signed By both Parties")
            } else {
                setStatus ("Contract not Signed by both Parties.")
            }
        }, []
    )

    return (
        <div className='jobs_display' onClick={props.handleClick}>
            <h2>Contract {props.csc} for Job {props.jsc}</h2>
            <h3>Status: {status}</h3>
        </div>
    )
}