import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Claim } from 'src/accesor-control/claims.enum';
import { RoleClaimsMap } from 'src/accesor-control/role-claims.map';
import { CLAIMS_KEY } from 'src/auth/decorators/claims.decorator';

@Injectable()
export class ClaimsGuard implements CanActivate {

  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext,): boolean {

    const requiredClaims = this.reflector.getAllAndOverride<Claim[]>(CLAIMS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredClaims) {
      return true
    }

    const { user } = context.switchToHttp().getRequest();
    const userClaims = user.role?.flatMap((role) => RoleClaimsMap[role] ?? []);
    console.log(user);
    console.log(userClaims);
    console.log(requiredClaims.some((claim) => userClaims.includes(claim)));
    return requiredClaims.some((claim) => userClaims.includes(claim));
  }
}
