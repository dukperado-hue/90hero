# LEGAL LIST v35 — real names & IP references still in the build

Not legal advice. This is an inventory for the owner (and counsel, if any) to decide on. The project's stated approach is Broforce-style parody: parody names and lookalikes, no licensing.

## Cleaned in v35 (no longer in the shipped file)
Hidden `was:` / select-poster `cn:` / hidden `th:` fields that held real actors' names or nicknames were replaced with role labels (same convention as the v27+ uncles):

| hero key | removed | now (was / cn / th) |
|---|---|---|
| aamir | AAMIR (YOUNG) · MR. PERFECTIONIST · อาเมียร์ | THE PERFECT TAKE · MR. ONE-MORE-TAKE · พี่เทคเดียวผ่าน |
| chiru | CHIRU · ชิรันจีวี | THE MASS HERO · MASS HERO · พระเอกมาสซ์ |
| madong | MADONG · 마동석 · มาดงซอก | THE ONE-PUNCH HYUNG · 주먹 형 · ฮยองหมัดเดียว |
| michelle | MICHELLE · 楊 · มิเชล | THE ARSENAL · 百兵姐 · เจ๊สารพัดอาวุธ |
| oldboy | ชเวมินชิก (actor) · 올드보이 | THE CORRIDOR HAMMER · 망치 형 · ลุงค้อนทางเดิน |
| phiphop | PHIPHOP · ภิภพ | THE UZI UNCLE · UZI + RPG · พี่อูซี่ |
| rajini | RAJINI · THALAIVA · รชนีกานต์ | THE STYLE BOSS · THE STYLE BOSS · พี่สไตล์ |
| ram | RAM · ราม จรัญ | THE ROARING ONE · BEAST COMMANDER · พี่คำราม |
| srk | SHAH RUKH · KING KHAN · ชาห์รุข | THE ROMANCE KING · KING OF ROMANCE · ราชาโรแมนซ์ |
| vijay | VIJAY · THALAPATHY · วิชัย | THE SOFA COMMANDER · SOFA COMMANDER · พี่โซฟา |

The build asserts none of the removed strings come back (`src/build35.py`).

## Still present — owner decision needed
1. **Real actors' first names as display names (owner-chosen):** UNCLE SOMBAT (`cn` 頌巴叔, `th` ลุงสมบัติ) and UNCLE SORAPONG (`cn` 蘇拉朋叔, `th` ลุงสรพงษ์). Both are on-screen. Options: keep (deliberate homage), or rename to a pun.
2. **Internal ids / file names** (not shown to players, but visible in the source): `srk`, `aamir`, `rajini`, `chiru`, `madong`, `michelle`, `phiphop`, `poster_srk.jpg`… and code comments such as `// SHAH RUKH (parody)`, `// RAJINI (parody)`, `// CHIRU — the Mass Hero`. Renaming ids touches save data (unlock lists, best times), so it needs a migration — not done.
3. **Fictional characters / titles referenced in hidden or poster labels:** Zatoichi (座頭市, ซาโตอิจิ), Lone Wolf & Cub (子連れ狼), Dongfang Bubai (東方不敗), Ximen Chuixue (西門吹雪), Little Li Flying Dagger (小李飛刀), Lady Vengeance, Oldboy, Tom-Yum-Goong (ต้มยำกุ้ง), Pai Mei (白眉), Uncle Nine (九叔), Siu Ma (小馬), Ah Wah (阿華).
4. **Historical / folk figures** (lower risk): Wong Fei-hung (黃飛鴻), Zhang San-feng (張三丰).
5. **Quotes that echo film titles/lines** on posters, e.g. "JO JEETA WOHI SIKANDAR!". Short phrases/titles; flag only.
