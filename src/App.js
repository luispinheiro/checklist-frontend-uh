import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Login from './components/Login';
import NavBar from './components/NavBar';
import CluhForm from './components/CluhForm';
import CluhListTable from './components/CluhListTable';
import { useAuth, AuthContext } from './hooks/useAuth';

const App = (props) => {
  const auth = useAuth();

    return (
      <AuthContext.Provider value={auth}>
      <BrowserRouter>
        <div className="App">
          { auth.credentials.token ? <NavBar /> : ""}
          <div className="container" style={{ marginTop: 20 }}>
            <Switch>
              <Route exact path="/login" component={Login} />
              <Route exact path="/form" component={CluhForm} />
              <Route exact path="/form/:id" component={CluhForm} />
              <Route path="/" component={CluhListTable} />
            </Switch>
          </div>
        </div>
      </BrowserRouter>
    </AuthContext.Provider>
  );

}

export default App;
