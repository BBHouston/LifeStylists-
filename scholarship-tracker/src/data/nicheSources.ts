export interface NicheCategory {
  id: string;
  title: string;
  icon: string;
  tagline: string;
  why: string;
  howToFind: string[];
  searchPrompts: string[];
  examples: string[];
  avgAmount: string;
  competition: 'very low' | 'low' | 'medium';
  effortHours: number;
}

export const NICHE_CATEGORIES: NicheCategory[] = [
  {
    id: 'local-foundations',
    title: 'Local Community Foundations',
    icon: '🏛️',
    tagline: 'Least known, least competed—your hometown may be funding you.',
    why: 'Most students ignore hyper-local grants. A $500–$5,000 award from a city foundation is far easier to win than a national scholarship with 50,000 applicants.',
    howToFind: [
      'Search "[your city/county] community foundation scholarship"',
      'Visit the Community Foundation Locator at cflocator.org',
      'Ask your local library reference desk—they keep lists',
      'Call your high school or college financial aid office for local lists',
    ],
    searchPrompts: [
      '"[city name] community foundation" scholarship',
      '"[county name] charitable trust" education grant',
      '"[state] community foundation" student award',
    ],
    examples: [
      'Greater Kansas City Community Foundation',
      'Silicon Valley Community Foundation',
      'Boston Foundation',
      'Your local United Way education fund',
    ],
    avgAmount: '$500–$5,000',
    competition: 'very low',
    effortHours: 4,
  },
  {
    id: 'professional-associations',
    title: 'Professional & Trade Associations',
    icon: '🤝',
    tagline: 'Every industry has its own scholarship pool—most go unclaimed.',
    why: 'Associations for your intended career field allocate scholarship funds every year that often go partially unclaimed because students don\'t know they exist.',
    howToFind: [
      'Search "[your major] professional association scholarship"',
      'Look up your field\'s national association (e.g., IEEE, AMA, ABA, AICPA)',
      'Check if a parent or guardian\'s union or employer offers education grants',
      'Ask professors in your major—they know their field\'s associations',
    ],
    searchPrompts: [
      '"[field of study] association" scholarship application',
      '"[industry] foundation" education award',
      '"[profession] society" student grant',
    ],
    examples: [
      'IEEE Foundation (Engineering/CS)',
      'American Medical Association Foundation',
      'National Society of Professional Engineers',
      'Society of Women Engineers',
      'American Bar Association scholarships',
      'National Restaurant Association (Hospitality)',
    ],
    avgAmount: '$1,000–$10,000',
    competition: 'low',
    effortHours: 6,
  },
  {
    id: 'alumni-groups',
    title: 'Alumni Networks & Fraternities/Sororities',
    icon: '🎓',
    tagline: 'Graduates love to fund the next generation—tap their networks.',
    why: 'Alumni organizations at your target school or from your hometown high school routinely award scholarships that barely get advertised. Affiliation is often the only requirement.',
    howToFind: [
      'Contact your college\'s alumni office directly—ask about alumni scholarships',
      'Search your high school\'s alumni association or booster club',
      'Look into Greek organization national scholarship funds',
      'Check alumni associations tied to your hometown or state',
    ],
    searchPrompts: [
      '"[college name] alumni association" scholarship',
      '"[high school name] alumni foundation" award',
      '"[Greek organization] scholarship" application',
    ],
    examples: [
      'Your university\'s alumni association awards',
      'NPHC organizations (Alpha Kappa Alpha, Kappa Alpha Psi, etc.)',
      'Rotary Club alumni foundation',
      'Kiwanis Club scholarship programs',
    ],
    avgAmount: '$500–$3,000',
    competition: 'very low',
    effortHours: 3,
  },
  {
    id: 'employer-union',
    title: 'Employer, Union & Parent Company Grants',
    icon: '🏢',
    tagline: 'Check your family\'s employer—it may already owe you money.',
    why: 'Thousands of corporations and unions offer education grants to employees\' children. These are among the least-competed scholarships available because they require an insider connection.',
    howToFind: [
      'Ask each parent/guardian to check with HR for education benefits or dependent scholarships',
      'Search "[company name] scholarship" for any employer in your family',
      'Check if family members belong to a union—almost all have scholarship programs',
      'Look up your state\'s largest employers and their foundations',
    ],
    searchPrompts: [
      '"[employer name] dependent scholarship" OR "education assistance"',
      '"[union name] scholarship fund"',
      '"[company] foundation" student award',
    ],
    examples: [
      'Walmart Foundation scholarship',
      'McDonald\'s HACER scholarship',
      'Target scholarship programs',
      'UAW, Teamsters, AFSCME union scholarships',
    ],
    avgAmount: '$1,000–$5,000',
    competition: 'very low',
    effortHours: 3,
  },
  {
    id: 'ethnic-cultural',
    title: 'Ethnic, Cultural & Heritage Organizations',
    icon: '🌍',
    tagline: 'Your background is an asset—heritage groups fund their community.',
    why: 'Cultural organizations from every background offer scholarships specifically for their community members. These are highly targeted and often under-applied-to compared to national awards.',
    howToFind: [
      'Search "[ethnicity/nationality] scholarship" + your state',
      'Look up community organizations tied to your heritage',
      'Check with local cultural centers, temples, mosques, churches',
      'Search national heritage foundations for your background',
    ],
    searchPrompts: [
      '"[heritage] scholarship" [state]',
      '"[cultural organization] education fund"',
      '"[nationality] American" foundation scholarship',
    ],
    examples: [
      'Hispanic Scholarship Fund',
      'United Negro College Fund (UNCF)',
      'Asian & Pacific Islander American Scholarship Fund',
      'National Italian American Foundation',
      'Polish American Congress Scholarship',
    ],
    avgAmount: '$1,000–$15,000',
    competition: 'low',
    effortHours: 5,
  },
  {
    id: 'religious',
    title: 'Religious & Faith Communities',
    icon: '⛪',
    tagline: 'Your faith community may have a scholarship you\'ve never heard of.',
    why: 'Local churches, mosques, synagogues, and national faith organizations regularly offer scholarships to members—often with minimal competition because they\'re rarely advertised outside the congregation.',
    howToFind: [
      'Ask your local religious leader or congregation administrator directly',
      'Search your faith denomination\'s national education fund',
      'Check parent organizations of your place of worship',
      'Look for regional faith councils with student awards',
    ],
    searchPrompts: [
      '"[denomination] scholarship fund" application',
      '"[faith organization] education award"',
      'Local congregation scholarship "[city]"',
    ],
    examples: [
      'United Methodist Church scholarships',
      'Catholic Diocese education grants',
      'Jewish Federation scholarship funds',
      'Islamic Scholarship Fund',
      'Local congregation merit awards',
    ],
    avgAmount: '$500–$2,500',
    competition: 'very low',
    effortHours: 3,
  },
  {
    id: 'civic-service',
    title: 'Civic & Service Clubs',
    icon: '🦁',
    tagline: 'Rotary, Lions, Elks—they hand out money and nobody asks for it.',
    why: 'Service clubs like Rotary, Lions, Kiwanis, Elks, and Optimist International exist in virtually every town and award local scholarships every year. Competition is minimal—most students never think to apply.',
    howToFind: [
      'Search "[club name] scholarship [your city]"',
      'Call your local club chapter directly and ask about education awards',
      'Visit the national club\'s website for state/local scholarship programs',
      'Ask a parent/guardian if they\'re a member—members\' children often get priority',
    ],
    searchPrompts: [
      '"Rotary Club" scholarship "[city or state]"',
      '"Lions Club" education award application',
      '"Kiwanis" scholarship [your region]',
      '"Elks Lodge" scholarship program',
    ],
    examples: [
      'Rotary Foundation Ambassadorial Scholarships',
      'Lions Club International Foundation',
      'Kiwanis International Foundation',
      'Elks National Foundation scholarships',
      'Optimist International Essay Contest',
    ],
    avgAmount: '$500–$4,000',
    competition: 'very low',
    effortHours: 4,
  },
  {
    id: 'state-local-govt',
    title: 'State & Local Government Programs',
    icon: '🏛️',
    tagline: 'State-funded aid beyond FAFSA—most students never look.',
    why: 'Beyond the well-known state grants tied to FAFSA, state agencies and local governments fund specialty scholarships for students in specific fields, regions, or circumstances.',
    howToFind: [
      'Search "[state name] higher education scholarship programs"',
      'Visit your state\'s higher education agency website',
      'Check your state legislature\'s education committee for special programs',
      'Look for state workforce development grants in high-demand fields',
    ],
    searchPrompts: [
      '"[state] workforce scholarship" [your field]',
      '"[state] promise scholarship" OR "state grant"',
      '"[state] department of education" scholarship programs',
    ],
    examples: [
      'State STEM workforce development grants',
      'Rural and underserved area healthcare scholarships',
      'State teacher shortage scholarships',
      'Governor\'s scholarship programs',
    ],
    avgAmount: '$1,000–$10,000',
    competition: 'low',
    effortHours: 5,
  },
];

export interface PipelineEntry {
  id: string;
  sourceName: string;
  categoryId: string;
  estimatedAmount: string;
  deadline?: string;
  fitScore: number;
  effortScore: number;
  urgencyScore: number;
  compositeScore: number;
  stage: 'discover' | 'prioritize' | 'apply';
  notes: string;
  website?: string;
  addedAt: string;
}

const PIPELINE_KEY = 'funding_pipeline_v1';

export function loadPipeline(): PipelineEntry[] {
  try {
    const raw = localStorage.getItem(PIPELINE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function savePipeline(entries: PipelineEntry[]): void {
  localStorage.setItem(PIPELINE_KEY, JSON.stringify(entries));
}

export function computeComposite(fit: number, effort: number, urgency: number): number {
  return Math.round((fit * 0.4 + urgency * 0.4 + (10 - effort) * 0.2));
}
