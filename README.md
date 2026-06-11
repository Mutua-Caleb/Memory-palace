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

No build step, no dependencies. Either:

- **Open `index.html` directly** in a browser, or
- serve the folder: `python3 -m http.server` then visit `http://localhost:8000`

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

- **Subtitles on top**: by default the spoken French and its English meaning
  are shown at the top of the screen, so you read, hear, and type at the same
  time — three memory channels at once. Turn them off ("Cachés — hardcore")
  for pure listening practice later.
- **Typing in French is rewarded** (10 pts + streak bonus) but English is
  accepted (5 pts), so you can ramp up gradually.
- **Accent feedback**: outside Nightmare mode, `fenetre` is accepted for
  *fenêtre* — but the game shows you the correct accents every time.
  Nightmare mode demands them.
- **Articles are flexible**: `tableau` and `le tableau` both count, and the
  correct article is always displayed so you absorb genders.
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
