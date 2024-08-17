import { useDispatch, useSelector } from "react-redux"
import logoimage from "../utils/logo.png"
import { removeUser } from "../utils/userSlice";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const user = useSelector((store) => store?.user?.info);;
    const handleSignOut = async() =>{
        try{
          const data = await axios.post('users/logout',{},
            {
                headers: {
                    'Content-Type': 'application/json',

                },
                withCredentials:true
            }
      )
          if(data.ApiError){
              toast.error(data.ApiError.message)
          }else{
              
              toast.success(' Logged out.')
              
              navigate('/login')
              dispatch(removeUser());
          }
      }catch(error){
          console.log(error);
      }
    }
    return <>
    <div class="flex  justify-between w-2/3  mx-auto ">
    <div class=" h-45 px-3 py-2 z-10">
        <img class="w-25 h-45" src={logoimage} alt="logo"/>
    </div>
    <div className="flex items-center pr-2" >
        <ul className="flex space-x-5 text-lg font-medium">
            <li>About</li>
            <li>Home</li>
            <li>Services</li>
            {Cookies && <li onClick={handleSignOut} className="cursor-pointer">Sign Out</li>}

        </ul>
    </div>
</div>

    </>
}

export default Header;