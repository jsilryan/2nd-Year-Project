import React from "react"
import * as FaIcons from "react-icons/fa"
import * as AiIcons from "react-icons/ai"
import * as IoIcons from "react-icons/io"
import * as RiIcons from "react-icons/ri"
import * as SlIcons from "react-icons/sl"
import * as GiIcons from "react-icons/gi"
import * as GrIcons from "react-icons/gr"
import * as FcIcons from "react-icons/fc"


export const PainterSidebarData = [
    {
        title: "Bid Jobs",
        path: "/painter/bid-jobs",
        icon: <AiIcons.AiFillHome />,
        iconClosed: <RiIcons.RiArrowDownSFill />,
        iconOpened: <RiIcons.RiArrowUpSFill />
    },
    {
        title: "My Jobs",
        icon: <GiIcons.GiPaintRoller />,
        iconClosed: <RiIcons.RiArrowDownSFill />,
        iconOpened: <RiIcons.RiArrowUpSFill />,
        subnav : [
            {
                title: "All Jobs",
                path: "/painter/my-jobs",
                icon: <IoIcons.IoIosPaper />
            },
            {
                title: "Confirmed Jobs",
                path: "/painter/my-jobs/confirmed",
                icon: <GiIcons.GiConfirmed />
            },
            {
                title: "Completed Jobs",
                path: "/painter/my-jobs/completed",
                icon: <IoIcons.IoMdDoneAll />
            }
        ]
    },
    {
        title: "Proposals",
        icon: <GiIcons.GiPaintRoller />,
        iconClosed: <RiIcons.RiArrowDownSFill />,
        iconOpened: <RiIcons.RiArrowUpSFill />,
        subnav : [
            {
                title: "All Proposals",
                path: "/painter/proposals",
                icon: <IoIcons.IoIosPaper />
            },
            {
                title: "Selected",
                path: "/painter/proposals/selected",
                icon: <GrIcons.GrCheckboxSelected />
            }

        ]
    },
    {
        title: "Contracts",
        icon: <FaIcons.FaFileSignature />,
        iconClosed: <RiIcons.RiArrowDownSFill />,
        iconOpened: <RiIcons.RiArrowUpSFill />,
        subnav : [
            {
                title: "All Contracts",
                path: "/painter/contracts",
                icon: <IoIcons.IoIosPaper />
            },

            {
                title: "Signed Contracts",
                path: "/painter/contracts/signed",
                icon: <FaIcons.FaFileSignature />
            },

            {
                title: "Pending Contracts",
                path: "/painter/contracts/pending",
                icon: <IoIcons.IoIosPaper />
            }
        ]
    },
    {
        title: "Portfolio",
        path: "/painter/portfolio",
        icon: <FcIcons.FcAbout />,
        iconClosed: <RiIcons.RiArrowDownSFill />,
        iconOpened: <RiIcons.RiArrowUpSFill />
    },
    {
        title: "Log Out",
        path: "/login",
        icon: <SlIcons.SlLogout/>,
        iconClosed: <RiIcons.RiArrowDownSFill />,
        iconOpened: <RiIcons.RiArrowUpSFill />
    }
]