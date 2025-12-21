import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Security: Prevent direct API access/abuse from external sources
    const referer = request.headers.get("referer")
    const origin = request.headers.get("origin")
    const host = request.headers.get("host")

    // Strict check: Must have referer/origin and it must match the host
    // This allows requests from the website UI but blocks most direct curl/script attacks
    const isSameOrigin =
      (referer && host && referer.includes(host)) ||
      (origin && host && origin.includes(host))

    if (!isSameOrigin) {
      // Allow local development flexibility or relax if needed, but for now strict as requested
      // We can also check for a specific logic secret if we wanted server-to-server auth
      if (process.env.NODE_ENV === 'production' || (!referer && !origin)) {
        return NextResponse.json({ error: "Unauthorized access: Request must originate from the website." }, { status: 403 })
      }
    }

    // Extract parameters from the request
    const latitude = searchParams.get("latitude")
    const longitude = searchParams.get("longitude")
    const startDate = searchParams.get("start_date")
    const endDate = searchParams.get("end_date")
    const timezone = searchParams.get("timezone") || "auto"
    const hourly = searchParams.get("hourly")
    const daily = searchParams.get("daily")

    const temperatureUnit = searchParams.get("temperature_unit")
    const windSpeedUnit = searchParams.get("wind_speed_unit")
    const precipitationUnit = searchParams.get("precipitation_unit")
    const models = searchParams.get("models")

    // Validate required parameters
    if (!latitude || !longitude || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Missing required parameters: latitude, longitude, start_date, end_date" },
        { status: 400 },
      )
    }

    // Validate that only one data type is requested
    if (!hourly && !daily) {
      return NextResponse.json({ error: "Must specify either hourly or daily parameters" }, { status: 400 })
    }

    // Build the OpenMeteo API URL
    const apiUrl = new URL("https://archive-api.open-meteo.com/v1/archive")
    apiUrl.searchParams.set("latitude", latitude)
    apiUrl.searchParams.set("longitude", longitude)
    apiUrl.searchParams.set("start_date", startDate)
    apiUrl.searchParams.set("end_date", endDate)
    apiUrl.searchParams.set("timezone", timezone)

    if (temperatureUnit) apiUrl.searchParams.set("temperature_unit", temperatureUnit)
    if (windSpeedUnit) apiUrl.searchParams.set("wind_speed_unit", windSpeedUnit)
    if (precipitationUnit) apiUrl.searchParams.set("precipitation_unit", precipitationUnit)
    if (models) apiUrl.searchParams.set("models", models)

    if (hourly) {
      apiUrl.searchParams.set("hourly", hourly)
    }

    if (daily) {
      apiUrl.searchParams.set("daily", daily)
    }

    // Make the request to OpenMeteo API
    const response = await fetch(apiUrl.toString(), {
      headers: {
        "User-Agent": "ClimateVault-Platform/1.0",
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data.reason || data.error || `OpenMeteo API error: ${response.status}` },
        { status: response.status },
      )
    }

    // Return the weather data
    return NextResponse.json(data)
  } catch (error) {
    console.error("Weather API error:", error)
    return NextResponse.json({ error: "Internal server error while fetching weather data" }, { status: 500 })
  }
}
