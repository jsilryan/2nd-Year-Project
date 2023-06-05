import React from "react";
import SpecificProposal from "../components/specificProposal";
import DisplayJobs from "../components/displayJobs";
import AllProposals from "../components/allProposals";
import SearchBar from "../components/searchbar";

export default function JobsWithProposals(props) {

    const [showProposals, setShowProposals] = React.useState(false)

    const [jobShortCode, setJShortCode] = React.useState("")

    //Display all proposals
    function dispProposals(jsc) {
        setShowProposals(true)
        setJShortCode(jsc)
    }

    function hideProposals() {
        setShowProposals(false)        
    }
    const [openModal, setOpenModal] = React.useState(false)

    function showModal() {
        setOpenModal(true)
    }
    const [filteredData, setFilteredData] = React.useState()
    const [searchWord, setSearchWord] = React.useState("")

    return (
        <div>
        {
            !showProposals ?
            <div className="alljobs">
                <div className="title-header">
                    <h2 className="component-heading">Jobs With Proposals</h2>  
                    <SearchBar placeholder = "Search Jobs" 
                        data = {props.jobs}
                        setData = {setFilteredData}
                        setSearchWord = {setSearchWord}
                        searchWord = {searchWord}
                        type = "jobs"
                    />
                </div>
                {
                    !searchWord ?
                    props.jobs && props.jobs.map((job) => {
                        return(
                            <DisplayJobs 
                                name={job.job_name} description={job.job_description} handleClick={() => dispProposals(job.job_short_code)} 
                                start={job.start_date} end ={job.end_date} created_at = {job.job_created_at}
                            />
                        )
                    })
                    :
                    <div className="searchjobs">
                    {
                        filteredData && filteredData.length > 0 ? 
                        filteredData.slice(0, 15).map((job) => {
                            return(
                                <DisplayJobs 
                                    name={job.job_name} description={job.job_description} handleClick={() => dispProposals(job.job_short_code)} 
                                    start={job.start_date} end ={job.end_date} created_at = {job.job_created_at}
                                />
                            )
                        })
                        :
                        <main className='jobs_display'>
                            <h2 className="empty-h2">Job does not exist.</h2>
                        </main>
                    }
                    </div>
                }
            </div>
            :
            <AllProposals jsc = {jobShortCode} user = {props.user} handleClick = {hideProposals}/>
        }
        </div>
    )
}