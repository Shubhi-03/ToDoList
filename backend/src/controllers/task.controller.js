import { List } from "../models/list.model.js";
import { Task } from "../models/task.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import  jwt  from "jsonwebtoken";

const createList = asyncHandler( async(req, res) =>{
    const {title} = req.body;
    const payload = jwt.verify(req.cookies.accessToken, process.env.ACCESS_TOKEN_SECRET);

    const userId = payload._id;
    if(!title) {
        throw new ApiError(400, "Title is required")
    }
    
    const existedList = await List.findOne({ title });
    if(existedList){
        throw new ApiError(400, "List with this name already exists")
    }
    const list = await List.create({
        title,
        completed:false,
        createdBy:userId,
        task:[],
        
        })
    if(!list){
        throw new ApiError(400, "Something went wrong while creating List")
    }
    
    return res.status(201).json(
        new ApiResponse(201, list, "List created Successfully")
    )

})
const addTask = asyncHandler( async(req, res) => {
    const {listId} = req.params;
    const userId = req.cookies.accessToken;
    const {todo} = req.body;
    const list = await List.findById(listId)
    if(!list){
        throw new ApiError(400, "List is not found")
    }
    if(!todo) {
        throw new ApiError(400, "Task is required")
    }
    const task = await Task.create({
        todo,
        CreatedBy:userId,
        completed:false
        })
        list.task.push(task._id);
        await list.save();
    return res
    .status(201)
    .json(new ApiResponse(201, task, 'Task added to list successfully'));


})
const getList = asyncHandler(async (req, res) => {
    try {
       

        // Verify the JWT token
        const token = req.cookies.accessToken;
        if (!token) {
            return res.status(401).json(new ApiResponse(401, null, 'Access token is missing'));
        }

        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (!payload || !payload._id) {
            return res.status(401).json(new ApiResponse(401, null, 'Invalid token'));
        }

        const userId = payload._id;

        // Fetch the lists created by the user and populate tasks
        const lists = await List.find({ createdBy: userId }).populate('task');

        // Check if lists are found
        if (!lists.length) {
            return res.status(200).json(new ApiResponse(200, [], 'No lists found for this user'));
        }

        // Send the response with the retrieved lists
        res.status(200).json(new ApiResponse(200, lists, 'Lists retrieved successfully'));
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json(new ApiResponse(500, null, 'An error occurred while retrieving lists'));
    }
});
const updateTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params; // Correctly extract taskId
    const { completed } = req.body; // Correctly extract completed status

    try {
       
        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { completed },
            { new: true, runValidators: true }
        );

        if (updatedTask) {
            return res
                .status(200)
                .json(new ApiResponse(200, updatedTask, "Task updated successfully."));
        } else {
            return res
                .status(404)
                .json(new ApiError(404, "Task not found."));
        }
    } catch (error) {
        // Check if the error is due to an invalid ObjectId
        if (error.kind === 'ObjectId') {
            return res
                .status(400)
                .json(new ApiError(400, "Invalid Task ID format."));
        }
        // For other errors, return a generic server error
        return res
            .status(500)
            .json(new ApiError(500, "An error occurred while updating the task."));
    }
});
const updateList = asyncHandler(async (req, res) => {
    const { listId } = req.params; // Correctly extract listId

    try {
        // Find the list by its ID
        const list = await List.findById(listId);

        if (!list) {
            return res.status(404).json(new ApiError(404, "List not found"));
        }

        // Check if there are any tasks in the list that are not completed
        const incompleteTask = list.task.find(task => !task.completed);

        if (!incompleteTask) {
            // If all tasks are completed, update the list to mark it as completed
            const updatedList = await List.findByIdAndUpdate(
                listId,
                { completed: true }, // Mark the list as completed
                { new: true, runValidators: true }
            );

            return res.status(200).json(new ApiResponse(200, updatedList, "List updated successfully"));
        } else {
            // If not all tasks are completed
            return res.status(200).json(new ApiResponse(200, list, "Not all tasks are completed"));
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json(new ApiResponse(500, {}, "An error occurred"));
    }
});
const deleteTask = asyncHandler(async (req, res) =>{
    const {listId} = req.params;

    const list = await List.findById(listId);

    if(!list){
        return res
        .status(400)
        .json(new ApiError(400, "List doesn't exist."))
    }

    await List.findByIdAndDelete(listId);

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "List successfully deleted."))
})
export {createList, 
   addTask,
   getList,
   updateTask,
   updateList,
   deleteTask
}