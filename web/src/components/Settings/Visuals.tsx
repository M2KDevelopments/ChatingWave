
import { FaSquareFacebook } from "react-icons/fa6";
import { FaSquareWhatsapp } from "react-icons/fa6";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaSquareInstagram } from "react-icons/fa6";
import { FaTelegram } from "react-icons/fa6";
import { CiLight, CiDark } from "react-icons/ci";
import { AiFillTikTok } from "react-icons/ai";

import Switch from "react-switch";

const size = 20;

interface IVisuals {
    platform: string,
    setPlatform: (p: string) => void,
    lightmode: boolean,
    setLightMode: (l: boolean) => void
}

function Visuals(props: IVisuals) {

    const onToggleLightMode = () => props.setLightMode(!props.lightmode)

    return (
        <div className='flex gap-3 w-full p-3 border-2 border-purple-100 rounded-lg'>
            <div title="Whatsapp" onClick={() => props.setPlatform('whatsapp')} className='p-2 bg-white rounded-full w-fit h-fit cursor-pointer'>
                <FaSquareWhatsapp size={size} color={props.platform == 'whatsapp' ? "#25D366" : "grey"} />
            </div>
            <div title="Facebook" onClick={() => props.setPlatform('facebook')} className='p-2 bg-white rounded-full w-fit h-fit cursor-pointer'>
                <FaSquareFacebook size={size} color={props.platform == 'facebook' ? "#1877F2" : "grey"} />
            </div>
            <div title="Twitter" onClick={() => props.setPlatform('twitter')} className='p-2 bg-white rounded-full w-fit h-fit cursor-pointer'>
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
            </div>

            <div className="w-full"></div>
            <div>
                <Switch
                    width={60}
                    checkedIcon={<div className='flex flex-col justify-center'><CiLight size={26} color='white' /></div>}
                    uncheckedIcon={<div className='flex flex-col justify-center'><CiDark size={26} color='white' /></div>}
                    onChange={onToggleLightMode}
                    checked={props.lightmode}
                    onColor='#270157'
                />
            </div>
        </div>
    )
}

export default Visuals