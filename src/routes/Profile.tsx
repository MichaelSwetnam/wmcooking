import { useNavigate } from "react-router-dom";
import { InputLabel } from "../components/Form/Inputs";
import DisabledTextInput from "../components/Form/Text/DisabledTextInput";
import ShortTextInput from "../components/Form/Text/ShortTextInput";
import { useContext, useEffect, useState } from "react";
import Database from "../lib/Database/Database";
import LoadingComponent from "../components/Utility/LoadingComponent";
import DBError from "../lib/Database/DBError";
import ErrorComponent from "../components/Event/ErrorComponent";
import { UserContext } from "../components/Auth/UserContext";
import { UserProfile } from "../lib/OAuth";

export default function Page() {
    const nav = useNavigate();
    const { user, setUser } = useContext(UserContext);
    const [name, setName] = useState<string | null>(null);
    const [error, setError] = useState<DBError | null>(null);

    useEffect(() => {
        if (name || !user) return;
        setName(user.getName());
    }, [name, user]);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!user) return;
        const profileReturn = await Database.profiles.updateName(user.getId(), name!);
        if (profileReturn.isError()) {
            setError(profileReturn.unwrapError());
            return;
        }

        setUser(new UserProfile(profileReturn.unwrapData()));
        nav(-1);
    }

    function onChange(_: string, value: string) {
        setName(value);
    }

    if (user === null || name === null)
        return <LoadingComponent />

    if (error)
        return <ErrorComponent message={error.message} />

    return <div className="flex flex-col gap-6">
        <form className="p-3 bg-blue- rounded-md flex flex-col items-center w-full gap-3" onSubmit={onSubmit}>
            <div className="grid grid-cols-[1fr_4fr] items-center gap-3 w-full lg:w-3/4">
                <InputLabel name="Cooking ID #"  />
                <DisabledTextInput value={user.getId()} />
                <InputLabel name="Email" />
                <DisabledTextInput value={user.getEmail()} />
                <InputLabel name="Name*" />
                <ShortTextInput id="name" startValue={name} onChange={onChange} />
                <div></div>
                <p className="gray-200 text-center text-sm">* When you sign up to an event, your name will be publicly shown. Feel free to change this to whatever makes you feel most comfortable. May take up to 10 minutes to update.</p>
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
    </div>;
}