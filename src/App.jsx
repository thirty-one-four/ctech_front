import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ChatInterface from './components/ChatInterface';
import IDE from './components/IDE';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="chat" element={<ChatInterface />} />
          <Route path="ide" element={<IDE />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
