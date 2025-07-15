"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import { ResultDisplayOptions } from "./result-display-options"
import { DataChart } from "./data-chart"
import { BarChart3 } from "lucide-react" // Declared BarChart3 for use

interface EnhancedResultsDisplayProps {
  results: Array<Record<string, any>>
  title: string
  sqlQuery?: string
}

export function EnhancedResultsDisplay({ results, title, sqlQuery }: EnhancedResultsDisplayProps) {
  const [activeView, setActiveView] = useState<"table" | "chart" | "file">("table")

  // Determine if data can be visualized as chart
  const hasChartData = results.length > 0 && Object.values(results[0]).some((value) => typeof value === "number")

  // Convert data for chart visualization
  const getChartData = () => {
    if (!hasChartData) return []

    return results.map((row, index) => {
      const numericKeys = Object.keys(row).filter((key) => typeof row[key] === "number")
      const nameKey = Object.keys(row).find((key) => typeof row[key] === "string") || "item"

      return {
        name: row[nameKey] || `Item ${index + 1}`,
        value: numericKeys.length > 0 ? row[numericKeys[0]] : 0,
        ...row,
      }
    })
  }

  const handleDownload = (format: "excel" | "pdf" | "csv") => {
    // Simulate download functionality
    const filename = `query_results.${format}`

    if (format === "csv") {
      // Convert to CSV
      const headers = Object.keys(results[0]).join(",")
      const csvContent = results
        .map((row) =>
          Object.values(row)
            .map((value) => `"${value}"`)
            .join(","),
        )
        .join("\n")
      const csv = `${headers}\n${csvContent}`

      const blob = new Blob([csv], { type: "text/csv" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      a.click()
      window.URL.revokeObjectURL(url)
    } else {
      // For Excel and PDF, show notification (would integrate with actual export libraries)
      alert(`Exporting to ${format.toUpperCase()}... (This would integrate with actual export functionality)`)
    }
  }

  const renderTableView = () => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-700">
            {Object.keys(results[0]).map((key) => (
              <th key={key} className="text-left py-3 px-4 font-medium text-gray-300 bg-gray-900">
                {key.replace(/_/g, " ").toUpperCase()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {results.map((row, index) => (
            <tr key={index} className="border-b border-gray-700 hover:bg-gray-700/50 transition-all duration-300">
              {Object.values(row).map((value, cellIndex) => (
                <td key={cellIndex} className="py-3 px-4 text-gray-200">
                  {typeof value === "number" ? value.toLocaleString() : String(value)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  const renderChartView = () => {
    const chartData = getChartData()
    const hasNumericData = chartData.some((item) => typeof item.value === "number")

    if (!hasNumericData) {
      return (
        <div className="text-center py-8 text-gray-400">
          <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>No numeric data available for chart visualization</p>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        <DataChart
          data={chartData}
          chartType="bar"
          title="Data Visualization"
          description="Interactive chart based on your query results"
        />

        {chartData.length > 5 && (
          <DataChart
            data={chartData.slice(0, 5)}
            chartType="pie"
            title="Top 5 Distribution"
            description="Pie chart showing top 5 items"
          />
        )}
      </div>
    )
  }

  return (
    <Card className="bg-gray-800 border-gray-700 transition-all duration-700 ease-out">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-gray-300 flex items-center">
          <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
          {title} ({results.length} rows)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResultDisplayOptions
          activeView={activeView}
          onViewChange={setActiveView}
          onDownload={handleDownload}
          hasChartData={hasChartData}
          resultCount={results.length}
        />

        {activeView === "table" && renderTableView()}
        {activeView === "chart" && renderChartView()}
      </CardContent>
    </Card>
  )
}
