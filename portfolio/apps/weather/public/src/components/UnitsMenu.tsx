"use client"

import {
    Menubar,
    MenubarContent,
    MenubarItem, MenubarLabel,
    MenubarMenu, MenubarSeparator,
    MenubarTrigger
} from "@/components/ui/menubar";
import {optionsStore, setPrecipitationUnit, setTemperatureUnit, setWindspeedUnit} from "@/lib/stores/optionStore";
import {useState} from "react";
import {useStore} from "@tanstack/react-store";

export function UnitsMenu() {
    const units = useStore(optionsStore, options=>options.units);

    return (
        <Menubar className={`bg-neutral-800 border-0 outline-0`}>
            <MenubarMenu>
                <MenubarTrigger className={`!bg-neutral-800 !text-neutral-0 border-0 outline-0`}>Units</MenubarTrigger>
                <MenubarContent className={`text-preset-7 bg-neutral-800 text-neutral-0 border-0`} align="end">
                    <MenubarLabel>Switch to Imperial</MenubarLabel>
                    <MenubarLabel className={`!text-neutral-300 text-preset-8`}>Temperature</MenubarLabel>
                    <MenubarItem className={`flex items-center justify-between`} onClick={()=>setTemperatureUnit("metric")}>Celsius (°C) {units.temperature==="metric" && <span>T</span>}</MenubarItem>
                    <MenubarItem className={`flex items-center justify-between`} onClick={()=>setTemperatureUnit("imperial")}>Fahrenheit (°F) {units.temperature==="imperial" && <span>T</span>}</MenubarItem>
                    <MenubarSeparator className={`!bg-neutral-600`} />
                    <MenubarLabel className={`!text-neutral-300 text-preset-8`}>Wind Speed</MenubarLabel>
                    <MenubarItem className={`flex items-center justify-between`} onClick={()=>setWindspeedUnit("metric")}>km/h {units.temperature==="metric" && <span>T</span>}</MenubarItem>
                    <MenubarItem className={`flex items-center justify-between`} onClick={()=>setWindspeedUnit("imperial")}>mpph {units.temperature==="imperial" && <span>T</span>}</MenubarItem>
                    <MenubarSeparator className={`!bg-neutral-600`} />
                    <MenubarLabel className={`!text-neutral-300 text-preset-8`}>Precipitation</MenubarLabel>
                    <MenubarItem className={`flex items-center justify-between`} onClick={()=>setPrecipitationUnit("metric")}>Millimeters (mm) {units.temperature==="metric" && <span>T</span>}</MenubarItem>
                    <MenubarItem className={`flex items-center justify-between`} onClick={()=>setPrecipitationUnit("imperial")}>Inches (&#34;) {units.temperature==="imperial" && <span>T</span>}</MenubarItem>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    );
}