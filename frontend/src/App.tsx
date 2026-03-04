import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { healthCheck } from '@/api/client'
import './App.css'

function App() {
  const [apiStatus, setApiStatus] = useState<'checking' | 'connected' | 'error'>('checking')
  const [apiMessage, setApiMessage] = useState('')

  useEffect(() => {
    checkApiHealth()
  }, [])

  const checkApiHealth = async () => {
    setApiStatus('checking')
    const result = await healthCheck()
    
    if (result.success && result.data) {
      setApiStatus('connected')
      setApiMessage(result.data.message)
    } else {
      setApiStatus('error')
      setApiMessage(result.error || 'Unknown error')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4">
      <div className="max-w-4xl mx-auto pt-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Anonymous Confessions
          </h1>
          <p className="text-slate-300 text-lg">
            Share your secrets anonymously. No judgment, no identities.
          </p>
        </div>

        <Card className="bg-slate-800/50 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              API Status
              <Badge 
                variant={apiStatus === 'connected' ? 'default' : apiStatus === 'checking' ? 'secondary' : 'destructive'}
              >
                {apiStatus === 'connected' ? 'Connected' : apiStatus === 'checking' ? 'Checking...' : 'Error'}
              </Badge>
            </CardTitle>
            <CardDescription className="text-slate-400">
              Backend connection status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-300 mb-4">
              {apiStatus === 'connected' 
                ? `✅ API is reachable: ${apiMessage}` 
                : apiStatus === 'checking'
                ? '🔄 Checking connection...'
                : `❌ Error: ${apiMessage}`}
            </p>
            <Button onClick={checkApiHealth} variant="outline" size="sm">
              Refresh Connection
            </Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle>Submit a Confession</CardTitle>
              <CardDescription className="text-slate-400">
                Share your story anonymously
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" size="lg">
                Start Writing
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle>Admin Dashboard</CardTitle>
              <CardDescription className="text-slate-400">
                Review and moderate submissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" className="w-full" size="lg">
                Open Admin
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default App
