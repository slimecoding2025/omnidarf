export type Locale = "en" | "ar" | "de" | "fr" | "it";

export const LOCALES: { value: Locale; label: string; dir: "ltr" | "rtl" }[] = [
  { value: "en", label: "English", dir: "ltr" },
  { value: "ar", label: "العربية", dir: "rtl" },
  { value: "de", label: "Deutsch", dir: "ltr" },
  { value: "fr", label: "Français", dir: "ltr" },
  { value: "it", label: "Italiano", dir: "ltr" },
];

type Translation = {
  languageName: string;
  stepOne: string;
  inputTitle: string;
  inputPlaceholder: string;
  characters: string;
  generate: string;
  generating: string;
  stepTwo: string;
  copy: string;
  copied: string;
  copyAll: string;
  exportMarkdown: string;
  generationFailed: string;
  networkError: string;
  readingSource: string;
  draftingSocial: string;
  storyboarding: string;
  distilling: string;
  writingVisuals: string;
  socialKit: string;
  videoScript: string;
  takeaways: string;
  visualPrompts: string;
  linkedinPost: string;
  instagramCaption: string;
  copyFullScript: string;
  estimatedRuntime: string;
  hook: string;
  visual: string;
  narration: string;
  callToAction: string;
  language: string;
  templates: Record<string, { label: string; description: string }>;
};

const english: Translation = {
  languageName: "English",
  stepOne: "Step one",
  inputTitle: "Paste your source, or a single idea",
  inputPlaceholder: "Paste an article, raw notes, a link, or just describe a topic — e.g. 'why async communication beats meetings for remote teams'",
  characters: "characters",
  generate: "Generate content kit",
  generating: "Generating",
  stepTwo: "Step two",
  copy: "Copy",
  copied: "Copied",
  copyAll: "Copy all",
  exportMarkdown: "Export .md",
  generationFailed: "Generation failed",
  networkError: "Network error. Please try again.",
  readingSource: "Reading your source",
  draftingSocial: "Drafting social formats",
  storyboarding: "Storyboarding the script",
  distilling: "Distilling key takeaways",
  writingVisuals: "Writing visual prompts",
  socialKit: "Social Kit",
  videoScript: "Video Script",
  takeaways: "Takeaways",
  visualPrompts: "Visual Prompts",
  linkedinPost: "LinkedIn post",
  instagramCaption: "Instagram caption",
  copyFullScript: "Copy full script",
  estimatedRuntime: "Estimated runtime",
  hook: "Hook",
  visual: "Visual",
  narration: "Narration",
  callToAction: "Call to action",
  language: "Language",
  templates: {
    blog: { label: "Blog post → kit", description: "Paste an article and get every format at once" },
    product: { label: "Product launch", description: "Turn a feature list into launch-day content" },
    news: { label: "News summary", description: "Condense a news topic into a shareable kit" },
    topic: { label: "Just a topic", description: "Start from a single idea, no source text needed" },
  },
};

const translations: Record<Locale, Translation> = {
  en: english,
  ar: { ...english, languageName: "العربية", stepOne: "الخطوة الأولى", inputTitle: "ألصق مصدرك أو فكرة واحدة", characters: "حرف", generate: "إنشاء حزمة المحتوى", generating: "جارٍ الإنشاء", stepTwo: "الخطوة الثانية", copy: "نسخ", copied: "تم النسخ", copyAll: "نسخ الكل", exportMarkdown: "تصدير .md", generationFailed: "فشل الإنشاء", networkError: "خطأ في الشبكة. حاول مرة أخرى.", readingSource: "قراءة المصدر", draftingSocial: "إعداد محتوى التواصل", storyboarding: "تخطيط النص", distilling: "استخلاص الأفكار الرئيسية", writingVisuals: "كتابة المطالبات البصرية", socialKit: "حزمة التواصل", videoScript: "نص الفيديو", takeaways: "أهم الأفكار", visualPrompts: "المطالبات البصرية", linkedinPost: "منشور LinkedIn", instagramCaption: "وصف Instagram", copyFullScript: "نسخ النص الكامل", estimatedRuntime: "المدة المتوقعة", hook: "الافتتاحية", visual: "المرئيات", narration: "التعليق الصوتي", callToAction: "دعوة لاتخاذ إجراء", language: "اللغة", inputPlaceholder: "ألصق مقالاً أو ملاحظات أو رابطاً أو صف موضوعاً..." },
  de: { ...english, languageName: "Deutsch", stepOne: "Schritt eins", inputTitle: "Füge deine Quelle oder eine Idee ein", characters: "Zeichen", generate: "Content-Kit erstellen", generating: "Wird erstellt", stepTwo: "Schritt zwei", copy: "Kopieren", copied: "Kopiert", copyAll: "Alles kopieren", exportMarkdown: ".md exportieren", generationFailed: "Erstellung fehlgeschlagen", networkError: "Netzwerkfehler. Bitte versuche es erneut.", readingSource: "Quelle wird gelesen", draftingSocial: "Social-Formate werden erstellt", storyboarding: "Skript wird geplant", distilling: "Kernaussagen werden extrahiert", writingVisuals: "Bildprompts werden geschrieben", socialKit: "Social-Kit", videoScript: "Videoskript", takeaways: "Kernaussagen", visualPrompts: "Bildprompts", linkedinPost: "LinkedIn-Post", instagramCaption: "Instagram-Beschriftung", copyFullScript: "Vollständiges Skript kopieren", estimatedRuntime: "Geschätzte Dauer", hook: "Hook", visual: "Bild", narration: "Sprechertext", callToAction: "Handlungsaufforderung", language: "Sprache" },
  fr: { ...english, languageName: "Français", stepOne: "Première étape", inputTitle: "Collez votre source ou une idée", characters: "caractères", generate: "Générer le kit de contenu", generating: "Génération", stepTwo: "Deuxième étape", copy: "Copier", copied: "Copié", copyAll: "Tout copier", exportMarkdown: "Exporter .md", generationFailed: "Échec de la génération", networkError: "Erreur réseau. Réessayez.", readingSource: "Lecture de votre source", draftingSocial: "Création des formats sociaux", storyboarding: "Élaboration du script", distilling: "Synthèse des idées clés", writingVisuals: "Rédaction des prompts visuels", socialKit: "Kit social", videoScript: "Script vidéo", takeaways: "À retenir", visualPrompts: "Prompts visuels", linkedinPost: "Publication LinkedIn", instagramCaption: "Légende Instagram", copyFullScript: "Copier le script complet", estimatedRuntime: "Durée estimée", hook: "Accroche", visual: "Visuel", narration: "Narration", callToAction: "Appel à l'action", language: "Langue" },
  it: { ...english, languageName: "Italiano", stepOne: "Primo passo", inputTitle: "Incolla la tua fonte o un'idea", characters: "caratteri", generate: "Genera kit di contenuti", generating: "Generazione", stepTwo: "Secondo passo", copy: "Copia", copied: "Copiato", copyAll: "Copia tutto", exportMarkdown: "Esporta .md", generationFailed: "Generazione non riuscita", networkError: "Errore di rete. Riprova.", readingSource: "Lettura della fonte", draftingSocial: "Creazione dei formati social", storyboarding: "Strutturazione dello script", distilling: "Sintesi dei punti chiave", writingVisuals: "Scrittura dei prompt visivi", socialKit: "Kit social", videoScript: "Script video", takeaways: "Punti chiave", visualPrompts: "Prompt visivi", linkedinPost: "Post LinkedIn", instagramCaption: "Didascalia Instagram", copyFullScript: "Copia lo script completo", estimatedRuntime: "Durata stimata", hook: "Hook", visual: "Visual", narration: "Narrazione", callToAction: "Invito all'azione", language: "Lingua" },
};

export function getTranslations(locale: Locale): Translation {
  return translations[locale] || english;
}
