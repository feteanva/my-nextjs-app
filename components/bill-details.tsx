import { type BillDetails } from "@/lib/types";
import { cn, getDateParts } from "@/lib/utils";
import { MinusIcon, PlusIcon } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  data: BillDetails | null;
  domain: string;
  accountNumber: string;
};

const BillDetailsComponent = ({ data, domain, accountNumber }: Props) => {
  const [isMoneyInfoOpen, setIsMoneyInfoOpen] = useState(false);
  const [isOthersInfoOpen, setIsOthersInfoOpen] = useState(true);
  const router = useRouter();
  const handlePayButton = () => {
    router.push(
      `${domain}?total=${data?.TotalDueAmountDisplay}&accountNumber=${accountNumber}`
    );
  };

  return (
    <div className="md:max-w-[1440px] md:mx-auto md:my-0">
      <div className="max-h-[calc(100vh-240px)] pb-[80px] overflow-y-auto md:ml-[9px] md:mr-[30px] md:pr-0 md:pl-[5px] md:max-h-[calc(100vh-380px)] md:max-w-[1431px] md:overflow-x-auto xl:mr-0">
        <div>
          {/* Summary */}
          <div className="mb-[30px] md:mb-0" style={{}}>
            <div className="hidden py-[15px] px-[20px] shadow-[inset_0_1px_0_rgba(0,0,0,.2)] cursor-pointer items-center md:flex md:ml-0 md:mr-[30px] md:cursor-default md:pt-[25px] md:pb-[35px] md:max-w-[1380px] md:px-0 md:justify-between">
              <h3 className="mr-0 ml-[20px] mb-0 text-[21px] leading-[25px] tracking-[-.01em] font-semibold">
                ملخص الفاتورة الحالية
              </h3>
            </div>
            <div className="py-0 px-[20px] block transition-all duration-300 md:ml-0 xl:pb-[15px]">
              <div className="">
                <div className="xl:mr-[10px] xl:ml-0 xl:max-w-[1440px]">
                  <table
                    mat-table=""
                    className="mb-[50px] w-full border-spacing-0 xl:border-spacing-y-[12px] xl:border-spacing-x-0 xl:border-separate"
                    role="grid"
                  >
                    <thead
                      role="rowgroup"
                      className="hidden static xl:table-header-group"
                    >
                      <tr
                        role="row"
                        mat-header-row=""
                        className="mt-0 h-[56px] xl:relative xl:h-auto after:content-[''] after:bottom-[-6px] after:border-b after:border-[#00000033] after:left-0 after:right-0 after:absolute"
                      >
                        <th
                          role="columnheader"
                          mat-header-cell=""
                          className="pr-0 pl-0 text-right border-[#00000033] text-[15px] text-[#000000e6] leading-[20px] p-0 border-b-[1px] xl:pl-[10px] xl:pr-[20px] xl:border-b-0 xl:w-[18.07%] xl:pt-[15px] xl:pb-[20px]"
                        >
                          المبلغ المسدد{" "}
                        </th>
                        <th
                          role="columnheader"
                          mat-header-cell=""
                          className="pr-0 pl-[10px] text-right border-[#00000033] text-[15px] text-[#000000e6] leading-[20px] border-b-[1px] py-0 xl:border-b-0 xl:w-[16.7%] xl:p-[15px_10px_20px_0]"
                        >
                          المبلغ المتبقي
                        </th>
                        <th
                          role="columnheader"
                          mat-header-cell=""
                          className="pr-0 pl-[10px] text-right border-[#00000033] text-[15px] text-[#000000e6] leading-[20px] border-b-[1px] py-0 xl:border-b-0 xl:w-[16.7%] xl:p-[15px_10px_20px_0]"
                        >
                          المبلغ السابق
                        </th>
                        <th
                          role="columnheader"
                          mat-header-cell=""
                          className="pr-0 pl-[10px] text-right border-[#00000033] text-[15px] text-[#000000e6] leading-[20px] border-b-[1px] py-0 xl:border-b-0 xl:w-[16.7%] xl:p-[15px_10px_20px_0]"
                        >
                          تاريخ بداية الاستحقاق{" "}
                        </th>
                        {data?.DisconDate && (
                          <th
                            role="columnheader"
                            mat-header-cell=""
                            className="pr-0 pl-[10px] text-right border-[#00000033] text-[15px] text-[#000000e6] leading-[20px] border-b-[1px] py-0 xl:border-b-0 xl:w-[16.7%] xl:p-[15px_10px_20px_0]"
                          >
                            تاريخ إيقاف الخدمة{" "}
                          </th>
                        )}

                        <th
                          role="columnheader"
                          mat-header-cell=""
                          className="pl-0 pr-0 text-right border-[#00000033] text-[15px] text-[#000000e6] leading-[20px] border-b-[1px] xl:pr-0 xl:pl-[20px] xl:w-full xl:border-b-0 xl:flex xl:flex-col xl:p-[15px_10px_20px_0]"
                        >
                          <span className="font-bold">إجمالي الفاتورة</span>
                          <span className="font-normal">
                            يشمل المبلغ السابق
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody role="rowgroup" className="table-row-group">
                      <tr
                        role="row"
                        mat-row=""
                        className="mt-0 border-t border-[#00000033] pt-[3px] block w-full h-auto xl:relative xl:m-[6px_0] xl:min-h-[80px] xl:bg-[#f5f3f1] xl:pointer-events-none xl:table-row"
                      >
                        <td
                          role="gridcell"
                          mat-cell=""
                          className="text-[#000000e6] px-0 text-left w-full block text-[15px] min-h-[40px] p-[10px_20px] relative border-b-0 leading-[20px] xl:text-right xl:text-[#000000b3] xl:w-[18.07%] xl:py-[30px] xl:px-[10px] xl:table-cell before:text-[#000000b3] before:float-right before:content-[attr(data-label)] before:text-[13px] before:leading-[15px] xl:before:hidden after:left-0 after:w-full after:content-[''] after:h-[1px] after:bg-[#00000033] after:absolute after:block after:bottom-0 after:mx-auto xl:after:hidden xl:rounded-[0_10px_10px_0]"
                          data-label="المبلغ المسدد "
                        >
                          <i>
                            <i className="font-riyal leading-[1px] before:content-[''] before:text-[calc(1em-2px)] not-italic normal-nums normal-case"></i>
                          </i>{" "}
                          {data?.InvPaymentStat ? data?.InvAmt : "0.00"}
                        </td>
                        <td
                          role="gridcell"
                          mat-cell=""
                          className="text-[#000000e6] px-0 text-left w-full block text-[15px] min-h-[40px] p-[10px_20px] relative border-b-0 leading-[20px] xl:text-right xl:text-[#000000b3] xl:w-[16.7%] xl:py-[30px] xl:px-[10px] xl:table-cell before:text-[#000000b3] before:float-right before:content-[attr(data-label)] before:text-[13px] before:leading-[15px] xl:before:hidden after:left-0 after:w-full after:content-[''] after:h-[1px] after:bg-[#00000033] after:absolute after:block after:bottom-0 after:mx-auto xl:after:hidden"
                          data-label="المبلغ المتبقي"
                        >
                          <i>
                            <i className="font-riyal leading-[1px] before:content-[''] before:text-[calc(1em-2px)] not-italic normal-nums normal-case"></i>
                          </i>{" "}
                          {data?.CurrentDueAmt}
                        </td>
                        <td
                          role="gridcell"
                          mat-cell=""
                          className="text-[#000000e6] px-0 text-left w-full block text-[15px] min-h-[40px] p-[10px_20px] relative border-b-0 leading-[20px] xl:text-right xl:text-[#000000b3] xl:w-[16.7%] xl:py-[30px] xl:px-[10px] xl:table-cell before:text-[#000000b3] before:float-right before:content-[attr(data-label)] before:text-[13px] before:leading-[15px] xl:before:hidden after:left-0 after:w-full after:content-[''] after:h-[1px] after:bg-[#00000033] after:absolute after:block after:bottom-0 after:mx-auto xl:after:hidden"
                          data-label="الرصيد السابق"
                        >
                          <i>
                            <i className="font-riyal leading-[1px] before:content-[''] before:text-[calc(1em-2px)] not-italic normal-nums normal-case"></i>
                          </i>{" "}
                          {data?.PreBal}
                        </td>
                        <td
                          role="gridcell"
                          mat-cell=""
                          className="text-[#000000e6] px-0 text-left w-full block text-[15px] min-h-[40px] p-[10px_20px] relative border-b-0 leading-[20px] xl:text-right xl:text-[#000000b3] xl:w-[16.7%] xl:py-[30px] xl:px-[10px] xl:table-cell before:text-[#000000b3] before:float-right before:content-[attr(data-label)] before:text-[13px] before:leading-[15px] xl:before:hidden after:left-0 after:w-full after:content-[''] after:h-[1px] after:bg-[#00000033] after:absolute after:block after:bottom-0 after:mx-auto xl:after:hidden"
                          data-label="تاريخ بداية الاستحقاق "
                        >
                          <span className="date-ar">
                            {getDateParts(data?.DueDate).dateText}
                            <span className="inline-block">
                              {getDateParts(data?.DueDate).year}
                            </span>
                          </span>
                        </td>
                        {data?.DisconDate && (
                          <td
                            role="gridcell"
                            mat-cell=""
                            className="text-[#000000e6] px-0 text-left w-full block text-[15px] min-h-[40px] p-[10px_20px] relative border-b-0 leading-[20px] xl:text-right xl:text-[#000000b3] xl:w-[16.7%] xl:py-[30px] xl:px-[10px] xl:table-cell before:text-[#000000b3] before:float-right before:content-[attr(data-label)] before:text-[13px] before:leading-[15px] xl:before:hidden after:left-0 after:w-full after:content-[''] after:h-[1px] after:bg-[#00000033] after:absolute after:block after:bottom-0 after:mx-auto xl:after:hidden"
                            data-label="تاريخ إيقاف الخدمة "
                          >
                            <span className="date-ar">
                              {getDateParts(data?.DisconDate).dateText}
                              <span className="inline-block">
                                {getDateParts(data?.DisconDate).year}
                              </span>
                            </span>
                          </td>
                        )}
                        <td
                          role="gridcell"
                          mat-cell=""
                          className="flex justify-between text-[#000000e6] px-0 w-full text-[15px] min-h-[40px] p-[10px_20px] relative leading-[20px] xl:table-cell xl:text-right xl:w-full xl:py-[30px] xl:px-[10px] xl:rounded-[10px_0_0_10px]"
                        >
                          <div className="items-start text-[#000000b3] flex flex-col text-[13px] leading-[20px] xl:hidden">
                            <span className="ng-star-inserted">
                              إجمالي الفاتورة
                            </span>
                            <span className="ng-star-inserted">
                              يشمل المبلغ السابق
                            </span>
                          </div>
                          <span className="font-bold">
                            <i>
                              <i className="font-riyal leading-[1px] before:content-[''] before:text-[calc(1em-2px)] not-italic normal-nums normal-case"></i>
                            </i>{" "}
                            {data?.TotalDueAmountDisplay}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                    <tfoot
                      role="rowgroup"
                      className="sticky"
                      style={{ display: "none", bottom: "0px", zIndex: "10" }}
                    ></tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>
          {/* Money Data */}
          <div className="mb-[30px] md:mb-0">
            <div
              id="heading1"
              onClick={() => setIsMoneyInfoOpen(!isMoneyInfoOpen)}
              data-target="#collapse_1"
              aria-controls="collapse_1"
              className="p-[15px_20px] shadow-[inset_0_1px_0_rgba(0,0,0,.2)] cursor-pointer flex justify-between items-center md:ml-0 md:mr-[30px]"
            >
              <h3 className="mr-0 ml-[20px] mb-0 text-[21px] leading-[25px] tracking-[-.01em] font-semibold">
                المعلومات المالية
              </h3>
              <button
                className="bg-[#ff730026] text-[#ff7300] inline-flex items-center cursor-pointer min-w-[50px] justify-center border border-transparent p-[10px_15px_8px] text-[17px] leading-[20px] rounded-[40px]"
                style={{
                  transition: "color .5s,background-color .5s",
                }}
              >
                {isMoneyInfoOpen ? (
                  <MinusIcon className="h-[20px]" />
                ) : (
                  <PlusIcon className="h-[20px]" />
                )}
              </button>
            </div>
            <div
              id="collapse_1"
              aria-labelledby="heading1"
              className={cn(
                "p-[0_20px] overflow-hidden transition-all duration-300",
                "md:max-w-[1380px]",
                isMoneyInfoOpen ? "block" : "hidden"
              )}
            >
              <table className="w-full border-spacing-0 text-[#000000b3] table">
                <tbody>
                  <tr>
                    <td className="money-info-first-td" style={{}}>
                      تاريخ الفاتورة
                    </td>
                    <td className="money-info-second-td">
                      <span className="date-ar">
                        {getDateParts(data?.InvDate).dateText}
                        <span className="inline-block">
                          {getDateParts(data?.InvDate).year}
                        </span>
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="money-info-first-td">نوع الفاتورة</td>
                    <td className="money-info-second-td">{data?.TarifType}</td>
                  </tr>
                  <tr>
                    <td className="money-info-first-td">عدد الأيام</td>
                    <td className="money-info-second-td">{data?.NoOfDays}</td>
                  </tr>
                  <tr>
                    <td className="money-info-first-td" style={{}}>
                      قيمة الاستهلاك
                    </td>
                    <td className="money-info-second-td">
                      <i>
                        <i className="font-riyal leading-[1px] before:content-[''] before:text-[calc(1em-2px)] not-italic normal-nums normal-case"></i>
                      </i>{" "}
                      {data?.ConsumptionAmt}
                    </td>
                  </tr>
                  <tr>
                    <td className="money-info-first-td" style={{}}>
                      خدمة العداد
                    </td>
                    <td className="money-info-second-td">
                      <i>
                        <i className="font-riyal leading-[1px] before:content-[''] before:text-[calc(1em-2px)] not-italic normal-nums normal-case"></i>
                      </i>{" "}
                      {data?.MeterRent}
                    </td>
                  </tr>
                  <tr>
                    <td className="money-info-first-td" style={{}}>
                      المبلغ الإجمالي قبل الضريبة
                    </td>
                    <td className="money-info-second-td">
                      <i>
                        <i className="font-riyal leading-[1px] before:content-[''] before:text-[calc(1em-2px)] not-italic normal-nums normal-case"></i>
                      </i>{" "}
                      {data?.TotalAmtExTax}
                    </td>
                  </tr>
                  <tr>
                    <td className="money-info-first-td" style={{}}>
                      مبلغ ضريبة القيمة المضافة 15%
                    </td>
                    <td className="money-info-second-td">
                      <i>
                        <i className="font-riyal leading-[1px] before:content-[''] before:text-[calc(1em-2px)] not-italic normal-nums normal-case"></i>
                      </i>{" "}
                      {data?.Vat15Amt}
                    </td>
                  </tr>
                  <tr>
                    <td className="money-info-first-td" style={{}}>
                      المبلغ الإجمالي بعد الضريبة
                    </td>
                    <td className="money-info-second-td">
                      <i>
                        <i className="font-riyal leading-[1px] before:content-[''] before:text-[calc(1em-2px)] not-italic normal-nums normal-case"></i>
                      </i>{" "}
                      {data?.Vt15TotalInclVat}
                    </td>
                  </tr>
                  <tr>
                    <td className="money-info-first-td" style={{}}>
                      الرصيد السابق
                    </td>
                    <td className="money-info-second-td">
                      <i>
                        <i className="font-riyal leading-[1px] before:content-[''] before:text-[calc(1em-2px)] not-italic normal-nums normal-case"></i>
                      </i>{" "}
                      {data?.PreBal}
                    </td>
                  </tr>
                  <tr className="total-row">
                    <td className="money-info-first-td" style={{}}>
                      مجموع المبلغ المستحق
                    </td>
                    <td className="money-info-second-td text-[21px]! font-semibold! leading-[25px]! tracking-[-.01em] text-[#000000e6]">
                      <i>
                        <i className="font-riyal font-normal! leading-[1px] before:content-[''] before:text-[calc(1em-2px)] not-italic normal-nums normal-case"></i>
                      </i>{" "}
                      {data?.TotalDueAmt}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          {/* Others */}
          <div className="mb-[30px] md:mb-0">
            <div
              id="heading1"
              onClick={() => setIsOthersInfoOpen(!isOthersInfoOpen)}
              data-target="#collapse_1"
              aria-controls="collapse_1"
              className="p-[15px_20px] shadow-[inset_0_1px_0_rgba(0,0,0,.2)] cursor-pointer flex justify-between items-center md:ml-0 md:mr-[30px]"
            >
              <h3 className="mr-0 ml-[20px] mb-0 text-[21px] leading-[25px] tracking-[-.01em] font-semibold">
                المعلومات الفنية
              </h3>
              <button
                className="bg-[#ff730026] text-[#ff7300] inline-flex items-center cursor-pointer min-w-[50px] justify-center border border-transparent p-[10px_15px_8px] text-[17px] leading-[20px] rounded-[40px]"
                style={{
                  transition: "color .5s,background-color .5s",
                }}
              >
                {isOthersInfoOpen ? (
                  <MinusIcon className="h-[20px]" />
                ) : (
                  <PlusIcon className="h-[20px]" />
                )}
              </button>
            </div>
            <div
              id="collapse_1"
              aria-labelledby="heading1"
              className={cn(
                "p-[0_20px] overflow-hidden transition-all duration-300",
                "md:max-w-[1380px]",
                isOthersInfoOpen ? "block" : "hidden"
              )}
            >
              <table className="w-full border-spacing-0 text-[#000000b3] table">
                <tbody>
                  <tr>
                    <td className="money-info-first-td" style={{}}>
                      بداية الفترة
                    </td>
                    <td className="money-info-second-td">
                      <span className="date-ar">
                        {getDateParts(data?.FromDate, true).dateText}
                        <span className="inline-block">
                          {getDateParts(data?.FromDate).year}
                        </span>
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="money-info-first-td">نهاية الفترة</td>
                    <td className="money-info-second-td">
                      <span className="date-ar">
                        {getDateParts(data?.ToDate).dateText}
                        <span className="inline-block">
                          {getDateParts(data?.ToDate).year}
                        </span>
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="money-info-first-td">
                      تاريخ القراءة السابق
                    </td>
                    <td className="money-info-second-td">
                      <span className="date-ar">
                        {
                          getDateParts(
                            data?.Bill_SlabPriceInfo?.results[
                              data?.Bill_SlabPriceInfo?.results.length - 1
                            ]?.FromDate,
                            true
                          ).dateText
                        }
                        <span className="inline-block">
                          {
                            getDateParts(
                              data?.Bill_SlabPriceInfo?.results[
                                data?.Bill_SlabPriceInfo?.results.length - 1
                              ]?.FromDate,
                              true
                            ).year
                          }
                        </span>
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="money-info-first-td" style={{}}>
                      قراءة العدّاد الحالي
                    </td>
                    <td className="money-info-second-td">
                      {Math.round(
                        parseFloat(
                          data?.Bill_MultiMeterDetail?.results[0]
                            ?.CurrentMtrRead || "0"
                        )
                      )
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </td>
                  </tr>
                  <tr>
                    <td className="money-info-first-td" style={{}}>
                      رقم العقار
                    </td>
                    <td className="money-info-second-td">{data?.Premise}</td>
                  </tr>
                  <tr>
                    <td className="money-info-first-td" style={{}}>
                      معامل الضرب
                    </td>
                    <td className="money-info-second-td">1</td>
                  </tr>
                  <tr>
                    <td className="money-info-first-td" style={{}}>
                      كمية الاستهلاك
                    </td>
                    <td className="money-info-second-td">
                      {data?.Bill_MultiMeterDetail.results[0]?.Consumption}{" "}
                      ك.و.س
                    </td>
                  </tr>
                  <tr>
                    <td className="money-info-first-td" style={{}}>
                      سعة القاطع
                    </td>
                    <td className="money-info-second-td">
                      {Math.round(
                        parseFloat(
                          data?.Bill_MultiMeterDetail.results[0]?.BreakerCap ||
                            "0"
                        )
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="money-info-first-td" style={{}}>
                      نوع العداد
                    </td>
                    <td className="money-info-second-td">
                      {data?.MeterTypeDesc}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          {/* Pay Button */}
          <div className="p-0 fixed bg-white bottom-0 left-0 right-0 w-full z-10 md:shadow-[0_1px_40px_rgba(0,0,0,.1)] md:p-[20px_0]">
            <div className="justify-end p-0 flex items-center flex-wrap max-w-[1440px] m-0 md:p-[0_30px]">
              <div className="justify-end flex gap-[10px] pay-button-shadow p-[15px_20px] w-full md:w-auto md:shadow-none! md:p-0">
                <button
                  className="min-w-[173px] inline-flex items-center bg-[#ff7300] cursor-pointer justify-center border
                border-transparent p-[10px_15px_8px] text-[17px] leading-[20px] rounded-[40px] text-white hover:bg-[#cc5c00] md:minw-[232px]"
                  onClick={() => window.location.href = "https://example.com/checkout"}
                >
                  <span className="p-[0_5px]">دفع الفاتورة </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillDetailsComponent;
