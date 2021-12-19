export const codeSystems = [
    {
      id: "ICPC-2",
      title: "ICPC-2",
    },
    {
      id: "ICD-10",
      title: "ICD-10",
    },
    
    {
      id: "ATC",
      title: "ATC",
    },

    {
      id: "SNOMED-CT",
      title: "SNOMED-CT",
    },
  ]

  export const enviroments = [
    {
      id: "test-bt",
      title: "Test BT",
      url: "https://helsedirektoratet-bt.azure-api.net/innhold/",
      key: "143e448642124111b8c5e4d7e00d1975",
    },
    {
      id: "test-st",
      title: "Test ST",
      url: "https://helsedirektoratet-st.azure-api.net/innhold/",
      key: "663f23169cae4c8785ec48defa793c23",
    },
    {
      id: "qa",
      title: "QA",
      url: "https://helsedirektoratet-at.azure-api.net/innhold/",
      key: "4f044f75aeea46529ad158cf910e800c",
    },
    {
      id: "prod",
      title: "Production",
      url: "https://api.helsedirektoratet.no/innhold/",
      key: "89b72a3ad5cf4723b3f489c3eb4d82a1",
    },
  ]

  //SNOMED CT CONFIGURATIONS
  export let terminlogyServer: string = 'https://snowstorm.conteir.no';
  export let branchICD10: string = 'MAIN/SNOMEDCT-NO';
  export let branchICPC2: string = 'MAIN/ICPC-2';
  export let branchHelsedir: string = 'MAIN/SNOMEDCT-NO/HELSEDIREKTORATET';

  export let urlParameters: string = '?limit=10&active=true&groupByConcept=true&semanticTags=disorder&semanticTags=finding&language=no&language=nb&language=nn&language=en&conceptActive=true';

  export const snomedURLs =  
  {
    getTerms: terminlogyServer + '/browser/' + branchHelsedir + '/descriptions' + urlParameters + '&term=',
  }

  export const codeSystemEnv = [
    {
      id: "ICPC-2",
      title: "Primærhelsetjenesten (ICPC-2)",
      url: terminlogyServer + '/browser/' + branchICPC2 + '/members' + urlParameters + '&referenceSet=450993002'
        + '&referencedComponentId='
    },
    {
      id: "ICD-10",
      title: "Spesialisthelsetjenesten (ICD-10)",
      url: terminlogyServer + '/browser/' + branchICD10 + '/members' + urlParameters + '&referenceSet=447562003'
        + '&referencedComponentId='
    }
  ]

  export const HelseDirFetchParams = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Ocp-Apim-Subscription-Key": "89b72a3ad5cf4723b3f489c3eb4d82a1",
    },
  };

  export const helsedirBaseUrl = "https://api.helsedirektoratet.no/innhold/innhold/";

//// configurations for hbib
// export const hbibUrl = 'https://qa.hbib.ntf.seeds.no/_/service/com.enonic.app.guillotine/graphql';
export const hbibUrl = 'https://snowstorm.conteir.no/hbibgraph/_/service/com.enonic.app.guillotine/graphql';
  
/// HBIB requests storage:
export const contentTypesMap = [
  {
    title: "Behandlingsanbefaling",
    id: "treatment_recommendation",
    location: "TreatmentRecommendation",
  },
  {
    title: "Kapittel",
    id: "chapter",
    location: "Chapter",
  },
  {
    title: "Anbefaling",
    id: "recommendation",
    location: "Recommendation",
  },
  // {
  //   title: "Antidote database (test)",
  //   id: "antidote_database",
  //   location: "AntidoteDatabase",
  // }
]

export const patients = [ 
  { 
    id: 111,
    name: "Lars",
    age: 35,
    sex: "man"
  },
  { 
    id: 222,
    name: "Irvin",
    age: 31,
    sex: "man"
  },
  { 
    id: 333,
    name: "Lora",
    age: 29,
    sex: "woman"
  }
]