// =============================================================================
// EVENT MANAGEMENT TYPES
// =============================================================================
// TypeScript interfaces matching the database schema for events, fleet, guests, and VAPP

// =============================================================================
// CORE EVENT TYPES
// =============================================================================

export interface Event {
  event_id: number
  name: string
  description: string
  guest_number: number
  venue: string
  fleet_capacity: number
  country: string
  vapp_capacity: number
  start_date: string
  end_date: string
  status: 'planning' | 'active' | 'completed' | 'cancelled'
  organizer_id: number
  created_at: string
  updated_at: string
  created_by: number
  updated_by?: number
}

export interface EventHotel {
  event_hotel_id: number
  event_id: number
  hotel_name: string
  hotel_address?: string
  hotel_phone?: string
  hotel_email?: string
  pickup_location?: string
  dropoff_location?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface EventDestination {
  event_destination_id: number
  event_id: number
  destination_name: string
  destination_type: 'venue' | 'hotel' | 'airport' | 'other'
  address?: string
  coordinates?: { x: number; y: number }
  distance_from_venue?: number
  is_active: boolean
  created_at: string
  updated_at: string
}

// =============================================================================
// FLEET MANAGEMENT TYPES
// =============================================================================

export interface FleetCommissioning {
  commissioning_id: number
  event_id: number
  rental_company: string
  plate_number: string
  vehicle_type: string
  vehicle_model?: string
  vehicle_capacity: number
  commissioning_date: string
  return_date: string
  daily_rate: number
  total_cost?: number
  status: 'commissioned' | 'active' | 'returned' | 'cancelled'
  notes?: string
  created_at: string
  updated_at: string
  created_by: number
}

export interface FleetId {
  fleet_id: number
  event_id: number
  commissioning_id: number
  fleet_code: string
  fleet_name?: string
  is_active: boolean
  assigned_driver_id?: number
  current_status: 'available' | 'assigned' | 'in_use' | 'maintenance' | 'out_of_service'
  created_at: string
  updated_at: string
  created_by: number
}

export interface FleetAssignment {
  assignment_id: number
  event_id: number
  fleet_id: number
  assignment_type: 'airport_pickup' | 'airport_dropoff' | 'hotel_transfer' | 'venue_transfer' | 'other'
  pickup_location: string
  dropoff_location: string
  scheduled_time: string
  estimated_duration?: string
  passenger_count: number
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  driver_notes?: string
  created_at: string
  updated_at: string
  created_by: number
}

// =============================================================================
// GUEST AND PASSENGER MANAGEMENT TYPES
// =============================================================================

export interface Guest {
  guest_id: number
  event_id: number
  first_name: string
  last_name: string
  email?: string
  phone?: string
  nationality?: string
  passport_number?: string
  hotel_name?: string
  room_number?: string
  arrival_date?: string
  departure_date?: string
  flight_number_arrival?: string
  flight_number_departure?: string
  arrival_time?: string
  departure_time?: string
  special_requirements?: string
  status: 'registered' | 'arrived' | 'in_transit' | 'departed' | 'cancelled'
  created_at: string
  updated_at: string
  created_by: number
}

export interface GuestTransportStatus {
  status_id: number
  guest_id: number
  fleet_assignment_id?: number
  status: 'waiting' | 'picked_up' | 'in_transit' | 'arrived' | 'cancelled'
  location?: string
  timestamp: string
  updated_by: number
  notes?: string
}

// =============================================================================
// VAPP (VEHICLE ACCESS PERMISSION) TYPES
// =============================================================================

export interface VappPermission {
  vapp_id: number
  event_id: number
  fleet_id: number
  permission_type: 'airport_access' | 'venue_access' | 'hotel_access' | 'restricted_area' | 'other'
  area_description?: string
  valid_from: string
  valid_until: string
  status: 'pending' | 'approved' | 'rejected' | 'expired' | 'cancelled'
  approved_by?: number
  approved_at?: string
  notes?: string
  created_at: string
  updated_at: string
  created_by: number
}

// =============================================================================
// VIEW TYPES (DATABASE VIEWS)
// =============================================================================

export interface EventSummary {
  event_id: number
  name: string
  description: string
  guest_number: number
  venue: string
  fleet_capacity: number
  country: string
  vapp_capacity: number
  start_date: string
  end_date: string
  status: string
  organizer_id: number
  created_at: string
  hotel_count: number
  destination_count: number
  commissioned_vehicles: number
  active_fleets: number
}

export interface FleetStatus {
  event_id: number
  event_name: string
  plate_number: string
  fleet_code: string
  fleet_name?: string
  current_status: string
  vehicle_type: string
  vehicle_capacity: number
  rental_company: string
  commissioning_date: string
  return_date: string
}

export interface GuestTransportOverview {
  event_id: number
  event_name: string
  first_name: string
  last_name: string
  hotel_name?: string
  flight_number_arrival?: string
  flight_number_departure?: string
  transport_status?: string
  location?: string
  last_update?: string
}

// =============================================================================
// FRONTEND-SPECIFIC TYPES
// =============================================================================

export interface CreateEventRequest {
  name: string
  description: string
  guest_number: number
  venue: string
  fleet_capacity: number
  country: string
  vapp_capacity: number
  start_date: string
  end_date: string
  organizer_id: number
}

export interface UpdateEventRequest extends Partial<CreateEventRequest> {
  event_id: number
  status?: string
}

export interface CreateFleetCommissioningRequest {
  event_id: number
  rental_company: string
  plate_number: string
  vehicle_type: string
  vehicle_model?: string
  vehicle_capacity: number
  commissioning_date: string
  return_date: string
  daily_rate: number
  notes?: string
}

export interface CreateFleetIdRequest {
  event_id: number
  commissioning_id: number
  fleet_code: string
  fleet_name?: string
  assigned_driver_id?: number
}

export interface CreateGuestRequest {
  event_id: number
  first_name: string
  last_name: string
  email?: string
  phone?: string
  nationality?: string
  passport_number?: string
  hotel_name?: string
  room_number?: string
  arrival_date?: string
  departure_date?: string
  flight_number_arrival?: string
  flight_number_departure?: string
  arrival_time?: string
  departure_time?: string
  special_requirements?: string
}

export interface CreateVappRequest {
  event_id: number
  fleet_id: number
  permission_type: string
  area_description?: string
  valid_from: string
  valid_until: string
  notes?: string
}

// =============================================================================
// RESPONSE TYPES
// =============================================================================

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// =============================================================================
// ENUM TYPES
// =============================================================================

export const EventStatus = {
  PLANNING: 'planning',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const

export const FleetStatus = {
  AVAILABLE: 'available',
  ASSIGNED: 'assigned',
  IN_USE: 'in_use',
  MAINTENANCE: 'maintenance',
  OUT_OF_SERVICE: 'out_of_service'
} as const

export const GuestStatus = {
  REGISTERED: 'registered',
  ARRIVED: 'arrived',
  IN_TRANSIT: 'in_transit',
  DEPARTED: 'departed',
  CANCELLED: 'cancelled'
} as const

export const TransportStatus = {
  WAITING: 'waiting',
  PICKED_UP: 'picked_up',
  IN_TRANSIT: 'in_transit',
  ARRIVED: 'arrived',
  CANCELLED: 'cancelled'
} as const

export const VappStatus = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  EXPIRED: 'expired',
  CANCELLED: 'cancelled'
} as const

// =============================================================================
// UTILITY TYPES
// =============================================================================

export type EventStatusType = typeof EventStatus[keyof typeof EventStatus]
export type FleetStatusType = typeof FleetStatus[keyof typeof FleetStatus]
export type GuestStatusType = typeof GuestStatus[keyof typeof GuestStatus]
export type TransportStatusType = typeof TransportStatus[keyof typeof TransportStatus]
export type VappStatusType = typeof VappStatus[keyof typeof VappStatus]
