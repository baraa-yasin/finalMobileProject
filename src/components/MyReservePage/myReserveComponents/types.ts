export type MoveOrder = {
  id: string;
  status?: string;
  scheduledTime?: string | number | Date;
  arrivalAt?: string | number | Date;
  pickup?: {
    address?: string;
  };
  dropoff?: {
    address?: string;
  };
  items?: {
    name?: string;
  }[];
};
