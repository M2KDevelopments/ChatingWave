import { IPhone } from '../interfaces/phone'
import { MdKeyboardBackspace, MdOutlinePhone, MdOutlineVideocam, MdMoreVert } from "react-icons/md";
import emily from '../assets/emily.jpg';

// Percentages from total height
const appBarSizePercentage = 8 / 100.0;
const iconSizePercentage = 3.0 / 100.0;
const imageSizePercentage = 12 / 100.0;


function AppBar(props: IPhone) {
  return (
    <div className='w-full bg-gray-100 p-4 text-gray-900 flex gap-4 items-center' style={{ height: props.height * appBarSizePercentage }}>

      {/* Back Button */}
      <div>
        <MdKeyboardBackspace size={props.height * iconSizePercentage} />
      </div>

      {/* Name And Image */}
      <div className="flex gap-7">
        <div>
          <img src={emily} alt="Emily" className='ml-4 aspect-square rounded-full' width={props.height * imageSizePercentage} height={props.height * imageSizePercentage} />
        </div>
        <div className='flex flex-col'>
          <p>{props.name}</p>
          <span className='font-thin italic text-sm'>Online</span>
        </div>
      </div>

      {/* Video and Call */}
      <div className='w-full flex justify-end gap-5'>
        <MdOutlineVideocam size={props.height * iconSizePercentage} />
        <MdOutlinePhone size={props.height * iconSizePercentage} />
        <MdMoreVert size={props.height * iconSizePercentage} />
      </div>
    </div>
  )
}

export default AppBar