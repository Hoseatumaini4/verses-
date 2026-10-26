# Mistari ya Roho

PWA ya mistari ya Biblia Takatifu (Kiswahili) ya **kutia moyo, kushukuru, kubariki na kufariji**, pamoja na matunda ya Roho. Inasakinishika kwenye simu, inafanya kazi **bila mtandao**, na unaweza kunakili au kutuma mistari kwa **SMS/WhatsApp** kwa herufi nzuri za kiroho.

## Vipengele
- Mada 15: Kutia moyo, Shukrani, Baraka, Faraja, Upendo, Furaha, Amani, Uvumilivu, Utu wema, Uaminifu, Upole, Kiasi, Imani, Tumaini, Usalama.
- Mstari mpya hufunguka kila: dakika 20, saa 1, 3, 6, 12, siku 1, wiki 1, mwezi 1, miezi 3, miezi 6, au mwaka 1. Mabadiliko ya muda huhifadhi mistari uliyokwisha kufungua.
- Herufi za mtindo (Mkono, Nzito iliyoinama, Kale, Nzito, Nzito safi, Kawaida), salamu na jina lako hiari, pambo la msalaba, na onyesho la ujumbe kabla ya kutuma.
- Vitufe: Nakili, SMS, WhatsApp, Shiriki.
- Mwonekano wa usiku/mchana, fonti zilizofungwa ndani (Cormorant Garamond na Inter), hakuna huduma za nje.

## Kuweka kwenye GitHub na Vercel
1. Weka folda hii nzima kwenye repo ya GitHub.
2. Vercel: **Add New Project**, chagua repo. Mipangilio tayari ipo kwenye `vercel.json` (hakuna build, folda ya kutoa ni `public`). Bonyeza **Deploy**.
3. Fungua kiungo kwenye simu: Android Chrome huonyesha **Sakinisha**; iPhone Safari: **Shiriki → Ongeza kwenye Skrini ya Nyumbani**. Baada ya ufunguzi wa kwanza, programu inafanya kazi bila mtandao.

PWA inahitaji HTTPS, ambayo Vercel hutoa moja kwa moja.

## Kusasisha
Ukibadilisha faili zozote ndani ya `public/`, badilisha `VERSION` kwenye `public/sw.js` (mfano `v2`) ili simu zipate toleo jipya.

## Muundo
```
public/            tovuti (inayotolewa na Vercel)
  index.html  css/app.css  js/app.js  sw.js  manifest.webmanifest
  data/verses.js   mistari (imetengenezwa)
  fonts/  icons/
tools/
  build_verses.py  hutengeneza public/data/verses.js kutoka data-src/biblia.tsv
  curated.py       marejeo ya mistari iliyochaguliwa kwa mkono
  make_icons.mjs   hutengeneza aikoni (inahitaji playwright)
data-src/biblia.tsv  Biblia (Kitabu, Sura, Mstari, Maandishi)
```
Kutengeneza mistari upya: `python3 tools/build_verses.py data-src/biblia.tsv` (chaguo: `--limit`, `--maxlen`, `--loose`).

## Idadi ya mistari
Kutia moyo 85 · Shukrani 101 · Baraka 244 · Faraja 108 · Upendo 549 · Furaha 435 · Amani 236 · Uvumilivu 109 · Utu wema 357 · Uaminifu 108 · Upole 79 · Kiasi 335 · Imani 375 · Tumaini 216 · Usalama 504.

Biblia haina mistari 1000 yenye ubora kwa kila mada. Mistari ya kwanza ya kila mada ni ile maarufu iliyochaguliwa kwa mkono; iliyobaki ilitafutwa kwa maneno ya mada, kwa hiyo soma kabla ya kutuma.

## SMS
Herufi za mtindo ni Unicode na kila moja huchukua nafasi mbili, kwa hiyo SMS moja hubeba takriban herufi 35 tu; programu inaonyesha makadirio ya idadi ya SMS. Kwa ujumbe mfupi chagua **Kawaida** (herufi 160 kwa SMS). WhatsApp haina kikomo hicho.

## Chanzo na leseni ya maandishi
Maandishi ya Biblia yametoka https://github.com/shemmjunior/swahili-bible-edition (leseni MIT kwa repo; inaonekana kuwa Swahili Union Version). Repo haitaji hakimiliki ya maandishi yenyewe, kwa hiyo hakikisha kabla ya kusambaza hadharani. Fonti: Cormorant Garamond na Inter (SIL OFL), leseni ndani ya `public/fonts/`.
