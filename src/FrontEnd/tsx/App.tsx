
import LogIn from './components/Authentication/LogIn'
import Confirmation from './components/Authentication/Confirmation';
import LogOut from './components/Authentication/LogOut';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Etudiant from './components/Etudiant/Etudiant';
import Admin from './components/Administrateur/Admin';
import Enseignant from './components/Enseignant/Enseignant';
import ProtectedPath from './Utilities/ProtectedPath';
import Room from './Room';
import Surveillance from './components/Enseignant/Surveillance/Surveillance';
import PassExam from './components/Etudiant/PassExam';


function App() {
  return (
    <div className="App">
        <BrowserRouter>
          <Routes>
              <Route  path='/login' element={<LogIn></LogIn>}></Route>
              <Route path='/activation' element={
                <ProtectedPath component={<Confirmation></Confirmation>}></ProtectedPath>
              }></Route>
              <Route path='/logout' element={<LogOut></LogOut>}></Route>
              <Route path='/admin' element={
                <ProtectedPath component={<Admin></Admin>} ></ProtectedPath>
              }></Route>
              <Route path='/etudiant' element={
                <ProtectedPath component={<Etudiant/>}></ProtectedPath>
              }></Route>
              <Route path='/enseignant/*' element={
                <ProtectedPath component={<Enseignant/>}></ProtectedPath>
              }></Route>
              <Route path='/surveillant' element={<ProtectedPath component={<Surveillance></Surveillance>}></ProtectedPath>}></Route>
              <Route path='/examroom' element={
                <ProtectedPath component={<PassExam></PassExam>}></ProtectedPath>
              }></Route>
              <Route path='/room' element={
                <ProtectedPath component={<Room/>}></ProtectedPath>
              }></Route>
          </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
