# Mistari ya Roho

Programu ndogo ya wavuti inayokuonyesha mistari ya Biblia kwa mada 11: upendo, furaha, amani, uvumilivu, utu wema, uaminifu, upole, kiasi, imani, tumaini na usalama.

## Vipengele
- Mistari 3 ya kuanzia kwa kila mada (jumla ya 33).
- Mstari unaofuata hufunguka kila dakika 20 kwa kila mada.
- Nakili mstari au fungua ujumbe wa SMS.
- Historia ya mistari iliyofunguliwa kwa mada husika.
- Mitindo tofauti ya herufi.
- Hufanya kazi bila intaneti baada ya kupakua mradi; hakuna server au usakinishaji wa maktaba unaohitajika.

## Jinsi ya kuendesha
1. Fungua folda `mistari-ya-roho`.
2. Fungua `index.html` kwenye kivinjari cha kisasa (Chrome, Edge, Firefox au Safari).

Unaweza pia kuendesha seva rahisi ya ndani kwa Python ukiwa ndani ya folda ya mradi:

```bash
python -m http.server 8000
```

Kisha fungua `http://localhost:8000`.

## Kuhusu maandiko na leseni
Mradi huu unatumia uteuzi wa mistari ya Kiswahili unaohusishwa na **Swahili Unlocked Literal Bible (SWHULB)**, tafsiri ya Door43 World Missions Community, © 2019, chini ya **Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)**.

Chanzo na maelezo ya leseni: https://ebible.org/details.php?id=swhulb

Tafsiri hii ina maneno na mtindo ambao unaweza kutofautiana na matoleo mengine ya *Biblia Takatifu* yanayotumika Tanzania. Baadhi ya maandishi yamechaguliwa au kufupishwa ili yafae katika programu; hakiki maneno na rejea katika toleo la Biblia unalotumia kabla ya matumizi rasmi ya uchapishaji au ibada. Mradi huu haujaidhinishwa na Door43.

Kwa kuwa maandishi ya Biblia yanasambazwa chini ya CC BY-SA 4.0, usambazaji wa matoleo yaliyobadilishwa ya maandishi hayo lazima ufuate masharti ya leseni hiyo, ikiwemo kutoa sifa na kutumia leseni sawa kwa mchango unaosambazwa.

## Kubadilisha au kuongeza mistari
Faili la data ni `data/verses.js`. Muundo wa kila mstari ni:

```js
{ "r": "Yohana 3:16", "t": "Maandishi ya mstari hapa" }
```

Kila mada ina orodha ya mistari. Ongeza vipengee kwenye orodha ya mada husika ili kuongeza mistari.
