"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"

interface WeatherTableProps {
    data: any
    variables: string[]
}

export default function WeatherTable({ data, variables }: WeatherTableProps) {
    if (!data || (!data.hourly && !data.daily)) {
        return (
            <div className="flex h-96 items-center justify-center text-muted-foreground p-8">
                No data available for table display.
            </div>
        )
    }

    const dataSource = data.hourly || data.daily
    const isHourly = !!data.hourly
    const units = data.hourly_units || data.daily_units || {}

    const formatTime = (time: string) => {
        const date = new Date(time)
        if (isHourly) {
            return date.toLocaleString(undefined, {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            })
        }
        return date.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
        })
    }

    return (
        <div className="rounded-[2rem] overflow-hidden bg-card/50">
            <ScrollArea className="h-[400px] lg:h-[550px]">
                <Table>
                    <TableHeader className="sticky top-0 bg-card z-10">
                        <TableRow className="border-b-secondary hover:bg-transparent">
                            <TableHead className="w-48 font-bold text-foreground h-14">Timestamp</TableHead>
                            {variables.map((variable) => (
                                <TableHead key={variable} className="font-bold text-foreground whitespace-nowrap">
                                    {variable.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                                    {units[variable] && (
                                        <span className="ml-1 text-[10px] text-muted-foreground font-normal">
                                            ({units[variable]})
                                        </span>
                                    )}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {dataSource.time.map((time: string, index: number) => (
                            <TableRow key={time} className="hover:bg-primary/5 transition-colors border-b-secondary/50 group">
                                <TableCell className="font-semibold text-xs text-muted-foreground group-hover:text-primary transition-colors">
                                    {formatTime(time)}
                                </TableCell>
                                {variables.map((variable) => (
                                    <TableCell key={`${time}-${variable}`} className="text-sm whitespace-nowrap">
                                        {dataSource[variable] ? (
                                            <span className="font-medium">{dataSource[variable][index]}</span>
                                        ) : (
                                            <span className="text-muted-foreground/30">-</span>
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        )).reverse()}
                    </TableBody>
                </Table>
            </ScrollArea>
        </div>
    )
}
