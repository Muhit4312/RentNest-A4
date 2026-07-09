export interface IRentalRequestPayload {
  propertyId: string;
  note: string;
  moveInDate: Date | string;
  message?: string;
}