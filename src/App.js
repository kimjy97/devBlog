import './App.scss';
import Header from './Component/Header/Header';
import Footer from './Component/Footer/Footer';
import Contents from './Component/Contents/Contents';

import { BrowserRouter as Router } from 'react-router-dom';

const App = () => {

  return (
    <div className='App'>
      <Router>
        <Header></Header>
        <Contents></Contents>
        <Footer></Footer>
      </Router>
    </div>
  );
}

export default App;
