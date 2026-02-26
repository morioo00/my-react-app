import { useState } from "react"
import { postDate } from "./calendarApi"

export const useCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(null)

  const handleDateClick = async (info) => {
    const date = info.dateStr
    setSelectedDate(date)
    await postDate(date)
  }

  return {
    selectedDate,
    handleDateClick
  }
}