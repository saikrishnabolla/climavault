import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const name = searchParams.get("name")

    if (!name) {
      return NextResponse.json({ error: "Missing required parameter: name" }, { status: 400 })
    }

    // Build the geocoding API URL with proper parameters
    const geocodingUrl = new URL("https://geocoding-api.open-meteo.com/v1/search")
    geocodingUrl.searchParams.set("name", name)
    geocodingUrl.searchParams.set("count", "10") // Return up to 10 results
    geocodingUrl.searchParams.set("language", "en") // English results
    geocodingUrl.searchParams.set("format", "json") // JSON format

    console.log("Geocoding request URL:", geocodingUrl.toString())

    // Make the request to OpenMeteo Geocoding API
    const response = await fetch(geocodingUrl.toString(), {
      headers: {
        "User-Agent": "ClimateVault-Platform/1.0",
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      console.error("Geocoding API error:", response.status, response.statusText)
      throw new Error(`Geocoding API error: ${response.status}`)
    }

    const data = await response.json()
    console.log("Geocoding response:", data)

    // Check if we have results
    if (!data.results || data.results.length === 0) {
      return NextResponse.json({
        results: [],
        message: "No locations found for the search term",
      })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Geocoding API error:", error)
    return NextResponse.json(
      {
        error: "Failed to search location",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
