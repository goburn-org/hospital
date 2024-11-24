import { Assessment } from '@prisma/client';

export interface PatientVisit {
  id: string;
  uhid: string;
  hospitalId: number;
  departmentId: number;
  doctorId: string;
  checkInTime: Date;
  checkOutTime: Date;
  isDeleted: boolean;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  Assessment?: Assessment;
}
