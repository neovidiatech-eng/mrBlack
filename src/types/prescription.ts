export interface PrescriptionGroup {
  id: string;
  name: string;
  sphMin: number | null;
  sphMax: number | null;
  cylMin: number | null;
  cylMax: number | null;
  axisMin: number | null;
  axisMax: number | null;
  addMin: number | null;
  addMax: number | null;
  price: string | number;
}

export interface EyePrescriptionInput {
  groupId?: string;
  sph?: number;
  cyl?: number;
  axis?: number;
  add?: number;
}

export interface PrescriptionInput {
  rightEye?: EyePrescriptionInput;
  leftEye?: EyePrescriptionInput;
  notes?: string;
  prescriptionImage?: string;
}

export interface PrescriptionResponse {
  rightEye?: EyePrescriptionInput & { groupName?: string; price?: string | number };
  leftEye?: EyePrescriptionInput & { groupName?: string; price?: string | number };
  notes?: string;
  prescriptionImage?: string;
}
