"use client";

import Link from "next/link";
import AccountNumberComponent from "@/components/account-number";
import HeaderComponent from "@/components/header";
import GuestBillModal from "@/components/guest-bill-modal";
import { useState, useEffect } from "react";
import { type BillDetails } from "@/lib/types";

const fetchDomain = async () => {
  const response = await fetch("/api/settings/site-info");
  const data = await response.json();
  return data.domain;
};

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accountNumber, setAccountNumber] = useState("");
  const [billData, setBillData] = useState<BillDetails | null>(null);
  const [domain, setDomain] = useState<string>("");

  useEffect(() => {
    const loadDomain = async () => {
      try {
        const domainValue = await fetchDomain();
        setDomain(domainValue);
        console.log(domainValue, "domain");
      } catch (error) {
        console.error("Error fetching domain:", error);
        // Set fallback domain
        setDomain("https://karinity.com");
      }
    };

    loadDomain();
  }, []);

  const handleOpenModal = (accNumber: string, billData: BillDetails) => {
    setAccountNumber(accNumber);
    setIsModalOpen(true);
    setBillData(billData);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setAccountNumber("");
  };

  return (
    <>
      <div>
        <HeaderComponent />
        <div className="min-h-[calc(100vh - 70px)] w-full relative">
          <div className="pb-[100px] pt-[80px] md:pt-[120px] md:pb-0 xl:pt-[150px] xl:pb-[150px] xl:w-full xl:h-full">
            <div className="pt-[66px] px-[20px] pb-[120px] max-w-[510px] mx-auto md:max-w-[511px] md:px-[30px]">
              {/* Content */}
              <div className="mt-[20px] mb-[50px] text-center md:mt-0">
                <h1 className="text-[27px] tracking-[-.02em] leading-[1.296] font-bold">
                  عرض ودفع الفواتير
                </h1>
                <p className="text-[15px] leading-[20px] mt-[10px] text-[#000000b3] mb-[20px] md:text-[#000] md:opacity-70 md:text-base md:leading-normal">
                  <span>
                    يرجى إدخال رقم حسابك لعرض ومتابعة دفع فاتورتك. يمكنك أيضًا{" "}
                    <Link
                      href={"/"}
                      className="bg-transparent text-[#ff7300] text-[1em] cursor-pointer underline"
                    >
                      تسجيل الدخول
                    </Link>
                    &nbsp;للحصول على المزيد من الخدمات{" "}
                  </span>
                </p>
              </div>
              {/* Account Number */}
              <AccountNumberComponent onSuccess={handleOpenModal} />
            </div>
          </div>
        </div>
      </div>

      {/* Full-screen Modal */}
      <GuestBillModal
        data={billData}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        accountNumber={accountNumber}
        domain={domain}
      />
    </>
  );
}
