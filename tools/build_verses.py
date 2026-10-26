#!/usr/bin/env python3
"""
Tengeneza data/verses.js kutoka faili la Biblia Takatifu (Kiswahili).

Matumizi:
    python tools/build_verses.py biblia.tsv [--limit 1000] [--maxlen 400]

Muundo wa biblia.tsv (kila mstari, tab-separated, UTF-8):
    Kitabu<TAB>Sura<TAB>Mstari<TAB>Maandishi
"""
import argparse
import json
import os
import random
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from curated import CURATED  # noqa: E402

# mada -> (jina la kuonyesha, mizizi ya maneno, maneno ya kutoondoa)
THEMES = {
    "kutiamoyo": ("Kutia moyo", ["tia moyo", "tiwa moyo", "tieni moyo", "tiana moyo", "jipe moyo", "jipeni moyo", "moyo mkuu", "shujaa na hodari", "uwe hodari", "iweni hodari"], []),
    "shukrani":  ("Shukrani", ["shukuru", "shukrani", "asante"], []),
    "baraka":    ("Baraka", ["baraka", "barik", "heri"], []),
    "faraja":    ("Faraja", ["faraja", "farij", "tuliz"], []),
    "upendo":    ("Upendo",   ["upendo", "pend", "mpendw", "mpenzi"], []),
    "furaha":    ("Furaha",   ["furaha", "furahi", "shangili", "changamk", "vigelegele"], []),
    "amani":     ("Amani",    ["amani", "tulia", "tulivu", "utulivu", "pumzik", "shwari"], []),
    "uvumilivu": ("Uvumilivu", ["vumili", "uvumilivu", "subira", "stahimili", "ustahimilivu", "saburi"], []),
    "utuwema":   ("Utu wema", ["wema", "fadhili", "rehema", "huruma", "ukarimu", "karimu"], []),
    "uaminifu":  ("Uaminifu", ["aminifu", "uaminifu", "ukweli", "uadilifu", "adili"], []),
    "upole":     ("Upole",    ["upole", "mpole", "wapole", "nyenyekev", "unyenyekev", "nyenyekea", "pole"], []),
    "kiasi":     ("Kiasi",    ["kiasi", "kujizuia", "kujitawala", "kujidhibiti", "nidhamu", "adabu", "busara", "hekima"], []),
    "imani":     ("Imani",    ["imani", "amini"], ["aminifu", "uaminifu"]),
    "tumaini":   ("Tumaini",  ["tumaini", "matumaini", "taraja", "tumainia", "ngoja"], []),
    "usalama":   ("Usalama",  ["salama", "usalama", "kimbilio", "ngome", "ulinzi", "linda", "mwamba",
                               "kinga", "ngao", "hifadhi", "okoa", "usiogope", "msiogope", "usifadhaike"], []),
}

# Vitabu vya mafundisho, nyimbo na unabii: mstari mmoja wa mada unatosha.
# Vitabu vya historia/sheria: mstari lazima ulingane na mada mara mbili au zaidi.
DEVOTIONAL = {
    "Ayubu", "Zaburi", "Mithali", "Mhubiri", "Wimbo Ulio Bora", "Isaya", "Yeremia", "Maombolezo",
    "Hosea", "Yoeli", "Amosi", "Mika", "Nahumu", "Habakuki", "Sefania", "Zekaria", "Malaki",
    "Mathayo", "Marko", "Luka", "Yohana", "Matendo ya Mitume", "Warumi", "1 Wakorintho", "2 Wakorintho",
    "Wagalatia", "Waefeso", "Wafilipi", "Wakolosai", "1 Wathesalonike", "2 Wathesalonike",
    "1 Timotheo", "2 Timotheo", "Tito", "Filemoni", "Waebrania", "Yakobo", "1 Petro", "2 Petro",
    "1 Yohana", "2 Yohana", "3 Yohana", "Yuda", "Ufunuo wa Yohana",
}
# Maneno ya vita, mauaji na uzinzi: mistari inayoyabeba haifai kutumwa kama faraja.
BLOCK = {
    "vita", "upanga", "panga", "kuua", "akaua", "wakaua", "waue", "uue", "aliuawa", "wauawe", "wakauawa",
    "mauaji", "uzinzi", "kuzini", "zinaa", "ukahaba", "kahaba", "malaya", "uasherati", "mzinzi",
    "mchawi", "najisi", "wapumbavu", "mpumbavu", "kuzimu", "ubatili", "wasioamini", "mikuki", "mishale", "kuteka", "waliotekwa", "kuangamiza", "wakaangamiza", "wakawapiga", "kuwapiga",
}

WORD = re.compile(r"[A-Za-zÀ-ÿ']+")
VOWELS = "aeiou"


def read_bible(path):
    verses = []
    with open(path, encoding="utf-8") as f:
        for line in f:
            row = line.rstrip("\n").split("\t")
            if len(row) < 4:
                continue
            book, ch, vs = row[0].strip(), row[1].strip(), row[2].strip()
            text = " ".join("\t".join(row[3:]).split())
            if not (ch.isdigit() and vs.isdigit()) or not text:
                continue
            verses.append((f"{book} {ch}:{vs}", text))
    return verses


def count_hits(text, stems, excludes):
    """Hesabu maneno yanayolingana na mada. Huruka majina maalum (Abrahamu, Rahabu)
    na maneno ambayo mzizi uko katikati ya neno bila kiambishi cha kawaida."""
    hits = 0
    low_text = text.lower()
    for s in stems:  # vishazi (vyenye nafasi) hutafutwa moja kwa moja
        if " " in s:
            hits += low_text.count(s)
    stems = [s for s in stems if " " not in s]
    if not stems:
        return hits
    for m in WORD.finditer(text):
        w = m.group(0)
        start = m.start()
        # jina maalum: herufi kubwa katikati ya sentensi
        if w[0].isupper() and start > 0:
            before = text[:start].rstrip()
            if before and before[-1] not in ".?!:;\"“”":
                continue
        low = w.lower()
        if any(low.find(x) != -1 for x in excludes):
            continue
        for s in stems:
            i = low.find(s)
            while i != -1:
                prefix = low[:i]
                if i == 0 or (len(prefix) <= 8 and prefix[-1] in VOWELS):
                    hits += 1
                    break
                i = low.find(s, i + 1)
            else:
                continue
            break
    return hits


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("bible")
    ap.add_argument("--limit", type=int, default=1000)
    ap.add_argument("--maxlen", type=int, default=400, help="urefu wa juu wa mstari (herufi)")
    ap.add_argument("--loose", action="store_true",
                    help="zima vichujio vya ubora (mistari mingi zaidi, ubora mdogo)")
    ap.add_argument("--out", default=os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "data", "verses.js"))
    a = ap.parse_args()

    bible = read_bible(a.bible)
    if not bible:
        sys.exit("Hakuna mistari iliyosomwa. Angalia muundo wa faili.")

    out = {}
    for key, (label, stems, excludes) in THEMES.items():
        scored = []
        for ref, text in bible:
            if len(text) > a.maxlen:
                continue
            h = count_hits(text, stems, excludes)
            if not h:
                continue
            if not a.loose:
                book = ref.rsplit(" ", 1)[0]
                if h < 2 and book not in DEVOTIONAL:
                    continue
                if text[-1] in ",:":  # kipande cha sentensi
                    continue
                words = {w.lower() for w in WORD.findall(text)}
                if words & BLOCK:
                    continue
            scored.append((h, ref, text))
        scored.sort(key=lambda x: -x[0])
        # 1) mistari iliyochaguliwa kwa mkono (huja kwanza), 2) mistari ya utafutaji
        by_ref = dict(bible)
        first = []
        seen = set()
        for r in CURATED.get(key, []):
            if r in by_ref and r not in seen:
                seen.add(r)
                first.append((r, by_ref[r]))
        rest = [(r, t) for _, r, t in scored if r not in seen]
        # changanya kila kundi kwa mpangilio thabiti ili vitabu tofauti vichanganyike
        random.Random(key + "1").shuffle(first)
        random.Random(key + "2").shuffle(rest)
        picked = (first + rest)[: a.limit]
        out[key] = [{"r": r, "t": t} for r, t in picked]
        note = "" if len(picked) >= a.limit else "  <-- chini ya lengo (Biblia haina zaidi)"
        print(f"{label:<12} {len(picked):>5} mistari{note}")

    labels = {k: v[0] for k, v in THEMES.items()}
    os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True)
    with open(a.out, "w", encoding="utf-8") as f:
        f.write("window.THEME_LABELS = " + json.dumps(labels, ensure_ascii=False) + ";\n")
        f.write("window.VERSES = " + json.dumps(out, ensure_ascii=False) + ";\n")
    print("Imeandikwa:", os.path.abspath(a.out))


if __name__ == "__main__":
    main()
