import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import {AuthGuardData, createAuthGuard} from 'keycloak-angular';
import {inject} from '@angular/core';

const isAccessAllowed = async (
  route: ActivatedRouteSnapshot,
  __: RouterStateSnapshot,
  authData: AuthGuardData,
): Promise<boolean | UrlTree> => {
  const {authenticated, grantedRoles} = authData;
  const requiredRole = route.data['role'];
  if (!requiredRole) {
    return false;
  }

  const hasRequiredRole = (role: string): boolean =>
    Object.values(grantedRoles.resourceRoles).some((roles) =>
      roles.includes(role),
    );
  if (!authenticated) {
    authData.keycloak.login();
    return false;
  }
  if (authenticated && hasRequiredRole(requiredRole)) {
    return true;
  }
  const router = inject(Router);
  return router.parseUrl('/forbidden');
};

export const canActivateAuthAdminRole =
  createAuthGuard<CanActivateFn>(isAccessAllowed);
