export default {
  nav: {
    wordmark: "Isagog",
    siteName: "Ontologie",
    perspectives: "Prospettive",
    layers: "Livelli",
    reasoning: "Ragionamento",
    explorer: "Esplora",
    mainSite: "isagog.com",
    menu: "Menu di navigazione",
  },
  footer: {
    mainSite: "isagog.com",
    email: "info@isagog.com",
    copyright: "(c) {year} Isagog Srl",
    street: "Via Faà di Bruno 52",
    zip: "00195 Roma (IT)",
  },
  home: {
    percorsi: {
      eyebrow: "DA DOVE COMINCIARE",
      perspectives: {
        title: "Concetti come prospettive",
        body: "Perché un concetto non è una categoria in cui rinchiudere le cose, con quattro esempi presi dai modelli.",
      },
      layers: {
        title: "Tre livelli, più il vostro",
        body: "Top level, agenti e frame: che cosa descrive ciascuno, e come vi si costruisce sopra l'ontologia di un'organizzazione.",
      },
      reasoning: {
        title: "Un vocabolario, due lettori",
        body: "Come le stesse definizioni guidano i modelli linguistici e il ragionamento sul grafo di conoscenza.",
      },
      explorer: {
        title: "Esplora le ontologie",
        body: "Concetti e relazioni, con definizioni operative, prospettive, domini e codomini.",
      },
    },
  },
  ontologies: {
    hero: {
      eyebrow: "ONTOLOGIE",
      titleLine1: "Integrare i modelli linguistici con la conoscenza delle organizzazioni",
      titleEm: "richiede modelli concettuali di nuova concezione.",
      lead: "Le ontologie Isagog sono costruite per questo: guidano il ragionamento sia dei modelli linguistici sia del grafo di conoscenza.",
      p1: "I modelli linguistici sanno parlare di quasi tutto, ma non conoscono i dati, le regole e il lessico di un'organizzazione. Per collegarli a questa conoscenza serve un modello concettuale: un vocabolario condiviso e preciso che dica di quali cose si parla, quali relazioni le legano e che cosa se ne può dedurre.",
      p2: "Le ontologie tradizionali sono nate per le basi di dati e i sistemi logici: sistemano ogni cosa in una gerarchia rigida di categorie. Il linguaggio naturale funziona diversamente: le stesse parole cambiano senso con il contesto, e uno stesso oggetto si descrive in modi diversi a seconda di ciò che serve. Un modello pensato per lavorare con i modelli linguistici deve tenerne conto.",
      p3: "Queste pagine raccontano come abbiamo ripensato le nostre ontologie, a che cosa servono e come le usiamo. Nell'esploratore potete navigarle direttamente.",
    },
    prospettive: {
      eyebrow: "UNA NUOVA CONCEZIONE",
      titleLine1: "Non categorie,",
      titleEm: "ma prospettive.",
      intro:
        "La novità sta in un cambio di sguardo. Nelle nostre ontologie un concetto non è una categoria in cui rinchiudere le cose, ma una prospettiva da cui guardarle: la stessa entità può essere vista in più modi, ciascuno con le proprie regole di ragionamento, e il contesto sceglie quello pertinente. Così il modello accoglie la polisemia del linguaggio invece di combatterla. Quattro esempi, tratti direttamente dai modelli.",
      ex1: {
        title: "Ciò che dura e ciò che accade",
        body: "Continuante (ciò che persiste mantenendo la propria identità) e occorrente (ciò che accade e si dispiega nel tempo) non sono dichiarati disgiunti. Una mostra si può descrivere come qualcosa che occupa tre sale e come qualcosa che si svolge da marzo a giugno, senza sdoppiarla in due entità diverse.",
      },
      ex2: {
        title: "Un atto linguistico è un evento e un'informazione",
        body: "Quando qualcuno dice «domani apriamo alle nove», accade qualcosa (un evento, con chi parla e chi ascolta) e passa un contenuto (un'informazione, che riguarda qualcosa). Nell'ontologia degli agenti l'atto linguistico è entrambe le cose nella stessa entità, e rispetta le regole di ciascuna.",
      },
      ex3: {
        title: "Vendere e comprare: stesso evento, parole diverse",
        body: "Nell'ontologia dei frame la prospettiva è un fatto lessicale, non ontologico. Una compravendita ha tutti i suoi partecipanti; «vendere» e «comprare» sono parole che ne mettono in primo piano ruoli diversi. Il modello resta univoco, il punto di vista vive nella scelta delle parole.",
      },
      ex4: {
        title: "Sapere di non sapere",
        body: "Le ontologie adottano l'ipotesi di mondo aperto: se manca la data di inizio di un evento, non vuol dire che l'evento non abbia avuto inizio, ma che non la conosciamo. È ciò che permette a un sistema di distinguere ciò che sa da ciò che ignora, e di dirlo.",
      },
      closing:
        "La classificazione multipla non è un compromesso: ogni prospettiva conserva i propri assiomi, e il ragionamento li applica tutti.",
    },
    livelli: {
      eyebrow: "TRE ONTOLOGIE, UN SOLO MODELLO",
      titleLine1: "Un nucleo minimale",
      titleEm: "e due livelli specializzati.",
      intro:
        "Le ontologie Isagog sono costruite a strati. Il livello superiore fissa le distinzioni più generali; gli altri due lo importano e lo estendono, per gli agenti conversazionali e per l'analisi dei testi.",
      versionLabel: "versione",
      top: {
        name: "Ontologia top level",
        tagline: "Le categorie più generali, con impegni modesti.",
        body: "Poche categorie fondamentali (continuanti e occorrenti, tangibili e intangibili, agenti, informazioni, segni, situazioni, qualità) e le relazioni che le legano: partecipazione, composizione, causalità, collocazione, inerenza. Ogni termine ha una definizione operativa breve, in italiano e in inglese, scritta per essere letta anche da un modello linguistico, e corrispondenze con DOLCE e schema.org.",
      },
      agents: {
        name: "Ontologia degli agenti",
        tagline: "Atti linguistici, conversazioni, memoria.",
        body: "Descrive come comunicano gli agenti. Un atto linguistico ha un solo autore e un solo tipo illocutorio (informare, chiedere, confermare…), può rispondere a un atto precedente e avere un peso di salienza; una conversazione è un evento le cui fasi sono atti linguistici. Gli aspetti (bisogni, interessi, vincoli dell'utente) sono le qualità che un agente ricorda: formano la sua memoria semantica.",
      },
      frames: {
        name: "Ontologia dei frame",
        tagline: "Le situazioni ricorrenti di cui parlano i testi.",
        body: "Un inventario di ruoli: i partecipanti (paziente, tema, strumento, beneficiario, esperiente…), ciascuno definito da sette domande sì/no, come «c'è volontà?» o «c'è un cambiamento di stato?», e le circostanze, organizzate sulle quattro cause aristoteliche. Un frame è insieme una classe di eventi e una voce di catalogo, con definizioni, unità lessicali e attestazioni nei corpora: un frame senza attestazioni è un'ipotesi, non una voce.",
      },
      cliente: {
        eyebrow: "LA VOSTRA ONTOLOGIA",
        titleLine1: "Costruita sulle ontologie Isagog,",
        titleEm: "estratta dai vostri testi e dai vostri schemi.",
        p1: "Ogni organizzazione che adotta la piattaforma ha una propria ontologia, che descrive il suo dominio: le opere e le mostre di un museo, gli articoli e le firme di un giornale, i prodotti e le pratiche di un'azienda. Non parte da zero: estende le ontologie Isagog, e ogni concetto nuovo si aggancia alle prospettive del nucleo. Un'opera d'arte è un artefatto, un curatore è una persona, una mostra si può guardare sia come una collezione di opere sia come qualcosa che accade.",
        p2: "Così l'ontologia dell'organizzazione eredita fin dal primo giorno le regole di ragionamento, le definizioni pensate per i modelli linguistici e gli strumenti della piattaforma: domande in linguaggio naturale, memoria degli agenti, analisi dei testi.",
        p3: "Si può estrarre in modo supervisionato da ciò che l'organizzazione già possiede: i testi, come documenti, procedure e archivi, e gli schemi, come basi di dati e modelli dei dati. Gli agenti propongono concetti e relazioni; gli esperti del dominio li discutono, li correggono e li approvano.",
        cta: "Come lavoriamo con i vostri esperti",
      },
      license: "Le ontologie sono scritte in OWL 2 e rilasciate con licenza CC BY 4.0.",
    },
    ragionamento: {
      eyebrow: "RAGIONARE CON LE ONTOLOGIE",
      titleLine1: "Due lettori,",
      titleEm: "un solo vocabolario.",
      intro:
        "Un'ontologia Isagog ha due lettori: i modelli linguistici, che leggono le parole, e il grafo di conoscenza, che applica le regole. Lo stesso concetto guida entrambi, ed è per questo che le loro risposte si possono confrontare e verificare.",
      llm: {
        title: "Nei modelli linguistici",
        p1: "Le definizioni operative dicono in poche righe che cosa significa ogni termine, nella lingua desiderata. Ai modelli diamo una vista compatta dell'ontologia, non l'ontologia intera: sanno di quali concetti possono parlare e in che senso, con un contesto ridotto.",
        p2: "Quando un agente estrae fatti da una conversazione, può usare solo i concetti del catalogo: ciò che non vi rientra viene scartato. Allo stesso modo l'analisi dei testi riconosce solo i frame previsti, con i loro ruoli. La prospettiva scelta orienta l'interpretazione, invece di lasciarla all'immaginazione del modello.",
      },
      kg: {
        title: "Nel grafo di conoscenza",
        p1: "Sul grafo gli stessi concetti sono assiomi che un motore di inferenza applica. Chi fa accadere un evento è, per definizione, un agente; un evento con almeno due copartecipanti è riconosciuto come reciproco; se un documento produce un segno che si riferisce a qualcosa, il documento riguarda quella cosa.",
        p2: "Le domande in linguaggio naturale diventano interrogazioni SPARQL sul vocabolario dell'ontologia, e i controlli di coerenza segnalano i dati che violano gli assiomi. Ogni risposta si può ricondurre ai dati e alle regole da cui deriva.",
      },
      closing:
        "Le parole orientano il modello, le regole vincolano il grafo: la stessa ontologia tiene insieme le due cose.",
    },
    esplora: {
      eyebrow: "ESPLORA LE ONTOLOGIE",
      titleLine1: "Navigate tra concetti",
      titleEm: "e relazioni.",
      intro:
        "Selezionate un concetto per leggerne la definizione operativa, le prospettive che combina e le relazioni in cui compare. Le classi con più di una superclasse compaiono sotto ciascuna: è la classificazione multipla al lavoro.",
      classesTab: "Concetti",
      propertiesTab: "Relazioni e attributi",
      layerLabel: "Ontologia",
      layerAll: "Tutte",
      layerTop: "Top level",
      layerAgents: "Agenti",
      layerFrame: "Frame",
      searchLabel: "Cerca",
      searchPlaceholder: "Cerca un concetto o una relazione…",
      noResults: "Nessun risultato.",
      multiple: "più prospettive",
      classParents: "Prospettive che combina",
      propertyParents: "Specializza",
      children: "Specializzazioni",
      domainOf: "Relazioni che partono da qui",
      rangeOf: "Relazioni che arrivano qui",
      domain: "Si applica a",
      range: "Punta a",
      kindClass: "Concetto",
      kindObject: "Relazione tra entità",
      kindData: "Attributo",
      profile: "Profilo di entailment",
      profileLegend: "+ sì · − no · ? indeterminato",
      dim1: "volizione",
      dim2: "senzienza",
      dim3: "causazione",
      dim4: "movimento",
      dim5: "mutamento di stato",
      dim6: "esistenza indipendente",
      dim7: "incrementalità",
      onlyEnglish: "Definizione disponibile solo in inglese.",
      noDefinition: "Nessuna definizione.",
    },
  },
  meta: {
    socialImageAlt: "Illustrazione di un albero, Isagog",
    home: {
      title: "Ontologie Isagog",
      description:
        "Le ontologie Isagog: concetti intesi come prospettive che guidano il ragionamento dei modelli linguistici e del grafo di conoscenza.",
    },
    perspectives: {
      title: "Concetti come prospettive — Ontologie Isagog",
      description:
        "Nelle ontologie Isagog un concetto non è una categoria ma una prospettiva: quattro esempi presi dai modelli.",
    },
    layers: {
      title: "Livelli — Ontologie Isagog",
      description:
        "Top level, agenti e frame: i tre livelli delle ontologie Isagog e l'ontologia dell'organizzazione costruita sopra di essi.",
    },
    reasoning: {
      title: "Ragionamento — Ontologie Isagog",
      description:
        "Lo stesso vocabolario guida i modelli linguistici e il ragionamento sul grafo di conoscenza.",
    },
    explorer: {
      title: "Esplora — Ontologie Isagog",
      description:
        "Esplorate concetti e relazioni delle ontologie Isagog: definizioni operative, prospettive, domini e codomini.",
    },
  },
} as const;
