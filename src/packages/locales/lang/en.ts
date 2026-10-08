export default {
  nav: {
    wordmark: "Isagog",
    siteName: "Ontologies",
    perspectives: "Perspectives",
    layers: "Layers",
    reasoning: "Reasoning",
    explorer: "Explorer",
    mainSite: "isagog.com",
    menu: "Navigation menu",
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
      eyebrow: "WHERE TO START",
      perspectives: {
        title: "Concepts as perspectives",
        body: "Why a concept is not a category to lock things into, with four examples taken from the models.",
      },
      layers: {
        title: "Three layers, plus yours",
        body: "Top level, agents and frames: what each one describes, and how an organization's own ontology is built on them.",
      },
      reasoning: {
        title: "One vocabulary, two readers",
        body: "How the same definitions guide both language models and reasoning over the knowledge graph.",
      },
      explorer: {
        title: "Explore the ontologies",
        body: "Concepts and relations, with operational definitions, perspectives, domains and ranges.",
      },
    },
  },
  ontologies: {
    hero: {
      eyebrow: "ONTOLOGIES",
      titleLine1: "Integrating language models with an organization's knowledge",
      titleEm: "takes a new kind of conceptual model.",
      lead: "Isagog ontologies are built for this: they guide the reasoning of both language models and the knowledge graph.",
      p1: "Language models can talk about almost anything, but they don't know an organization's data, rules and vocabulary. Connecting them to that knowledge takes a conceptual model: a shared, precise vocabulary stating what is being talked about, how those things are related and what can be inferred from them.",
      p2: "Traditional ontologies were born for databases and logical systems: they file everything into a rigid hierarchy of categories. Natural language works differently: the same words change meaning with context, and the same object is described in different ways depending on what is needed. A model meant to work with language models has to take this into account.",
      p3: "These pages explain how we have rethought our ontologies, what they are for and how we use them. In the explorer you can browse them yourself.",
    },
    prospettive: {
      eyebrow: "A NEW CONCEPTION",
      titleLine1: "Not categories,",
      titleEm: "but perspectives.",
      intro:
        "What is new is a change of viewpoint. In our ontologies a concept is not a category to lock things into, but a perspective to look at them from: the same entity can be seen in several ways, each with its own reasoning rules, and the context picks the relevant one. This way the model embraces the polysemy of language instead of fighting it. Four examples, taken straight from the models.",
      ex1: {
        title: "What lasts and what happens",
        body: "Continuant (what persists while keeping its identity) and occurrent (what happens and unfolds in time) are not declared disjoint. An exhibition can be described as something that fills three rooms and as something that runs from March to June, without splitting it into two different entities.",
      },
      ex2: {
        title: "A speech act is both an event and information",
        body: "When someone says “we open at nine tomorrow”, something happens (an event, with a speaker and a listener) and some content is passed on (information, about something). In the agents ontology the speech act is both, in the same entity, and it obeys the rules of each.",
      },
      ex3: {
        title: "Selling and buying: one event, different words",
        body: "In the frame ontology, perspective is a lexical fact, not an ontological one. A sale has all of its participants; “sell” and “buy” are words that bring different roles to the foreground. The model stays univocal, and the point of view lives in the choice of words.",
      },
      ex4: {
        title: "Knowing what you don't know",
        body: "The ontologies adopt the open world assumption: if an event has no start date, that does not mean it never began, only that we don't know when. This is what lets a system tell what it knows from what it doesn't, and say so.",
      },
      closing:
        "Multiple classification is not a compromise: each perspective keeps its own axioms, and reasoning applies them all.",
    },
    livelli: {
      eyebrow: "THREE ONTOLOGIES, ONE MODEL",
      titleLine1: "A minimal core",
      titleEm: "and two specialized layers.",
      intro:
        "Isagog ontologies are built in layers. The top level sets the most general distinctions; the other two import and extend it, for conversational agents and for text analysis.",
      versionLabel: "version",
      top: {
        name: "Top level ontology",
        tagline: "The most general categories, with modest commitments.",
        body: "A few fundamental categories (continuants and occurrents, tangibles and intangibles, agents, information, signs, situations, qualities) and the relations that connect them: participation, composition, causation, location, inherence. Every term has a short operational definition, in Italian and English, written to be read by a language model too, and mappings to DOLCE and schema.org.",
      },
      agents: {
        name: "Agents ontology",
        tagline: "Speech acts, conversations, memory.",
        body: "It describes how agents communicate. A speech act has exactly one author and one illocutionary type (inform, ask, confirm…), it may answer an earlier act and carry a salience weight; a conversation is an event whose phases are speech acts. Aspects (the user's needs, interests, constraints) are the qualities an agent remembers: they make up its semantic memory.",
      },
      frames: {
        name: "Frame ontology",
        tagline: "The recurring situations texts talk about.",
        body: "An inventory of roles: participants (patient, theme, instrument, beneficiary, experiencer…), each defined by seven yes/no questions such as “is there volition?” or “is there a change of state?”, and circumstances, organized on the four Aristotelian causes. A frame is at once a class of events and a catalog entry, with definitions, lexical units and corpus attestations: a frame with no attestations is a hypothesis, not an entry.",
      },
      cliente: {
        eyebrow: "YOUR ONTOLOGY",
        titleLine1: "Built on the Isagog ontologies,",
        titleEm: "extracted from your texts and your schemas.",
        p1: "Every organization that adopts the platform has its own ontology, describing its domain: a museum's works and exhibitions, a newspaper's articles and bylines, a company's products and procedures. It does not start from scratch: it extends the Isagog ontologies, and every new concept hooks into the perspectives of the core. An artwork is an artifact, a curator is a person, an exhibition can be seen both as a collection of works and as something that happens.",
        p2: "This way the organization's ontology inherits, from day one, the reasoning rules, the definitions written for language models and the platform's tools: natural-language questions, agent memory, text analysis.",
        p3: "It can be extracted, under supervision, from what the organization already has: its texts, such as documents, procedures and archives, and its schemas, such as databases and data models. Agents propose concepts and relations; domain experts discuss, correct and approve them.",
        cta: "How we work with your experts",
      },
      license: "The ontologies are written in OWL 2 and released under the CC BY 4.0 license.",
    },
    ragionamento: {
      eyebrow: "REASONING WITH ONTOLOGIES",
      titleLine1: "Two readers,",
      titleEm: "one vocabulary.",
      intro:
        "An Isagog ontology has two readers: language models, which read the words, and the knowledge graph, which applies the rules. The same concept guides both, which is why their answers can be compared and checked.",
      llm: {
        title: "In language models",
        p1: "Operational definitions state in a few lines what each term means, in the language required. We give models a compact view of the ontology, not the whole of it: they know which concepts they may talk about and in what sense, with a smaller context.",
        p2: "When an agent extracts facts from a conversation, it can only use concepts from the catalog: anything that does not fit is discarded. In the same way, text analysis only recognizes the expected frames, with their roles. The chosen perspective steers interpretation, instead of leaving it to the model's imagination.",
      },
      kg: {
        title: "In the knowledge graph",
        p1: "On the graph, the same concepts are axioms applied by an inference engine. Whoever brings an event about is, by definition, an agent; an event with at least two coparticipants is recognized as reciprocal; if a document yields a sign referring to something, the document is about that thing.",
        p2: "Natural-language questions become SPARQL queries over the ontology's vocabulary, and consistency checks flag data that violate the axioms. Every answer can be traced back to the data and rules it comes from.",
      },
      closing:
        "Words steer the model, rules constrain the graph: the same ontology holds the two together.",
    },
    esplora: {
      eyebrow: "EXPLORE THE ONTOLOGIES",
      titleLine1: "Browse concepts",
      titleEm: "and relations.",
      intro:
        "Select a concept to read its operational definition, the perspectives it combines and the relations it takes part in. Classes with more than one superclass appear under each of them: that is multiple classification at work.",
      classesTab: "Concepts",
      propertiesTab: "Relations and attributes",
      layerLabel: "Ontology",
      layerAll: "All",
      layerTop: "Top level",
      layerAgents: "Agents",
      layerFrame: "Frames",
      searchLabel: "Search",
      searchPlaceholder: "Search for a concept or relation…",
      noResults: "No results.",
      multiple: "several perspectives",
      classParents: "Perspectives it combines",
      propertyParents: "Specializes",
      children: "Specializations",
      domainOf: "Relations starting here",
      rangeOf: "Relations ending here",
      domain: "Applies to",
      range: "Points to",
      kindClass: "Concept",
      kindObject: "Relation between entities",
      kindData: "Attribute",
      profile: "Entailment profile",
      profileLegend: "+ yes · − no · ? undetermined",
      dim1: "volition",
      dim2: "sentience",
      dim3: "causation",
      dim4: "movement",
      dim5: "change of state",
      dim6: "independent existence",
      dim7: "incrementality",
      onlyEnglish: "Definition available in English only.",
      noDefinition: "No definition.",
    },
  },
  meta: {
    socialImageAlt: "Illustration of a tree, Isagog",
    home: {
      title: "Isagog ontologies",
      description:
        "Isagog ontologies: concepts as perspectives that guide the reasoning of language models and the knowledge graph.",
    },
    perspectives: {
      title: "Concepts as perspectives — Isagog ontologies",
      description:
        "In the Isagog ontologies a concept is not a category but a perspective: four examples taken from the models.",
    },
    layers: {
      title: "Layers — Isagog ontologies",
      description:
        "Top level, agents and frames: the three layers of the Isagog ontologies and the organization's own ontology built on them.",
    },
    reasoning: {
      title: "Reasoning — Isagog ontologies",
      description:
        "The same vocabulary guides language models and reasoning over the knowledge graph.",
    },
    explorer: {
      title: "Explorer — Isagog ontologies",
      description:
        "Browse the concepts and relations of the Isagog ontologies: operational definitions, perspectives, domains and ranges.",
    },
  },
} as const;
