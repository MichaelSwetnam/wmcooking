import { useNavigate } from "react-router-dom";
import RequireAdminLogin from "../components/Auth/RequireAdminLogin.tsx";

export default function AddEvent() {
     const nav = useNavigate();

    return <RequireAdminLogin>
        <button 
            className="cursor-pointer flex items-center justify-center bg-blue-100 text-blue-900 font-medium px-3 py-1 rounded-full hover:shadow-md transition-shadow"
            onClick={() => nav("/create-event") }
        >
            Add Event
        </button>
    </RequireAdminLogin>;
}
