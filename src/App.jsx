import React from 'react'
import './App.css'
import Datepicker from './Datepicker'

export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-xl w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-4xl font-extrabold text-blue-600 mb-4">Hello World</h1>
        <p className="text-gray-600 mb-6">This is a Vite + React app with Tailwind CSS.</p>
        <div className="mb-6">
          <Datepicker />
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition">Primary</button>
          <button className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 transition">Secondary</button>
        </div>
      </div>
    </div>
  )
}
