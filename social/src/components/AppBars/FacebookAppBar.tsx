import { MdKeyboardBackspace, MdInfo } from "react-icons/md";
import emily from '../../assets/emily.jpg';
import { FaVideo } from "react-icons/fa6";
import { FaPhoneAlt } from "react-icons/fa";
import { IAppBar } from '../../interfaces/appbar';
import DialogChatImage from "../Dialog/DialogChatImage";
import { useState } from "react";


// Percentages from total height
const appBarSizePercentage = 8 / 100.0;
const iconSizePercentage = 2.4 / 100.0;
const imageSizePercentage = 5 / 100.0;


function FacebookAppBar(props: IAppBar) {

    // font size
    const nameFontSize = 22 * (props.height / 1280);
    const [dialog, setDialog] = useState(false);
    // const onlineFontSize = 17 * (props.height / 1280);



    return (
        <div className='w-full flex gap-4 items-center shadow'
            style={{
                height: props.height * appBarSizePercentage,
                background: props.lightmode ? "#f3f4f6" : "#010101",
                color: props.lightmode ? "#111827" : "#f3f4f6"
            }}>

            {/* Back Button */}
            <div className='mx-3'>
                <MdKeyboardBackspace color="#ab34f1" size={props.height * iconSizePercentage * 1.2} />
            </div>

            {/* Name And Image */}
            <div className="flex gap-4 w-full">
                <div className="cursor-pointer" onClick={() => setDialog(true)}>
                    <img src={props.image || emily} alt="Emily" className='ml-1 aspect-square rounded-full' style={{ height: props.height * imageSizePercentage }} />
                </div>
                <div className='flex flex-col justify-center cursor-pointer' onClick={props.onUpdateChatName}>
                    <p style={{ fontSize: nameFontSize }} className='font-semibold'>{props.name}</p>
                    {/* {props.online ? <span style={{ fontSize: onlineFontSize }} className='font-thin italic' >Online</span> : null} */}
                </div>
            </div>

            {/* Video and Call */}
            <div className='w-2/3 flex justify-end gap-7 px-4'>
                <FaPhoneAlt color="#ab34f1" size={props.height * iconSizePercentage} />
                <FaVideo color="#ab34f1" size={props.height * iconSizePercentage} />
                <MdInfo color="#ab34f1" size={props.height * iconSizePercentage} />
            </div>

            <DialogChatImage chatImage={props.chatImage} setChatImage={props.setChatImage} dialog={dialog} setDialog={setDialog} />
        </div>
    )
}

export default FacebookAppBar