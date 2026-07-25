import nextEnv from "@next/env";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

import {
  blogItalian,
  contactItalian,
  faqsItalian,
  headerFooterItalian,
  homepageItalian,
  serviceAreasItalian,
  servicesItalian,
  settingsItalian,
} from "./italian-cms-translations.mjs";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const confirmation = "--confirm=movento-italian-v1";
const apply = process.argv.includes("--apply");
if (apply && !process.argv.includes(confirmation)) {
  throw new Error(
    `Refusing to write without the explicit confirmation flag: ${confirmation}`,
  );
}

for (const key of [
  "FIREBASE_PROJECT_ID",
  "FIREBASE_CLIENT_EMAIL",
  "FIREBASE_PRIVATE_KEY",
]) {
  if (!process.env[key]) throw new Error(`${key} is required.`);
}

const app =
  getApps()[0] ??
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
const db = getFirestore(app);
const report = [];

function missing(value) {
  if (typeof value === "string") return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  return value == null;
}

function fill(target, key, value, changed) {
  if (missing(target[key]) && !missing(value)) {
    target[key] = value;
    changed.push(key);
  }
}

async function updateExisting(path, createPatch) {
  const reference = db.doc(path);
  const snapshot = await reference.get();
  if (!snapshot.exists) {
    report.push({ path, status: "skipped-missing-document", fields: [] });
    return;
  }

  const patch = createPatch(snapshot.data() ?? {});
  const fields = patch.__fields ?? [];
  delete patch.__fields;
  if (fields.length === 0) {
    report.push({ path, status: "already-complete", fields: [] });
    return;
  }

  if (apply) {
    await reference.set(
      { ...patch, updatedAt: FieldValue.serverTimestamp() },
      { merge: true },
    );
  }
  report.push({
    path,
    status: apply ? "updated" : "would-update",
    fields,
  });
}

await updateExisting("siteContent/homepage", (data) => {
  const changed = [];
  const hero = structuredClone(data.hero ?? {});
  fill(hero, "titleIt", homepageItalian.hero.titleIt, changed);
  fill(hero, "subtitleIt", homepageItalian.hero.subtitleIt, changed);
  hero.primaryButton = structuredClone(hero.primaryButton ?? {});
  hero.secondaryButton = structuredClone(hero.secondaryButton ?? {});
  fill(
    hero.primaryButton,
    "labelIt",
    homepageItalian.hero.primaryButton.labelIt,
    changed,
  );
  fill(
    hero.secondaryButton,
    "labelIt",
    homepageItalian.hero.secondaryButton.labelIt,
    changed,
  );

  const statistics = (data.statistics ?? []).map((item, index) => {
    const result = structuredClone(item);
    const translation = homepageItalian.statistics[index];
    if (!translation) return result;
    fill(result, "valueIt", translation.valueIt, changed);
    fill(result, "labelIt", translation.labelIt, changed);
    return result;
  });

  const whyChoose = structuredClone(data.whyChoose ?? {});
  for (const key of ["titleIt", "descriptionIt", "benefitsIt"]) {
    fill(whyChoose, key, homepageItalian.whyChoose[key], changed);
  }

  const callToAction = structuredClone(data.callToAction ?? {});
  for (const key of ["eyebrowIt", "titleIt", "descriptionIt"]) {
    fill(callToAction, key, homepageItalian.callToAction[key], changed);
  }
  callToAction.primaryButton = structuredClone(
    callToAction.primaryButton ?? {},
  );
  callToAction.secondaryButton = structuredClone(
    callToAction.secondaryButton ?? {},
  );
  fill(
    callToAction.primaryButton,
    "labelIt",
    homepageItalian.callToAction.primaryButton.labelIt,
    changed,
  );
  fill(
    callToAction.secondaryButton,
    "labelIt",
    homepageItalian.callToAction.secondaryButton.labelIt,
    changed,
  );

  return {
    hero,
    statistics,
    whyChoose,
    callToAction,
    __fields: changed,
  };
});

await updateExisting("siteContent/contact", (data) => {
  const patch = {};
  const changed = [];
  for (const [key, value] of Object.entries(contactItalian)) {
    if (missing(data[key])) {
      patch[key] = value;
      changed.push(key);
    }
  }
  return { ...patch, __fields: changed };
});

await updateExisting("siteContent/settings", (data) => {
  const patch = {};
  const changed = [];
  for (const [key, value] of Object.entries(settingsItalian)) {
    if (missing(data[key])) {
      patch[key] = value;
      changed.push(key);
    }
  }
  return { ...patch, __fields: changed };
});

await updateExisting("siteContent/headerFooter", (data) => {
  const changed = [];
  const navigation = (data.navigation ?? []).map((item) => {
    const result = structuredClone(item);
    fill(
      result,
      "labelIt",
      headerFooterItalian.navigation[item.href],
      changed,
    );
    return result;
  });
  const headerCta = structuredClone(data.headerCta ?? {});
  fill(headerCta, "labelIt", headerFooterItalian.headerCta, changed);

  const footerNavigation = (data.footerNavigation ?? []).map((group) => {
    const result = structuredClone(group);
    const translation = headerFooterItalian.footerGroups[group.title];
    if (!translation) return result;
    fill(result, "titleIt", translation.titleIt, changed);
    result.links = (result.links ?? []).map((link) => {
      const translatedLink = structuredClone(link);
      fill(
        translatedLink,
        "labelIt",
        translation.links[link.label],
        changed,
      );
      return translatedLink;
    });
    return result;
  });
  const footerCta = structuredClone(data.footerCta ?? {});
  for (const [key, value] of Object.entries(headerFooterItalian.footerCta)) {
    fill(footerCta, key, value, changed);
  }

  const patch = { navigation, headerCta, footerNavigation, footerCta };
  for (const [key, value] of [
    ["footerDescriptionIt", headerFooterItalian.footerDescription],
    ["copyrightTextIt", headerFooterItalian.copyrightText],
    ["footerTaglineIt", headerFooterItalian.footerTagline],
  ]) {
    if (missing(data[key])) {
      patch[key] = value;
      changed.push(key);
    }
  }
  return { ...patch, __fields: changed };
});

for (const [id, translation] of Object.entries(servicesItalian)) {
  await updateExisting(`services/${id}`, (data) => {
    const patch = {};
    const changed = [];
    for (const [key, italian] of Object.entries(translation)) {
      const current = data[key];
      if (
        current &&
        typeof current === "object" &&
        !Array.isArray(current)
      ) {
        if (missing(current.it)) {
          patch[key] = { ...current, it: italian };
          changed.push(`${key}.it`);
        }
      } else if (!missing(current)) {
        patch[key] = { en: current, it: italian };
        changed.push(`${key}.it`);
      }
    }
    return { ...patch, __fields: changed };
  });
}

for (const [id, translation] of Object.entries(serviceAreasItalian)) {
  await updateExisting(`serviceAreas/${id}`, (data) => {
    const patch = {};
    const changed = [];
    for (const [key, value] of Object.entries(translation)) {
      if (missing(data[key])) {
        patch[key] = value;
        changed.push(key);
      }
    }
    return { ...patch, __fields: changed };
  });
}

for (const [id, translation] of Object.entries(faqsItalian)) {
  await updateExisting(`faqs/${id}`, (data) => {
    const patch = {};
    const changed = [];
    for (const [key, value] of Object.entries(translation)) {
      if (missing(data[key])) {
        patch[key] = value;
        changed.push(key);
      }
    }
    return { ...patch, __fields: changed };
  });
}

for (const [id, translation] of Object.entries(blogItalian)) {
  await updateExisting(`blogArticles/${id}`, (data) => {
    const patch = {};
    const changed = [];
    for (const [key, value] of Object.entries(translation)) {
      if (missing(data[key])) {
        patch[key] = value;
        changed.push(key);
      }
    }
    return { ...patch, __fields: changed };
  });
}

const changedDocuments = report.filter((item) =>
  ["updated", "would-update"].includes(item.status),
);
console.log(
  JSON.stringify(
    {
      mode: apply ? "apply" : "dry-run",
      projectId: process.env.FIREBASE_PROJECT_ID,
      changedDocuments: changedDocuments.length,
      changedFields: changedDocuments.reduce(
        (total, item) => total + item.fields.length,
        0,
      ),
      report,
    },
    null,
    2,
  ),
);
