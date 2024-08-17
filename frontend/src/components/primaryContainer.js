import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import usePrevList from "../utils/usePrevList.js";


const PrimaryContainer = () =>{
const [title, setTitle] = useState('');
const [inputVal, setInputVal] = useState('');
const [todoList, setTodoList] = useState([])     
const [list, setList] = useState('');
const [create, setCreate] = useState(false);
const toggleCreate = () => {
    setCreate(!create);
}
const fetchLists = usePrevList();
    const createList = async(e)=>{
        e.preventDefault();
        setTodoList([]);
        setList('')
        try {
            
            const response = await axios.post('task/list', { title }, {
                headers: {
                    'Content-Type': 'application/json',

                },
                withCredentials:true
            });
            setList(response?.data?.data);
            console.log(response?.data);
            toast.success("New list Created")
            fetchLists();
        } catch (error) {
            toast.error('Error:', error.message)
            console.error('Error:', error.message);
        }
    }
   
    
    const addTask = async (e) => {
        e.preventDefault();
        if (!list?._id) {
            console.log(list)
            toast.error('List ID is missing!');
            return;
        }
    
        try {
          const response = await axios.post(`/task/${list._id}`, { todo: inputVal }, {
            withCredentials: true,
          });
      
          console.log(response.data);
          setTodoList(prevList => [...prevList, inputVal])
          console.log(todoList);
          toast.success(response.data.message || 'Task added successfully');
          setInputVal('')
        } catch (error) {
          console.error(error);
          toast.error(error.response?.data?.message || error.message);
        }
      }
    return <>
    <div className="flex flex-col space-y-4 ">
        <div className="ml-20 my-5 ">
            <button className='text-md text-white font-semibold p-1 mx-3  bg-gray-800 rounded-md hover:bg-gray-600' onClick={toggleCreate} >
               Create List➕  
            </button>
           
            </div>
     {create && <form className='mx-auto' onSubmit={e => createList(e)}>
        <input
        type = "title"
        placeholder="Title"
        value = {title}
        onChange={e => setTitle(e.target.value)}
        className="p-1  text-gray-700 bg-gray-200 rounded-md"

        />
        <button className='text-md text-white font-semibold p-1 mx-3  bg-gray-800 rounded-md hover:bg-gray-600' type="submit">Create List</button>
    </form>}
    {list && <>
    <form  className='mx-auto' onSubmit={e=>addTask(e)}>
        <input
        type = "text"
        placeholder="Task"
        value = {inputVal}
        onChange={e => setInputVal(e.target.value)}
        className="p-1  text-gray-700 bg-gray-200 rounded-md"
        required
        />
        <button className='text-md text-white font-semibold p-1 mx-3  bg-gray-800 rounded-md hover:bg-gray-600' type="submit">➕</button>
        </form>
        
    </>
        }  
         {todoList && (
    <div className="mx-auto w-1/4">
        <ul >
            {todoList.map((todo, index) => (
                <li key={index} className="border p-1 my-1 text-gray-700 border-gray-500 rounded-md ">
                    {todo}
                </li>
            ))}
        </ul>
    </div>
)}
    </div>
    
    </>
}

export default PrimaryContainer;