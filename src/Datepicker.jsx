import React, { useState, useMemo, useRef, useEffect } from 'react'

export default function Datepicker() {
  const [selectedDate, setSelectedDate] = useState(null)
  const [showCalendar, setShowCalendar] = useState(false)
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const containerRef = useRef(null)

  const formattedDate = useMemo(() => (selectedDate ? selectedDate.toLocaleDateString() : ''), [selectedDate])

  const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate()

  const calendarDays = useMemo(() => {
    const days = []
    const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay()
    // previous month days
    const prevMonthDays = daysInMonth(currentYear, currentMonth - 1)
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(currentYear, currentMonth - 1, prevMonthDays - i),
        otherMonth: true,
      })
    }
    // current month days
    const thisMonthDays = daysInMonth(currentYear, currentMonth)
    for (let i = 1; i <= thisMonthDays; i++) {
      days.push({ date: new Date(currentYear, currentMonth, i), otherMonth: false })
    }
    // next month days (fill to 6 weeks grid = 42 cells)
    const nextDays = 42 - days.length
    for (let i = 1; i <= nextDays; i++) {
      days.push({ date: new Date(currentYear, currentMonth + 1, i), otherMonth: true })
    }
    return days
  }, [currentMonth, currentYear])

  const currentMonthName = useMemo(() => new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' }), [currentMonth, currentYear])

  const toggleCalendar = () => setShowCalendar((v) => !v)
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear((y) => y - 1)
    } else setCurrentMonth((m) => m - 1)
  }
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear((y) => y + 1)
    } else setCurrentMonth((m) => m + 1)
  }
  const selectDate = (day) => {
    if (day.otherMonth) return
    setSelectedDate(day.date)
    setShowCalendar(false)
  }
  const isSelected = (day) => selectedDate && day.date.toDateString() === selectedDate.toDateString()

  // close on outside click
  useEffect(() => {
    function onClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowCalendar(false)
      }
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return (
    <div className="relative inline-block" ref={containerRef}>
      <input
        type="text"
        readOnly
        value={formattedDate}
        onClick={toggleCalendar}
        placeholder="Select date"
        className="w-44 p-2 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        aria-label="Select date"
      />

      {showCalendar && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-4 w-64">
          {/* header */}
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={prevMonth}
              type="button"
              className="p-1 rounded hover:bg-gray-100 text-gray-700"
              aria-label="Previous month"
            >
              ‹
            </button>

            <div className="text-center">
              <div className="text-sm text-gray-500">{currentYear}</div>
              <div className="font-semibold text-gray-800">{currentMonthName}</div>
            </div>

            <button
              onClick={nextMonth}
              type="button"
              className="p-1 rounded hover:bg-gray-100 text-gray-700"
              aria-label="Next month"
            >
              ›
            </button>
          </div>

          {/* weekdays */}
          <div className="grid grid-cols-7 text-center mb-2">
            {weekdays.map((d) => (
              <div key={d} className="text-xs font-medium text-gray-500 py-1">{d}</div>
            ))}
          </div>

          {/* days */}
          <div className="grid grid-cols-7 gap-2 text-center">
            {calendarDays.map((day) => {
              const selected = isSelected(day)
              const isOther = day.otherMonth
              const btnClass = [
                'w-8 h-8 inline-flex items-center justify-center text-sm rounded-full transition',
                isOther ? 'text-gray-300 hover:text-gray-400' : 'text-gray-700 hover:bg-blue-50',
                selected ? 'bg-blue-600 text-white shadow' : '',
              ].filter(Boolean).join(' ')

              return (
                <button
                  key={day.date.toISOString()}
                  type="button"
                  onClick={() => selectDate(day)}
                  className={btnClass}
                  aria-current={selected ? 'date' : undefined}
                  aria-disabled={isOther}
                  disabled={isOther}
                >
                  {day.date.getDate()}
                </button>
              )
            })}
          </div>

          {/* footer: quick today button */}
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={() => {
                setSelectedDate(new Date())
                setCurrentMonth(new Date().getMonth())
                setCurrentYear(new Date().getFullYear())
                setShowCalendar(false)
              }}
              className="text-sm text-blue-600 hover:underline"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
