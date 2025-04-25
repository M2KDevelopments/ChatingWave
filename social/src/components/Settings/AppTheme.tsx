import { CiLight, CiDark } from "react-icons/ci";
import Switch from "react-switch";
import { FaSquareFacebook, FaSquareWhatsapp } from "react-icons/fa6";
// import {FaMicrophoneLines} from 'react-icons/fa6'
// import { MdGif } from "react-icons/md";
// import { MdRecordVoiceOver } from "react-icons/md";
// import { FaSquareXTwitter } from "react-icons/fa6";
// import { FaSquareInstagram } from "react-icons/fa6";
// import { FaTelegram } from "react-icons/fa6";
// import { AiFillTikTok } from "react-icons/ai";


interface IVisuals {
    fullscreen: boolean;
    lightmode: boolean,
    platform: string,
    setPlatform: (p: string) => void,
    setLightMode: (l: boolean) => void
}


const size = 20;
function AppTheme(props: IVisuals) {

    const onToggleLightMode = () => props.setLightMode(!props.lightmode)

    return (
        <div style={{ borderColor: props.lightmode ? "#bfcbd3" : "#4b5563" }} className='flex gap-3 w-full p-2 border-2 rounded-lg items-center'>
            <div style={{ width: "100pc" }} className="flex gap-3">
                <img src="/logo.png" alt="Chating Wave" width={30} height={30} />
                {props.fullscreen ? null : <span className="text-2xl text-slate-400 font-bold">Chating Wave</span>}
            </div>
            <div className="w-full"></div>
            <div className='flex gap-3 justify-end'>

                <div title="Whatsapp" onClick={() => props.setPlatform('whatsapp')} className='p-2 bg-white rounded-full w-fit h-fit cursor-pointer'>
                    <FaSquareWhatsapp size={size} color={props.platform == 'whatsapp' ? "#25D366" : "grey"} />
                </div>
                <div title="Facebook" onClick={() => props.setPlatform('facebook')} className='p-2 bg-white rounded-full w-fit h-fit cursor-pointer'>
                    <FaSquareFacebook size={size} color={props.platform == 'facebook' ? "#1877F2" : "grey"} />
                </div>
                {/* <div title="Twitter" onClick={() => props.setPlatform('twitter')} className='p-2 bg-white rounded-full w-fit h-fit cursor-pointer'>
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
                                </div> */}
                <div className="flex flex-col justify-center items-center">
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
        </div>
    )
}

export default AppTheme