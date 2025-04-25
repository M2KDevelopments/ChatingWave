import React from 'react'
import { toast } from 'react-toastify'
import emily from '../../assets/emily.jpg';
import IMAGES from '../../assets/images.json';


interface IDialoguChat {
    chatImage: string,
    setChatImage: (chatImage: string) => void,
    dialog: boolean,
    setDialog: (value: boolean) => void
}

function DialogChatImage(props: IDialoguChat) {

    const onUploadChatImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files?.length) {
            const file = e.target.files[0];
            if (file.type.includes("image")) {
                const url = URL.createObjectURL(file);
                props.setChatImage(url);
                props.setDialog(false);
            } else {
                toast.error('Please upload an image');
            }
        }
    }

    if (!props.dialog) return null;
    return (
        <dialog style={{ visibility: props.dialog ? 'visible' : "hidden" }} id="dialog-chatimage" className='w-screen h-screen flex flex-col justify-center items-center rounded-xl p-4 fixed top-0 bg-[#2f2e2ead] backdrop-blur-xl z-50' >
            <div className='min-w-1/2 h-2/3 bg-white flex flex-col gap-2 rounded-2xl p-2 justify-center'>
                <div className='grid mobile:grid-cols-5 phone:grid-cols-6 tablet:grid-cols-8 gap-2'>
                    <img src={emily}
                        onClick={() => { props.setChatImage(emily); props.setDialog(false) }}
                        className="w-[70px] rounded-full cursor-pointer p-1 grayscale-[0.6] shadow-md hover:shadow-2xl duration-150 hover:grayscale-0"
                        alt="human" />
                    {IMAGES.humans.map((src, index) =>
                        <img key={'human' + index}
                            onClick={() => { props.setChatImage(src); props.setDialog(false) }}
                            src={src}
                            className="w-[70px] rounded-full cursor-pointer p-1 grayscale-[0.6] shadow-md hover:shadow-2xl duration-150 hover:grayscale-0"
                            alt="human" />
                    )}
                </div>
                <div className='grid mobile:grid-cols-5 phone:grid-cols-6 tablet:grid-cols-8 gap-2'>
                    {IMAGES.animals.map((src, index) =>
                        <img src={src}
                            key={'animals' + index}
                            alt="animas"
                            onClick={() => { props.setChatImage(src); props.setDialog(false) }}
                            className="w-[70px] rounded-full cursor-pointer p-1 grayscale-[0.6] shadow-md hover:shadow-2xl duration-150 hover:grayscale-0"
                        />
                    )}
                </div>
                <input className='invisible' id="upload-chatimage" onChange={onUploadChatImage} type="file" accept='image/*' />
                <div className='flex'>

                    <button onClick={() => props.setDialog(false)} className='w-fit bg-none font-bold text-pink-400 mx-2 px-4 py-2 mt-8 rounded-lg cursor-pointer hover:bg-[#f3f1f12b] duration-200'>Cancel</button>
                    <button onClick={() => document.getElementById('upload-chatimage')?.click()} className='w-fit bg-none font-bold text-cyan-400 mx-2 px-4 py-2 mt-8 rounded-lg cursor-pointer hover:bg-[#f3f1f12b] duration-200'>Upload</button>
                </div>

            </div>
        </dialog >

    )
}

export default DialogChatImage