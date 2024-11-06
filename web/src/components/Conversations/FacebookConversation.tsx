import { IPhone } from '../../interfaces/phone'
import { IMessage } from '../../interfaces/message';
import { useMemo } from 'react';

const heightPercentage = 83 / 100.0;
const replyMessageHeightPercentage = 13 / 100.0;
function FacebookConversation(props: IPhone) {

    const fontSize = 21 * (props.height / 1280);
    const profileSize = 45 * (props.height / 1280);


    const messageMap = useMemo(() => {
        const map = new Map<string, IMessage>();
        for (const msg of props.messages) map.set(msg.id, msg);
        return map;
    }, [props.messages]);


    return (
        <div id={`conversation-${props.id}`} aria-label="conversation" className='w-full flex flex-col gap-2 p-3'
            style={{
                overflowY: props.noScrollBar ? "hidden" : "scroll",
                height: props.height * heightPercentage,
                background: props.lightmode ? "#f3f4f6" : "black",
            }}>
            {
                props.messages.map((msg, index) =>
                    <div
                        style={{
                            marginTop: index > 0 && props.messages[index - 1].me != msg.me ? 20 : 0,
                            alignSelf: msg.me ? "end" : "auto",
                            marginBottom: msg.reactions.length ? 22 : 0,
                            opacity: msg.opacity,
                            scale: msg.scale,
                            top: props.scrollY,
                            color: props.lightmode ? "#111827" : "lightgray"
                        }}
                        className='relative max-w-[60%] rounded-lg flex flex-col p-2'
                        id={`msg-${props.id}-${msg.id}`} // msg-preview-{id} or msg-phone-{id}
                        key={msg.id + index}>

                        {/* Reply UI */}
                        {msg.replyId && messageMap.get(msg.replyId) ?
                            <div
                                style={{ left: msg.me ? undefined : profileSize * 1.5, background: props.lightmode ? "#f7f7f7" : "#111827" }}
                                className='rounded-3xl flex w-4/5 py-2 relative top-2'>
                                <div className='flex gap-2 px-3 overflow-hidden text-ellipsis' style={{ maxHeight: props.height * replyMessageHeightPercentage }}>
                                    <p style={{ fontSize: fontSize }} className='font-thin'>{messageMap.get(msg.replyId)!.text}</p>
                                </div>
                            </div>
                            : null
                        }

                        {/* Image */}
                        {msg.image ? <div>
                            <img className='w-full rounded-2xl' src={msg.image} alt={msg.name} />
                        </div> : null}


                        {/* Actual Message */}
                        {msg.me ? <p style={{
                            fontSize: fontSize,
                            color: msg.me ? "white" : props.lightmode ? "black" : "white",
                            background: msg.me ? `color-mix(in srgb, #a201f3 50%, #087aff 50%)` : props.lightmode ? "#f0f0f0" : "#111827",
                        }} className='p-3 mt-2 rounded-2xl font-normal'>{msg.text}</p>
                            :
                            <div className='flex gap-4 items-center'>
                                <img src={msg.profileImage} style={{ width: profileSize, height: profileSize }} className='rounded-full' alt={msg.name} />
                                <p style={{
                                    fontSize: fontSize,
                                    color: msg.me ? "white" : props.lightmode ? "black" : "white",
                                    background: msg.me ? "color-mix(in srgb, #a201f3 50%, #087aff 50%)" : props.lightmode ? "#f0f0f0" : "#111827",
                                }} className='p-3 mt-2 rounded-2xl font-normal'>{msg.text}</p>

                            </div>}


                        {/* Reactions */}
                        <div className='w-full relative'>
                            {msg.reactions.length ?
                                <div style={{
                                    fontSize: fontSize, left: msg.me ? undefined : 40,
                                    right: msg.me ? 4 : undefined,
                                    background: props.lightmode ? "white" : "#111827"

                                }}

                                    className='w-fit absolute -bottom-5 rounded-full px-1 shadow-sm flex justify-center items-center gap-1'>
                                    {msg.reactions.filter((_r, i: number) => i < 3).map((emoji, i) => <span key={i + "emoji"}>{emoji}</span>)}
                                    {msg.reactions.length > 1 ? <span>{msg.reactions.length}</span> : null}
                                </div>
                                : null}
                        </div>


                    </div>
                )
            }
        </div>
    )
}

export default FacebookConversation