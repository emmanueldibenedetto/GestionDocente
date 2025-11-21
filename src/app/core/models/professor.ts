import { Roles } from "../../enums/roles";

export interface Professor
{
    id?: number;
    name: string;
    lastname: string;
    email: string;
    password?: string;
    cel: string;
    photoUrl?: string;
    createdAt?: string;
    lastLogin?: string;
    isActive?: boolean;
    role: Roles;
}
  