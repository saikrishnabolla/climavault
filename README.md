# ClimaVault

Explore historical weather data going back to 1940 - for any location on Earth.

**Live at [climavault.vercel.app](https://climavault.vercel.app)**

![Preview](https://v1.screenshot.11ty.dev/https%3A%2F%2Fclimavault.vercel.app/opengraph/_wait:3/)

## Highlights

- ERA5, ERA5-Land, and CERRA reanalysis model support - real climate science data
- 50+ weather variables from 1940 to present
- API routes proxy Open-Meteo for CORS handling
- Dynamic OG image generation for social sharing
- CC BY-NC 4.0 licensed

---

ClimaVault is a web app that puts 80+ years of climate data at your fingertips. It wraps the [Open-Meteo Historical Weather API](https://open-meteo.com) in a clean interface where you can search any location, pick a date range from 1940 to today, and visualize the results as interactive charts or tables.

## What you can do

- Search any location worldwide via geocoding
- Select date ranges spanning 1940–present
- Choose from 50+ weather variables (temperature, precipitation, wind, pressure, humidity, etc.)
- Switch between ERA5, ERA5-Land, and CERRA reanalysis models
- View data at hourly or daily resolution
- Overlay multiple variables on a single chart
- Export data in tabular format

## How it works

The app proxies all requests through Next.js API routes (`/api/weather` and `/api/geocoding`) to handle CORS and keep things clean. The frontend renders everything with Recharts for the interactive charts and a custom table component for raw data.

Dynamic OG images are generated per-page for social sharing previews.

## Project structure

```
app/
├── api/
│   ├── geocoding/      → proxies Open-Meteo geocoding
│   └── weather/        → proxies Open-Meteo historical weather
├── dashboard/          → main data exploration view
├── opengraph-image.tsx → dynamic OG image generation
└── page.tsx            → landing page
components/
└── weather/
    ├── weather-chart.tsx
    └── weather-table.tsx
lib/
└── constants.ts        → weather variables, models, units
```

## Tech

- Next.js 16 (App Router)
- React 19, TypeScript 5.9
- Tailwind CSS 4, shadcn/ui
- Recharts (charts), Motion v12 (animations)
- Zod 4 (validation)
- Vercel Analytics

## Development

```bash
npm install
npm run dev
```

No API keys needed — Open-Meteo's historical API is free and open.

## License

CC BY-NC 4.0
