export type CalendarEvent = {
  event_id: string;
  title: string;
  start: Date;
  end: Date;
  admin_id?: string;
};

export type Response<T> = {
  status: string;
  data: T;
  headers: object;
};
