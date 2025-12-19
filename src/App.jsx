import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { SolanaWalletProvider } from './context/WalletContext';
import { TasksProvider } from './context/TasksContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import HowItWorks from './pages/HowItWorks';
import Playground from './pages/Playground';
import Marketplace from './pages/Marketplace';
import Robots from './pages/Robots';
import Docs from './pages/Docs';
import About from './pages/About';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <SolanaWalletProvider>
        <TasksProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/playground" element={<Playground />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/robots" element={<Robots />} />
                <Route path="/docs" element={<Docs />} />
                <Route path="/about" element={<About />} />
              </Routes>
            </Layout>
          </Router>
        </TasksProvider>
      </SolanaWalletProvider>
    </ThemeProvider>
  );
}

export default App;
