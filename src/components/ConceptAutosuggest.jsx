import React from 'react';
import Autosuggest from 'react-autosuggest';
import '../styles/ConceptAutosuggest.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { Spinner } from 'reactstrap';

export const ConceptAutosuggest = class ConceptAutosuggest extends React.Component {
  constructor() {
    super();

    // Autosuggest is a controlled component.
    // This means that you need to provide an input value
    // and an onChange handler that updates this value (see below).
    // Suggestions also need to be provided to the Autosuggest,
    // and they are initially empty because the Autosuggest is closed.
    this.state = {
      showSpinner: false,
      value: '',
      suggestions: [],
      sourceId: null
    };
  }
  
  // When suggestion is clicked, Autosuggest needs to populate the input
  // based on the clicked suggestion. Teach Autosuggest how to calculate the
  // input value for every given suggestion.
  getSuggestionValue = (suggestion) => {
    console.log("selected suggestion conceptId: ", suggestion.concept.conceptId);
    
    this.props.suggestCallback(suggestion);

    return suggestion.term + ' (SCTID: ' + suggestion.concept.conceptId
    // + ', ' + suggestion?.$codeSystemResult?.codeSystem
    // + ': ' + suggestion?.$codeSystemResult?.code
    + ')';
  }
  
  // Use your imagination to render suggestions.
  renderSuggestion = (suggestion) => (
    <>
      {suggestion.term + ' (SCTID: ' + suggestion.concept.conceptId // items.concept.conceptId
          // + ', ' + suggestion?.$codeSystemResult?.codeSystem
          // + ': ' + suggestion?.$codeSystemResult?.code 
          + ')'}
    </>
  );

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = ({ value }) => { //' Pneu  ' -> 'pneu'
    setTimeout(() => this.fetchSuggestions(value), 350);
  };

  fetchSuggestions = (value) => {
    if(!value || value !== this.state.value) return;

    const currentValue = value;
    const term = value.trim().toLowerCase();

    let getTermsUrl = 'https://snowstorm.conteir.no'
      + '/browser/' 
      + "MAIN/SNOMEDCT-NO/TESTBRANCH" // handle branch as just MAIN
      + '/descriptions?'
      + 'term=' + term
      + '&active=true&conceptActive=true&groupByConcept=true&offset=0&limit=10'
      + '&language=nb&language=nn&language=no&language=en';

    console.log("getTermsUrl with suggestion", getTermsUrl);

    if( term && term.length >= 3) {
        // First request to Snomed: search by term
        this.setState({ showSpinner: true });
        fetch(getTermsUrl,
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            }
        )
        .then(response => response.json())
        .then(data => {
          console.log("Suggestions: ", data);

          if(this.state.value.trim().toLowerCase() === currentValue && Array.isArray(data.items)) {
            this.setState({
                suggestions: data.items,
                showSpinner: false
            });
          }

        });
    } else {
        this.setState({
            suggestions: []
        });
    }
  }

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  onChange = (event, { newValue }) => {
    console.log('onchange!');
    this.setState({
      value: newValue
    });
  };

  render() {
    const { value, suggestions } = this.state;

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      value,
      onChange: this.onChange,
      placeholder: this.props.placeholder
    };

    // Finally, render it!
    return (
        <div>
            <Autosuggest
                suggestions={suggestions}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                getSuggestionValue={this.getSuggestionValue}
                renderSuggestion={this.renderSuggestion}
                inputProps={inputProps}
            />
             {this.state.showSpinner ? <Spinner color="success" /> : null}

             
        </div>
    );
  }
}

export default ConceptAutosuggest;
