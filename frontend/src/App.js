
import { Provider } from "react-redux";

import appStore from "./utils/appStore";
import Body from "./components/body";
import axios from "axios";
import {Toaster} from 'react-hot-toast';
axios.defaults.baseURL = 'http://localhost:3000/api/v1/';
// axios.defaults.withCredentials = true
function App() {
  return (
      <Provider store = {appStore}>
        <Toaster position="bottom-right" toastOptions={{duration:2000}}/>
           <Body/>
   
      </Provider>
    
  );
}




export default App;