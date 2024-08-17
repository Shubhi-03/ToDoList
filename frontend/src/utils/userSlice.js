import { createSlice } from "@reduxjs/toolkit";


const UserSlice = createSlice({
    name : "user",
    initialState : {
        info:null,
        prevList:[]
    },
    reducers: {
        addUser: (state, action) => {
            state.info = action.payload;
        },
        removeUser: (state, action) => {
            state.info = null;
        },
        getList: (state, action) =>{
            state.prevList = action.payload;
        }

    },

})

export const  { addUser, removeUser, getList } = UserSlice.actions;
export default UserSlice.reducer;  