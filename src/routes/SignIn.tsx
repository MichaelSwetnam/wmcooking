// import { useEffect } from "react"
// import { Supabase } from "../lib/Supabase"

import { useEffect, useState } from "react";
import Button from "../components/Button";
import { Supabase } from "../lib/Supabase";
import ErrorComponent from "../components/ErrorComponent";
import LoadingComponent from "../components/LoadingComponent";

export default function Page() {
    const [errorMessage, setErrorMessage] = useState<[string, string] | null>(null);
    const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null);

    useEffect(() => {
        Supabase.auth.getSession().then(( { data: { session }, error } ) => {
            if (error) {
                setErrorMessage(["Something went wrong.", error.message]);
                return;
            }

            setIsSignedIn(!!session); // Turns session into a boolean on (True = exists, False = undefined)
        });
    }, [])

    let running = false; // Prevent user from 
    async function authenticate() {
        if (running) return;
        running = true;

        // Redirects the user to google auth. Will not return to this page.
        await Supabase.auth.signInWithOAuth({ 
            provider: "google", 
            options:  {
                redirectTo: "https://www.wmcooking.org/signin"
            }
        });
        
        running = false;
    }

    if (isSignedIn === null) {
        return <LoadingComponent />
    }

    if (errorMessage) {
        return <ErrorComponent message={errorMessage[0]} technical={errorMessage[1]} />
    }
    
    if (isSignedIn === true) {
        return <div className="flex flex-col gap-3 text-center">
            <h1 className="pt-5 text-3xl font-extrabold text-orange-700 text-center">Sign in:</h1>
            <p className="text-gray font-semibold">You are already signed in.</p>
        </div>
    }


    return <div className="flex flex-col gap-3 text-center">
        <h1 className="pt-5 text-3xl font-extrabold text-orange-700 text-center">Sign in:</h1>
        <p className="text-gray-600">We use Google to manage Club Cooking accounts, and only allow accounts of official William & Mary accounts. When you sign in, make sure you put your W&M email address. Google will have you sign in through Microsoft, and then you will confirm access to your data. When you are ready to log in, click the button below.</p>
        <p className="text-gray font-semibold">Warning: We currently only use login to identify Exec users. If you are not on exec, there is no reason to log in.</p>
        <Button onClick={authenticate} children={"Sign in with Google"}  />
    </div>
}