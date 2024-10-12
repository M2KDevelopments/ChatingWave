import { IPhone } from '../interfaces/phone'
import bgWA from '../assets/bg-whatsapp.png';
import { IoMdHappy } from "react-icons/io";
import { IoSend } from "react-icons/io5";
import { BsPaperclip } from "react-icons/bs";
import { useState } from 'react';

// dimensions
const messsageSizePercentage = 7 / 100.0;
const iconSizePercentage = 3.0 / 100.0;
const btnSizePercentage = 5 / 100.0;

function Messaging(props: IPhone) {

    const fontSize = 24 * (props.height / 1280);

    const [text, setText] = useState("");

    if (props.platform == 'whatsapp') {
        return (
            <div className='relative bottom-0 p-2 w-full flex gap-3' style={{ height: props.height * messsageSizePercentage, backgroundColor: props.lightmode ? "#efeae2" : "#494847", backgroundImage: `url('${bgWA}')` }}>
                <div className='rounded-full px-3 flex items-center gap-3 w-[90%] bg-white'>
                    <IoMdHappy color="grey" size={props.height * iconSizePercentage} />
                    <input style={{ fontSize: fontSize }} className='w-full outline-none font-thin text-gray-600' value={text} onChange={e => setText(e.target.value)} placeholder='Message' />
                    <BsPaperclip color="grey" size={props.height * iconSizePercentage} />
                </div>
                <button className='shadow-md bg-green-600 rounded-full flex justify-center items-center text-white' style={{ width: props.height * btnSizePercentage, height: props.height * btnSizePercentage }}>
                    <IoSend />
                </button>
            </div>
        )
    }

    return (
        <div className='relative p-2 w-full flex gap-3' style={{ height: props.height * messsageSizePercentage }}>

        </div>
    )
}

export default Messaging