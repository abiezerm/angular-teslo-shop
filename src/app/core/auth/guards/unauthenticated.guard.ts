import { inject } from "@angular/core";
import { CanMatchFn, Route, Router, UrlSegment } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { firstValueFrom } from "rxjs/internal/firstValueFrom";

export const UnauthenticatedGuard: CanMatchFn = async (route: Route, segments: UrlSegment[]) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthenticated = await firstValueFrom( authService.checkStatus());

  console.log("UnauthenticatedGuard called");

  if (isAuthenticated) {
    // If the user is authenticated, redirect to the home page
    await router.navigateByUrl('/');
    return false;
  }

  return true;
}
