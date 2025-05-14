import { useState } from "react";
import { FaRobot, FaMicrophoneAlt, FaComments, FaBars } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

const menuItems = [
  { name: "Chat Bots", icon: <FaRobot /> },
  { name: "Voice Assistants", icon: <FaMicrophoneAlt /> },
  { name: "Surveys", icon: <FaComments /> },
];

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
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

      {/* Main */}
      <div className="flex-1 ml-0 md:ml-64 p-6">
        {/* Top bar */}
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden text-2xl text-indigo-600">
            <FaBars />
          </button>
          <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold">
              CW
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-5 rounded-2xl shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">My Chat Bots</h3>
            <p className="text-4xl font-bold text-indigo-600">5</p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-5 rounded-2xl shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Voice Assistants</h3>
            <p className="text-4xl font-bold text-purple-500">2</p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-5 rounded-2xl shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Surveys</h3>
            <p className="text-4xl font-bold text-pink-500">7</p>
          </div>
        </div>
      </div>
    </div>
  );
}
