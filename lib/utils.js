// lib/utils.js - Utilidades para el sistema SaaS

/**
 * Genera un slug URL-friendly desde un texto
 * @param {string} text - Texto a convertir en slug
 * @returns {string} - Slug generado
 */
export function generateSlug(text) {
  if (!text) return ''
  
  return text
    .toLowerCase()
    .normalize('NFD') // Descomponer caracteres con acentos
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos y diacríticos
    .replace(/[^a-z0-9\s-]/g, '') // Solo letras, números, espacios y guiones
    .trim()
    .replace(/\s+/g, '-') // Reemplazar espacios con guiones
    .replace(/-+/g, '-') // Remover guiones múltiples
    .replace(/^-|-$/g, '') // Remover guiones al inicio y final
}

/**
 * Valida que un slug sea válido
 * @param {string} slug - Slug a validar
 * @returns {boolean} - True si es válido
 */
export function validateSlug(slug) {
  if (!slug || typeof slug !== 'string') return false
  
  // Debe tener entre 2 y 50 caracteres
  if (slug.length < 2 || slug.length > 50) return false
  
  // Solo letras minúsculas, números y guiones
  if (!/^[a-z0-9-]+$/.test(slug)) return false
  
  // No puede empezar o terminar con guión
  if (slug.startsWith('-') || slug.endsWith('-')) return false
  
  // No puede tener guiones consecutivos
  if (slug.includes('--')) return false
  
  return true
}

/**
 * Sanitiza HTML básico para evitar XSS
 * NOTA: En producción usar una librería como DOMPurify
 * @param {string} html - HTML a sanitizar
 * @returns {string} - HTML sanitizado
 */
export function sanitizeHTML(html) {
  if (!html || typeof html !== 'string') return ''
  
  return html
    // Remover scripts
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remover event handlers
    .replace(/\son\w+\s*=\s*["'][^"']*["']/gi, '')
    // Remover javascript: URLs
    .replace(/javascript\s*:/gi, 'blocked:')
    // Remover data URLs que podrían ser maliciosos
    .replace(/data\s*:\s*text\/html/gi, 'blocked:text/html')
}

/**
 * Formatea una fecha en español
 * @param {Date|string} date - Fecha a formatear
 * @param {Object} options - Opciones de formato
 * @returns {string} - Fecha formateada
 */
export function formatDate(date, options = {}) {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  }
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return new Intl.DateTimeFormat('es-ES', defaultOptions).format(dateObj)
  } catch (error) {
    return 'Fecha inválida'
  }
}

/**
 * Formatea fecha con hora
 * @param {Date|string} date - Fecha a formatear
 * @returns {string} - Fecha y hora formateadas
 */
export function formatDateTime(date) {
  return formatDate(date, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Valida un email
 * @param {string} email - Email a validar
 * @returns {boolean} - True si es válido
 */
export function validateEmail(email) {
  if (!email || typeof email !== 'string') return false
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

/**
 * Genera un ID único corto
 * @param {number} length - Longitud del ID (default: 8)
 * @returns {string} - ID único
 */
export function generateShortId(length = 8) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  return result
}

/**
 * Trunca texto a una longitud específica
 * @param {string} text - Texto a truncar
 * @param {number} maxLength - Longitud máxima
 * @param {string} suffix - Sufijo a agregar (default: '...')
 * @returns {string} - Texto truncado
 */
export function truncateText(text, maxLength, suffix = '...') {
  if (!text || typeof text !== 'string') return ''
  
  if (text.length <= maxLength) return text
  
  return text.substring(0, maxLength - suffix.length) + suffix
}

/**
 * Capitaliza la primera letra de cada palabra
 * @param {string} text - Texto a capitalizar
 * @returns {string} - Texto capitalizado
 */
export function capitalizeWords(text) {
  if (!text || typeof text !== 'string') return ''
  
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Obtiene la extensión de un archivo
 * @param {string} filename - Nombre del archivo
 * @returns {string} - Extensión del archivo
 */
export function getFileExtension(filename) {
  if (!filename || typeof filename !== 'string') return ''
  
  const lastDot = filename.lastIndexOf('.')
  return lastDot !== -1 ? filename.substring(lastDot + 1).toLowerCase() : ''
}

/**
 * Convierte bytes a formato legible
 * @param {number} bytes - Bytes a convertir
 * @param {number} decimals - Decimales a mostrar (default: 2)
 * @returns {string} - Tamaño formateado
 */
export function formatFileSize(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i]
}

/**
 * Debounce function para optimizar búsquedas
 * @param {Function} func - Función a ejecutar
 * @param {number} wait - Tiempo de espera en ms
 * @returns {Function} - Función con debounce
 */
export function debounce(func, wait) {
  let timeout
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Copia texto al portapapeles
 * @param {string} text - Texto a copiar
 * @returns {Promise<boolean>} - True si se copió exitosamente
 */
export async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // Fallback para navegadores más antiguos
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      
      const result = document.execCommand('copy')
      textArea.remove()
      return result
    }
  } catch (error) {
    console.error('Error copying to clipboard:', error)
    return false
  }
}

/**
 * Genera un color aleatorio en formato hexadecimal
 * @returns {string} - Color en formato #RRGGBB
 */
export function generateRandomColor() {
  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
    '#8B5CF6', '#06B6D4', '#84CC16', '#F97316',
    '#EC4899', '#6366F1', '#14B8A6', '#F43F5E'
  ]
  
  return colors[Math.floor(Math.random() * colors.length)]
}

/**
 * Detecta si el usuario está en un dispositivo móvil
 * @returns {boolean} - True si es móvil
 */
export function isMobileDevice() {
  if (typeof window === 'undefined') return false
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
}

/**
 * Obtiene los parámetros de la URL
 * @returns {Object} - Objeto con los parámetros
 */
export function getUrlParams() {
  if (typeof window === 'undefined') return {}
  
  const params = new URLSearchParams(window.location.search)
  const result = {}
  
  for (const [key, value] of params.entries()) {
    result[key] = value
  }
  
  return result
}

/**
 * Genera una contraseña segura
 * @param {number} length - Longitud de la contraseña (default: 12)
 * @returns {string} - Contraseña generada
 */
export function generateSecurePassword(length = 12) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
  let password = ''
  
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length))
  }
  
  return password
}

/**
 * Valida la fortaleza de una contraseña
 * @param {string} password - Contraseña a validar
 * @returns {Object} - Objeto con score y sugerencias
 */
export function validatePasswordStrength(password) {
  if (!password) return { score: 0, message: 'Contraseña requerida' }
  
  let score = 0
  const feedback = []
  
  // Longitud
  if (password.length >= 8) score += 1
  else feedback.push('Mínimo 8 caracteres')
  
  // Minúsculas
  if (/[a-z]/.test(password)) score += 1
  else feedback.push('Incluye letras minúsculas')
  
  // Mayúsculas
  if (/[A-Z]/.test(password)) score += 1
  else feedback.push('Incluye letras mayúsculas')
  
  // Números
  if (/\d/.test(password)) score += 1
  else feedback.push('Incluye números')
  
  // Símbolos
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1
  else feedback.push('Incluye símbolos especiales')
  
  const levels = ['Muy débil', 'Débil', 'Regular', 'Buena', 'Muy fuerte']
  
  return {
    score,
    level: levels[score] || 'Muy débil',
    message: feedback.length > 0 ? feedback.join(', ') : 'Contraseña fuerte',
    isStrong: score >= 4
  }
}
