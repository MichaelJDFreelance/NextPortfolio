"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ProfileCheck() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        // fetch current session
        const getSession = async () => {
            const { data } = await supabase.auth.getSession();
            setUser(data.session?.user ?? null);
        };

        getSession();

        // listen for login/logout changes
        const { data: listener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user ?? null);
            }
        );

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    if (!user) {
        return <p>Not logged in</p>;
    }

    return <p>Logged in as {user.id}</p>;
}