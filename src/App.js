import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navbars from './components/Navbar'
import Managecolor from './components/Managecolor';

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




            </Routes>
          </div>
        </div>


      </Router>
    </>
  );
}

export default App;
