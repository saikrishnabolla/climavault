"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { format, subDays } from "date-fns"
import { motion, AnimatePresence } from "motion/react"
import {
    Search,
    Cloud,
    Loader2,
    BarChart3,
    Table as TableIcon,
    Filter,
    AlertCircle,
    Info,
    MapPin,
    Calendar as CalendarIconLucide,
    Settings2,
    Undo2,
    ArrowRight,
    TrendingUp,
    LayoutGrid,
    Globe,
    History,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import WeatherChart from "@/components/weather/weather-chart"
import WeatherTable from "@/components/weather/weather-table"
import { cn } from "@/lib/utils"
import { weatherVariables, weatherModels, units } from "@/lib/constants"

export default function Dashboard() {
    // State
    const [location, setLocation] = useState("New York, USA")
    const [coordinates, setCoordinates] = useState({ lat: 40.7128, lon: -74.0060 })
    const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 30))
    const [endDate, setEndDate] = useState<Date>(subDays(new Date(), 5))
    const [selectedVariables, setSelectedVariables] = useState<string[]>(["temperature_2m", "precipitation"])
    const [dataType, setDataType] = useState<"hourly" | "daily">("hourly")
    const [weatherData, setWeatherData] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState("chart")
    const [locationSearching, setLocationSearching] = useState(false)
    const [showConfig, setShowConfig] = useState(true)

    // Advanced Options
    const [temperatureUnit, setTemperatureUnit] = useState<"celsius" | "fahrenheit">("celsius")
    const [windSpeedUnit, setWindSpeedUnit] = useState<"kmh" | "ms" | "mph" | "kn">("kmh")
    const [precipitationUnit, setPrecipitationUnit] = useState<"mm" | "inch">("mm")
    const [model, setModel] = useState<string>("best_match")


    // Derived Values
    const currentVariables = useMemo(() => {
        return weatherVariables[dataType].map(v => {
            let unit = v.unit
            if (v.category === "Temperature") unit = temperatureUnit === "celsius" ? "°C" : "°F"
            if (v.category === "Wind") {
                if (windSpeedUnit === "kmh") unit = "km/h"
                else if (windSpeedUnit === "ms") unit = "m/s"
                else unit = windSpeedUnit
            }
            if (v.category === "Precipitation" && v.unit === "mm") unit = precipitationUnit
            return { ...v, unit }
        })
    }, [dataType, temperatureUnit, windSpeedUnit, precipitationUnit])

    const categories = useMemo(() => {
        return Array.from(new Set(currentVariables.map((v) => v.category)))
    }, [currentVariables])

    const hasMounted = useRef(false)

    // Initial fetch
    useEffect(() => {
        fetchWeatherData()
        hasMounted.current = true
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Re-fetch when hourly/daily toggle changes
    useEffect(() => {
        if (!hasMounted.current) return
        fetchWeatherData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataType])

    const fetchWeatherData = async () => {
        if (!startDate || !endDate || selectedVariables.length === 0) {
            setError("Please select dates and at least one weather variable")
            return
        }

        setLoading(true)
        setError(null)

        try {
            const params = new URLSearchParams({
                latitude: coordinates.lat.toString(),
                longitude: coordinates.lon.toString(),
                start_date: format(startDate, "yyyy-MM-dd"),
                end_date: format(endDate, "yyyy-MM-dd"),
                timezone: "auto",
                temperature_unit: temperatureUnit,
                wind_speed_unit: windSpeedUnit,
                precipitation_unit: precipitationUnit,
            })

            if (model !== "best_match") params.append("models", model)

            if (dataType === "hourly") {
                params.append("hourly", selectedVariables.join(","))
            } else {
                params.append("daily", selectedVariables.join(","))
            }

            const response = await fetch(`/api/weather?${params}`)
            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || `API Error: ${response.status}`)
            }

            const data = await response.json()
            setWeatherData(data)
        } catch (error) {
            setError(error instanceof Error ? error.message : "Failed to fetch weather data")
        } finally {
            setLoading(false)
        }
    }

    const searchLocationFromInput = async () => {
        if (!location.trim() || location.trim().length < 2) return
        setLocationSearching(true)
        setError(null)
        try {
            const response = await fetch(`/api/geocoding?name=${encodeURIComponent(location.trim())}`)
            if (!response.ok) throw new Error("Location search failed")
            const data = await response.json()
            if (data.results && data.results.length > 0) {
                const result = data.results[0]
                setCoordinates({ lat: result.latitude, lon: result.longitude })
                setLocation(`${result.name}, ${result.country}`)
            } else {
                setError("Location not found.")
            }
        } catch (error) {
            setError("Failed to search location")
        } finally {
            setLocationSearching(false)
        }
    }

    const handleVariableToggle = (id: string) => {
        setSelectedVariables((prev) =>
            prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
        )
    }


    return (
        <div className="min-h-screen bg-background text-foreground font-inter overflow-x-hidden transition-colors duration-300">
            {/* 1. Integrated Page Header (Samsung Style Wide Header) */}
            <header className="pt-12 pb-6 lg:pt-24 lg:pb-12 px-4 lg:px-8 max-w-[1400px] mx-auto transition-all animate-fade-in relative">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground min-h-[28px]">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                <span>ClimaVault Archive</span>
                            </div>
                            <div className="h-3 w-[1px] bg-border" />
                            <span>90.4TB Indexed</span>
                            {loading && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-primary">
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                    <span>Syncing Feed</span>
                                </motion.div>
                            )}
                        </div>
                        <h1 className="text-4xl lg:text-8xl font-bold tracking-tighter">
                            {location.split(',')[0]} <span className="text-muted-foreground/80 font-normal">Vault</span>
                        </h1>
                        <p className="text-lg lg:text-xl text-muted-foreground font-medium max-w-2xl">
                            {format(startDate, "MMM d, yyyy")} — {format(endDate, "MMM d, yyyy")}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 self-start lg:self-center">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.location.reload()}
                            className="rounded-full hover:bg-secondary text-muted-foreground font-black uppercase tracking-widest text-[10px]"
                        >
                            <Undo2 className="h-4 w-4 mr-2" /> Reset Session
                        </Button>
                    </div>
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="mt-6"
                        >
                            <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-3xl flex items-center gap-3 shadow-sm">
                                <AlertCircle className="h-5 w-5 text-destructive" />
                                <p className="text-sm font-bold text-destructive flex-1">{error}</p>
                                <Button variant="ghost" size="sm" onClick={() => setError(null)} className="h-8 w-8 p-0 rounded-full hover:bg-destructive/20 text-destructive">
                                    <Undo2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header >

            {/* 3. Primary Control Strip (Horizontal) */}
            < div className="px-4 lg:px-8 max-w-[1400px] mx-auto mb-8 lg:mb-12" >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card rounded-[2.5rem] p-3 one-ui-shadow flex flex-col xl:flex-row items-center gap-3 border border-border/50"
                >
                    {/* Location Focus */}
                    <div className="relative flex-1 w-full group">
                        <Input
                            placeholder="Search global location..."
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && searchLocationFromInput()}
                            className="pl-12 pr-12 h-16 rounded-[2rem] bg-gray-50 border-none focus-visible:ring-primary/20 transition-all text-lg font-medium"
                        />
                        <MapPin className="absolute left-4.5 top-5.5 h-5 w-5 text-primary" />
                        <Button
                            size="sm" variant="ghost"
                            className="absolute right-3 top-3 h-10 w-10 p-0 rounded-2xl hover:bg-card"
                            onClick={searchLocationFromInput}
                        >
                            <Search className="h-5 w-5 text-muted-foreground" />
                        </Button>
                    </div>

                    <div className="hidden xl:block h-10 w-[1px] bg-border" />

                    {/* Date Pickers Strip */}
                    <div className="grid grid-cols-2 gap-2 w-full xl:flex xl:items-center xl:gap-3 xl:w-auto">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="h-16 rounded-[2rem] bg-gray-50 border-none justify-start px-4 xl:px-6 xl:w-48">
                                    <CalendarIconLucide className="hidden sm:block mr-2 lg:mr-3 h-4 w-4 lg:h-5 lg:w-5 text-gray-400" />
                                    <div className="text-left">
                                        <Label className="text-[9px] lg:text-[10px] uppercase font-black text-gray-400 block -mb-1">From</Label>
                                        <span className="font-bold text-xs lg:text-sm">{format(startDate, "MMM d, yyyy")}</span>
                                    </div>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 rounded-3xl overflow-hidden border-none shadow-2xl bg-card">
                                <Calendar mode="single" selected={startDate} onSelect={(d) => d && setStartDate(d)} initialFocus />
                            </PopoverContent>
                        </Popover>

                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="h-16 rounded-[2rem] bg-gray-50 border-none justify-start px-4 xl:px-6 xl:w-48">
                                    <CalendarIconLucide className="hidden sm:block mr-2 lg:mr-3 h-4 w-4 lg:h-5 lg:w-5 text-gray-400" />
                                    <div className="text-left">
                                        <Label className="text-[9px] lg:text-[10px] uppercase font-black text-gray-400 block -mb-1">To</Label>
                                        <span className="font-bold text-xs lg:text-sm">{format(endDate, "MMM d, yyyy")}</span>
                                    </div>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 rounded-3xl overflow-hidden border-none shadow-2xl bg-card">
                                <Calendar mode="single" selected={endDate} onSelect={(d) => d && setEndDate(d)} initialFocus />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Actions Strip: Run Query + Settings */}
                    <div className="flex items-center gap-2 w-full xl:w-auto">
                        <Button
                            onClick={fetchWeatherData}
                            disabled={loading}
                            className="flex-1 xl:w-auto h-16 px-6 lg:px-10 rounded-[2rem] bg-primary text-white font-black text-sm lg:text-lg transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-primary/20"
                        >
                            {loading ? <Loader2 className="animate-spin h-6 w-6" /> : (
                                <div className="flex items-center justify-center gap-2">
                                    <span>Run Query</span>
                                    <ArrowRight className="h-5 w-5" />
                                </div>
                            )}
                        </Button>

                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="h-16 w-16 xl:w-20 rounded-[2rem] bg-gray-50 border-none flex items-center justify-center group relative shrink-0">
                                    <Settings2 className="h-6 w-6 text-gray-400 group-hover:text-primary transition-colors" />
                                    {(temperatureUnit !== "celsius" || windSpeedUnit !== "kmh" || precipitationUnit !== "mm" || model !== "best_match") && (
                                        <span className="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full" />
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-80 p-5 rounded-[2rem] border border-border shadow-2xl bg-card space-y-5 animate-in fade-in slide-in-from-right-4 duration-300"
                                align="end"
                                side="left"
                                sideOffset={16}
                                collisionPadding={16}
                            >
                                <div className="space-y-5">
                                    <div className="flex items-center justify-between px-1">
                                        <h4 className="font-bold text-lg tracking-tight">Query Settings</h4>
                                        <Badge variant="outline" className="text-[9px] font-black uppercase text-muted-foreground border-border">Live API</Badge>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2.5">
                                            <Label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1">Temperature Unit</Label>
                                            <div className="grid grid-cols-2 gap-1.5 p-1 bg-gray-50 rounded-2xl">
                                                {units.temperature.map(u => (
                                                    <Button
                                                        key={u.id}
                                                        variant="ghost"
                                                        className={cn(
                                                            "rounded-xl h-9 text-xs font-bold transition-all",
                                                            temperatureUnit === u.id ? "bg-white shadow-sm text-primary" : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
                                                        )}
                                                        onClick={() => setTemperatureUnit(u.id as any)}
                                                    >
                                                        {u.label.split(' ')[1] || u.label}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-2.5">
                                            <Label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1">Wind Speed Unit</Label>
                                            <div className="grid grid-cols-4 gap-1 p-1 bg-gray-50 rounded-2xl">
                                                {units.wind_speed.map(u => (
                                                    <Button
                                                        key={u.id}
                                                        variant="ghost"
                                                        className={cn(
                                                            "rounded-xl h-9 text-[10px] font-black p-0 transition-all",
                                                            windSpeedUnit === u.id ? "bg-white shadow-sm text-primary" : "text-gray-400 hover:text-gray-600 hover:bg-white/50"
                                                        )}
                                                        onClick={() => setWindSpeedUnit(u.id as any)}
                                                    >
                                                        {u.label}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-2.5">
                                            <Label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1">Precipitation Unit</Label>
                                            <div className="grid grid-cols-2 gap-1.5 p-1 bg-gray-50 rounded-2xl">
                                                {units.precipitation.map(u => (
                                                    <Button
                                                        key={u.id}
                                                        variant="ghost"
                                                        className={cn(
                                                            "rounded-xl h-9 text-xs font-bold transition-all",
                                                            precipitationUnit === u.id ? "bg-white shadow-sm text-primary" : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
                                                        )}
                                                        onClick={() => setPrecipitationUnit(u.id as any)}
                                                    >
                                                        {u.label}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-2.5">
                                            <Label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1">Atmospheric Model</Label>
                                            <div className="flex flex-col gap-1">
                                                {weatherModels.map(m => (
                                                    <Button
                                                        key={m.id}
                                                        variant="ghost"
                                                        className={cn(
                                                            "rounded-xl h-10 justify-start px-4 font-bold text-xs transition-all",
                                                            model === m.id ? "bg-primary/10 text-primary" : "text-gray-500 hover:bg-gray-50"
                                                        )}
                                                        onClick={() => setModel(m.id)}
                                                    >
                                                        {m.label}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </motion.div>
            </div>

            {/* 4. Visualization & Metrics Workspace */}
            <main className="px-4 lg:px-8 max-w-[1400px] mx-auto pb-24">
                {loading ? (
                    /* Skeleton Loading State for Summary Cards */
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="bg-card/80 backdrop-blur-sm p-4 lg:p-5 rounded-[2rem] border border-border flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4"
                            >
                                <Skeleton className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl shrink-0" />
                                <div className="flex-1 space-y-2 w-full">
                                    <Skeleton className="h-3 w-16 mx-auto sm:mx-0" />
                                    <Skeleton className="h-5 w-24 mx-auto sm:mx-0" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                        {/* Summary Mini Cards - 2x2 on Mobile */}
                        {[
                            { icon: TrendingUp, label: "LATITUDE", val: coordinates.lat.toFixed(4), color: "text-blue-500", bg: "bg-blue-500/10" },
                            { icon: Globe, label: "LONGITUDE", val: coordinates.lon.toFixed(4), color: "text-blue-500", bg: "bg-blue-500/10" },
                            { icon: LayoutGrid, label: "RESOLUTION", val: "11km Grid", color: "text-emerald-500", bg: "bg-emerald-500/10" },
                            { icon: History, label: "TIMELINE", val: dataType.toUpperCase(), color: "text-orange-500", bg: "bg-orange-500/10" },
                        ].map((item, i) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
                                key={item.label}
                                className="bg-card/80 backdrop-blur-sm p-4 lg:p-5 rounded-[2rem] border border-border flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4 group hover:border-primary/30 transition-all duration-300 shadow-sm"
                            >
                                <div
                                    className={cn(
                                        "w-10 h-10 lg:w-12 lg:h-12 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500",
                                        item.bg, item.color
                                    )}
                                >
                                    <item.icon className="h-5 w-5 lg:h-6 lg:w-6" />
                                </div>
                                <div className="text-center sm:text-left flex-1 min-w-0">
                                    <p className="text-[9px] lg:text-[10px] font-black uppercase text-muted-foreground tracking-[0.15em] mb-0.5 lg:mb-1">{item.label}</p>
                                    <p className="font-bold text-sm lg:text-lg truncate group-hover:text-primary transition-colors">{item.val}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                <div className="flex flex-col lg:flex-row items-stretch gap-8 min-h-[500px] h-full">

                    {/* Main Content Area: The Results */}
                    <div className="flex-1 w-full space-y-6 flex flex-col">
                        {loading ? (
                            /* Skeleton Loading State for Chart/Table */
                            <div className="space-y-6 flex-1 flex flex-col">
                                <div className="flex items-center justify-between">
                                    <Skeleton className="h-12 w-64 rounded-full" />
                                </div>
                                <div className="bg-card rounded-[2.5rem] p-6 one-ui-shadow border border-border flex-1">
                                    <div className="w-full h-full min-h-[300px] md:min-h-[400px] flex flex-col gap-4">
                                        <div className="flex justify-between items-center">
                                            <Skeleton className="h-4 w-32" />
                                            <Skeleton className="h-4 w-24" />
                                        </div>
                                        <div className="flex-1 flex items-end gap-2 pt-8">
                                            {[45, 70, 30, 80, 55, 35, 65, 50, 75, 40, 60, 25].map((h, i) => (
                                                <Skeleton
                                                    key={i}
                                                    className="flex-1 rounded-t-lg"
                                                    style={{ height: `${h}%` }}
                                                />
                                            ))}
                                        </div>
                                        <div className="flex justify-between">
                                            {[...Array(6)].map((_, i) => (
                                                <Skeleton key={i} className="h-3 w-12" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : weatherData ? (
                            <div className="space-y-6 flex-1 flex flex-col">
                                {/* View Toggle Bar */}
                                <div className="flex items-center justify-between">
                                    <div className="bg-gray-200/50 p-1 rounded-full flex items-center relative gap-1">
                                        {[
                                            { id: 'chart', label: 'Analytics', icon: BarChart3 },
                                            { id: 'table', label: 'Data Grid', icon: TableIcon }
                                        ].map((t) => (
                                            <button
                                                key={t.id}
                                                onClick={() => setActiveTab(t.id)}
                                                className={cn(
                                                    "relative px-6 h-10 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 z-10",
                                                    activeTab === t.id ? "text-primary" : "text-gray-400 hover:text-gray-600"
                                                )}
                                            >
                                                <t.icon className={cn("h-4 w-4", activeTab === t.id ? "text-primary" : "text-gray-400")} />
                                                {t.label}
                                                {activeTab === t.id && (
                                                    <motion.div
                                                        layoutId="activeViewTab"
                                                        className="absolute inset-0 bg-white rounded-full shadow-md z-[-1]"
                                                        transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                                                    />
                                                )}
                                            </button>
                                        ))}
                                    </div>


                                </div>

                                {/* The actual Data Card */}
                                <motion.div layout className="bg-card rounded-[2.5rem] p-6 one-ui-shadow border border-border flex flex-col relative overflow-hidden flex-1">
                                    {activeTab === 'chart' ? (
                                        <div className="w-full h-[300px] md:h-[400px] lg:h-full">
                                            <WeatherChart data={weatherData} variables={selectedVariables} isLoading={false} />
                                        </div>
                                    ) : (
                                        <div className="flex-1 overflow-auto">
                                            <WeatherTable data={weatherData} variables={selectedVariables} />
                                        </div>
                                    )}
                                </motion.div>
                            </div>
                        ) : (
                            <div className="h-[600px] bg-card/40 rounded-[2.5rem] border-2 border-dashed border-border flex flex-col items-center justify-center text-center p-12 space-y-6">
                                <div className="w-24 h-24 bg-card rounded-full flex items-center justify-center shadow-xl">
                                    <Cloud className="h-10 w-10 text-primary animate-pulse" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold tracking-tight">Set your target context</h3>
                                    <p className="text-muted-foreground font-medium max-w-sm">Enter a location and timeframe above to unlock the archives.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Side Panel: Variable Customization */}
                    <aside className="w-full lg:w-[350px] space-y-6">
                        <div className="bg-card rounded-[2.5rem] p-8 one-ui-shadow border border-border sticky top-24">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-2">
                                    <Filter className="h-5 w-5 text-primary" />
                                    <h3 className="text-xl font-bold">Variables</h3>
                                </div>
                                <Badge variant="secondary" className="border-none font-black text-[10px] rounded-full px-3">{selectedVariables.length}</Badge>
                            </div>

                            <div className="bg-gray-100 p-1 rounded-2xl flex items-center mb-6 relative">
                                {[
                                    { id: 'hourly', label: 'Hourly' },
                                    { id: 'daily', label: 'Daily' }
                                ].map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => {
                                            setDataType(t.id as any);
                                            setSelectedVariables(t.id === 'hourly' ? ["temperature_2m", "precipitation"] : ["temperature_2m_max", "precipitation_sum"]);
                                        }}
                                        className={cn(
                                            "flex-1 relative z-10 h-10 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300",
                                            dataType === t.id ? "text-primary" : "text-gray-400 hover:text-gray-600"
                                        )}
                                    >
                                        {t.label}
                                        {dataType === t.id && (
                                            <motion.div
                                                layoutId="activeDataTypeTab"
                                                className="absolute inset-0 bg-white rounded-xl shadow-sm z-[-1]"
                                                transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-6 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                                {categories.map((cat) => (
                                    <div key={cat} className="space-y-4">
                                        <Label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-1">{cat}</Label>
                                        <div className="space-y-2">
                                            {currentVariables.filter(v => v.category === cat).map(v => (
                                                <motion.div
                                                    whileTap={{ scale: 0.98 }}
                                                    key={v.id}
                                                    onClick={() => handleVariableToggle(v.id)}
                                                    className={cn(
                                                        "flex items-center justify-between p-4 rounded-2xl transition-all cursor-pointer border-2",
                                                        selectedVariables.includes(v.id)
                                                            ? "bg-primary/5 border-primary/20"
                                                            : "bg-white border-transparent hover:bg-gray-50 hover:border-gray-100"
                                                    )}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <Checkbox checked={selectedVariables.includes(v.id)} className="rounded-md border-gray-300 w-5 h-5 data-[state=checked]:bg-primary" />
                                                        <span className="text-sm font-bold text-gray-700">{v.label}</span>
                                                    </div>
                                                    <span className="text-xs font-black text-gray-400">{v.unit}</span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </aside>
                </div>
            </main >

            <footer className="fixed bottom-4 left-4 lg:bottom-8 lg:left-8 z-40">
                <Popover>
                    <PopoverTrigger asChild>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-14 h-14 bg-gray-100 text-foreground rounded-full flex items-center justify-center shadow-2xl hover:bg-gray-200 transition-colors"
                        >
                            <Info className="h-6 w-6" />
                        </motion.button>
                    </PopoverTrigger>
                    <PopoverContent side="top" align="start" className="w-64 p-5 rounded-[2rem] border-none shadow-2xl bg-card mb-4 ml-4">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-xs font-bold uppercase tracking-widest">System Operational</span>
                            </div>
                            <div className="h-[1px] w-full bg-border" />
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Archive Capacity</p>
                                <p className="text-sm font-bold">90.4 TB Online</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Inference Engine</p>
                                <p className="text-sm font-bold">V1.4 Stable (ERA5)</p>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </footer>
        </div >
    )
}
