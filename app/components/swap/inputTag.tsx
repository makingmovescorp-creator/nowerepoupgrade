"use client";

import { useEffect, useState } from "react";
import ShowBalance from "./showBalance";
import TokenModal from "./tokenModal";
import InputLoadingGif from "./inputLoadingGif";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import Image from "next/image";

export default function InputTag(props: any) {
  const {
    balance,
    amount,
    setAmount,
    token,
    opToken,
    setToken,
    no,
    isAmountCalcing,
    setIsInsufficient,
    USDprice,
    showMAXbtn,
    showTokenSelect = true,
  } = props;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    let bal = token.isNative ? balance - 5 : balance;
    if (amount > Number(bal) && !no)
      setIsInsufficient(true); //check input amount is valid
    else setIsInsufficient(false);
  }, [amount]);

  const handleAmountChange = (e: any) => {
    const value: number = e.target.value as number;
    setAmount(value);
  };

  const getTokenIcon = (symbol: string) => {
    const key = (symbol || '').toUpperCase();
    const iconMap: { [key: string]: string } = {
      'PLS': '/icons/WPLS.avif', // Native PLS uses WPLS icon
      'WPLS': '/icons/WPLS.avif',
      'PLSX': '/icons/plsx.avif',
      'ETH': '/icons/eth.avif',
      'WETH': '/icons/eth.avif',
      'HEX': '/icons/hex.avif',
      'EHEX': '/icons/hex.avif',
      'DAI': '/icons/dai.avif',
      'PDAI': '/icons/dai.avif',
      'USDC': '/icons/usdc.avif',
      'PUSDC': '/icons/usdc.avif',
      'WBTC': '/icons/pwbtc.avif',
      'PWBTC': '/icons/pwbtc.avif',
      'INC': '/icons/inc.avif',
    };
    return iconMap[key] || '/icons/WPLS.avif'; // Default to WPLS icon
  };

  return (
    <>
      <div className="grid justify-items-end mt-5">
        <div className="flex">
          <ShowBalance balance={balance} />
        </div>
      </div>
      <div
        className={`flex relative justify-between w-[100%] sm:h-[50px] h-[42px] border border-black-border px-[15px] -mt-[11px]`}
      >
        <InputLoadingGif isLoading={isAmountCalcing} />

        <input
          onChange={handleAmountChange}
          value={
            amount
              ? amount == 0
                ? 0
                : Math.floor(Number(amount) * 1000) / 1000
              : ""
          }
          disabled={no}
          type="number"
          className={`${
            isAmountCalcing ? "text-[#666]" : "text-white"
          } numberInput bg-transparent disabled:cursor-not-allowed w-[60%] text-left outline-none text-xs font-medium sm:h-[50px] h-[42px] transition-colors`}
          placeholder="0"
        />
        {showMAXbtn ? (
          <div
            onClick={() => {
              if (token.isNative) setAmount(balance - 5);
              else setAmount(balance);
            }}
            className="flex justify-items-end items-center pl-3 hover:cursor-pointer"
          >
            <h1 className="text-right text-white hover:text-balance transition-3 text-xs font-medium">
              MAX
            </h1>
          </div>
        ) : (
          <></>
        )}
        {showTokenSelect ? (
          <div className="flex items-center justify-center">
            <button
              onClick={openModal}
              className="w-full inline-flex items-center gap-2 py-1.5 px-3 text-xs font-medium text-white shadow-white/10 focus:outline-none data-[hover]:bg-gray-700 data-[open]:bg-gray-700 data-[focus]:outline-none"
            >
              <div className="flex gap-3 place-items-center">
                <div className="flex justify-center place-items-center relative w-5 h-5 ">
                  <Image
                    className="rounded-full"
                    src={getTokenIcon(token.symbol)}
                    fill
                    alt=""
                  />
                </div>
                {token.symbol}
              </div>
              <MdOutlineKeyboardArrowDown className="text-lg" />
            </button>
            <TokenModal
              isOpen={isModalOpen}
              onClose={closeModal}
              opToken={opToken}
              title="Select a token"
              otherToken={token}
              setToken={setToken}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <div className="w-full inline-flex items-center gap-2 py-1.5 px-3 text-xs font-medium text-white">
              <div className="flex gap-3 place-items-center">
                <div className="flex justify-center place-items-center relative w-5 h-5 ">
                  <Image
                    className="rounded-full"
                    src={getTokenIcon(token.symbol)}
                    fill
                    alt=""
                  />
                </div>
                {token.symbol}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
