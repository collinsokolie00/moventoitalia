import LegalPage, { type LegalSection } from "@/components/legal/LegalPage";
import { getContactContent } from "@/lib/database/contact";
import { getSiteSettings } from "@/lib/database/settings";
import { getRequestLocale } from "@/lib/i18n/server";
import { createPageMetadata } from "@/lib/seo";

export async function generateMetadata() {
  const locale = await getRequestLocale();
  return createPageMetadata({
    path: "/privacy",
    title: locale === "it" ? "Informativa sulla privacy | Movento" : "Privacy Policy | Movento",
    description: locale === "it" ? "Come Movento tratta i dati personali per preventivi, contatti e servizi di trasloco." : "How Movento processes personal data for quotes, enquiries and moving services.",
  });
}

export default async function PrivacyPage() {
  const locale = await getRequestLocale();
  const [settings, contact] = await Promise.all([getSiteSettings(), getContactContent(locale)]);
  const controller = settings?.legalCompanyName?.trim() || settings?.publicTradingName?.trim() || "Movento";
  const address = contact?.address?.trim();
  const it = locale === "it";
  const sections: LegalSection[] = it ? [
    { title: "1. Titolare e contatti", paragraphs: [`Il titolare del trattamento è ${controller}${address ? `, contattabile presso ${address}` : ""}. Per ogni questione relativa alla privacy: info@moventoitalia.com.`] },
    { title: "2. Dati raccolti", paragraphs: ["Possiamo trattare nome, email, telefono, indirizzi di partenza e destinazione, dettagli dell’immobile, data del trasloco, beni e servizi richiesti, messaggi, fotografie eventualmente fornite, dati di preventivo e cronologia delle comunicazioni.", "Il sito può inoltre registrare dati tecnici essenziali, come indirizzo IP, tipo di dispositivo, log di sicurezza e preferenze cookie."] },
    { title: "3. Finalità e basi giuridiche", paragraphs: ["Trattiamo i dati per rispondere alle richieste, preparare preventivi, organizzare ed eseguire servizi, fornire assistenza, gestire pagamenti e obblighi amministrativi, prevenire abusi e proteggere il sito.", "Le basi giuridiche sono l’esecuzione di misure precontrattuali o del contratto, gli obblighi legali, il legittimo interesse alla sicurezza e alla gestione dell’attività e, per cookie non essenziali o marketing, il consenso revocabile."] },
    { title: "4. Conferimento e conseguenze", paragraphs: ["I campi indicati come necessari servono per valutare o fornire il servizio. Se non vengono forniti, Movento potrebbe non poter preparare un preventivo o rispondere adeguatamente. I dati facoltativi aiutano a comprendere esigenze specifiche."] },
    { title: "5. Destinatari e fornitori", paragraphs: ["I dati possono essere condivisi, nella misura necessaria, con personale autorizzato, fornitori tecnici, servizi email, hosting, mappe, pagamenti, consulenti, assicuratori o collaboratori operativi coinvolti nel servizio.", "I fornitori devono trattare i dati secondo istruzioni appropriate o come autonomi titolari quando previsto dalla legge. I dati non sono venduti."] },
    { title: "6. Trasferimenti internazionali", paragraphs: ["Alcuni fornitori tecnologici possono trattare dati fuori dallo Spazio economico europeo. In tali casi vengono utilizzati meccanismi previsti dal GDPR, come decisioni di adeguatezza o clausole contrattuali standard, quando applicabili."] },
    { title: "7. Conservazione e sicurezza", paragraphs: ["Le richieste e i preventivi sono conservati per il tempo necessario a gestire il rapporto, documentare le comunicazioni e rispettare obblighi legali, fiscali o di difesa. I dati non più necessari vengono eliminati o anonimizzati secondo criteri operativi appropriati.", "Movento adotta misure ragionevoli di accesso, autenticazione, registrazione e protezione dei sistemi, pur non potendo garantire sicurezza assoluta delle comunicazioni Internet."] },
    { title: "8. Diritti dell’interessato", paragraphs: ["Alle condizioni previste dal GDPR, puoi chiedere accesso, rettifica, cancellazione, limitazione, portabilità o opposizione, e revocare il consenso senza pregiudicare il trattamento precedente.", "Puoi scrivere a info@moventoitalia.com. Hai inoltre diritto di proporre reclamo al Garante per la protezione dei dati personali."] },
    { title: "9. Minori, modifiche e collegamenti esterni", paragraphs: ["I servizi non sono destinati direttamente a minori che agiscono senza un adulto responsabile. Questa informativa può essere aggiornata per modifiche operative o normative; la data pubblicata indica la versione corrente.", "I siti e servizi esterni collegati applicano proprie informative, che devono essere consultate separatamente."] },
  ] : [
    { title: "1. Controller and contact", paragraphs: [`The data controller is ${controller}${address ? `, contactable at ${address}` : ""}. Privacy enquiries should be sent to info@moventoitalia.com.`] },
    { title: "2. Data we collect", paragraphs: ["We may process names, email addresses, telephone numbers, collection and destination addresses, property details, moving dates, requested belongings and services, messages, supplied photographs, quote information and communication history.", "The website may also record essential technical information such as IP address, device type, security logs and cookie preferences."] },
    { title: "3. Purposes and legal bases", paragraphs: ["We process data to answer enquiries, prepare quotes, organise and perform services, provide support, administer payments and records, prevent abuse and secure the website.", "The legal bases are pre-contractual steps or contract performance, legal obligations, legitimate interests in security and business administration and, for non-essential cookies or marketing, withdrawable consent."] },
    { title: "4. Required information", paragraphs: ["Fields marked as required are needed to assess or provide a service. Without them, Movento may be unable to prepare a quote or respond adequately. Optional information helps us understand specific requirements."] },
    { title: "5. Recipients and providers", paragraphs: ["Where necessary, data may be shared with authorised personnel, technical providers, email, hosting, mapping or payment services, advisers, insurers and operational partners involved in the service.", "Providers must process data under appropriate instructions or as independent controllers where required by law. Personal data is not sold."] },
    { title: "6. International transfers", paragraphs: ["Some technology providers may process data outside the European Economic Area. Where applicable, GDPR mechanisms such as adequacy decisions or standard contractual clauses are used."] },
    { title: "7. Retention and security", paragraphs: ["Enquiries and quotes are retained as needed to manage the relationship, document communications and meet legal, tax or defence obligations. Data that is no longer needed is deleted or anonymised under appropriate operational criteria.", "Movento uses reasonable access, authentication, logging and system-protection measures, although absolute security of Internet communications cannot be guaranteed."] },
    { title: "8. Your rights", paragraphs: ["Subject to the GDPR, you may request access, correction, deletion, restriction, portability or objection, and withdraw consent without affecting earlier lawful processing.", "Contact info@moventoitalia.com. You may also complain to the Italian Data Protection Authority (Garante per la protezione dei dati personali)."] },
    { title: "9. Children, updates and external links", paragraphs: ["Services are not directed to children acting without a responsible adult. This policy may be updated for operational or legal changes; the published date identifies the current version.", "Linked external websites and services have separate privacy notices that should be reviewed independently."] },
  ];
  return <LegalPage path="/privacy" locale={locale} eyebrow={it ? "Protezione dei dati" : "Data protection"} title={it ? "Informativa sulla privacy" : "Privacy Policy"} introduction={it ? "Informazioni sul trattamento dei dati personali secondo il GDPR e la normativa italiana applicabile." : "Information about personal-data processing under the GDPR and applicable Italian law."} updatedLabel={it ? "Ultimo aggiornamento: 28 luglio 2026" : "Last updated: 28 July 2026"} sections={sections} reviewNotice={it ? "Avviso: questa informativa deve ricevere una revisione professionale/legale finale e l’integrazione di eventuali dati societari obbligatori prima dell’avvio delle attività commerciali." : "Notice: this policy requires final professional/legal review and completion of any mandatory company information before commercial operations begin."} />;
}
