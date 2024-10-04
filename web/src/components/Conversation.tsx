import { IPhone } from '../interfaces/phone'
import bgWA from '../assets/bg-whatsapp.png';
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { IoCheckmarkOutline } from "react-icons/io5";

const heightPercentage = 83 / 100.0;

function Conversation(props: IPhone) {

    if (props.platform == 'whatsapp') {
        return (
            <div className='w-full overflow-y-scroll flex flex-col gap-2 p-3' style={{ height: props.height * heightPercentage, backgroundColor: props.lightmode ? "#efeae2" : "#494847", backgroundImage: `url('${bgWA}')` }}>
                {
                    props.messages.map((msg, index) =>
                        <div
                            style={{ marginTop: index > 0 && props.messages[index - 1].me != msg.me ? 20 : 0, background: msg.me ? "#d9fdd3" : "white", alignSelf: msg.me ? "end" : "auto" }}
                            className='relative text-gray-900 max-w-[90%] rounded-lg shadow-lg flex flex-col'
                            key={msg.id}>

                            {/* Contents */}
                            <p className='mx-3 mt-2 mb-6'>{msg.text}</p>
                            <span className='flex gap-2 absolute bottom-0 right-2 text-sm font-thin text-gray-500'>
                                {msg.time}
                                {
                                    !msg.me ? null : <>
                                        {msg.read ? <IoCheckmarkDoneSharp color="blue" /> : <IoCheckmarkOutline />}
                                    </>
                                }
                            </span>


                        </div>
                    )
                }
            </div>
        )
    }

    return (
        <div className='w-full overflow-y-scroll' style={{ height: props.height * heightPercentage }}>

        </div>
    )
}

export default Conversation