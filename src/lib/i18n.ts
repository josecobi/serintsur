/**
 * i18n utilities and UI string translations for Serintsur.
 *
 * UI chrome only (buttons, labels, placeholders, error messages).
 * Long-form content lives in Sanity via locale* fields — see src/lib/sanity.ts.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Locale primitives
// ─────────────────────────────────────────────────────────────────────────────

export type Locale = 'es' | 'en' | 'de';

export const LOCALES: readonly Locale[] = ['es', 'en', 'de'] as const;
export const DEFAULT_LOCALE: Locale = 'es';

export const LOCALE_LABELS: Record<Locale, string> = {
  es: 'ES',
  en: 'EN',
  de: 'DE',
};

export const LOCALE_NAMES: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
  de: 'Deutsch',
};

export const LOCALE_HREFLANG: Record<Locale, string> = {
  es: 'es-ES',
  en: 'en-US',
  de: 'de-DE',
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

// ─────────────────────────────────────────────────────────────────────────────
// Path helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Extract the locale from a pathname like `/es/servicios` or URL object. */
export function getLocaleFromUrl(url: URL | string): Locale {
  const pathname = typeof url === 'string' ? url : url.pathname;
  const segments = pathname.split('/').filter(Boolean);
  const first = segments[0];
  return first && isLocale(first) ? first : DEFAULT_LOCALE;
}

/** Strip any leading locale segment from a pathname. `/es/foo` → `/foo`. */
export function stripLocalePrefix(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length > 0 && isLocale(segments[0]!)) {
    segments.shift();
  }
  return '/' + segments.join('/');
}

/** Prefix a path with the given locale. Idempotent. */
export function localizedPath(pathname: string, locale: Locale): string {
  const stripped = stripLocalePrefix(pathname);
  const trimmed = stripped === '/' ? '' : stripped;
  return `/${locale}${trimmed}`;
}

/** Swap the locale in a pathname. `/es/foo` + `en` → `/en/foo`. */
export function switchLocalePath(pathname: string, newLocale: Locale): string {
  return localizedPath(pathname, newLocale);
}

/** Build hreflang alternate links for every locale given the current path. */
export function alternateLinks(
  pathname: string,
  origin: string,
): Array<{ locale: Locale; hreflang: string; href: string }> {
  return LOCALES.map((locale) => ({
    locale,
    hreflang: LOCALE_HREFLANG[locale],
    href: `${origin}${localizedPath(pathname, locale)}`,
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// UI string shape
// ─────────────────────────────────────────────────────────────────────────────

export interface UIStrings {
  site: {
    name: string;
    tagline: string;
    descriptionShort: string;
  };
  nav: {
    home: string;
    services: string;
    projects: string;
    about: string;
    estimator: string;
    contact: string;
    openMenu: string;
    closeMenu: string;
    switchLanguage: string;
  };
  services: {
    renovation: string;
    facade: string;
    construction: string;
    maintenance: string;
  };
  common: {
    readMore: string;
    seeAll: string;
    seeProjects: string;
    requestQuote: string;
    chatWhatsApp: string;
    callNow: string;
    loading: string;
    back: string;
    next: string;
    submit: string;
    close: string;
    year: string;
    location: string;
    client: string;
    service: string;
    area: string;
    duration: string;
    status: string;
  };
  status: {
    completed: string;
    in_progress: string;
    upcoming: string;
  };
  provinces: {
    Cádiz: string;
    Málaga: string;
    Sevilla: string;
  };
  contact: {
    heading: string;
    subheading: string;
    fields: {
      name: string;
      phone: string;
      email: string;
      emailOptional: string;
      message: string;
      subject: string;
    };
    placeholders: {
      name: string;
      phone: string;
      email: string;
      message: string;
    };
    consent: string;
    submit: string;
    submitting: string;
    success: string;
    error: string;
    validation: {
      required: string;
      invalidEmail: string;
      invalidPhone: string;
      tooShort: string;
    };
  };
  estimator: {
    heading: string;
    subheading: string;
    stepLabel: string;
    of: string;
    steps: {
      projectType: string;
      area: string;
      quality: string;
      location: string;
      contact: string;
    };
    projectTypes: {
      renovation: string;
      facade: string;
      construction: string;
      maintenance: string;
    };
    quality: {
      basic: string;
      basicDesc: string;
      mid: string;
      midDesc: string;
      high: string;
      highDesc: string;
      premium: string;
      premiumDesc: string;
    };
    areaLabel: string;
    areaUnit: string;
    result: {
      heading: string;
      priceRange: string;
      from: string;
      to: string;
      disclaimer: string;
      ctaWhatsApp: string;
      ctaContact: string;
      startOver: string;
    };
    prev: string;
    next: string;
    getEstimate: string;
  };
  chatbot: {
    title: string;
    greeting: string;
    placeholder: string;
    sending: string;
    errorGeneric: string;
    disclaimer: string;
    openLabel: string;
    closeLabel: string;
    poweredBy: string;
    quickReplies: {
      services: string;
      quote: string;
      timeline: string;
      contact: string;
    };
  };
  projectFilter: {
    all: string;
    byService: string;
    byProvince: string;
    byYear: string;
    reset: string;
    resultsCount: string; // "{count} proyectos"
    noResults: string;
  };
  footer: {
    address: string;
    phone: string;
    email: string;
    hours: string;
    followUs: string;
    rights: string;
    legalNotice: string;
    privacyPolicy: string;
    cookies: string;
    builtBy: string;
  };
  errors: {
    generic: string;
    notFound: string;
    tryAgain: string;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Translations
//
// Spanish is the source of truth (primary market). English and German are
// best-effort — Content Agent will polish, especially German.
// ─────────────────────────────────────────────────────────────────────────────

const es: UIStrings = {
  site: {
    name: 'Serintsur Multiservicios',
    tagline: 'Construcción, rehabilitación y mantenimiento en Cádiz, Málaga y Sevilla',
    descriptionShort:
      'Empresa de construcción y rehabilitación con sede en Jerez de la Frontera. Reformas integrales, fachadas, villas y mantenimiento de edificios.',
  },
  nav: {
    home: 'Inicio',
    services: 'Servicios',
    projects: 'Proyectos',
    about: 'Sobre nosotros',
    estimator: 'Presupuesto',
    contact: 'Contacto',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    switchLanguage: 'Cambiar idioma',
  },
  services: {
    renovation: 'Reformas integrales',
    facade: 'Rehabilitación de fachadas',
    construction: 'Construcción de villas',
    maintenance: 'Mantenimiento de edificios',
  },
  common: {
    readMore: 'Leer más',
    seeAll: 'Ver todos',
    seeProjects: 'Ver proyectos',
    requestQuote: 'Solicitar presupuesto',
    chatWhatsApp: 'Chatear por WhatsApp',
    callNow: 'Llamar ahora',
    loading: 'Cargando…',
    back: 'Volver',
    next: 'Siguiente',
    submit: 'Enviar',
    close: 'Cerrar',
    year: 'Año',
    location: 'Ubicación',
    client: 'Cliente',
    service: 'Servicio',
    area: 'Superficie',
    duration: 'Duración',
    status: 'Estado',
  },
  status: {
    completed: 'Completado',
    in_progress: 'En curso',
    upcoming: 'Próximamente',
  },
  provinces: {
    Cádiz: 'Cádiz',
    Málaga: 'Málaga',
    Sevilla: 'Sevilla',
  },
  contact: {
    heading: 'Hablemos de tu proyecto',
    subheading:
      'Cuéntanos qué necesitas y te responderemos en menos de 24 horas con una propuesta inicial.',
    fields: {
      name: 'Nombre',
      phone: 'Teléfono',
      email: 'Email',
      emailOptional: 'Email (opcional)',
      message: 'Mensaje',
      subject: 'Asunto',
    },
    placeholders: {
      name: 'Tu nombre',
      phone: '600 000 000',
      email: 'tu@email.com',
      message: 'Describe brevemente tu proyecto…',
    },
    consent: 'He leído y acepto la política de privacidad.',
    submit: 'Enviar mensaje',
    submitting: 'Enviando…',
    success: 'Mensaje enviado. Te contactaremos pronto.',
    error: 'No hemos podido enviar el mensaje. Inténtalo de nuevo.',
    validation: {
      required: 'Este campo es obligatorio',
      invalidEmail: 'Email no válido',
      invalidPhone: 'Teléfono no válido',
      tooShort: 'Demasiado corto',
    },
  },
  estimator: {
    heading: 'Calcula tu presupuesto',
    subheading:
      'Responde 5 preguntas rápidas y te damos una estimación orientativa al instante.',
    stepLabel: 'Paso',
    of: 'de',
    steps: {
      projectType: '¿Qué tipo de proyecto?',
      area: '¿Cuántos metros cuadrados?',
      quality: '¿Qué nivel de acabados?',
      location: '¿Dónde está el proyecto?',
      contact: 'Tus datos de contacto',
    },
    projectTypes: {
      renovation: 'Reforma integral',
      facade: 'Rehabilitación de fachada',
      construction: 'Construcción nueva',
      maintenance: 'Mantenimiento',
    },
    quality: {
      basic: 'Básica',
      basicDesc: 'Acabados funcionales y duraderos',
      mid: 'Media',
      midDesc: 'Buen equilibrio entre calidad y precio',
      high: 'Alta',
      highDesc: 'Materiales de calidad superior y mejor diseño',
      premium: 'Premium',
      premiumDesc: 'Acabados de alta gama, diseño a medida y domótica',
    },
    areaLabel: 'Superficie estimada',
    areaUnit: 'm²',
    result: {
      heading: 'Tu presupuesto orientativo',
      priceRange: 'Rango de precio',
      from: 'Desde',
      to: 'Hasta',
      disclaimer:
        'Esta estimación es orientativa y no vinculante. Para un presupuesto exacto, necesitamos visitar la obra.',
      ctaWhatsApp: 'Enviar por WhatsApp',
      ctaContact: 'Solicitar visita técnica',
      startOver: 'Empezar de nuevo',
    },
    prev: 'Anterior',
    next: 'Siguiente',
    getEstimate: 'Obtener presupuesto',
  },
  chatbot: {
    title: 'Asistente Serintsur',
    greeting:
      '¡Hola! Soy el asistente virtual de Serintsur. ¿En qué puedo ayudarte? Puedo darte información sobre nuestros servicios, plazos o presupuestos.',
    placeholder: 'Escribe tu mensaje…',
    sending: 'Enviando…',
    errorGeneric: 'Hay un problema de conexión. Inténtalo de nuevo.',
    disclaimer: 'Las respuestas son generadas por IA. Para trámites oficiales, contacta a Jorge.',
    openLabel: 'Abrir chat',
    closeLabel: 'Cerrar chat',
    poweredBy: 'Asistente IA',
    quickReplies: {
      services: '¿Qué servicios ofrecen?',
      quote: 'Quiero un presupuesto',
      timeline: '¿Cuánto tarda una reforma?',
      contact: 'Hablar con un humano',
    },
  },
  projectFilter: {
    all: 'Todos',
    byService: 'Por servicio',
    byProvince: 'Por provincia',
    byYear: 'Por año',
    reset: 'Limpiar filtros',
    resultsCount: '{count} proyectos',
    noResults: 'No hay proyectos que coincidan con los filtros.',
  },
  footer: {
    address: 'Dirección',
    phone: 'Teléfono',
    email: 'Email',
    hours: 'Horario',
    followUs: 'Síguenos',
    rights: 'Todos los derechos reservados.',
    legalNotice: 'Aviso legal',
    privacyPolicy: 'Política de privacidad',
    cookies: 'Cookies',
    builtBy: 'Desarrollado por Cobitek',
  },
  errors: {
    generic: 'Algo ha salido mal.',
    notFound: 'Página no encontrada.',
    tryAgain: 'Inténtalo de nuevo',
  },
};

const en: UIStrings = {
  site: {
    name: 'Serintsur Multiservicios',
    tagline: 'Construction, renovation and maintenance across Cádiz, Málaga and Sevilla',
    descriptionShort:
      'Construction and renovation company based in Jerez de la Frontera. Full renovations, facade rehab, villa construction and building maintenance.',
  },
  nav: {
    home: 'Home',
    services: 'Services',
    projects: 'Projects',
    about: 'About us',
    estimator: 'Get a quote',
    contact: 'Contact',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    switchLanguage: 'Change language',
  },
  services: {
    renovation: 'Full renovations',
    facade: 'Facade rehabilitation',
    construction: 'Villa construction',
    maintenance: 'Building maintenance',
  },
  common: {
    readMore: 'Read more',
    seeAll: 'See all',
    seeProjects: 'See projects',
    requestQuote: 'Request a quote',
    chatWhatsApp: 'Chat on WhatsApp',
    callNow: 'Call now',
    loading: 'Loading…',
    back: 'Back',
    next: 'Next',
    submit: 'Send',
    close: 'Close',
    year: 'Year',
    location: 'Location',
    client: 'Client',
    service: 'Service',
    area: 'Area',
    duration: 'Duration',
    status: 'Status',
  },
  status: {
    completed: 'Completed',
    in_progress: 'In progress',
    upcoming: 'Upcoming',
  },
  provinces: {
    Cádiz: 'Cádiz',
    Málaga: 'Málaga',
    Sevilla: 'Sevilla',
  },
  contact: {
    heading: 'Let’s talk about your project',
    subheading:
      'Tell us what you need and we’ll get back to you within 24 hours with an initial proposal.',
    fields: {
      name: 'Name',
      phone: 'Phone',
      email: 'Email',
      emailOptional: 'Email (optional)',
      message: 'Message',
      subject: 'Subject',
    },
    placeholders: {
      name: 'Your name',
      phone: '+34 600 000 000',
      email: 'you@email.com',
      message: 'Briefly describe your project…',
    },
    consent: 'I have read and accept the privacy policy.',
    submit: 'Send message',
    submitting: 'Sending…',
    success: 'Message sent. We’ll be in touch soon.',
    error: 'We couldn’t send your message. Please try again.',
    validation: {
      required: 'This field is required',
      invalidEmail: 'Invalid email',
      invalidPhone: 'Invalid phone number',
      tooShort: 'Too short',
    },
  },
  estimator: {
    heading: 'Estimate your project',
    subheading: 'Answer 5 quick questions and get an instant ballpark figure.',
    stepLabel: 'Step',
    of: 'of',
    steps: {
      projectType: 'What kind of project?',
      area: 'How many square meters?',
      quality: 'What finish level?',
      location: 'Where is the project?',
      contact: 'Your contact details',
    },
    projectTypes: {
      renovation: 'Full renovation',
      facade: 'Facade rehabilitation',
      construction: 'New construction',
      maintenance: 'Maintenance',
    },
    quality: {
      basic: 'Basic',
      basicDesc: 'Functional, long-lasting finishes',
      mid: 'Mid-range',
      midDesc: 'Good balance of quality and price',
      high: 'High-end',
      highDesc: 'Higher-grade materials and better design',
      premium: 'Premium',
      premiumDesc: 'Top-tier finishes, bespoke design and smart-home systems',
    },
    areaLabel: 'Estimated area',
    areaUnit: 'm²',
    result: {
      heading: 'Your estimated budget',
      priceRange: 'Price range',
      from: 'From',
      to: 'To',
      disclaimer:
        'This is a non-binding estimate. We need an on-site visit for an exact quote.',
      ctaWhatsApp: 'Send via WhatsApp',
      ctaContact: 'Request an on-site visit',
      startOver: 'Start over',
    },
    prev: 'Previous',
    next: 'Next',
    getEstimate: 'Get estimate',
  },
  chatbot: {
    title: 'Serintsur Assistant',
    greeting:
      'Hi! I’m Serintsur’s virtual assistant. How can I help? I can answer questions about our services, timelines or quotes.',
    placeholder: 'Type your message…',
    sending: 'Sending…',
    errorGeneric: 'Connection problem. Please try again.',
    disclaimer: 'Answers are AI-generated. For formal matters, please contact Jorge directly.',
    openLabel: 'Open chat',
    closeLabel: 'Close chat',
    poweredBy: 'AI Assistant',
    quickReplies: {
      services: 'What services do you offer?',
      quote: 'I want a quote',
      timeline: 'How long does a renovation take?',
      contact: 'Talk to a human',
    },
  },
  projectFilter: {
    all: 'All',
    byService: 'By service',
    byProvince: 'By province',
    byYear: 'By year',
    reset: 'Clear filters',
    resultsCount: '{count} projects',
    noResults: 'No projects match these filters.',
  },
  footer: {
    address: 'Address',
    phone: 'Phone',
    email: 'Email',
    hours: 'Hours',
    followUs: 'Follow us',
    rights: 'All rights reserved.',
    legalNotice: 'Legal notice',
    privacyPolicy: 'Privacy policy',
    cookies: 'Cookies',
    builtBy: 'Built by Cobitek',
  },
  errors: {
    generic: 'Something went wrong.',
    notFound: 'Page not found.',
    tryAgain: 'Try again',
  },
};

const de: UIStrings = {
  site: {
    name: 'Serintsur Multiservicios',
    tagline: 'Bau, Sanierung und Instandhaltung in Cádiz, Málaga und Sevilla',
    descriptionShort:
      'Bau- und Sanierungsunternehmen mit Sitz in Jerez de la Frontera. Komplettsanierungen, Fassadensanierung, Villenbau und Gebäudeinstandhaltung.',
  },
  nav: {
    home: 'Startseite',
    services: 'Dienstleistungen',
    projects: 'Projekte',
    about: 'Über uns',
    estimator: 'Kostenvoranschlag',
    contact: 'Kontakt',
    openMenu: 'Menü öffnen',
    closeMenu: 'Menü schließen',
    switchLanguage: 'Sprache wechseln',
  },
  services: {
    renovation: 'Komplettsanierungen',
    facade: 'Fassadensanierung',
    construction: 'Villenbau',
    maintenance: 'Gebäudeinstandhaltung',
  },
  common: {
    readMore: 'Weiterlesen',
    seeAll: 'Alle ansehen',
    seeProjects: 'Projekte ansehen',
    requestQuote: 'Angebot anfordern',
    chatWhatsApp: 'Chat über WhatsApp',
    callNow: 'Jetzt anrufen',
    loading: 'Laden…',
    back: 'Zurück',
    next: 'Weiter',
    submit: 'Senden',
    close: 'Schließen',
    year: 'Jahr',
    location: 'Standort',
    client: 'Kunde',
    service: 'Dienstleistung',
    area: 'Fläche',
    duration: 'Dauer',
    status: 'Status',
  },
  status: {
    completed: 'Abgeschlossen',
    in_progress: 'Laufend',
    upcoming: 'Geplant',
  },
  provinces: {
    Cádiz: 'Cádiz',
    Málaga: 'Málaga',
    Sevilla: 'Sevilla',
  },
  contact: {
    heading: 'Sprechen wir über Ihr Projekt',
    subheading:
      'Sagen Sie uns, was Sie brauchen, und wir melden uns innerhalb von 24 Stunden mit einem ersten Vorschlag.',
    fields: {
      name: 'Name',
      phone: 'Telefon',
      email: 'E-Mail',
      emailOptional: 'E-Mail (optional)',
      message: 'Nachricht',
      subject: 'Betreff',
    },
    placeholders: {
      name: 'Ihr Name',
      phone: '+34 600 000 000',
      email: 'sie@email.com',
      message: 'Beschreiben Sie kurz Ihr Projekt…',
    },
    consent: 'Ich habe die Datenschutzerklärung gelesen und akzeptiere sie.',
    submit: 'Nachricht senden',
    submitting: 'Wird gesendet…',
    success: 'Nachricht gesendet. Wir melden uns in Kürze.',
    error: 'Die Nachricht konnte nicht gesendet werden. Bitte erneut versuchen.',
    validation: {
      required: 'Pflichtfeld',
      invalidEmail: 'Ungültige E-Mail',
      invalidPhone: 'Ungültige Telefonnummer',
      tooShort: 'Zu kurz',
    },
  },
  estimator: {
    heading: 'Kostenvoranschlag berechnen',
    subheading: 'Beantworten Sie 5 kurze Fragen und erhalten Sie sofort eine Schätzung.',
    stepLabel: 'Schritt',
    of: 'von',
    steps: {
      projectType: 'Welche Art von Projekt?',
      area: 'Wie viele Quadratmeter?',
      quality: 'Welche Ausstattung?',
      location: 'Wo befindet sich das Projekt?',
      contact: 'Ihre Kontaktdaten',
    },
    projectTypes: {
      renovation: 'Komplettsanierung',
      facade: 'Fassadensanierung',
      construction: 'Neubau',
      maintenance: 'Instandhaltung',
    },
    quality: {
      basic: 'Basis',
      basicDesc: 'Funktionale, langlebige Ausstattung',
      mid: 'Mittelklasse',
      midDesc: 'Gutes Preis-Leistungs-Verhältnis',
      high: 'Gehoben',
      highDesc: 'Hochwertige Materialien und besseres Design',
      premium: 'Premium',
      premiumDesc: 'Erstklassige Ausstattung, maßgeschneidertes Design und Smart-Home',
    },
    areaLabel: 'Geschätzte Fläche',
    areaUnit: 'm²',
    result: {
      heading: 'Ihr Richtpreis',
      priceRange: 'Preisspanne',
      from: 'Ab',
      to: 'Bis',
      disclaimer:
        'Unverbindliche Schätzung. Für ein genaues Angebot ist ein Vor-Ort-Termin nötig.',
      ctaWhatsApp: 'Per WhatsApp senden',
      ctaContact: 'Vor-Ort-Termin anfragen',
      startOver: 'Neu beginnen',
    },
    prev: 'Zurück',
    next: 'Weiter',
    getEstimate: 'Schätzung erhalten',
  },
  chatbot: {
    title: 'Serintsur-Assistent',
    greeting:
      'Hallo! Ich bin der virtuelle Assistent von Serintsur. Wie kann ich helfen? Ich beantworte Fragen zu Dienstleistungen, Zeitplänen oder Preisen.',
    placeholder: 'Nachricht eingeben…',
    sending: 'Wird gesendet…',
    errorGeneric: 'Verbindungsproblem. Bitte erneut versuchen.',
    disclaimer:
      'Antworten werden von einer KI generiert. Für offizielle Anfragen bitte Jorge direkt kontaktieren.',
    openLabel: 'Chat öffnen',
    closeLabel: 'Chat schließen',
    poweredBy: 'KI-Assistent',
    quickReplies: {
      services: 'Welche Leistungen bieten Sie?',
      quote: 'Ich möchte ein Angebot',
      timeline: 'Wie lange dauert eine Sanierung?',
      contact: 'Mit einem Menschen sprechen',
    },
  },
  projectFilter: {
    all: 'Alle',
    byService: 'Nach Dienstleistung',
    byProvince: 'Nach Provinz',
    byYear: 'Nach Jahr',
    reset: 'Filter zurücksetzen',
    resultsCount: '{count} Projekte',
    noResults: 'Keine Projekte entsprechen diesen Filtern.',
  },
  footer: {
    address: 'Adresse',
    phone: 'Telefon',
    email: 'E-Mail',
    hours: 'Öffnungszeiten',
    followUs: 'Folgen Sie uns',
    rights: 'Alle Rechte vorbehalten.',
    legalNotice: 'Impressum',
    privacyPolicy: 'Datenschutz',
    cookies: 'Cookies',
    builtBy: 'Entwickelt von Cobitek',
  },
  errors: {
    generic: 'Etwas ist schiefgelaufen.',
    notFound: 'Seite nicht gefunden.',
    tryAgain: 'Erneut versuchen',
  },
};

const translations: Record<Locale, UIStrings> = { es, en, de };

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

/** Get the full strings bundle for a locale. */
export function getStrings(locale: Locale): UIStrings {
  return translations[locale] ?? translations[DEFAULT_LOCALE];
}

/**
 * Template interpolation for strings with `{placeholder}` tokens.
 * e.g. `interpolate("{count} proyectos", { count: 5 }) → "5 proyectos"`.
 */
export function interpolate(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    key in values ? String(values[key]) : `{${key}}`,
  );
}
