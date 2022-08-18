import { environment } from '../../../environments/environment';

export const DATABASE_KEY = Object.freeze({
  loginToken: 'CAREME_TOKEN_' + environment.VERSION,
  loggInSession: 'CAREME_SESSION_' + environment.VERSION,
  loginTokenAdmin: 'CAREME_ADMIN_TOKEN_' + environment.VERSION,
  loggInSessionAdmin: 'CAREME_ADMIN_SESSION_' + environment.VERSION,
  encryptAdminLogin: 'CAREME_USER_0_' + environment.VERSION,
  loginAdminRole: 'CAREME_ADMIN_ROLE_' + environment.VERSION,
  cartsProduct: 'CAREME_USER_CART_' + environment.VERSION,
  requestedScrappingProduct:
    'CAREME_REQUESTED_SCRAPPED_PRODUCT_' + environment.VERSION,
  scrappedWeblink: 'CAREME_REQUESTED_SCRAPPED_WEB_LINK_' + environment.VERSION,
  productFormData: 'CAREME_PRODUCT_FORM_' + environment.VERSION,
  userCart: 'CAREME_USER_CART_' + environment.VERSION,
  recommendedProduct: 'CAREME_RECOMMENDED_PRODUCT_' + environment.VERSION,
  userCoupon: 'CAREME_USER_COUPON_' + environment.VERSION,
  userCookieTerm: 'CAREME_COOKIE_TERM' + environment.VERSION,
  selectedShippingAddress: 'CAREME_USER_SELECTED_ADDRESS' + environment.VERSION,
  selectedPointsType: 'CAREME_USER_SELECTED_POINTS_TYPE' + environment.VERSION,
  orderMessage: 'CAREME_USER_ORDER_MESSAGE' + environment.VERSION,
});
