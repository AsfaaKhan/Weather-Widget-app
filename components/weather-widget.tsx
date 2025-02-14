"use client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardDescription, CardTitle, CardContent, } from "./ui/card"
import { ChangeEvent, FormEvent, useState } from "react"
import { CloudIcon, MapPinIcon, ThermometerIcon } from "lucide-react"

// TypeScript data for weather data
interface WeatherData {
    temperature: number,
    description: string,
    location: string,
    unit: string,
}

const WeatherWidget = () => {

    // FRONTEND CODING
    // state hooks for managing 
    // location input
    // weather data
    // error message
    // loading state

    const [location, setLocation] = useState<string>("")
    const [weather, setWeather] = useState<WeatherData | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)


    // Functions to handle searching
    const handleSearch = async (e: FormEvent<HTMLElement>) => {
        e.preventDefault();
        const trimmedLocation = location.trim();
        if (trimmedLocation == "") {
            setError("Please enter a valid location!");
            setWeather(null);
            return 0
        }

        setIsLoading(true);
        setError(null);

        try {
            // fetch weather data from weather API
            const response = await fetch(
                `https://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${trimmedLocation}`
            );
            if (!response.ok) {
                throw new Error("City not found");
            }
            const data = await response.json()
            const weatherData: WeatherData = {
                temperature: data.current.temp_c, //Get Temperature in celsius
                description: data.current.condition.text, // Get weather description
                location: data.location.name, // Get Location Name 
                unit: "C", // Unit for temperature
            }
            setWeather(weatherData);
        }
        catch (error) {
            console.error("Error fetching weather data:", error)
            setError("City not found. Please try again!")
            setWeather(null)
        }
        finally {
            setIsLoading(false)
        }
    };

    // FUNCTION TO GET MESSAGE ACCORDING TO TEMPERATURE
    function getTemperatureMessage(temperature: number, unit: string) {
        if (unit === "C") {
            if (temperature < 0) {
                return `It's freezing at ${temperature}°C! Bundle Up!`
            } else if (temperature < 10) {
                return `It's quit cold at ${temperature}°C! Wear warm clothes!`
            } else if (temperature < 20) {
                return `The temperature is ${temperature}°C. Comfortable for a light jacket.`
            } else if (temperature < 30) {
                return ` It's pleasent ${temperature}°C. Enjoy the nice weather!`
            } else {
                return ` It's hot at ${temperature}°C. Stay hyderated! `
            }
        }
        else {
            return ` ${temperature}°${unit}`
        }
    }

    // FUNCTION TO GET WEATHER MESSAGE BASED ON DESCRIPTION
    function getWeatherMessage(description: string) {
        switch (description.toLowerCase()) {
            case "sunny":
                return ` It's a beautiful sunny day!`
            case "partly cloudy":
                return `Expect some clouds and sunshine!`
            case "overcast":
                return `The sky is overcast`
            case "rain":
                return ` Don't forget your umberalla! It's raining.`
            case "thunderstrom":
                return `Thunderstorms are expected today`
            case "snow":
                return `Bundle up! It's snowing`
            case "mist":
                return `It's misty outside`
            case "fog":
                return `Be casreful, there's fog outside`
            default:
                return description
        }
    }

    // FUNCTION TO GET LOCATION MESSAGE BASED ON THE CURRENT TIME
    function getLoacationMessage(location: string) {
        const currentHour = new Date().getHours()
        // determine if it is night time
        const isNight = currentHour >= 18 || currentHour < 6
        return ` ${location} ${isNight ? "at night" : "During the day!"}`

    }

    return (


        // BACKEND CODING 
        <div className="flex justify-center items-center h-screen bg-[url('/images/weather-bg.jpg')] bg-no-repeat w-full bg-cover absolute inset-0 bg-white opacity-50 font-serif " > 
          {/* bg-gradient-to-r from-blue-400 to-blue-900 > */}
            <Card className="w-full max-w-md mx-auto text-center bg-[##FFFFFF1A] border-spacing-1 border-[#032D571A]  shadow-[#413434]">
                <CardHeader>
                    <CardTitle >Weather Widget App</CardTitle>
                    <CardDescription className="text-black">
                        Search For The Current Weather Conditions Of The City
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSearch} className="flex items-center gap-2 ">
                        <Input
                           className="bg-transparent border-2 border-spacing-1 border-[rgba(7,18,29,0.1)]  shadow-black  focus:bg-transparent text-black"
                            type="text"
                            placeholder="Enter a city name:"
                            value={location}
                            onChange={
                                (e: ChangeEvent<HTMLInputElement>) =>
                                    setLocation(e.target.value)

                            }
                        />
                        <Button className=" bg-transparent border-2 border-spacing-1 border-[rgba(7,18,29,0.1)]  shadow-black text-black hover:bg-blue-900 hover:text-white" type="submit" disabled={isLoading}>
                            {isLoading ? "Loading..." : "Search"}{" "}
                        </Button>
                    </form>

                    {/* Disply Error Msg If any */}
                    {error &&
                        <div className="mt-4 text-red-600">
                            {error}
                        </div>
                    }

                    {/* Dsiplay temperature with icon */}
                    {weather && (
                        <div className="mt-4 grid gap-2">
                            <div className=" flex items-center gap-2">
                                <div className="flex items-center gap-2">
                                    <ThermometerIcon className="w-6 h-6" />
                                    {getTemperatureMessage(weather.temperature, weather.unit)}
                                </div>
                            </div>

                            {/* Display Weather Description with icon */}
                            <div className="flex items-center gap-2">
                                <CloudIcon className="w-6 h-6" />
                                <div>{getWeatherMessage(weather.description)}
                                </div>
                            </div>
                            {/* Disply Location With Icon */}
                            <div className="flex items-center gap-2">
                                <MapPinIcon className="w-6 h-6" />
                                <div>{getLoacationMessage(weather.location)}</div>
                            </div>
                        </div>
                    )}


                </CardContent>
            </Card>

        </div>
    );
}

export default WeatherWidget