"use client"

import {createContext, FC, ReactNode, useContext, useEffect, useState} from "react";
import {DateTime} from "luxon";
import countries from "i18n-iso-countries";

const LocationContext = createContext({});
export const useLocation = () => useContext<any>(LocationContext);
export const LocationProvider: FC<{ children?: ReactNode | undefined }> = props => {
    const [choice, setChoice] = useState<any | undefined>(undefined);
    const [currentTime, setCurrentTime] = useState<string>("");

    useEffect(() => {
        if (!choice) return;

        const updateTime = () => {
            const formatted = DateTime.now()
                .setZone(choice.tz)
                .toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS);
            setCurrentTime(formatted);
        };

        updateTime(); // run once immediately
        const interval = setInterval(updateTime, 1000); // keep ticking

        return () => clearInterval(interval);
    }, [choice]);

    async function preloadLocation() {
        try {
            const response = await fetch("https://ipapi.co/json/");
            const d = await response.json();

            setChoice({
                name: d.city || d.region || d.country_name,
                lat: d.latitude,
                lng: d.longitude,
                tz: d.timezone,
                pop: 0, // placeholder, won’t matter after preload
                country: countries.getName(d.country_code, "en")
            })

            // Call your weather API here
            // updateUI({ city, lat, lon });
        } catch (err) {
            console.error("IP-based preload failed", err);
            // fallback: pick a default city, e.g. London
        }
    }

    useEffect(() => {
        preloadLocation();
    }, [])

    return (
        <LocationContext.Provider value={{currentTime, choice, setChoice}}>
            {props.children}
        </LocationContext.Provider>
    );
};
