#!/usr/bin/env python3
"""
Tengeneza data/verses.js kutoka faili la Biblia Takatifu (Kiswahili).

Matumizi:
    python tools/build_verses.py biblia.tsv [--limit 1000] [--maxlen 320]

Muundo wa biblia.tsv (kila mstari, tab-separated, UTF-8):
    Kitabu<TAB>Sura<TAB>Mstari<TAB>Maandishi
Mfano:
    Yohana<TAB>3<TAB>16<TAB>(maandishi ya mstari)
"""
import argparse
import csv
import json
import os
import sys

# mada -> (jina la kuonyesha, mizizi ya maneno ya kutafuta)
THEMES = {
    "upendo":     ("Upendo",      ["upendo", "pend", "mpendw"]),
    "furaha":     ("Furaha",      ["furaha", "furahi", "shangili"]),
    "amani":      ("Amani",       ["amani", "tulia", "tulivu"]),
    "uvumilivu":  ("Uvumilivu",   ["uvumilivu", "vumili", "subira", "stahimili"]),
    "utuwema":    ("Utu wema",    ["wema", "fadhili", "rehema", "huruma"]),
    "uaminifu":   ("Uaminifu",    ["uaminifu", "aminifu"]),
    "upole":      ("Upole",       ["upole", "mpole", "wapole", "nyenyekev"]),
    "kiasi":      ("Kiasi",       ["kiasi", "kujizuia", "kujitawala", "busara"]),
    "imani":      ("Imani",       ["imani", "amini"]),
    "tumaini":    ("Tumaini",     ["tumaini", "matumaini", "taraja"]),
    "usalama":    ("Usalama",     ["salama", "usalama", "kimbilio", "ngome", "ulinzi", "linda", "mwamba"]),
}


def read_bible(path):
    verses = []
    with open(path, encoding="utf-8", newline="") as f:
        for row in csv.reader(f, delimiter="\t"):
            if len(row) < 4:
                continue
            book, ch, vs = row[0].strip(), row[1].strip(), row[2].strip()
            text = "\t".join(row[3:]).strip()
            if not (ch.isdigit() and vs.isdigit()) or not text:
                continue
            verses.append((f"{book} {ch}:{vs}", text))
    return verses


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("bible")
    ap.add_argument("--limit", type=int, default=1000)
    ap.add_argument("--maxlen", type=int, default=320, help="urefu wa juu wa mstari (herufi), kwa SMS")
    ap.add_argument("--out", default=os.path.join(os.path.dirname(__file__), "..", "data", "verses.js"))
    a = ap.parse_args()

    bible = read_bible(a.bible)
    if not bible:
        sys.exit("Hakuna mistari iliyosomwa. Angalia muundo wa faili (Kitabu<TAB>Sura<TAB>Mstari<TAB>Maandishi).")

    out = {}
    for key, (label, stems) in THEMES.items():
        scored = []
        for ref, text in bible:
            if len(text) > a.maxlen:
                continue
            low = text.lower()
            hits = sum(low.count(s) for s in stems)
            if hits:
                scored.append((-hits, len(text), ref, text))
        scored.sort()
        picked = scored[: a.limit]
        out[key] = [{"r": r, "t": t} for _, _, r, t in picked]
        note = "" if len(picked) >= a.limit else "  <-- chini ya lengo"
        print(f"{label:<12} {len(picked):>5} mistari{note}")

    labels = {k: v[0] for k, v in THEMES.items()}
    os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True)
    with open(a.out, "w", encoding="utf-8") as f:
        f.write("window.THEME_LABELS = " + json.dumps(labels, ensure_ascii=False) + ";\n")
        f.write("window.VERSES = " + json.dumps(out, ensure_ascii=False) + ";\n")
    print("Imeandikwa:", os.path.abspath(a.out))


if __name__ == "__main__":
    main()
