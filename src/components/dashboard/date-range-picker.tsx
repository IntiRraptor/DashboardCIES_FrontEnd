"use client"

import { cn } from "@/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons"
import * as React from "react"
import { DateRange } from "react-day-picker";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";

interface CalendarDateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  date?: DateRange | undefined;
  setDate?: (date: DateRange | undefined) => void;
}

export function CalendarDateRangePicker({
  className,
  date,
  setDate,
}: CalendarDateRangePickerProps) {
  const [internalDate, setInternalDate] = React.useState<DateRange | undefined>(date);

  const handleSelect = (newDate: DateRange | undefined) => {
    setInternalDate(newDate);
    setDate?.(newDate);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[260px] justify-start text-left font-normal",
              !internalDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {internalDate?.from ? (
              internalDate.to ? (
                <>
                  {format(internalDate.from, "LLL dd, y")} -{" "}
                  {format(internalDate.to, "LLL dd, y")}
                </>
              ) : (
                format(internalDate.from, "LLL dd, y")
              )
            ) : (
              <span>Seleccionar fecha</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={internalDate?.from}
            selected={internalDate}
            onSelect={handleSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
