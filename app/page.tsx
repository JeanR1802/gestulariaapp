// app/page.tsx - Landing Page Minimalista
export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Crea tu sitio web en minutos
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Plataforma multi-tenant optimizada para máximo rendimiento y mínimo costo
          </p>
          
          <div className="flex gap-4 justify-center">
            <a 
              href="/register" 
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Comenzar Gratis
            </a>
            <a 
              href="/login" 
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Iniciar Sesión
            </a>
          </div>
        </div>
        
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-blue-600 font-bold">⚡</span>
            </div>
            <h3 className="font-semibold mb-2">Ultra Rápido</h3>
            <p className="text-gray-600">Optimizado para velocidad y eficiencia</p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-green-600 font-bold">💰</span>
            </div>
            <h3 className="font-semibold mb-2">Costo Mínimo</h3>
            <p className="text-gray-600">Sin desperdicios de recursos</p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-purple-600 font-bold">🌐</span>
            </div>
            <h3 className="font-semibold mb-2">Multi-Tenant</h3>
            <p className="text-gray-600">Múltiples sitios desde un panel</p>
          </div>
        </div>
      </div>
    </div>
  )
}