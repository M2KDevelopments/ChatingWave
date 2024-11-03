import { IPhone } from '../../interfaces/phone'
import { MdKeyboardBackspace, MdInfo } from "react-icons/md";
import emily from '../../assets/emily.jpg';
import { FaVideo } from "react-icons/fa6";
import { FaPhoneAlt } from "react-icons/fa";


// Percentages from total height
const appBarSizePercentage = 8 / 100.0;
const iconSizePercentage = 2.4 / 100.0;
const imageSizePercentage = 5 / 100.0;


function FacebookAppBar(props: IPhone) {

    // font size
    const nameFontSize = 22 * (props.height / 1280);
    // const onlineFontSize = 17 * (props.height / 1280);



    return (
        <div className='w-full bg-gray-100 p-4 text-gray-900 flex gap-4 items-center shadow' style={{ height: props.height * appBarSizePercentage }}>

            {/* Back Button */}
            <div>
                <MdKeyboardBackspace color="#ab34f1" size={props.height * iconSizePercentage*1.2} />
            </div>

            {/* Name And Image */}
            <div className="flex gap-4 w-full">
                <div>
                    <img src={props.image || emily} alt="Emily" className='ml-1 aspect-square rounded-full' style={{ height: props.height * imageSizePercentage }} />
                </div>
                <div className='flex flex-col justify-center'>
                    <p style={{ fontSize: nameFontSize }} className='font-semibold'>{props.name}</p>
                    {/* {props.online ? <span style={{ fontSize: onlineFontSize }} className='font-thin italic' >Online</span> : null} */}
                </div>
            </div>

            {/* Video and Call */}
            <div className='w-2/3 flex justify-end gap-7'>
                <FaPhoneAlt color="#ab34f1" size={props.height * iconSizePercentage} />
                <FaVideo color="#ab34f1" size={props.height * iconSizePercentage} />
                <MdInfo color="#ab34f1" size={props.height * iconSizePercentage} />
            </div>
        </div>
    )
}

export default FacebookAppBar