"use client";

import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import HeaderComponent from "@/components/header";
import { type BillDetails } from "@/lib/types";
import BillDetailsComponent from "./bill-details";

type Props = {
  data: BillDetails | null;
  isOpen: boolean;
  onClose: () => void;
  accountNumber: string;
  domain: string;
};

const GuestBillModal = ({
  isOpen,
  onClose,
  accountNumber,
  data,
  domain,
}: Props) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTitle></DialogTitle>
      <DialogContent
        fullScreen={true}
        showCloseButton={false}
        className="bg-white"
        style={{
          animation: isOpen
            ? "modal-scale-in 0.2s ease-out"
            : "modal-scale-out 0.2s ease-out",
          transformOrigin: "center center",
        }}
      >
        <div className="w-full h-full">
          <HeaderComponent isModal={true} onClose={onClose} />
          <div className="min-h-[calc(100vh - 70px)] w-full relative">
            <div className="pb-[100px] pt-[80px] md:pt-[120px] md:pb-0 xl:pt-[150px] xl:pb-[150px] xl:w-full xl:h-full">
              {/* Account Number */}
              <div className="p-[0_20px] max-w-[640px] mx-auto md:p-0">
                <div className="text-center flex justify-start mb-[30px] mt-[20px] md:block md:mb-[50px]">
                  <p className="hidden normal-case text-[11px] tracking-[0.02em] mb-[10px] text-[#00000080] md:block md:text-[13px] md:tracking-[0.05em] md:leading-[15px] md:mb-[20px] font-bold">
                    عرض ودفع الفواتير
                  </p>
                  <h1 className="text-[27px] tracking-[-.02em] leading-[1.296] font-bold md:tracking-[-.03em] md:text-[1.6em] md:leading-[1.15]">
                    {accountNumber}
                  </h1>
                </div>
              </div>
              {/* Bill Details */}
              <BillDetailsComponent
                data={data}
                domain={domain}
                accountNumber={accountNumber}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GuestBillModal;
