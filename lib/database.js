// lib/database.js - Conexión eficiente a BD
import { MongoClient } from 'mongodb'

let client = null
let db = null

// Solo conecta cuando es necesario, se desconecta automáticamente
export async function connectToDatabase() {
  if (db) return db
  
  try {
    client = new MongoClient(process.env.MONGODB_URI, {
      maxPoolSize: 2, // Mínimo pool para ahorrar recursos
      maxIdleTimeMS: 30000, // Se desconecta rápido cuando no se usa
      serverSelectionTimeoutMS: 5000,
    })
    
    await client.connect()
    db = client.db(process.env.DB_NAME)
    
    // Auto-desconexión después de inactividad
    setTimeout(() => {
      if (client) {
        client.close()
        client = null
        db = null
      }
    }, 60000) // 1 minuto de inactividad
    
    return db
  } catch (error) {
    console.error('Database connection failed:', error)
    throw error
  }
}
