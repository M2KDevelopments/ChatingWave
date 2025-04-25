import { useEffect, useState } from 'react';
import { IPhone } from '../interfaces/phone'
import { FaBatteryQuarter } from "react-icons/fa";
import { FaBatteryHalf } from "react-icons/fa";
import { FaBatteryThreeQuarters } from "react-icons/fa";
import { FaBatteryFull } from "react-icons/fa";

import { MdOutlineWifi1Bar } from "react-icons/md";
import { MdOutlineWifi2Bar } from "react-icons/md";
import { MdOutlineWifi } from "react-icons/md";
import { MdOutlineWifiOff } from "react-icons/md";

import { MdOutlineSignalCellularAlt1Bar } from "react-icons/md";
import { MdOutlineSignalCellularAlt2Bar } from "react-icons/md";
import { MdOutlineSignalCellularAlt } from "react-icons/md";

const iconSizePercentage = 2 / 100;

function NetworkStatus(props: IPhone) {

    const [time, setTime] = useState("12:00")
    const fontSize = 23 * (props.height / 1280);

    
    useEffect(() => {
        const d = new Date();
        const hours = d.getHours() < 10 ? `0${d.getHours()}` : d.getHours()
        const mins = d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes();
        // const amOrPM = new Date().toLocaleTimeString().split(" ")[1]
        const time = `${hours}:${mins}`;
        setTime(time);
    }, []);

    const onTime = async () => {
        const newtime = await swal({
            text: 'Enter the time for the message',
            icon: 'info',
            content: {
                element: 'input',
                attributes: {
                    'style': '2px solid cyan;',
                    'value': time,
                    'placeholder': 'Enter the time e.g 12:14'
                }
            }
        });

        if (!/^\d{1,2}:\d{2}$/.test(newtime)) return;

        const [h, m] = newtime.split(':').map(Number);
        if (h < 0 || m < 0 || h > 23 || m > 59) return;

        const formattedTime = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        setTime(formattedTime);
    }


    return (
        <div style={{ color: props.lightmode ? "#111827" : "white", background: props.lightmode ? "#f3f4f6" : "#0b141b" }} className='w-full flex content-center py-2 px-4'>
            <p onClick={onTime} style={{ fontSize }} className='w-1/2 text-start cursor-pointer'>{props.time || time}</p>
            <div className='w-1/2 flex gap-3 justify-end content-center'>

                {/* Wifi */}
                {(props.wifi == undefined || props.wifi == 3) && <MdOutlineWifi size={props.height * iconSizePercentage} />}
                {(props.wifi == 2) && <MdOutlineWifi2Bar size={props.height * iconSizePercentage} />}
                {(props.wifi == 1) && <MdOutlineWifi1Bar size={props.height * iconSizePercentage} />}
                {(props.wifi == 0) && <MdOutlineWifiOff size={props.height * iconSizePercentage} />}

                {/* Network */}
                {(props.network == undefined || props.network == 3) && <MdOutlineSignalCellularAlt size={props.height * iconSizePercentage} />}
                {(props.network == 2) && <MdOutlineSignalCellularAlt2Bar size={props.height * iconSizePercentage} />}
                {(props.network == 1) && <MdOutlineSignalCellularAlt1Bar size={props.height * iconSizePercentage} />}

                {/* Battery */}
                {(props.battery == undefined || props.battery == 4) && <FaBatteryFull size={props.height * iconSizePercentage} />}
                {(props.battery == 3) && <FaBatteryThreeQuarters size={props.height * iconSizePercentage} />}
                {(props.battery == 2) && <FaBatteryHalf size={props.height * iconSizePercentage} />}
                {(props.battery == 1) && <FaBatteryQuarter size={props.height * iconSizePercentage} />}


            </div>
        </div>
    )
}

export default NetworkStatus