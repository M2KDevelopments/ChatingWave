import React, { useEffect, useState } from 'react'
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

const size = 20;


interface IAction {
    lightmode: boolean,
    loading: boolean,
    messages: Array<IMessage>,
    indexPerson: number,
    people: Array<IPerson>,
    setMessages: (messages: Array<IMessage>) => void,
    chatImage: string,
    chatName: string,
    platform: string,
    setChatName: (chatName: string) => void,
    setChatImage: (chatImage: string) => void,
    setPlatform: (p: string) => void,
}


function MessageActions(props: IAction) {

    // Message Settings
    const [messageText, setMessageText] = useState("");
    const [messageImage, setMessageImage] = useState("");
    const [messageTime, setMessageTime] = useState("12:00");

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
    }


    const onFileLoad = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files?.length) {
            const file = e.target.files[0];
            const url = URL.createObjectURL(file);
            setMessageImage(url);
        }

    }


    return (
        <div style={{ borderColor: props.lightmode ? "#bfcbd3" : "#4b5563" }} className='w-full p-2 border-2 rounded-md flex flex-col'>

            <div className='flex gap-3 hover:bg-gray-400 duration-300  items-center p-3 relative'>
                <img src={props.chatImage} className='w-12 h-12 rounded-full cursor-pointer' onClick={() => (document.getElementById('dialog-chatimage') as HTMLDialogElement).show()} />
                <input maxLength={20} disabled={props.loading} className='border-2 h-10 border-blue-200 w-full outline-none font-thin text-gray-600 rounded-full px-5 focus:border-gray-600' value={props.chatName} onChange={e => props.setChatName(e.target.value)} placeholder='Chat Name' />
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
                props.messages.reverse().length > 0 ?
                    <div
                        style={{
                            background: props.lightmode ? "#d9d8d8" : "#1a2439",
                        }}
                        className='flex flex-col gap-2 h-[45vh] p-2 overflow-y-scroll rounded-lg'>
                        {props.messages.map((message, index) =>
                            props.lightmode ?
                                <div key={'act' + index} className='flex gap-3 hover:bg-slate-400 duration-300 items-center p-3 relative'>
                                    <img src={message.profileImage} className='w-8 h-8 rounded-full' />
                                    <span className='w-full text-wrap text-ellipsis text-slate-900'>{message.text}</span>
                                    <span className='absolute right-2 bottom-2 text-slate-900 font-thin'>{message.time}</span>
                                </div> :
                                <div key={'act' + index} className='flex gap-3 hover:bg-cyan-950 duration-300 items-center p-3 relative'>
                                    <img src={message.profileImage} className='w-8 h-8 rounded-full' />
                                    <span className='w-full text-wrap text-ellipsis text-white'>{message.text}</span>
                                    <span className='absolute right-2 bottom-2 text-white font-thin'>{message.time}</span>
                                </div>
                        )}

                    </div>
                    :
                    <div className='flex flex-col gap-2 h-[400px] p-2 overflow-y-scroll'>
                        <p style={{ color: props.lightmode ? "gray" : "white" }} className='w-full h-full flex flex-col justify-center text-center'>
                            <span className='text-5xl'>No Chat</span>
                            <span className='text-2xl italic'></span>
                        </p>
                    </div>
            }


            <input id="image" onChange={onFileLoad} disabled={props.loading} type="file" accept='image/*' className='invisible border-2 h-10 border-blue-200 w-full outline-none font-thin text-gray-600 rounded-full px-5 focus:border-gray-600' value={messageImage} placeholder='Image URL' />

            <form
                style={{
                    background: props.lightmode ? "#959595" : "#e2e8f0",
                    color: props.lightmode ? "white" : "#475569",
                }}
                onSubmit={onAddMessage} className="flex w-full gap-3 justify-center items-center px-4 py-2 rounded-md shadow-sm hover:shadow-blue-100 duration-300">
                <div className='cursor-pointer hover:text-amber-800 duration-300'>
                    <IoMdHappy title="Emoji" size={30} />
                </div>
                {/* <div className='cursor-pointer hover:text-blue-800 duration-300'>
                    <FaMicrophoneLines title="Add Audio" size={30} />
                </div>
                <div className='cursor-pointer hover:text-blue-800 duration-300'>
                    <MdRecordVoiceOver title="Dub message" size={30} />
                </div> */}
                <div className='cursor-pointer hover:text-pink-800 duration-300' onClick={() => document.getElementById('image')?.click()}>
                    <FaImage color={messageImage ? "pink" : undefined} title="Insert Image" size={30} />
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

            <dialog  id="dialog-chatimage" className='w-screen h-screen flex flex-col justify-center items-center rounded-xl p-4 absolute top-0 bg-[#2f2e2ead] backdrop-blur-xl'>
                <div className='w-1/2 h-1/2 bg-[#f3f1f12b] flex flex-col gap-2 rounded-2xl p-2 justify-center'>
                    <div className='grid grid-cols-8 gap-2'>
                        {IMAGES.humans.map((src) => <img onClick={() => { props.setChatImage(src); (document.getElementById('dialog-chatimage') as HTMLDialogElement).close() }} src={src} className="w-[70px] rounded-full cursor-pointer p-1 grayscale-[0.6] shadow-md hover:shadow-2xl duration-150 hover:grayscale-0" alt="human" />)}
                    </div>
                    <div className='grid grid-cols-8 gap-2'>
                        {IMAGES.animas.map((src) => <img onClick={() => { props.setChatImage(src); (document.getElementById('dialog-chatimage') as HTMLDialogElement).close() }} src={src} className="w-[70px] rounded-full cursor-pointer p-1 grayscale-[0.6] shadow-md hover:shadow-2xl duration-150 hover:grayscale-0" alt="animas" />)}
                    </div>
                </div>
            </dialog>

        </div>
    )
}

export default MessageActions