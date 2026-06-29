export interface Vehicle {
    id: number;
    tenantId?: number;
    customerId: number;
    plate: string;
    brand: string;
    model: string;
    year: number;
    gear: string;             // "Manuel" | "Otomatik" | "Yarı Otomatik"
    engineCapacity: string;
    kilometer: number;
    fuelType: string;         // "Benzin" | "Dizel" | "Elektrik" | "Hibrit" | "LPG"
    isDeleted: boolean;
    createdAt?: string;
    updatedAt?: string | null;
    deletedAt?: string | null;
    status?: string;
    customerFullName?: string;
}

export interface VehicleFeature {
    id: number;
    vehicleId: number;
    featureKey: string;
    featureValue: string;
}

export const GEAR_OPTIONS  = ['Manuel', 'Otomatik', 'Yarı Otomatik'];
export const FUEL_OPTIONS  = ['Benzin', 'Dizel', 'Elektrik', 'Hibrit', 'LPG'];
