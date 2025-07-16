"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Database, Table as TableIcon, Key, ChevronRight, ChevronDown, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { listDatabases, getDatabaseSchema } from "@/lib/api"

// Mock data for fallback
const MOCK_DATABASES = {
  "chinook": "Chinook.db",
  "vpbank": "dataset/vpbank.sqlite"
}

const MOCK_SCHEMA = {
  "database": "chinook",
  "database_path": "/path/to/Chinook.db",
  "tables": {
    "albums": {
      "columns": [
        { "name": "AlbumId", "type": "INTEGER", "primary_key": true },
        { "name": "Title", "type": "NVARCHAR(160)", "primary_key": false },
        { "name": "ArtistId", "type": "INTEGER", "primary_key": false }
      ],
      "sample_data": [
        { "AlbumId": 1, "Title": "For Those About To Rock We Salute You", "ArtistId": 1 },
        { "AlbumId": 2, "Title": "Balls to the Wall", "ArtistId": 2 }
      ]
    },
    "artists": {
      "columns": [
        { "name": "ArtistId", "type": "INTEGER", "primary_key": true },
        { "name": "Name", "type": "NVARCHAR(120)", "primary_key": false }
      ],
      "sample_data": [
        { "ArtistId": 1, "Name": "AC/DC" },
        { "ArtistId": 2, "Name": "Accept" }
      ]
    },
    "customers": {
      "columns": [
        { "name": "CustomerId", "type": "INTEGER", "primary_key": true },
        { "name": "FirstName", "type": "NVARCHAR(40)", "primary_key": false },
        { "name": "LastName", "type": "NVARCHAR(20)", "primary_key": false },
        { "name": "Company", "type": "NVARCHAR(80)", "primary_key": false },
        { "name": "Address", "type": "NVARCHAR(70)", "primary_key": false },
        { "name": "City", "type": "NVARCHAR(40)", "primary_key": false },
        { "name": "Email", "type": "NVARCHAR(60)", "primary_key": false }
      ],
      "sample_data": [
        { "CustomerId": 1, "FirstName": "Luís", "LastName": "Gonçalves", "Company": "Embraer", "Address": "Av. Brigadeiro Faria Lima, 2170", "City": "São José dos Campos", "Email": "luisg@embraer.com.br" }
      ]
    }
  }
}

interface DatabaseSchemaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DatabaseSchemaDialog({ open, onOpenChange }: DatabaseSchemaDialogProps) {
  const [selectedDatabase, setSelectedDatabase] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [schema, setSchema] = useState<any>({})
  const [databases, setDatabases] = useState<Record<string, string>>({})
  const [expandedTables, setExpandedTables] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Filter tables based on search term
  const filteredTables = Object.keys(schema.tables || {}).filter(
    tableName => tableName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Toggle table expansion
  const toggleTableExpansion = (tableName: string) => {
    setExpandedTables(prev => ({
      ...prev,
      [tableName]: !prev[tableName]
    }))
  }

  // Fetch list of available databases
  useEffect(() => {
    if (open) {
      const fetchDatabases = async () => {
        try {
          setIsLoading(true)
          setError(null)
          const response = await listDatabases()
          if (response.status === "success") {
            setDatabases(response.databases)
            
            // Select first database by default if none selected
            if (!selectedDatabase && Object.keys(response.databases).length > 0) {
              setSelectedDatabase(Object.keys(response.databases)[0])
            }
          } else {
            setError("Failed to fetch databases")
            // Use mock data as fallback
            setDatabases(MOCK_DATABASES)
            setSelectedDatabase("chinook")
          }
        } catch (err) {
          console.error("Error fetching databases:", err)
          setError("Failed to fetch databases. Using sample data instead.")
          // Use mock data as fallback
          setDatabases(MOCK_DATABASES)
          setSelectedDatabase("chinook")
        } finally {
          setIsLoading(false)
        }
      }

      fetchDatabases()
    }
  }, [open])

  // Fetch schema for selected database
  useEffect(() => {
    if (selectedDatabase) {
      const fetchSchema = async () => {
        try {
          setIsLoading(true)
          setError(null)
          const response = await getDatabaseSchema(selectedDatabase)
          if (response.status === "success") {
            setSchema(response.schema)
          } else {
            setError(`Failed to fetch schema for ${selectedDatabase}`)
            // Use mock data as fallback
            setSchema(MOCK_SCHEMA)
          }
        } catch (err) {
          console.error(`Error fetching schema for ${selectedDatabase}:`, err)
          setError(`Failed to fetch schema. Using sample data instead.`)
          // Use mock data as fallback
          setSchema(MOCK_SCHEMA)
        } finally {
          setIsLoading(false)
        }
      }

      fetchSchema()
    }
  }, [selectedDatabase])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Database Schema
          </DialogTitle>
        </DialogHeader>
        
        {error && (
          <Alert variant="destructive" className="bg-red-900/20 border-red-800 text-red-300 mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-12 gap-4 mt-4">
          {/* Left sidebar - Database selector */}
          <div className="col-span-3 border-r border-gray-700 pr-4">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Databases</h3>
            <div className="space-y-1">
              {isLoading && Object.keys(databases).length === 0 ? (
                <div className="text-gray-400 text-sm py-2">Loading databases...</div>
              ) : Object.keys(databases).length === 0 ? (
                <div className="text-gray-400 text-sm py-2">No databases available</div>
              ) : (
                Object.entries(databases).map(([dbName, dbPath]) => (
                  <Button
                    key={dbName}
                    variant={selectedDatabase === dbName ? "secondary" : "ghost"}
                    className={`w-full justify-start text-left ${
                      selectedDatabase === dbName ? "bg-gray-700 text-white" : "text-gray-300"
                    }`}
                    onClick={() => setSelectedDatabase(dbName)}
                    disabled={isLoading}
                  >
                    <Database className="h-4 w-4 mr-2" />
                    <span className="truncate">{dbName}</span>
                  </Button>
                ))
              )}
            </div>
          </div>
          
          {/* Right content - Schema display */}
          <div className="col-span-9">
            {/* Search bar */}
            <div className="mb-4 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search tables..."
                className="pl-10 bg-gray-700 border-gray-600 text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={isLoading || !schema.tables || Object.keys(schema.tables || {}).length === 0}
              />
            </div>
            
            {/* Tables list */}
            <ScrollArea className="h-[60vh]">
              {isLoading ? (
                <div className="text-center py-8 text-gray-400">
                  Loading schema information...
                </div>
              ) : !schema.tables || Object.keys(schema.tables || {}).length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  No tables found in this database
                </div>
              ) : filteredTables.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  No tables found matching "{searchTerm}"
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTables.map(tableName => (
                    <div key={tableName} className="border border-gray-700 rounded-md overflow-hidden">
                      {/* Table header */}
                      <div 
                        className="bg-gray-700 px-4 py-3 flex items-center justify-between cursor-pointer"
                        onClick={() => toggleTableExpansion(tableName)}
                      >
                        <div className="flex items-center">
                          <TableIcon className="h-4 w-4 mr-2 text-blue-400" />
                          <span className="font-medium">{tableName}</span>
                          <Badge className="ml-2 bg-gray-600 text-xs">
                            {schema.tables[tableName].columns.length} columns
                          </Badge>
                        </div>
                        {expandedTables[tableName] ? (
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                      
                      {/* Table details */}
                      {expandedTables[tableName] && (
                        <div className="p-4 bg-gray-800">
                          <Tabs defaultValue="structure">
                            <TabsList className="bg-gray-700">
                              <TabsTrigger value="structure">Structure</TabsTrigger>
                              <TabsTrigger value="sample">Sample Data</TabsTrigger>
                            </TabsList>
                            
                            {/* Structure tab */}
                            <TabsContent value="structure">
                              <Table>
                                <TableHeader>
                                  <TableRow className="border-gray-700">
                                    <TableHead className="text-gray-300">Column</TableHead>
                                    <TableHead className="text-gray-300">Type</TableHead>
                                    <TableHead className="text-gray-300">Attributes</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {schema.tables[tableName].columns.map((column: any, i: number) => (
                                    <TableRow key={i} className="border-gray-700">
                                      <TableCell className="font-medium flex items-center">
                                        {column.primary_key && <Key className="h-3 w-3 mr-2 text-yellow-500" />}
                                        {column.name}
                                      </TableCell>
                                      <TableCell className="text-gray-300">{column.type}</TableCell>
                                      <TableCell>
                                        {column.primary_key && (
                                          <Badge className="bg-yellow-600 text-xs">Primary Key</Badge>
                                        )}
                                        {column.not_null && !column.primary_key && (
                                          <Badge className="bg-blue-600 text-xs">Not Null</Badge>
                                        )}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TabsContent>
                            
                            {/* Sample data tab */}
                            <TabsContent value="sample">
                              {schema.tables[tableName].sample_data && 
                               schema.tables[tableName].sample_data.length > 0 ? (
                                <div className="overflow-x-auto">
                                  <Table>
                                    <TableHeader>
                                      <TableRow className="border-gray-700">
                                        {schema.tables[tableName].columns.map((column: any) => (
                                          <TableHead key={column.name} className="text-gray-300">
                                            {column.name}
                                          </TableHead>
                                        ))}
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {schema.tables[tableName].sample_data.map((row: any, i: number) => (
                                        <TableRow key={i} className="border-gray-700">
                                          {schema.tables[tableName].columns.map((column: any) => (
                                            <TableCell key={column.name}>
                                              {row[column.name] !== undefined ? String(row[column.name]) : ""}
                                            </TableCell>
                                          ))}
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              ) : (
                                <div className="text-center py-8 text-gray-400">
                                  No sample data available
                                </div>
                              )}
                            </TabsContent>
                          </Tabs>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 