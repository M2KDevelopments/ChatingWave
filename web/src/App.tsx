import { useEffect, useState } from "react"
import Phone from "./components/Phone";
import { IMessage } from "./interfaces/message";
import domtoimage from 'dom-to-image';
import { IoMdHappy } from "react-icons/io";
import { IoSend } from "react-icons/io5";
import { BsCameraVideo, BsPersonAdd } from "react-icons/bs";
import { FaClock } from "react-icons/fa";
import emily from './assets/emily.jpg';
import { IPerson } from "./interfaces/person";


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
  const [lightmode, setLightMode] = useState(true);
  const [online, setOnline] = useState(true);
  const [platform, setPlatform] = useState("whatsapp");
  const [size, setSize] = useState({ width: 480, height: 854 });
  const [messages, setMessages] = useState([] as Array<IMessage>)
  const [people, setPeople] = useState([{ name: "Emily Banks", image: emily }] as Array<IPerson>);
  const [indexPerson, setIndexPerson] = useState(0);

  // Message Settings
  const [text, setText] = useState("");

  // Export Settings
  const [resolution, setResolution] = useState("720");
  const [exportType, setExportType] = useState("video");


  useEffect(() => {

    //Defaults
    setLightMode(true);
    setOnline(true);
    setIndexPerson(0);
    setPeople([
      {
        name: "Emily Banks",
        image: emily
      }
    ])

    // Todo Automatically adjust as the window resizes
    setSize({ width: 480, height: 854 });

    // Set Messages
    setMessages([
      {
        id: "1",
        me: false,
        reactions: [],
        text: "Hello there how are you doing?",
        time: "12:24",
        name: "Emily Bank"
      },
      {
        id: "2",
        me: true,
        reactions: ["🫡", "🫵🏽", "👉🏽", "💯", "🔥"],
        text: "Hello there how are you doing?",
        time: "12:25",
        name: "Me",
        image: "https://images.pexels.com/photos/886521/pexels-photo-886521.jpeg?auto=compress&cs=tinysrgb&w=600"
      },
      {
        id: "3",
        me: true,
        reactions: ["🫡"],
        text: "Hello there how are you doing?\nHello there how are you doing?\nHello there how are you doing? Hello there how are you doing? Hello there how are you doing?",
        time: "12:28",
        name: "Me",
        replyId: "2",
        read: true,
      },

      {
        id: "4",
        me: false,
        reactions: [],
        text: "Hello there how are you doing?",
        time: "12:24",
        name: "Emily Bank"
      },
      {
        id: "5",
        me: true,
        reactions: [],
        text: "Hello there how are you doing?",
        time: "12:25",
        name: "Me",
        image: "https://images.pexels.com/photos/886521/pexels-photo-886521.jpeg?auto=compress&cs=tinysrgb&w=600"
      },
      {
        id: "6",
        me: true,
        reactions: ["🫡"],
        text: "Hello there how are you doing?\nHello there how are you doing?\nHello there how are you doing? Hello there how are you doing? Hello there how are you doing?",
        time: "12:28",
        name: "Me",
        replyId: "1",
        read: true,
      },

      {
        id: "7",
        me: false,
        reactions: [],
        text: "Hello there how are you doing?",
        time: "12:24",
        name: "Emily Bank"
      },
      {
        id: "8",
        me: true,
        reactions: [],
        text: "Hello there how are you doing?",
        time: "12:25",
        name: "Me",
        image: "https://images.pexels.com/photos/886521/pexels-photo-886521.jpeg?auto=compress&cs=tinysrgb&w=600"
      },
      {
        id: "9",
        me: true,
        reactions: ["🫡", "🫡"],
        text: "Hello there how are you doing?\nHello there how are you doing?\nHello there how are you doing? Hello there how are you doing? Hello there how are you doing?",
        time: "12:28",
        name: "Me",
        replyId: "1",
        read: true,
      }
    ]);
  }, [])


  const onAddMessage = async (e: any) => {
    e.preventDefault();

  }

  const onExport = async () => {
    const phone = document.getElementById('phone')!;
    const a = document.createElement('a');

    try {
      setLoading(true)
      if (exportType == 'png') {
        const img = await domtoimage.toPng(phone);
        a.href = img;
        a.download = 'Chating Waving.png';
        a.click();
        a.remove();
      } else if (exportType == 'jpeg') {
        const img = await domtoimage.toJpeg(phone);
        a.href = img;
        a.download = 'Chating Waving.jpg';
        a.click();
        a.remove();
      } else if (exportType == 'svg') {
        const img = await domtoimage.toSvg(phone);
        a.href = img;
        a.download = 'Chating Waving.svg';
        a.click();
        a.remove();
      } else if (exportType == 'video') {
        console.log('Coming Soon');
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false)
    }
  }

  const onPreview = () => {

  }

  return (
    <main className="flex w-screen h-screen overflow-hidden">
      <section className="w-2/5 flex justify-center flex-col m-auto items-center align-middle p-4">
        <Phone
          name={people[indexPerson].name}
          image={people[indexPerson].image}
          width={size.width}
          height={size.height}
          platform={platform}
          lightmode={lightmode}
          messages={messages}
          online={online}
        />
      </section>
      <section className="w-3/5 bg-gradient-to-tr from-blue-500 to-purple-900 flex flex-col gap-3 justify-center items-center">

        <div className="flex gap-3">
          {people.map((person, index) =>
            <div onClick={() => setIndexPerson(index)} style={{ backgroundColor: index == indexPerson ? "#f59e0b" : "#f8fafc" }} key={index} className="w-16 rounded-full bg-amber-500 p-1 cursor-pointer hover:bg-slate-400 duration-200 shadow hover:shadow-2xl hover:shadow-amber-500">
              <img title={person.name} src={person.image} alt={person.name} className="rounded-full" />
            </div>
          )}
          <div className="w-16 rounded-full text-amber-900 bg-slate-50 p-1 cursor-pointer hover:bg-purple-600 duration-200 flex justify-center items-center shadow hover:shadow-2xl hover:shadow-purple-100 hover:text-white">
            <BsPersonAdd size={50} title="Add Person" className="rounded-full" />
          </div>
        </div>

        <form onSubmit={onAddMessage} className="flex w-2/3 gap-3 justify-center items-center bg-slate-200  text-slate-600 px-4 py-2 rounded-full shadow-2xl hover:shadow-amber-600 duration-300">
          <IoMdHappy title="Emoji" size={30} />
          <FaClock title="When" size={30} />
          <input className='border-2 h-10 border-blue-200 w-full outline-none font-thin text-gray-600 rounded-full px-5 focus:border-gray-600' value={text} onChange={e => setText(e.target.value)} placeholder='Message' />
          <button type="submit" className='shadow-md bg-blue-600 rounded-full flex justify-center items-center text-white hover:bg-blue-950 duration-200 cursor-pointer' style={{ width: 60, height: 40 }}>
            <IoSend />
          </button>
        </form>

        <button className="mt-20 flex content-center items-center align-middle text-center justify-center gap-4 w-2/4 px-6 py-2 font-bold text-white text-3xl bg-gradient-to-tr from-blue-400 to-blue-500 shadow-2xl shadow-blue-400 hover:shadow-3xl hover:shadow-blue-300 duration-200 cursor-pointer rounded-full" disabled={loading} onClick={onPreview}>
          <span>Preview</span>
          <BsCameraVideo />
        </button>

        <div className="mt-20 w-1/4 flex gap-3 justify-center">
          <select className="p-2 rounded-3xl shadow-xl" value={platform} onChange={e => setPlatform(e.target.value)}>
            <option value="whatsapp">WhatsApp</option>
            <option value="facebook">Facebook</option>
            <option value="twitter">Twitter/X</option>
            <option value="instagram">Instagram</option>
            <option value="tiktok">Tiktok</option>
            <option value="linkedin">Linkedin</option>
          </select>

          <select className="p-2 rounded-3xl shadow-xl" value={resolution} onChange={e => setResolution(e.target.value)}>
            <option value="360">360p</option>
            <option value="480">480p</option>
            <option value="720">720p HD</option>
            <option value="1080">10800p HD</option>
            <option value="1440">2K HD</option>
          </select>

          <select className="p-2 rounded-3xl shadow-xl" value={exportType} onChange={e => setExportType(e.target.value)}>
            <option value="png">Png</option>
            <option value="jpeg">JPeg</option>
            <option value="svg">SVG</option>
            <option value="gif">Gif</option>
            <option value="video">Video</option>
          </select>
        </div>

        <button className="w-1/4 px-6 py-2 font-bold text-white bg-gradient-to-tr from-amber-400 to-amber-500 shadow-lg hover:shadow-2xl hover:shadow-amber-300 duration-200 cursor-pointer rounded-3xl" disabled={loading} onClick={onExport}>Export</button>

      </section>

      <div id="phone" className="w-screen h-screen fixed top-full">
        <Phone
          name="Emily Banks"
          width={parseInt(resolution)}
          height={resolutions.get(resolution)!}
          platform="whatsapp"
          lightmode={true}
          messages={messages}
          online={true}
        />
      </div>
    </main>
  )
}

export default App
