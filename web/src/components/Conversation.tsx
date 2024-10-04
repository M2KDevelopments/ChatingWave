import { IPhone } from '../interfaces/phone'
import bgWA from '../assets/bg-whatsapp.png';

const heightPercentage = 83 / 100.0;

function Conversation(props: IPhone) {

    if (props.platform == 'whatsapp') {
        return (
            <div className='w-full overflow-y-scroll' style={{ height: props.height * heightPercentage, backgroundColor: props.lightmode ? "#efeae2" : "#494847", backgroundImage: `url('${bgWA}')` }}>


            </div>
        )
    }

    return (
        <div className='w-full overflow-y-scroll' style={{ height: props.height * heightPercentage }}>

        </div>
    )
}

export default Conversation