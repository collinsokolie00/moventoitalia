import "server-only";

const BRAND_BLUE = "#0b3b8f";
const SUPPORTING_BLUE = "#eaf2ff";

export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function getSenderAddress(sender: string) {
  return (sender.match(/<([^>]+)>/)?.[1] ?? sender).trim();
}

function getLogoUrl() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!siteUrl) return null;

  try {
    const url = new URL(siteUrl);
    if (url.protocol !== "https:") return null;
    return new URL("/movento-logo.png", url).toString();
  } catch {
    return null;
  }
}

export function renderDetailRows(
  details: Array<{ label: string; value: string }>,
) {
  return details
    .map(
      ({ label, value }) => `
        <tr>
          <td style="padding:9px 0;color:#526071;font-size:14px;line-height:1.5;vertical-align:top;width:38%">
            ${escapeHtml(label)}
          </td>
          <td style="padding:9px 0 9px 16px;color:#172033;font-size:14px;font-weight:700;line-height:1.5;vertical-align:top">
            ${value}
          </td>
        </tr>
      `,
    )
    .join("");
}

type MoventoEmailOptions = {
  title: string;
  eyebrow: string;
  preheader: string;
  body: string;
  footerEmail: string;
  cta?: {
    href: string;
    label: string;
  };
};

export function renderMoventoEmail({
  title,
  eyebrow,
  preheader,
  body,
  footerEmail,
  cta,
}: MoventoEmailOptions) {
  const logoUrl = getLogoUrl();
  const safeFooterEmail = escapeHtml(footerEmail);
  const safeCtaHref = cta ? escapeHtml(cta.href) : "";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)}</title>
  </head>
  <body style="margin:0;padding:0;background:#f3f6fb;color:#172033;font-family:Arial,Helvetica,sans-serif">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">
      ${escapeHtml(preheader)}
    </div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:#f3f6fb">
      <tr>
        <td align="center" style="padding:24px 12px">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:640px;background:#ffffff;border:1px solid #dbe4f0;border-radius:16px">
            <tr>
              <td style="padding:26px 30px;background:${BRAND_BLUE};border-radius:16px 16px 0 0">
                ${logoUrl ? `<img src="${escapeHtml(logoUrl)}" width="154" alt="Movento Italia" style="display:block;width:154px;max-width:100%;height:auto;margin:0 0 18px;border:0">` : `<p style="margin:0 0 16px;color:#ffffff;font-size:20px;font-weight:800;letter-spacing:1px">MOVENTO ITALIA</p>`}
                <p style="margin:0 0 8px;color:#cfe0ff;font-size:12px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase">
                  ${escapeHtml(eyebrow)}
                </p>
                <h1 style="margin:0;color:#ffffff;font-size:27px;line-height:1.25;font-weight:800">
                  ${escapeHtml(title)}
                </h1>
              </td>
            </tr>
            <tr>
              <td style="padding:30px">
                ${body}
                ${cta ? `
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-top:26px">
                    <tr>
                      <td style="border-radius:999px;background:${BRAND_BLUE}">
                        <a href="${safeCtaHref}" style="display:inline-block;padding:13px 21px;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none">
                          ${escapeHtml(cta.label)}
                        </a>
                      </td>
                    </tr>
                  </table>
                ` : ""}
              </td>
            </tr>
            <tr>
              <td style="padding:21px 30px;background:${SUPPORTING_BLUE};border-top:1px solid #dbe4f0;border-radius:0 0 16px 16px">
                <p style="margin:0;color:#334155;font-size:13px;font-weight:700;line-height:1.6">
                  Movento Italia
                </p>
                <p style="margin:3px 0 0;color:#64748b;font-size:12px;line-height:1.6">
                  <a href="mailto:${safeFooterEmail}" style="color:${BRAND_BLUE};text-decoration:none">${safeFooterEmail}</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
