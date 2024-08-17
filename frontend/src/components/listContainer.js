import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import usePrevList from "../utils/usePrevList.js";

const ListContainer = ({list}) => {
    const [show, setShow] = useState(false);
    const [todo, setTodo] = useState('')
    const fetchLists = usePrevList();

    const toggleShow = () =>{
        setShow(!show);
    }
    
    const addTaskToList = async (e) => {
        e.preventDefault();
        const data = { todo };
      
        try {
          const response = await axios.post(`/task/${list._id}`, data, {
            withCredentials: true,
          });
      
          toast.success(response.data.message || 'Task added successfully');
        } catch (error) {
          console.error(error);
          toast.error(error.response?.data?.message || error.message);
        }
      }
    const updateTask = async (taskId, completed) => {
        try {
            const response = await axios.post(`task/update/${taskId}`, { completed }, {
                withCredentials: true,
            });
            toast.success(response.data.message);
            fetchLists()
        } catch (error) {
            console.log(error.message);
    
            // Check if error.response is defined before accessing its properties
            if (error.response && error.response.data) {
                toast.error(error.response.data.message);
            } else {
                toast.error("An error occurred while updating the task.");
            }
        }
    };

    const updateList = async(listId) => {
      try{
        const response = await axios.post(`/task/updateList/${listId}`, {}, {
          withCredentials: true
        })
        console.log(response.data);
        toast.success(response.data.message)
        fetchLists();
      }catch(error){
        console.log(error.message);
        toast.error(error.message)
      }
    }
    
    const deleteTask = async () => {
      try {
        const response = await axios.post(`/task/delete/${list._id}`, {}, { withCredentials: true });
        toast.success('Deleted Successfully.')
        console.log(response.data.message); 
        fetchLists(); 
      } catch (error) {
        console.error(error.message); // Handle error, maybe show a toast or notification
      }
    }

    return (
      <div className="max-w-sm mx-auto bg-white shadow-md rounded-lg p-6 mt-6">
        <div className="flex justify-between"><h2 className={`text-2xl font-bold mb-4 cursor-pointer ${list.completed ? 'line-through' : ''}`} onClick={toggleShow}>
          {list.title}
        </h2>
        <p className="font-semibold cursor-pointer" onClick={deleteTask} >Delete</p>
          </div>
        <div className="mb-4">
          <input
            type="text"
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
            className="border rounded w-full py-2 px-3 text-gray-700"
            placeholder="Add a new task"
          />
          <button
            onClick={(e)=>{addTaskToList(e);
            updateList(list._id);
            }}
            className="bg-gray-800 text-white px-4 py-2 mt-2 rounded-md hover:bg-gray-600"
          >
            Add Task
          </button>
        </div>
        {show && (
          <>
            {list.task.length === 0 ? (
              <p className="text-center text-md text-zinc-700 ">List is empty</p>
            ) : (
              <ul>
    {list.task.map((task) => (
        <li key={task._id} className="flex items-center">
            <span
                className={`flex-1 ${task.completed ? 'line-through' : ''}`}
                onClick={() => {updateTask(task._id, !task.completed); 
                  updateList(list._id);
                }}
            >
                {task.todo}
            </span>
        </li>
    ))}
</ul>
            )}
          </>
        )}
      </div>
    );
    // (
    //   <div className="max-w-sm mx-auto bg-white shadow-md rounded-lg p-6 mt-6">
    //     <h2 className="text-2xl font-bold mb-4 cursor-pointer " onClick={toggleShow}>{list.title}</h2>
    //     <div className="mb-4">
    //       <input
    //         type="text"
    //         value={title}
    //         onChange={(e) => setTitle(e.target.value)}
    //         className="border rounded w-full py-2 px-3 text-gray-700"
    //         placeholder="Add a new task"
    //       />
    //       <button
    //         onClick={addTaskToList}
    //         className=" text-white px-4 py-2  mt-2 bg-gray-800 rounded-md hover:bg-gray-600"
    //       >
    //         Add Task
    //       </button>
    //     </div>
    //     {show && <>{(list.task.length === 0)?(
    //         <p className="text-center text-md text-zinc-700">List is empty</p>
    //     ):(<ul>
    //         {list.task.map((task)=>
    //         <li>{task}{(task.completed)? "✔️":"❌"}</li>
              
          
    //         )}
    //     </ul>)}
    //     </>}
        
    //   </div>
    // );
    
    
}

export default ListContainer;