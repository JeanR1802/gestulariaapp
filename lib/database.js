// lib/database.js - VERSIÓN CORREGIDA para Vercel (Sin opciones incompatibles)
import { MongoClient } from 'mongodb'

let client = null
let db = null

// Solo conecta cuando es necesario, se desconecta automáticamente
export async function connectToDatabase() {
  if (db && client) {
    try {
      // Verificar si la conexión sigue activa
      await client.db("admin").command({ ping: 1 })
      return db
    } catch (_error) {
      // Si falla el ping, resetear conexión
      client = null
      db = null
    }
  }
  
  try {
    // Configuración SIMPLIFICADA y compatible para Vercel
    const options = {
      maxPoolSize: 10, // Límite de conexiones
      serverSelectionTimeoutMS: 5000, // Timeout para seleccionar servidor
      socketTimeoutMS: 45000, // Timeout de socket
      connectTimeoutMS: 10000, // Timeout de conexión
      
      // Configuraciones adicionales para estabilidad
      maxIdleTimeMS: 30000,
      minPoolSize: 0,
      maxConnecting: 2,
      
      // Configuración de heartbeat
      heartbeatFrequencyMS: 10000,
    }
    
    client = new MongoClient(process.env.MONGODB_URI, options)
    
    console.log('Connecting to MongoDB...')
    await client.connect()
    
    db = client.db(process.env.DB_NAME)
    
    console.log('MongoDB connected successfully')
    
    // Verificar conexión con un ping
    await db.command({ ping: 1 })
    console.log('MongoDB ping successful')
    
    return db
  } catch (error) {
    console.error('Database connection failed:', error)
    
    // Limpiar referencias en caso de error
    if (client) {
      try {
        await client.close()
      } catch (closeError) {
        console.error('Error closing client:', closeError)
      }
    }
    client = null
    db = null
    
    throw error
  }
}

// Función para cerrar conexión manualmente si es necesario
export async function closeDatabaseConnection() {
  if (client) {
    try {
      await client.close()
      console.log('MongoDB connection closed')
    } catch (error) {
      console.error('Error closing MongoDB connection:', error)
    } finally {
      client = null
      db = null
    }
  }
}

// Función para verificar el estado de la conexión
export async function checkDatabaseConnection() {
  try {
    if (!db) {
      return { connected: false, message: 'No database instance' }
    }
    
    await db.command({ ping: 1 })
    return { connected: true, message: 'Connection active' }
  } catch (error) {
    return { connected: false, message: error.message }
  }
}