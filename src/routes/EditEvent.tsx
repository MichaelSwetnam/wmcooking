import RequireAdminLogin from "../components/Auth/RequireAdminLogin";
import WIP from "../components/Utility/WIP";

export default function Page() {
    return (
        <RequireAdminLogin>
            <WIP />
        </RequireAdminLogin>
    );
}