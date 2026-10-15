/**
 * Configuration des images de fond pour chaque page
 * URLs des images générées par Qwen AI
 */

export const PAGE_BACKGROUNDS = {
  dashboard: 'https://image.qwenlm.ai/generated-images/0c30dde7-7aa2-493e-855b-20e6e276a67e/_result.png',
  athletes: 'https://image.qwenlm.ai/generated-images/38aa8328-e82c-457c-a6f8-e98d648aab22/_result.png',
  weighIn: 'https://image.qwenlm.ai/generated-images/9a36ff99-1c76-4c69-a168-20ccdf8ac9aa/_result.png',
  brackets: 'https://image.qwenlm.ai/generated-images/6d7c4d26-b344-4a11-a7b2-544b266f0f53/_result.png',
  live: 'https://image.qwenlm.ai/generated-images/de993668-1277-4aa8-93ad-3123d42a1f64/_result.png',
  results: 'https://image.qwenlm.ai/generated-images/59125f0d-2349-43dd-8816-56b9419e47b6/_result.png',
  claims: 'https://image.qwenlm.ai/generated-images/cfadc7ef-672b-4f03-b7ec-eb5c0d0b909c/_result.png',
  tvMode: 'https://image.qwenlm.ai/generated-images/12dbc5ff-e2cb-4a1e-9b75-16e6e51c1c98/_result.png',
  qrPresence: 'https://image.qwenlm.ai/generated-images/80b66c10-9133-4cb6-99ab-fc7edadcc77b/_result.png',
  competitions: 'https://image.qwenlm.ai/generated-images/b98fd7f3-c58f-463f-ade2-8fb8089bd872/_result.png',
} as const;

export type PageKey = keyof typeof PAGE_BACKGROUNDS;
