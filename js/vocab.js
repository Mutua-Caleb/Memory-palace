// Vocabulary for LE MANOIR — grounded in the beginner French textbook
// (chapters: Bonjour!, La salle de classe, Chez nous, La vie quotidienne,
//  les jours, Ma famille et mes animaux, Les quatre saisons, Chez le médecin)
//
// Each word: fr (canonical French), en (accepted English answers),
// hint (shown when the player asks for help).

const ROOMS = [
  {
    id: "gate",
    fr: "Mémoire I — La Grille sous l'Orage",
    en: "Memory I — The Gate in the Storm",
    desc: "Ta première mémoire. Il pleuvait, ce soir-là. Quelqu'un t'a dit bonjour… puis a disparu sous la pluie.",
    descEn: "Your first memory. It was raining that night. Someone said hello to you… then vanished into the rain.",
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
    fr: "Mémoire II — La Salle de Classe",
    en: "Memory II — The Classroom",
    desc: "Du sang sèche sur les pupitres. C'était ta classe, autrefois. Quelque chose a écrit ton nom au tableau.",
    descEn: "Blood dries on the desks. This was your classroom, once. Something has written your name on the board.",
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
    fr: "Mémoire III — Le Couloir",
    en: "Memory III — The Corridor",
    desc: "Tu courais dans ce couloir, cette nuit-là. Quelque chose courait derrière toi. Il y a des traces rouges sur le sol.",
    descEn: "You ran down this corridor that night. Something ran behind you. There are red footprints on the floor.",
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
    fr: "Mémoire IV — La Cuisine",
    en: "Memory IV — The Kitchen",
    desc: "Le dîner est encore sur la table, froid depuis des années. Le sang aussi.",
    descEn: "Dinner is still on the table, cold for years. So is the blood.",
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
    fr: "Mémoire V — La Chambre",
    en: "Memory V — The Bedroom",
    desc: "Tu t'es réveillé ici, cette nuit-là. Le lit est encore chaud. La pluie frappe la fenêtre.",
    descEn: "You woke up here that night. The bed is still warm. Rain beats against the window.",
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
    fr: "Mémoire VI — La Tour de l'Horloge",
    en: "Memory VI — The Clock Tower",
    desc: "L'horloge sonne encore le jour où tout s'est arrêté. Minuit. Toujours minuit.",
    descEn: "The clock still strikes the day everything stopped. Midnight. Always midnight.",
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
    fr: "Mémoire VII — La Galerie des Portraits",
    en: "Memory VII — The Portrait Gallery",
    desc: "Ta famille te regarde depuis les cadres. Leurs yeux te suivent. Leurs yeux pleurent du sang.",
    descEn: "Your family watches you from the frames. Their eyes follow you. Their eyes weep blood.",
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
    fr: "Mémoire VIII — La Ménagerie",
    en: "Memory VIII — The Menagerie",
    desc: "Les cages sont ouvertes et vides. Les animaux se souviennent de toi. Tu entends des griffes dans le noir.",
    descEn: "The cages are open and empty. The animals remember you. You hear claws in the dark.",
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
    fr: "Mémoire IX — La Cave",
    en: "Memory IX — The Cellar",
    desc: "La pluie coule entre les pierres, rouge. L'orage n'a jamais cessé ici.",
    descEn: "Rain seeps between the stones, red. The storm never stopped down here.",
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
    fr: "Mémoire X — La Dernière Mémoire",
    en: "Memory X — The Last Memory",
    desc: "C'est ici que tu l'as vu pour la première fois. Nomme-le, partie par partie, et souviens-toi de tout.",
    descEn: "This is where you saw it for the first time. Name it, part by part, and remember everything.",
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

// Full sentences from the book's exercises — phase 2 of every room.
// These are dictation: the voice speaks the sentence, you type it in French.
// hint = the English meaning (shown by the hint button).
const SENTENCES = {
  gate: [
    { fr: "Bonjour, je m'appelle Nicolas.", en: ["hello, my name is nicolas"], hint: "Hello, my name is Nicolas." },
    { fr: "Comment t'appelles-tu ?", en: ["what is your name"], hint: "What is your name?" },
    { fr: "Ça va bien, merci.", en: ["i am fine, thank you"], hint: "I am fine, thank you." },
    { fr: "Au revoir, à bientôt.", en: ["goodbye, see you soon"], hint: "Goodbye, see you soon." }
  ],
  classroom: [
    { fr: "Je suis dans la classe.", en: ["i am in the classroom"], hint: "I am in the classroom." },
    { fr: "Où est ma règle ?", en: ["where is my ruler"], hint: "Where is my ruler?" },
    { fr: "Mon stylo est dans mon sac.", en: ["my pen is in my bag"], hint: "My pen is in my bag." },
    { fr: "Dans ma salle de classe, il y a un stylo.", en: ["in my classroom there is a pen"], hint: "In my classroom, there is a pen." },
    { fr: "Le prof est fou !", en: ["the teacher is mad"], hint: "The teacher is mad!" }
  ],
  corridor: [
    { fr: "La poubelle est derrière la porte.", en: ["the bin is behind the door"], hint: "The bin is behind the door." },
    { fr: "Le chat est sous la table.", en: ["the cat is under the table"], hint: "The cat is under the table." },
    { fr: "Où est la sortie ?", en: ["where is the exit"], hint: "Where is the exit?" },
    { fr: "Il est devant la fenêtre.", en: ["he is in front of the window"], hint: "He is in front of the window." }
  ],
  kitchen: [
    { fr: "Elle donne une tartine à Robert.", en: ["she gives a slice of bread to robert"], hint: "She gives a slice of bread to Robert. (straight from the book)" },
    { fr: "Le couteau est sur la table.", en: ["the knife is on the table"], hint: "The knife is on the table." },
    { fr: "Maman met la table pour le petit-déjeuner.", en: ["mum sets the table for breakfast"], hint: "Mum sets the table for breakfast." },
    { fr: "Il y a du beurre et de la confiture.", en: ["there is butter and jam"], hint: "There is butter and jam." }
  ],
  bedroom: [
    { fr: "Je me lave dans la salle de bains.", en: ["i wash in the bathroom"], hint: "I wash (myself) in the bathroom." },
    { fr: "Elle se lève à sept heures.", en: ["she gets up at seven"], hint: "She gets up at seven o'clock." },
    { fr: "Je me réveille et je me lève.", en: ["i wake up and i get up"], hint: "I wake up and I get up." },
    { fr: "Tu t'habilles dans ta chambre.", en: ["you get dressed in your bedroom"], hint: "You get dressed in your bedroom." }
  ],
  clock: [
    { fr: "Je vais à l'école lundi.", en: ["i go to school on monday"], hint: "I go to school on Monday. (straight from the book)" },
    { fr: "J'aime les lundis.", en: ["i like mondays"], hint: "I like Mondays." },
    { fr: "Il est trois heures.", en: ["it is three o'clock"], hint: "It is three o'clock." },
    { fr: "Il fait ses devoirs à cinq heures.", en: ["he does his homework at five"], hint: "He does his homework at five o'clock." }
  ],
  gallery: [
    { fr: "J'ai un frère et une sœur.", en: ["i have a brother and a sister"], hint: "I have a brother and a sister." },
    { fr: "Ma mère s'appelle Marie.", en: ["my mother is called marie"], hint: "My mother is called Marie." },
    { fr: "J'ai onze ans.", en: ["i am eleven years old"], hint: "I am eleven years old." },
    { fr: "Mon cousin a dix ans.", en: ["my cousin is ten years old"], hint: "My cousin is ten years old." }
  ],
  menagerie: [
    { fr: "J'ai un chien et deux chats.", en: ["i have a dog and two cats"], hint: "I have a dog and two cats." },
    { fr: "La souris est sous le placard.", en: ["the mouse is under the cupboard"], hint: "The mouse is under the cupboard." },
    { fr: "Tu aimes les animaux ?", en: ["do you like animals"], hint: "Do you like animals?" },
    { fr: "Mon chien s'appelle Max.", en: ["my dog is called max"], hint: "My dog is called Max." }
  ],
  cellar: [
    { fr: "Il pleut et il fait froid.", en: ["it is raining and it is cold"], hint: "It is raining and it is cold." },
    { fr: "Il neige en hiver.", en: ["it snows in winter"], hint: "It snows in winter." },
    { fr: "Il fait chaud en été.", en: ["it is hot in summer"], hint: "It is hot in summer." },
    { fr: "Au printemps, il pleut souvent.", en: ["in spring it often rains"], hint: "In spring, it often rains." }
  ],
  door: [
    { fr: "J'ai mal à la tête.", en: ["my head hurts"], hint: "My head hurts. (at the doctor's, in the book)" },
    { fr: "J'ai deux yeux et une bouche.", en: ["i have two eyes and a mouth"], hint: "I have two eyes and a mouth." },
    { fr: "Il est derrière toi !", en: ["it is behind you"], hint: "It is behind you!" },
    { fr: "La porte s'ouvre enfin.", en: ["the door finally opens"], hint: "The door finally opens." }
  ]
};

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
