import React, { useEffect, useState } from 'react'
import { FaImage } from 'react-icons/fa6'
import { IoMdHappy } from 'react-icons/io'
import { IoSend } from 'react-icons/io5'
import { IMessage } from '../../interfaces/message'
import { IPerson } from '../../interfaces/person'
import emily from '../../assets/emily.jpg';
import youImage from '../../assets/you.png';
import IMAGES from '../../assets/images.json';
import { toast } from 'react-toastify'
import EmojiData from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { AiFillDelete, AiFillEdit } from 'react-icons/ai'
import { Reorder } from 'framer-motion'

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
    setIndexPerson: (index: number) => void
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

    const onUpdateMessage = async (msg: IMessage) => {
        const message = window.prompt('Update the message', msg.text);
        if (!message) return;
        const index = props.messages.findIndex(m => m.id == (msg.id || ""));
        props.messages[index].text = message || "";
        props.setMessages([...props.messages]);
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
            profileImage: props.indexPerson == -1 ? youImage : props.people[props.indexPerson].image || emily,
        } as IMessage;
        props.setMessages([...props.messages, message]);
        setMessageText("")
        setMessageImage("");

        // Update time
        const mins = 2;// minutes to add
        const d = new Date()
        d.setHours(parseInt(messageTime.split(":")[0]));
        d.setMinutes(parseInt(messageTime.split(":")[1]) + mins);
        const h = d.getHours() < 10 ? `0${d.getHours()}` : d.getHours()
        const m = d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes();
        setMessageTime(`${h}:${m}`);

        // Switch to next person
        const you = props.indexPerson == -1;
        const lastperson = props.indexPerson == props.people.length - 1;

        if (you) props.setIndexPerson(0);
        else if (lastperson) props.setIndexPerson(-1)
        else props.setIndexPerson(props.indexPerson + 1)
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
        props.setMessages(props.messages.filter((m, i) => m !== null && i != index));
        toast.success('Message removed');
    }


    return (
        <div style={{ borderColor: props.lightmode ? "#bfcbd3" : "#4b5563" }} className='w-full p-2 border-2 rounded-md flex flex-col'>
            <Reorder.Group values={props.messages} onReorder={props.setMessages}>
                {
                    props.messages.length > 0 ?
                        <div style={{ background: props.lightmode ? "#f3f5f9" : "#1a2439" }}
                            className='flex flex-col gap-2 h-[40vh] p-2 overflow-y-scroll rounded-lg'>
                            {props.messages.map((message, index) =>

                                props.lightmode ?
                                    <Reorder.Item value={message} key={index}>
                                        <div className='cursor-grab flex gap-3 hover:bg-slate-400 duration-300 items-center px-2 py-3 relative rounded-md'
                                            onMouseEnter={() => props.setHoverIndex(index)}
                                            onMouseLeave={() => props.setHoverIndex(-1)}
                                        >
                                            <img src={message.profileImage} className='w-8 h-8 rounded-full' />
                                            <span className='pointer-events-none w-full text-wrap text-ellipsis text-slate-900'><b>{message.name}:</b> {message.text}</span>
                                            <span onClick={() => setDialogEmojiReact(message.id)} className='cursor-pointer absolute right-[136px] bottom-2 text-slate-900 font-thin p-1 rounded-full bg-none hover:bg-slate-300'><IoMdHappy color={message.reactions.length ? "#0891b2" : undefined} title="React to Message" size={20} /></span>
                                            <span onClick={() => onUpdateMessage(message)} className='cursor-pointer absolute right-24 bottom-2 text-slate-900 font-thin p-1 rounded-full bg-none hover:bg-slate-300'><AiFillEdit title="Edit Message" size={20} /></span>
                                            <span onClick={() => onDeleteMessage(index)} className='cursor-pointer absolute right-14 bottom-2 text-slate-900 font-thin p-1 rounded-full bg-none hover:bg-slate-300'><AiFillDelete title="Edit Message" size={20} /></span>
                                            <span onClick={() => onChangeTime(index, message.time)} className='cursor-pointer absolute right-2 bottom-2 text-slate-900 font-thin p-1 rounded-md bg-none hover:bg-slate-300'>{message.time}</span>
                                        </div>
                                    </Reorder.Item>

                                    :

                                    <Reorder.Item value={message} key={index}>
                                        <div className='cursor-grab flex gap-3 hover:bg-cyan-950 duration-300 items-center px-2 py-3 relative rounded-md'
                                            onMouseEnter={() => props.setHoverIndex(index)}
                                            onMouseLeave={() => props.setHoverIndex(-1)}
                                        >
                                            <img src={message.profileImage} className='w-8 h-8 rounded-full' />
                                            <span className='pointer-events-none w-full text-wrap text-ellipsis text-white'><b>{message.name}:</b> {message.text}</span>
                                            <span onClick={() => setDialogEmojiReact(message.id)} className='cursor-pointer absolute right-[136px] bottom-2 text-white font-thin p-1 rounded-full bg-none hover:bg-slate-300'><IoMdHappy color={message.reactions.length ? " #f59e0b" : undefined} title="React to Message" size={20} /></span>
                                            <span onClick={() => onUpdateMessage(message)} className='cursor-pointer absolute right-24 bottom-2 text-white font-thin p-1 rounded-full bg-none hover:bg-slate-300'><AiFillEdit title="Edit Message" size={20} /></span>
                                            <span onClick={() => onDeleteMessage(index)} className='cursor-pointer absolute right-14 bottom-2 text-white font-thin p-1 rounded-full bg-none hover:bg-slate-300'><AiFillDelete title="Edit Message" size={20} /></span>
                                            <span onClick={() => onChangeTime(index, message.time)} className='cursor-pointer absolute right-2 bottom-2 text-white font-thin p-1 rounded-md bg-none hover:bg-slate-300'>{message.time}</span>
                                        </div>
                                    </Reorder.Item>
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
            </Reorder.Group>

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
                <input disabled={props.loading} className='border-2 h-10 border-blue-200 w-full outline-none font-thin text-gray-600 rounded-md px-3 focus:border-gray-600' value={messageText} onChange={e => setMessageText(e.target.value)} placeholder='Message...' />
                <button disabled={props.loading} type="submit" className='min-w-14 shadow-md bg-slate-600 rounded-md flex justify-center items-center text-white hover:bg-blue-950 duration-200 cursor-pointer' style={{ width: 60, height: 40 }}>
                    <IoSend />
                </button>
            </form>


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