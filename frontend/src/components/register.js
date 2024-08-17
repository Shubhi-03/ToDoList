import {  useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./header";
import background from "../utils/checkListBG.jpeg"
import axios from 'axios';
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const Register = () =>{
    const navigate = useNavigate();
    const dispatch = useDispatch();
     const [ data, setData ] = useState({
        fullName: '',
        username: '',
        email: '', 
        password: ''
    })
    const handleSubmit = async(e) =>{
        e.preventDefault();
        const {fullName, username, email, password} = data
        try{
            const data = await axios.post('http://localhost:3000/api/v1/users/register',{
                fullName, username, email, password
            })
            console.log(data);
            if(data.ApiError){
                toast.error(data.ApiError.message)
            }else{
                setData({})
                toast.success('Registered successfully. Welcome!!')
                
                navigate('/login')
                dispatch(addUser(data));
            }
        }catch(error){
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
        <form className=" p-3 flex flex-col space-y-6 " onClick={handleSubmit}>
            <h1 className="text-4xl font-bold py-4">Register</h1>
            
            <input
                type="text"
                placeholder="Full Name"
                value = {data?.fullName}
                onChange={(e) => setData({...data, fullName: e.target.value})}
                className="p-2 my-4 w-1/2 bg-gray-100"
                />
            <input
            type="text"
            placeholder="UserName"
            value = {data?.username}
                onChange={(e) => setData({...data, username: e.target.value})}
             className="p-2 my-4 w-1/2 bg-gray-100"

                />  
                
            
            <input
            type = "email"
            placeholder="Email"
            value = {data?.email}
                onChange={(e) => setData({...data, email: e.target.value})}
            className="p-2 my-4 w-1/2 bg-gray-100"

            />
            <input
            type = "password"
            placeholder="Password"
            value = {data?.password}
                onChange={(e) => setData({...data, password: e.target.value})}
            className="p-2 my-4 w-1/2 bg-gray-100"

            />
        
        <button  className = "text-xl text-white font-bold p-2 my-4 w-1/2 bg-gray-800 rounded-md hover:bg-gray-600" >Register</button>
        
        </form>
        <Link to ="/Login"><p className="cursor-pointer">
           Already registered? Login In Now.
        </p>
        </Link>
    </div>
           </div>
        </div>
    )
}

export default Register;