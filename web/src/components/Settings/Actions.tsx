import React, { useState } from 'react'
import { FaImage } from 'react-icons/fa6'
import { IoMdHappy } from 'react-icons/io'
import { IoSend } from 'react-icons/io5'
import { IMessage } from '../../interfaces/message'
import { IPerson } from '../../interfaces/person'
import emily from '../../assets/emily.jpg';


interface IAction {
    loading: boolean,
    messages: Array<IMessage>,
    indexPerson: number,
    people: Array<IPerson>,
    setMessages: (messages: Array<IMessage>) => void,
}


function Actions(props: IAction) {

    // Message Settings
    const [messageText, setMessageText] = useState("");
    const [messageImage, setMessageImage] = useState("")

    const onAddMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (messageText.trim() == '') return;
        const d = new Date();
        const hours = d.getHours() < 10 ? `0${d.getHours()}` : d.getHours()
        const mins = d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes();
        const time = `${hours}:${mins}`;
        const message = {
            id: crypto.randomUUID(),
            me: props.indexPerson == -1,
            reactions: [],
            text: messageText,
            time: time,
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
        <div className='w-full p-2 border-2 border-purple-100 rounded-md'>

            <input id="image" onChange={onFileLoad} disabled={props.loading} type="file" accept='image/*' className='invisible border-2 h-10 border-blue-200 w-full outline-none font-thin text-gray-600 rounded-full px-5 focus:border-gray-600' value={messageImage} placeholder='Image URL' />

            <form onSubmit={onAddMessage} className="flex w-2/3 gap-3 justify-center items-center bg-slate-200  text-slate-600 px-4 py-2 rounded-full shadow-2xl hover:shadow-amber-600 duration-300">
                <div className='cursor-pointer'>
                    <IoMdHappy title="Emoji" size={30} />
                </div>
                <div className='cursor-pointer' onClick={() => document.getElementById('image')?.click()}>
                    <FaImage color={messageImage ? "pink" : undefined} title="Insert Image" size={30} />
                </div>
                <input type="time" name="time" className='border-2 h-10 border-blue-200 w-full outline-none font-thin text-gray-600 rounded-full px-5 focus:border-gray-600' />
                <input disabled={props.loading} className='border-2 h-10 border-blue-200 w-full outline-none font-thin text-gray-600 rounded-full px-5 focus:border-gray-600' value={messageText} onChange={e => setMessageText(e.target.value)} placeholder='Message' />
                <button disabled={props.loading} type="submit" className='shadow-md bg-blue-600 rounded-full flex justify-center items-center text-white hover:bg-blue-950 duration-200 cursor-pointer' style={{ width: 60, height: 40 }}>
                    <IoSend />
                </button>
            </form>

        </div>
    )
}

export default Actions