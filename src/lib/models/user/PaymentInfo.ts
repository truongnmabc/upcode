import Config from "@/common/config";

export interface IPaymentInfo {
  id: any;
  createdDate: number;
  amount: number;
  orderId: string; // orderId của gói đang active
  emailAddress: string;
  userId: string;
  paymentStatus: number;
  appId: number;
  appShortName: string;
  purchared: number;
  paymentSource: string;
  payerName: string;
  buyPro: number; // trường này cần được gọi api để check và update vào đây
  timeLeftDiscount: number;
  type: number;
  orderIds: string[]; // toàn bộ các orderId ~ các lần mua gói pro/ từ orderId => transaction data (transactionId) (các lần thanh toán / gia hạn cho orderId đó ) // mua one time sẽ không có cái này
  expiredDate: number; // trường này được lấy theo next_billing_time của paypal nhé (nếu cancel thì sẽ k có trường đó thì cần check)
}
export class PaymentInfo {
  id: any; // can thong nhat
  createdDate: number; // can thong nhat
  amount: number;
  orderId: string;
  emailAddress: string;
  userId: string;
  paymentStatus: number;
  appId: number;
  appShortName: string;
  purchared: number;
  payerName: string;
  paymentSource: string;
  buyPro: number;
  timeLeftDiscount: number;
  type: number;
  orderIds: string[];
  expiredDate: number;

  constructor(object: any = {}) {
    this.id = object.id;
    this.createdDate = object.createdDate;
    this.amount = object.amount;
    this.orderId = object.orderId ?? "";
    this.emailAddress = object.emailAddress;
    this.paymentStatus = object.paymentStatus ?? Config.PAYMENT_INIT;
    this.appId = object.appId ?? -1;
    this.appShortName = object.appShortName ?? "";
    this.userId = object.userId ?? "";
    this.payerName = object.payerName ?? "";
    this.paymentSource = object.paymentSource ?? "";
    this.purchared = 0;
    this.buyPro = 0;
    if (object.purchared == 1 || object.buyPro == 1) {
      this.purchared = Config.PURCHARED;
      this.buyPro = Config.PURCHARED;
    }
    this.timeLeftDiscount = object.timeLeftDiscount ?? -2;
    this.type = object.type ?? Config.PAY_ONE_TIME;
    this.orderIds = object.orderIds ?? [];
    this.expiredDate = object.expiredDate ?? -1;
  }
}

export const isBuyPro = (paymentInfo) => {
  return (
    paymentInfo?.purchared == Config.PURCHARED ||
    paymentInfo?.buyPro == Config.PURCHARED
  );
};

export const isSubscriptionId = (str: string) => {
  const regex = /\b[\dA-Z-]{13}\b/gm;
  return regex.exec(str) !== null;
};

export interface InAppSubscription {
  id: number;
  appId: number;
  userId: string; // email đăng nhập
  os: string;
  createDate: number;
  purchaseDate: number;
  expriredDate: number; // thời hạn của lần ra hạn hiện tại
  purchased: boolean; // đã thanh toán hay chưa
  trialPeriod: boolean; // trong trial hay không
  in_app: {
    purchase_date: number; //thời gian thanh toán
    expires_date: number; // thời gian hết hạn
    in_app_ownership_type: string; // trạng thái PURCHASED | FAMILY_SHARE...
    is_trial_period: boolean; // đang trial
  }[]; //ds các lần thanh toán của gói này (ở đây không lưu transactionId vì không cần dùng đến)
}
