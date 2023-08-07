import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import Login from "./pages/Login/Login";
import Landing from "./pages/Landing/Landing";
import {useGetUser} from "./hooks";
import Notes from "./pages/Notes/Notes";
import NotesDetails from "./pages/NotesDetails/NotesDetails";
import {createContext, useState} from 'react';
import Categories from "./pages/Categories/Categories";
import Reminds from "./pages/Notes/Reminds";

export const RoutesContext = createContext();

function App() {
    // eslint-disable-next-line
    const [{user, isLoading, isError}, dispatch] = useGetUser();
    const [routes, setRoutes] = useState([]);

    return (
        <BrowserRouter>
            <RoutesContext.Provider value={{routes, setRoutes}}>
                <Switch>
                    <Route path="/category/:categoryId">
                        {user ? <Notes user={user} dispatch={dispatch}/> : <Redirect to="/login"/>}
                    </Route>
                    <Route path="/categories">
                        {user ? <Categories user={user} dispatch={dispatch}/> : <Redirect to="/login"/>}
                    </Route>
                    <Route path="/reminds">
                        {user ? <Reminds user={user} dispatch={dispatch}/> : <Redirect to="/login"/>}
                    </Route>
                    <Route path="/notesDetails/:notesDetailsId">
                        <NotesDetails user={user} dispatch={dispatch}/>
                        {/*{user ? <NotesDetails user={user} dispatch={dispatch} /> : <Redirect to="/login" />}*/}
                    </Route>
                    <Route path="/login">
                        {user ? <Redirect to="/categories"/> : <Login dispatch={dispatch}/>}
                    </Route>
                    <Route exact path="/">
                        <Redirect to="/categories"/>
                    </Route>
                    <Redirect to="/"/>
                </Switch>
            </RoutesContext.Provider>
        </BrowserRouter>
    );
}

export default App;
