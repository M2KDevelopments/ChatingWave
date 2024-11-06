import { IPhone } from '../../interfaces/phone'
import { useState } from 'react';
import { FaSmile } from "react-icons/fa";
import { HiHandThumbUp } from "react-icons/hi2";
import { MdAddCircle, MdPhotoCamera } from "react-icons/md";
import { BsImage } from "react-icons/bs";
import { IoMic } from "react-icons/io5";

// dimensions
const messsageSizePercentage = 7 / 100.0;
const iconSizePercentage = 3.0 / 100.0;
const btnSizePercentage = 5 / 100.0;


function FacebookMessaging(props: IPhone) {
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
                <BsImage color="#0084ff" size={props.height * iconSizePercentage} />
            </button>
            <button className='rounded-full flex justify-center items-center text-white' style={{ width: props.height * btnSizePercentage, height: props.height * btnSizePercentage }}>
                <IoMic color="#0084ff" size={props.height * iconSizePercentage} />
            </button>

            {/* #f3f4f6,  */}
            <div style={{ background: props.lightmode ? "#f3f4f6" : "#374151" }} className='rounded-full px-3 flex items-center gap-3 w-[90%]'>
                <input style={{ background: props.lightmode ? "#f3f4f6" : "#374151", fontSize: fontSize, color: props.lightmode ? "#4b5563" : "#d1d5db" }} className='bg-gray-700 w-full outline-none font-thin' value={text} onChange={e => setText(e.target.value)} placeholder='Message' />
                <FaSmile color="#0084ff" size={props.height * iconSizePercentage} />
            </div>
            <button className='rounded-full flex justify-center items-center text-white' style={{ width: props.height * btnSizePercentage, height: props.height * btnSizePercentage }}>
                <HiHandThumbUp color="#0084ff" size={props.height * iconSizePercentage} />
            </button>
        </div>
    )
}


export default FacebookMessaging