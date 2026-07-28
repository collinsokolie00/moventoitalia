import LegalPage, { type LegalSection } from "@/components/legal/LegalPage";
import { getRequestLocale } from "@/lib/i18n/server";
import { createPageMetadata } from "@/lib/seo";

export async function generateMetadata() {
  const locale = await getRequestLocale();
  return createPageMetadata({
    path: "/cookies",
    title: locale === "it" ? "Informativa sui cookie | Movento" : "Cookie Policy | Movento",
    description: locale === "it" ? "Cookie essenziali, preferenze e consenso sul sito Movento." : "Essential cookies, preferences and consent on the Movento website.",
  });
}

export default async function CookiesPage() {
  const locale = await getRequestLocale();
  const it = locale === "it";
  const sections: LegalSection[] = it ? [
    { title: "1. Cosa sono i cookie", paragraphs: ["I cookie sono piccoli dati salvati dal browser. Possono mantenere una sessione, ricordare preferenze, proteggere moduli o, con consenso, misurare l’uso del sito e supportare attività promozionali. Tecnologie equivalenti, come local storage, possono svolgere funzioni simili."] },
    { title: "2. Cookie essenziali", paragraphs: ["Movento utilizza solo ciò che è necessario per funzioni come lingua, sicurezza, amministrazione, sessioni e memorizzazione della scelta sui cookie. Questi strumenti non richiedono consenso quando sono strettamente necessari.", "La preferenza è salvata con il nome movento_cookie_consent e nel local storage movento-cookie-consent-v1, normalmente per un massimo di 12 mesi, salvo cancellazione anticipata dal browser."] },
    { title: "3. Cookie analitici", paragraphs: ["Gli strumenti analitici aiutano a capire in forma aggregata quali pagine vengono visitate e dove si verificano problemi. Non vengono attivati prima del consenso. Se Movento li introduce, questa informativa e il pannello preferenze dovranno identificare il fornitore e la durata applicabile."] },
    { title: "4. Cookie di marketing", paragraphs: ["I cookie di marketing possono misurare campagne o personalizzare comunicazioni. Restano disattivati finché non vengono accettati. Movento non deve interpretarli come necessari al funzionamento del sito."] },
    { title: "5. Servizi e contenuti di terzi", paragraphs: ["Mappe, video, social network o altri contenuti esterni possono avere proprie tecnologie. Dove tecnicamente possibile, gli elementi non essenziali vengono bloccati fino al consenso. I collegamenti esterni aperti volontariamente sono regolati dalle condizioni del relativo fornitore."] },
    { title: "6. Scelta e revoca", paragraphs: ["Puoi accettare, rifiutare i cookie non essenziali o gestire separatamente analitici e marketing. La scelta può essere modificata in qualsiasi momento tramite “Impostazioni cookie” nel footer.", "Puoi inoltre cancellare cookie e dati del sito nelle impostazioni del browser. La cancellazione ripristinerà la richiesta di consenso."] },
    { title: "7. Contatti e aggiornamenti", paragraphs: ["Per domande scrivi a info@moventoitalia.com. L’informativa viene aggiornata quando cambiano le tecnologie utilizzate o gli obblighi applicabili."] },
  ] : [
    { title: "1. What cookies are", paragraphs: ["Cookies are small pieces of data stored by a browser. They can maintain sessions, remember preferences, protect forms or, with consent, measure website use and support promotional activity. Equivalent technologies such as local storage can perform similar functions."] },
    { title: "2. Essential cookies", paragraphs: ["Movento uses only what is necessary for functions such as language, security, administration, sessions and recording the cookie choice. Strictly necessary tools do not require consent.", "The preference is stored as movento_cookie_consent and in local storage as movento-cookie-consent-v1, normally for up to 12 months unless deleted earlier through the browser."] },
    { title: "3. Analytics cookies", paragraphs: ["Analytics tools help identify, in aggregate, which pages are used and where problems occur. They are not activated before consent. If Movento introduces them, this policy and the preference panel must identify the provider and applicable duration."] },
    { title: "4. Marketing cookies", paragraphs: ["Marketing cookies may measure campaigns or personalise communications. They remain disabled until accepted and are not treated as necessary for operating the website."] },
    { title: "5. Third-party services and content", paragraphs: ["Maps, videos, social networks or other external content may use their own technologies. Where technically possible, non-essential elements are blocked until consent. External links that a visitor chooses to open are governed by the relevant provider."] },
    { title: "6. Choice and withdrawal", paragraphs: ["You can accept, reject non-essential cookies or manage analytics and marketing separately. The choice can be changed at any time through “Cookie settings” in the footer.", "You can also delete cookies and website data in browser settings. Deletion will cause the consent request to appear again."] },
    { title: "7. Contact and updates", paragraphs: ["Questions may be sent to info@moventoitalia.com. This policy is updated when the technologies used or applicable obligations change."] },
  ];
  return <LegalPage path="/cookies" locale={locale} eyebrow={it ? "Preferenze e trasparenza" : "Preferences and transparency"} title={it ? "Informativa sui cookie" : "Cookie Policy"} introduction={it ? "Informazioni sulle tecnologie essenziali e facoltative utilizzate dal sito Movento." : "Information about essential and optional technologies used by the Movento website."} updatedLabel={it ? "Ultimo aggiornamento: 28 luglio 2026" : "Last updated: 28 July 2026"} sections={sections} reviewNotice={it ? "Avviso: verificare questa informativa con un professionista prima dell’avvio commerciale e aggiornarla ogni volta che viene aggiunto un nuovo fornitore analitico o di marketing." : "Notice: obtain professional review before commercial launch and update this policy whenever a new analytics or marketing provider is introduced."} />;
}
