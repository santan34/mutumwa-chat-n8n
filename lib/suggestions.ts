export function getLanguageSuggestions(languageCode: string): string[] {
  const commonSuggestions = [
    "Hello, how are you?",
    "What's the weather like today?",
    "Tell me about your culture",
    "What are some popular foods in your region?",
    "How do you say 'thank you' in your language?",
  ]

  const languageSpecificSuggestions: Record<string, string[]> = {
    shona: ["Makadii henyu?", "Mungandibatsirawo here?", "Ndingada kuziva nezvetsika dzechiShona"],
    swahili: ["Habari yako?", "Unaweza kunisaidia?", "Ningependa kujifunza Kiswahili"],
    amharic: ["ሰላም እንደምን ነህ?", "እባክህ ልትረዳኝ ትችላለህ?", "ስለ ኢትዮጵያ ባህል ንገረኝ"],
    hausa: ["Sannu, yaya kake?", "Za ka iya taimaka min?", "Ina son koyon Hausa"],
    yoruba: ["Bawo ni?", "Ṣe o le ran mi lọwọ?", "Mo fẹ kọ ede Yoruba"],
    igbo: ["Kedu?", "Biko, ị nwere ike inyere m aka?", "Achọrọ m ịmụta asụsụ Igbo"],
    zulu: ["Sawubona, unjani?", "Ungangisiza?", "Ngifuna ukufunda isiZulu"],
    xhosa: ["Molo, unjani?", "Ungandinceda?", "Ndifuna ukufunda isiXhosa"],
    afrikaans: ["Hallo, hoe gaan dit?", "Kan jy my help?", "Ek wil graag Afrikaans leer"],
    twi: ["Ɛte sɛn?", "Wobɛtumi aboa me?", "Mepɛ sɛ mesua Twi kasa"],
  }

  // Return language-specific suggestions if available, otherwise return common suggestions
  return languageSpecificSuggestions[languageCode] || commonSuggestions
}

