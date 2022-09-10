import { StockModule } from './stock/stock.module';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PagesComponent} from './pages.component';
import {RouterModule, Routes} from '@angular/router';
import {HeaderComponent} from './components/header/header.component';
import {SharedModule} from '../../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import {MatBadgeModule} from '@angular/material/badge';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTabsModule} from '@angular/material/tabs';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';
import {MatListModule} from '@angular/material/list';
import {MatRadioModule} from '@angular/material/radio';
import {MatTooltipModule} from '@angular/material/tooltip';
import {FlexLayoutModule} from '@angular/flex-layout';
import {EditorAuthRoleGuard} from '../../auth-guard/editor-auth-role.guard';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {NgxPaginationModule} from 'ngx-pagination';
import {AdminAuthRoleGuard} from '../../auth-guard/admin-auth-role.guard';
import {CheckAuthAccessGuard} from '../../auth-guard/check-auth-access.guard';
import { ProductTableComponent } from './components/product-table/product-table.component';
import { ProductViewTableOneComponent } from './components/product-view-table-one/product-view-table-one.component';
import { SidenavListComponent } from './components/sidenav-list/sidenav-list.component';
import { ProductsComponent } from './products/products.component';
import {ConversionRateModule} from './conversion-rate/conversion-rate.module';


const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
        // canActivate: [CheckAuthAccessGuard]
      },
      {
        path: 'products',
        loadChildren: () =>
          import('./products/products.module').then((m) => m.ProductsModule),
        canActivate: [CheckAuthAccessGuard],
      },
      {
        path: 'products-by-link',
        loadChildren: () => import('./products-by-link/products-by-link.module').then(m => m.ProductsByLinkModule),
        canActivate: [CheckAuthAccessGuard]
      },
      {
        path: 'add-product',
        loadChildren: () =>
          import('./products/add-new-product/add-new-product.module').then(
            (m) => m.AddNewProductModule
          ),
        canActivate: [CheckAuthAccessGuard],
      },
      {
        path: 'conversion-rate',
        loadChildren: () =>
          import('./conversion-rate/conversion-rate.module').then(
            (m) => m.ConversionRateModule
          ),
        // canActivate: [CheckAuthAccessGuard],
      },
      {
        path: 'category',
        loadChildren: () =>
          import('./category/category.module').then((m) => m.CategoryModule),
      },
      {
        path: 'vendor',
        loadChildren: () =>
          import('./vendor/vendor.module').then((m) => m.VendorModule),
      },
      {
        path: 'size-chart',
        loadChildren: () =>
          import('./size-chart/size-chart.module').then(
            (m) => m.SizeChartModule
          ),
      },
      {
        path: 'all-customers',
        loadChildren: () =>
          import('./customer/all-customers/all-customers.module').then(
            (m) => m.AllCustomersModule
          ),
      },
      {
        path: 'customer',
        loadChildren: () =>
          import('./customer/customer-profile/customer-profile.module').then(
            (m) => m.CustomerProfileModule
          ),
      },
      {
        path: 'tag',
        loadChildren: () =>
          import('./customer/tag/tag.module').then((m) => m.TagModule),
      },
      {
        path: 'stock-control',
        loadChildren: () =>
          import('./stock-control/stock-control.module').then(
            (m) => m.StockControlModule
          ),
      },
      {
        path: 'return',
        loadChildren: () =>
          import('./order/return-page/return-page.module').then(
            (m) => m.ReturnPageModule
          ),
      },
      {
        path: 'regular-orders',
        loadChildren: () =>
          import('./order/regular-orders/regular-orders.module').then(
            (m) => m.RegularOrdersModule
          ),
      },
      {
        path: 'request-order',
        loadChildren: () =>
          import('./order/request-order/request-order.module').then(
            (m) => m.RequestOrderModule
          ),
      },
      {
        path: 'abandoned-cart',
        loadChildren: () =>
          import('./order/abandoned-cart/abandoned-cart.module').then(
            (m) => m.AbandonedCartModule
          ),
      },
      {
        path: 'reviews',
        loadChildren: () =>
          import('./order/reviews/reviews.module').then((m) => m.ReviewsModule),
      },
      {
        path: 'subscription-order',
        loadChildren: () =>
          import('./order/subscription-order/subscription-order.module').then(
            (m) => m.SubscriptionOrderModule
          ),
      },
      {
        path: 'order-details',
        loadChildren: () =>
          import('./order/order-details/order-details.module').then(
            (m) => m.OrderDetailsModule
          ),
      },
      {
        path: 'edit-order',
        loadChildren: () =>
          import('./order/edit-order/edit-order.module').then(
            (m) => m.EditOrderModule
          ),
      },
      {
        path: 'request-details',
        loadChildren: () =>
          import('./order/request-details/request-details.module').then(
            (m) => m.RequestDetailsModule
          ),
      },
      {
        path: 'abandoned-cart-details',
        loadChildren: () =>
          import(
            './order/abandoned-cart-details/abandoned-cart-details.module'
          ).then((m) => m.AbandonedCartDetailsModule),
      },
      {
        path: 'all-invoice',
        loadChildren: () =>
          import('./order/all-invoice/all-invoice.module').then(
            (m) => m.AllInvoiceModule
          ),
      },
      {
        path: 'invoice',
        loadChildren: () =>
          import('./order/invoice/invoice.module').then((m) => m.InvoiceModule),
      },
      {
        path: 'category-menu',
        loadChildren: () =>
          import('./category-menu/category-menu.module').then(
            (m) => m.CategoryMenuModule
          ),
      },
      {
        path: 'image-gallery',
        loadChildren: () =>
          import('./image-gallery/image-gallery.module').then(
            (m) => m.ImageGalleryModule
          ),
        canActivate: [CheckAuthAccessGuard],
      },
      {
        path: 'image-folder',
        loadChildren: () =>
          import('./image-folder/image-folder.module').then(
            (m) => m.ImageFolderModule
          ),
        canActivate: [CheckAuthAccessGuard],
      },
      {
        path: 'city',
          loadChildren: () => import('./zone/city/city.module').then(m => m.CityModule)
      },
      {
        path: 'thana',
          loadChildren: () => import('./zone/thana/thana.module').then(m => m.ThanaModule)
      },
      {
        path: 'zila',
          loadChildren: () => import('./zone/zila/zila.module').then(m => m.ZilaModule)
      },
      // {
      //   path: 'zone',
      //   loadChildren: () =>
      //     import('./zone/zone.module').then(
      //       (m) => m.ZoneModule
      //     ),
      //   // canActivate: [CheckAuthAccessGuard],
      // },

      /**** settings page routing area */
      {
        path: 'activation',
        loadChildren: () =>
          import('./setting/activation/activation.module').then(
            (m) => m.ActivationModule
          ),
      },
      {
        path: 'tax',
        loadChildren: () =>
          import('./setting/tax/tax.module').then((m) => m.TaxModule),
      },
      {
        path: 'user-roles',
        loadChildren: () =>
          import('./setting/user-roles/user-roles.module').then(
            (m) => m.UserRolesModule
          ),
      },
      {
        path: 'coupon',
        loadChildren: () =>
          import('./coupon/coupon.module').then((m) => m.CouponModule),
      },
      {
        path: 'create-subscription',
        loadChildren: () =>
          import('./create-subscription/create-subscription.module').then(
            (m) => m.CreateSubscriptionModule
          ),
      },
      {
        path: 'shipping',
        loadChildren: () =>
          import('./shipping/shipping.module').then((m) => m.ShippingModule),
      },
      {
        path: 'campaign',
        loadChildren: () =>
          import('./campaign/campaign.module').then((m) => m.CampaignModule),
      },
      {
        path: 'subscription-ui-front',
        loadChildren: () =>
          import('./subscription-ui-front/subscription-ui-front.module').then(
            (m) => m.SubscriptionUiFrontModule
          ),
      },
      {
        path: 'bulk-sms',
        loadChildren: () =>
          import('./bulk-sms-email/bulk-sms-email.module').then(
            (m) => m.BulkSmsEmailModule
          ),
      },
      {
        path: 'coupon-performance',
        loadChildren: () =>
          import('./coupon-performance/coupon-performance.module').then(
            (m) => m.CouponPerformanceModule
          ),
      },
      {
        path: 'subscription',
        loadChildren: () =>
          import('./subscription/subscription.module').then(
            (m) => m.SubscriptionModule
          ),
      },
      {
        path: 'request-overview',
        loadChildren: () =>
          import('./request-overview/request-overview.module').then(
            (m) => m.RequestOverviewModule
          ),
      },
      {
        path: 'subscription-details',
        loadChildren: () =>
          import('./subscription-details/subscription-details.module').then(
            (m) => m.SubscriptionDetailsModule
          ),
      },
      {
        path: 'product-feed',
        loadChildren: () =>
          import('./product-feed/product-feed.module').then(
            (m) => m.ProductFeedModule
          ),
      },
      {
        path: 'points',
        loadChildren: () =>
          import('./points/points.module').then((m) => m.PointsModule),
      },
      {
        path: 'sales-by-category',
        loadChildren: () =>
          import('./sales-by-category/sales-by-category.module').then(
            (m) => m.SalesByCategoryModule
          ),
      },
      {
        path: 'issue',
        loadChildren: () =>
          import('./issue/issue.module').then((m) => m.IssueModule),
      },
      {
        path: 'sales-by-item',
        loadChildren: () =>
          import('./sales-by-item/sales-by-item.module').then(
            (m) => m.SalesByItemModule
          ),
      },
      {
        path: 'sales-by-order',
        loadChildren: () =>
          import('./sales-by-order/sales-by-order.module').then(
            (m) => m.SalesByOrderModule
          ),
      },
      {
        path: 'sales-by-customer',
        loadChildren: () =>
          import('./sales-by-customer/sales-by-customer.module').then(
            (m) => m.SalesByCustomerModule
          ),
      },
      {
        path: 'return-report',
        loadChildren: () =>
          import('./return-report/return-report.module').then(
            (m) => m.ReturnReportModule
          ),
      },
      {
        path: 'user-details',
        loadChildren: () =>
          import('./user-details/user-details.module').then(
            (m) => m.UserDetailsModule
          ),
      },
      {
        path: 'promotion',
        loadChildren: () =>
          import('./promotion/promotion.module').then((m) => m.PromotionModule),
      },
      {
        path: 'new-role',
        loadChildren: () =>
          import('./new-role/new-role.module').then((m) => m.NewRoleModule),
      },
      {
        path: 'brand',
          loadChildren: () => import('./brand/brand.module').then(m => m.BrandModule)
      },
      {
        path: 'product-type',
          loadChildren: () => import('./product-type/product-type.module').then(m => m.ProductTypeModule)
      },
      {
        path: 'country',
          loadChildren: () => import('./country/country.module').then(m => m.CountryModule)
      },
      {
        path: 'supplier',
          loadChildren: () => import('./supplier/supplier.module').then(m => m.SupplierModule)
      },
      {
        path: 'stock',
          loadChildren: () => import('./stock/stock.module').then(m => m.StockModule)
      },
      {
        path: 'purchase',
          loadChildren: () => import('./purchase/purchase.module').then(m => m.PurchaseModule)
      },
      {
        path: 'adjustment',
          loadChildren: () => import('./adjustment/adjustment.module').then(m => m.AdjustmentModule)
      },
      {
        path: 'collections',
          loadChildren: () => import('./collections/collections.module').then(m => m.CollectionsModule)
      },
    ],
  },
];

@NgModule({
  declarations: [
    PagesComponent,
    HeaderComponent,
    ProductViewTableOneComponent,
    ProductTableComponent,
    SidenavListComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    RouterModule,
    MatBadgeModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatExpansionModule,
    MatListModule,
    MatNativeDateModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTabsModule,
    MatTooltipModule,
    PipesModule,
    FormsModule,
    NgxPaginationModule
  ],
  exports: [
    ProductViewTableOneComponent
  ],
  providers: [AdminAuthRoleGuard, EditorAuthRoleGuard, CheckAuthAccessGuard]
})
export class PagesModule {
}
