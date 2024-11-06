import { IMessage } from '../../interfaces/message'

interface IModalMessage {
    editMessage: IMessage,
    messages: Array<IMessage>,
    setMessages: (messages: Array<IMessage>) => void,
    setEditMessage: (msg: IMessage) => void,
}

function ModalTextMessage(props: IModalMessage) {

    const onUpdateMessage = () => {
        const index = props.messages.findIndex(m => m.id == (props.editMessage.id || ""));
        props.messages[index].text = props.editMessage.text || "";
        props.setMessages([...props.messages]);
        props.setEditMessage({} as IMessage);
    }

    if (!props.editMessage.id) return null;

    return (
        <dialog style={{ visibility: props.editMessage.id ? 'visible' : "hidden" }} className='w-screen h-screen flex flex-col justify-center items-center rounded-xl p-4 absolute top-0 bg-[#2f2e2ead] backdrop-blur-xl z-50'>
            <div className='min-w-1/2 h-1/3 bg-[#efe4f4c9] flex flex-col gap-2 rounded-2xl p-2 justify-center'>
                <textarea maxLength={500} value={props.editMessage ? props.editMessage.text : ""} onChange={(e) => props.setEditMessage({ ...props.editMessage!, text: e.target.value })} id="edit-message" className='rounded-md w-[400px] h-full bg-white p-2' placeholder='Write Your message here...' />
                <div className='flex'>
                    <button onClick={() => props.setEditMessage({} as IMessage)} className='w-fit bg-none text-pink-600 mx-2 px-4 py-2 mt-8 rounded-lg cursor-pointer hover:bg-[#f3f1f3b7] duration-200'>Cancel</button>
                    <button onClick={onUpdateMessage} className='w-fit bg-none text-purple-900 mx-2 px-4 py-2 mt-8 rounded-lg cursor-pointer hover:bg-[#f3f1f3b7] duration-200'>Update Message</button>
                </div>
            </div>

        </dialog>
    )
}

export default ModalTextMessage