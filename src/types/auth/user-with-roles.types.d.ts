export interface Role {
  id: string | number;
  name: string;
  guard_name?: string;
  [key: string]: unknown;
}

export interface UserWithRoles {
  id: string | number;
  email: string;
  name: string | null;
  username?: string | null;
  image?: string | null;
  profilePhotoPath?: string | null;
  roles?: Role[];
  [key: string]: unknown;
}
