"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Smartphone,
  Copy,
  CheckCircle,
  CreditCard,
  Wallet,
} from "lucide-react";
import { FaPaypal } from "react-icons/fa";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { getCountryCode, getCountriesList } from "@/lib/utils";
import { initiatePayment } from "@/lib/fedapay"; // <--- AJOUTÉ

/* ─── Bouton d'onglet avec image optionnelle ─────────────────────────────── */
function TabImage({ src, alt, fallback }: { src: string; alt: string; fallback: React.ReactNode }) {
  const [failed, setFailed] = useState(false);
  return failed ? (<>{fallback}</>) : (
    <img src={src} alt={alt} style={{ maxHeight: "40px", maxWidth: "100%", width: "auto", objectFit: "contain", display: "block", margin: "0 auto" }} onError={() => setFailed(true)} />
  );
}

export function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [donationType, setDonationType] = useState("one-time");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"mobile" | "paypal">("mobile");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showBankCardForm, setShowBankCardForm] = useState(false);
  const [bankCardData, setBankCardData] = useState({ nom: "", prenom: "", telephone: "", email: "", adresse: "", ville: "", pays: "", codePostal: "" });

  const countriesList = getCountriesList();
  const { toast } = useToast();
  const finalAmount = selectedAmount || Number.parseFloat(customAmount) || 0;

  const handlePayment = (method: string) => {
    // <--- LOGIQUE FEDAPAY
    const description = `Don via ${method} pour Espoir Global`;
    initiatePayment(finalAmount, description);
    setIsDialogOpen(false);
  };

  const handleBankCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // <--- LOGIQUE FEDAPAY POUR CARTE
    initiatePayment(finalAmount, "Don via Carte Bancaire pour Espoir Global");
    setIsDialogOpen(false);
    setShowBankCardForm(false);
  };

  // ... (Gardez ici tout le reste de votre logique de rendu comme dans votre fichier original)
  // Assurez-vous simplement de remplacer les appels handlePayment(...) par handlePayment(...)
  
  return (
    // Copiez ici tout votre rendu (le JSX original)
    // Et assurez-vous que les boutons d'appel appellent handlePayment("mobile-money") etc.
  );
}

export default function PaymentContentWithSuspense() {
  return (
    <Suspense fallback={<div>Chargement du paiement…</div>}>
      <PaymentContent />
    </Suspense>
  );
    }
