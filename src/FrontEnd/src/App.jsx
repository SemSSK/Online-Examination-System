import LogIn from './components/Authentication/LogIn';
import Confirmation from './components/Authentication/Confirmation';
import LogOut from './components/Authentication/LogOut';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Etudiant from './components/Etudiant/Etudiant';
import Enseignant from './components/Enseignant/Enseignant';
import ProtectedPath from './Utilities/ProtectedPath';
import Surveillance from './components/Enseignant/Surveillance/Surveillance';
import PassExam from './components/Etudiant/SessionExamen/PassExam';
import Administrateur from './components/Administrateur/Administrateur';
 
function App() {
    return (<div className="App">
        <BrowserRouter>
          <Routes>
              <Route path='/login' element={<LogIn/>}></Route>
              <Route path='/activation' element={<ProtectedPath component={<Confirmation/>}></ProtectedPath>}></Route>
              <Route path='/logout' element={<LogOut/>}></Route>
              <Route path='/admin/*' element={<ProtectedPath role="ADMIN" component={<Administrateur/>}></ProtectedPath>}></Route>
              <Route path='/etudiant/*' element={<ProtectedPath role="ETUDIANT" component={<Etudiant />}></ProtectedPath>}></Route>
              <Route path='/enseignant/*' element={<ProtectedPath role="ENSEIGNANT" component={<Enseignant />}></ProtectedPath>}></Route>
              <Route path='/surveillant' element={<ProtectedPath role="ENSEIGNANT" component={<Surveillance/>}></ProtectedPath>}></Route>
              <Route path='/examroom' element={<ProtectedPath role="ETUDIANT" component={<PassExam/>}></ProtectedPath>}></Route>
          </Routes>
        </BrowserRouter>
    </div>);
}
export default App;
