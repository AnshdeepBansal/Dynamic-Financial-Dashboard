/**
 * Detects the API type based on the JSON structure
 * @param {Object} data - The parsed JSON data
 * @returns {string} - 'time-series', 'crypto-rates', 'generic-array', or 'unsupported'
 */
export function detectApiType(data) {
  if (!data || typeof data !== 'object') {
    return 'unsupported';
  }

  // Check for Time Series API formats (Daily, Weekly, Monthly)
  if (data['Meta Data']) {
    if (data['Time Series (Daily)']) {
      return 'time-series';
    }
    if (data['Weekly Time Series']) {
      return 'time-series';
    }
    if (data['Monthly Time Series']) {
      return 'time-series';
    }
  }

  // Check for Crypto Rates API format
  if (data.data && data.data.currency && data.data.rates) {
    return 'crypto-rates';
  }

  // Check for generic array-based APIs
  // Look for top-level arrays or nested arrays that can be used for tables
  if (Array.isArray(data)) {
    return 'generic-array';
  }

  // Check for common patterns of nested arrays
  for (const key in data) {
    if (Array.isArray(data[key]) && data[key].length > 0) {
      // Check if array contains objects (suitable for table)
      if (typeof data[key][0] === 'object' && !Array.isArray(data[key][0])) {
        return 'generic-array';
      }
    }
  }

  return 'unsupported';
}
