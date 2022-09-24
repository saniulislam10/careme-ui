import { AccountModule } from './deshboard/settings/account/account.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserAuthStateGuard } from '../auth-guard/user-auth-state.guard';
import { PagesComponent } from './pages.component';
import { UserAuthGuard } from '../auth-guard/user-auth.guard';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'product-details',
        loadChildren: () =>
          import('./product-details/product-details.module').then(
            (m) => m.ProductDetailsModule
          ),
      },
      {
        path: 'product-details-search',
        loadChildren: () =>
          import('./product-details-search/product-details-search.module').then(
            (m) => m.ProductDetailsSearchModule
          ),
      },
      {
        path: 'registration',
        loadChildren: () =>
          import('./user/registration/registration.module').then(
            (m) => m.RegistrationModule
          ),
        data: { preload: false, delay: false },
      },
      {
        path: 'login',
        loadChildren: () =>
          import('./user/registration/registration.module').then(
            (m) => m.RegistrationModule
          ),
        data: { preload: true, delay: false },
      },
      {
        path: 'cart',
        loadChildren: () =>
          import('./user/cart/cart.module').then((m) => m.CartModule),
      },
      {
        path: 'shipping-info',
        loadChildren: () =>
          import('./user/shipping-info/shipping-info.module').then(
            (m) => m.ShippingInfoModule
          ),
      },
      {
        path: 'new-shipping-info',
        loadChildren: () =>
          import('./user/new-shopping-info/new-shopping-info.module').then(
            (m) => m.NewShoppingInfoModule
          ),
      },
      {
        path: 'success',
        loadChildren: () =>
          import('./user/order-success/order-success.module').then((m) => m.OrderSuccessModule),
      },
      {
        path: 'delivery-info',
        loadChildren: () =>
          import('./user/delivery-info/delivery-info.module').then(
            (m) => m.DeliveryInfoModule
          ),
      },
      // {
      //   path: 'payment',
      //   loadChildren: () =>
      //     import('./user/payment/payment.module').then((m) => m.PaymentModule),
      // },
      {
        path: 'new-payment',
        loadChildren: () =>
          import('./user/new-payment/new-payment.module').then((m) => m.NewPaymentModule),
      },
      {
        path: 'confirm',
        loadChildren: () =>
          import('./user/confirmation/confirmation.module').then(
            (m) => m.ConfirmationModule
          ),
      },
      {
        path: 'search-result',
        loadChildren: () =>
          import('./search-result/search-result.module').then(
            (m) => m.SearchResultModule
          ),
      },
      {
        path: 'products-list',
        loadChildren: () =>
          import('./products-list/products-list.module').then(
            (m) => m.ProductsListModule
          ),
      },
      {
        path: 'all-products',
        loadChildren: () =>
          import('./all-products/all-products.module').then(
            (m) => m.AllProductsModule
          ),
      },
      {
        path: 'dashboard',
        canActivate : [UserAuthGuard],
        loadChildren: () => import('./deshboard/deshboard.module').then((m) => m.DeshboardModule),
      },
      {
        path: 'all-collection',
        loadChildren: () =>
          import('./all-collection/all-collection.module').then(
            (m) => m.AllCollectionModule
          ),
      },
      {
        path: 'contact',
        loadChildren: () =>
          import('./user/contact/contact.module').then((m) => m.ContactModule),
      },
      {
        path: 'about-us',
        loadChildren: () =>
          import('./about-us/about-us.module').then((m) => m.AboutUsModule),
      },
      {
        path: 'privacy-policy',
        loadChildren: () =>
          import('./privacy-policy/privacy-policy.module').then(
            (m) => m.PrivacyPolicyModule
          ),
      },
      {
        path: 'return-policy',
        loadChildren: () =>
          import('./return-policy/return-policy.module').then(
            (m) => m.ReturnPolicyModule
          ),
      },
      {
        path: 'shipping-policy',
        loadChildren: () =>
          import('./shipping-policy/shipping-policy.module').then(
            (m) => m.ShippingPolicyModule
          ),
      },
      {
        path: 'terms-of-service',
        loadChildren: () =>
          import('./terms-of-service/terms-of-service.module').then(
            (m) => m.TermsOfServiceModule
          ),
      },
      {
        path: 'not-found',
        loadChildren: () =>
          import('./not-found/not-found.module').then((m) => m.NotFoundModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
