import { Database, Zap, Shield, BarChart3 } from "lucide-react"

export function ChatGPTWelcome() {
  const features = [
    {
      icon: Database,
      title: "Natural Language Queries",
      description: "Ask questions about your data in plain English",
    },
    {
      icon: Zap,
      title: "Instant SQL Generation",
      description: "Get optimized SQL queries generated automatically",
    },
    {
      icon: Shield,
      title: "Secure & Compliant",
      description: "Role-based access with enterprise security",
    },
    {
      icon: BarChart3,
      title: "Visual Results",
      description: "See your data in clean, readable tables",
    },
  ]

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-light text-white mb-8">Ready when you are.</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {features.map((feature, index) => (
            <div key={index} className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
              <feature.icon className="h-6 w-6 text-blue-400 mb-3 mx-auto" />
              <h3 className="text-white font-medium mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
