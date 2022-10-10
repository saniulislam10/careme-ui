// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // apiBaseLink: 'https://api.caremein.softlabit.com',
  // ftpBaseLink: 'https://ftp.caremein.softlabit.com',
  // apiBaseLinkAli: 'https://api.careme.softlabit.com',
  apiBaseLinkAli: 'http://localhost:5502',
  apiBaseLink: 'http://localhost:5502',
  ftpBaseLink: 'http://localhost:5502',
  // apiBaseLink: 'http://192.168.68.10:5502',
  // ftpBaseLink: 'http://192.168.68.10:5502',
  appBaseUrl: '/',
  userBaseUrl: '/',
  userLoginUrl: '/login',
  adminLoginUrl: 'admin/login',
  adminBaseUrl: 'admin',
  storageSecret: 'SOFT_2021_IT_1998',
  // sslIpnUrl: 'https://api.careme.com/api/payment-ssl/ipn',
  // sslIpnUrl: 'http://localhost:5502/api/payment-ssl/ipn',
  smsUser: 'new sms',
  smsPass: '',
  smsSid: '',
  VERSION: 1,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
