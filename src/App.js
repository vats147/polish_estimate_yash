import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navbars from './components/Navbar'
import Managecolor from './components/Managecolor';
import Login from './components/Login';
import Adduser from './components/Adduser';

function App() {
  return (
    <>
      <Router>
        <div className="page-wrapper" id="main-wrapper" data-layout="vertical" data-navbarbg="skin6" data-sidebartype="full"
          data-sidebar-position="fixed" data-header-position="fixed">
          <Navbars />

          <div className="body-wrapper">
            <Routes>



              <Route path='/managecolor' element={<Managecolor/>}></Route>
              <Route path='/adduser' element={<Adduser/>}></Route>



            </Routes>
          </div>
        </div>

      </Router>
    </>
  );
}

export default App;
