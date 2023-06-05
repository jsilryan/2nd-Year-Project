import React from "react";
import * as AiIcons from "react-icons/ai"

export default function SearchBar(props) {

    function handleChange(event) {
        const searchWord = event.target.value
        props.setSearchWord(searchWord)
        if (props.type === "jobs") {
            const newFilter = props.data && props.data.filter((value) => {
                return value.job_name.toLowerCase().includes(searchWord.toLowerCase());
            })
            props.setData(newFilter)
        }
        else if (props.type === "proposals") {
            const newFilter = props.data && props.data.filter((value) => {
                return value.proposal_name.toLowerCase().includes(searchWord.toLowerCase());
            })
            props.setData(newFilter)
        }
        else if (props.type === "contracts") {
            console.log(props.data)
            const newFilter = props.data && props.data.filter((value) => {
                return value.contract_short_code.toLowerCase().includes(searchWord.toLowerCase());
            })
            console.log(newFilter)
            props.setData(newFilter)
        }

    }

    function clearInput() {
        props.setData()
        props.setSearchWord("")
    }

    return (
        <div className="search">
            <div className="searchbox">
                <input 
                    className="searchInputs"
                    type="text"
                    placeholder={props.placeholder}
                    onChange = {handleChange}
                    value={props.searchWord}
                />
                <div className="searchicon">
                    {
                        props.searchWord && props.searchWord.length > 0 ?
                        <AiIcons.AiOutlineClose className = "clearBtn" onClick={clearInput}/> 
                        :
                        <AiIcons.AiOutlineSearch />
                    }
                </div>
            </div>
        </div>
    )
}

//placeholder, data