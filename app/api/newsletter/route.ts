import { Resend } from "resend"
import { type NextRequest, NextResponse } from "next/server"
import { newsletterSchema } from "@/lib/schemas"

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const resend = new Resend(RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate the email
    const validatedData = newsletterSchema.parse(body)

    // Use Resend's default domain for testing - replace with your verified domain in production
    const fromEmail = "onboarding@resend.dev"
    const adminEmail = "delivered@resend.dev" // This is Resend's test email that always works

    // Send welcome email to subscriber
    const welcomeEmailResult = await resend.emails.send({
      from: fromEmail,
      to: [validatedData.email],
      subject: "Bienvenue dans la newsletter d'Espoir Global !",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; padding: 20px; background-color: #4f46e5; color: white; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">💙 Bienvenue !</h1>
            <p style="margin: 10px 0 0 0; font-size: 18px;">Merci de rejoindre notre communauté</p>
          </div>
          
          <div style="padding: 30px; background-color: #ffffff; border: 1px solid #e5e7eb; border-top: none;">
            <p style="font-size: 16px; line-height: 1.6;">
              Nous sommes ravis de vous compter parmi nos soutiens ! Vous recevrez désormais nos actualités, 
              les histoires inspirantes de nos bénéficiaires, et les dernières nouvelles de nos actions sur le terrain.
            </p>
            
            <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #f59e0b;">
              <h3 style="color: #92400e; margin-top: 0;">Ce que vous recevrez :</h3>
              <ul style="color: #92400e; margin: 0;">
                <li>Histoires d'impact de nos bénéficiaires</li>
                <li>Mises à jour sur nos projets en cours</li>
                <li>Invitations à nos événements</li>
                <li>Rapports de transparence financière</li>
              </ul>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6;">
              Ensemble, nous pouvons faire la différence dans la vie des orphelins et des veuves à travers le monde.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://espoirglobal.org" 
                 style="background-color: #eab308; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                Découvrir nos actions
              </a>
            </div>
          </div>
          
          <div style="padding: 20px; background-color: #f9fafb; border-radius: 0 0 8px 8px; text-align: center;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              <strong>Espoir Global</strong><br>
              Aneho Qt Jéricho, Préfecture des Lacs, TOGO<br>
              contact@espoirglobal.org
            </p>
          </div>
        </div>
      `,
    })

    console.log("Welcome email sent:", welcomeEmailResult)

    // Notify admin of new subscription
    const adminEmailResult = await resend.emails.send({
      from: fromEmail,
      to: [adminEmail],
      subject: "Nouvel abonnement à la newsletter",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4f46e5;">Nouvel abonnement à la newsletter</h2>
          <p>Une nouvelle personne s'est abonnée à la newsletter :</p>
          <p><strong>Email:</strong> ${validatedData.email}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString("fr-FR")}</p>
        </div>
      `,
    })

    console.log("Admin notification sent:", adminEmailResult)

    return NextResponse.json({
      success: true,
      message: "Inscription réussie à la newsletter",
      data: {
        welcomeEmailId: welcomeEmailResult.data?.id,
        adminEmailId: adminEmailResult.data?.id,
      },
    })
  } catch (error) {
    console.error("Error subscribing to newsletter:", error)

    // More detailed error handling
    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          error: "Erreur lors de l'inscription à la newsletter",
          details: error.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: "Erreur inconnue lors de l'inscription",
      },
      { status: 500 },
    )
  }
}
