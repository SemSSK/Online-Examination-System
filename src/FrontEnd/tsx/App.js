"use strict";
exports.__esModule = true;
var LogIn_1 = require("./components/Authentication/LogIn");
var Confirmation_1 = require("./components/Authentication/Confirmation");
var LogOut_1 = require("./components/Authentication/LogOut");
var react_router_dom_1 = require("react-router-dom");
var Etudiant_1 = require("./components/Etudiant/Etudiant");
var Admin_1 = require("./components/Administrateur/Admin");
var Enseignant_1 = require("./components/Enseignant/Enseignant");
var ProtectedPath_1 = require("./Utilities/ProtectedPath");
var Room_1 = require("./Room");
var Surveillance_1 = require("./components/Enseignant/Surveillance/Surveillance");
var PassExam_1 = require("./components/Etudiant/PassExam");
function App() {
    return (<div className="App">
        <react_router_dom_1.BrowserRouter>
          <react_router_dom_1.Routes>
              <react_router_dom_1.Route path='/login' element={<LogIn_1["default"]></LogIn_1["default"]>}></react_router_dom_1.Route>
              <react_router_dom_1.Route path='/activation' element={<ProtectedPath_1["default"] component={<Confirmation_1["default"]></Confirmation_1["default"]>}></ProtectedPath_1["default"]>}></react_router_dom_1.Route>
              <react_router_dom_1.Route path='/logout' element={<LogOut_1["default"]></LogOut_1["default"]>}></react_router_dom_1.Route>
              <react_router_dom_1.Route path='/admin' element={<ProtectedPath_1["default"] component={<Admin_1["default"]></Admin_1["default"]>}></ProtectedPath_1["default"]>}></react_router_dom_1.Route>
              <react_router_dom_1.Route path='/etudiant' element={<ProtectedPath_1["default"] component={<Etudiant_1["default"] />}></ProtectedPath_1["default"]>}></react_router_dom_1.Route>
              <react_router_dom_1.Route path='/enseignant/*' element={<ProtectedPath_1["default"] component={<Enseignant_1["default"] />}></ProtectedPath_1["default"]>}></react_router_dom_1.Route>
              <react_router_dom_1.Route path='/surveillant' element={<ProtectedPath_1["default"] component={<Surveillance_1["default"]></Surveillance_1["default"]>}></ProtectedPath_1["default"]>}></react_router_dom_1.Route>
              <react_router_dom_1.Route path='/examroom' element={<ProtectedPath_1["default"] component={<PassExam_1["default"]></PassExam_1["default"]>}></ProtectedPath_1["default"]>}></react_router_dom_1.Route>
              <react_router_dom_1.Route path='/room' element={<ProtectedPath_1["default"] component={<Room_1["default"] />}></ProtectedPath_1["default"]>}></react_router_dom_1.Route>
          </react_router_dom_1.Routes>
        </react_router_dom_1.BrowserRouter>
    </div>);
}
exports["default"] = App;
