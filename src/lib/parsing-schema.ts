import { z } from 'zod'

// =============================================================================
// BASE PARSING SCHEMAS
// =============================================================================

/**
 * Base schema for all parsed data with common fields
 */
export const BaseParsedDataSchema = z.object({
  id: z.string().optional(),
  source: z.string().describe('Source of the parsed data'),
  timestamp: z.date().default(() => new Date()),
  rawData: z.string().describe('Original raw data before parsing'),
  parsedAt: z.date().default(() => new Date()),
  confidence: z.number().min(0).max(1).default(0.8).describe('Confidence score of parsing accuracy'),
  errors: z.array(z.string()).default([]).describe('Any parsing errors encountered'),
  warnings: z.array(z.string()).default([]).describe('Any parsing warnings'),
})

// =============================================================================
// EVENT MANAGEMENT SCHEMAS
// =============================================================================

/**
 * Event data parsing schema
 */
export const EventParsingSchema = z.object({
  ...BaseParsedDataSchema.shape,
  eventId: z.string().describe('Unique event identifier'),
  eventName: z.string().describe('Name of the event'),
  eventType: z.enum(['conference', 'meeting', 'travel', 'training', 'other']),
  startDate: z.date().describe('Event start date'),
  endDate: z.date().describe('Event end date'),
  location: z.string().optional().describe('Event location'),
  description: z.string().optional().describe('Event description'),
  status: z.enum(['planned', 'active', 'completed', 'cancelled']).default('planned'),
  priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  attendees: z.array(z.string()).default([]).describe('List of attendee IDs'),
  budget: z.number().optional().describe('Event budget'),
  organizer: z.string().describe('Event organizer ID'),
})

/**
 * Event accommodation parsing schema
 */
export const EventAccommodationSchema = z.object({
  ...BaseParsedDataSchema.shape,
  eventId: z.string().describe('Associated event ID'),
  accommodationId: z.string().describe('Unique accommodation identifier'),
  hotelName: z.string().describe('Hotel name'),
  address: z.string().describe('Hotel address'),
  checkInDate: z.date().describe('Check-in date'),
  checkOutDate: z.date().describe('Check-out date'),
  roomType: z.string().describe('Type of room'),
  roomNumber: z.string().optional().describe('Room number'),
  guestCount: z.number().min(1).describe('Number of guests'),
  status: z.enum(['reserved', 'confirmed', 'checked-in', 'checked-out', 'cancelled']),
  cost: z.number().optional().describe('Accommodation cost'),
  specialRequests: z.string().optional().describe('Special accommodation requests'),
})

// =============================================================================
// PASSENGER MANAGEMENT SCHEMAS
// =============================================================================

/**
 * Passenger data parsing schema
 */
export const PassengerParsingSchema = z.object({
  ...BaseParsedDataSchema.shape,
  passengerId: z.string().describe('Unique passenger identifier'),
  firstName: z.string().describe('Passenger first name'),
  lastName: z.string().describe('Passenger last name'),
  dateOfBirth: z.date().describe('Passenger date of birth'),
  nationality: z.string().describe('Passenger nationality'),
  passportNumber: z.string().optional().describe('Passport number'),
  passportExpiry: z.date().optional().describe('Passport expiry date'),
  visaNumber: z.string().optional().describe('Visa number'),
  visaExpiry: z.date().optional().describe('Visa expiry date'),
  contactPhone: z.string().optional().describe('Contact phone number'),
  contactEmail: z.string().email().optional().describe('Contact email'),
  emergencyContact: z.object({
    name: z.string(),
    relationship: z.string(),
    phone: z.string(),
    email: z.string().email().optional(),
  }).optional(),
  dietaryRestrictions: z.array(z.string()).default([]).describe('Dietary restrictions'),
  medicalConditions: z.array(z.string()).default([]).describe('Medical conditions'),
  specialAssistance: z.boolean().default(false).describe('Requires special assistance'),
  status: z.enum(['active', 'inactive', 'suspended']).default('active'),
})

// =============================================================================
// FLEET MANAGEMENT SCHEMAS
// =============================================================================

/**
 * Vehicle data parsing schema
 */
export const VehicleParsingSchema = z.object({
  ...BaseParsedDataSchema.shape,
  vehicleId: z.string().describe('Unique vehicle identifier'),
  registrationNumber: z.string().describe('Vehicle registration number'),
  make: z.string().describe('Vehicle make'),
  model: z.string().describe('Vehicle model'),
  year: z.number().min(1900).max(new Date().getFullYear() + 1).describe('Vehicle year'),
  color: z.string().describe('Vehicle color'),
  capacity: z.number().min(1).describe('Passenger capacity'),
  fuelType: z.enum(['petrol', 'diesel', 'electric', 'hybrid', 'other']).describe('Fuel type'),
  transmission: z.enum(['manual', 'automatic']).describe('Transmission type'),
  status: z.enum(['available', 'in-use', 'maintenance', 'out-of-service']).default('available'),
  lastMaintenance: z.date().optional().describe('Last maintenance date'),
  nextMaintenance: z.date().optional().describe('Next maintenance due date'),
  mileage: z.number().min(0).describe('Current mileage'),
  fuelLevel: z.number().min(0).max(100).optional().describe('Current fuel level percentage'),
  location: z.string().optional().describe('Current vehicle location'),
  assignedDriver: z.string().optional().describe('Currently assigned driver ID'),
})

/**
 * Driver data parsing schema
 */
export const DriverParsingSchema = z.object({
  ...BaseParsedDataSchema.shape,
  driverId: z.string().describe('Unique driver identifier'),
  employeeId: z.string().describe('Employee ID'),
  firstName: z.string().describe('Driver first name'),
  lastName: z.string().describe('Driver last name'),
  dateOfBirth: z.date().describe('Driver date of birth'),
  licenseNumber: z.string().describe('Driver license number'),
  licenseType: z.enum(['A', 'B', 'C', 'D', 'E']).describe('License type'),
  licenseExpiry: z.date().describe('License expiry date'),
  experienceYears: z.number().min(0).describe('Years of driving experience'),
  contactPhone: z.string().describe('Contact phone number'),
  contactEmail: z.string().email().describe('Contact email'),
  emergencyContact: z.object({
    name: z.string(),
    relationship: z.string(),
    phone: z.string(),
    email: z.string().email().optional(),
  }).describe('Emergency contact information'),
  medicalCertificate: z.object({
    number: z.string(),
    expiryDate: z.date(),
    issuingAuthority: z.string(),
  }).optional().describe('Medical certificate details'),
  status: z.enum(['active', 'inactive', 'suspended', 'on-leave']).default('active'),
  assignedVehicle: z.string().optional().describe('Currently assigned vehicle ID'),
  currentLocation: z.string().optional().describe('Current driver location'),
})

// =============================================================================
// TRANSPORT SCHEDULE SCHEMAS
// =============================================================================

/**
 * Transport schedule parsing schema
 */
export const TransportScheduleSchema = z.object({
  ...BaseParsedDataSchema.shape,
  scheduleId: z.string().describe('Unique schedule identifier'),
  eventId: z.string().describe('Associated event ID'),
  routeName: z.string().describe('Route name or description'),
  departureLocation: z.string().describe('Departure location'),
  arrivalLocation: z.string().describe('Arrival location'),
  departureTime: z.date().describe('Scheduled departure time'),
  arrivalTime: z.date().describe('Scheduled arrival time'),
  vehicleId: z.string().optional().describe('Assigned vehicle ID'),
  driverId: z.string().optional().describe('Assigned driver ID'),
  passengerCount: z.number().min(0).describe('Number of passengers'),
  maxCapacity: z.number().min(1).describe('Maximum passenger capacity'),
  status: z.enum(['scheduled', 'in-progress', 'completed', 'cancelled', 'delayed']).default('scheduled'),
  delayMinutes: z.number().min(0).default(0).describe('Delay in minutes'),
  notes: z.string().optional().describe('Additional notes'),
  specialInstructions: z.string().optional().describe('Special instructions for driver'),
})

// =============================================================================
// FLIGHT SCHEDULE SCHEMAS
// =============================================================================

/**
 * Flight schedule parsing schema
 */
export const FlightScheduleSchema = z.object({
  ...BaseParsedDataSchema.shape,
  flightId: z.string().describe('Unique flight identifier'),
  eventId: z.string().describe('Associated event ID'),
  airline: z.string().describe('Airline name'),
  flightNumber: z.string().describe('Flight number'),
  departureAirport: z.string().describe('Departure airport code'),
  arrivalAirport: z.string().describe('Arrival airport code'),
  departureTime: z.date().describe('Scheduled departure time'),
  arrivalTime: z.date().describe('Scheduled arrival time'),
  aircraftType: z.string().optional().describe('Aircraft type'),
  seatClass: z.enum(['economy', 'business', 'first']).default('economy'),
  passengerCount: z.number().min(1).describe('Number of passengers'),
  status: z.enum(['scheduled', 'boarding', 'departed', 'arrived', 'cancelled', 'delayed']).default('scheduled'),
  gate: z.string().optional().describe('Departure gate'),
  terminal: z.string().optional().describe('Terminal number'),
  baggageClaim: z.string().optional().describe('Baggage claim information'),
  delayMinutes: z.number().min(0).default(0).describe('Delay in minutes'),
  cancellationReason: z.string().optional().describe('Reason for cancellation if applicable'),
})

// =============================================================================
// HOTEL TRANSPORTATION SCHEMAS
// =============================================================================

/**
 * Hotel transportation parsing schema
 */
export const HotelTransportationSchema = z.object({
  ...BaseParsedDataSchema.shape,
  transportationId: z.string().describe('Unique transportation identifier'),
  eventId: z.string().describe('Associated event ID'),
  hotelName: z.string().describe('Hotel name'),
  hotelAddress: z.string().describe('Hotel address'),
  pickupTime: z.date().describe('Scheduled pickup time'),
  dropoffTime: z.date().describe('Scheduled dropoff time'),
  vehicleId: z.string().optional().describe('Assigned vehicle ID'),
  driverId: z.string().optional().describe('Assigned driver ID'),
  passengerCount: z.number().min(1).describe('Number of passengers'),
  pickupLocation: z.string().describe('Pickup location'),
  dropoffLocation: z.string().describe('Dropoff location'),
  status: z.enum(['scheduled', 'in-progress', 'completed', 'cancelled']).default('scheduled'),
  specialRequests: z.string().optional().describe('Special transportation requests'),
  notes: z.string().optional().describe('Additional notes'),
})

// =============================================================================
// TASK MANAGEMENT SCHEMAS
// =============================================================================

/**
 * Task data parsing schema
 */
export const TaskParsingSchema = z.object({
  ...BaseParsedDataSchema.shape,
  taskId: z.string().describe('Unique task identifier'),
  eventId: z.string().describe('Associated event ID'),
  title: z.string().describe('Task title'),
  description: z.string().describe('Task description'),
  assignedTo: z.string().describe('Assigned user ID'),
  assignedBy: z.string().describe('User who assigned the task'),
  priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  status: z.enum(['pending', 'in-progress', 'completed', 'cancelled', 'on-hold']).default('pending'),
  dueDate: z.date().describe('Task due date'),
  startDate: z.date().optional().describe('Task start date'),
  completionDate: z.date().optional().describe('Task completion date'),
  estimatedHours: z.number().min(0).optional().describe('Estimated hours to complete'),
  actualHours: z.number().min(0).optional().describe('Actual hours spent'),
  dependencies: z.array(z.string()).default([]).describe('Dependent task IDs'),
  tags: z.array(z.string()).default([]).describe('Task tags'),
  attachments: z.array(z.string()).default([]).describe('Attachment file IDs'),
  notes: z.string().optional().describe('Additional notes'),
})

// =============================================================================
// DOCUMENT MANAGEMENT SCHEMAS
// =============================================================================

/**
 * Document parsing schema
 */
export const DocumentParsingSchema = z.object({
  ...BaseParsedDataSchema.shape,
  documentId: z.string().describe('Unique document identifier'),
  eventId: z.string().describe('Associated event ID'),
  title: z.string().describe('Document title'),
  description: z.string().optional().describe('Document description'),
  fileName: z.string().describe('Original file name'),
  filePath: z.string().describe('File storage path'),
  fileSize: z.number().min(0).describe('File size in bytes'),
  mimeType: z.string().describe('File MIME type'),
  category: z.enum(['passport', 'visa', 'ticket', 'invoice', 'contract', 'other']).describe('Document category'),
  status: z.enum(['draft', 'pending', 'approved', 'rejected', 'expired']).default('pending'),
  uploadedBy: z.string().describe('User who uploaded the document'),
  uploadedAt: z.date().describe('Upload timestamp'),
  expiryDate: z.date().optional().describe('Document expiry date'),
  tags: z.array(z.string()).default([]).describe('Document tags'),
  version: z.string().default('1.0').describe('Document version'),
  isPublic: z.boolean().default(false).describe('Whether document is publicly accessible'),
})

// =============================================================================
// VISA MANAGEMENT SCHEMAS
// =============================================================================

/**
 * Visa data parsing schema
 */
export const VisaParsingSchema = z.object({
  ...BaseParsedDataSchema.shape,
  visaId: z.string().describe('Unique visa identifier'),
  eventId: z.string().describe('Associated event ID'),
  passengerId: z.string().describe('Associated passenger ID'),
  visaType: z.enum(['tourist', 'business', 'work', 'student', 'transit', 'other']).describe('Visa type'),
  country: z.string().describe('Visa issuing country'),
  visaNumber: z.string().describe('Visa number'),
  issueDate: z.date().describe('Visa issue date'),
  expiryDate: z.date().describe('Visa expiry date'),
  entryType: z.enum(['single', 'double', 'multiple']).describe('Entry type'),
  status: z.enum(['pending', 'approved', 'rejected', 'expired', 'cancelled']).default('pending'),
  processingTime: z.number().min(0).optional().describe('Processing time in days'),
  cost: z.number().min(0).optional().describe('Visa cost'),
  requirements: z.array(z.string()).default([]).describe('Visa requirements'),
  notes: z.string().optional().describe('Additional notes'),
  applicationDate: z.date().optional().describe('Application submission date'),
  approvalDate: z.date().optional().describe('Approval date'),
})

// =============================================================================
// AAD (ARRIVAL AND DEPARTURE) SCHEMAS
// =============================================================================

/**
 * AAD data parsing schema
 */
export const AADParsingSchema = z.object({
  ...BaseParsedDataSchema.shape,
  aadId: z.string().describe('Unique AAD identifier'),
  eventId: z.string().describe('Associated event ID'),
  passengerId: z.string().describe('Associated passenger ID'),
  arrivalDate: z.date().describe('Arrival date'),
  departureDate: z.date().describe('Departure date'),
  arrivalTime: z.string().describe('Arrival time'),
  departureTime: z.string().describe('Departure time'),
  arrivalLocation: z.string().describe('Arrival location'),
  departureLocation: z.string().describe('Departure location'),
  transportMode: z.enum(['air', 'land', 'sea']).describe('Transport mode'),
  status: z.enum(['scheduled', 'in-progress', 'completed', 'cancelled', 'delayed']).default('scheduled'),
  delayMinutes: z.number().min(0).default(0).describe('Delay in minutes'),
  notes: z.string().optional().describe('Additional notes'),
  specialAssistance: z.boolean().default(false).describe('Requires special assistance'),
})

// =============================================================================
// STAFF STATISTICS SCHEMAS
// =============================================================================

/**
 * Staff statistics parsing schema
 */
export const StaffStatisticsSchema = z.object({
  ...BaseParsedDataSchema.shape,
  statisticsId: z.string().describe('Unique statistics identifier'),
  eventId: z.string().describe('Associated event ID'),
  date: z.date().describe('Statistics date'),
  totalStaff: z.number().min(0).describe('Total staff count'),
  presentStaff: z.number().min(0).describe('Present staff count'),
  absentStaff: z.number().min(0).describe('Absent staff count'),
  onLeaveStaff: z.number().min(0).describe('Staff on leave count'),
  sickStaff: z.number().min(0).describe('Sick staff count'),
  overtimeHours: z.number().min(0).describe('Total overtime hours'),
  departmentBreakdown: z.record(z.string(), z.number()).default({}).describe('Staff count by department'),
  notes: z.string().optional().describe('Additional notes'),
})

// =============================================================================
// TRANSPORT REPORTS SCHEMAS
// =============================================================================

/**
 * Transport report parsing schema
 */
export const TransportReportSchema = z.object({
  ...BaseParsedDataSchema.shape,
  reportId: z.string().describe('Unique report identifier'),
  eventId: z.string().describe('Associated event ID'),
  reportDate: z.date().describe('Report date'),
  reportType: z.enum(['daily', 'weekly', 'monthly', 'incident', 'summary']).describe('Report type'),
  totalTrips: z.number().min(0).describe('Total trips completed'),
  totalPassengers: z.number().min(0).describe('Total passengers transported'),
  totalDistance: z.number().min(0).describe('Total distance covered in km'),
  totalFuelUsed: z.number().min(0).describe('Total fuel used in liters'),
  totalCost: z.number().min(0).describe('Total transport cost'),
  incidents: z.array(z.object({
    description: z.string(),
    severity: z.enum(['low', 'medium', 'high', 'critical']),
    resolution: z.string().optional(),
  })).default([]).describe('Transport incidents'),
  vehicleUtilization: z.record(z.string(), z.number()).default({}).describe('Vehicle utilization by vehicle ID'),
  driverPerformance: z.record(z.string(), z.object({
    trips: z.number(),
    passengers: z.number(),
    distance: z.number(),
    incidents: z.number(),
  })).default({}).describe('Driver performance metrics'),
  notes: z.string().optional().describe('Additional notes'),
})

// =============================================================================
// VAPP (VEHICLE ASSIGNMENT AND PASSENGER PLANNING) SCHEMAS
// =============================================================================

/**
 * VAPP data parsing schema
 */
export const VAPPSchema = z.object({
  ...BaseParsedDataSchema.shape,
  vappId: z.string().describe('Unique VAPP identifier'),
  eventId: z.string().describe('Associated event ID'),
  vehicleId: z.string().describe('Assigned vehicle ID'),
  driverId: z.string().describe('Assigned driver ID'),
  route: z.object({
    startLocation: z.string(),
    endLocation: z.string(),
    waypoints: z.array(z.string()).default([]),
    estimatedDistance: z.number().min(0),
    estimatedDuration: z.number().min(0),
  }).describe('Route information'),
  schedule: z.object({
    departureTime: z.date(),
    arrivalTime: z.date(),
    pickupStops: z.array(z.object({
      location: z.string(),
      time: z.date(),
      passengers: z.array(z.string()),
    })).default([]),
    dropoffStops: z.array(z.object({
      location: z.string(),
      time: z.date(),
      passengers: z.array(z.string()),
    })).default([]),
  }).describe('Schedule information'),
  passengers: z.array(z.string()).default([]).describe('Assigned passenger IDs'),
  status: z.enum(['planned', 'in-progress', 'completed', 'cancelled']).default('planned'),
  notes: z.string().optional().describe('Additional notes'),
})

// =============================================================================
// SHUTTLE SYSTEM SCHEMAS
// =============================================================================

/**
 * Shuttle system parsing schema
 */
export const ShuttleSystemSchema = z.object({
  ...BaseParsedDataSchema.shape,
  shuttleId: z.string().describe('Unique shuttle identifier'),
  eventId: z.string().describe('Associated event ID'),
  routeName: z.string().describe('Shuttle route name'),
  vehicleId: z.string().describe('Assigned vehicle ID'),
  driverId: z.string().describe('Assigned driver ID'),
  schedule: z.object({
    startTime: z.date(),
    endTime: z.date(),
    frequency: z.number().min(1).describe('Frequency in minutes'),
    stops: z.array(z.object({
      location: z.string(),
      time: z.date(),
      passengers: z.array(z.string()),
    })).default([]),
  }).describe('Shuttle schedule'),
  capacity: z.number().min(1).describe('Shuttle capacity'),
  currentPassengers: z.number().min(0).describe('Current passenger count'),
  status: z.enum(['active', 'inactive', 'maintenance']).default('active'),
  notes: z.string().optional().describe('Additional notes'),
})

// =============================================================================
// PARSING RESULT SCHEMAS
// =============================================================================

/**
 * Generic parsing result schema
 */
export const ParsingResultSchema = z.object({
  success: z.boolean().describe('Whether parsing was successful'),
  data: z.union([
    EventParsingSchema,
    EventAccommodationSchema,
    PassengerParsingSchema,
    VehicleParsingSchema,
    DriverParsingSchema,
    TransportScheduleSchema,
    FlightScheduleSchema,
    HotelTransportationSchema,
    TaskParsingSchema,
    DocumentParsingSchema,
    VisaParsingSchema,
    AADParsingSchema,
    StaffStatisticsSchema,
    TransportReportSchema,
    VAPPSchema,
    ShuttleSystemSchema,
  ]).optional().describe('Parsed data if successful'),
  errors: z.array(z.string()).default([]).describe('Parsing errors'),
  warnings: z.array(z.string()).default([]).describe('Parsing warnings'),
  metadata: z.object({
    parsingTime: z.number().describe('Time taken to parse in milliseconds'),
    sourceFormat: z.string().describe('Source data format'),
    parserVersion: z.string().describe('Parser version used'),
    confidence: z.number().min(0).max(1).describe('Overall confidence score'),
  }).describe('Parsing metadata'),
})

// =============================================================================
// PARSING CONFIGURATION SCHEMAS
// =============================================================================

/**
 * Parser configuration schema
 */
export const ParserConfigSchema = z.object({
  parserId: z.string().describe('Unique parser identifier'),
  name: z.string().describe('Parser name'),
  description: z.string().describe('Parser description'),
  version: z.string().describe('Parser version'),
  supportedFormats: z.array(z.string()).describe('Supported input formats'),
  outputSchemas: z.array(z.string()).describe('Supported output schemas'),
  validationRules: z.record(z.string(), z.any()).default({}).describe('Validation rules'),
  transformationRules: z.record(z.string(), z.any()).default({}).describe('Transformation rules'),
  errorHandling: z.object({
    continueOnError: z.boolean().default(false).describe('Continue parsing on errors'),
    maxErrors: z.number().min(0).default(10).describe('Maximum errors before stopping'),
    errorThreshold: z.number().min(0).max(1).default(0.1).describe('Error threshold ratio'),
  }).describe('Error handling configuration'),
  performance: z.object({
    timeout: z.number().min(1000).default(30000).describe('Parsing timeout in milliseconds'),
    maxFileSize: z.number().min(0).default(10485760).describe('Maximum file size in bytes'),
    batchSize: z.number().min(1).default(100).describe('Batch processing size'),
  }).describe('Performance configuration'),
  isActive: z.boolean().default(true).describe('Whether parser is active'),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
})

// =============================================================================
// EXPORT ALL SCHEMAS
// =============================================================================

export const ParsingSchemas = {
  // Base schemas
  BaseParsedData: BaseParsedDataSchema,
  
  // Event management
  Event: EventParsingSchema,
  EventAccommodation: EventAccommodationSchema,
  
  // Passenger management
  Passenger: PassengerParsingSchema,
  
  // Fleet management
  Vehicle: VehicleParsingSchema,
  Driver: DriverParsingSchema,
  
  // Transport schedules
  TransportSchedule: TransportScheduleSchema,
  FlightSchedule: FlightScheduleSchema,
  HotelTransportation: HotelTransportationSchema,
  
  // Task management
  Task: TaskParsingSchema,
  
  // Document management
  Document: DocumentParsingSchema,
  
  // Visa management
  Visa: VisaParsingSchema,
  
  // AAD management
  AAD: AADParsingSchema,
  
  // Statistics and reports
  StaffStatistics: StaffStatisticsSchema,
  TransportReport: TransportReportSchema,
  
  // Planning and coordination
  VAPP: VAPPSchema,
  ShuttleSystem: ShuttleSystemSchema,
  
  // Results and configuration
  ParsingResult: ParsingResultSchema,
  ParserConfig: ParserConfigSchema,
}

// Type exports for use in components
export type BaseParsedData = z.infer<typeof BaseParsedDataSchema>
export type EventData = z.infer<typeof EventParsingSchema>
export type PassengerData = z.infer<typeof PassengerParsingSchema>
export type VehicleData = z.infer<typeof VehicleParsingSchema>
export type DriverData = z.infer<typeof DriverParsingSchema>
export type TransportScheduleData = z.infer<typeof TransportScheduleSchema>
export type FlightScheduleData = z.infer<typeof FlightScheduleSchema>
export type TaskData = z.infer<typeof TaskParsingSchema>
export type DocumentData = z.infer<typeof DocumentParsingSchema>
export type VisaData = z.infer<typeof VisaParsingSchema>
export type ParsingResult = z.infer<typeof ParsingResultSchema>
export type ParserConfig = z.infer<typeof ParserConfigSchema>
