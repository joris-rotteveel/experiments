import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import "./App.css";
import Simple from "./pages/Simple";
import Timeline from "./pages/Timeline";
import Parallax from "./pages/Parallax";
import Scrollio from "./pages/Scrollio";

export default function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul className="horizontal">
            <li>
              <Link to="/">Simple</Link>
            </li>
            <li>
              <Link to="/timeline">Timeline</Link>
            </li>
            <li>
              <Link to="/parallax">parallax</Link>
            </li>
            <li>
              <Link to="/scrollio">Scrollio</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/parallax">
            <Parallax />
          </Route>

          <Route path="/timeline">
            <Timeline />
          </Route>
          <Route path="/scrollio">
            <Scrollio />
          </Route>

          <Route path="/">
            <Simple />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
