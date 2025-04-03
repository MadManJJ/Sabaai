import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../../interfaces";
import { Shop } from "../../../interfaces";

type userState = {
    user: User[]
}

const initialState:userState = { user: [] };

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        addUser: (state, action:PayloadAction<User>) => {
            state.user.push(action.payload);
        },
        removeUser: (state, action:PayloadAction<string>) => {
            const remainUser = state.user.filter(obj => {
                return (obj._id !== action.payload);
                })
            state.user = remainUser;
        },
        banUser: (state, action:PayloadAction<string>) => {
            const id = action.payload;
            state.user.forEach((user) => {
                if(user._id == id){
                    user.isBan = true
                    return;
                }
            })
        },
        unbanUser: (state, action:PayloadAction<string>) => {
            const id = action.payload;
            state.user.forEach((user) => {
                if(user._id == id){
                    user.isBan = false;
                    return;
                }
            })
        },
        updateUser: (state, action:PayloadAction<{ id: string; shop: Shop; date: string }>) => {
            const newUser = action.payload;
            for (let i = 0; i < state.user.length; i++) {
                if (state.user[i]._id === newUser.id) {
                    // to do
                    break;
                }
            }
        },
        fetchUsers: (state, action:PayloadAction<User[]>) => {
            state.user = action.payload;
        }
    }
});

export const { addUser, removeUser, updateUser, fetchUsers, banUser, unbanUser } = userSlice.actions
export default userSlice.reducer