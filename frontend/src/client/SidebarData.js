import React from "react"
import * as FaIcons from "react-icons/fa"
import * as AiIcons from "react-icons/ai"
import * as IoIcons from "react-icons/io"
import * as RiIcons from "react-icons/ri"
import * as GrIcons from "react-icons/gr"
import * as GiIcons from "react-icons/gi"
import * as SlIcons from "react-icons/sl"


export const SidebarData = [
    {
        title: "My Jobs",
        path: "/client/my-jobs",
        icon: <AiIcons.AiFillHome />,
        iconClosed: <RiIcons.RiArrowDownSFill />,
        iconOpened: <RiIcons.RiArrowUpSFill />,
        subnav : [
            {
                title: "All Jobs",
                path: "/client/my-jobs/all-jobs",
                icon: <IoIcons.IoIosPaper />
            },
            {
                title: "Confirmed Jobs",
                path: "/client/my-jobs/confirmed",
                icon: <GiIcons.GiConfirmed />
            },
            {
                title: "Completed Jobs",
                path: "/client/my-jobs/completed",
                icon: <IoIcons.IoMdDoneAll />
            }
        ]
    },

    {
        title: "Proposals",
        path: "/client/proposals",
        icon: <GiIcons.GiPaintRoller />,
        iconClosed: <RiIcons.RiArrowDownSFill />,
        iconOpened: <RiIcons.RiArrowUpSFill />,
        subnav : [
            {
                title: "Selected",
                path: "/client/proposals/selected",
                icon: <GrIcons.GrCheckboxSelected />
            },

            {
                title: "All Proposals",
                path: "/client/proposals/all",
                icon: <IoIcons.IoIosPaper />
            }
        ]
    },

    {
        title: "Contracts",
        path: "/client/contracts",
        icon: <FaIcons.FaFileSignature />,
        iconClosed: <RiIcons.RiArrowDownSFill />,
        iconOpened: <RiIcons.RiArrowUpSFill />,
        subnav : [
            {
                title: "Signed Contracts",
                path: "/client/contracts/signed",
                icon: <FaIcons.FaFileSignature />
            },

            {
                title: "Pending Contracts",
                path: "/client/contracts/pending",
                icon: <IoIcons.IoIosPaper />
            }
        ]
    },

    {
        title: "Profile",
        path: "/client/profile",
        icon: <AiIcons.AiOutlineProfile />,
        iconClosed: <RiIcons.RiArrowDownSFill />,
        iconOpened: <RiIcons.RiArrowUpSFill />
    },

    {
        title: "Log Out",
        path: "/login",
        icon: <SlIcons.SlLogout/>,
        iconClosed: <RiIcons.RiArrowDownSFill />,
        iconOpened: <RiIcons.RiArrowUpSFill />,
    }


]