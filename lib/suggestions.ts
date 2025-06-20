export function getLanguageSuggestions(languageCode: string): string[] {
  const commonSuggestions = [
    "Hello, how are you?",
    "What's the weather like today?",
    "Tell me about your culture",
    "What are some popular foods in your region?",
    "How do you say 'thank you' in your language?",
  ]

  const languageSpecificSuggestions: Record<string, string[]> = {
    english: ["Hello, how are you?", "Can you help me?", "I'd like to learn about your culture", "What's your favorite food?", "Tell me about yourself"],
    ndebele: ["Kunjani?", "Ungangisiza?", "Ngifuna ukufunda isiNdebele"],
    portuguese: ["Olá, como está?", "Pode me ajudar?", "Gostaria de aprender sobre a sua cultura", "Qual é a sua comida favorita?", "Fale-me sobre você"],
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
    oromo: ["Akkam jirta?", "Na gargaaruu dandeessaa?", "Afaan Oromoo barachuu barbaada"],
    somali: ["Iska waran?", "Ma i caawin kartaa?", "Waxaan rabaa inaan barto Af Soomaali"],
    tigrinya: ["ሰላም፣ ከመይ ኣለኻ?", "ክትሕግዘኒ ትኽእል ዶ?", "ትግርኛ ክመሃር እደሊ"],
    bambara: ["I ni ce/sogoma", "I bɛ se ka n dɛmɛ wa?", "N b'a fɛ ka Bamanankan kalan"],
    lingala: ["Mbote, ozali malamu?", "Okoki kosunga ngai?", "Nalingi koyekola Lingala"],
    kinyarwanda: ["Muraho, amakuru?", "Washobora kumfasha?", "Ndashaka kwiga Kinyarwanda"],
    wolof: ["Na nga def?", "Ndax mën nga ma dimbali?", "Dama bëgg jàng Wolof"],
    malagasy: ["Manao ahoana ianao?", "Afaka manampy ahy ve ianao?", "Te-hianatra fiteny Malagasy aho"],
    fulani: ["Jam waali?", "A waawi wallitde kam?", "Miɗo yiɗi ekkitaade Fulfulde"],
    chewa: ["Muli bwanji?", "Mungandithandize?", "Ndifuna kuphunzira Chichewa"],
    nyanja: ["Muli bwanji?", "Mungandithandize?", "Ndifuna kuphunzira Chinyanja"],
    dutch: ["Hallo, hoe gaat het?", "Kun je me helpen?", "Ik wil graag meer leren over jouw kultuur", "Wat is jouw favoriete eten?", "Vertel me iets over jezelf"],
  }

  // Return language-specific suggestions if available, otherwise return common suggestions
  return languageSpecificSuggestions[languageCode] || commonSuggestions
}

