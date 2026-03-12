"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { BarChart3 } from "lucide-react"

interface WeatherChartProps {
    data: any
    variables: string[]
    isLoading: boolean
}

const variableColors = {
    // Temperature
    temperature_2m: "#0078FF",
    temperature_2m_max: "#0078FF",
    temperature_2m_min: "#47A9FF",
    dew_point_2m: "#0056D2",
    apparent_temperature: "#6E56CF",
    apparent_temperature_max: "#6E56CF",
    apparent_temperature_min: "#9159D1",

    // Humidity & Pressure
    relative_humidity_2m: "#30D158",
    vapour_pressure_deficit: "#32D74B",
    pressure_msl: "#8E8E93",
    surface_pressure: "#636366",

    // Precipitation
    precipitation: "#409CFF",
    precipitation_sum: "#409CFF",
    rain: "#0078FF",
    rain_sum: "#0078FF",
    snowfall: "#C7C7CC",
    snowfall_sum: "#C7C7CC",
    snow_depth: "#D1D1D6",
    precipitation_hours: "#64D2FF",

    // Wind
    wind_speed_10m: "#FF9F0A",
    wind_speed_100m: "#FFB340",
    wind_speed_10m_max: "#FF9F0A",
    wind_direction_10m: "#FF453A",
    wind_direction_100m: "#FF6961",
    wind_direction_10m_dominant: "#FF453A",
    wind_gusts_10m: "#FF6482",
    wind_gusts_10m_max: "#FF6482",

    // Clouds
    cloud_cover: "#A2A2A7",
    cloud_cover_low: "#C7C7CC",
    cloud_cover_mid: "#A2A2A7",
    cloud_cover_high: "#8E8E93",

    // Solar
    shortwave_radiation: "#FFD60A",
    shortwave_radiation_sum: "#FFD60A",
    direct_radiation: "#FFE040",
    direct_normal_irradiance: "#FFCC00",
    diffuse_radiation: "#FF9500",
    sunshine_duration: "#FF9500",
    daylight_duration: "#FF9500",
    sunrise: "#FF8E33",
    sunset: "#FF5E33",

    // Soil
    soil_temperature_0_to_7cm: "#964B00",
    soil_temperature_7_to_28cm: "#B05224",
    soil_temperature_28_to_100cm: "#D2691E",
    soil_temperature_100_to_255cm: "#DAA520",
    soil_moisture_0_to_7cm: "#2E7D32",
    soil_moisture_7_to_28cm: "#43A047",
    soil_moisture_28_to_100cm: "#66BB6A",
    soil_moisture_100_to_255cm: "#9CCC65",

    // Other
    et0_fao_evapotranspiration: "#00BFA5",
    weather_code: "#757575",
}

const variableUnits = {
    // Temperature
    temperature_2m: "°C",
    temperature_2m_max: "°C",
    temperature_2m_min: "°C",
    dew_point_2m: "°C",
    apparent_temperature: "°C",
    apparent_temperature_max: "°C",
    apparent_temperature_min: "°C",

    // Humidity & Pressure
    relative_humidity_2m: "%",
    vapour_pressure_deficit: "kPa",
    pressure_msl: "hPa",
    surface_pressure: "hPa",

    // Precipitation
    precipitation: "mm",
    precipitation_sum: "mm",
    rain: "mm",
    rain_sum: "mm",
    snowfall: "cm",
    snowfall_sum: "cm",
    snow_depth: "m",
    precipitation_hours: "h",

    // Wind
    wind_speed_10m: "km/h",
    wind_speed_100m: "km/h",
    wind_speed_10m_max: "km/h",
    wind_direction_10m: "°",
    wind_direction_100m: "°",
    wind_direction_10m_dominant: "°",
    wind_gusts_10m: "km/h",
    wind_gusts_10m_max: "km/h",

    // Clouds
    cloud_cover: "%",
    cloud_cover_low: "%",
    cloud_cover_mid: "%",
    cloud_cover_high: "%",

    // Solar
    shortwave_radiation: "W/m²",
    shortwave_radiation_sum: "MJ/m²",
    direct_radiation: "W/m²",
    direct_normal_irradiance: "W/m²",
    diffuse_radiation: "W/m²",
    sunshine_duration: "s",
    daylight_duration: "s",
    sunrise: "time",
    sunset: "time",

    // Soil
    soil_temperature_0_to_7cm: "°C",
    soil_temperature_7_to_28cm: "°C",
    soil_temperature_28_to_100cm: "°C",
    soil_temperature_100_to_255cm: "°C",
    soil_moisture_0_to_7cm: "m³/m³",
    soil_moisture_7_to_28cm: "m³/m³",
    soil_moisture_28_to_100cm: "m³/m³",
    soil_moisture_100_to_255cm: "m³/m³",

    // Other
    et0_fao_evapotranspiration: "mm",
    weather_code: "WMO",
}

export default function WeatherChart({ data, variables, isLoading }: WeatherChartProps) {
    const formatTime = (time: string) => {
        const date = new Date(time)

        // For hourly data, show date and time
        if (data?.hourly && !data?.daily) {
            return (
                date.toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                }) +
                " " +
                date.toLocaleTimeString(undefined, {
                    hour: "2-digit",
                    minute: "2-digit",
                })
            )
        }

        // For daily data, show just date
        return date.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
        })
    }

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center p-8">
                <Skeleton className="w-full h-full rounded-[2rem]" />
            </div>
        )
    }

    if (!data || (!data.hourly && !data.daily)) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8">
                <div className="w-16 h-16 bg-secondary rounded-3xl flex items-center justify-center mb-4">
                    <BarChart3 className="h-8 w-8 opacity-20" />
                </div>
                <p>No visualization data available.</p>
            </div>
        )
    }

    const dataSource = data.hourly || data.daily
    if (!dataSource)
        return <div className="h-full flex items-center justify-center text-muted-foreground">No data available.</div>

    // Transform data for chart
    const chartData = dataSource.time
        .map((time: string, index: number) => {
            const point: any = { time: time }
            variables.forEach((variable) => {
                if (dataSource[variable] !== undefined) {
                    point[variable] = dataSource[variable][index]
                }
            })
            return point
        })
        .filter((_: any, index: number) => {
            if (data.daily) {
                return true
            } else {
                // Every 2 hours for better density but still readable
                return index % 2 === 0
            }
        })

    const chartConfig = variables.reduce((config, variable) => {
        config[variable] = {
            label: variable.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
            color: variableColors[variable as keyof typeof variableColors] || "#0078FF",
        }
        return config
    }, {} as any)

    const units = data.hourly_units || data.daily_units || {}

    const renderCustomTooltip = (props: any) => {
        const { active, payload } = props

        if (active && payload && payload.length) {
            return (
                <div className="bg-white/90 backdrop-blur-md p-4 rounded-3xl shadow-2xl border-none ring-1 ring-black/5 animate-in">
                    <p className="font-bold text-sm mb-2 text-foreground">{formatTime(payload[0].payload.time)}</p>
                    <div className="space-y-1.5">
                        {payload.map((item: any) => (
                            <div key={item.dataKey} className="flex items-center gap-3">
                                <div
                                    className="w-2.5 h-2.5 rounded-full"
                                    style={{ backgroundColor: item.color }}
                                />
                                <span className="text-xs font-medium text-muted-foreground">
                                    {chartConfig[item.dataKey]?.label}
                                </span>
                                <span className="text-xs font-bold text-foreground ml-auto">
                                    {item.value} {units[item.dataKey] || variableUnits[item.dataKey as keyof typeof variableUnits]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )
        }

        return null
    }

    return (
        <div className="h-full w-full">
            <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="0" stroke="rgba(0,0,0,0.03)" vertical={false} />
                        <XAxis
                            dataKey="time"
                            stroke="#AEAEB2"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={formatTime}
                            minTickGap={40}
                            dy={10}
                        />
                        <YAxis
                            stroke="#AEAEB2"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(val) => `${val}`}
                            dx={-10}
                        />
                        <Tooltip content={renderCustomTooltip} cursor={{ stroke: 'rgba(0,0,0,0.05)', strokeWidth: 2 }} />
                        <Legend
                            iconType="circle"
                            verticalAlign="bottom"
                            height={40}
                            wrapperStyle={{
                                paddingTop: '45px',
                                fontSize: '11px',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                            }}
                        />
                        {variables.map((variable) => (
                            <Line
                                key={variable}
                                type="monotone"
                                dataKey={variable}
                                stroke={variableColors[variable as keyof typeof variableColors]}
                                strokeWidth={3}
                                dot={false}
                                activeDot={{ r: 6, strokeWidth: 0, fill: variableColors[variable as keyof typeof variableColors] }}
                                name={variable.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) + ` (${units[variable] || variableUnits[variable as keyof typeof variableUnits] || ""})`}
                                animationDuration={1000}
                                animationEasing="ease-in-out"
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </ChartContainer>
        </div>
    )
}
