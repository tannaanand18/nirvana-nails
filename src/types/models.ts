export type UserRole = "user" | "admin";

export type AppUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
};

export type Treatment = {
  id: string;
  name: string;
  description: string;
  price: string;
  duration?: string;
  active: boolean;
  sortOrder: number;
};

export type Offer = {
  id: string;
  title: string;
  description: string;
  discountLabel: string;
  active: boolean;
  sortOrder: number;
};

export type AppointmentStatus = "Pending" | "Approved" | "Cancelled";

export type Appointment = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  treatmentId: string;
  treatmentName: string;
  date: string;
  time: string;
  notes?: string;
  status: AppointmentStatus;
  createdAt: string;
};
