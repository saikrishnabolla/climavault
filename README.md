# ClimaVault

A web app for exploring historical weather data going back to 1940. Search any location, pick your dates, and visualize 80+ years of climate patterns.

![Next.js](https://img.shields.io/badge/Next.js-16.1.0-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.3-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.18-38B2AC?style=flat-square&logo=tailwind-css)

## What is this?

I built this because I wanted a better way to look at historical weather data. The Open-Meteo API is incredible (90TB of data!), but I wanted something with a nicer interface than just raw API calls.

So here's what you get:
- Search any location on Earth
- Pick any date range from 1940 to now
- Choose from 50+ weather variables (temperature, precipitation, wind, pressure, etc.)
- View data as interactive charts or tables
- Switch between hourly and daily resolution
- Customize units (Celsius/Fahrenheit, km/h/mph, etc.)

## Running it locally

You'll need Node.js 18 or newer. I use pnpm but npm works fine too.

```bash
# Clone it
git clone https://github.com/saikrishnabolla/climavault.git
cd climavault

# Install stuff
pnpm install

# Start the dev server
pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000) and you're good to go.

If you want to build for production:
```bash
pnpm build
pnpm start
```


## Project Structure


```
climavault/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   ├── geocoding/        # Location search endpoint
│   │   └── weather/          # Weather data endpoint
│   ├── dashboard/            # Main dashboard page
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Landing page
├── components/               # React components
│   ├── ui/                   # Reusable UI components (shadcn/ui)
│   └── weather/              # Weather-specific components
│       ├── weather-chart.tsx # Chart visualization
│       └── weather-table.tsx # Data grid view
├── lib/                      # Utilities and constants
│   ├── constants.ts          # Weather variables, models, units
│   └── utils.ts              # Helper functions
├── public/                   # Static assets
└── package.json              # Dependencies and scripts
```

## Tech Stack

Built with Next.js 16 (App Router), React 19, and TypeScript. Here's the full list:

**Frontend:**
- Next.js 16.1.0 - React framework
- React 19.2.3
- TypeScript 5.9.3
- TailwindCSS 4.1.18 - for styling
- Motion - animations
- Lucide React - icons

**UI Components:**
- Radix UI - accessible primitives
- shadcn/ui - component library
- Recharts - for the charts

**Other:**
- date-fns - date handling
- Zod - validation
- Vercel Analytics


## About the data

All the weather data comes from [Open-Meteo's Historical Weather API](https://open-meteo.com/en/docs/historical-weather-api). They've done an incredible job making this data accessible - it's based on ERA5 reanalysis data with 11km resolution.

You can query:
- **Hourly data**: Temperature at different heights, humidity, precipitation, rain, snowfall, cloud cover, wind speed/direction, pressure, weather codes, etc.
- **Daily data**: Max/min/mean temperature, precipitation totals, sunshine duration, wind speeds, etc.

The data goes back to 1940 and is updated regularly. It's pretty wild that you can get this much historical climate data for free.


## How it works

**Location Search**  
Type any city name and it'll find it using Open-Meteo's geocoding API. Works for pretty much anywhere on Earth.

**Date Selection**  
Pick your start and end dates. You can go back to 1940 if you want.

**Units**  
Choose your preferred units:
- Temperature: Celsius or Fahrenheit
- Wind: km/h, m/s, mph, or knots
- Precipitation: mm or inches

**Weather Models**  
Usually "Best Match" is fine, but you can pick specific models like ERA5, ERA5-Land, or CERRA if you know what you're doing.

**Visualization**  
Switch between chart view (for trends) and table view (for raw numbers). The charts can handle multiple variables at once which is pretty useful.


## API Routes

The app has two API routes:

**`/api/weather`** - Gets historical weather data  
Query params: `latitude`, `longitude`, `start_date`, `end_date`, `hourly` or `daily` (comma-separated variables), `temperature_unit`, `wind_speed_unit`, `precipitation_unit`, `models` (optional)

**`/api/geocoding`** - Searches for locations  
Query params: `name` (location to search)


## Design notes

I wanted this to look clean and modern without being boring Color-wise, I went with a blue primary color (#0078FF) and kept everything else pretty minimal. The typography is Inter throughout because it's clean and reads well at all sizes.

The animations are subtle - just enough to make things feel smooth without being distracting. I used Motion (formerly Framer Motion) for most of the transitions.

## Deploying

Easiest way is to deploy to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/saikrishnabolla/climavault)

Or build it yourself:
```bash
pnpm build
pnpm start
```


## Contributing

Found a bug or want to add something? PRs are welcome. Just fork it, make your changes, and send it over.

## Credits

- [Open-Meteo](https://open-meteo.com/) for the free weather API
- [shadcn/ui](https://ui.shadcn.com/) for the component library

## License

This project is licensed under **CC BY-NC 4.0** (Creative Commons Attribution-NonCommercial 4.0 International).

**What this means:**
- ✅ You can use, modify, and share this code
- ✅ You must give credit to the original author (Sai Krishna Bolla)
- ❌ You cannot use it for commercial purposes without permission

See the [LICENSE](LICENSE) file for full details.
