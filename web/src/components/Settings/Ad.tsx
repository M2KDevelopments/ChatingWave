import { SiBuymeacoffee } from "react-icons/si";
import { FaPaypal } from "react-icons/fa6";


function Ad() {
    return (
        <div style={{ color: "gray" }} className="flex gap-8 items-end h-full text-xl py-9">
            <a href="https://paypal.me/m2kdevelopment" target="_blank" className="flex gap-3 items-center border-2 border-slate-300 p-2 hover:text-blue-500 hover:border-blue-500 rounded-lg">
                <FaPaypal />
                <span>Support Dev via PayPal</span>
            </a>

            <a href="https://www.buymeacoffee.com/m2kdevelopments" target="_blank" className="flex gap-3 items-center border-2 border-slate-300 p-2 hover:text-amber-400 hover:border-amber-400 rounded-lg">
                <SiBuymeacoffee />
                <span>Buy Me A Coffee</span>
            </a>
        </div>
    )
}

export default Ad