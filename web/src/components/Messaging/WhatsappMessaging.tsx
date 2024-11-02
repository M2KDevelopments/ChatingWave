import { IPhone } from '../../interfaces/phone'
import bgWA from '../../assets/bg-whatsapp.png';
import bgWADark from '../../assets/bg-whatsapp-dark.png';
import { IoMdHappy } from "react-icons/io";
import { IoSend } from "react-icons/io5";
import { BsPaperclip } from "react-icons/bs";
import { useState } from 'react';

// dimensions
const messsageSizePercentage = 7 / 100.0;
const iconSizePercentage = 3.0 / 100.0;
const btnSizePercentage = 5 / 100.0;


function WhatsappMessaging(props: IPhone) {
    const fontSize = 24 * (props.height / 1280);
    const [text, setText] = useState("");


    return (
        <div className='relative bottom-0 p-2 w-full flex gap-3' style={{
            height: props.height * messsageSizePercentage,
            backgroundColor: props.lightmode ? "#efeae2" : "#0b141b",
            backgroundImage: props.lightmode ? `url('${bgWA}')` : `url('${bgWADark}')`,
        }}>
            <div style={{ background: props.lightmode ? "white" : "#1f2c34", }} className='rounded-full px-3 flex items-center gap-3 w-[90%]'>
                <IoMdHappy color={props.lightmode ? "grey" : "#859096"} size={props.height * iconSizePercentage} />
                <input style={{ background: props.lightmode ? "white" : "#1f2c34", fontSize: fontSize, color: props.lightmode ? "#4b5563" : "white", }} className='w-full outline-none font-thin' value={text} onChange={e => setText(e.target.value)} placeholder='Message' />
                <BsPaperclip color={props.lightmode ? "grey" : "#859096"} size={props.height * iconSizePercentage} />
            </div>
            <button className='shadow-md bg-green-600 rounded-full flex justify-center items-center text-white' style={{ width: props.height * btnSizePercentage, height: props.height * btnSizePercentage }}>
                <IoSend />
            </button>
        </div>
    )

}


export default WhatsappMessaging