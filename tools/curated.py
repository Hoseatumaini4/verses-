# Marejeo (si maandishi) ya mistari maarufu kwa kila mada.
# Maandishi yenyewe huvutwa kutoka kwenye faili la Biblia unalotoa, kwa hiyo hayaandikwi hapa.
# Muundo: "Kitabu Sura:Mstari" kama majina ya vitabu yalivyo kwenye biblia.tsv.

def R(book, *refs):
    return [f"{book} {r}" for r in refs]

CURATED = {
    "upendo": (
        R("1 Yohana", "4:7", "4:8", "4:10", "4:11", "4:16", "4:18", "4:19", "3:18", "3:1")
        + R("1 Wakorintho", "13:4", "13:7", "13:8", "13:13", "16:14")
        + R("Yohana", "3:16", "13:34", "13:35", "15:12", "15:13")
        + R("Warumi", "5:8", "8:38", "8:39", "12:9", "12:10", "13:8", "13:10")
        + R("Wakolosai", "3:14") + R("1 Petro", "4:8")
        + R("Waefeso", "3:17", "3:18", "3:19", "5:2")
        + R("Mithali", "10:12", "17:17") + R("Yeremia", "31:3")
        + R("Zaburi", "136:1", "103:8", "103:11") + R("Mathayo", "22:37", "22:39")
        + R("Wimbo Ulio Bora", "8:7")
    ),
    "furaha": (
        R("Wafilipi", "4:4") + R("Nehemia", "8:10")
        + R("Zaburi", "16:11", "30:5", "118:24", "126:3", "28:7", "100:1", "5:11", "51:12", "97:12", "32:11", "34:5")
        + R("Warumi", "15:13", "12:12", "14:17") + R("Yohana", "15:11", "16:24", "16:22")
        + R("1 Wathesalonike", "5:16") + R("Mithali", "17:22", "15:13")
        + R("Habakuki", "3:18") + R("Isaya", "12:3", "35:10", "61:10", "55:12")
        + R("Yakobo", "1:2") + R("1 Petro", "1:8") + R("Luka", "15:7", "15:10", "2:10")
        + R("Sefania", "3:17") + R("Wagalatia", "5:22")
    ),
    "amani": (
        R("Yohana", "14:27", "16:33") + R("Wafilipi", "4:6", "4:7", "4:9")
        + R("Isaya", "26:3", "9:6", "32:17", "53:5", "48:18")
        + R("Warumi", "5:1", "8:6", "15:13", "14:19", "12:18")
        + R("Wakolosai", "3:15") + R("2 Wathesalonike", "3:16")
        + R("Zaburi", "29:11", "4:8", "34:14", "85:8", "119:165", "37:11", "37:37")
        + R("Mathayo", "5:9", "11:28") + R("Waebrania", "12:14") + R("Waefeso", "2:14", "4:3")
        + R("Mithali", "16:7", "14:30") + R("Luka", "2:14") + R("1 Petro", "3:11")
        + R("Hesabu", "6:26")
    ),
    "uvumilivu": (
        R("Yakobo", "1:3", "1:4", "5:7", "5:8", "5:11", "1:12")
        + R("Warumi", "5:3", "5:4", "8:25", "12:12", "15:4", "15:5")
        + R("Wagalatia", "6:9") + R("Waebrania", "10:36", "12:1", "6:12")
        + R("Zaburi", "27:14", "37:7", "40:1") + R("Wakolosai", "1:11", "3:12")
        + R("Luka", "21:19", "8:15") + R("2 Petro", "3:9") + R("1 Wakorintho", "13:4")
        + R("Mithali", "14:29", "16:32", "19:11") + R("Mhubiri", "7:8")
        + R("Isaya", "40:31") + R("Maombolezo", "3:25", "3:26")
        + R("1 Wathesalonike", "5:14") + R("Waefeso", "4:2") + R("Wagalatia", "5:22")
    ),
    "utuwema": (
        R("Wagalatia", "5:22", "6:9", "6:10") + R("Waefeso", "4:32", "2:7")
        + R("Wakolosai", "3:12")
        + R("Mithali", "11:17", "14:21", "19:17", "31:26", "3:27")
        + R("Zaburi", "23:6", "34:8", "100:5", "145:9", "107:1", "118:1", "27:13", "86:5")
        + R("Luka", "6:35", "6:36") + R("Mika", "6:8") + R("Tito", "3:4")
        + R("Warumi", "2:4", "12:21") + R("1 Wathesalonike", "5:15")
        + R("Waebrania", "13:16") + R("Mathayo", "5:16", "25:40")
        + R("Matendo ya Mitume", "20:35")
    ),
    "uaminifu": (
        R("Mithali", "3:3", "20:6", "28:20", "11:3", "12:22")
        + R("Luka", "16:10", "16:12") + R("Mathayo", "25:21", "25:23")
        + R("1 Wakorintho", "4:2", "15:58") + R("Ufunuo wa Yohana", "2:10")
        + R("Waebrania", "10:23", "11:11") + R("2 Timotheo", "2:13")
        + R("Zaburi", "36:5", "89:1", "100:5", "119:90", "33:4", "31:23", "101:6")
        + R("Maombolezo", "3:22", "3:23") + R("Kumbukumbu la Torati", "7:9")
        + R("1 Wathesalonike", "5:24") + R("1 Yohana", "1:9")
    ),
    "upole": (
        R("Mathayo", "5:5", "11:29", "21:5") + R("Wagalatia", "5:23", "6:1")
        + R("Waefeso", "4:2") + R("Wakolosai", "3:12")
        + R("1 Petro", "3:15", "3:4") + R("Mithali", "15:1", "25:15")
        + R("Zaburi", "37:11", "25:9", "149:4") + R("Tito", "3:2")
        + R("Yakobo", "3:17", "1:21") + R("2 Timotheo", "2:25")
        + R("Wafilipi", "4:5") + R("Sefania", "2:3") + R("2 Wakorintho", "10:1")
        + R("1 Timotheo", "6:11") + R("Hesabu", "12:3")
    ),
    "kiasi": (
        R("Wagalatia", "5:23") + R("2 Timotheo", "1:7")
        + R("Mithali", "25:28", "16:32", "25:16", "29:11", "21:23", "13:3")
        + R("Tito", "2:11", "2:12", "2:2", "1:8")
        + R("1 Petro", "5:8", "4:7", "1:13") + R("1 Wakorintho", "9:25", "9:27", "6:12", "10:13")
        + R("2 Petro", "1:6") + R("1 Wathesalonike", "5:6", "5:8")
        + R("Warumi", "12:3", "13:14") + R("Wafilipi", "4:5")
        + R("Yakobo", "1:19", "3:2") + R("Waefeso", "5:18")
        + R("Zaburi", "141:3") + R("Wakolosai", "4:6")
    ),
    "imani": (
        R("Waebrania", "11:1", "11:6", "11:3")
        + R("Warumi", "10:17", "5:1", "1:17", "10:9", "4:20", "4:21")
        + R("2 Wakorintho", "5:7", "4:18")
        + R("Mathayo", "17:20", "21:22", "9:29")
        + R("Marko", "11:22", "11:24", "9:23", "5:36")
        + R("Yakobo", "2:17", "2:26", "1:6") + R("Waefeso", "2:8", "6:16")
        + R("Wagalatia", "2:20", "3:26") + R("Luka", "17:5", "17:6", "1:45")
        + R("Yohana", "20:29", "11:25", "11:40") + R("1 Yohana", "5:4")
        + R("1 Petro", "1:7") + R("Wafilipi", "4:13") + R("1 Timotheo", "6:12")
        + R("2 Timotheo", "4:7") + R("Habakuki", "2:4") + R("Mithali", "3:5", "3:6")
    ),
    "tumaini": (
        R("Yeremia", "29:11", "17:7", "17:8")
        + R("Warumi", "15:13", "12:12", "8:24", "8:25", "5:5", "15:4")
        + R("Zaburi", "42:5", "42:11", "39:7", "71:5", "33:22", "31:24", "130:5", "119:114", "146:5")
        + R("Isaya", "40:31") + R("Maombolezo", "3:21", "3:22", "3:24", "3:25")
        + R("Waebrania", "6:19", "10:23", "11:1")
        + R("1 Petro", "1:3", "3:15") + R("Wakolosai", "1:27")
        + R("Tito", "2:13", "1:2") + R("Wafilipi", "1:20")
        + R("1 Wathesalonike", "4:13", "5:8") + R("Mithali", "23:18", "24:14")
        + R("Ayubu", "11:18") + R("Zekaria", "9:12")
    ),
    "usalama": (
        R("Zaburi", "23:4", "91:1", "91:2", "91:4", "91:11", "46:1", "46:2", "27:1", "27:5", "18:2",
          "121:1", "121:2", "121:7", "121:8", "4:8", "34:7", "56:3", "56:4", "9:9", "62:2", "62:6",
          "32:7", "118:6", "125:2", "16:8", "138:7", "57:1", "61:3")
        + R("Mithali", "18:10", "3:24", "1:33", "29:25", "14:26")
        + R("Isaya", "41:10", "43:2", "54:17", "26:3", "12:2", "40:29", "43:1")
        + R("Kumbukumbu la Torati", "31:6", "31:8", "33:27") + R("Yoshua", "1:9")
        + R("Nahumu", "1:7") + R("Yohana", "10:28", "10:29", "14:27")
        + R("Warumi", "8:31", "8:38", "8:39") + R("2 Wathesalonike", "3:3")
        + R("Mathayo", "28:20", "6:26", "10:29", "10:31")
        + R("2 Timotheo", "1:7", "4:18") + R("1 Petro", "5:7")
        + R("Waebrania", "13:6") + R("Luka", "12:7")
    ),

    "kutiamoyo": (
        R("Yoshua", "1:9") + R("Isaya", "41:10", "40:29", "40:31", "43:2")
        + R("Wafilipi", "4:13", "1:6") + R("1 Wathesalonike", "5:11")
        + R("Waebrania", "10:24", "12:1", "4:16") + R("Wagalatia", "6:9")
        + R("Zaburi", "27:14", "31:24", "55:22", "46:1", "34:18", "147:3")
        + R("2 Wakorintho", "4:16", "12:9", "1:3", "1:4")
        + R("Warumi", "8:28", "8:37") + R("Mathayo", "11:28", "19:26")
        + R("1 Wakorintho", "15:58", "16:13") + R("Waefeso", "6:10", "3:20")
        + R("Kumbukumbu la Torati", "31:6") + R("2 Timotheo", "1:7")
        + R("Mithali", "3:5", "3:6", "27:17") + R("Yeremia", "29:11")
        + R("Mhubiri", "4:9", "4:10") + R("Wakolosai", "3:23")
        + R("1 Petro", "5:7") + R("Marko", "10:27") + R("Luka", "1:37")
        + R("Mithali", "16:24", "12:25", "18:21")
    ),
    "shukrani": (
        R("1 Wathesalonike", "5:18") + R("1 Mambo ya Nyakati", "16:34")
        + R("Zaburi", "100:4", "107:1", "118:1", "136:1", "92:1", "103:2", "34:1", "9:1", "95:2",
          "138:1", "50:14", "118:29", "106:1", "136:26", "75:1")
        + R("Wakolosai", "3:15", "3:17", "4:2", "2:7") + R("Wafilipi", "4:6", "1:3")
        + R("Waefeso", "5:20", "1:16") + R("1 Wakorintho", "1:4", "15:57")
        + R("2 Wakorintho", "9:15", "2:14") + R("Waebrania", "13:15")
        + R("Warumi", "1:8") + R("Yakobo", "1:17") + R("Isaya", "12:4")
        + R("Filemoni", "1:4") + R("2 Wathesalonike", "1:3")
    ),
    "baraka": (
        R("Hesabu", "6:24", "6:25", "6:26") + R("Zaburi", "67:1", "128:5", "115:12", "115:14", "29:11", "1:1", "84:12", "112:1")
        + R("Mwanzo", "12:2") + R("Waefeso", "1:3", "3:16") + R("2 Wakorintho", "13:14", "9:8")
        + R("Warumi", "15:13", "15:5", "15:33") + R("Wafilipi", "4:19", "4:23")
        + R("2 Wathesalonike", "3:16", "3:18") + R("Waebrania", "13:20", "13:21")
        + R("Yuda", "1:24", "1:25") + R("3 Yohana", "1:2")
        + R("Kumbukumbu la Torati", "28:6") + R("Mithali", "10:22")
        + R("Malaki", "3:10") + R("Mathayo", "5:3", "5:4", "5:5", "5:6", "5:7", "5:8", "5:9")
        + R("Wagalatia", "6:18") + R("1 Petro", "5:10") + R("2 Petro", "1:2")
        + R("Yeremia", "17:7") + R("1 Wathesalonike", "5:23")
    ),
    "faraja": (
        R("Zaburi", "23:1", "23:4", "34:18", "147:3", "55:22", "94:19", "30:5", "119:50", "119:76")
        + R("Mathayo", "5:4", "11:28") + R("2 Wakorintho", "1:3", "1:4")
        + R("Isaya", "41:10", "66:13", "40:1", "43:2")
        + R("Yohana", "14:1", "14:18", "14:27") + R("Ufunuo wa Yohana", "21:4")
        + R("Warumi", "8:18", "8:28") + R("1 Petro", "5:7")
        + R("Yeremia", "31:13") + R("1 Wathesalonike", "4:18", "5:11")
        + R("Maombolezo", "3:22", "3:23")
    ),
}
