import { useEffect, useState } from "react";
import { ProfileForm } from "../components/Forms/ProfileForm";
import OAuth from "../lib/OAuth";
import { updateProfile, type Profile } from "../lib/Profile";
import LoadingComponent from "../components/Utility/LoadingComponent";
import { useNavigate } from "react-router-dom";

export function EditProfile() {
     const [ profile, setProfile ] = useState<Profile>(null);
     const nav = useNavigate();

     useEffect(() => {
	  OAuth.getUser().then(p => setProfile(p));
     }, [])

     if (!profile) return <LoadingComponent />

     return <ProfileForm profileData={profile.getRawData()} onSubmit={data => {
	  updateProfile(profile.id, data.name)
	       .then(() => nav(-1));
     }}
     />
}
