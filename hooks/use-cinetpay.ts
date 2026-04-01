"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface PaymentData {
  amount: number;
  description: string;
  customerName: string;
  customerSurname: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress?: string;
  customerCity?: string;
  customerCountry?: string;
  customerState?: string;
  customerZipCode?: string;
  channels: "ALL" | "MOBILE_MONEY" | "CREDIT_CARD" | "WALLET";
  metadata?: string;
}

declare global {
  interface Window {
    CinetPay: {
      setConfig: (data: {
        apikey: string;
        site_id: string;
        mode: "PRODUCTION" | "SANDBOX";
        notify_url: string;
        return_url?: string;
        lock_phone_number?: boolean;
      }) => void;
      getCheckout: (data: {
        amount: number;
        transaction_id: string;
        currency: string;
        description: string;
        customer_name?: string;
        customer_surname?: string;
        customer_email?: string;
        customer_phone_number?: string;
        customer_address?: string;
        customer_city?: string;
        customer_country?: string;
        customer_state?: string;
        customer_zip_code?: string;
        channels: "ALL" | "MOBILE_MONEY" | "CREDIT_CARD" | "WALLET";
        metadata?: string;
        lang?: string;
      }) => void;
      waitResponse: (callback: (data: { status: string }) => void) => void;
      closeCheckout: () => void;
    };
    _cinetpayObserver?: MutationObserver;
  }
}

export function useCinetPay() {
  const router = useRouter();
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const observerRef = useRef<MutationObserver | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const shouldReloadRef = useRef(false);

  const cleanupCinetPay = () => {
    try {
      // Only attempt to close checkout if CinetPay is properly initialized
      if (
        isInitialized &&
        window.CinetPay &&
        typeof window.CinetPay.closeCheckout === "function"
      ) {
        try {
          window.CinetPay.closeCheckout();
        } catch (closeError) {
          console.warn("Error closing CinetPay checkout:", closeError);
        }
      }

      // Remove the script tag if it exists
      if (scriptRef.current && document.body.contains(scriptRef.current)) {
        document.body.removeChild(scriptRef.current);
      }

      // Remove CinetPay iframe if it exists
      const cinetpayFrame = document.querySelector('iframe[src*="cinetpay"]');
      if (cinetpayFrame && cinetpayFrame.parentNode) {
        cinetpayFrame.parentNode.removeChild(cinetpayFrame);
      }

      // Remove custom styles
      const customStyles = document.querySelector(
        "style[data-cinetpay-styles]"
      );
      if (customStyles && customStyles.parentNode) {
        customStyles.parentNode.removeChild(customStyles);
      }

      // Remove observer script
      const observerScript = document.querySelector(
        "script[data-cinetpay-observer]"
      );
      if (observerScript && observerScript.parentNode) {
        observerScript.parentNode.removeChild(observerScript);
      }

      // Remove body class
      document.body.classList.remove("cinetpay-open");

      // Cleanup existing observer
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      if (window._cinetpayObserver) {
        window._cinetpayObserver.disconnect();
        delete window._cinetpayObserver;
      }

      // Reset initialization state
      setIsInitialized(false);

      // Only reload if the flag is set (modal was closed by user)
      if (shouldReloadRef.current) {
        shouldReloadRef.current = false;
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    } catch (error) {
      console.error("Error during cleanup:", error);
    }
  };

  const initializeCinetPay = () => {
    // Clean up any existing instances first
    cleanupCinetPay();

    // Add custom styles for CinetPay iframe
    const style = document.createElement("style");
    style.setAttribute("data-cinetpay-styles", "");
    style.textContent = `
      .cp-modal {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        background-color: rgba(0, 0, 0, 0.5) !important;
        z-index: 999999 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
      }

      .cp-modal .cp-content-wrapper {
        position: relative !important;
        width: 100% !important;
        height: 100% !important;
        max-width: 100% !important;
        max-height: 100% !important;
        padding: 0 !important;
        margin: 0 !important;
        background: transparent !important;
      }

      .cp-modal .cp-content {
        width: 100% !important;
        height: 100% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
      }

      #checkout {
        width: 100% !important;
        height: 100% !important;
        border: none !important;
        background: white !important;
      }

      .cp-modal .cp-content-wrapper .cp-close {
        position: fixed !important;
        top: 10px !important;
        right: 10px !important;
        z-index: 999999 !important;
        width: 30px !important;
        height: 30px !important;
        background: white !important;
        border-radius: 50% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2) !important;
        cursor: pointer !important;
      }

      @media (min-width: 768px) {
        .cp-modal .cp-content-wrapper {
          width: 450px !important;
          height: 600px !important;
          max-height: 90vh !important;
          border-radius: 12px !important;
          overflow: hidden !important;
        }

        #checkout {
          border-radius: 12px !important;
        }
      }

      @media (max-width: 767px) {
        body.cinetpay-open {
          position: fixed !important;
          width: 100% !important;
          height: 100% !important;
          overflow: hidden !important;
        }

        .cp-modal {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          -webkit-overflow-scrolling: touch !important;
        }

        #checkout {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          width: 100% !important;
          height: 100% !important;
        }
      }
    `;
    document.head.appendChild(style);

    // Add observer script with unique namespace
    const script = document.createElement("script");
    script.setAttribute("data-cinetpay-observer", "");
    script.textContent = `
      if (!window._cinetpayObserver) {
        window._cinetpayObserver = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
              const modal = document.querySelector('.cp-modal');
              if (modal) {
                document.body.classList.add('cinetpay-open');
              } else {
                document.body.classList.remove('cinetpay-open');
              }
            }
          });
        });
        
        window._cinetpayObserver.observe(document.body, {
          childList: true,
          subtree: true
        });
      }
    `;
    document.head.appendChild(script);

    const mainScript = document.createElement("script");
    mainScript.src = "https://cdn.cinetpay.com/seamless/main.js";
    mainScript.async = true;
    document.body.appendChild(mainScript);
    scriptRef.current = mainScript;

    mainScript.onload = () => {
      if (window.CinetPay) {
        window.CinetPay.setConfig({
          apikey: process.env.NEXT_PUBLIC_CINETPAY_API_KEY!,
          site_id: process.env.NEXT_PUBLIC_CINETPAY_SITE_ID!,
          mode:
            process.env.NODE_ENV === "production" ? "PRODUCTION" : "SANDBOX",
          notify_url: "",
        });
        setIsInitialized(true);
      }
    };

    mainScript.onerror = () => {
      console.error("Failed to load CinetPay script");
      setIsInitialized(false);
    };
  };

  const handleMobilePayment = async (
    data: PaymentData
  ): Promise<{ success: boolean; transactionId: string }> => {
    if (!isInitialized) {
      throw new Error("CinetPay is not initialized");
    }

    return new Promise((resolve) => {
      const transactionId = `MG-${btoa(Date.now().toString())}`;

      const paymentData = {
        amount: data.amount,
        transaction_id: transactionId,
        currency: "XOF",
        description: data.description,
        customer_name: data.customerName,
        customer_surname: data.customerSurname,
        customer_email: data.customerEmail,
        customer_phone_number: data.customerPhone,
        customer_address: data.customerAddress,
        customer_city: data.customerCity,
        customer_country: data.customerCountry || "TG",
        customer_state: data.customerState,
        customer_zip_code: data.customerZipCode,
        channels: data.channels,
        metadata: data.metadata,
      };

      window.CinetPay.getCheckout(paymentData);

      // Handle both response and close events
      let isResolved = false;

      window.CinetPay.waitResponse((response: any) => {
        if (!isResolved) {
          isResolved = true;
          cleanupCinetPay();

          const success = response.status === "ACCEPTED";
          if (success) {
            router.push("/commande/traitement");
          }

          resolve({
            success,
            transactionId,
          });
        }
      });

      // Handle modal close without payment
      const closeObserver = new MutationObserver(() => {
        const modal = document.querySelector(".cp-modal");
        if (!modal && !isResolved) {
          isResolved = true;
          shouldReloadRef.current = true; // Set flag to reload when modal closes
          cleanupCinetPay();
          resolve({
            success: false,
            transactionId,
          });
        }
      });

      closeObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });
      observerRef.current = closeObserver;
    });
  };

  useEffect(() => {
    initializeCinetPay();
    return () => {
      cleanupCinetPay();
    };
  }, []);

  return { handleMobilePayment, isInitialized };
}
