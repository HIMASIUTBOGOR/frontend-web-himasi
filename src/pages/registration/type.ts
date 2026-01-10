export type Registration = {
  id: string;
  fullname: string;
  nim: string;
  semester: number;
  no_wa: string;
  department_id?: string;
  department_name?: string;
  reason?: string;
  created_at: string;
  updated_at: string;
};

export type Menu = Registration;
