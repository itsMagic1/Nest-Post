import { Claim } from "./claims.enum";
import { Role } from "./roles.enum";

export const RoleClaimsMap: Record<Role, Claim[]> = {
  [Role.Admin]: [
    Claim.READ_USER,
    Claim.CREATE_USER,
    Claim.DELETE_USER,
    Claim.UPDATE_PROFILE,
  ],
  [Role.User]: [
    Claim.UPDATE_PROFILE,
    Claim.READ_USER
  ]
}