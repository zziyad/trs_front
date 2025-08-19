import { 
  ParsingSchemas, 
  ParsingResult, 
  BaseParsedData,
  EventData,
  PassengerData,
  VehicleData,
  DriverData,
  TransportScheduleData,
  FlightScheduleData,
  TaskData,
  DocumentData,
  VisaData,
  AADParsingSchema,
  StaffStatisticsSchema,
  TransportReportSchema,
  VAPPSchema,
  ShuttleSystemSchema,
  EventAccommodationSchema,
  HotelTransportationSchema
} from './parsing-schema'

// =============================================================================
// DATA PARSER UTILITY CLASS
// =============================================================================

export class DataParser {
  private config: {
    continueOnError: boolean
    maxErrors: number
    errorThreshold: number
    timeout: number
    batchSize: number
  }

  constructor(config?: Partial<DataParser['config']>) {
    this.config = {
      continueOnError: false,
      maxErrors: 10,
      errorThreshold: 0.1,
      timeout: 30000,
      batchSize: 100,
      ...config
    }
  }

  // =============================================================================
  // MAIN PARSING METHODS
  // =============================================================================

  /**
   * Parse data based on the specified schema type
   */
  async parseData<T extends keyof typeof ParsingSchemas>(
    data: string | object | any[],
    schemaType: T,
    options?: {
      source?: string
      confidence?: number
      rawData?: string
    }
  ): Promise<ParsingResult> {
    const startTime = Date.now()
    const errors: string[] = []
    const warnings: string[] = []

    try {
      // Validate timeout
      if (Date.now() - startTime > this.config.timeout) {
        throw new Error('Parsing timeout exceeded')
      }

      // Get the appropriate schema
      const schema = ParsingSchemas[schemaType]
      if (!schema) {
        throw new Error(`Unknown schema type: ${schemaType}`)
      }

      // Parse the data
      let parsedData: any
      
      if (typeof data === 'string') {
        parsedData = await this.parseStringData(data, schemaType, options)
      } else if (Array.isArray(data)) {
        parsedData = await this.parseArrayData(data, schemaType, options)
      } else if (typeof data === 'object') {
        parsedData = await this.parseObjectData(data, schemaType, options)
      } else {
        throw new Error(`Unsupported data type: ${typeof data}`)
      }

      // Validate against schema
      const validationResult = schema.safeParse(parsedData)
      
      if (!validationResult.success) {
        const schemaErrors = validationResult.error.errors.map(err => 
          `${err.path.join('.')}: ${err.message}`
        )
        errors.push(...schemaErrors)
        
        if (!this.config.continueOnError) {
          throw new Error(`Schema validation failed: ${schemaErrors.join(', ')}`)
        }
      }

      const parsingTime = Date.now() - startTime
      const confidence = this.calculateConfidence(errors, warnings, options?.confidence || 0.8)

      return {
        success: errors.length === 0,
        data: validationResult.success ? parsedData : undefined,
        errors,
        warnings,
        metadata: {
          parsingTime,
          sourceFormat: this.detectSourceFormat(data),
          parserVersion: '1.0.0',
          confidence
        }
      }

    } catch (error) {
      const parsingTime = Date.now() - startTime
      const errorMessage = error instanceof Error ? error.message : 'Unknown parsing error'
      errors.push(errorMessage)

      return {
        success: false,
        data: undefined,
        errors,
        warnings,
        metadata: {
          parsingTime,
          sourceFormat: this.detectSourceFormat(data),
          parserVersion: '1.0.0',
          confidence: 0
        }
      }
    }
  }

  /**
   * Parse CSV data
   */
  async parseCSV<T extends keyof typeof ParsingSchemas>(
    csvData: string,
    schemaType: T,
    options?: {
      hasHeader?: boolean
      delimiter?: string
      source?: string
    }
  ): Promise<ParsingResult[]> {
    const delimiter = options?.delimiter || ','
    const hasHeader = options?.hasHeader ?? true
    
    const lines = csvData.trim().split('\n')
    const results: ParsingResult[] = []
    
    let startIndex = hasHeader ? 1 : 0
    let headers: string[] = []
    
    if (hasHeader && lines.length > 0) {
      headers = lines[0].split(delimiter).map(h => h.trim())
    }

    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      const values = line.split(delimiter).map(v => v.trim())
      const rowData: Record<string, any> = {}
      
      // Map values to headers if available
      if (headers.length > 0) {
        headers.forEach((header, index) => {
          if (values[index] !== undefined) {
            rowData[header] = values[index]
          }
        })
      } else {
        // Use index-based mapping
        values.forEach((value, index) => {
          rowData[`field_${index}`] = value
        })
      }

      const result = await this.parseData(rowData, schemaType, {
        source: options?.source || 'csv',
        rawData: line
      })
      
      results.push(result)
    }

    return results
  }

  /**
   * Parse JSON data
   */
  async parseJSON<T extends keyof typeof ParsingSchemas>(
    jsonData: string | object,
    schemaType: T,
    options?: {
      source?: string
      validateSchema?: boolean
    }
  ): Promise<ParsingResult> {
    let parsedJson: any

    if (typeof jsonData === 'string') {
      try {
        parsedJson = JSON.parse(jsonData)
      } catch (error) {
        return {
          success: false,
          data: undefined,
          errors: [`Invalid JSON: ${error instanceof Error ? error.message : 'Unknown error'}`],
          warnings: [],
          metadata: {
            parsingTime: 0,
            sourceFormat: 'json',
            parserVersion: '1.0.0',
            confidence: 0
          }
        }
      }
    } else {
      parsedJson = jsonData
    }

    return this.parseData(parsedJson, schemaType, {
      source: options?.source || 'json',
      rawData: typeof jsonData === 'string' ? jsonData : JSON.stringify(jsonData)
    })
  }

  /**
   * Parse XML data
   */
  async parseXML<T extends keyof typeof ParsingSchemas>(
    xmlData: string,
    schemaType: T,
    options?: {
      source?: string
      rootElement?: string
    }
  ): Promise<ParsingResult> {
    try {
      // Simple XML to JSON conversion (for basic XML structures)
      const jsonData = this.xmlToJson(xmlData)
      return this.parseData(jsonData, schemaType, {
        source: options?.source || 'xml',
        rawData: xmlData
      })
    } catch (error) {
      return {
        success: false,
        data: undefined,
        errors: [`XML parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`],
        warnings: [],
        metadata: {
          parsingTime: 0,
          sourceFormat: 'xml',
          parserVersion: '1.0.0',
          confidence: 0
        }
      }
    }
  }

  // =============================================================================
  // SPECIALIZED PARSING METHODS
  // =============================================================================

  /**
   * Parse event data from various formats
   */
  async parseEventData(data: any, format: 'csv' | 'json' | 'xml' | 'object'): Promise<ParsingResult> {
    switch (format) {
      case 'csv':
        return this.parseCSV(data, 'Event')
      case 'json':
        return this.parseJSON(data, 'Event')
      case 'xml':
        return this.parseXML(data, 'Event')
      case 'object':
        return this.parseData(data, 'Event')
      default:
        throw new Error(`Unsupported format: ${format}`)
    }
  }

  /**
   * Parse passenger data from various formats
   */
  async parsePassengerData(data: any, format: 'csv' | 'json' | 'xml' | 'object'): Promise<ParsingResult> {
    switch (format) {
      case 'csv':
        return this.parseCSV(data, 'Passenger')
      case 'json':
        return this.parseJSON(data, 'Passenger')
      case 'xml':
        return this.parseXML(data, 'Passenger')
      case 'object':
        return this.parseData(data, 'Passenger')
      default:
        throw new Error(`Unsupported format: ${format}`)
    }
  }

  /**
   * Parse fleet management data from various formats
   */
  async parseFleetData(data: any, format: 'csv' | 'json' | 'xml' | 'object'): Promise<ParsingResult> {
    switch (format) {
      case 'csv':
        return this.parseCSV(data, 'Vehicle')
      case 'json':
        return this.parseJSON(data, 'Vehicle')
      case 'xml':
        return this.parseXML(data, 'Vehicle')
      case 'object':
        return this.parseData(data, 'Vehicle')
      default:
        throw new Error(`Unsupported format: ${format}`)
    }
  }

  // =============================================================================
  // HELPER METHODS
  // =============================================================================

  /**
   * Parse string data by detecting format and applying appropriate parser
   */
  private async parseStringData(
    data: string,
    schemaType: keyof typeof ParsingSchemas,
    options?: any
  ): Promise<any> {
    // Try to detect if it's JSON
    if (data.trim().startsWith('{') || data.trim().startsWith('[')) {
      try {
        return JSON.parse(data)
      } catch {
        // Not valid JSON, continue with other parsers
      }
    }

    // Try to detect if it's CSV
    if (data.includes(',') && data.includes('\n')) {
      return this.parseCSVString(data, schemaType, options)
    }

    // Try to detect if it's XML
    if (data.trim().startsWith('<')) {
      return this.xmlToJson(data)
    }

    // Default to line-by-line parsing
    return this.parseLineByLine(data, schemaType, options)
  }

  /**
   * Parse array data
   */
  private async parseArrayData(
    data: any[],
    schemaType: keyof typeof ParsingSchemas,
    options?: any
  ): Promise<any[]> {
    const results: any[] = []
    
    for (let i = 0; i < data.length; i += this.config.batchSize) {
      const batch = data.slice(i, i + this.config.batchSize)
      
      for (const item of batch) {
        try {
          const result = await this.parseData(item, schemaType, options)
          if (result.success && result.data) {
            results.push(result.data)
          }
        } catch (error) {
          if (!this.config.continueOnError) {
            throw error
          }
        }
      }
    }
    
    return results
  }

  /**
   * Parse object data
   */
  private async parseObjectData(
    data: object,
    schemaType: keyof typeof ParsingSchemas,
    options?: any
  ): Promise<any> {
    // Add base parsing metadata
    const baseData: BaseParsedData = {
      source: options?.source || 'object',
      timestamp: new Date(),
      rawData: options?.rawData || JSON.stringify(data),
      parsedAt: new Date(),
      confidence: options?.confidence || 0.8,
      errors: [],
      warnings: []
    }

    return {
      ...baseData,
      ...data
    }
  }

  /**
   * Parse CSV string data
   */
  private parseCSVString(data: string, schemaType: keyof typeof ParsingSchemas, options?: any): any[] {
    const lines = data.trim().split('\n')
    const results: any[] = []
    
    for (const line of lines) {
      if (!line.trim()) continue
      
      const values = line.split(',').map(v => v.trim())
      const rowData: Record<string, any> = {}
      
      // Map to schema fields based on schema type
      this.mapCSVValuesToSchema(values, schemaType, rowData)
      results.push(rowData)
    }
    
    return results
  }

  /**
   * Parse data line by line
   */
  private parseLineByLine(data: string, schemaType: keyof typeof ParsingSchemas, options?: any): any[] {
    const lines = data.trim().split('\n')
    const results: any[] = []
    
    for (const line of lines) {
      if (!line.trim()) continue
      
      try {
        const parsedLine = this.parseSingleLine(line, schemaType)
        if (parsedLine) {
          results.push(parsedLine)
        }
      } catch (error) {
        if (!this.config.continueOnError) {
          throw error
        }
      }
    }
    
    return results
  }

  /**
   * Parse a single line of data
   */
  private parseSingleLine(line: string, schemaType: keyof typeof ParsingSchemas): any {
    // This is a simplified parser - you can extend it based on your specific data formats
    const parts = line.split(/\s+/).filter(part => part.trim())
    
    switch (schemaType) {
      case 'Passenger':
        return this.parsePassengerLine(parts)
      case 'Vehicle':
        return this.parseVehicleLine(parts)
      case 'Event':
        return this.parseEventLine(parts)
      default:
        return { rawLine: line }
    }
  }

  /**
   * Parse passenger line data
   */
  private parsePassengerLine(parts: string[]): any {
    if (parts.length < 3) return null
    
    return {
      firstName: parts[0],
      lastName: parts[1],
      dateOfBirth: this.parseDate(parts[2]),
      nationality: parts[3] || '',
      passportNumber: parts[4] || '',
      contactPhone: parts[5] || '',
      contactEmail: parts[6] || ''
    }
  }

  /**
   * Parse vehicle line data
   */
  private parseVehicleLine(parts: string[]): any {
    if (parts.length < 4) return null
    
    return {
      registrationNumber: parts[0],
      make: parts[1],
      model: parts[2],
      year: parseInt(parts[3]) || new Date().getFullYear(),
      color: parts[4] || '',
      capacity: parseInt(parts[5]) || 4
    }
  }

  /**
   * Parse event line data
   */
  private parseEventLine(parts: string[]): any {
    if (parts.length < 3) return null
    
    return {
      eventName: parts[0],
      startDate: this.parseDate(parts[1]),
      endDate: this.parseDate(parts[2]),
      location: parts[3] || '',
      description: parts[4] || ''
    }
  }

  /**
   * Map CSV values to schema fields
   */
  private mapCSVValuesToSchema(values: string[], schemaType: keyof typeof ParsingSchemas, rowData: Record<string, any>): void {
    // This is a basic mapping - you can extend it based on your specific CSV structure
    switch (schemaType) {
      case 'Passenger':
        if (values.length >= 7) {
          rowData.firstName = values[0]
          rowData.lastName = values[1]
          rowData.dateOfBirth = this.parseDate(values[2])
          rowData.nationality = values[3]
          rowData.passportNumber = values[4]
          rowData.contactPhone = values[5]
          rowData.contactEmail = values[6]
        }
        break
      case 'Vehicle':
        if (values.length >= 6) {
          rowData.registrationNumber = values[0]
          rowData.make = values[1]
          rowData.model = values[2]
          rowData.year = parseInt(values[3]) || new Date().getFullYear()
          rowData.color = values[4]
          rowData.capacity = parseInt(values[5]) || 4
        }
        break
      case 'Event':
        if (values.length >= 5) {
          rowData.eventName = values[0]
          rowData.startDate = this.parseDate(values[1])
          rowData.endDate = this.parseDate(values[2])
          rowData.location = values[3]
          rowData.description = values[4]
        }
        break
      default:
        // Generic mapping
        values.forEach((value, index) => {
          rowData[`field_${index}`] = value
        })
    }
  }

  /**
   * Convert XML to JSON (basic implementation)
   */
  private xmlToJson(xml: string): any {
    // This is a simplified XML to JSON converter
    // For production use, consider using a proper XML parser library
    const result: any = {}
    
    // Remove XML declarations and comments
    xml = xml.replace(/<\?xml[^>]*\?>/g, '')
    xml = xml.replace(/<!--[\s\S]*?-->/g, '')
    
    // Simple tag parsing
    const tagRegex = /<(\w+)[^>]*>([^<]*)<\/\1>/g
    let match
    
    while ((match = tagRegex.exec(xml)) !== null) {
      const tagName = match[1]
      const tagValue = match[2].trim()
      
      if (tagValue) {
        result[tagName] = tagValue
      }
    }
    
    return result
  }

  /**
   * Parse date strings
   */
  private parseDate(dateString: string): Date | null {
    if (!dateString) return null
    
    // Try different date formats
    const dateFormats = [
      'YYYY-MM-DD',
      'DD/MM/YYYY',
      'MM/DD/YYYY',
      'YYYY/MM/DD',
      'DD-MM-YYYY',
      'MM-DD-YYYY'
    ]
    
    for (const format of dateFormats) {
      try {
        const parsed = this.parseDateWithFormat(dateString, format)
        if (parsed) return parsed
      } catch {
        continue
      }
    }
    
    // Try parsing as ISO string
    const isoDate = new Date(dateString)
    if (!isNaN(isoDate.getTime())) {
      return isoDate
    }
    
    return null
  }

  /**
   * Parse date with specific format
   */
  private parseDateWithFormat(dateString: string, format: string): Date | null {
    // Basic date format parsing
    const parts = dateString.split(/[-\/]/)
    if (parts.length !== 3) return null
    
    let year: number, month: number, day: number
    
    switch (format) {
      case 'YYYY-MM-DD':
        year = parseInt(parts[0])
        month = parseInt(parts[1]) - 1
        day = parseInt(parts[2])
        break
      case 'DD/MM/YYYY':
      case 'DD-MM-YYYY':
        day = parseInt(parts[0])
        month = parseInt(parts[1]) - 1
        year = parseInt(parts[2])
        break
      case 'MM/DD/YYYY':
      case 'MM-DD-YYYY':
        month = parseInt(parts[0]) - 1
        day = parseInt(parts[1])
        year = parseInt(parts[2])
        break
      case 'YYYY/MM/DD':
        year = parseInt(parts[0])
        month = parseInt(parts[1]) - 1
        day = parseInt(parts[2])
        break
      default:
        return null
    }
    
    if (isNaN(year) || isNaN(month) || isNaN(day)) return null
    
    const date = new Date(year, month, day)
    if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
      return null
    }
    
    return date
  }

  /**
   * Calculate confidence score
   */
  private calculateConfidence(errors: string[], warnings: string[], baseConfidence: number): number {
    let confidence = baseConfidence
    
    // Reduce confidence based on errors
    confidence -= errors.length * 0.1
    
    // Reduce confidence based on warnings
    confidence -= warnings.length * 0.05
    
    // Ensure confidence is between 0 and 1
    return Math.max(0, Math.min(1, confidence))
  }

  /**
   * Detect source format
   */
  private detectSourceFormat(data: any): string {
    if (typeof data === 'string') {
      if (data.trim().startsWith('{') || data.trim().startsWith('[')) {
        return 'json'
      }
      if (data.trim().startsWith('<')) {
        return 'xml'
      }
      if (data.includes(',') && data.includes('\n')) {
        return 'csv'
      }
      return 'text'
    }
    
    if (Array.isArray(data)) {
      return 'array'
    }
    
    if (typeof data === 'object') {
      return 'object'
    }
    
    return 'unknown'
  }

  // =============================================================================
  // BATCH PROCESSING METHODS
  // =============================================================================

  /**
   * Process multiple files in batch
   */
  async processBatch(
    files: Array<{ content: string, format: string, schemaType: keyof typeof ParsingSchemas }>,
    options?: {
      onProgress?: (completed: number, total: number) => void
      onError?: (error: Error, fileIndex: number) => void
    }
  ): Promise<Array<{ fileIndex: number, result: ParsingResult }>> {
    const results: Array<{ fileIndex: number, result: ParsingResult }> = []
    
    for (let i = 0; i < files.length; i++) {
      try {
        const file = files[i]
        let result: ParsingResult
        
        switch (file.format) {
          case 'csv':
            result = (await this.parseCSV(file.content, file.schemaType))[0] || { success: false, errors: ['No data parsed'], warnings: [], metadata: { parsingTime: 0, sourceFormat: 'csv', parserVersion: '1.0.0', confidence: 0 } }
            break
          case 'json':
            result = await this.parseJSON(file.content, file.schemaType)
            break
          case 'xml':
            result = await this.parseXML(file.content, file.schemaType)
            break
          default:
            result = await this.parseData(file.content, file.schemaType)
        }
        
        results.push({ fileIndex: i, result })
        
        if (options?.onProgress) {
          options.onProgress(i + 1, files.length)
        }
        
      } catch (error) {
        const errorResult: ParsingResult = {
          success: false,
          data: undefined,
          errors: [error instanceof Error ? error.message : 'Unknown error'],
          warnings: [],
          metadata: {
            parsingTime: 0,
            sourceFormat: files[i].format,
            parserVersion: '1.0.0',
            confidence: 0
          }
        }
        
        results.push({ fileIndex: i, result: errorResult })
        
        if (options?.onError) {
          options.onError(error instanceof Error ? error : new Error('Unknown error'), i)
        }
      }
    }
    
    return results
  }

  // =============================================================================
  // VALIDATION METHODS
  // =============================================================================

  /**
   * Validate data against a specific schema
   */
  validateData<T extends keyof typeof ParsingSchemas>(
    data: any,
    schemaType: T
  ): { isValid: boolean; errors: string[]; warnings: string[] } {
    const schema = ParsingSchemas[schemaType]
    if (!schema) {
      return {
        isValid: false,
        errors: [`Unknown schema type: ${schemaType}`],
        warnings: []
      }
    }
    
    const result = schema.safeParse(data)
    
    if (result.success) {
      return {
        isValid: true,
        errors: [],
        warnings: []
      }
    } else {
      return {
        isValid: false,
        errors: result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`),
        warnings: []
      }
    }
  }

  /**
   * Get schema information
   */
  getSchemaInfo(schemaType: keyof typeof ParsingSchemas): {
    name: string
    description: string
    fields: string[]
    requiredFields: string[]
  } {
    const schema = ParsingSchemas[schemaType]
    if (!schema) {
      throw new Error(`Unknown schema type: ${schemaType}`)
    }
    
    // Extract field information from schema
    const shape = (schema as any).shape || {}
    const fields = Object.keys(shape)
    const requiredFields = fields.filter(field => {
      const fieldSchema = shape[field]
      return fieldSchema && !fieldSchema.isOptional && !fieldSchema.default
    })
    
    return {
      name: schemaType as string,
      description: `Schema for ${schemaType}`,
      fields,
      requiredFields
    }
  }
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Create a new data parser instance
 */
export function createDataParser(config?: Partial<DataParser['config']>): DataParser {
  return new DataParser(config)
}

/**
 * Quick parse function for simple use cases
 */
export async function quickParse<T extends keyof typeof ParsingSchemas>(
  data: any,
  schemaType: T,
  options?: {
    source?: string
    confidence?: number
  }
): Promise<ParsingResult> {
  const parser = new DataParser()
  return parser.parseData(data, schemaType, options)
}

/**
 * Parse CSV data quickly
 */
export async function quickParseCSV<T extends keyof typeof ParsingSchemas>(
  csvData: string,
  schemaType: T,
  options?: {
    hasHeader?: boolean
    delimiter?: string
    source?: string
  }
): Promise<ParsingResult[]> {
  const parser = new DataParser()
  return parser.parseCSV(csvData, schemaType, options)
}

/**
 * Parse JSON data quickly
 */
export async function quickParseJSON<T extends keyof typeof ParsingSchemas>(
  jsonData: string | object,
  schemaType: T,
  options?: {
    source?: string
    validateSchema?: boolean
  }
): Promise<ParsingResult> {
  const parser = new DataParser()
  return parser.parseJSON(jsonData, schemaType, options)
}

// Export the main class and utility functions
export default DataParser
