'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const FORECAST_URL =
  'https://api.open-meteo.com/v1/forecast?latitude=33.83&longitude=-116.55&daily=temperature_2m_max&temperature_unit=fahrenheit&timezone=America%2FLos_Angeles&forecast_days=1'

const HAZARD_STRIPES = {
  backgroundImage: 'repeating-linear-gradient(45deg, #000 0 14px, #f7ff00 14px 28px)',
}

export default function HeatAlertBanner() {
  const [high, setHigh] = useState<number | null>(null)

  useEffect(() => {
    fetch(FORECAST_URL)
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        const temp = data?.daily?.temperature_2m_max?.[0]
        if (typeof temp === 'number') setHigh(Math.round(temp))
      })
      .catch(() => {
        // No banner on fetch failure
      })
  }, [])

  if (high === null || high < 100) return null

  const extreme = high >= 110

  return (
    <section className={extreme ? 'bg-[#ff1a1a]' : 'bg-[#f7ff00]'}>
      {/* Hazard tape — top */}
      <div className="h-2 w-full" style={HAZARD_STRIPES} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 text-center">
        <div className="text-2xl sm:text-3xl mb-1.5">{extreme ? '🔥' : '⚠️'}</div>
        <p className={`text-2xl sm:text-4xl font-black tracking-tight mb-1 ${extreme ? 'text-white' : 'text-black'}`}>
          {high}°F
        </p>
        <h2 className={`text-lg sm:text-xl font-black uppercase tracking-wide mb-1.5 ${extreme ? 'text-white' : 'text-black'}`}>
          {extreme ? 'Extreme Heat Warning' : 'High Heat Advisory'}
        </h2>
        <p className={`text-sm sm:text-base font-bold mb-3 ${extreme ? 'text-white' : 'text-black'}`}>
          {extreme
            ? 'Skip midday walks entirely.'
            : 'Walk early, check the pavement, and keep water handy.'}
        </p>
        <Link
          href="/resources/heat"
          className={`inline-block rounded-full px-5 py-2 text-sm font-extrabold shadow-lg hover:scale-105 transition-transform ${
            extreme ? 'bg-black text-white' : 'bg-black text-[#f7ff00]'
          }`}
        >
          Read our High Heat Guide →
        </Link>
      </div>

      {/* Hazard tape — bottom */}
      <div className="h-2 w-full" style={HAZARD_STRIPES} />
    </section>
  )
}
