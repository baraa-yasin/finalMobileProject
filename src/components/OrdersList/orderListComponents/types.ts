export type OrderListItem = {
  id: string;
  status?: string;
  scheduledTime?: any;
  items?: {
    name?: string;
    quantity?: string | number;
  }[];
};
