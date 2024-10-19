import { useEffect, useRef, useState } from "react"
import Phone from "./components/Phone";
import { IMessage } from "./interfaces/message";
import domtoimage from 'dom-to-image';
import { IoMdHappy } from "react-icons/io";
import { IoSend } from "react-icons/io5";
import { BsCameraVideo, BsPersonAdd } from "react-icons/bs";
import { FaClock, FaStop } from "react-icons/fa";
import { IPerson } from "./interfaces/person";

// FFMPEG - https://ffmpegwasm.netlify.app/docs/getting-started/usage
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

// Popups and Modals
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import swal from "sweetalert";

// Assets
import whatsappAudio from './assets/snd-whatsapp-new.mp3';
import emily from './assets/emily.jpg';

const audio = new Audio(whatsappAudio);

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
  const [ffmpegLoaded, setFFmpegLoaded] = useState(false);

  // Phone Settings
  const [previewScrollY, setPreviewScrollY] = useState(0);
  const [phoneScrollY, setPhoneScrollY] = useState(0);
  const [lightmode, setLightMode] = useState(true);
  const [online, setOnline] = useState(true);
  const [platform, setPlatform] = useState("whatsapp");
  const [size, setSize] = useState({ width: 480, height: 854 });
  const [messages, setMessages] = useState([] as Array<IMessage>)
  const [people, setPeople] = useState([{ name: "Emily Banks", image: emily }] as Array<IPerson>);
  const [indexPerson, setIndexPerson] = useState(0);
  const currentPerson = 0;

  // Preview Settings
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [templateMessages, setTemplateMessages] = useState([] as Array<IMessage>)
  const waitFor = (seconds: number) => new Promise(resolve => setTimeout(resolve, seconds * 1000));

  // Message Settings
  const [messageText, setMessageText] = useState("");
  const [messageImage, setMessageImage] = useState("")

  // Export Settings
  const [resolution, setResolution] = useState("720");
  const [exportType, setExportType] = useState("png");
  const ffmpegRef = useRef(new FFmpeg());

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
    // setSize({ width: 480, height: 854 });
    setSize({ width: 480, height: resolutions.get("480")! });

    // Set Messages
    setMessages([
      {
        id: "1",
        me: false,
        text: "Hello there how are you doing?",
        time: "12:24",
        name: "Emily Bank",
        reactions: ["🫡", "🫵🏽", "👉🏽", "💯", "🔥"],
        scale: 1,
        opacity: 1,
      },
      {
        id: "2",
        me: true,
        reactions: ["🫡", "🫵🏽", "👉🏽", "💯", "🔥"],
        text: "Hello there how are you doing?",
        time: "12:25",
        name: "Me",
        image: "https://images.pexels.com/photos/886521/pexels-photo-886521.jpeg?auto=compress&cs=tinysrgb&w=600",
        scale: 1,
        opacity: 1,
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
        scale: 1,
        opacity: 1,
      },

      {
        id: "4",
        me: false,
        reactions: [],
        text: "Hello there how are you doing?",
        time: "12:24",
        name: "Emily Bank",
        scale: 1,
        opacity: 1,
      },
      {
        id: "5",
        me: true,
        reactions: [],
        text: "Hello there how are you doing?",
        time: "12:25",
        name: "Me",
        image: "https://images.pexels.com/photos/886521/pexels-photo-886521.jpeg?auto=compress&cs=tinysrgb&w=600",
        scale: 1,
        opacity: 1,
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
        scale: 1,
        opacity: 1,
      },

      {
        id: "7",
        me: false,
        reactions: [],
        text: "Hello there how are you doing?",
        time: "12:24",
        replyId: "1",
        name: "Emily Bank",
        scale: 1,
        opacity: 1,
      },
      {
        id: "8",
        me: true,
        reactions: [],
        text: "Hello there how are you doing?",
        time: "12:25",
        name: "Me",
        image: "https://images.pexels.com/photos/886521/pexels-photo-886521.jpeg?auto=compress&cs=tinysrgb&w=600",
        scale: 1,
        opacity: 1,
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
        scale: 1,
        opacity: 1,
      }
    ]);
  }, [])


  useEffect(() => {
    const load = async () => {
      try {
        const baseURL = 'https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm';
        const ffmpeg = ffmpegRef.current;
        ffmpeg.on('log', console.log);

        console.log('Loading FFMPEG')
        // toBlobURL is used to bypass CORS issue, urls with the same
        // domain can be used directly.
        await ffmpeg.load({
          coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
          wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
          workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, "text/javascript"),
          // workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, "text/javascript", true, console.log),
        })
        setFFmpegLoaded(true);
        console.log('Loaded FFMPEG.wasm');
      } catch (err) {
        console.log(err);
      }
    }


    load();
  }, [])


  const onAddMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (messageText.trim() == '') return;
    const d = new Date();
    const hours = d.getHours() < 10 ? `0${d.getHours()}` : d.getHours()
    const mins = d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes();
    const time = `${hours}:${mins}`;
    const message = {
      id: crypto.randomUUID(),
      me: indexPerson == -1,
      reactions: [],
      text: messageText,
      time: time,
      image: messageImage,
      name: indexPerson == -1 ? "Me" : people[indexPerson].name,
      read: true,
      scale: 1,
      opacity: 1,
    } as IMessage;
    setMessages([...messages, message]);
    setMessageText("")
  }

  const onAddPerson = async () => {
    const name = await swal({
      title: `Add Person to Chat`,
      text: `What is the name of the person?`,
      icon: `info`,
      content: { element: 'input' },
      buttons: ['NO', 'YES']
    });
    if (!name) return;
    setPeople([...people, { name, image: emily }]);
  }

  const onExport = async () => {
    const phone = document.getElementById('phone')!;
    const container = document.getElementById(`conversation-phone`)!;
    const previewContainer = document.getElementById('conversation-preview')!;
    const phoneScroll = previewContainer.scrollTop * container.getBoundingClientRect().height / previewContainer.getBoundingClientRect().height;

    // link for image downloads
    const a = document.createElement('a');

    try {
      setLoading(true)
      if (exportType == 'png') {
        setPhoneScrollY(-phoneScroll);
        const img = await domtoimage.toPng(phone);
        a.href = img;
        a.download = 'Chating Wave.png';
        a.click();
        a.remove();
        setPhoneScrollY(0);
      } else if (exportType == 'jpeg') {
        setPhoneScrollY(-phoneScroll);
        const img = await domtoimage.toJpeg(phone);
        a.href = img;
        a.download = 'Chating Wave.jpg';
        a.click();
        a.remove();
        setPhoneScrollY(0);
      } else if (exportType == 'svg') {
        setPhoneScrollY(-phoneScroll);
        const img = await domtoimage.toSvg(phone);
        a.href = img;
        a.download = 'Chating Wave.svg';
        a.click();
        a.remove();
        setPhoneScrollY(0);
      } else if (exportType == 'video') {

        container.scrollTo(0, 0);
        setPhoneScrollY(0);

        setLoading(true);
        setPlaying(true);


        // DOM Elements
        const list = [];
        const images = [] as string[];

        // Load Messages
        let scrolling = 0;

        // animation
        const seconds = 0.5;
        const frames = 30;
        const count = parseInt((seconds * frames).toString());

        // height of all the message before the are remove from const 
        const messageHeights = messages.map((msg) => document.getElementById(`msg-phone-${msg.id}`)!.getBoundingClientRect());


        for (const index in messages) {

          // calculate percentage of progress
          const percentage = parseInt((+index * 100.0 / messages.length).toString())
          console.log('Loading', index, 'out of', messages.length);
          setProgress(percentage);

          const msg = { ...messages[index] };// a copy of the object


          // wait for the message to appear
          await waitFor(msg.delay || 2);

          // add message to the list
          msg.scale = 1;
          msg.opacity = 0;
          list.push(msg)
          setTemplateMessages([...list]);


          // Get the images for the video
          for (let i = 0; i <= count; i++) {
            const p = percentage + ((i * (100 / messages.length)) / count);
            setProgress(p);
            list[index].opacity = parseFloat(((i / count) * 1.00).toString());
            setTemplateMessages([...list]);
            const imgB64 = await domtoimage.toJpeg(phone);
            images.push(imgB64);
          }

          // wait frames
          const waiting = 3; // seconds
          for (let i = 0; i <= waiting * frames; i++)  images.push(images[images.length - 1]);


          // simulate scroll to the bottom
          // Get bottom of container and bottom of last message
          // message under the container
          const y1 = container.getBoundingClientRect().bottom;
          const y2 = messageHeights[index].bottom - (scrolling * -1);
          if (y2 > y1) {
            let padding = 30;
            // if the next is a new message
            if ((+index < (messages.length - 1)) && (messages[+index + 1].me)) padding = 40;

            scrolling -= (y2 - y1) + padding;
            setPhoneScrollY(scrolling)
          }

        }

        console.log('Done Collection Images');
        await waitFor(2);


        // Execute FFMPeg command
        const ffmpeg = ffmpegRef.current;
        for (let i = 1; i < images.length; i++) {
          const name = `${i < 10 ? `0${i}` : i}.jpeg`;
          const image = await fetchFile(images[i]); // UintArray
          await ffmpeg.writeFile(name, image);
          console.log(name, 'added');
        }

        // await ffmpeg.writeFile('input.avi', await fetchFile('https://raw.githubusercontent.com/ffmpegwasm/testdata/master/video-15s.avi'));
        const command = `-r ${frames} -i %2d.jpeg -pix_fmt yuv420p output.mp4`.split(' ');
        await ffmpeg.exec(command);


        // Download Video File
        const data = await ffmpeg.readFile('output.mp4');
        a.href = URL.createObjectURL(new Blob([data], { type: 'video/mp4' }));;
        a.download = 'Chating Wave.mp4';
        a.click();
        a.remove();
        for (let i = 1; i < images.length; i++) {
          const name = `${i < 10 ? `0${i}` : i}.jpeg`
          await ffmpeg.deleteFile(name);
        }
        await ffmpeg.deleteFile('output.mp4');


        //stop
        setTemplateMessages([]);
        setLoading(false)
        setPlaying(false);
        setProgress(99);
        setProgress(0);
        setPhoneScrollY(0);
      }

      // Show done popup
      if (exportType != 'loading') toast("Exported " + exportType)
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false)
    }
  }

  const onPreview = async () => {

    // modal query
    const result = await swal({
      title: `Preview Chat`,
      text: `Do you want to preview this chat`,
      icon: 'info',
      buttons: ['No', 'Yes']
    });

    if (!result) return;



    // Loading States
    setPlaying(true);
    setLoading(true);


    // DOM Elements
    const list = [];


    // scroll
    let scrolling = 0;

    // Load Messages
    const container = document.getElementById(`conversation-preview`)!;
    container.scrollTo(0, 0);
    setPreviewScrollY(0);

    // height of all the message before the are remove from const 
    const messageHeights = messages.map((msg) => document.getElementById(`msg-preview-${msg.id}`)!.getBoundingClientRect());


    for (const index in messages) {

      const msg = { ...messages[index] };// a copy of the object


      // wait for the message to appear
      await waitFor(msg.delay || 2);

      // add message to the list
      msg.scale = 1;
      msg.opacity = 1;
      list.push(msg)
      setTemplateMessages([...list]);

      // play audio
      if (!msg.me) audio.play();

      // simulate scroll to the bottom
      // Get bottom of container and bottom of last message
      // message under the container
      const y1 = container.getBoundingClientRect().bottom;
      const y2 = messageHeights[index].bottom - (scrolling * -1);
      console.log(`msg-preview-${msg.id}`, y2, y1);
      if (y2 > y1) {
        let padding = 30;
        // if the next is a new message
        if ((+index < (messages.length - 1)) && (messages[+index + 1].me)) padding = 40;

        scrolling -= (y2 - y1) + padding;
        setPreviewScrollY(scrolling)
      }

    }


    await waitFor(3); //seconds

    // scroll to the bottom
    setPreviewScrollY(0);
    container.scrollTo(0, 0);

    // stop animation
    onStop();


    // display toastify notification
    toast('Done Preview');

  }


  const onStop = () => {
    setTemplateMessages([]);
    setPlaying(false);
    setLoading(false)
  }


  return (
    <main className="overflow-hidden">


      <div className="flex w-screen h-screen overflow-hidden bg-slate-50 relative z-10">
        {/* Preview UI */}
        <section className="w-2/5 flex justify-center flex-col m-auto items-center align-middle p-4">
          <Phone
            id="preview"
            name={people[currentPerson].name}
            image={people[currentPerson].image}
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
        <section className="w-3/5 bg-gradient-to-tr from-blue-500 to-purple-900 flex flex-col gap-3 justify-center items-center">

          <div className="flex gap-3">
            {people.map((person, index) =>
              <button disabled={loading} onClick={() => setIndexPerson(index)} style={{ backgroundColor: index == indexPerson ? "#f59e0b" : "#f8fafc" }} key={index} className="w-16 rounded-full bg-amber-500 p-1 cursor-pointer hover:bg-slate-400 duration-200 shadow hover:shadow-2xl hover:shadow-amber-500">
                <img title={person.name} src={person.image} alt={person.name} className="rounded-full" />
              </button>
            )}
            <button disabled={loading} onClick={() => setIndexPerson(-1)} style={{ backgroundColor: indexPerson == -1 ? "#f59e0b" : "#f8fafc" }} className="w-16 rounded-full text-amber-900 bg-slate-50 p-1 cursor-pointer hover:bg-purple-600 duration-200 flex justify-center items-center shadow hover:shadow-2xl hover:shadow-purple-100 hover:text-white">
              <span>You</span>
            </button>
            <button disabled={loading} onClick={onAddPerson} className="w-16 rounded-full text-amber-900 bg-slate-50 p-1 cursor-pointer hover:bg-purple-600 duration-200 flex justify-center items-center shadow hover:shadow-2xl hover:shadow-purple-100 hover:text-white">
              <BsPersonAdd size={50} title="Add Person" className="rounded-full" />
            </button>
          </div>

          <input disabled={loading} className='border-2 h-10 border-blue-200 w-full outline-none font-thin text-gray-600 rounded-full px-5 focus:border-gray-600' value={messageImage} onChange={e => setMessageImage(e.target.value)} placeholder='Image URL' />

          <form onSubmit={onAddMessage} className="flex w-2/3 gap-3 justify-center items-center bg-slate-200  text-slate-600 px-4 py-2 rounded-full shadow-2xl hover:shadow-amber-600 duration-300">
            <IoMdHappy title="Emoji" size={30} />
            <FaClock title="When" size={30} />
            <input disabled={loading} className='border-2 h-10 border-blue-200 w-full outline-none font-thin text-gray-600 rounded-full px-5 focus:border-gray-600' value={messageText} onChange={e => setMessageText(e.target.value)} placeholder='Message' />
            <button disabled={loading} type="submit" className='shadow-md bg-blue-600 rounded-full flex justify-center items-center text-white hover:bg-blue-950 duration-200 cursor-pointer' style={{ width: 60, height: 40 }}>
              <IoSend />
            </button>
          </form>

          {playing ?
            <button className="mt-20 flex content-center items-center align-middle text-center justify-center gap-4 w-2/4 px-6 py-2 font-bold text-white text-3xl bg-gradient-to-tr from-red-400 to-red-500 shadow-2xl shadow-red-400 hover:shadow-3xl hover:shadow-blue-300 duration-200 cursor-pointer rounded-full" onClick={onStop}>
              <span>Stop</span>
              <FaStop />
            </button> :
            <button className="mt-20 flex content-center items-center align-middle text-center justify-center gap-4 w-2/4 px-6 py-2 font-bold text-white text-3xl bg-gradient-to-tr from-blue-400 to-blue-500 shadow-2xl shadow-blue-400 hover:shadow-3xl hover:shadow-blue-300 duration-200 cursor-pointer rounded-full" disabled={loading} onClick={onPreview}>
              <span>Preview</span>
              <BsCameraVideo />
            </button>
          }

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
              <option value="1080">1080p HD</option>
              <option value="1440">2K HD</option>
              <option value="2160">4K HD</option>

            </select>

            <select className="p-2 rounded-3xl shadow-xl" value={exportType} onChange={e => setExportType(e.target.value)}>
              <option value="png">PNG</option>
              <option value="jpeg">JPEG</option>
              <option value="svg">SVG</option>
              <option value="gif">GIF</option>
              {ffmpegLoaded ? <option value="video">VIDEO</option> : <option value="loading">Loading</option>}
            </select>
          </div>

          <button disabled={loading} className="w-1/4 px-6 py-2 font-bold text-white bg-gradient-to-tr from-amber-400 to-amber-500 shadow-lg hover:shadow-2xl hover:shadow-amber-300 duration-200 cursor-pointer rounded-3xl" onClick={onExport}>{loading ? "Loading..." : "Export"}</button>


          {/* Progress Bar */}
          {progress <= 0 ? null :
            <div className="flex-start flex h-1 w-full overflow-hidden rounded-full bg-gray-50 font-sans text-xs font-medium">
              <div style={{ width: `${progress}%` }} className={`flex h-full w-[${progress}%] items-center justify-center overflow-hidden break-all rounded-full bg-amber-500 text-white`}></div>
            </div>
          }



        </section>

      </div>

      {/* Display Phone for Images and Videos */}
      <div className="fixed top-0 left-0 w-fit h-fit">
        <Phone
          id="phone"
          name="Emily Banks"
          width={parseInt(resolution)}
          height={resolutions.get(resolution)!}
          platform="whatsapp"
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
