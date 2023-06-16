import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import Login from "./pages/Login/Login";
import Landing from "./pages/Landing/Landing";
import { useGetUser } from "./hooks";
import Notes from "./pages/Notes/Notes";
import NotesDetails from "./pages/NotesDetails/NotesDetails";

function App() {
  // eslint-disable-next-line
  const [{ user, isLoading, isError }, dispatch] = useGetUser();

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/notes">
          {user ? <Notes user={user} dispatch={dispatch} /> : <Redirect to="/login" />}
        </Route>
        <Route path="/notesDetails/:notesDetailsId">
          <NotesDetails user={user} dispatch={dispatch} />
          {/*{user ? <NotesDetails user={user} dispatch={dispatch} /> : <Redirect to="/login" />}*/}
        </Route>
        <Route path="/login">
          {user ? <Redirect to="/notes" /> : <Login dispatch={dispatch}/>}
        </Route>
        <Route exact path="/">
          <Landing />
        </Route>
        <Redirect to="/" />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
