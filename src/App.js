import About from './ components/About';
import Botton from './ components/Botton';
import Top from './ components/Top';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import Menu from './ components/Menu';

function App() {
  return (
    <Container className="App">
      <Top/>
      <Menu/>
      <Botton/>
    </Container>
  );
}

export default App;
