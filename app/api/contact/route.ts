import { Resend } from "resend"
import { type NextRequest, NextResponse } from "next/server"
import { contactFormSchema } from "@/lib/schemas"

const RESEND_API_KEY = "re_VyvPDzQt_2JJC3rZ7kd49Cue62SLaPzdJ"
const resend = new Resend(RESEND_API_KEY) 

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate the form data
    const validatedData = contactFormSchema.parse(body)

    // Use Resend's default domain for testing - replace with your verified domain in production
    const fromEmail = "noreply@updates.ideogrow.com"
    const toEmail = "steveblue278@gmail.com" // This is Resend's test email that always works

    // Send email to organization
    const orgEmailResult = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      subject: `Nouveau message de contact: ${validatedData.subject || "Sans sujet"}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4f46e5;">Nouveau message de contact</h2>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Nom:</strong> ${validatedData.name}</p>
            <p><strong>Email:</strong> ${validatedData.email}</p>
            <p><strong>Sujet:</strong> ${validatedData.subject || "Non spécifié"}</p>
          </div>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #374151;">Message:</h3>
            <p style="background-color: #f9fafb; padding: 15px; border-left: 4px solid #4f46e5; margin: 10px 0;">
              ${validatedData.message}
            </p>
          </div>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          
          <p style="color: #6b7280; font-size: 14px;">
            Ce message a été envoyé depuis le formulaire de contact du site web Espoir Global.
          </p>
        </div>
      `,
    })

    console.log("Organization email sent:", orgEmailResult)

    // Send confirmation email to user
    const userEmailResult = await resend.emails.send({
      from: fromEmail,
      to: [validatedData.email],
      subject: "Confirmation de réception de votre message - Espoir Global",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4f46e5;">Merci pour votre message !</h2>
          
          <p>Bonjour ${validatedData.name},</p>
          
          <p>Nous avons bien reçu votre message et nous vous remercions de nous avoir contactés.</p>
          
          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0ea5e9;">
            <p><strong>Votre message:</strong></p>
            <p style="font-style: italic;">"${validatedData.message}"</p>
          </div>
          
          <p>Notre équipe examinera votre demande et vous répondra dans les plus brefs délais, généralement sous 48 heures.</p>
          
          <p>En attendant, n'hésitez pas à découvrir nos actions sur notre site web ou à nous suivre sur nos réseaux sociaux.</p>
          
          <p style="margin-top: 30px;">
            Cordialement,<br>
            <strong>L'équipe Espoir Global</strong>
          </p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          
          <div style="color: #6b7280; font-size: 14px;">
            <p><strong>Espoir Global</strong></p>
            <p>15 Rue de l'Espoir, 75001 Paris</p>
            <p>Téléphone: +33 1 23 45 67 89</p>
            <p>Email: contact@espoirglobal.org</p>
          </div>
        </div>
      `,
    })

    console.log("User confirmation email sent:", userEmailResult)

    return NextResponse.json({
      success: true,
      message: "Message envoyé avec succès",
      data: {
        orgEmailId: orgEmailResult.data?.id,
        userEmailId: userEmailResult.data?.id,
      },
    })
  } catch (error) {
    console.error("Error sending contact email:", error)

    // More detailed error handling
    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          error: "Erreur lors de l'envoi du message",
          details: error.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: "Erreur inconnue lors de l'envoi du message",
      },
      { status: 500 },
    )
  }
}
