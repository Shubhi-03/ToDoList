import Header from "./header";
import background from "../utils/checkListBG.jpeg"
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import toast from "react-hot-toast";
import { addUser } from "../utils/userSlice";
import { useDispatch, useSelector } from "react-redux";

const Login = () => {
    const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store) => store?.user?.info);
  const [ data, setData ] = useState({
    email: "",
    password:""
  })
  const [error, setError] = useState("");

    const handleSubmit = async(e) =>{
      e.preventDefault();
      const { email, password} = data
     
      try{
        const response = await axios.post('users/login',{
            email, password
        },
        {
            withCredentials:true
        }
    )
        console.log(response);
        if (response.data.ApiError) {
            toast.error(response.data.Error.message || 'Something went wrong with the login.');
        }else{
            setData({})
            dispatch(addUser(response));
            toast.success(' Welcome Back!!')
            
            navigate('/home')
            
        }
    }catch(error){
       
            toast.error(error.message)
        console.log(error);
    }
    }
    return (
        <div>
           <Header/> 
           <div className="flex  justify-between ">
           <div className="w-1/2 top-1/4">
    <img  className="relative w-2/3 top-20 left-1/3"
    src={background} alt="background" />
</div>
    <div className="flex flex-col space-y-3 absolute right-0 top-1/2 transform -translate-y-1/2 w-1/2">
        <form className=" p-3 flex flex-col space-y-6 ">
            <h1 className="text-4xl font-bold py-4">Login</h1>
            
            <input
            type = "email"
            placeholder="Email"
            value = {data.email}
            onChange={(e) => setData({...data, email: e.target.value})}
            className="p-2 my-4 w-1/2 bg-gray-100"

            />
            <input
            type = "password"
            placeholder="Password"
            value = {data.password}
            onChange={(e) => setData({...data, password: e.target.value})}
            className="p-2 my-4 w-1/2 bg-gray-100"

            />
        
        <button  className = "text-xl text-white font-bold p-2 my-4 w-1/2 bg-gray-800 rounded-md hover:bg-gray-600" onClick={handleSubmit}>Login</button>
        <Link to = "/"><p className="cursor-pointer" >
          
            New? Register Now
            
        </p></Link>
        </form>
    </div>
           </div>
        </div>
    )
}

export default Login;