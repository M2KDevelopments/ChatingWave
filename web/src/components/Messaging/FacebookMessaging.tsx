import { useState } from 'react';
import { FaSmile } from "react-icons/fa";
import { HiHandThumbUp } from "react-icons/hi2";
import { MdAddCircle, MdPhotoCamera } from "react-icons/md";
import { BsImage } from "react-icons/bs";
import { IoMic, IoSend } from "react-icons/io5";
import { IMessaging } from '../../interfaces/messaging';

// dimensions
const messsageSizePercentage = 7 / 100.0;
const iconSizePercentage = 3.0 / 100.0;
const btnSizePercentage = 5 / 100.0;


function FacebookMessaging(props: IMessaging) {
    const fontSize = 24 * (props.height / 1280);
    const [text, setText] = useState("");

    return (
        <div className='relative bottom-0 p-2 w-full flex gap-4' style={{ height: props.height * messsageSizePercentage, background: props.lightmode ? "white" : "#101010" }}>

            <button className='rounded-full flex justify-center items-center text-white' style={{ width: props.height * btnSizePercentage, height: props.height * btnSizePercentage }}>
                <MdAddCircle color="#0084ff" size={props.height * iconSizePercentage} />
            </button>
            <button className='rounded-full flex justify-center items-center text-white' style={{ width: props.height * btnSizePercentage, height: props.height * btnSizePercentage }}>
                <MdPhotoCamera color="#0084ff" size={props.height * iconSizePercentage} />
            </button>
            <button className='rounded-full flex justify-center items-center text-white' style={{ width: props.height * btnSizePercentage, height: props.height * btnSizePercentage }}>
                <BsImage className='cursor-pointer' onClick={() => document.getElementById('msg-image')?.click()} color={props.messageImage ? "orange" : "#0084ff"} size={props.height * iconSizePercentage} />
            </button>
            <button className='rounded-full flex justify-center items-center text-white' style={{ width: props.height * btnSizePercentage, height: props.height * btnSizePercentage }}>
                <IoMic color="#0084ff" size={props.height * iconSizePercentage} />
            </button>

            {/* #f3f4f6,  */}
            <div style={{ background: props.lightmode ? "#f3f4f6" : "#374151" }} className='rounded-full px-3 flex items-center gap-3 w-[90%]'>
                <input aria-label='message' style={{ background: props.lightmode ? "#f3f4f6" : "#374151", fontSize: fontSize, color: props.lightmode ? "#4b5563" : "#d1d5db" }} className='bg-gray-700 w-full outline-none font-thin' value={text} onChange={e => setText(e.target.value)} placeholder='Message...' />
                <FaSmile color="#0084ff" size={props.height * iconSizePercentage} />
            </div>
            <button onClick={() => { props.onAddMessage(text); setText(""); }} className='rounded-full flex justify-center items-center text-white' style={{ width: props.height * btnSizePercentage, height: props.height * btnSizePercentage }}>
                {text.length ?
                    <IoSend color="#0084ff" size={props.height * iconSizePercentage} /> :
                    <HiHandThumbUp color="#0084ff" size={props.height * iconSizePercentage} />}
            </button>
            <input id="msg-image" onChange={props.onImageUpload} type="file" accept='image/*' className='absolute invisible border-2 h-10 border-blue-200 w-full outline-none font-thin text-gray-600 rounded-full px-5 focus:border-gray-600' placeholder='Image URL' />

        </div>
    )
}


export default FacebookMessaging