const fetch = require('node-fetch')

async function extractBuffer(url) {
 try {
  const response = await fetch(url)

  if (!response.ok) {
   throw new Error(`HTTP error! status: ${response.status}`)
  }

  const contentType = response.headers.get('content-type')

  // Check if the content type is a supported media type
  if (!contentType || !isSupportedMediaType(contentType)) {
   throw new Error(`Unsupported media type: ${contentType}`)
  }

  const buffer = await response.buffer()
  return buffer
 } catch (error) {
  console.error('Error extracting buffer:', error)
  throw error
 }
}

function isSupportedMediaType(contentType) {
 const supportedTypes = ['image/', 'video/', 'application/octet-stream', 'application/pdf', 'audio/']

 return supportedTypes.some(type => contentType.startsWith(type))
}

module.exports = extractBuffer
