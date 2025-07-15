"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, BarChart3, PieChartIcon } from "lucide-react"

interface DataChartProps {
  data: Array<Record<string, any>>
  chartType: "bar" | "line" | "pie"
  title: string
  description?: string
}

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"]

export function DataChart({ data, chartType, title, description }: DataChartProps) {
  const chartConfig = {
    value: {
      label: "Value",
      color: "hsl(var(--chart-1))",
    },
    amount: {
      label: "Amount",
      color: "hsl(var(--chart-2))",
    },
    count: {
      label: "Count",
      color: "hsl(var(--chart-3))",
    },
  }

  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value" fill="var(--color-value)" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        )

      case "line":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="value" stroke="var(--color-value)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        )

      case "pie":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        )

      default:
        return null
    }
  }

  const getChartIcon = () => {
    switch (chartType) {
      case "bar":
        return <BarChart3 className="h-4 w-4 text-blue-400" />
      case "line":
        return <TrendingUp className="h-4 w-4 text-green-400" />
      case "pie":
        return <PieChartIcon className="h-4 w-4 text-purple-400" />
      default:
        return <BarChart3 className="h-4 w-4 text-blue-400" />
    }
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-2">
          {getChartIcon()}
          <CardTitle className="text-sm text-gray-300">{title}</CardTitle>
        </div>
        {description && <p className="text-xs text-gray-400">{description}</p>}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>{renderChart()}</ChartContainer>
      </CardContent>
    </Card>
  )
}
