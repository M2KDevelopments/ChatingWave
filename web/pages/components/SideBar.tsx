import React from 'react'
import { FaRobot, FaMicrophoneAlt, FaComments, FaHome, FaTasks } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { MdSettings } from "react-icons/md";

const menuItems = [
    { name: "Dashboard", icon: <FaHome /> },
    { name: "Chat Bots", icon: <FaRobot /> },
    { name: "Voice Assistants", icon: <FaMicrophoneAlt /> },
    { name: "AI Surveys", icon: <FaComments /> },
    { name: "Tasks", icon: <FaTasks /> },
    { name: "Settings", icon: <MdSettings /> },
];


function SideBar() {
    const sidebarOpen = false

    return (
        <aside className={`bg-white w-64 space-y-6 py-7 px-4 shadow-md fixed md:relative z-20 ${sidebarOpen ? "block" : "hidden"} md:block`}>
            <h2 className="text-2xl font-bold text-indigo-600 text-center mb-8">Chating Wave</h2>
            <nav className="space-y-3">
                {menuItems.map((item) => (
                    <a
                        key={item.name}
                        href="#"
                        className="flex items-center gap-3 text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md hover:bg-indigo-50 transition"
                    >
                        {item.icon}
                        {item.name}
                    </a>
                ))}
            </nav>
            <div className="absolute bottom-6 w-full flex justify-center">
                <button className="text-red-500 flex items-center gap-2 hover:text-red-600">
                    <FiLogOut />
                    Logout
                </button>
            </div>
        </aside>
    )
}

export default SideBar
