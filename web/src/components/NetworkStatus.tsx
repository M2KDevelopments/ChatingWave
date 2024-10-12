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

    const [time, setTime] = useState(new Date().toLocaleTimeString())
    const fontSize = 23 * (props.height / 1280);


    // Count every second
    useEffect(() => {
        const t = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
        return () => clearInterval(t);
    }, []);


    return (
        <div className='w-full flex content-center bg-gray-100 p-4'>
            <p style={{ fontSize }} className='w-1/2 text-start'>{props.time || time}</p>
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