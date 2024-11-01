import { useEffect, useState } from "react"
import Phone from "./components/Phone";

// Interfaces
import { IMessage } from "./interfaces/message";
import { IPerson } from "./interfaces/person";

// Popups and Modals
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Settings Component RHS
import Visuals from "./components/Settings/Visuals";
import MessageStatus from "./components/Settings/MessageStatus";
import Actions from "./components/Settings/Actions";
import Exporting from "./components/Settings/Exporting";

// Assets
import { MESSAGES } from './assets/messages'
import emily from './assets/emily.jpg';

// Export Resolutions
const resolutions = new Map<string, number>();
resolutions.set('360', 640)
resolutions.set('480', 854)
resolutions.set('720', 1280)
resolutions.set('1080', 1920)
resolutions.set('1440', 2560)
resolutions.set('2160', 3840)

function App() {

  const [loading, setLoading] = useState(false);

  // Phone Settings
  const [chatName, setChatName] = useState("Emily Banks");
  const [chatImage, setChatImage] = useState(emily);
  const [lightmode, setLightMode] = useState(true);
  const [online, setOnline] = useState(true);
  const [platform, setPlatform] = useState("facebook");
  const [size, setSize] = useState({ width: 480, height: 854 });

  // Messages
  const [messages, setMessages] = useState([] as Array<IMessage>)
  const [people, setPeople] = useState([{ name: "Emily Banks", image: emily }] as Array<IPerson>);
  const [indexPerson, setIndexPerson] = useState(0);

  // Preview Settings
  const [playing, setPlaying] = useState(false);
  const [templateMessages, setTemplateMessages] = useState([] as Array<IMessage>)
  const [previewScrollY, setPreviewScrollY] = useState(0);
  const [phoneScrollY, setPhoneScrollY] = useState(0);

  // Export Settings
  const [resolution, setResolution] = useState("720");

  useEffect(() => {
    //Defaults
    setResolution("720");
    setLightMode(true);
    setOnline(true);
    setIndexPerson(0);
    setChatName("Emily Banks");
    setChatImage(emily);
    setPeople([{ name: "Emily Banks", image: emily }])
    setMessages(MESSAGES); // Set Messages Default

    // Todo Automatically adjust as the window resizes
    // setSize({ width: 480, height: 854 });
    setSize({ width: 480, height: resolutions.get("480")! });
  }, [])


  return (
    <main className="overflow-hidden">


      <div className="flex w-screen h-screen overflow-hidden bg-slate-50 relative z-10">
        {/* Preview UI */}
        <section className="w-2/5 flex justify-center flex-col m-auto items-center align-middle p-4">
          <Phone
            id="preview"
            name={chatName}
            image={chatImage}
            width={size.width}
            height={size.height}
            platform={platform}
            lightmode={lightmode}
            messages={playing ? templateMessages : messages}
            online={online}
            scrollY={previewScrollY}
            noScrollBar={playing}
          />
        </section>

        {/* Settings */}
        <section className="w-3/5 bg-gradient-to-tr from-gray-700 to-purple-900 flex flex-col gap-3 items-center">

          <Visuals
            platform={platform}
            setPlatform={setPlatform}
            lightmode={lightmode}
            setLightMode={setLightMode}
          />


          <MessageStatus
            people={people}
            indexPerson={indexPerson}
            loading={loading}
            messages={messages}
            setPeople={setPeople}
            setIndexPerson={setIndexPerson}
          />


          <div className="h-full flex flex-col justify-center">
            <Actions
              indexPerson={indexPerson}
              loading={loading}
              messages={messages}
              people={people}
              setMessages={setMessages}
            />
          </div>


          <Exporting
            playing={playing}
            loading={loading}
            messages={messages}
            setLoading={setLoading}
            setPlaying={setPlaying}
            setTemplateMessages={setTemplateMessages}
            setPhoneScrollY={setPhoneScrollY}
            setPreviewScrollY={setPreviewScrollY}
          />


        </section>

      </div>

      {/* Display Phone for Images and Videos */}
      <div className="fixed top-0 left-0 w-fit h-fit">
        <Phone
          id="phone"
          name={chatName}
          image={chatImage}
          width={parseInt(resolution)}
          height={resolutions.get(resolution)!}
          platform={platform}
          lightmode={true}
          messages={playing ? templateMessages : messages}
          online={true}
          scrollY={phoneScrollY}
          noScrollBar={true}
        />
      </div>

      <ToastContainer />


    </main>
  )
}

export default App
