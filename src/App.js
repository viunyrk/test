import React, { Component } from 'react';
import { Provider } from 'react-redux'
import store from './store'
import Messenger from './components/Messenger'
import './styles/common.css';
import './styles/crm-styles.css';
import './styles/app.css';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <Messenger />
        </div>
      </Provider>
    );
  }
}

export default App;
