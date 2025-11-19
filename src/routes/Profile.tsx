import { useNavigate } from "react-router-dom";
import RequireLogin from "../components/Auth/RequireLogin";
import { InputLabel } from "../components/Form/Inputs";
import DisabledTextInput from "../components/Form/DisabledTextInput";
import ShortTextInput from "../components/Form/ShortTextInput";
import { useEffect, useState } from "react";
import Database from "../lib/Database/Database";
import DBReturn from "../lib/Database/DBReturn";
import type ProfileRecord from "../lib/Database/Records/ProfileRecord";
import OAuth from "../lib/OAuth";
import LoadingComponent from "../components/Utility/LoadingComponent";
import DBError from "../lib/Database/DBError";
import ErrorComponent from "../components/Event/ErrorComponent";

export default function Page() {
    const nav = useNavigate();
    const [name, setName] = useState("");
    const [user, setUser] = useState<DBReturn<ProfileRecord> | null>(null);
    const [error, setError] = useState<DBError | null>(null);

    useEffect(() => {
        OAuth.getUser().then(user => {
            user.ifData(d => setName(d.name));
            setUser(user);
        });
    }, []);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!user || user.isError()) return;
        const profileReturn = await Database.profiles.updateName(user!.unwrapData().id, name);
        if (profileReturn.isError())
            setError(profileReturn.unwrapError());
        if (profileReturn.isData())
            nav(-1);
    }

    function onChange(_: string, value: string) {
        setName(value);
    }

    if (user === null)
        return <LoadingComponent />

    if (error)
        return <ErrorComponent message={error.message} />

    return <RequireLogin>
        <div className="flex flex-col gap-6">
            <form className="p-3 bg-blue- rounded-md flex flex-col items-center w-full gap-3" onSubmit={onSubmit}>
                <div className="grid grid-cols-[1fr_4fr] items-center gap-3 w-full lg:w-3/4">
                    <InputLabel name="Cooking ID #"  />
                    <DisabledTextInput value={user!.unwrapData().id} />
                    <InputLabel name="Email" />
                    <DisabledTextInput value={user!.unwrapData().email} />
                    <InputLabel name="Name" />
                    <ShortTextInput id="name" startValue={name} onChange={onChange} />
                </div>
                <div className="flex flex-row gap-2">
                    <input type="submit" value="Save" className="bg-blue-400 text-white font-semibold py-2 px-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow" />
                    <button
                        type="button"
                        className="bg-red-400 text-white font-semibold py-2 px-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => nav(-1)}
                    >
                        Exit
                    </button>
                </div>
            </form>
        </div>
    </RequireLogin>;
}