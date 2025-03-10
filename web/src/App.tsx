import { useEffect, useState } from "react"
import Phone from "./components/Phone";

// Interfaces
import { IMessage } from "./interfaces/message";
import { IPerson } from "./interfaces/person";

// Popups and Modals
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Settings Component RHS
import AppTheme from "./components/Settings/AppTheme";
import BarStatus from "./components/Settings/BarStatus";
import MessageActions from "./components/Settings/MessageActions";
import SaveMessages from "./components/Settings/SaveMessages";

// Assets
import { MESSAGES, CHATNAME, PERSONNAME } from './assets/messages'
import emily from './assets/emily.jpg';
import Ad from "./components/Settings/Ad";
 


// Export Resolutions
const resolutions = new Map<string, number>();
resolutions.set('360', 640)
resolutions.set('480', 854)
resolutions.set('720', 1280)
resolutions.set('1080', 1920)
resolutions.set('1440', 2560)
// resolutions.set('2160', 3840)


function App() {

  const [loading, setLoading] = useState(false);

  // Phone Settings
  const [chatName, setChatName] = useState(CHATNAME);
  const [chatImage, setChatImage] = useState(emily);
  const [lightmode, setLightMode] = useState(false);
  const [platform, setPlatform] = useState("whatsapp");
  const [size, setSize] = useState({ width: 480, height: 854 });

  // For Visuals
  const [hoverIndex, setHoverIndex] = useState(-1);

  // Messages
  const [messages, setMessages] = useState([] as Array<IMessage>)
  const [people, setPeople] = useState([{ name: PERSONNAME, image: emily }] as Array<IPerson>);
  const [indexPerson, setIndexPerson] = useState(0);

  // Preview Settings
  const [playing, setPlaying] = useState(false);
  const [templateMessages, setTemplateMessages] = useState([] as Array<IMessage>)
  const [previewScrollY, setPreviewScrollY] = useState(0);
  const [phoneScrollY, setPhoneScrollY] = useState(0);

  // Screen Size
  const [screen, setScreen] = useState(900);

  // Export Settings
  const [resolution, setResolution] = useState("720");

 
  useEffect(() => {
    //Defaults
    setResolution("720");
    setIndexPerson(0);
    setPeople([{ name: PERSONNAME, image: emily }])
    setMessages(MESSAGES); // Set Messages Default

    // Automatically adjust as the window resizes
    function handleResize() {
      const screenWidth = document.documentElement.getBoundingClientRect().width;
      const percentage = screenWidth <= 800 ? 90 : 25;
      const p = percentage / 100.0;
      const w = document.documentElement.getBoundingClientRect().width * p;
      const h = document.documentElement.getBoundingClientRect().width * p * (1920 / 1080);
      setSize({ width: parseInt(w.toString()), height: parseInt(h.toString()) });
      setScreen(screenWidth)

    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [])


  // Mobile Version
  if (screen <= 800) {
    return (
      <main className="overflow-hidden">
        <div style={{ background: lightmode ? "#f7f7f7" : "#111827" }} className="flex w-screen h-screen overflow-hidden relative z-10">

          <section className="w-full flex flex-col m-auto align-middle p-1">

            <AppTheme
              fullscreen={true}
              lightmode={lightmode}
              setLightMode={setLightMode}
              platform={platform}
              setPlatform={setPlatform}
            />


            <BarStatus
              fullscreen={true}
              chatImage={chatImage}
              chatName={chatName}
              setChatImage={setChatImage}
              setChatName={setChatName}
              setMessages={setMessages}
              lightmode={lightmode}
              people={people}
              indexPerson={indexPerson}
              loading={loading}
              messages={messages}
              setPeople={setPeople}
              setIndexPerson={setIndexPerson}
            />


            <div className="shadow-2xl shadow-cyan-600">
              <Phone
                id="preview"
                fullscreen={true}
                name={chatName}
                setChatName={setChatName}
                image={chatImage}
                setChatImage={setChatImage}
                width={size.width}
                height={size.height}
                platform={platform}
                lightmode={lightmode}
                messages={playing ? templateMessages : messages}
                people={people}
                setMessages={setMessages}
                online={true}
                scrollY={previewScrollY}
                noScrollBar={playing}
                hoverIndex={hoverIndex}
                setHoverIndex={setHoverIndex}
                indexPerson={indexPerson}
              />
            </div>

            <SaveMessages
              fullscreen={true}
              playing={playing}
              loading={loading}
              messages={messages}
              setLoading={setLoading}
              setPlaying={setPlaying}
              setTemplateMessages={setTemplateMessages}
              setPhoneScrollY={setPhoneScrollY}
              setPreviewScrollY={setPreviewScrollY}
              resolution={resolution}
              setResolution={setResolution}
            />


          </section>
        </div>

        {/* Display Phone for Images and Videos */}
        <div className="fixed top-0 left-0 w-fit h-fit">
          <Phone
            id="phone"
            fullscreen={false}
            name={chatName}
            setChatName={setChatName}
            setChatImage={setChatImage}
            image={chatImage}
            width={parseInt(resolution)}
            height={resolutions.get(resolution)!}
            platform={platform}
            lightmode={lightmode}
            messages={playing ? templateMessages : messages}
            people={people}
            setMessages={setMessages}
            online={true}
            scrollY={phoneScrollY}
            noScrollBar={true}
            hoverIndex={-1}
            setHoverIndex={setHoverIndex}
            indexPerson={indexPerson}
          />
        </div>

        <ToastContainer />
      </main>
    )
  }


  return (
    <main className="overflow-hidden">


      <div style={{ background: lightmode ? "#f7f7f7" : "#111827" }} className="flex w-screen h-screen overflow-hidden relative z-10">

        {/* Preview UI */}
        <section className="w-2/5 flex justify-center flex-col m-auto items-center align-middle p-4">
          <div className="shadow-2xl shadow-cyan-600">
            <Phone
              id="preview"
              fullscreen={false}
              name={chatName}
              setChatName={setChatName}
              image={chatImage}
              setChatImage={setChatImage}
              width={size.width}
              height={size.height}
              platform={platform}
              lightmode={lightmode}
              messages={playing ? templateMessages : messages}
              people={people}
              setMessages={setMessages}
              online={true}
              scrollY={previewScrollY}
              noScrollBar={playing}
              hoverIndex={hoverIndex}
              setHoverIndex={setHoverIndex}
              indexPerson={indexPerson}
            />
          </div>
        </section>

        {/* Settings */}
        <section style={{ background: lightmode ? "#f7f7f7" : "#111827" }} className="w-3/5 bg-gradient-to-tr flex flex-col gap-3 items-center mt-2">

          <AppTheme
            fullscreen={false}
            lightmode={lightmode}
            setLightMode={setLightMode}
            platform={platform}
            setPlatform={setPlatform}
          />


          <BarStatus
            fullscreen={false}
            chatImage={chatImage}
            chatName={chatName}
            setChatImage={setChatImage}
            setChatName={setChatName}
            setMessages={setMessages}
            lightmode={lightmode}
            people={people}
            indexPerson={indexPerson}
            loading={loading}
            messages={messages}
            setPeople={setPeople}
            setIndexPerson={setIndexPerson}
          />


          <MessageActions
            lightmode={lightmode}
            indexPerson={indexPerson}
            loading={loading}
            messages={messages}
            people={people}
            setMessages={setMessages}
            chatName={chatName}
            chatImage={chatImage}
            setChatImage={setChatImage}
            setChatName={setChatName}
            platform={platform}
            setPlatform={setPlatform}
            setHoverIndex={setHoverIndex}
            setPeople={setPeople}
            setIndexPerson={setIndexPerson}
          />

          <SaveMessages
            fullscreen={false}
            playing={playing}
            loading={loading}
            messages={messages}
            setLoading={setLoading}
            setPlaying={setPlaying}
            setTemplateMessages={setTemplateMessages}
            setPhoneScrollY={setPhoneScrollY}
            setPreviewScrollY={setPreviewScrollY}
            resolution={resolution}
            setResolution={setResolution}
          />

          {/* Support Developer */}
          <Ad />

        </section>

      </div>

      {/* Display Phone for Images and Videos */}
      <div className="fixed top-0 left-0 w-fit h-fit">
        <Phone
          id="phone"
          fullscreen={false}
          name={chatName}
          setChatName={setChatName}
          setChatImage={setChatImage}
          image={chatImage}
          width={parseInt(resolution)}
          height={resolutions.get(resolution)!}
          platform={platform}
          lightmode={lightmode}
          messages={playing ? templateMessages : messages}
          people={people}
          setMessages={setMessages}
          online={true}
          scrollY={phoneScrollY}
          noScrollBar={true}
          hoverIndex={-1}
          setHoverIndex={setHoverIndex}
          indexPerson={indexPerson}
        />
      </div>

      <ToastContainer />


    </main>
  )
}

export default App
