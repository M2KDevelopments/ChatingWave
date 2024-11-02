import { BsPersonAdd } from 'react-icons/bs';
import { FaCircle } from "react-icons/fa6";
import { IPerson } from '../../interfaces/person';
import { IMessage } from '../../interfaces/message';
import { Dispatch, SetStateAction, useMemo } from 'react';
import emily from '../../assets/emily.jpg';
import swal from "sweetalert";


const size = 10;
const profileSize = 30;
interface IMessageStatus {
    lightmode: boolean,
    people: Array<IPerson>,
    loading: boolean,
    messages: Array<IMessage>,
    indexPerson: number,
    setPeople: Dispatch<SetStateAction<IPerson[]>>,
    setIndexPerson: (index: number) => void

}

function BarStatus(props: IMessageStatus) {


    const data = useMemo(() => {
        let message = 0;
        let images = 0;
        let reaction = 0;
        for (const msg of props.messages) {
            if (msg.reactions.length) reaction++;
            if (msg.image && msg.image.length) images++;
            if (!msg.image && msg.reactions) message++;
        }
        return {
            message_count: message,
            image_count: images,
            reaction_count: reaction,
            message: (100.0 * message / props.messages.length),
            images: (100.0 * images / props.messages.length),
            reaction: (100.0 * reaction / props.messages.length),
        }
    }, [props.messages])


    const onAddPerson = async () => {
        const name = await swal({
            title: `Add Person to Chat`,
            text: `What is the name of the person?`,
            icon: `info`,
            content: { element: 'input' },
            buttons: ['NO', 'YES']
        });
        if (!name) return;
        props.setPeople([...props.people, { name, image: emily }]);
    }


    return (
        <div style={{ borderColor: props.lightmode ? "#bfcbd3" : "#4b5563" }} className='flex gap-3 w-full p-3 border-2 rounded-l'>
            {/* Messages and Actions */}
            <div className='flex flex-col gap-2 w-3/5'>
                <div className='flex gap-5' style={{ color: props.lightmode ? "#334155" : "#f5f5f5" }}>
                    <span className='font-bold'>Actions</span>
                    <div className='flex gap-4'>
                        <div className='flex gap-2 items-center'>
                            <span><FaCircle size={size} color="#60a5fa" /></span>
                            <span>Message ({data.message_count})</span>
                        </div>
                        <div className='flex gap-2 items-center'>
                            <span><FaCircle size={size} color="#be185d" /></span>
                            <span>Images ({data.image_count})</span>
                        </div>
                        <div className='flex gap-2 items-center'>
                            <span><FaCircle size={size} color="orange" /></span>
                            <span>Reacted</span>
                            <span>({data.reaction_count})</span>
                        </div>
                    </div>
                </div>
                <div className='w-full h-2 bg-pink-700 flex rounded-2xl'>
                    <div className='rounded-s-2xl' style={{ height: "100%", width: `${data.message}%`, background: "#60a5fa" }}></div>
                    <div style={{ height: "100%", width: `${data.images}%`, background: "#be185d" }}></div>
                    <div className='rounded-e-2xl' style={{ height: "100%", width: `${data.reaction}%`, background: "orange" }}></div>
                </div>
            </div>
            <div className='w-1/5'></div>
            {/* People */}
            <div className="flex gap-2 w-1/5 justify-end">
                {props.people.map((person, index) =>
                    <button disabled={props.loading} onClick={() => props.setIndexPerson(index)} style={{ backgroundColor: index == props.indexPerson ? "#f59e0b" : "#f8fafc" }} key={index} className="w-16 rounded-full bg-amber-500 p-1 cursor-pointer hover:bg-slate-400 duration-200 shadow hover:shadow-2xl hover:shadow-amber-500">
                        <img title={person.name} src={person.image} alt={person.name} className="rounded-full" />
                    </button>
                )}
                <button disabled={props.loading} onClick={() => props.setIndexPerson(-1)} style={{ backgroundColor: props.indexPerson == -1 ? "#f59e0b" : "#f8fafc" }} className="w-16 rounded-full text-amber-900 bg-slate-50 p-1 cursor-pointer hover:bg-purple-600 duration-200 flex justify-center items-center shadow hover:shadow-2xl hover:shadow-purple-100 hover:text-white">
                    <span>You</span>
                </button>
                <button disabled={props.loading} onClick={onAddPerson} className="w-16 rounded-full text-amber-900 bg-slate-50 p-1 cursor-pointer hover:bg-purple-600 duration-200 flex justify-center items-center shadow hover:shadow-2xl hover:shadow-purple-100 hover:text-white">
                    <BsPersonAdd size={profileSize} title="Add Person" className="rounded-full" />
                </button>
            </div>
        </div>
    )
}

export default BarStatus