export type RoomStatus = "AVAILABLE" | "OCCUPIED" | "CLEANING" | "MAINTENANCE";

export interface Room {
  id: string;
  number: string;
  type: string;
  price: number;
  status: RoomStatus;
  equipments: string[];
  created_at?: string;
  updated_at?: string;
}

