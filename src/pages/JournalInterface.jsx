import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../index.css";
import ConceptAutosuggest from "../components/ConceptAutosuggest";
import HdirRender from "../components/HdirRender";
import HbibRender from "../components/HbibRender";
// import GetParamComponent from "../components/GetParamComponent";
import { IFrame } from "../components/IFrameCompoment";
import { Spinner } from 'reactstrap';
import { patients, HelseDirFetchParams, helsedirBaseUrl, contentTypesMap } from "../config.ts";
import { terminlogyServer, branchICPC2, branchICD10, urlParameters, hbibUrl } from "../config.ts";

export const JournalInterface = class JournalInterface extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            conceptId: null,
            showSpinner: false,
            showContent: false,
            hdirData: [],
            ICPC2code: null,
            suggestion: {},
            hbibData: [],
            patient: null
        }
    }

    getPatientInfo = (event) => {
        let patientId = event.target.value;
        console.log("patientId", patientId);
        console.log("Type of patient option value (patient.id): ", typeof patientId);
        let patient = patients.find(p => p.id == patientId);
        console.log("Patient obj: ", patient);
        this.setState( {patient: patient} );

    }

    processSuggestion = (suggestion) => {
        if(!suggestion) return;
        console.log("suggestion:", suggestion);
        const conceptId = suggestion.concept.conceptId;

        this.setState({ conceptId: conceptId, suggestion: suggestion });
        //this.setState({showSpinner: true});

        // Get HBIB Data, 3 calls
        this.getHbibData(conceptId);
       
        
        let codePromises = [];
        codePromises.push(this.getICPC2Code(conceptId));
        codePromises.push(this.getICD10Code(conceptId));

        Promise.all(codePromises).then((codeSystems) => {
            // HDIR Data, 2 calls
            codeSystems.forEach((codeSystem) => this.getHdirData(codeSystem));
        });
    };

    getICPC2Code = (conceptId) => {
        const url = terminlogyServer
            + '/browser/' + branchICPC2 
            + '/members' + urlParameters 
            + '&referenceSet=450993002'
            + '&referencedComponentId=' + conceptId;
        let promise = fetch(url)
        .then((response) => response.json())
        .then((data) => {
            if (data?.items
                && data.items.length > 0
                && data.items[0]?.additionalFields?.mapTarget !== undefined) {
                let icpc2Code = data.items[0].additionalFields.mapTarget;
                
                let codeSystemObj = {
                    codeSystem: "ICPC-2",
                    code: icpc2Code
                };

                // For Semantic
                this.setState({ICPC2code: icpc2Code});

                return codeSystemObj;
            }
        });
        return promise;
    }

    getICD10Code = (conceptId) => {
        const url = terminlogyServer 
            + '/browser/' + branchICD10 
            + '/members' + urlParameters 
            + '&referenceSet=447562003'
            + '&referencedComponentId=' +conceptId;
        let promise = fetch(url)
        .then((response) => response.json())
        .then((data) => {
            if (data?.items
                && data.items.length > 0
                && data.items[0]?.additionalFields?.mapTarget !== undefined) {
                    let codeSystemObj = {
                        codeSystem: "ICD-10",
                        code: data.items[0].additionalFields.mapTarget
                    };
                return codeSystemObj;
            }
        });
        return promise;
    }

    // get Helsedir data:
    getHdirData = (codeSystem) => {
        if(!codeSystem) return;
        
        const url = helsedirBaseUrl + "?kodeverk=" + codeSystem.codeSystem + "&kode=" + codeSystem.code;
        fetch(url, HelseDirFetchParams)
        .then((response) => response.json())
        .then((data) => {
            if(data?.length > 0) {
                const hdirData = this.state.hdirData;
                hdirData.push(JSON.stringify(data));
                this.setState({hdirData: hdirData});
            }
        });
    }

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
                    <div >
                        <h1>Journal simulator</h1>
                    </div>
                </header>

                <article>

                    <button onClick={() => console.log(this.state)}>Log state</button>
                   
                    <div className="row">
                        <div className="row col-md-12 form-group">
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
                                    value={patients.id}>
                                        {patients.name}{" "}
                                        {patients.age}{" "}
                                        {patients.sex}
                                </option>
                                )}
                            </select>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">

                                <label htmlFor="funn"><b>Funn:</b></label>
                                <textarea
                                    id="funn"
                                    type="text"
                                    autoComplete="off"
                                    placeholder="funn"
                                    className="fill-width"
                                />
                            </div>
                        </div>


                        <div className="col-md-6">
                            <div className="form-group">

                                <label htmlFor="funn"><b>Årsak (symptom, plage eller tentativ diagnose):</b></label>
                                {/* <p><b>Årsak (symptom, plage eller tentativ diagnose):</b></p> */}

                                <div className="row">
                                    <ConceptAutosuggest 
                                        suggestCallback={this.processSuggestion} 
                                    />
                                </div>

                                <div className="row">
                                    {this.state.showSpinner ? <Spinner color="success" /> : null}
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="row">

                        <div className="col-sm-6">

                            <div className="form-group">
                                <label htmlFor="vurdering"><b>Vurdering:</b></label>
                                <textarea
                                    id="vurdering"
                                    type="text"
                                    autoComplete="off"
                                    placeholder="vurdering"
                                    className="fill-width"
                                />
                            </div>
                        </div>

                        <div className="col-sm-6">
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


                    <div className="row">
                        

                        <div className="col-sm-12">
                            {
                                this.state.hdirData.map((item, index) => 
                                    <div 
                                        // className="content" 
                                        key={index}>
                                        <HdirRender
                                            data={item}
                                            // linkCallback={this.linkCallback}
                                            hideMetadata={true}
                                            hideLinksNavigation={true}
                                        />{" "}
                                    </div>
                                )
                            }
                        </div>

                    </div>

                    <div className="row">

                        <div className="col-sm-12">
                            {
                                this.state.hbibData.map((item, index) => 
                                    <div 
                                        // className="content" 
                                        key={index}>
                                        <HbibRender
                                            hbibData={item}
                                        />
                                    </div>
                                )
                            }
                        </div>
                    </div>
                        
                </article>
            </div>
        );
    }
};

export default JournalInterface;
