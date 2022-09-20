import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AdminAuthStateGuard } from './auth-guard/admin-auth-state.guard';
import { AdminAuthGuard } from './auth-guard/admin-auth.guard';
import { CustomPreloadingStrategy } from './core/utils/preloading-strategy';

const routes: Routes = [
  // ADMIN
  {
    path: environment.adminLoginUrl,
    canActivate: [AdminAuthStateGuard],
    // path:"login",
    loadChildren: () => import('./admin/admin-auth/admin-auth.module').then(m => m.AdminAuthModule)
  },
  {
    path: environment.adminBaseUrl,
    canActivate: [AdminAuthGuard],
    // path:"admin",
    loadChildren: () => import('./admin/pages/pages.module').then(m => m.PagesModule)
  },
  {
    path: '',
    loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)
  },
  {
    path: '**',
    loadChildren: () => import('./pages/not-found/not-found.module').then(m => m.NotFoundModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    preloadingStrategy: CustomPreloadingStrategy,
    relativeLinkResolution: 'legacy',
    // initialNavigation: 'enabled',
    anchorScrolling: 'enabled'
})],
providers: [CustomPreloadingStrategy, AdminAuthGuard, AdminAuthStateGuard],
  exports: [RouterModule]
})
export class AppRoutingModule { }
