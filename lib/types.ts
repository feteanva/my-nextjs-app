// Types for the API response
export interface BillMessage {
  __metadata: {
    id: string;
    uri: string;
    type: string;
  };
  Vkont: string;
  MessageId: string;
  DisplaySeq: string;
  Message: string;
  MessageState: string;
  LinkTxt: string;
  LinkState: string;
  ProcessType: string;
  MessageStyle: string;
}

export interface BillMultiMeterDetails {
  __metadata: {
    id: string;
    uri: string;
    type: string;
  };
  ContractAccount: string;
  EncryptCa: string;
  InstType: string;
  InstTypeDesc: string;
  MeterNo: string;
  SubscriptionNo: string;
  BreakerCap: string;
  MultiplicationFactor: string;
  CurrentReadDate: string;
  CurrentMtrRead: string;
  PreReadDate: string;
  PreMeterRead: string;
  Consumption: string;
}

export interface ConsumptionHistory {
  __metadata: {
    id: string;
    uri: string;
    type: string;
  };
  ContractAcc: string;
  MonthDate: string;
  Yearperiod: string;
  ConsQty: string;
  ConsAmt: string;
  MtrRentAmt: string;
  Amount: string;
  Currency: string;
  EncryptCa: string;
}

export interface SlabInfo {
  __metadata: {
    id: string;
    uri: string;
    type: string;
  };
  ContractAcc: string;
  SlabMin: string;
  Slab: string;
  SlabMax: string;
  EncryptCa: string;
  PriceBlock: string;
  RateCat: string;
  Bqcap: string;
  SlabGroup: string;
  ConsDays: string;
  Currency: string;
  Consumption: string;
  ConsumptionPerSlab: string;
  PricePerSlab: string;
  ConsumptionAmountPerSlab: string;
  SlabTotal: string;
  FromDate: string;
  ToDate: string;
}

export interface BillDetails {
  __metadata: {
    id: string;
    uri: string;
    type: string;
  };
  // Basic Information
  CurrentDueAmt: string;
  Address: string;
  Zzalias: string;
  BillType: string;
  Mahns: string;
  BpNickname: string;
  MeterTypeDesc: string;
  BudgetBillType: string;
  ContractAccount: string;
  Currency: string;
  CustomerNumber: string;
  CustVatNo: string;
  EncryptCA: string;
  InstType: string;
  InstTypeDesc: string;
  MeterNo: string;
  MeterType: string;
  Name: string;
  NoOfDays: string;
  Office: string;
  Opbel: string;
  PartnerNo: string;
  PercentageVatAmt: string;
  Premise: string;
  SubscriptionNo: string;
  TarifType: string;
  VatNo: string;

  // VAT Information
  DisputedAmount: string;
  Vt5VatBase: string;
  Vt5VatAmount: string;
  Vt5TotalInclVat: string;
  Vt15VatBase: string;
  Vt15VatAmount: string;
  Vt15TotalInclVat: string;
  Vat5Amt: string;
  Vat15Amt: string;
  AmtApplicableVat: string;

  // Consumption and Meter Information
  BreakerCap: string;
  BudgetBillAmt: string;
  Consumption: string;
  ConsumptionAmt: string;
  CreditAmt: string;
  CurrentMtrRead: string;
  FbActFixed: string;
  FbAmount: string;
  FbAmtPaid: string;
  FbOpenBal: string;
  FbRemBal: string;
  FbTotalDif: string;
  InstAmount: string;
  InvAmt: string;
  LastPayRec: string;
  MeterRent: string;
  MultiplicationFactor: string;
  OtherAmount: string;
  PaidSdAmount: string;
  ParkedAmount: string;
  ParkedAmt: string;
  PreBal: string;
  PreMeterRead: string;
  PrevInstAmount: string;
  ReconFee: string;
  SadadPayment: string;
  SdAmount: string;
  SplDiscount: string;
  TayseerBalAmt: string;
  TayseerCfAmt: string;
  TayseerTotal: string;
  TotalAmt: string;
  TotalAmtExTax: string;
  TotalConsumption: string;
  TotalDueAmt: string;
  VatAmt: string;

  // Date Fields
  SmPlanDate: string | null;
  VatTaxrateChangeDate: string | null;
  Vt5FromDate: string | null;
  Vt5ToDate: string | null;
  ZzSmdd: string | null;
  DisconDate: string | null;
  DueDate: string;
  Vt15FromDate: string;
  FbEndDate: string | null;
  Vt15ToDate: string;
  FbStartDate: string | null;
  FromDate: string;
  InvDate: string;
  LastDatePayment: string | null;
  LastPayRecDate: string;
  NextSbild: string;
  NextSmrd: string;
  SadadPaymentDate: string | null;
  ToDate: string;

  // Numeric Fields
  DaysToSbild: string;
  DaysToSmrd: string;
  FbCperiod: string;
  FbOpenInv: string;
  FbPaidInv: string;
  Vt5TaxPercent: string;
  FbRemInv: string;
  Vt15TaxPercent: string;

  // Boolean Fields
  MultiPeriod: boolean;
  InvPaymentStat: boolean;
  VatTaxrateChange: boolean;

  // Additional Fields
  UnprnAmt: string;
  TotalDueAmountDisplay: string;

  // Nested Objects
  Bill_BillMessage: {
    results: BillMessage[];
  };
  Bill_MultiMeterDetail: {
    results: BillMultiMeterDetails[];
  };
  Bill_OtherCharges: {
    results: unknown[];
  };
  Bill_ConsumptionHistory: {
    results: ConsumptionHistory[];
  };
  Bill_SlabPriceInfo: {
    results: SlabInfo[];
  };
  Bill_InstallmentPlanInfo: {
    results: unknown[];
  };
}

export interface SEApiResponse {
  d: BillDetails;
  ErrorCode: string | null;
  Error: {
    ErrorMessage: string | null;
  };
}
