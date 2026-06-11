// Vocabulary for LE MANOIR — grounded in the beginner French textbook
// (chapters: Bonjour!, La salle de classe, Chez nous, La vie quotidienne,
//  les jours, Ma famille et mes animaux, Les quatre saisons, Chez le médecin)
//
// Each word: fr (canonical French), en (accepted English answers),
// hint (shown when the player asks for help).

const ROOMS = [
  {
    id: "gate",
    fr: "La Grille du Manoir",
    en: "The Manor Gate",
    desc: "Une voix t'accueille dans le noir. Réponds-lui pour entrer…",
    descEn: "A voice greets you in the dark. Answer it to enter…",
    glyph: "gate",
    words: [
      { fr: "bonjour", en: ["hello", "good morning", "good day"], hint: "a greeting, in the morning" },
      { fr: "bonsoir", en: ["good evening"], hint: "a greeting… after dark" },
      { fr: "salut", en: ["hi", "hey"], hint: "an informal greeting" },
      { fr: "au revoir", en: ["goodbye", "bye"], hint: "you say it when you leave… if you leave" },
      { fr: "je m'appelle", en: ["my name is", "i am called", "i'm called"], hint: "Je … Nicolas." },
      { fr: "ça va ?", en: ["how are you", "how is it going", "are you ok", "how's it going"], hint: "asking how someone is" },
      { fr: "oui", en: ["yes"], hint: "the opposite of non" },
      { fr: "non", en: ["no"], hint: "the opposite of oui" },
      { fr: "merci", en: ["thank you", "thanks"], hint: "you say it when given something" },
      { fr: "à bientôt", en: ["see you soon"], hint: "a farewell… a promise to return" }
    ]
  },
  {
    id: "classroom",
    fr: "La Salle de Classe Abandonnée",
    en: "The Abandoned Classroom",
    desc: "Des pupitres vides. Quelque chose a écrit au tableau…",
    descEn: "Empty desks. Something has written on the board…",
    glyph: "classroom",
    words: [
      { fr: "le tableau", en: ["board", "blackboard", "whiteboard"], hint: "the teacher writes on it" },
      { fr: "le pupitre", en: ["desk", "school desk"], hint: "a pupil sits at it" },
      { fr: "le stylo", en: ["pen"], hint: "you write with it, in ink" },
      { fr: "le crayon", en: ["pencil"], hint: "you write with it, you can erase it" },
      { fr: "le cahier", en: ["exercise book", "notebook", "workbook"], hint: "you write your homework in it" },
      { fr: "le livre", en: ["book"], hint: "you read it" },
      { fr: "la gomme", en: ["eraser", "rubber"], hint: "it erases pencil marks" },
      { fr: "la règle", en: ["ruler"], hint: "you draw straight lines with it" },
      { fr: "la porte", en: ["door"], hint: "it just slammed shut behind you" },
      { fr: "la fenêtre", en: ["window"], hint: "the glass is cracked… look through it" },
      { fr: "l'ordinateur", en: ["computer"], hint: "its screen still glows" },
      { fr: "la poubelle", en: ["bin", "trash can", "rubbish bin", "garbage can"], hint: "you throw rubbish in it" }
    ]
  },
  {
    id: "corridor",
    fr: "Le Couloir Sans Fin",
    en: "The Endless Corridor",
    desc: "Où est la sortie ? Devant ? Derrière ? Les murs murmurent…",
    descEn: "Where is the exit? In front? Behind? The walls whisper…",
    glyph: "corridor",
    words: [
      { fr: "devant", en: ["in front of", "in front"], hint: "the opposite of behind" },
      { fr: "derrière", en: ["behind"], hint: "don't look there" },
      { fr: "sous", en: ["under", "underneath", "below"], hint: "the opposite of on top of" },
      { fr: "sur", en: ["on", "on top of"], hint: "the opposite of under" },
      { fr: "à côté de", en: ["next to", "beside"], hint: "right at your side" },
      { fr: "entre", en: ["between"], hint: "in the middle of two things" },
      { fr: "où est", en: ["where is"], hint: "… la sortie ?" },
      { fr: "dans", en: ["in", "inside"], hint: "Il est … ma classe." },
      { fr: "ici", en: ["here"], hint: "this very spot" },
      { fr: "là-bas", en: ["over there"], hint: "far away, at the end of the corridor" }
    ]
  },
  {
    id: "kitchen",
    fr: "La Cuisine Froide",
    en: "The Cold Kitchen",
    desc: "La table est mise pour un dîner que personne n'a mangé…",
    descEn: "The table is set for a dinner no one ever ate…",
    glyph: "kitchen",
    words: [
      { fr: "une assiette", en: ["plate"], hint: "you eat from it" },
      { fr: "le couteau", en: ["knife"], hint: "it cuts… still sharp" },
      { fr: "la cuillère", en: ["spoon"], hint: "you stir coffee with it" },
      { fr: "le verre", en: ["glass"], hint: "you drink from it" },
      { fr: "le bol", en: ["bowl"], hint: "for cereal or hot chocolate" },
      { fr: "le beurre", en: ["butter"], hint: "you spread it on bread" },
      { fr: "la confiture", en: ["jam"], hint: "sweet, red, spread on bread" },
      { fr: "le jus d'orange", en: ["orange juice"], hint: "a fruit juice, for breakfast" },
      { fr: "une tartine", en: ["slice of bread", "slice of bread and butter"], hint: "Elle donne une … à Robert." },
      { fr: "le petit-déjeuner", en: ["breakfast"], hint: "the first meal of the day" }
    ]
  },
  {
    id: "bedroom",
    fr: "La Chambre du Maître",
    en: "The Master's Bedroom",
    desc: "Le lit est défait. Quelqu'un vient de se lever…",
    descEn: "The bed is unmade. Someone has just gotten up…",
    glyph: "bedroom",
    words: [
      { fr: "se réveiller", en: ["to wake up", "wake up"], hint: "to open your eyes in the morning" },
      { fr: "se lever", en: ["to get up", "get up"], hint: "to leave your bed" },
      { fr: "se laver", en: ["to wash", "to wash oneself", "wash"], hint: "to get clean" },
      { fr: "s'habiller", en: ["to get dressed", "get dressed", "to dress"], hint: "to put your clothes on" },
      { fr: "je me lave", en: ["i wash", "i wash myself"], hint: "what *I* do in the bathroom" },
      { fr: "la chambre", en: ["bedroom", "room"], hint: "you sleep in this room" },
      { fr: "la salle de bains", en: ["bathroom"], hint: "the room with the bathtub" },
      { fr: "le lit", en: ["bed"], hint: "you sleep in it… it is still warm" },
      { fr: "je mets", en: ["i put", "i put on"], hint: "the verb mettre, with je" },
      { fr: "la nuit", en: ["night", "the night"], hint: "when it is dark outside" }
    ]
  },
  {
    id: "clock",
    fr: "La Tour de l'Horloge",
    en: "The Clock Tower",
    desc: "L'horloge sonne sans cesse. Quel jour sommes-nous ? Quelle heure est-il ?",
    descEn: "The clock keeps striking. What day is it? What time is it?",
    glyph: "clock",
    words: [
      { fr: "lundi", en: ["monday"], hint: "the first day of the school week" },
      { fr: "mardi", en: ["tuesday"], hint: "the day after Monday" },
      { fr: "mercredi", en: ["wednesday"], hint: "the middle of the week" },
      { fr: "jeudi", en: ["thursday"], hint: "the day before Friday" },
      { fr: "vendredi", en: ["friday"], hint: "the last school day" },
      { fr: "samedi", en: ["saturday"], hint: "the first day of the weekend" },
      { fr: "dimanche", en: ["sunday"], hint: "the last day of the week" },
      { fr: "minuit", en: ["midnight"], hint: "twelve o'clock… at night" },
      { fr: "midi", en: ["noon", "midday"], hint: "twelve o'clock, in the day" },
      { fr: "quelle heure est-il ?", en: ["what time is it"], hint: "you ask this to know the hour" }
    ]
  },
  {
    id: "gallery",
    fr: "La Galerie des Portraits",
    en: "The Portrait Gallery",
    desc: "Les yeux des tableaux te suivent. C'est une famille… ta famille ?",
    descEn: "The portraits' eyes follow you. A family… your family?",
    glyph: "gallery",
    words: [
      { fr: "la famille", en: ["family"], hint: "all of them together" },
      { fr: "la mère", en: ["mother", "mum", "mom"], hint: "your female parent" },
      { fr: "le père", en: ["father", "dad"], hint: "your male parent" },
      { fr: "le frère", en: ["brother"], hint: "a boy with the same parents as you" },
      { fr: "la sœur", en: ["sister"], hint: "a girl with the same parents as you" },
      { fr: "la grand-mère", en: ["grandmother", "grandma", "granny"], hint: "your mother's mother" },
      { fr: "le grand-père", en: ["grandfather", "grandpa"], hint: "your father's father" },
      { fr: "la tante", en: ["aunt"], hint: "your parent's sister" },
      { fr: "l'oncle", en: ["uncle"], hint: "your parent's brother" },
      { fr: "le cousin", en: ["cousin"], hint: "your uncle's son" }
    ]
  },
  {
    id: "menagerie",
    fr: "La Ménagerie",
    en: "The Menagerie",
    desc: "Les cages sont ouvertes. Tu entends des griffes sur le sol…",
    descEn: "The cages are open. You hear claws on the floor…",
    glyph: "menagerie",
    words: [
      { fr: "le chien", en: ["dog"], hint: "it barks… or it used to" },
      { fr: "le chat", en: ["cat"], hint: "its eyes glow in the dark" },
      { fr: "le cheval", en: ["horse"], hint: "you can ride it" },
      { fr: "l'oiseau", en: ["bird"], hint: "it flies and sings" },
      { fr: "le poisson", en: ["fish"], hint: "it lives in water" },
      { fr: "le lapin", en: ["rabbit"], hint: "long ears, hops" },
      { fr: "la souris", en: ["mouse"], hint: "small, grey, the cat hunts it" },
      { fr: "l'araignée", en: ["spider"], hint: "eight legs, spins webs in every corner here" },
      { fr: "le serpent", en: ["snake"], hint: "it slithers, no legs" },
      { fr: "la chauve-souris", en: ["bat"], hint: "it flies at night, sleeps upside down" }
    ]
  },
  {
    id: "cellar",
    fr: "La Cave et l'Orage",
    en: "The Cellar and the Storm",
    desc: "Dehors, l'orage gronde. Ici, il fait si froid…",
    descEn: "Outside, the storm growls. In here, it is so cold…",
    glyph: "cellar",
    words: [
      { fr: "l'hiver", en: ["winter"], hint: "the coldest season" },
      { fr: "l'été", en: ["summer"], hint: "the hottest season" },
      { fr: "le printemps", en: ["spring"], hint: "the season of flowers" },
      { fr: "l'automne", en: ["autumn", "fall"], hint: "the season of falling leaves" },
      { fr: "il pleut", en: ["it is raining", "it's raining", "it rains"], hint: "water falls from the sky" },
      { fr: "il neige", en: ["it is snowing", "it's snowing", "it snows"], hint: "white flakes fall from the sky" },
      { fr: "il fait froid", en: ["it is cold", "it's cold"], hint: "you shiver… like now" },
      { fr: "il fait chaud", en: ["it is hot", "it's hot"], hint: "the opposite of il fait froid" },
      { fr: "l'orage", en: ["storm", "thunderstorm"], hint: "thunder and lightning" },
      { fr: "le vent", en: ["wind"], hint: "you hear it howling outside" }
    ]
  },
  {
    id: "door",
    fr: "La Porte Finale",
    en: "The Final Door",
    desc: "La Chose est là, tout près. Nomme-la, partie par partie, et la porte s'ouvrira…",
    descEn: "The Thing is here, so close. Name it, part by part, and the door will open…",
    glyph: "door",
    words: [
      { fr: "la tête", en: ["head"], hint: "it turns towards you" },
      { fr: "les yeux", en: ["eyes"], hint: "two of them, glowing" },
      { fr: "la bouche", en: ["mouth"], hint: "it opens… too wide" },
      { fr: "les dents", en: ["teeth"], hint: "white, sharp, too many" },
      { fr: "la main", en: ["hand"], hint: "five fingers, reaching for you" },
      { fr: "le bras", en: ["arm"], hint: "between the shoulder and the hand" },
      { fr: "la jambe", en: ["leg"], hint: "you run with these" },
      { fr: "le pied", en: ["foot"], hint: "at the very bottom of the leg" },
      { fr: "le doigt", en: ["finger"], hint: "it points at you" },
      { fr: "le cœur", en: ["heart"], hint: "yours is beating so fast" }
    ]
  }
];

// Whispers The Manor speaks at random — each one is real French you absorb.
const WHISPERS = [
  { fr: "Je te vois…", en: "I see you…" },
  { fr: "Derrière toi…", en: "Behind you…" },
  { fr: "Ne te retourne pas…", en: "Don't turn around…" },
  { fr: "Reste avec nous…", en: "Stay with us…" },
  { fr: "Tu ne peux pas partir…", en: "You cannot leave…" },
  { fr: "Il arrive…", en: "He is coming…" },
  { fr: "Écoute…", en: "Listen…" },
  { fr: "Plus vite…", en: "Faster…" },
  { fr: "La porte est fermée…", en: "The door is locked…" },
  { fr: "Souviens-toi de moi…", en: "Remember me…" },
  { fr: "Tu es presque arrivé…", en: "You are almost there…" },
  { fr: "Quelqu'un est dans la maison…", en: "Someone is in the house…" }
];

// Spoken reactions (also real French, reinforced every round)
const VOICE_LINES = {
  correct: [
    { fr: "Très bien…", en: "Very good…" },
    { fr: "C'est ça…", en: "That's it…" },
    { fr: "Continue…", en: "Keep going…" },
    { fr: "Bien joué…", en: "Well played…" }
  ],
  wrong: [
    { fr: "Non…", en: "No…" },
    { fr: "Ce n'est pas ça…", en: "That's not it…" },
    { fr: "Essaie encore…", en: "Try again…" }
  ],
  enterRoom: [
    { fr: "Entre…", en: "Come in…" },
    { fr: "La porte s'ouvre…", en: "The door opens…" }
  ]
};
