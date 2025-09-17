"use client";

import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import LoadingComponent from "./loading";
import ErrorToast from "@/components/ui/error-toast";
import { getBillDetailsWithFallback } from "@/lib/se-api";
import { type BillDetails, type SEApiResponse } from "@/lib/types";

type Props = {
  onSuccess: (accountNumber: string, billData: BillDetails) => void;
};

const formSchema = z.object({
  accountNumber: z.string().min(9).max(14),
});

const AccountNumberComponent = ({ onSuccess }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountNumber: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError("");

    if (
      values.accountNumber.startsWith("1") ||
      values.accountNumber.startsWith("2")
    ) {
      setIsLoading(false);
      form.reset();
      setError(
        ".لا يمكن عرض الفاتورة باستخدام رقم الهوية، يرجى ادخال رقم الحساب"
      );
      return;
    }

    try {
      // Call the Saudi Electric API
      const response = await getBillDetailsWithFallback(values.accountNumber);

      // Check if SE returned an error
      if (response.Error?.ErrorMessage) {
        setError(response.Error.ErrorMessage); // Use SE's actual Arabic error message
        return;
      }

      // Check if we have valid bill data
      if (!response.d) {
        setError("هناك خطأ ما. حاول مرة اخرى");
        return;
      }

      // Call the onSuccess callback to open the modal
      onSuccess(values.accountNumber, response.d);
    } catch (err) {
      console.error("Error fetching bill details:", err);
      // Always show the Arabic error message for any error
      setError("هناك خطأ ما. حاول مرة اخرى");
    } finally {
      setIsLoading(false);
      form.reset();
    }
  }
  // de[]
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mb-[30px]">
        {/* Loading Component */}
        <LoadingComponent isVisible={isLoading} />

        {/* Account Number Input */}
        <FormField
          control={form.control}
          name="accountNumber"
          render={({ field }) => (
            <FormItem className="mb-[30px]">
              <FormLabel className="text-[15px] leading-[20px] text-[#000000b3] block mb-[10px]">
                رقم الحساب أو الهوية
              </FormLabel>
              <FormControl className="relative">
                <Input
                  className="input-style"
                  placeholder="مثال: 1234567890"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  minLength={10}
                  maxLength={11}
                  {...field}
                  onChange={(e) => {
                    // Only allow numeric characters
                    const numericValue = e.target.value.replace(/[^0-9]/g, "");
                    field.onChange(numericValue);
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Error Toast */}
        {error && (
          <ErrorToast
            error={error}
            onDismiss={() => setError("")}
            duration={3000}
          />
        )}

        {/* Submit Button */}
        <div className="button-mobile flex justify-end">
          <Button
            type="submit"
            disabled={isLoading || !form.formState.isValid}
            className={cn(
              "button-style",
              form.formState.isValid && !isLoading
                ? "bg-[#ff7300] text-white hover:bg-[#cc5c00]"
                : "bg-[#f5f3f1] text-[#00000033] pointer-events-none select-none"
            )}
          >
            <span className="px-[5px]">
              {isLoading ? "جاري التحميل..." : "استمر"}
            </span>
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AccountNumberComponent;
