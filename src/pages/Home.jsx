import React from "react";
import { Link } from "react-router-dom";

export const Home = class Home extends React.Component {
    
  render() {
    return (
      <div className="App">
          <div className="conteiner">
            <article>
              <p>This is a home page</p>
              <Link to="/journal">
                Go to the journal
              </Link>
            </article>
          </div>
      </div>
    );
  }
}

export default Home;