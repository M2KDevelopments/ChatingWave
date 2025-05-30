import { MdKeyboardBackspace, MdOutlinePhone, MdOutlineVideocam, MdMoreVert } from "react-icons/md";
import emily from '../../assets/emily.jpg';
import { IAppBar } from '../../interfaces/appbar';
import { useState } from "react";
import DialogChatImage from "../Dialog/DialogChatImage";

// Percentages from total height
const appBarSizePercentage = 8 / 100.0;
const iconSizePercentage = 3 / 100.0;
const imageSizePercentage = 5 / 100.0;


function IphoneAppBar(props: IAppBar) {

    // font size
    const nameFontSize = 22 * (props.height / 1280);
    const onlineFontSize = 17 * (props.height / 1280);
const [dialog, setDialog] = useState(false);


    return (
        <div className='w-full bg-gray-100 p-4 text-gray-900 flex gap-4 items-center' style={{ height: props.height * appBarSizePercentage }}>

            {/* Back Button */}
            <div>
                <MdKeyboardBackspace size={props.height * iconSizePercentage} />
            </div>

            {/* Name And Image */}
            <div className="flex gap-4 w-full">
                <div className="cursor-pointer" onClick={() => setDialog(true)}>
                    <img src={props.image || emily} alt="Emily" className='ml-4 aspect-square rounded-full' style={{ height: props.height * imageSizePercentage }} />
                </div>
                <div className='flex flex-col justify-center cursor-pointer' onClick={props.onUpdateChatName}>
                    <p style={{ fontSize: nameFontSize }}>{props.name}</p>
                    {props.online ? <span style={{ fontSize: onlineFontSize }} className='font-thin italic' >Online</span> : null}
                </div>
            </div>

            {/* Video and Call */}
            <div className='w-2/3 flex justify-end gap-5'>
                <MdOutlineVideocam size={props.height * iconSizePercentage} />
                <MdOutlinePhone size={props.height * iconSizePercentage} />
                <MdMoreVert size={props.height * iconSizePercentage} />
            </div>

            <DialogChatImage chatImage={props.chatImage} setChatImage={props.setChatImage} dialog={dialog} setDialog={setDialog} />
        </div>
    )
}

export default IphoneAppBar