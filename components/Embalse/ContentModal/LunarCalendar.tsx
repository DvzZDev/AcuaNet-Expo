import { Text, View } from "react-native"
import { Calendar, LocaleConfig } from "react-native-calendars"
import { Moon } from "lunarphase-js"
import clsx from "clsx"
import { HugeiconsIcon } from "@hugeicons/react-native"
import { ViewIcon } from "@hugeicons/core-free-icons"

LocaleConfig.locales["es"] = {
  monthNames: [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ],
  monthNamesShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
  dayNames: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
  dayNamesShort: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
  today: "Hoy",
}
LocaleConfig.defaultLocale = "es"

function MoonVisibility({ age }: { age: number }) {
  const illumination = (1 - Math.cos((2 * Math.PI * age) / 29.5)) / 2
  const percentage = Math.round(illumination * 100).toFixed(0)
  return percentage
}

function FishActivity({ age }: { age: number }) {
  const normalizedAge = age % 29.5
  const distanceToNewMoon = Math.min(normalizedAge, 29.5 - normalizedAge)
  const distanceToFullMoon = Math.abs(normalizedAge - 14.75)
  const minDistance = Math.min(distanceToNewMoon, distanceToFullMoon)
  let activityLevel: number

  if (minDistance <= 1.5) {
    activityLevel = 3
  } else if (minDistance <= 3) {
    activityLevel = 2
  } else {
    activityLevel = 1
  }

  return "🐟".repeat(activityLevel)
}

export default function LunarCalendar() {
  return (
    <View>
      <Calendar
        firstDay={1}
        hideExtraDays={true}
        theme={{
          calendarBackground: "#020533",
          arrowColor: "#b9cffe",
          dayTextColor: "#b9cffe",
          monthTextColor: "#b9cffe",
          textDayHeaderFontSize: 15,
          textDayFontFamily: "Inter-Bold",
          textMonthFontFamily: "Inter-Bold",
          textDayHeaderFontFamily: "Inter-Bold",
        }}
        dayComponent={({ date, state }) => {
          const dateObj = date?.dateString ? new Date(date.dateString) : undefined
          const phaseEmoji = Moon.lunarPhaseEmoji(dateObj)
          const lunarAge = Moon.lunarAge(dateObj)
          const visibility = MoonVisibility({ age: lunarAge })
          const activity = FishActivity({ age: lunarAge })

          const isToday = state === "today"
          const isDisabled = state === "disabled"

          return (
            <View
              className={clsx(
                "flex-col items-center justify-center rounded-lg p-1",
                isToday && "bg-[#4b0000]",
                !isToday && "bg-transparent"
              )}
            >
              <View className="w-full flex-row items-center justify-between gap-1">
                <Text className="text-xs">{phaseEmoji}</Text>
                <Text
                  className={clsx(
                    "text-center text-xs font-bold",
                    isDisabled ? "text-gray-400" : isToday ? "text-white" : "text-[#b9cffe]"
                  )}
                >
                  {date?.day}
                </Text>
              </View>
              <View className="flex-row items-center justify-center">
                <Text className="text-xs">{activity}</Text>
              </View>
              <View className="flex-row items-center justify-center gap-1">
                <HugeiconsIcon
                  size="12"
                  color={isToday ? "#ffffff" : "#b9cffe"}
                  icon={ViewIcon}
                />
                <Text className={clsx("text-xs", isToday ? "text-white" : "text-[#b9cffe]")}>{visibility}%</Text>
              </View>
            </View>
          )
        }}
      />
    </View>
  )
}
