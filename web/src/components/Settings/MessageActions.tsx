/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { FaImage } from 'react-icons/fa6'
import { IoMdHappy } from 'react-icons/io'
import { IoSend } from 'react-icons/io5'
import { IMessage } from '../../interfaces/message'
import { IPerson } from '../../interfaces/person'
// import {FaMicrophoneLines} from 'react-icons/fa6'
// import { MdGif } from "react-icons/md";
// import { MdRecordVoiceOver } from "react-icons/md";
import { FaSquareFacebook } from "react-icons/fa6";
import { FaSquareWhatsapp } from "react-icons/fa6";
// import { FaSquareXTwitter } from "react-icons/fa6";
// import { FaSquareInstagram } from "react-icons/fa6";
// import { FaTelegram } from "react-icons/fa6";
// import { AiFillTikTok } from "react-icons/ai";
import emily from '../../assets/emily.jpg';
import IMAGES from '../../assets/images.json';
import { toast } from 'react-toastify'
import EmojiData from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { MdBlock } from 'react-icons/md'
import { FaCloudDownloadAlt, FaCloudUploadAlt } from 'react-icons/fa'
import JSZip from 'jszip';
import ModalTextMessage from '../Modals/ModalTextMessage'
import { AiFillDelete, AiFillEdit } from 'react-icons/ai'
const zip = new JSZip();
const size = 20;


interface IAction {
    lightmode: boolean,
    loading: boolean,
    messages: Array<IMessage>,
    indexPerson: number,
    people: Array<IPerson>,

    chatImage: string,
    chatName: string,
    platform: string,
    setChatName: (chatName: string) => void,
    setChatImage: (chatImage: string) => void,
    setPlatform: (p: string) => void,
    setHoverIndex: (index: number) => void,
    setMessages: (messages: Array<IMessage>) => void,
    setPeople: (people: Array<IPerson>) => void,
}

interface Emoji {
    id: string,
    keywords: [string],
    name: string,
    native: string,
    shortcodes: string,
    unified: string
}


function MessageActions(props: IAction) {

    // Message Settings
    const [messageText, setMessageText] = useState("");
    const [messageImage, setMessageImage] = useState("");
    const [messageTime, setMessageTime] = useState("12:00");
    const [dialog, setDialog] = useState(false);
    const [dialogEmoji, setDialogEmoji] = useState(false);
    const [dialogEmojiReact, setDialogEmojiReact] = useState("");
    const [loading, setLoading] = useState(false);
    const [editMessage, setEditMessage] = useState({} as IMessage);

    const onUpdateMessage = () => {
        const index = props.messages.findIndex(m => m.id == editMessage.id);
        props.messages[index].text = editMessage.text;
        props.setMessages([...props.messages]);
        setEditMessage({} as IMessage);
    }

    useEffect(() => {
        const d = new Date();
        const hours = d.getHours() < 10 ? `0${d.getHours()}` : d.getHours()
        const mins = d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes();
        const time = `${hours}:${mins}`;
        setMessageTime(time);
    }, [])

    const onAddMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (messageText.trim() == '') return;
        // const d = new Date();
        // const hours = d.getHours() < 10 ? `0${d.getHours()}` : d.getHours()
        // const mins = d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes();
        // const time = `${hours}:${mins}`;
        const message = {
            id: crypto.randomUUID(),
            me: props.indexPerson == -1,
            reactions: [],
            text: messageText,
            time: messageTime,
            image: messageImage,
            name: props.indexPerson == -1 ? "Me" : props.people[props.indexPerson].name,
            read: true,
            scale: 1,
            opacity: 1,
            profileImage: emily
        } as IMessage;
        props.setMessages([...props.messages, message]);
        setMessageText("")
        setMessageImage("");
    }


    const onGetImage = async () => {
        if (messageImage) {
            const result = await swal({
                title: 'Remove Image',
                text: 'Are you sure you want to remove image',
                icon: 'info',
                buttons: ['No', 'Yes'],
            });
            if (!result) return;
            setMessageImage("");
        } else document.getElementById('image')?.click();
    }
    const onImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {


        if (e.target.files && e.target.files?.length) {
            const file = e.target.files[0];
            if (file.type.includes("image")) {
                const url = URL.createObjectURL(file);
                setMessageImage(url);
            } else {
                toast.error('Please upload an image');
            }
        }

    }

    const onChangeTime = async (msgIndex: number, time: string) => {
        const newtime = await swal({
            text: 'Enter the time for the message',
            icon: 'info',
            content: {
                element: 'input',
                attributes: {
                    'style': '2px solid cyan;',
                    'value': time,
                    'placeholder': 'Enter the time e.g 12:14'
                }
            }
        });

        if (!/^\d{1,2}:\d{2}$/.test(newtime)) return;

        const [h, m] = newtime.split(':').map(Number);
        if (h < 0 || m < 0 || h > 23 || m > 59) return;

        const formattedTime = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        props.messages[msgIndex].time = formattedTime;
        props.setMessages([...props.messages]);
        toast.success(`Time Updated from ${time} to ${formattedTime}`);
    }

    const onUploadChatImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files?.length) {
            const file = e.target.files[0];
            if (file.type.includes("image")) {
                const url = URL.createObjectURL(file);
                props.setChatImage(url);
            } else {
                toast.error('Please upload an image');
            }
        }
    }

    const onEmojiSelect = (emojiData: Emoji) => {
        const emoji = emojiData.native;
        setMessageText(`${messageText} ${emoji}`);
    }

    const onEmojiSelectReact = (emojiData: Emoji) => {
        const emoji = emojiData.native;
        const messageId = dialogEmojiReact;
        const index = props.messages.findIndex(msg => msg.id == messageId);
        props.messages[index].reactions.push(emoji);
        props.setMessages([...props.messages]);
        toast.success(`Reacted to message with ${emoji}`);
    }

    const onDeleteMessage = async (index: number) => {
        props.setMessages(props.messages.filter((m, i) => i != index));
        toast.success('Message removed');
    }


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

    return (
        <div style={{ borderColor: props.lightmode ? "#bfcbd3" : "#4b5563" }} className='w-full p-2 border-2 rounded-md flex flex-col'>

            <div className='flex gap-3 hover:bg-gray-400 duration-300  items-center p-3 relative'>
                <img src={props.chatImage} className='w-12 h-12 rounded-full cursor-pointer' onClick={() => setDialog(true)} />
                <input maxLength={20} disabled={props.loading || loading} className='border-2 h-10 border-blue-200 w-32 outline-none font-thin text-gray-600 rounded-full px-2 focus:border-gray-600' value={props.chatName} onChange={e => props.setChatName(e.target.value)} placeholder='Chat Name' />
                <button disabled={props.loading || loading} onClick={onClear} title="Clear Chat" style={{ color: props.lightmode ? "#b91c1c" : "white" }} className=''>
                    <MdBlock size={28} />
                </button>
                <button disabled={props.loading || loading} onClick={onDownloadChat} title="Download Chat" style={{ color: props.lightmode ? "#be185d" : "white" }} className=''>
                    <FaCloudDownloadAlt size={28} />
                </button>
                <button onClick={() => document.getElementById('upload-chat')?.click()} title="Upload Chat" style={{ color: props.lightmode ? "#be185d" : "white" }} className=''>
                    <FaCloudUploadAlt size={28} />
                </button>
                <input id="upload-chat" type="file" accept='.chat' className='invisible' onChange={onUploadChat} />

                <div className='w-full'></div>
                <div className='flex gap-5 justify-end'>

                    <div title="Whatsapp" onClick={() => props.setPlatform('whatsapp')} className='p-2 bg-white rounded-full w-fit h-fit cursor-pointer'>
                        <FaSquareWhatsapp size={size} color={props.platform == 'whatsapp' ? "#25D366" : "grey"} />
                    </div>
                    <div title="Facebook" onClick={() => props.setPlatform('facebook')} className='p-2 bg-white rounded-full w-fit h-fit cursor-pointer'>
                        <FaSquareFacebook size={size} color={props.platform == 'facebook' ? "#1877F2" : "grey"} />
                    </div>
                    {/* <div title="Twitter" onClick={() => props.setPlatform('twitter')} className='p-2 bg-white rounded-full w-fit h-fit cursor-pointer'>
                        <FaSquareXTwitter size={size} color={props.platform == 'twitter' ? undefined : "grey"} />
                    </div>
                    <div title="Instagram" onClick={() => props.setPlatform('instagram')} className='p-2 bg-white rounded-full w-fit h-fit cursor-pointer'>
                        <FaSquareInstagram size={size} color={props.platform == 'instagram' ? "purple" : "grey"} />
                    </div>
                    <div title="Telegram" onClick={() => props.setPlatform('telegram')} className='p-2 bg-white rounded-full w-fit h-fit cursor-pointer'>
                        <FaTelegram size={size} color={props.platform == 'telegram' ? "#24A1DE" : "grey"} />
                    </div>
                    <div title="Tiktok" onClick={() => props.setPlatform('tiktok')} className='p-2 bg-white rounded-full w-fit h-fit cursor-pointer'>
                        <AiFillTikTok size={size} color={props.platform == 'tiktok' ? undefined : "grey"} />
                    </div> */}
                </div>

            </div>

            {
                props.messages.length > 0 ?
                    <DragDropContext onDragEnd={(dropResult) => console.log(dropResult)}>
                        <Droppable droppableId="droppable">
                            {(provided, snapshot) => (
                                <div
                                    {...provided.droppableProps} ref={provided.innerRef}
                                    style={{ background: props.lightmode ? "#d9d8d8" : "#1a2439" }}
                                    className='flex flex-col gap-2 h-[45vh] p-2 overflow-y-scroll rounded-lg'>
                                    {props.messages.map((message, index) =>
                                        <Draggable key={'act' + index} draggableId={message.id} index={index}>
                                            {(provided, snapshot) => (
                                                props.lightmode ?
                                                    <div
                                                        key={'drag' + index}
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className='cursor-grab flex gap-3 hover:bg-slate-400 duration-300 items-center px-3 py-6 relative'
                                                    // onMouseEnter={() => props.setHoverIndex(index)} 
                                                    // onMouseLeave={() => props.setHoverIndex(-1)}
                                                    >
                                                        <img src={message.profileImage} className='w-8 h-8 rounded-full' />
                                                        <span className='pointer-events-none w-full text-wrap text-ellipsis text-slate-900'>{message.text}</span>
                                                        <span onClick={() => setDialogEmojiReact(message.id)} className='cursor-pointer absolute right-[136px] bottom-2 text-slate-900 font-thin'><IoMdHappy color={message.reactions.length ? " #f59e0b" : undefined} title="React to Message" size={20} /></span>
                                                        <span onClick={() => setEditMessage(message)} className='cursor-pointer absolute right-24 bottom-2 text-slate-900 font-thin'><AiFillEdit title="Edit Message" size={20} /></span>
                                                        <span onClick={() => onDeleteMessage(index)} className='cursor-pointer absolute right-14 bottom-2 text-slate-900 font-thin'><AiFillDelete title="Edit Message" size={20} /></span>
                                                        <span onClick={() => onChangeTime(index, message.time)} className='cursor-pointer absolute right-2 bottom-2 text-slate-900 font-thin'>{message.time}</span>
                                                    </div>
                                                    :
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        key={'act' + index}
                                                        className='cursor-grab flex gap-3 hover:bg-cyan-950 duration-300 items-center px-3 py-4 relative'
                                                        onMouseEnter={() => props.setHoverIndex(index)} onMouseLeave={() => props.setHoverIndex(-1)}>
                                                        <img src={message.profileImage} className='w-8 h-8 rounded-full' />
                                                        <span className='pointer-events-none w-full text-wrap text-ellipsis text-white '>{message.text}</span>
                                                        <span onClick={() => setDialogEmojiReact(message.id)} className='cursor-pointer absolute right-[136px] bottom-2 text-white font-thin'><IoMdHappy color={message.reactions.length ? " #f59e0b" : undefined} title="React to Message" size={20} /></span>
                                                        <span onClick={() => setEditMessage(message)} className='cursor-pointer absolute right-24 bottom-2 text-white font-thin'><AiFillEdit title="Edit Message" size={20} /></span>
                                                        <span onClick={() => onDeleteMessage(index)} className='cursor-pointer absolute right-14 bottom-2 text-white font-thin'><AiFillDelete title="Edit Message" size={20} /></span>
                                                        <span onClick={() => onChangeTime(index, message.time)} className='cursor-pointer absolute right-2 bottom-2 text-white font-thin'>{message.time}</span>
                                                    </div>
                                            )}
                                        </Draggable>
                                    )}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                    :
                    <div className='flex flex-col gap-2 h-[400px] p-2 overflow-y-scroll'>
                        <p style={{ color: props.lightmode ? "gray" : "white" }} className='w-full h-full flex flex-col justify-center text-center'>
                            <span className='text-5xl'>No Chat</span>
                            <span className='text-2xl italic'></span>
                        </p>
                    </div>
            }


            <input id="image" onChange={onImageUpload} disabled={props.loading} type="file" accept='image/*' className='invisible border-2 h-10 border-blue-200 w-full outline-none font-thin text-gray-600 rounded-full px-5 focus:border-gray-600' placeholder='Image URL' />

            <form
                style={{
                    background: props.lightmode ? "#959595" : "#e2e8f0",
                    color: props.lightmode ? "white" : "#475569",
                }}
                onSubmit={onAddMessage} className="flex w-full gap-3 justify-center items-center px-4 py-2 rounded-md shadow-sm hover:shadow-blue-100 duration-300">
                <div onClick={() => setDialogEmoji(true)} className='cursor-pointer hover:text-amber-800 duration-300'>
                    <IoMdHappy title="Emoji" size={30} />
                </div>
                {/* <div className='cursor-pointer hover:text-blue-800 duration-300'>
                    <FaMicrophoneLines title="Add Audio" size={30} />
                </div>
                <div className='cursor-pointer hover:text-blue-800 duration-300'>
                <MdRecordVoiceOver title="Dub message" size={30} />
                </div> */}
                <div className='cursor-pointer hover:text-pink-800 duration-300' onClick={onGetImage}>
                    {messageImage ? <img src={messageImage} height={30} alt="Message" className='rounded-md max-h-[60px]' /> : <FaImage title="Insert Image" size={30} />}
                </div>
                {/* <div className='cursor-pointer hover:text-purple-800 duration-300'>
                    <MdGif title="Add Gif" size={40} />
                </div> */}
                <input disabled={props.loading} value={messageTime} onChange={e => setMessageTime(e.target.value)} type="time" name="time" className='w-1/5 border-2 h-10 border-blue-200  outline-none font-thin text-gray-600 rounded-md px-2 focus:border-gray-600' />
                <input disabled={props.loading} className='border-2 h-10 border-blue-200 w-full outline-none font-thin text-gray-600 rounded-md px-3 focus:border-gray-600' value={messageText} onChange={e => setMessageText(e.target.value)} placeholder='Message' />
                <button disabled={props.loading} type="submit" className='min-w-14 shadow-md bg-slate-600 rounded-md flex justify-center items-center text-white hover:bg-blue-950 duration-200 cursor-pointer' style={{ width: 60, height: 40 }}>
                    <IoSend />
                </button>
            </form>

            <dialog style={{ visibility: editMessage.id ? 'visible' : "hidden" }} className='w-screen h-screen flex flex-col justify-center items-center rounded-xl p-4 absolute top-0 bg-[#2f2e2ead] backdrop-blur-xl'>
                <div className='min-w-1/2 h-1/3 bg-[#230a2e1a] flex flex-col gap-2 rounded-2xl p-2 justify-center'>
                    <textarea maxLength={500} value={editMessage ? editMessage.text : ""} onChange={(e) => setEditMessage({ ...editMessage, text: e.target.value })} id="edit-message" className='rounded-md w-[400px] h-full bg-white p-2' placeholder='Write Your message here...' />
                    <div className='flex'>
                        <button onClick={() => setEditMessage({} as IMessage)} className='w-fit bg-none text-pink-600 mx-2 px-4 py-2 mt-8 rounded-lg cursor-pointer hover:bg-[#f3f1f12b] duration-200'>Cancel</button>
                        <button onClick={onUpdateMessage} className='w-fit bg-none text-cyan-300 mx-2 px-4 py-2 mt-8 rounded-lg cursor-pointer hover:bg-[#f3f1f12b] duration-200'>Update Message</button>
                    </div>
                </div>

            </dialog>

            <ModalTextMessage editMessage={editMessage} messages={props.messages} setMessages={props.setMessages} setEditMessage={setEditMessage} />

            {dialogEmoji ? <dialog onClick={() => setDialogEmoji(false)} style={{ visibility: dialogEmoji ? 'visible' : "hidden" }} className='w-screen h-screen flex flex-col justify-center items-center rounded-xl p-4 absolute top-0 bg-[#2f2e2ead] backdrop-blur-xl'>
                <Picker data={EmojiData} onEmojiSelect={onEmojiSelect} />
            </dialog> : null}

            {dialogEmojiReact ? <dialog onClick={() => setDialogEmojiReact("")} style={{ visibility: dialogEmojiReact ? 'visible' : "hidden" }} className='w-screen h-screen flex flex-col justify-center items-center rounded-xl p-4 absolute top-0 bg-[#2f2e2ead] backdrop-blur-xl'>
                <Picker data={EmojiData} onEmojiSelect={onEmojiSelectReact} />
            </dialog> : null}

            {dialog ? <dialog style={{ visibility: dialog ? 'visible' : "hidden" }} id="dialog-chatimage" className='w-screen h-screen flex flex-col justify-center items-center rounded-xl p-4 absolute top-0 bg-[#2f2e2ead] backdrop-blur-xl'>
                <div className='min-w-1/2 h-2/3 bg-[#f3f1f12b] flex flex-col gap-2 rounded-2xl p-2 justify-center'>
                    <div className='grid mobile:grid-cols-6 tablet:grid-cols-8 gap-2'>
                        <img src={emily}
                            onClick={() => { props.setChatImage(emily); setDialog(false) }}
                            className="w-[70px] rounded-full cursor-pointer p-1 grayscale-[0.6] shadow-md hover:shadow-2xl duration-150 hover:grayscale-0"
                            alt="human" />
                        {IMAGES.humans.map((src, index) =>
                            <img key={'human' + index}
                                onClick={() => { props.setChatImage(src); setDialog(false) }}
                                src={src}
                                className="w-[70px] rounded-full cursor-pointer p-1 grayscale-[0.6] shadow-md hover:shadow-2xl duration-150 hover:grayscale-0"
                                alt="human" />
                        )}
                    </div>
                    <div className='grid mobile:grid-cols-6 tablet:grid-cols-8 gap-2'>
                        {IMAGES.animals.map((src, index) =>
                            <img src={src}
                                key={'animals' + index}
                                alt="animas"
                                onClick={() => { props.setChatImage(src); setDialog(false) }}
                                className="w-[70px] rounded-full cursor-pointer p-1 grayscale-[0.6] shadow-md hover:shadow-2xl duration-150 hover:grayscale-0"
                            />
                        )}
                    </div>
                    <input className='invisible' id="upload-chatimage" onChange={onUploadChatImage} type="file" accept='image/*' />
                    <div className='flex'>

                        <button onClick={() => setDialog(false)} className='w-fit bg-none font-bold text-pink-400 mx-2 px-4 py-2 mt-8 rounded-lg cursor-pointer hover:bg-[#f3f1f12b] duration-200'>Cancel</button>
                        <button onClick={() => document.getElementById('upload-chatimage')?.click()} className='w-fit bg-none font-bold text-cyan-400 mx-2 px-4 py-2 mt-8 rounded-lg cursor-pointer hover:bg-[#f3f1f12b] duration-200'>Upload</button>
                    </div>

                </div>
            </dialog> : null}

        </div >
    )
}

export default MessageActions