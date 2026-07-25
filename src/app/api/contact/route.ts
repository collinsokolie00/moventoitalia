import { NextResponse } from "next/server";
import { Resend } from "resend";
import { escapeHtml } from "@/lib/email/send-quote-emails";
import { getContactContent } from "@/lib/database/contact";
import { formatSender,getSiteSettings } from "@/lib/database/settings";
import { contactRequestSchema } from "@/lib/validation/contact";
export const runtime="nodejs";
export async function POST(request:Request){
  const italian=request.headers.get("x-movento-locale")==="it";
  const tr=(en:string,it:string)=>italian?it:en;
  try{
    const body=await request.json();const parsed=contactRequestSchema.safeParse(body);
    if(!parsed.success)return NextResponse.json({success:false,message:tr("Please check the submitted information.","Controlla le informazioni inserite."),errors:parsed.error.flatten().fieldErrors},{status:400});
    const apiKey=process.env.RESEND_API_KEY;const configuredFrom=process.env.EMAIL_FROM;
    if(!apiKey||!configuredFrom)return NextResponse.json({success:false,message:tr("Email delivery is temporarily unavailable.","L’invio email non è momentaneamente disponibile.")},{status:503});
    const[contact,settings]=await Promise.all([getContactContent(),getSiteSettings()]);
    const to=settings?.contactFormRecipientEmail??process.env.MOVENTO_NOTIFICATION_EMAIL??contact?.email;
    if(!to)return NextResponse.json({success:false,message:tr("Contact email is not configured.","L’indirizzo email di contatto non è configurato.")},{status:503});
    const value=parsed.data;const from=settings?formatSender(configuredFrom,settings.customerEmailSenderName):configuredFrom;
    const result=await new Resend(apiKey).emails.send({from,to,replyTo:value.email,subject:`${settings?.publicTradingName??"Movento"} contact request: ${value.subject}`,html:`<div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;color:#172033"><h1>New contact request</h1><p><strong>Name:</strong> ${escapeHtml(value.name)}</p><p><strong>Email:</strong> ${escapeHtml(value.email)}</p><p><strong>Telephone:</strong> ${escapeHtml(value.phone||"Not provided")}</p><p><strong>Subject:</strong> ${escapeHtml(value.subject)}</p><p><strong>Message:</strong></p><p style="white-space:pre-wrap">${escapeHtml(value.message)}</p><p style="margin-top:24px;color:#64748b;font-size:12px">Delivered for ${escapeHtml(settings?.legalCompanyName??"Movento")}</p></div>`});
    if(result.error){console.error("Contact email error:",result.error);return NextResponse.json({success:false,message:tr("Your message could not be sent. Please try again.","Non è stato possibile inviare il messaggio. Riprova.")},{status:502});}
    return NextResponse.json({success:true,message:tr("Your message has been sent.","Il tuo messaggio è stato inviato.")},{status:201});
  }catch(error){console.error("Contact submission error:",error);return NextResponse.json({success:false,message:tr("Your message could not be sent. Please try again.","Non è stato possibile inviare il messaggio. Riprova.")},{status:500});}
}
