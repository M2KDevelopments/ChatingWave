

import { CiLight, CiDark } from "react-icons/ci";

import Switch from "react-switch";


interface IVisuals {

    lightmode: boolean,
    setLightMode: (l: boolean) => void
}

function AppTheme(props: IVisuals) {

    const onToggleLightMode = () => props.setLightMode(!props.lightmode)

    return (
        <div style={{ borderColor: props.lightmode ? "#bfcbd3" : "#4b5563" }} className='flex gap-3 w-full p-3 border-2 rounded-lg'>
            <div className="w-2/5">
                <span className="text-2xl text-slate-400 font-bold">Chating Wave</span>
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

export default AppTheme