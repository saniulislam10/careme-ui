import { MenuAdmin } from 'src/app/interfaces/menu-admin';

export const menuItemsSuperAdmin: MenuAdmin[] = [
  // Parent Dashboard
  // Parent Gallery Folder

  {
    id: '1',
    title: 'Dashboard',
    icon: 'dashboard',
    hasSubMenu: true,
    parentId: null,
    routerLink: 'dashboard',
    href: null,
    target: null,
  },
  {
    id: '6',
    title: 'Product',
    icon: 'list_alt',
    hasSubMenu: true,
    parentId: null,
    routerLink: null,
    href: null,
    target: null,
  },
  {
    id: '6sub1',
    title: 'All Products',
    icon: null,
    hasSubMenu: false,
    parentId: '6',
    routerLink: 'products',
    href: null,
    target: null,
  },
  {
    id: '2',
    title: 'Collections',
    icon: null,
    hasSubMenu: false,
    parentId: '6',
    routerLink: 'collections',
    href: null,
    target: null,
  },
  {
    id: 'type',
    title: 'Product Type',
    icon: null,
    hasSubMenu: false,
    parentId: '6',
    routerLink: 'product-type',
    href: null,
    target: null,
  },
  {
    id: 'country',
    title: 'Country of Origin',
    icon: null,
    hasSubMenu: false,
    parentId: '6',
    routerLink: 'country',
    href: null,
    target: null,
  },
  {
    id: 'brand',
    title: 'Brand',
    icon: null,
    hasSubMenu: false,
    parentId: '6',
    routerLink: 'brand',
    href: null,
    target: null,
  },
  {
    id: '7',
    title: 'Size Chart',
    icon: null,
    hasSubMenu: false,
    parentId: '6',
    routerLink: 'size-chart',
    href: null,
    target: null,
  },
  {
    id: '8',
    title: 'Stock-Control',
    icon: null,
    hasSubMenu: false,
    parentId: '6',
    routerLink: 'stock-control',
    href: null,
    target: null,
  },
  {
    id: '110b3',
    title: 'Conversion Rate',
    icon: null,
    hasSubMenu: false,
    parentId: '6',
    routerLink: 'conversion-rate',
    href: null,
    target: null,
  },
  {
    id: 'I100',
    title: 'Inventory',
    icon: 'inventory',
    hasSubMenu: true,
    parentId: null,
    routerLink: null,
    href: null,
    target: null
  },
  {
    id: '1212Il',
    title: 'Stock',
    icon: null,
    hasSubMenu: false,
    parentId: 'I100',
    routerLink: 'stock',
    href: null,
    target: null
  },
  {
    id: 'll11I1',
    title: 'Purchase',
    icon: null,
    hasSubMenu: false,
    parentId: 'I100',
    routerLink: 'purchase',
    href: null,
    target: null
  },
  {
    id: 'supplier',
    title: 'Supplier',
    icon: null,
    hasSubMenu: false,
    parentId: 'I100',
    routerLink: 'supplier',
    href: null,
    target: null,
  },
  {
    id: '1212ll',
    title: 'Adjustment',
    icon: null,
    hasSubMenu: false,
    parentId: 'I100',
    routerLink: 'adjustment',
    href: null,
    target: null
  },

  {
    id: '9',
    title: 'Sales Orders',
    icon: 'sell',
    hasSubMenu: true,
    parentId: null,
    routerLink: null,
    href: null,
    target: null,
  },
  {
    id: '11',
    title: 'Promotions',
    icon: 'campaign',
    hasSubMenu: true,
    parentId: null,
    routerLink: 'dashboard-cusrt',
    href: null,
    target: null,
  },
  {
    id: '11',
    title: 'Campaign',
    icon: null,
    hasSubMenu: false,
    parentId: '11',
    routerLink: 'campaign',
    href: null,
    target: null,
  },
  {
    id: '11',
    title: 'Bulk Sms/Email',
    icon: null,
    hasSubMenu: false,
    parentId: '11',
    routerLink: 'bulk-sms',
    href: null,
    target: null,
  },
  {
    id: '11',
    title: 'Coupon code',
    icon: null,
    hasSubMenu: false,
    parentId: '11',
    routerLink: 'coupon',
    href: null,
    target: null,
  },
  {
    id: 'p12',
    title: 'Coupon',
    icon: 'dashboard_customize',
    hasSubMenu: false,
    parentId: '12',
    routerLink: 'tag',
    href: null,
    target: null,
  },
  {
    id: 'p12',
    title: 'Bulk Sms/Email',
    icon: 'dashboard_customize',
    hasSubMenu: false,
    parentId: '12',
    routerLink: 'tag',
    href: null,
    target: null,
  },
  {
    id: 'p12',
    title: 'Campaign',
    icon: 'dashboard_customize',
    hasSubMenu: false,
    parentId: '12',
    routerLink: 'tag',
    href: null,
    target: null,
  },
  {
    id: '14',
    title: 'Shipping and Delivery',
    icon: 'local_shipping',
    hasSubMenu: true,
    parentId: null,
    routerLink: 'shipping-4',
    href: null,
    target: null,
  },
  {
    id: '1212ll',
    title: 'Zila',
    icon: null,
    hasSubMenu: false,
    parentId: '14',
    routerLink: 'zila',
    href: null,
    target: null
  },
  {
    id: 'll1121',
    title: 'City',
    icon: null,
    hasSubMenu: false,
    parentId: '14',
    routerLink: 'city',
    href: null,
    target: null
  },
  {
    id: '1212ll',
    title: 'Thana',
    icon: null,
    hasSubMenu: false,
    parentId: '14',
    routerLink: 'thana',
    href: null,
    target: null
  },
  {
    id: 'report',
    title: 'Reports',
    icon: 'summarize',
    hasSubMenu: true,
    parentId: null,
    routerLink: null,
    href: null,
    target: null
  },
  {
    id: 'sub',
    title: 'Report Summary',
    icon: null,
    hasSubMenu: false,
    parentId: 'report',
    routerLink: 'dashboard',
    href: null,
    target: null
  },
  {
    id: 'sub',
    title: 'Sales by Order',
    icon: null,
    hasSubMenu: false,
    parentId: 'report',
    routerLink: 'dashboard',
    href: null,
    target: null
  },
  {
    id: 'sub',
    title: 'Sales by Item',
    icon: null,
    hasSubMenu: false,
    parentId: 'report',
    routerLink: 'dashboard',
    href: null,
    target: null
  },
  {
    id: 'sub',
    title: 'Invoice',
    icon: null,
    hasSubMenu: false,
    parentId: 'report',
    routerLink: 'dashboard',
    href: null,
    target: null
  },
  {
    id: 'sub',
    title: 'Sales by Customer',
    icon: null,
    hasSubMenu: false,
    parentId: 'report',
    routerLink: 'dashboard',
    href: null,
    target: null
  },
  {
    id: 'sub',
    title: 'Sales Return',
    icon: null,
    hasSubMenu: false,
    parentId: 'report',
    routerLink: 'dashboard',
    href: null,
    target: null
  },
  {
    id: 'sub',
    title: 'Inventory Report',
    icon: null,
    hasSubMenu: false,
    parentId: 'report',
    routerLink: 'dashboard',
    href: null,
    target: null
  },
  {
    id: 'sub',
    title: 'P/L Report',
    icon: null,
    hasSubMenu: false,
    parentId: 'report',
    routerLink: 'dashboard',
    href: null,
    target: null
  },
  {
    id: 'sub',
    title: 'Order by Product',
    icon: null,
    hasSubMenu: false,
    parentId: 'report',
    routerLink: 'dashboard',
    href: null,
    target: null
  },
  {
    id: 'account',
    title: 'Accounts',
    icon: 'account_balance',
    hasSubMenu: true,
    parentId: null,
    routerLink: null,
    href: null,
    target: null,
  },
  {
    id: 'sub',
    title: 'Debit',
    icon: null,
    hasSubMenu: false,
    parentId: 'account',
    routerLink: 'dashboard',
    href: null,
    target: null
  },{
    id: 'sub',
    title: 'Credit',
    icon: null,
    hasSubMenu: false,
    parentId: 'account',
    routerLink: 'dashboard',
    href: null,
    target: null
  },
  {
    id: 'sub',
    title: 'Refunded Request',
    icon: null,
    hasSubMenu: false,
    parentId: 'account',
    routerLink: 'dashboard',
    href: null,
    target: null
  },
  {
    id: 'todo',
    title: 'To Do List',
    icon: 'checklist',
    hasSubMenu: true,
    parentId: null,
    routerLink: null,
    href: null,
    target: null,
  },
  {
    id: 'sub',
    title: 'Assign Task',
    icon: null,
    hasSubMenu: false,
    parentId: 'todo',
    routerLink: 'dashboard',
    href: null,
    target: null
  },
  {
    id: 'sub',
    title: 'My Task',
    icon: null,
    hasSubMenu: false,
    parentId: 'todo',
    routerLink: 'dashboard',
    href: null,
    target: null
  },
  {
    id: 'sub',
    title: 'Completed Task',
    icon: null,
    hasSubMenu: false,
    parentId: 'todo',
    routerLink: 'dashboard',
    href: null,
    target: null
  },
  {
    id: 'sub',
    title: 'Control',
    icon: null,
    hasSubMenu: false,
    parentId: 'todo',
    routerLink: 'dashboard',
    href: null,
    target: null
  },

  // Parent Customization
  {
    id: '2',
    title: 'Theme',
    icon: 'tune',
    hasSubMenu: true,
    parentId: null,
    routerLink: null,
    href: null,
    target: null,
  },
  {
    id: 'a1',
    title: 'Category Menu',
    icon: null,
    hasSubMenu: false,
    parentId: '2',
    routerLink: 'category-menu',
    href: null,
    target: null,
  },

  {
    id: 'a2',
    title: 'Carousel',
    icon: null,
    hasSubMenu: false,
    parentId: '2',
    routerLink: 'carousel',
    href: null,
    target: null,
  },
  {
    id: 'a3',
    title: 'Shop Info',
    icon: null,
    hasSubMenu: false,
    parentId: '2',
    routerLink: 'shop-info',
    href: null,
    target: null,
  },
  {
    id: 'a4',
    title: 'Footer Data',
    icon: null,
    hasSubMenu: false,
    parentId: '2',
    routerLink: 'footer-data',
    href: null,
    target: null,
  },
  {
    id: 'a5',
    title: 'Promo Advertise',
    icon: null,
    hasSubMenu: false,
    parentId: '2',
    routerLink: 'promo-page',
    href: null,
    target: null,
  },

  // Parent Products

  {
    id: '9sub1',
    title: 'All Orders',
    icon: null,
    hasSubMenu: false,
    parentId: '9',
    routerLink: 'regular-orders',
    href: null,
    target: null,
  },
  {
    id: '9sub8',
    title: 'Abandoned Cart',
    icon: null,
    hasSubMenu: false,
    parentId: '9',
    routerLink: 'abandoned-cart',
    href: null,
    target: null,
  },
  {
    id: '9sub4',
    title: 'Invoices',
    icon: null,
    hasSubMenu: false,
    parentId: '9',
    routerLink: 'all-invoice',
    href: null,
    target: null,
  },
  {
    id: '9sub3',
    title: 'Return',
    icon: null,
    hasSubMenu: false,
    parentId: '9',
    routerLink: 'return',
    href: null,
    target: null,
  },
  {
    id: '9sub3',
    title: 'Refund',
    icon: null,
    hasSubMenu: false,
    parentId: '9',
    routerLink: 'refund',
    href: null,
    target: null,
  },
  {
    id: 'review',
    title: 'Reviews',
    icon: null,
    hasSubMenu: false,
    parentId: '9',
    routerLink: 'reviews',
    href: null,
    target: null,
  },
  {
    id: 'customers',
    title: 'Customers',
    icon: null,
    hasSubMenu: false,
    parentId: '9',
    routerLink: 'all-customers',
    href: null,
    target: null,
  },
  {
    id: '731yh',
    title: 'Gallery',
    icon: 'collections',
    hasSubMenu: true,
    parentId: null,
    routerLink: null,
    href: null,
    target: null,
  },
  {
    id: '7895i',
    title: 'Image Folder',
    icon: null,
    hasSubMenu: false,
    parentId: '731yh',
    routerLink: 'image-folder',
    href: null,
    target: null,
  },
  // Parent Gallery
  {
    id: '7896i3',
    title: 'Image Gallery',
    icon: null,
    hasSubMenu: false,
    parentId: '731yh',
    routerLink: 'image-gallery',
    href: null,
    target: null,
  },
  {
    id: '13',
    title: 'Settings',
    icon: 'settings',
    hasSubMenu: true,
    parentId: null,
    routerLink: 'settings3',
    href: null,
    target: null,
  },
  {
    id: '2',
    title: 'Vendors',
    icon: null,
    hasSubMenu: false,
    parentId: '13',
    routerLink: 'vendor',
    href: null,
    target: null,
  },
];
export const menuItemsAdmin: MenuAdmin[] = [
  {
    id: '1',
    title: 'Dashboard',
    icon: 'dashboard',
    hasSubMenu: false,
    parentId: null,
    routerLink: 'dashboard',
    href: null,
    target: null,
  },
  {
    id: '6',
    title: 'Product',
    icon: 'list_alt',
    hasSubMenu: true,
    parentId: null,
    routerLink: null,
    href: null,
    target: null,
  },

  {
    id: '6sub2',
    title: 'Add Product',
    icon: null,
    hasSubMenu: false,
    parentId: '6',
    routerLink: 'add-product',
    href: null,
    target: null,
  },
  {
    id: '6sub1',
    title: 'Products List',
    icon: null,
    hasSubMenu: false,
    parentId: '6',
    routerLink: 'products',
    href: null,
    target: null,
  },
];
export const menuItemsEditor: MenuAdmin[] = [
  {
    id: '1',
    title: 'Dashboard',
    icon: 'dashboard',
    hasSubMenu: false,
    parentId: null,
    routerLink: 'dashboard',
    href: null,
    target: null,
  },
  {
    id: '6',
    title: 'Product',
    icon: 'list_alt',
    hasSubMenu: true,
    parentId: null,
    routerLink: null,
    href: null,
    target: null,
  },

  {
    id: '6sub2',
    title: 'Add Product',
    icon: null,
    hasSubMenu: false,
    parentId: '6',
    routerLink: 'add-product',
    href: null,
    target: null,
  },
  {
    id: '6sub1',
    title: 'Products List',
    icon: null,
    hasSubMenu: false,
    parentId: '6',
    routerLink: 'products',
    href: null,
    target: null,
  },
];
export const menuItemsVendor: MenuAdmin[] = [
  {
    id: '1',
    title: 'Dashboard',
    icon: 'dashboard',
    hasSubMenu: false,
    parentId: null,
    routerLink: 'dashboard',
    href: null,
    target: null,
  },
  {
    id: '6',
    title: 'Product',
    icon: 'list_alt',
    hasSubMenu: true,
    parentId: null,
    routerLink: null,
    href: null,
    target: null,
  },

  {
    id: '6sub2',
    title: 'Add Product',
    icon: null,
    hasSubMenu: false,
    parentId: '6',
    routerLink: 'add-product',
    href: null,
    target: null,
  },
  {
    id: '6sub1',
    title: 'Products List',
    icon: null,
    hasSubMenu: false,
    parentId: '6',
    routerLink: 'products',
    href: null,
    target: null,
  },
];
