import { FaImage, FaPlay, FaStop, FaVideo } from "react-icons/fa6"
import domtoimage from 'dom-to-image';
import { toast } from "react-toastify";

// FFMPEG - https://ffmpegwasm.netlify.app/docs/getting-started/usage
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { useEffect, useRef, useState } from "react";
import { IMessage } from "../../interfaces/message";
import swal from "sweetalert";

// Assets
import whatsappAudio from '../../assets/snd-whatsapp-new.mp3';
const audio = new Audio(whatsappAudio);


interface IExport {
    loading: boolean,
    playing: boolean,
    messages: Array<IMessage>,
    resolution: string,
    setTemplateMessages: (messages: Array<IMessage>) => void,
    setLoading: (loading: boolean) => void,
    setPlaying: (playing: boolean) => void,
    setPhoneScrollY: (y: number) => void,
    setPreviewScrollY: (y: number) => void,
    setResolution: (r: string) => void,
}

const resolutions = new Map<string, string>();
resolutions.set('360', '360p')
resolutions.set('480', '480p')
resolutions.set('720', '720p')
resolutions.set('1080', '1080p')
resolutions.set('1440', 'HD 2k')
resolutions.set('2160', 'HD 4k')

function SaveMessages(props: IExport) {

    const [progress, setProgress] = useState(0);
    const [ffmpegLoaded, setFFmpegLoaded] = useState(false);
    const ffmpegRef = useRef(new FFmpeg());
    const waitFor = (seconds: number) => new Promise(resolve => setTimeout(resolve, seconds * 1000));


    useEffect(() => {
        const load = async () => {
            try {
                const baseURL = ''; //'https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm';
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
        props.setPlaying(true);
        props.setLoading(true);


        // DOM Elements
        const list = [];


        // scroll
        let scrolling = 0;

        // Load Messages
        const container = document.getElementById(`conversation-preview`)!;
        container.scrollTo(0, 0);
        props.setPreviewScrollY(0);

        // height of all the message before the are remove from const 
        const messageHeights = props.messages.map((msg) => document.getElementById(`msg-preview-${msg.id}`)!.getBoundingClientRect());
        const waitFor = (seconds: number) => new Promise(resolve => setTimeout(resolve, seconds * 1000));


        for (const index in props.messages) {

            const msg = { ...props.messages[index] };// a copy of the object
            const reactions = [...msg.reactions];
            msg.reactions = [];

            // wait for the message to appear
            await waitFor(msg.delay || 2);

            // add message to the list
            msg.scale = 1;
            msg.opacity = 1;
            list.push(msg)
            props.setTemplateMessages([...list]);

            // play audio
            if (!msg.me) audio.play();

            // simulate scroll to the bottom
            // Get bottom of container and bottom of last message
            // message under the container
            const y1 = container.getBoundingClientRect().bottom;
            const y2 = messageHeights[index].bottom - (scrolling * -1);

            if (y2 > y1) {
                let padding = 30;
                // if the next is a new message
                if ((+index < (props.messages.length - 1)) && (props.messages[+index + 1].me)) padding = 40;

                scrolling -= (y2 - y1) + padding;
                props.setPreviewScrollY(scrolling)
            }

            // do reactions
            const reactionTime = 2;//seconds
            for (const reaction of reactions) {
                await waitFor(reactionTime);
                list[index].reactions.push(reaction);
                props.setTemplateMessages([...list]);
            }

        }


        await waitFor(3); //seconds

        // scroll to the bottom
        props.setPreviewScrollY(0);
        container.scrollTo(0, 0);

        // stop animation
        onStop();


        // display toastify notification
        toast('Done Preview');

    }


    const onStop = () => {
        props.setTemplateMessages([]);
        props.setPlaying(false);
        props.setLoading(false)
    }



    const onExport = async () => {

        const result = await swal({
            title: `Export Video`,
            text: 'Would you like to export video?',
            icon: 'info',
            buttons: ['No', 'Yes'],
        });

        if (!result) return;


        const phone = document.getElementById('phone')!;
        const container = document.getElementById(`conversation-phone`)!;

        // link for image downloads
        const a = document.createElement('a');

        try {
            props.setLoading(true)
            container.scrollTo(0, 0);
            props.setPhoneScrollY(0);

            props.setLoading(true);
            props.setPlaying(true);


            // DOM Elements
            const list = [];
            const images = [] as string[];

            // Load Messages
            let scrolling = 0;

            // animation
            const FRAMES = 30;

            // height of all the message before the are remove from const 
            const messageHeights = props.messages.map((msg) => document.getElementById(`msg-phone-${msg.id}`)!.getBoundingClientRect());


            for (const index in props.messages) {

                // calculate percentage of progress
                const percentage = parseInt((+index * 100.0 / props.messages.length).toString())
                console.log('Loading', index, 'out of', props.messages.length);
                setProgress(percentage);

                const msg = { ...props.messages[index] };// a copy of the object
                const reactions = [...msg.reactions];
                msg.reactions = [];

                // wait for the message to appear
                await waitFor(msg.delay || 2);

                // add message to the list
                msg.scale = 1;
                msg.opacity = 0;
                list.push(msg)
                props.setTemplateMessages([...list]);


                // simulate scroll to the bottom
                // Get bottom of container and bottom of last message
                // message under the container
                const y1 = container.getBoundingClientRect().bottom;
                const y2 = messageHeights[index].bottom - (scrolling * -1);
                if (y2 > y1) {
                    let padding = 30;
                    // if the next is a new message
                    if ((+index < (props.messages.length - 1)) && (props.messages[+index + 1].me)) padding = 40;

                    scrolling -= (y2 - y1) + padding;
                    props.setPhoneScrollY(scrolling)
                }

                // For calculating sub percentages
                const differentBetweenMajorPecentage = (100 / props.messages.length);


                // Get the images for the video
                const seconds = 0.3;
                const count = parseInt((seconds * FRAMES).toString());
                for (let i = 0; i <= count; i++) {
                    const p = percentage + ((i * differentBetweenMajorPecentage * 0.5) / count);
                    setProgress(p);
                    list[index].opacity = parseFloat(((i / count) * 1.00).toString());
                    props.setTemplateMessages([...list]);
                    const imgB64 = await domtoimage.toJpeg(phone);
                    images.push(imgB64);
                }


                // Reaction Animations
                if (reactions.length) {
                    const reactionTime = 2 * FRAMES; // seconds
                    for (const i in reactions) {
                        const p = percentage + ((parseInt(i) * differentBetweenMajorPecentage * 0.5) / reactions.length) + differentBetweenMajorPecentage * 0.5;
                        setProgress(p);

                        const reaction = reactions[i];
                        list[index].reactions.push(reaction);
                        props.setTemplateMessages([...list]);
                        for (let j = 0; j < reactionTime; j++) {
                            const imgB64 = await domtoimage.toJpeg(phone);
                            images.push(imgB64);
                        }
                    }
                }


                // wait frames
                const waiting = 3; // seconds
                for (let i = 0; i <= waiting * FRAMES; i++)  images.push(images[images.length - 1]);




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

            const exportType = 'mp4'
            const extension = exportType;
            // await ffmpeg.writeFile('input.avi', await fetchFile('https://raw.githubusercontent.com/ffmpegwasm/testdata/master/video-15s.avi'));
            const command = `-r ${FRAMES} -i %2d.jpeg -pix_fmt yuv420p output.${extension}`.split(' ');
            await ffmpeg.exec(command);


            // Download Video File
            const data = await ffmpeg.readFile(`output.${extension}`);
            a.href = URL.createObjectURL(new Blob([data], { type: 'video/mp4' }));;
            a.download = `Chating Wave.${extension}`;
            a.click();
            a.remove();
            for (let i = 1; i < images.length; i++) {
                const name = `${i < 10 ? `0${i}` : i}.jpeg`
                await ffmpeg.deleteFile(name);
            }
            await ffmpeg.deleteFile(`output.${extension}`);


            //stop
            props.setTemplateMessages([]);
            props.setLoading(false)
            props.setPlaying(false);
            setProgress(99);
            setProgress(0);
            props.setPhoneScrollY(0);

            // Show done popup
            toast("Exported Chating Wave Video")
        } catch (e) {
            console.log(e);
        } finally {
            props.setLoading(false)
        }
    }



    const onScreenshot = async () => {
        const phone = document.getElementById('phone')!;
        const container = document.getElementById(`conversation-phone`)!;
        const previewContainer = document.getElementById('conversation-preview')!;
        const phoneScroll = previewContainer.scrollTop * container.getBoundingClientRect().height / previewContainer.getBoundingClientRect().height;

        // link for image downloads
        const a = document.createElement('a');

        // Screenshot
        props.setPhoneScrollY(-phoneScroll);
        const img = await domtoimage.toJpeg(phone);
        a.href = img;
        a.download = 'Chating Wave.jpg';
        a.click();
        a.remove();
        props.setPhoneScrollY(0);
        toast("Exported Screenshot");
    }

    const onResolutionChange = () => {
        const keys = Array.from(resolutions.keys());
        const currentIndex = keys.indexOf(props.resolution);
        const nextIndex = (currentIndex + 1) % resolutions.size;
        const r = keys[nextIndex];
        props.setResolution(r);
    }

    return (
        <div className="flex flex-col w-full">

            <div className='flex w-full'>
                {props.playing ?
                    <button className="rounded-s-md flex content-center items-center align-middle text-center justify-center gap-4 w-2/4 px-6 py-3 font-bold text-white text-2xl bg-gradient-to-tr from-red-400 to-red-500 shadow-2xl shadow-red-400 hover:shadow-3xl hover:shadow-white duration-200 cursor-pointer" onClick={onStop}>
                        <span>Stop</span>
                        <FaStop />
                    </button> :
                    <button className="rounded-s-md flex content-center items-center align-middle text-center justify-center gap-4 w-2/4 px-6 py-3 font-bold text-white text-2xl bg-gradient-to-tr from-blue-400 to-blue-500 shadow-2xl shadow-blue-400 hover:shadow-3xl hover:shadow-blue-300 duration-200 cursor-pointer" disabled={props.loading} onClick={onPreview}>
                        <span>Preview</span>
                        <FaPlay />
                    </button>
                }

                <button disabled={props.loading} className="flex content-center items-center align-middle text-center justify-center gap-4 w-2/4 px-6 py-3 font-bold text-white text-2xl bg-gradient-to-tr from-pink-400 to-pink-500 shadow-2xl shadow-pink-400 hover:shadow-3xl hover:shadow-white duration-200 cursor-pointer" onClick={onScreenshot}>
                    <span>{props.loading ? "Loading..." : "Screenshot"}</span>
                    <FaImage />
                </button>

                <button disabled={props.loading} className="flex content-center items-center align-middle text-center justify-center gap-4 w-2/4 px-6 py-3 font-bold text-white text-2xl bg-gradient-to-tr from-amber-400 to-amber-500 shadow-2xl shadow-amber-400 hover:shadow-3xl hover:shadow-white duration-200 cursor-pointer" onClick={onExport}>
                    <span>{props.loading || !ffmpegLoaded ? "Loading..." : "Video"}</span>
                    <FaVideo />
                </button>
                <button onClick={onResolutionChange} className="rounded-e-md bg-amber-500 px-4 font-bold text-white shadow-2xl shadow-amber-400 hover:shadow-3xl hover:shadow-white duration-200 cursor-pointer">
                    {resolutions.get(props.resolution)}
                </button>

            </div>

            {/* Progress Bar */}
            {progress <= 0 ? null :
                <div className="flex-start flex h-1 w-full overflow-hidden rounded-full bg-gray-50 font-sans text-xs font-medium">
                    <div style={{ width: `${progress}%` }} className={`flex h-full w-[${progress}%] items-center justify-center overflow-hidden break-all rounded-full bg-amber-500 text-white`}></div>
                </div>
            }

        </div>
    )
}

export default SaveMessages