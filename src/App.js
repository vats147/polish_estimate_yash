import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navbars from './components/Navbar'
import Managecolor from './components/Managecolor';
import Login from './components/Login';
import Adduser from './components/Adduser';
import { Auths } from './components/Auths';
import Reqauth from './components/Reqauth';
import Chekemail from './components/Chekemail';
import Verifyotp from './components/Verifyotp';
import { useEffect, useState } from "react";
import Forget from './components/Forget';
function App() {
  console.log("app");

  const [isLoggedIn, setIsLoggedIn] = useState();
  const [chekadmin, setchekadmin] = useState();


  function handleClick() {
    console.log("handellogin");

    const role = localStorage.getItem('role');
    if (role === 'emp' && localStorage.getItem('roled') === 'A00') {
      setIsLoggedIn(role);
    }
    else if (role === 'Admin' && localStorage.getItem('roled') === 'A10') {

      setchekadmin('yesthis');
      setIsLoggedIn(role);
    }


  }

  function handellogout() {
    setIsLoggedIn(false);
  }

  useEffect(() => {
    console.log("app effect");
    const checkUserData = () => {
      console.log("checkdata");
      const role = localStorage.getItem('role');
      console.log("role", role);

      if (role === 'emp' && localStorage.getItem('roled') === 'A00') {
        setIsLoggedIn(role);
      }
      else if (role === 'Admin' && localStorage.getItem('roled') === 'A10') {
  
        setchekadmin('yesthis');
        setIsLoggedIn(role);
      }
    };

    checkUserData();
    window.addEventListener("storage", checkUserData);
    return () => {
      window.removeEventListener("storage", checkUserData);
    };
  }, []);


  return (
    <>
    <Auths>
      <Router>


      {isLoggedIn ? (<><div className="page-wrapper" id="main-wrapper" data-layout="vertical" data-navbarbg="skin6" data-sidebartype="full"
            data-sidebar-position="fixed" data-header-position="fixed">
            <Navbars handellogout={handellogout} />
            <div className="body-wrapper">
              <Routes>

                {chekadmin === 'yesthis' ? (<Route path='/adduser' element={<Adduser/>} />) : (<></>)}
                
              <Route path='/managecolor' element={<Managecolor/>}></Route>
              

              </Routes>
            </div>
          </div></>) : (

            <><Routes><Route path='/login' element={<Login onClickHandler={handleClick} />}  ></Route>
              
              <Route path='/email' element={<Chekemail />}  ></Route>
              <Route path='/otp' element={<Verifyotp />}  ></Route>
              <Route path='/forget' element={<Forget />}  ></Route>
            </Routes></>

          )}























        {/* <div className="page-wrapper" id="main-wrapper" data-layout="vertical" data-navbarbg="skin6" data-sidebartype="full"
          data-sidebar-position="fixed" data-header-position="fixed">
          <Navbars />

          <div className="body-wrapper">
            <Routes>



              <Route path='/managecolor' element={<Managecolor/>}></Route>
              <Route path='/adduser' element={<Adduser/>}></Route>



            </Routes>
          </div>
        </div> */}

      </Router>
      </Auths>
    </>
  );
}

export default App;
