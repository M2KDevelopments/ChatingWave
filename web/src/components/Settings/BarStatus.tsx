// import { BsPersonAdd } from 'react-icons/bs';
// import { FaCircle } from "react-icons/fa6";
import { IPerson } from '../../interfaces/person';
import { IMessage } from '../../interfaces/message';
import { Dispatch, SetStateAction, useState } from 'react';
import { toast } from 'react-toastify'
import emily from '../../assets/emily.jpg';
import IMAGES from '../../assets/images.json';
import JSZip from 'jszip';
import { MdBlock } from 'react-icons/md';
import { FaFileDownload, FaFileUpload } from 'react-icons/fa';
import DialogChatImage from '../Dialog/DialogChatImage';

const zip = new JSZip();


// const profileSize = 30;
interface IMessageStatus {
    lightmode: boolean,
    people: Array<IPerson>,
    chatName: string,
    chatImage: string,
    loading: boolean,
    messages: Array<IMessage>,
    indexPerson: number,
    setChatName: (chatName: string) => void,
    setChatImage: (chatImage: string) => void,
    setMessages: (messages: Array<IMessage>) => void,
    setPeople: Dispatch<SetStateAction<IPerson[]>>,
    setIndexPerson: (index: number) => void

}

function BarStatus(props: IMessageStatus) {

    const [dialog, setDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [personIndex, setPersonIndex] = useState(-1);
    const [name, setName] = useState("");

    const onClear = async () => {
        const result = await swal({
            title: 'Clear Chat',
            text: `Are you sure you want to clear this chat?`,
            icon: 'info',
            buttons: ['No', 'Yes']
        });
        if (!result) return;
        props.setMessages([]);
    }

    const onDownloadChat = async () => {


        if (loading) return;

        const name = await swal({
            title: 'Download Chat',
            text: `Enter the name of this chat?`,
            icon: 'info',
            content: { element: 'input' },
            buttons: ['No', 'Yes']
        });
        if (!name) return;


        setLoading(true);

        function loadImage(url: string): Promise<HTMLImageElement> {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.crossOrigin = "anonymous";
                img.src = url;
            });
        }
        function getBase64Image(img: HTMLImageElement) {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            ctx?.drawImage(img, 0, 0);
            const dataURL = canvas.toDataURL("image/png");
            return dataURL?.replace(/^data:image\/?[A-z]*;base64,/, '');
        }

        // load images
        const images = zip.folder("images");
        for (const message of props.messages) {
            if (message.image) {
                const img = await loadImage(message.image);
                const base64 = getBase64Image(img);
                images?.file(`${message.id}.png`, base64, { base64: true });
            }
        }
        const profiles = zip.folder("profiles");
        for (const message of props.messages) {
            if (message.profileImage) {
                const img = await loadImage(message.profileImage);
                const base64 = getBase64Image(img);
                profiles?.file(`${message.id}.png`, base64, { base64: true });
            }
        }

        const peopleFolder = zip.folder("people");
        for (const index in props.people) {
            const person = props.people[index];
            if (person.image) {
                const img = await loadImage(person.image);
                const base64 = getBase64Image(img);
                peopleFolder?.file(`${index}.png`, base64, { base64: true });
            }
        }

        const chatimg = await loadImage(props.chatImage);
        const chatbase64 = getBase64Image(chatimg);
        zip?.file(`chatimage.png`, chatbase64, { base64: true });
        zip.file('chat.json', JSON.stringify({
            chatName: props.chatName,
            people: props.people.map(person => {
                return { name: person.name }
            }),
            messages: JSON.stringify(props.messages.map(msg => {
                return { ...msg, image: "", profileImage: "" }
            }))
        }));

        const content = await zip.generateAsync({ type: "blob" });

        // Download Chat File
        const a = document.createElement('a');
        a.href = URL.createObjectURL(content);
        a.download = `${name}.chat`;
        a.click();
        a.remove();

        setLoading(false);
        toast.success('Downloaded Chat File')
    }


    // https://www.youtube.com/watch?v=serIZm6NJDg
    // https://stackoverflow.com/questions/39322964/extracting-zipped-files-using-jszip-in-javascript
    const onUploadChat = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0];
            const content = await zip.loadAsync(file)
            const filenames = Object.keys(content.files);

            const strjson = await content.files['chat.json'].async('string');
            const chatimageblob = await content.files['chatimage.png'].async('blob');
            const chatImage = URL.createObjectURL(chatimageblob);
            const chatjson = JSON.parse(strjson);
            const chatName = chatjson.chatName;
            if (typeof chatjson.messages == 'string') {
                chatjson.messages = JSON.parse(chatjson.messages);
            }
            for (const filename of filenames) {
                const blob = await content.files[filename].async('blob');

                // These are your file contents
                if (filename.includes('.png')) {
                    const image = URL.createObjectURL(blob);

                    if (filename.includes("images")) {
                        const i = filename.replace('.png', '').replace('images', '').replace('/', '')
                        const msgIndex = chatjson.messages.findIndex((m: IMessage) => m.id == i);
                        chatjson.messages[msgIndex].image = image;
                    } else if (filename.includes("profiles")) {
                        const i = filename.replace('.png', '').replace('profiles', '').replace('/', '')
                        const msgIndex = chatjson.messages.findIndex((m: IMessage) => m.id == i);
                        chatjson.messages[msgIndex].profileImage = image;
                    } else if (filename.includes("people")) {
                        const i = filename.replace('.png', '').replace('people', '').replace('/', '')
                        const personIndex = parseInt(i);
                        chatjson.people[personIndex].image = image;
                    }
                }
            }

            props.setChatName(chatName);
            props.setChatImage(chatImage);
            props.setMessages(chatjson.messages)
            props.setPeople(chatjson.people);
            toast.success('Chat Loaded');
        }
    }

    const onUpdateMessagesWithNewName = (oldname: string, newname: string, image: string) => {
        props.setMessages(props.messages.map(msg => {
            if (msg.name != oldname) return msg;
            return { ...msg, profileImage: image, name: newname }
        }));
    }


    const onUploadPersonImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files?.length) {
            const file = e.target.files[0];
            if (file.type.includes("image")) {
                const url = URL.createObjectURL(file);
                const oldname = props.people[personIndex].name;
                onUpdateMessagesWithNewName(oldname, name || props.people[personIndex].name, url);
                props.people[personIndex].name = name || oldname;
                props.people[personIndex].image = url;
                props.setPeople([...props.people]);
                setPersonIndex(-1);
            } else {
                toast.error('Please upload an image');
            }
        }
    }




    return (
        <div style={{ borderColor: props.lightmode ? "#bfcbd3" : "#4b5563" }} className='flex gap-3 w-full p-3 border-2 rounded-l'>


            <div className='flex gap-3 w-1/2 items-center relative justify-start'>
                <img src={props.chatImage} className='w-12 h-12 rounded-full cursor-pointer' onClick={() => setDialog(true)} />
                <input maxLength={20} disabled={props.loading || loading} className='border-2 h-10 border-blue-200 w-40 outline-none font-thin text-gray-600 rounded-lg px-2 focus:border-gray-600' value={props.chatName} onChange={e => props.setChatName(e.target.value)} placeholder='Chat Name' />
                <button disabled={props.loading || loading} onClick={onClear} title="Clear Chat" style={{ color: props.lightmode ? "#b91c1c" : "white" }} className=''>
                    <MdBlock size={28} />
                </button>
                <button disabled={props.loading || loading} onClick={onDownloadChat} title="Download Chat" style={{ color: props.lightmode ? "#be185d" : "white" }} className=''>
                    <FaFileDownload size={26} />
                </button>
                <button onClick={() => document.getElementById('upload-chat')?.click()} title="Upload Chat" style={{ color: props.lightmode ? "#be185d" : "white" }} className=''>
                    <FaFileUpload size={26} />
                </button>
                <input id="upload-chat" type="file" accept='.chat' className='invisible' onChange={onUploadChat} />
            </div>


            {/* People */}
            <div className="flex gap-2 w-1/2 justify-end items-center">
                {props.people.map((person, index) =>
                    <button disabled={props.loading} onDoubleClick={() => { setPersonIndex(index); setName(person.name) }} onClick={() => props.setIndexPerson(index)} style={{ backgroundColor: index == props.indexPerson ? "#be185d" : "#f8fafc" }} key={index} className="w-12 rounded-full bg-amber-500 p-1 cursor-pointer hover:bg-slate-400 duration-200 shadow hover:shadow-2xl hover:shadow-amber-500">
                        <img title={person.name} src={person.image} alt={person.name} className="rounded-full" />
                    </button>
                )}
                <button disabled={props.loading} onClick={() => props.setIndexPerson(-1)} style={{ backgroundColor: props.indexPerson == -1 ? "#be185d" : "#f8fafc", color: props.indexPerson != -1 ? "#831843" : "white" }} className="w-12 h-12 rounded-full  bg-slate-50 p-1 cursor-pointer hover:bg-purple-600 duration-200 flex justify-center items-center shadow hover:shadow-2xl hover:shadow-purple-100 hover:text-amber-900 hover:font-bold">
                    <span>You</span>
                </button>
                {/* <button disabled={props.loading} onClick={onAddPerson} className="w-16 rounded-full text-amber-900 bg-slate-50 p-1 cursor-pointer hover:bg-purple-600 duration-200 flex justify-center items-center shadow hover:shadow-2xl hover:shadow-purple-100 hover:text-white">
                    <BsPersonAdd size={profileSize} title="Add Person" className="rounded-full" />
                </button> */}
            </div>


            <DialogChatImage {...props} dialog={dialog} setDialog={setDialog} />


            {personIndex !== -1 ?
                <dialog style={{ visibility: personIndex !== -1 ? 'visible' : "hidden" }} id="dialog-image" className='w-screen h-screen flex flex-col justify-center items-center rounded-xl p-4 absolute top-0 bg-[#2f2e2ead] backdrop-blur-xl z-50'>

                    <div className='min-w-1/2 h-2/3 bg-white flex flex-col gap-2 rounded-2xl p-2 justify-center'>
                        <input maxLength={20} disabled={props.loading || loading} className='border-2 h-10 border-blue-200 w-full outline-none font-thin text-gray-600 rounded-lg px-2 focus:border-gray-600' value={name} onChange={e => setName(e.target.value)} placeholder='Name' />

                        <div className='grid mobile:grid-cols-5 phone:grid-cols-6 tablet:grid-cols-8 gap-2'>
                            <img src={emily}
                                onClick={() => {
                                    const n = (name || props.people[personIndex].name)
                                    const oldname = props.people[personIndex].name;
                                    onUpdateMessagesWithNewName(oldname, n, emily);
                                    props.people[personIndex].name = n;
                                    props.people[personIndex].image = emily;
                                    props.setPeople([...props.people]);
                                    setPersonIndex(-1)
                                }}
                                className="w-[70px] rounded-full cursor-pointer p-1 grayscale-[0.6] shadow-md hover:shadow-2xl duration-150 hover:grayscale-0"
                                alt="human" />
                            {IMAGES.humans.map((src, index) =>
                                <img key={'human' + index}
                                    onClick={() => {
                                        const n = (name || props.people[personIndex].name)
                                        const oldname = props.people[personIndex].name;
                                        onUpdateMessagesWithNewName(oldname, n, src);
                                        props.people[personIndex].name = n;
                                        props.people[personIndex].image = src;
                                        props.setPeople([...props.people]);
                                        setPersonIndex(-1)
                                    }}
                                    src={src}
                                    className="w-[70px] rounded-full cursor-pointer p-1 grayscale-[0.6] shadow-md hover:shadow-2xl duration-150 hover:grayscale-0"
                                    alt="human" />
                            )}
                        </div>
                        <div className='grid mobile:grid-cols-5 phone:grid-cols-6 tablet:grid-cols-8 gap-2'>
                            {IMAGES.animals.map((src, index) =>
                                <img src={src}
                                    key={'animals' + index}
                                    alt="animas"
                                    onClick={() => {
                                        const n = (name || props.people[personIndex].name)
                                        const oldname = props.people[personIndex].name;
                                        onUpdateMessagesWithNewName(oldname, n, src);
                                        props.people[personIndex].name = n;
                                        props.people[personIndex].image = src;
                                        props.setPeople([...props.people]);
                                        setPersonIndex(-1)
                                    }}
                                    className="w-[70px] rounded-full cursor-pointer p-1 grayscale-[0.6] shadow-md hover:shadow-2xl duration-150 hover:grayscale-0"
                                />
                            )}
                        </div>
                        <input className='invisible' id="upload-image" onChange={onUploadPersonImage} type="file" accept='image/*' />
                        <div className='flex'>
                            <button onClick={() => setPersonIndex(-1)} className='w-fit bg-none font-bold text-pink-400 mx-2 px-4 py-2 mt-8 rounded-lg cursor-pointer hover:bg-[#f3f1f12b] duration-200'>Cancel</button>
                            <button onClick={() => document.getElementById('upload-image')?.click()} className='w-fit bg-none font-bold text-cyan-400 mx-2 px-4 py-2 mt-8 rounded-lg cursor-pointer hover:bg-[#f3f1f12b] duration-200'>Upload</button>
                        </div>

                    </div>
                </dialog> : null}
        </div>
    )
}

export default BarStatus