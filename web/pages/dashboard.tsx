import SideBar from "./components/SideBar";


export default function Dashboard() {
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      <SideBar />
      {/* Main */}
      <div className="flex-1 ml-0 md:ml-64 p-6">
        {/* Top bar */}
        <div className="flex justify-between items-center mb-6">
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
