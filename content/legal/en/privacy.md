---
title: "Privacy Policy"
date: "2024-04-10"
updatedAt: "2024-04-10"
description: "How Vault handles your data with privacy-first and local-first principles."
---

At Vault, we believe that academic research is fundamentally private. Our architecture is designed around the **local-first** principle, ensuring that your data remains under your absolute control.

## 1. Local-First Architecture & Document Privacy

Unlike traditional cloud-based research tools, Vault does not upload your PDF documents, EPUB files, annotations, or knowledge graphs to our servers by default. 
- **IndexedDB Storage:** All your documents and notes are stored locally on your device within your browser's secure sandboxed storage (IndexedDB).
- **Data Sovereignty:** We have zero access to the contents of the literature you read or the notes you take. 
- **Cloud Syncing:** If you optionally choose to sync your reading groups or workspaces across devices, only metadata and encrypted relational structures are synced via our Supabase infrastructure.

## 2. Information We Collect

To provide our core services, we collect minimal data:
- **Account Information:** Email address and name during the Supabase authentication process.
- **Payment Information:** Processed entirely by our secure payment gateway (e.g., Stripe/Iyzico). We do not store your credit card details.
- **Analytics Data:** We use Vercel Analytics and Speed Insights to monitor application performance. This analytics data is strictly anonymized and aggregated, containing no personally identifiable information (PII).

## 3. GDPR & KVKK Compliance

Vault operates in strict compliance with the General Data Protection Regulation (GDPR) and Turkey's Personal Data Protection Law (KVKK).
- **Right to Access & Erasure:** You may request an export of your account data or request immediate account deletion at any time by contacting support. Given our local-first nature, deleting your local browser data inherently erases your research materials.
- **Consent:** We do not track you across the web. Optional service analytics require explicit consent via our Cookie Banner.

## 4. Third-Party Services

We utilize the following third-party infrastructure to deliver Vault:
- **Supabase:** For robust authentication and optional database syncing.
- **Vercel:** For global edge hosting and performance analytics.

Your data is never sold to third parties, advertising networks, or data brokers.

## 5. Contact Us

If you have legal or privacy inquiries regarding your data, please contact our Data Protection Officer at `privacy@vault.app`.
