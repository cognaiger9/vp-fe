"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileDown, BarChart3, Download, FileSpreadsheet, FileText, Grid3X3 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ResultDisplayOptionsProps {
  activeView: "table" | "chart" | "file"
  onViewChange: (view: "table" | "chart" | "file") => void
  onDownload: (format: "excel" | "pdf" | "csv") => void
  hasChartData?: boolean
  resultCount: number
}

export function ResultDisplayOptions({
  activeView,
  onViewChange,
  onDownload,
  hasChartData = false,
  resultCount,
}: ResultDisplayOptionsProps) {
  return (
    <div className="flex items-center justify-between mb-4 p-3 bg-gray-800 rounded-lg border border-gray-700">
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-300">View as:</span>

        {/* Table View Button */}
        <Button
          variant={activeView === "table" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => onViewChange("table")}
          className="text-gray-600 hover:text-white"
        >
          <Grid3X3 className="h-4 w-4 mr-1" />
          Table
        </Button>

        {/* Chart View Button */}
        {hasChartData && (
          <Button
            variant={activeView === "chart" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onViewChange("chart")}
            className="text-gray-300 hover:text-white"
          >
            <BarChart3 className="h-4 w-4 mr-1" />
            Chart
          </Button>
        )}

        <Badge variant="outline" className="text-xs text-gray-400 border-gray-600">
          {resultCount} rows
        </Badge>
      </div>

      {/* Download Options */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="text-gray-300 border-gray-600 hover:bg-gray-700 bg-transparent"
          >
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-gray-800 border-gray-700">
          <DropdownMenuItem
            onClick={() => onDownload("excel")}
            className="text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <FileSpreadsheet className="h-4 w-4 mr-2 text-green-400" />
            Export to Excel
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onDownload("csv")}
            className="text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <FileText className="h-4 w-4 mr-2 text-blue-400" />
            Export to CSV
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onDownload("pdf")}
            className="text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <FileDown className="h-4 w-4 mr-2 text-red-400" />
            Export to PDF
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
