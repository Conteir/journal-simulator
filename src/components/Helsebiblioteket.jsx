import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../index.css";
import ConceptAutosuggest from "./ConceptAutosuggest";
import { HbibRender } from "./HbibRender";
import { hbibUrl, contentTypesMap } from "../config.ts";
import { Spinner } from "reactstrap";

export const Helsebiblioteket = class Helsebiblioteket extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      contentType: {},
      env: "",
      data: "",
      matches: -1,
      showContent: false,
      showSpinner: false
    };
  };

  getContentType = () => {

    let counter = 0;

    const contentTypes = contentTypesMap;

    contentTypes.forEach(contentType => {

      let contentTypeId = contentType.id;
      let contentTypeLocation = contentType.location;

      console.log("Go request!", counter++);
      this.suggestCallbackHbib(contentTypeId, contentTypeLocation);
    });

  };

  suggestCallbackHbib = (suggestion, contentTypeId, contentTypeLocation) => {

    const conceptId = suggestion.concept.conceptId;
    let contentType = contentTypeId;
    let location = contentTypeLocation;

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

    this.callPost(query);
  };

  callPost = ((query) => {
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
        console.log("data with the responce... and here the length can be seen", data.data.guillotine.query.length);
        this.setState({data: JSON.stringify(data), matches: data.data.guillotine.query.length, showSpinner: false});
      });
  });

  render() {
    return (
      <div>
        <div className="jumbotron text-center">
          <h1>HELSEBIBLIOTEKET</h1>
          <p>Choose the code system and make a search throught SNOMED</p>
        </div>

        <div className="row">

          <div className="col-sm-6">

            <div className="row">
              <div className="col-sm-8">
                <ConceptAutosuggest 
                  suggestCallback={this.getContentType} 
                  />
              </div>

              <div className="col-sm-4 match-block">
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

            <div className="row">
              {this.state.showSpinner ? <Spinner color="success" /> : null}
            </div>

            <div className="row">
              <div className="col-sm-8">
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
                        <HbibRender hbibData={this.state.data} />
                      {" "}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }
};

export default ConceptAutosuggest;
