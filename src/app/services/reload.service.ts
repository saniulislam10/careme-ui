import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReloadService {
  private refreshDistrict = new Subject<void>();
  private refreshCourse = new Subject<void>();
  private refreshService = new Subject<void>();
  private refreshAdmin = new Subject<void>();
  private refreshContactUs = new Subject<void>();
  private refreshInternApplication = new Subject<void>();
  private refreshCourseApplication = new Subject<void>();
  private refreshCart = new Subject<void>();
  private refreshLocal = new Subject<void>();
  private refreshRoles = new Subject<void>();
  private refreshGallery = new Subject<void>();
  private refreshAddress = new Subject<void>();
  private refreshCarousel = new Subject<void>();
  private refreshAttributes = new Subject<void>();
  private refreshBrands = new Subject<void>();
  private refreshTags = new Subject<void>();
  private refreshCategories = new Subject<void>();
  private refreshSubCategories = new Subject<void>();
  private refreshCoupons = new Subject<void>();
  private refreshStoreInfo = new Subject<void>();
  private refreshDealerInfo = new Subject<void>();
  private refreshImageFolder = new Subject<void>();
  private refreshDealOnPlay = new Subject<void>();
  private refreshFlashSale = new Subject<void>();
  private refreshFeaturedProduct = new Subject<void>();
  private refreshFeaturedCategory = new Subject<void>();
  private refreshCategoryMenu = new Subject<void>();
  private refreshUser = new Subject<void>();
  private refreshReviewControl = new Subject<void>();
  private refreshProduct = new Subject<void>();
  private refreshConversionRate = new Subject<void>();
  private refreshBanner = new Subject<void>();
  private refreshLocalCart = new Subject<void>();
  private refreshDealsOfTheDAy = new Subject<void>();
  private refreshOrder = new Subject<void>();
  private refreshNewsletter = new Subject<void>();
  private refreshPromotionalOffer = new Subject<void>();
  private refreshOfferProduct = new Subject<void>();
  private refreshTest = new Subject<void>();
  private refreshBlog = new Subject<void>();
  private refreshSizeChart = new Subject<void>();
  private refreshWishlist = new Subject<void>();
  private refreshInstallationRepairTypes = new Subject<void>();
  private refreshAboutUs = new Subject<void>();
  private refreshCompareList = new Subject<void>();
  private refreshWarrantyList = new Subject<void>();
  private refreshCareerEsquire = new Subject<void>();
  private refreshDiscussion = new Subject<void>();
  private refreshFaq = new Subject<void>();
  private refreshCookie = new Subject<void>();
  private refreshPromoPage = new Subject<void>();
  private refreshData = new Subject<void>();
  private refreshCity = new Subject<void>();
  private refreshZila = new Subject<void>();
  private refreshThana = new Subject<void>();
  private refreshDetails = new Subject<void>();
  private refreshPurchase = new Subject<void>();
  private refreshVendors = new Subject<void>();
  private refreshSuppliers = new Subject<void>();
  private refreshCountrys = new Subject<void>();
  private refreshProductTypes = new Subject<void>();
  /**
   * refresh details
   */
   get refreshDetails$() {
    return this.refreshDetails;
  }
  needRefreshDetails$() {
    this.refreshDetails.next();
  }
  /**
   * refresh product type
   */
   get refreshProductTypes$() {
    return this.refreshVendors;
  }
  needRefreshProductTypes$() {
    this.refreshVendors.next();
  }
  /**
   * refresh product type
   */
   get refreshCollections$() {
    return this.refreshVendors;
  }
  needRefreshCollections$() {
    this.refreshVendors.next();
  }
  /**
   * refresh supplier
   */
   get refreshSuppliers$() {
    return this.refreshVendors;
  }
  needRefreshSuppliers$() {
    this.refreshVendors.next();
  }
  /**
   * refresh country
   */
   get refreshCountrys$() {
    return this.refreshVendors;
  }
  needRefreshCountrys$() {
    this.refreshVendors.next();
  }
  /**
   * refresh vendor
   */
   get refreshVendors$() {
    return this.refreshVendors;
  }
  needRefreshVendors$() {
    this.refreshVendors.next();
  }

  /**
   * Puchase
   */
   get refreshPurchase$() {
    return this.refreshDetails;
  }
  needRefreshPurchase$() {
    this.refreshDetails.next();
  }
  /**
   * refreshcity
   */
   get refreshCity$() {
    return this.refreshCity;
  }
  needRefreshCity$() {
    this.refreshCity.next();
  }
    /**
   * refreshthana
   */
     get refreshThana$() {
      return this.refreshThana;
    }
    needRefreshThana$() {
      this.refreshThana.next();
    }
  /**
   * refreshzila
   */
   get refreshZila$() {
    return this.refreshZila;
  }
  needRefreshZila$() {
    this.refreshZila.next();
  }


  get refreshData$() {
    return this.refreshData;
  }
  needRefreshData$() {
    this.refreshData.next();
  }

  get refreshPromoPage$() {
    return this.refreshPromoPage;
  }
  needRefreshPromoPage$() {
    this.refreshPromoPage.next();
  }

  get refreshCookie$() {
    return this.refreshCookie;
  }
  needRefreshCookie$() {
    this.refreshCookie.next();
  }

  /**
   * refreshDiscussion
   */
  get refreshFaq$() {
    return this.refreshFaq;
  }
  needRefreshFaq$() {
    this.refreshFaq.next();
  }
  /**
   * refreshDiscussion
   */
  get refreshDiscussion$() {
    return this.refreshDiscussion;
  }
  needRefreshDiscussion$() {
    this.refreshDiscussion.next();
  }

  /**
   * refreshCareerEsquire
   */
  get refreshCareerEsquire$() {
    return this.refreshCareerEsquire;
  }
  needRefreshCareerEsquire$() {
    this.refreshCareerEsquire.next();
  }

  get refreshWarrantyList$() {
    return this.refreshWarrantyList;
  }

  needRefreshWarrantyList$() {
    this.refreshWarrantyList.next();
  }

  get refreshCompareList$() {
    return this.refreshCompareList;
  }

  needRefreshCompareList$() {
    this.refreshCompareList.next();
  }

  /**
   * refreshAboutUs
   */

  get refreshAboutUs$() {
    return this.refreshAboutUs;
  }
  needRefreshAboutUs$() {
    this.refreshAboutUs.next();
  }

  /**
   * refreshInstallationRepairTypes
   */

  get refreshInstallationRepairTypes$() {
    return this.refreshInstallationRepairTypes;
  }
  needRefreshInstallationRepairTypes$() {
    this.refreshInstallationRepairTypes.next();
  }

  /**
   * refreshWishlist
   */

  get refreshWishlist$() {
    return this.refreshWishlist;
  }
  needRefreshWishlist$() {
    this.refreshWishlist.next();
  }

  /**
   * Blog
   */
  get refreshBlog$() {
    return this.refreshBlog;
  }
  needRefreshBlog$() {
    this.refreshBlog.next();
  }

  /**
   * Blog
   */
  get refreshSizeChart$() {
    return this.refreshSizeChart;
  }
  needRefreshSizeChart$() {
    this.refreshSizeChart.next();
  }

  /**
   * OfferProduct
   */
  get refreshTest$() {
    return this.refreshTest;
  }
  needRefreshTest$() {
    this.refreshTest.next();
  }

  /**
   * OfferProduct
   */
  get refreshOfferProduct$() {
    return this.refreshOfferProduct;
  }
  needRefreshOfferProduct$() {
    this.refreshOfferProduct.next();
  }

  /**
   * PromotionalOffer
   */
  get refreshPromotionalOffer$() {
    return this.refreshPromotionalOffer;
  }
  needRefreshPromotionalOffer$() {
    this.refreshPromotionalOffer.next();
  }

  get refreshDealerInfo$() {
    return this.refreshDealerInfo;
  }

  needRefreshDealerInfo$() {
    this.refreshDealerInfo.next();
  }

  get refreshNewsletter$() {
    return this.refreshNewsletter;
  }

  needRefreshNewsletter$() {
    this.refreshNewsletter.next();
  }

  /**
   * DealsOfTheDay
   */
  get refreshOrder$() {
    return this.refreshOrder;
  }

  needRefreshOrder$() {
    this.refreshOrder.next();
  }

  /**
   * DealsOfTheDay
   */
  get refreshDealsOfTheDay$() {
    return this.refreshDealsOfTheDAy;
  }

  needRefreshDealsOfTheDay$() {
    this.refreshDealsOfTheDAy.next();
  }

  /**
   * BANNER
   */
  get refreshLocalCart$() {
    return this.refreshLocalCart;
  }

  needRefreshLocalCart$() {
    this.refreshLocalCart.next();
  }

  /**
   * BANNER
   */
  get refreshBanner$() {
    return this.refreshBanner;
  }

  needRefreshBanner$() {
    this.refreshBanner.next();
  }
  /**
   * USER
   */
  get refreshProduct$() {
    return this.refreshProduct;
  }

  needRefreshProduct$() {
    this.refreshProduct.next();
  }
  /**
   * CONVERSION RATE
   */
  get refreshConversionRate$() {
    return this.refreshConversionRate;
  }

  needRefreshConversionRate$() {
    this.refreshConversionRate.next();
  }

  /**
   * ReviewControl
   */
  get refreshReviewControl$() {
    return this.refreshReviewControl;
  }

  needRefreshReviewControl$() {
    this.refreshReviewControl.next();
  }

  /**
   * USER
   */
  get refreshUser$() {
    return this.refreshUser;
  }

  needRefreshUser$() {
    this.refreshUser.next();
  }

  /**
   * DealONPLay
   */
  get refreshCategoryMenu$() {
    return this.refreshCategoryMenu;
  }

  needRefreshCategoryMenu$() {
    this.refreshCategoryMenu.next();
  }

  /**
   * DealONPLay
   */
  get refreshDealOnPlay$() {
    return this.refreshDealOnPlay;
  }

  needRefreshDealOnPlay$() {
    this.refreshDealOnPlay.next();
  }
  /**
   * FeaturedProduct
   */
  get refreshFeaturedProduct$() {
    return this.refreshFeaturedProduct;
  }

  needRefreshFeaturedProduct$() {
    this.refreshFeaturedProduct.next();
  }
  /**
   * FeaturedCategory
   */
  get refreshFeaturedCategory$() {
    return this.refreshFeaturedCategory;
  }

  needRefreshFeaturedCategory$() {
    this.refreshFeaturedCategory.next();
  }
  /**
   * DealsOfTheDay
   */
  get refreshFlashSale$() {
    return this.refreshFlashSale;
  }

  needRefreshFlashSale$() {
    this.refreshFlashSale.next();
  }

  /**
   * Carousel
   */
  get refreshImageFolder$() {
    return this.refreshImageFolder;
  }

  needRefreshImageFolder$() {
    this.refreshImageFolder.next();
  }

  /**
   * Carousel
   */
  get refreshAttributes$() {
    return this.refreshAttributes;
  }

  needRefreshAttributes$() {
    this.refreshAttributes.next();
  }
  /**
   * refreshBrand
   */
  get refreshBrands$() {
    return this.refreshBrands;
  }

  needRefreshBrands$() {
    this.refreshBrands.next();
  }

  /**
   * refreshTag
   */
  get refreshTags$() {
    return this.refreshTags;
  }

  needRefreshTags$() {
    this.refreshTags.next();
  }
  /**
   * refreshCategory
   */
  get refreshCategories$() {
    return this.refreshCategories;
  }

  needRefreshCategories$() {
    this.refreshCategories.next();
  }

  /**
   * refreshSubCategory
   */
  get refreshSubCategories$() {
    return this.refreshSubCategories;
  }

  needRefreshSubCategories$() {
    this.refreshSubCategories.next();
  }
  /**
   * refreshCoupon
   */
  get refreshCoupons$() {
    return this.refreshCoupons;
  }

  needRefreshCoupons$() {
    this.refreshCoupons.next();
  }
  /**
   * refreshStoreInfo
   */
  get refreshStoreInfos$() {
    return this.refreshStoreInfo;
  }

  needRefreshStoreInfos$() {
    this.refreshStoreInfo.next();
  }

  /**
   * Carousel
   */
  get refreshCarousel$() {
    return this.refreshCarousel;
  }

  needRefreshCarousel$() {
    this.refreshCarousel.next();
  }

  /**
   * refreshAddress
   */

  get refreshAddress$() {
    return this.refreshAddress;
  }

  needRefreshAddress$() {
    this.refreshAddress.next();
  }

  /**
   * refreshGallery
   */

  get refreshGallery$() {
    return this.refreshGallery;
  }

  needRefreshGallery$() {
    this.refreshGallery.next();
  }

  /**
   * LOCAL DB
   */
  get refreshRoles$() {
    return this.refreshRoles;
  }

  needRefreshRoles$() {
    this.refreshRoles.next();
  }

  /**
   * LOCAL DB
   */
  get refreshLocal$() {
    return this.refreshLocal;
  }

  needRefreshLocal$() {
    this.refreshLocal.next();
  }

  /**
   * refreshCourse
   */

  get refreshCourse$() {
    return this.refreshCourse;
  }

  needRefreshCourse$() {
    this.refreshCourse.next();
  }

  /**
   * refreshCourse
   */

  get refreshService$() {
    return this.refreshService;
  }

  needRefreshService$() {
    this.refreshService.next();
  }

  /**
   * refreshCourse
   */

  get refreshAdmin$() {
    return this.refreshAdmin;
  }

  needRefreshAdmin$() {
    this.refreshAdmin.next();
  }

  /**
   * refreshCourse
   */

  get refreshContactUs$() {
    return this.refreshContactUs;
  }

  needRefreshContactUs$() {
    this.refreshContactUs.next();
  }

  /**
   * refreshCourse
   */

  get refreshInternApplication$() {
    return this.refreshInternApplication;
  }

  needRefreshInternApplication$() {
    this.refreshInternApplication.next();
  }

  /**
   * refreshCourse
   */

  get refreshCourseApplication$() {
    return this.refreshCourseApplication;
  }

  needRefreshCourseApplication$() {
    this.refreshCourseApplication.next();
  }

  /**
   * CART
   */
  get refreshCart$() {
    return this.refreshCart;
  }

  needRefreshCart$() {
    this.refreshCart.next();
  }

  /**
   * Tag
   */
  //  get refreshTag$() {
  //   return this.refreshCart;
  // }

  // needRefreshTag$() {
  //   this.refreshCart.next();
  // }
}
