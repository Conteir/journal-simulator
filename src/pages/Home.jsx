import React from "react";
import { Link } from "react-router-dom";

export const Home = class Home extends React.Component {
    
  render() {
    return (
      <div className="App">
          <p>This is a home page</p>
          <Link to="/journal">
            Go to the journal
          </Link>
      </div>
    );
  }
}

export default Home;