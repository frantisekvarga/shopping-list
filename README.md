# Zoznam aplikacia

Táto aplikácia je zdielaný to-do list, ktorý umožňuje používateľom vytvárať, zdieľať a spravovať úlohy v rámci zoznamov úloh. Po prihlásení alebo registrácii môžu používatelia vidieť svoje zoznamy úloh, pridávať nové zoznamy, hľadať špecifické zoznamy, prepínať medzi svetlým a tmavým režimom a ďalšie.

## Funkcie aplikácie

- **Registrácia a Prihlásenie**: Používateľ môže vytvoriť nový účet alebo sa prihlásiť do existujúceho účtu.
- **Prehľad zoznamov úloh**: Po prihlásení je používateľ presmerovaný na stránku so zoznamom všetkých úloh, kde sa mu zobrazia jeho zoznamy a zoznamy, ktorých je členom.
- **Vytvorenie nového zoznamu**: Používateľ môže pridať nový zoznam úloh cez tlačidlo v navigácii alebo pod existujúcimi zoznamami.
- **Vyhľadanie zoznamu**: Používateľ môže vyhľadávať špecifický zoznam cez možnosť "Nájdite svoju úlohu" v navigácii, kde si môže vybrať medzi vlastnými zoznamami a zoznamami, ktorých je členom. Následne môže listy filtrovať.
- **Detail zoznamu úloh**: Po kliknutí na konkrétny zoznam sa zobrazia jeho detaily:
  - Názov listu (po kliknuti na názov môže zmeniť názov)
  - Pridanie novej úlohy
  - Zobrazenie všetkých úloh v zozname s možnosťou označenia úloh ako dokončených/nedokončených alebo ich odstránenie
  - **Pie chart**: Grafický prehľad percenta splnených úloh
- **Správa členov zoznamu**:
  - Vlastník (Owner) môže zoznam archivovať, zmazať alebo pridať členov na základe ich emailovej adresy.
  - Členovia (Members) môžu zo zoznamu odísť pomocou funkcie "Leave List".
- **Tmavý režim a jazykové nastavenia**: Používateľ môže prepínať medzi svetlým a tmavým režimom, vybrať jazyk aplikácie a odhlásiť sa.
- **Footer**: Na spodku každej stránky sa nachádza pätička s užitočnými informáciami.

## Inštalácia a Spustenie

Pre správne fungovanie aplikácie je potrebné spustiť klientskú a serverovú časť samostatne. 

1. **Klientská časť** (nachádza sa v priečinku `client`):
   - Otvor terminál, prejdi do priečinka `client`, a zadaj:
     ```bash
     npm install
     npm start
     ```
   - Tento príkaz nainštaluje potrebné balíky a spustí aplikáciu.

2. **Serverová časť** (nachádza sa v priečinku `server`):
   - Otvor nový terminál, prejdi do priečinka `server`, a zadaj:
     ```bash
     npm install
     npm start
     ```
   - Tieto príkazy opäť nainštalujú všetky potrebné balíky a spustia server.

Aplikácia by mala byť teraz dostupná na lokálnej adrese (napríklad `http://localhost:3000` pre klienta).

## Použitie

1. **Prihláste sa alebo sa registrujte** na prístup k vašim úlohám.
2. Na hlavnej stránke nájdete **všetky zoznamy úloh**, v ktorých ste členom alebo vlastníkom.
3. Kliknutím na **zoznam úloh** sa zobrazí stránka s detailmi úloh, kde môžete:
   - Upraviť názov zoznamu (iba pre vlastníkov)
   - Pridať novú úlohu
   - Označiť úlohy ako dokončené alebo nedokončené, prípadne ich odstrániť
   - Pozrieť sa na prehľad splnených/nedokončených úloh cez pie chart
4. **Správa členov zoznamu**:
   - Vlastníci môžu pridať alebo odstrániť členov. Po zadaní emailu člena kliknite na "Add selected members" na potvrdenie.
   - Vlastník tiež môže zoznam archivovať alebo vymazať.
5. **Nastavenia aplikácie**: V navigácii sú k dispozícii funkcie prepínania medzi svetlým a tmavým režimom, voľby jazykov a možnosť odhlásenia.

---

