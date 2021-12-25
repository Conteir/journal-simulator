import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../index.css";
import DisordersAutosuggest from "../components/DisordersAutosuggest";
import HbibRender from "../components/HbibRender";
import { HTMLRender } from "../components/htmlRenderComponent";
import { IFrame } from "../components/IFrameCompoment";
import { codeSystemEnv, params, helsedirBaseUrl } from "../config.ts";
import { patients, contentTypesMap, hbibUrl } from "../config.ts";
// import { Spinner } from "reactstrap";
// import GetParamComponent from "./GetParamComponent.jsx";

export const JournalInterface = class JournalInterface extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        conceptId: null,
        hdirData: [],
        ICPC2code: null,
        suggestion: {},
        hbibData: [],
        patient: null,
        env: "",
        data: "",
        matches: -1,
        showContent: false,
        showSpinner: false
    };
  }

  getPatientInfo = (event) => {
    let patientId = event.target.value;
    console.log("patientId", patientId);
    console.log("Type of patient option value (patient.id): ", typeof patientId);
    let patient = patients.find(p => p.id == patientId);
    console.log("Patient obj: ", patient);
    this.setState( {patient: patient} );
}

  componentDidMount() {
    const urlParams = new URLSearchParams(window.location.search);
    const valueHapiId = urlParams.get('hapiId');
    if(valueHapiId) {
      const url = helsedirBaseUrl + valueHapiId;
      this.fetchContent(url);
      this.setState({ showContent: true });
    }
  }

    codeSystemPromise = (url) => {
        let promise = fetch(url, params).then((response) => response.json());
        return promise;
    };

  //getting forel and barn link data (h.p.)
  getLinkData = (link) => {
    let promise = fetch(link.href, params)
      .then((response) => response.json())
      .then((data) => {
        link.$title = data.tittel;
      });
    return promise;
  };

  //response: handling and processing (h.p.)
  processResponse = (data) => {
    console.log("Processing response:", data);
    if (!data) return;

    //for links
    let promises = [];

    //Preprocess -> get barn and forelder links titles (h.p)
    if (Array.isArray(data)) {
      data.forEach((item) => {
        if (Array.isArray(item.links)) {
          // object, going through all links
          item.links.forEach((link) => {
            if (
              link.rel === "barn" ||
              link.rel === "forelder" ||
              link.rel === "root"
            ) {
              promises.push(
                // will be pushed after getLinkData finished
                this.getLinkData(link)
              );
            }
          });
        }
      });

      // Text render demo (commented out now) START
        // check if there is data with required field:
      if (data[0]?.tekst !== undefined) {
        this.setState({ content: data[0].tekst });
      }
      // Text render demo (commented out now) END
    } else {
      if (Array.isArray(data.links)) {
        // object, going through all links
        data.links.forEach((link) => {
          if (
            link.rel === "barn" ||
            link.rel === "forelder" ||
            link.rel === "root"
          ) {
            promises.push(
              // will be pushed after getLinkData finished
              this.getLinkData(link)
            );
          }
        });
      }
    }

    Promise.all(promises).then(() => {
      this.setState({ data: JSON.stringify(data), showSpinner: false });
    });
  };

  // callback to hdir
  linkCallback = (url) => {
    this.setState({ data: "", showSpinner: true });
    fetch(url, params)
      .then((response) => response.json())
      .then(
        (data) => {
          this.processResponse(data);
        },
        () => this.setState({ showSpinner: false })
      );
  };

  suggestCallback = (suggestion) => {
    if (!suggestion.$codeSystemResult) return;

    const codeSystemResult = suggestion.$codeSystemResult;
    const codeSystem = codeSystemResult.codeSystem;
    const code = codeSystemResult.code;
    const conceptId = suggestion.concept.conceptId;

    this.setState({ conceptId: conceptId, suggestion: suggestion });

    // Get HBIB Data, 3 calls
    this.getHbibData(conceptId);

    const url = helsedirBaseUrl + "?kodeverk=" + codeSystem + "&kode=" + code;
    this.fetchContent(url);
  }

  fetchContent = (url) => {
    this.setState({ showSpinner: true });
    // reset state to clean results before new loading
    this.setState({ matches: -1, data: "", showContent: false });
    // API key depends on environment: current -> Production

    fetch(url, params)
      .then((response) => response.json())
      .then((data) => {
        //console.log("Content for " + codeSystem + ":", data);
        if (Array.isArray(data)) {
          this.setState({ matches: data.length, showSpinner: false });
        }
        if (Array.isArray(data) && data.length > 0 && data[0].tekst) {
          this.setState({
            content: data[0].tekst,
            data: JSON.stringify(data),
            showSpinner: false,
          });

          //console.log("Content for " + codeSystem + ":", data);
          //console.log("Content for " + codeSystem + ":", data.length);
        }
        console.log("So, what is here..?", data);
        this.processResponse(data);
      });
  };

  /*
  // Getting a content from autosuggest
  fetchContentOld = (conceptId) => {
    let promises = [];
    let content = {};

    // ICPC2
    let codeSystemUrl1 = snomedURLs.getICPC2 + conceptId;

    let promiseICPC2 = fetch(codeSystemUrl1)
      .then((response) => response.json())
      .then((data) => {
        console.log("ICPC2", data);
        if (data && Array.isArray(data.items) && data.items.length > 0) {
          if (data.items[0]?.additionalFields?.mapTarget) {
            content.icpc2 = {
              code: data.items[0]?.additionalFields?.mapTarget,
            };
          }
        }
      });
    promises.push(promiseICPC2);

    // ICD
    let codeSystemUrl = snomedURLs.getICD10 + conceptId;

    let promiseICD10 = fetch(codeSystemUrl)
      .then((response) => response.json())
      .then((data) => {
        console.log("icd10", data);
        if (data && Array.isArray(data.items) && data.items.length > 0) {
          if (data.items[0]?.additionalFields?.mapTarget) {
            content.icd10 = {
              code: data.items[0]?.additionalFields?.mapTarget,
            };
          }
        }
      });
    promises.push(promiseICD10);

    Promise.all(promises).then(() => {
      let contentPromises = [];
      // Fetch by ICPC2 if available

      // API key depends on environment: current -> Production
      const apiKey = "89b72a3ad5cf4723b3f489c3eb4d82a1";
      const hdBaseUrl = "https://api.helsedirektoratet.no/innhold/innhold";
      let params = {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Ocp-Apim-Subscription-Key": apiKey,
        },
      };

      if (content.icpc2) {
        let url = hdBaseUrl + "?kodeverk=ICPC-2&kode=" + content.icpc2.code;
        let promiseICPC2Content = fetch(url, params)
          .then((response) => response.json())
          .then((data) => {
            console.log("icpc2 items:", data);
            if (Array.isArray(data) && data.length > 0 && data[0].tekst) {
              content.icpc2.text = data[0].tekst;
            }
          });
        contentPromises.push(promiseICPC2Content);
      }

      // Fetch by ICD10 if available
      if (content.icd10) {
        let url = hdBaseUrl + "?kodeverk=ICD-10&kode=" + content.icd10.code;
        console.log(url);
        let promiseICD10Content = fetch(url, params)
          .then((response) => response.json())
          .then((data) => {
            console.log("icd10 items:", data);
            if (Array.isArray(data) && data.length > 0 && data[0].tekst) {
              content.icd10.text = data[0].tekst;
            }
          });
        contentPromises.push(promiseICD10Content);
      }

      Promise.all(contentPromises).then(() => {
        console.log("Content", content);

        //making render for icpc
        if (content?.icpc2?.text) {
          this.setState({ icpc2Content: content.icpc2.text });
        }

        //making render for icd
        if (content?.icd10?.text) {
          this.setState({ icd10Content: content.icd10.text });
        }
      });
    });
  }; */

  // HBIB:

    getHbibData = (conceptId) => {
        this.getContentType(conceptId);
    }

    getContentType = (conceptId) => {

        let counter = 0;
        const contentTypes = contentTypesMap;

        contentTypes.forEach(item => {

            let contentType = item.id;
            let location = item.location;

            console.log("Go request! ", counter++);

            let query =
                '{' +
                'guillotine {' +
                'query('+
                    'query: "type=\'no.seeds.hbib:'+contentType+'\'",'+
                    'filters: {'+
                    'hasValue: {'+
                        'field: "x.no-seeds-hbib.metadata.code",'+
                        ' stringValues: ["' + conceptId + '"]' +
                    '}'+
                    '}'+
                ') {\n'+
                    '... on no_seeds_hbib_' + location + ' {\n'+
                    '   _id\n' +
                    '   dataAsJson\n' +
                    '   xAsJson\n' +
                    '}'+
                '}'+
                '}'+
                '}';

            console.log("contentType:", contentType);  
            console.log("location:", location);  
            console.log("conceptId:", conceptId);  
            console.log("query:", query);
        
            this.setState({ showSpinner: true });
        
            const parameters = {
                method: 'POST',
                headers: {
                // "Content-Type": "application/json",
                "Origin": "https://qa.hbib.ntf.seeds.no"
                },
                body: JSON.stringify({
                query: query
                })
            };

            fetch(hbibUrl, parameters)
            .then(response => response.json())
            .then(data => {
                console.log("Got data for location:", location, "Data:", data);
                console.log("data with the responce... and here the length can be seen", data.data.guillotine.query.length);
                const hbibData = this.state.hbibData;
                hbibData.push(JSON.stringify(data));
                this.setState({hbibData: hbibData});
            });

        });
    };

    render() {
        return (
            <div className="App">

                <header className="jumbotron text-center">
                    <div>
                        <h1>Journal simulator</h1>
                    </div>
                </header>

                <article>
                    {/* <button onClick={() => console.log(this.state)}>Log state</button> */}

                    <div className="row">
                        <div className="col-md-6">
                            <div className="row">
                                <div className="form-group">
                                    <select
                                        defaultValue={""}
                                        onChange={this.getPatientInfo}
                                        required
                                    >
                                        <option value="" disabled>
                                            Now treating: 
                                        </option>
                                        
                                        {patients.map((patients, key) => 
                                        <option 
                                            key={key} 
                                            value={patients.id}
                                        >
                                            {patients.name}{" "}
                                            {patients.age}{" "}
                                            {patients.sex}
                                        </option>
                                        )}
                                    </select>
                                </div>
                            </div>
                            <div className="row">
                                <div className="form-group">
                                    <label htmlFor="notat"><b>Notat:</b></label>
                                    <textarea
                                        aria-label="Notat"
                                        id="notat"
                                        type="text"
                                        autoComplete="off"
                                        placeholder=""
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="form-group">
                                    <label htmlFor="funn">
                                    <b>Funn:</b>
                                    </label>
                                    <textarea
                                    id="funn"
                                    type="text"
                                    autoComplete="off"
                                    placeholder=""
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="form-group">
                                    <label htmlFor="vurdering">
                                    <b>Vurdering:</b>
                                    </label>
                                    <textarea
                                    id="vurdering"
                                    type="text"
                                    autoComplete="off"
                                    placeholder=""
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="form-group">
                                    <label htmlFor="tiltak">
                                    <b>Tiltak:</b>
                                    </label>
                                    <textarea
                                    id="tiltak"
                                    type="text"
                                    autoComplete="off"
                                    placeholder=""
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="row">
                                <div className="form-group">
                                    <select
                                        defaultValue={""}
                                        required
                                        onChange={(evt) => this.setState({ env: evt.target.value })}
                                    >
                                        <option value="" disabled>
                                            Velg kontekst:
                                        </option>

                                        {codeSystemEnv.map((codeSystem, key) => (
                                        <option 
                                            key={key} 
                                            value={codeSystem.id}
                                        >
                                            {codeSystem.title}
                                        </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="row">
                                <div className="form-group">
                                    <DisordersAutosuggest
                                        placeholder="Årsak (symptom, plage eller tentativ diagnose):"
                                        suggestCallback={this.suggestCallback}
                                        codeSystem={this.state.env}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="match-block">
                                    {this.state.matches > 0 ? (
                                        <div>
                                        <span
                                        onClick={() => {
                                            this.setState({ showContent: true });
                                        }}
                                        className="badge badge-primary"
                                        >
                                        {" "}
                                        {this.state.matches}{" "}
                                        </span>
                                    </div>
                                    ) : this.state.matches === 0 ? (
                                        <div>No content matches this code</div>
                                        ) : null}
                                </div>
                            </div>
                            {/* renders.. */}
                            <div className="row">
                                {this.state.showContent ? (
                                    <div id="popup-hapi" className="popupHAPI">
                                        <div className="header">
                                            <span>Beslutningsstøtte</span>
                                            <span
                                                className="popup-close"
                                                onClick={() => this.setState({ showContent: false })}
                                            >
                                                X
                                            </span>
                                            </div>
                                            <div className="content">
                                            <HTMLRender
                                                data={this.state.data}
                                                linkCallback={this.linkCallback}
                                                hideMetadata={true}
                                                hideLinksNavigation={true}
                                            />{" "}
                                            {/** --> hide metadata */}
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                            <div className="row">
                                {this.state.hbibData.map((item, index) => 
                                    <div 
                                        // className="content" 
                                        key={index}>
                                        <HbibRender
                                            hbibData={item}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="row">
                                <div>
                                    <p>
                                        <a className="btn, btn-info"
                                            href={"https://bestpractice.bmj.com/infobutton?knowledgeResponseType=text/html&mainSearchCriteria.v.cs=2.16.840.1.113883.6.96&mainSearchCriteria.v.c="
                                            + this.state.SCTID}
                                            target="_blank"
                                            rel="noopener noreferrer">
                                            BMJ Infobutton
                                        </a>
                                    </p>
                                </div>
                            </div>
                            <div className="row">
                                <div>
                                    <IFrame
                                        className="responsive-iframe" //needs test
                                        frameBorder="0"
                                        width="100%" height="300px"
                                        src={
                                        "https://semantic.dev.minus-data.no/pasientsky/?icpc-2=" +
                                        //"https://cds-simulator.minus-data.no/pasientsky/?icpc-2=" +
                                        this.state.ICPC2code
                                        }
                                        title="semanticData"
                                    >   
                                    </IFrame>
                                </div>
                            </div>
                        </div>
                    </div>

                {/* <div className="row">
                    {this.state.showSpinner ? <Spinner color="success" /> : null}
                </div> */}

            

                

            {/*
            <div>
                <h1>test</h1>
                <GetParamComponent/>
            </div>
            */}
            </article>
        </div>
        );
    }
};

export default JournalInterface;
