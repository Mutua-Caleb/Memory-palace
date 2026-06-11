# 🕯️ Le Palais de Mémoire — a horror game that teaches you French

Ten doors in a memory palace. Behind each one: a bloody, rain-soaked memory of
the past. **You physically walk through each door** — it creaks open in 3D,
your footsteps carry you in, and it slams shut behind you. Inside, a voice in
the dark speaks a French word; **type what you hear — in French or in
English — to move on.** The spoken French and its English translation appear
as subtitles at the top of the screen. Get it wrong or hesitate too long, and
The Thing in the memory takes one step closer.

The vocabulary follows a beginner French textbook chapter by chapter:
greetings, the classroom, prepositions, the kitchen table, the daily routine,
days of the week, the family, animals, seasons & weather, and the parts of the
body — each one staged as a room of the manor.

## ▶️ How to play

No build step, no install (Three.js is bundled). Either:

- **Open `index.html` directly** in a browser, or
- serve the folder: `python3 -m http.server` then visit `http://localhost:8000`

`index.html` is the **Minecraft-style 3D version**: a first-person voxel
palace. Click to capture the mouse, walk with **WASD / ZQSD / arrows**,
**Shift** to run, **Space** to jump, **Échap** to release the mouse. Walk
into a **glowing block** to hear its word; clear them all, then walk to the
blood-lit **door** for the sentence dictation — pass it and the door slides
open so you can walk into the next memory (it slams behind you). The Thing
stands between you and the door, and every mistake lets it creep closer.

Prefer the original cinematic 2D version? It lives at **`classic.html`**.

Then:

1. Pick your answer language — *Français* (recommended, double points),
   *English*, or *both accepted*.
2. Pick a difficulty: **Apprenti** (35 s per word), **Normal** (22 s) or
   **Cauchemar** (12 s, and accents must be exact).
3. Choose the manor's voice and click **Entrer dans le manoir**.
4. Listen (🔊 replay, 🐢 slow replay, 👁 hint if you're stuck), type, press
   **Enter**. Correct answers open the way; mistakes and timeouts feed the
   danger meter. When it fills… look away from the screen.
5. You have **3 hearts**. Lose them all and the manor keeps you. Clear all
   ten doors to escape at dawn.

At the end (either ending) you get a **review list of every word you missed**,
each with a 🔊 button to hear it again.

## 🔊 Getting the most realistic voice

The game uses your browser's speech voices and automatically prefers the most
natural one it can find:

- **Microsoft Edge (best)** — Edge ships free neural voices marked
  *“Online (Natural)”*: **Denise, Henri, Vivienne, Éloïse, Rémy** (fr-FR).
  They are extremely lifelike. The game auto-selects them, and they're marked
  **★ réaliste** in the voice dropdown.
- **Chrome** — pick *“Google français”*, a solid natural voice.
- Any other browser — any installed `fr-*` voice works.

All the horror **sound design is 100 % procedural** (Web Audio API): the
howling wind, the low drone, creaking floorboards, thunder, the whispers, the
jump-scare stinger, and a heartbeat that genuinely speeds up as the danger
rises. No robotic samples, no audio files.

## 🧠 Why it teaches well

- **Subtitles, first time only**: the first time you ever meet a word, its
  French spelling and English meaning appear above the candle — read, hear,
  and type at once. Every encounter after that (even across sessions) is
  subtitle-free, so recall does the work instead of reading. Switch to
  *Toujours* to always see them, *Jamais* for pure listening, or click
  *« Oublier les mots déjà vus »* to reset your seen-word memory.
- **Typing in French is rewarded** (10 pts + streak bonus) but English is
  accepted (5 pts), so you can ramp up gradually.
- **Accent feedback**: outside Nightmare mode, `fenetre` is accepted for
  *fenêtre* — but the game shows you the correct accents every time.
  Nightmare mode demands them.
- **Articles are flexible**: `tableau` and `le tableau` both count, and the
  correct article is always displayed so you absorb genders.
- **Full sentences open the doors**: every room has two phases. First the
  words; then the voice dictates **complete sentences from the book's
  exercises** (*"Mon stylo est dans mon sac"*, *"Elle donne une tartine à
  Robert"*, *"Je me lave dans la salle de bains"*) and you must type them in
  French. Sentences get nearly double time, are worth 25 points, and after
  two failed tries the text is revealed so you can read it, type it, and
  learn it. Missing apostrophes (`jai` for *j'ai*) are tolerated and
  corrected, like accents — except in Nightmare mode.
- Missed words **come back later in the same room** until you get them, and
  appear in the end-of-game review list.
- Even the manor's whispers (*« Derrière toi… »*, *« Ne te retourne pas… »*)
  and its spoken reactions (*« Très bien… »*, *« Essaie encore… »*) are real
  French, subtitled, absorbed while you play.

## 🗺️ The ten rooms

| # | Room | Textbook topic |
|---|------|----------------|
| 1 | La Grille du Manoir | Greetings (*Bonjour !*) |
| 2 | La Salle de Classe Abandonnée | Classroom objects |
| 3 | Le Couloir Sans Fin | Prepositions of place |
| 4 | La Cuisine Froide | The table & breakfast |
| 5 | La Chambre du Maître | Daily routine (reflexive verbs) |
| 6 | La Tour de l'Horloge | Days of the week & time |
| 7 | La Galerie des Portraits | The family |
| 8 | La Ménagerie | Animals |
| 9 | La Cave et l'Orage | Seasons & weather |
| 10 | La Porte Finale | Parts of the body |

*Bonne chance. Il t'écoute déjà.*
