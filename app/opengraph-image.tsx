import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const alt = 'ClimaVault'
export const size = {
    width: 1200,
    height: 630,
}
export const contentType = 'image/png'

// Image generation
export default function Image() {
    return new ImageResponse(
        (
            // ImageResponse JSX element
            <div
                style={{
                    background: '#F5F7FA', // Matches dashboard background
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0078FF', width: 200, height: 200, borderRadius: 50, marginBottom: 40, boxShadow: '0 25px 50px -12px rgba(0, 120, 255, 0.4)' }}>
                    <svg
                        width="120"
                        height="120"
                        viewBox="0 0 512 512"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <circle cx="256" cy="256" r="48" fill="white" />
                        <path d="M336 176C357.333 197.333 370 225.333 370 256C370 286.667 357.333 314.667 336 336" stroke="white" strokeOpacity="0.5" strokeWidth="32" strokeLinecap="round" />
                        <path d="M384 128C351.6 95.6 306.4 76 256 76C156.589 76 76 156.589 76 256C76 355.411 156.589 436 256 436C306.4 436 351.6 416.4 384 384" stroke="white" strokeWidth="48" strokeLinecap="round" />
                    </svg>
                </div>

                <div style={{ fontSize: 80, fontWeight: 900, color: '#1D1D1F', letterSpacing: '-0.03em' }}>
                    CLIMAVAULT
                </div>
                <div style={{ fontSize: 32, fontWeight: 500, color: '#666', marginTop: 10, letterSpacing: '0.2em' }}>
                    HISTORICAL WEATHER ARCHIVE
                </div>
            </div>
        ),
        {
            ...size,
        }
    )
}
