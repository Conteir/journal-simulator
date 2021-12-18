import React from "react";
// Importing Module

  
export const GetParamComponent = class GetParamComponent extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      value : "",
      url: "",
      data: ""

    };

  }
  
  handleQueryString = () => {
    // Parsing the query string 
    // Using parse method

    // let queries = queryString.parse(this.props.location.search);

    let queryString = window.location.search;

    const urlParams = new URLSearchParams(queryString);
    const hapiId = urlParams.get('hapiId')
    console.log(hapiId);

    return this.setState({ value: hapiId });
   
    // version +:  console.log(queryString)

    //console.log(queries)
    //this.setState(queries)
  }

  urlParser = () => {
    const url = new URL(
      ''
    );
    
    url.search(); // => '?message=hello&who=world'
  }

  fetchContentByHapiId = () => {
    let queryString = window.location.search;

    const urlParams = new URLSearchParams(queryString);
    const valueHapiId = urlParams.get('hapiId');
   
    const hdBaseUrl = "https://api.helsedirektoratet.no/innhold/innhold/";
    //const valueHapiId = this.handleQueryString();
    const address = hdBaseUrl + valueHapiId;

    fetch(address, 
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Ocp-Apim-Subscription-Key': "89b72a3ad5cf4723b3f489c3eb4d82a1"
        }
      }
      )
      .then((response) => response.json())
      .then((data) => {
        console.log("Processing response:", data);
        this.setState({ data: JSON.stringify(data), showSpinner: false });
      });
  };
  
  render() {
    return  (
      <div style={{ margin: 200 }}>

    <span>test print</span><span>{this.state.value}</span> <span>test print 2</span>
       {/** {this.urlParser} */} 

        <button
          onClick={this.handleQueryString}
          className='btn btn-primary'>
          click me 
        </button>

        <button 
          onClick={this.fetchContentByHapiId}
          className='btn btn-primary'>
          next step
        </button>


      </div>
    );
  }
}

export default GetParamComponent;
