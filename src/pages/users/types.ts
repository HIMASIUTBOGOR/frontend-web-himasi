export type UUID = `${string}-${string}-${string}-${string}-${string}`;

export type Role = {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  pivot?: any;
  permissions?: any[];
};

export type User = {
  id: UUID;
  name: string;
  email: string;
  nim: string;
  jabatan_id: string | null;
  avatar: string | null;
  roles: Role[];
  // Computed for compatibility
  fullname?: string;
  username?: string;
  role?: string;
  notes?: string;
  active?: boolean;
  projects?: any[];
};
