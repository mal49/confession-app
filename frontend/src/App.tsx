import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-4">Anonymous Confessions</h1>
      <p className="text-slate-300 mb-8">Share your secrets anonymously</p>
      <button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors">
        Submit Confession
      </button>
    </div>
  )
}

export default App
