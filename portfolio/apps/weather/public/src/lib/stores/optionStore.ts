import {Store} from "@tanstack/react-store";

export type UnitOption = "metric" | "imperial";

export type UnitOptions = {
    temperature: UnitOption,
    windspeed: UnitOption,
    precipitation: UnitOption,
}

export const optionsStore = new Store<{ units: UnitOptions }>(localStorage.getItem("options")?JSON.parse(localStorage.getItem("options")!):{
    units: {
        temperature: "metric",
        windspeed: "metric",
        precipitation: "metric",
    }
});

export const setTemperatureUnit = (unit: UnitOption) => optionsStore.setState(state => ({...state, units: {...state.units, temperature: unit}}));
export const setWindspeedUnit = (unit: UnitOption) => optionsStore.setState(state => ({...state, units: {...state.units, windspeed: unit}}));
export const setPrecipitationUnit = (unit: UnitOption) => optionsStore.setState(state => ({...state, units: {...state.units, precipitation: unit}}));


optionsStore.subscribe((value)=>{
    localStorage.setItem("options", JSON.stringify(value.currentVal));
});