import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router-dom";
import Login from "./Login";
import Register from "./register";
import Home from "./home";

const Body = () =>{
        const appRouter = createBrowserRouter([
          {
            path: "/",
            element: <Register/>,
          },
          {
            path: "/login",
            element: <Login/>
          },{
            path:"/home",
            element: <Home/>
          },
          
        ]);
return <>
<div>
    <RouterProvider router = {appRouter}/>
</div>
</>
}

export default Body;