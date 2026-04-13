"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Mail,
  MapPin,
  User,
  Send,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  Clock,
  Building,
  Facebook,
} from "lucide-react";
import { FaTiktok, FaWhatsapp } from "react-icons/fa";
import { useAppStore } from "@/lib/store";
import { useState } from "react";

export function ContactSection() {
  const {
    contactForm,
    updateContactForm,
    submitContactForm,
    newsletterEmail,
    setNewsletterEmail,
    subscribeNewsletter,
  } = useAppStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribeStatus, setSubscribeStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      await submitContactForm();
      setSubmitStatus("success");
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribing(true);
    setSubscribeStatus("idle");

    try {
      await subscribeNewsletter(newsletterEmail);
      setSubscribeStatus("success");
      setNewsletterEmail("");
    } catch (error) {
      setSubscribeStatus("error");
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <section
      id="contact"
      className="py-8 md:py-20 pb-24 md:pb-24 md:mx-32 lg:mx-48 xl:mx-64"
    >
      <div className="container mx-auto px-4 max-w-screen-xl">
        {/* Header */}
        <div className="text-center mb-8 md:mb-16">
          <div className="hidden md:inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl mb-6">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-indigo-700 md:bg-gradient-to-r md:from-indigo-600 md:to-indigo-800 md:bg-clip-text md:text-transparent mb-4 md:mb-6">
            Contactez-nous
          </h2>
          <p className="text-sm md:text-lg text-gray-600 md:max-w-2xl md:mx-auto md:leading-relaxed">
            Nous sommes à votre disposition pour répondre à vos questions.
            <span className="hidden md:inline">
              {" "}
              et vous accompagner dans votre démarche de soutien.
            </span>
          </p>
        </div>

        <div className="flex flex-col space-y-8 md:space-y-12">
          {/* Contact Form */}
          <div className="bg-white p-4 md:p-12 rounded-lg md:rounded-2xl shadow-sm md:shadow-2xl md:border md:border-gray-100">
            {submitStatus === "success" && (
              <div className="mb-4 md:mb-6 p-4 bg-green-50 md:bg-gradient-to-r md:from-green-50 md:to-emerald-50 border border-green-200 rounded-lg md:rounded-xl flex items-center">
                <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-600 mr-2 md:mr-3" />
                <span className="text-green-800 md:font-medium">
                  Message envoyé avec succès ! Nous vous répondrons bientôt.
                  <span className="hidden md:inline">
                    {" "}
                    dans les plus brefs délais.
                  </span>
                </span>
              </div>
            )}

            {submitStatus === "error" && (
              <div className="mb-4 md:mb-6 p-4 bg-red-50 md:bg-gradient-to-r md:from-red-50 md:to-pink-50 border border-red-200 rounded-lg md:rounded-xl flex items-center">
                <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-red-600 mr-2 md:mr-3" />
                <span className="text-red-800 md:font-medium">
                  Erreur lors de l'envoi. Veuillez réessayer.
                  <span className="hidden md:inline">
                    {" "}
                    ou nous contacter directement.
                  </span>
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium md:font-semibold md:text-gray-700 md:mb-2 md:block"
                  >
                    Nom complet *
                  </Label>
                  <div className="relative mt-1 md:mt-0">
                    <User className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Votre nom"
                      className="pl-10 md:pl-12 h-12 md:h-14 md:text-base md:border-2 md:border-gray-200 md:rounded-xl md:focus:border-indigo-500 md:focus:ring-indigo-500 md:transition-all md:duration-300"
                      value={contactForm.name || ""}
                      onChange={(e) =>
                        updateContactForm({ name: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium md:font-semibold md:text-gray-700 md:mb-2 md:block"
                  >
                    Email *
                  </Label>
                  <div className="relative mt-1 md:mt-0">
                    <Mail className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Votre email"
                      className="pl-10 md:pl-12 h-12 md:h-14 md:text-base md:border-2 md:border-gray-200 md:rounded-xl md:focus:border-indigo-500 md:focus:ring-indigo-500 md:transition-all md:duration-300"
                      value={contactForm.email || ""}
                      onChange={(e) =>
                        updateContactForm({ email: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label
                  htmlFor="subject"
                  className="text-sm font-medium md:font-semibold md:text-gray-700 md:mb-2 md:block"
                >
                  Sujet
                </Label>
                <Select
                  value={contactForm.subject || ""}
                  onValueChange={(value) =>
                    updateContactForm({ subject: value })
                  }
                >
                  <SelectTrigger className="mt-1 md:mt-0 h-12 md:h-14 md:text-base md:border-2 md:border-gray-200 md:rounded-xl md:focus:border-indigo-500 md:focus:ring-indigo-500">
                    <SelectValue placeholder="Choisir un sujet" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">Question générale</SelectItem>
                    <SelectItem value="donation">Don et parrainage</SelectItem>
                    <SelectItem value="partnership">Partenariat</SelectItem>
                    <SelectItem value="volunteer">Bénévolat</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label
                  htmlFor="message"
                  className="text-sm font-medium md:font-semibold md:text-gray-700 md:mb-2 md:block"
                >
                  Message *
                </Label>
                <Textarea
                  id="message"
                  rows={6}
                  placeholder="Votre message"
                  className="mt-1 md:mt-0 resize-none md:text-base md:border-2 md:border-gray-200 md:rounded-xl md:focus:border-indigo-500 md:focus:ring-indigo-500 md:transition-all md:duration-300"
                  value={contactForm.message || ""}
                  onChange={(e) =>
                    updateContactForm({ message: e.target.value })
                  }
                  required
                />
              </div>

              <div className="flex justify-center">
                <Button
                  type="submit"
                  className="w-full md:w-auto bg-indigo-700 hover:bg-indigo-800 md:bg-gradient-to-r md:from-indigo-600 md:to-indigo-700 md:hover:from-indigo-700 md:hover:to-indigo-800 text-white h-12 md:px-10 md:py-4 md:text-lg md:font-semibold md:rounded-xl md:shadow-xl md:hover:shadow-2xl md:transform md:hover:scale-105 md:transition-all md:duration-300 px-8"
                  disabled={isSubmitting}
                >
                  <Send className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
                </Button>
              </div>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6 md:space-y-8">
            {/* Coordonnées */}
            <div className="bg-gray-50 md:bg-gradient-to-br md:from-gray-50 md:to-indigo-50 p-6 md:p-10 rounded-lg md:rounded-2xl md:border md:border-indigo-100">
              <div className="flex items-center mb-6 md:mb-8">
                <div className="hidden md:flex w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl items-center justify-center mr-4">
                  <Building className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold md:text-2xl text-gray-800 text-lg">
                  Nos coordonnées
                </h3>
              </div>

              <div className="space-y-6 md:grid md:grid-cols-3 md:gap-8 md:space-y-0">
                <div className="flex items-start md:group">
                  <Mail className="text-indigo-700 md:text-indigo-600 mt-1 mr-4 w-5 h-5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-base md:text-lg font-medium md:font-semibold md:text-gray-800 md:group-hover:text-indigo-600 md:transition-colors break-words">
                      <span className="block">contact@espoir-global.org</span>
                      <span className="block">ongsoutienplus@gmail.com</span>
                    </p>
                    <p className="text-sm text-gray-500 md:text-gray-600">
                      Pour toute question générale
                    </p>
                  </div>
                </div>

                <div className="flex items-start md:group">
                  <FaWhatsapp className="text-indigo-700 md:text-indigo-600 mt-1 mr-4 w-5 h-5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-base md:text-lg font-medium md:font-semibold md:text-gray-800 md:group-hover:text-indigo-600 md:transition-colors">
                      +33 7 53 81 40 72
                    </p>
                    <p className="text-sm text-gray-500 md:text-gray-600 md:flex md:items-center">
                      <Clock className="hidden md:block w-3 h-3 mr-1" />
                      Lun-Ven, 9h-18h (CET)
                    </p>
                  </div>
                </div>

                <div className="flex items-start md:group">
                  <MapPin className="text-indigo-700 md:text-indigo-600 mt-1 mr-4 w-5 h-5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-base md:text-lg font-medium md:font-semibold md:text-gray-800 md:group-hover:text-indigo-600 md:transition-colors break-words">
                      15 Rue de l'Espoir, 75001 Paris
                    </p>
                    <p className="text-sm text-gray-500 md:text-gray-600">
                      Siège social
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            {/* Newsletter */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {/* Social Media */}
              <div className="bg-white p-6 md:p-10 rounded-lg md:rounded-2xl shadow-sm md:shadow-xl md:border md:border-gray-100 md:col-span-2">
                <div className="text-center mb-6 md:mb-8">
                  <h3 className="font-semibold md:text-2xl text-gray-800 mb-6 text-lg md:mb-4">
                    Suivez-nous
                    <span className="hidden md:inline"> sur les réseaux</span>
                  </h3>
                  <p className="hidden md:block text-gray-600">
                    Restez connectés avec nos actions et découvrez l'impact de
                    votre soutien
                  </p>
                </div>

                <div className="flex justify-center space-x-4 md:space-x-8">
                  <a
                    href="https://www.tiktok.com/@sourireretrouve"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-11 h-11 md:group md:flex-col md:items-center bg-black md:bg-gradient-to-br md:from-gray-800 md:to-black text-white rounded-full md:rounded-2xl hover:bg-gray-800 md:w-16 md:h-16 transition-colors md:mb-3 md:shadow-xl md:group-hover:shadow-2xl md:transform md:group-hover:scale-110 md:transition-all md:duration-300"
                    aria-label="Suivez-nous sur TikTok"
                  >
                    <FaTiktok className="w-6 h-6 md:w-8 md:h-8" />
                  </a>
                  <a
                    href="https://wa.me/22872703933"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-11 h-11 md:group md:flex-col md:items-center bg-green-500 md:bg-gradient-to-br md:from-green-500 md:to-green-600 text-white rounded-full md:rounded-2xl hover:bg-green-600 md:w-16 md:h-16 transition-colors md:mb-3 md:shadow-xl md:group-hover:shadow-2xl md:transform md:group-hover:scale-110 md:transition-all md:duration-300"
                    aria-label="Contactez-nous sur WhatsApp"
                  >
                    <FaWhatsapp className="w-6 h-6 md:w-8 md:h-8" />
                  </a>
                  <a
                    href="https://www.facebook.com/profile.php?id=61574260992386"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-11 h-11 md:group md:flex-col md:items-center bg-blue-600 md:bg-gradient-to-br md:from-blue-600 md:to-blue-700 text-white rounded-full md:rounded-2xl hover:bg-blue-700 md:w-16 md:h-16 transition-colors md:mb-3 md:shadow-xl md:group-hover:shadow-2xl md:transform md:group-hover:scale-110 md:transition-all md:duration-300"
                    aria-label="Suivez-nous sur Facebook"
                  >
                    <Facebook className="w-6 h-6 md:w-8 md:h-8" />
                  </a>
                </div>

                {/* Desktop labels */}
                <div className="hidden md:flex justify-center space-x-6 mt-4">
                  <span className="text-sm font-medium text-gray-600 hover:text-gray-800">
                    TikTok
                  </span>
                  <span className="text-sm font-medium text-gray-600 hover:text-gray-800">
                    WhatsApp
                  </span>
                  <span className="text-sm font-medium text-gray-600 hover:text-gray-800">
                    Facebook
                  </span>
                </div>
              </div>

              {/* Newsletter */}
              <div className="bg-white md:bg-gradient-to-br md:from-indigo-50 md:to-blue-50 p-6 md:p-10 rounded-lg md:rounded-2xl shadow-sm md:border md:border-indigo-200 md:col-span-2">
                <div className="text-center mb-6 md:mb-8">
                  <div className="hidden md:inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl mb-4">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold md:text-2xl text-gray-800 mb-6 text-lg md:mb-4">
                    Inscrivez-vous à notre newsletter
                    <span className="hidden md:block md:text-xl">
                      Newsletter
                    </span>
                  </h3>
                  <p className="hidden md:block text-gray-600">
                    Recevez nos actualités et découvrez l'impact concret de
                    votre soutien
                  </p>
                </div>

                {subscribeStatus === "success" && (
                  <div className="mb-4 md:mb-6 p-3 md:p-4 bg-green-50 md:bg-gradient-to-r md:from-green-50 md:to-emerald-50 border border-green-200 rounded-lg md:rounded-xl flex items-center md:justify-center">
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-600 mr-2" />
                    <span className="text-green-800 text-sm md:font-medium">
                      Inscription réussie ! Vérifiez votre email.
                    </span>
                  </div>
                )}

                {subscribeStatus === "error" && (
                  <div className="mb-4 md:mb-6 p-3 md:p-4 bg-red-50 md:bg-gradient-to-r md:from-red-50 md:to-pink-50 border border-red-200 rounded-lg md:rounded-xl flex items-center md:justify-center">
                    <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-red-600 mr-2" />
                    <span className="text-red-800 text-sm md:font-medium">
                      Erreur lors de l'inscription. Réessayez.
                    </span>
                  </div>
                )}

                <form
                  onSubmit={handleNewsletterSubmit}
                  className="space-y-4 md:space-y-6"
                >
                  <Input
                    type="email"
                    placeholder="Votre email"
                    className="h-12 md:h-14 md:text-base md:border-2 md:border-indigo-200 md:rounded-xl md:focus:border-indigo-500 md:focus:ring-indigo-500 md:bg-white/80 md:backdrop-blur-sm"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    required
                  />
                  <div className="flex justify-center">
                    <Button
                      type="submit"
                      className="w-full md:w-auto bg-indigo-700 hover:bg-indigo-800 md:bg-gradient-to-r md:from-indigo-600 md:to-indigo-700 md:hover:from-indigo-700 md:hover:to-indigo-800 text-white h-12 md:px-10 md:py-4 md:text-lg md:font-semibold md:rounded-xl md:shadow-xl md:hover:shadow-2xl md:transform md:hover:scale-105 md:transition-all md:duration-300"
                      disabled={isSubscribing}
                    >
                      {isSubscribing ? "..." : "S'inscrire"}
                      <span className="hidden md:inline">
                        {isSubscribing ? "Inscription..." : " à la newsletter"}
                      </span>
                    </Button>
                  </div>
                </form>
                <p className="text-xs text-gray-500 mt-3 md:mt-4 md:text-center md:leading-relaxed">
                  Recevez des nouvelles de nos actions et de l'impact de vos
                  dons.
                  <span className="hidden md:block">
                    Histoires inspirantes • Rapports d'impact • Invitations
                    événements • Désabonnement facile
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
