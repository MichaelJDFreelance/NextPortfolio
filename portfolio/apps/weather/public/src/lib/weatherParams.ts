// src/lib/weatherParams.ts

export const weatherParams = {
    baseUrl: "https://api.open-meteo.com/v1/forecast",

    common: {
        timezone: "auto",
    },

    // "current_weather=true" is the old minimal snapshot
    // Prefer using "current" array instead
    current: [
        "apparent_temperature",
        "precipitation",
        "wind_speed_10m",
        "relative_humidity_2m",
        "temperature_2m",
        "rain",
    ],

    hourly: [
        "temperature_2m",
        "apparent_temperature",
        "relative_humidity_2m",
        "precipitation",
        "windspeed_10m",
    ],

    daily: [
        "temperature_2m_max",
        "temperature_2m_min",
        "apparent_temperature_max",
        "apparent_temperature_min",
        "sunrise",
        "sunset",
        "precipitation_sum",
    ],
};

// Build URL with lat/lng
export const buildWeatherUrl = (lat: number, lng: number) => {
    const { baseUrl, common, current, hourly, daily } = weatherParams;

    const params = new URLSearchParams({
        latitude: lat.toString(),
        longitude: lng.toString(),
        ...Object.fromEntries(
            Object.entries(common).map(([k, v]) => [k, String(v)])
        ),
    });

    if (current.length) params.set("current", current.join(","));
    if (hourly.length) params.set("hourly", hourly.join(","));
    if (daily.length) params.set("daily", daily.join(","));

    return `${baseUrl}?${params.toString()}`;
};
