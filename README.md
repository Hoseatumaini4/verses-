# Mistari ya Roho

Mistari ya Biblia Takatifu (Kiswahili) kwa mada za matunda ya Roho: upendo, furaha, amani, uvumilivu, utu wema, uaminifu, upole, kiasi, imani, tumaini, usalama.

- Mstari mpya hufunguka kila **dakika 20** kwa kila mada.
- Kitufe cha **Nakili** na **Tuma SMS** kwa kila mstari.
- Mistari iliyopita inabaki kwenye orodha ya historia.

## Hatua za kuanza

1. Pata faili la Biblia Takatifu la Kiswahili lenye ruhusa ya kutumia (mfano toleo la domain ya umma au lenye leseni). Liweke kama `biblia.tsv` (UTF-8), kila mstari:

   ```
   Kitabu<TAB>Sura<TAB>Mstari<TAB>Maandishi
   ```

2. Endesha:

   ```
   python tools/build_verses.py biblia.tsv
   ```

   Hii inaandika `data/verses.js` na kuonyesha idadi ya mistari kwa kila mada.

3. Fungua `index.html` kwenye kivinjari (simu au kompyuta).

## Chaguo

- `--limit 1000` idadi ya juu kwa kila mada (chaguo-msingi 1000)
- `--maxlen 320` urefu wa juu wa mstari, ili ufae SMS

## Kumbuka

- Script huchagua mistari kwa kutafuta maneno ya mada. Baadhi ya mada zinaweza kupata chini ya 1000 kwa sababu Biblia haina mistari mingi hivyo. Idadi halisi huonyeshwa.
- Pitia mistari kabla ya kutuma, kwa sababu utafutaji wa maneno hauelewi muktadha kila mara.
- Muda wa kuanza kila mada huhifadhiwa kwenye kivinjari (localStorage). Ukifuta data ya kivinjari, hesabu huanza upya.
