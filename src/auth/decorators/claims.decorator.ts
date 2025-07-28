import { SetMetadata } from "@nestjs/common";
import { Claim } from "src/accesor-control/claims.enum";


export const CLAIMS_KEY = 'claims';
export const Claims = (...claims: Claim[]) => SetMetadata(CLAIMS_KEY, claims);