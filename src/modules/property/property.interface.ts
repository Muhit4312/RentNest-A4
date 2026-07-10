import { RentalStatus } from "../../../generated/prisma/enums";

export interface IPropertyPayload {
  title: string;
  description: string;
  location: string;
  rent: number;
  categoryId: string;
  bedrooms: number;
  bathrooms: number;

  images?: string[];
  isAvailable?: boolean;
}

export interface IUpdatePropertyPayload {
  title?: string;
  description?: string;
  location?: string;
  rent?: number;
  categoryId?: string;
  bedrooms?: number;
  bathrooms?: number;

  images?: string[];
  isAvailable?: boolean;
}


export interface IRentalReqStatus{
  status: RentalStatus
}

