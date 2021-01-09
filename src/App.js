import './App.css';
import QuoteGenerator from './components/quotes'
import {createMuiTheme} from '@material-ui/core/styles'

const font =  "'Quicksand', sans-serif";
const theme = createMuiTheme({
  typography: {
    fontFamily: font,
  }
});

function App() {
  return (
    <QuoteGenerator></QuoteGenerator>
  );
}

export default App;
