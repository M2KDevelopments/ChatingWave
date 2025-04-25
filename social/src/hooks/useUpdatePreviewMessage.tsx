// Custom React Hook - to control the text that appears on the message input on the phone
//<input aria-label="message" />

import { useEffect, useState } from "react";

export function useUpdatePreviewMessage() {

    const [message, setMessage] = useState("");

    useEffect(() => {
        const inputs = document.querySelectorAll('[aria-label="message"]');
        for (const input of inputs) {
            const i = input as HTMLInputElement;
            i.value = message;
        }
    }, [message])

    return setMessage;
}