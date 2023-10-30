// import { useRoutes } from "react-router-dom";
import Routes from "./Router";
import './App.css'
import { useEffect } from "react";
import { useDispatch, connect} from "react-redux";


function App({navBarSelection}) {
  const dispatch = useDispatch()

  useEffect(() => {
if(navBarSelection === 'logout') {
  
}
  },[])
  return (
    <>
      <main>
        <Routes />
      </main>
    </>
  );
}

const mapStateToProps = state => ({
  navBarSelection: state.navBarSelection,
});

export default connect(mapStateToProps)(App);
