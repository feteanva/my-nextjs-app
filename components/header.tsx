import Link from "next/link";
import Image from "next/image";
import React from "react";
import { XIcon } from "lucide-react";

type Props = {
  isModal?: boolean;
  onClose?: () => void;
};

const HeaderComponent = ({ isModal, onClose }: Props) => {
  return (
    <div className="bg-white fixed w-full z-10 top-0 left-0 shadow-[0_.5px_0_rgba(0,0,0,.2)]">
      <div className="px-5 py-[15px] flex items-center justify-between h-[70px] relative max-w-[1440px] mx-auto">
        <Link href="/">
          <Image src="/logo.svg" alt="logo" width={35} height={40} />
        </Link>
        <Link href="/" onClick={() => isModal && onClose?.()}>
          <div className="w-[48px] h-[40px] rounded-[40px] flex items-center justify-center bg-[#ff730026] hover:bg-[#ff73004d] transition duration-500 ease-in-out">
            <XIcon className="w-[24px] h-[24px] text-[#ff7300]" />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default HeaderComponent;
