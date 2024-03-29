import { createAsyncThunk, createSlice,createAction } from '@reduxjs/toolkit';
import axios from "axios";
import baseURL from '../utilities/baseURL';
import { updateBalance } from './userSlice';
import { updateDemoBalance } from './userSlice';
import { updateTrade } from './userSlice';

//actions for refreshing
export const resetTradeCreated = createAction("trading/reset")
export const resetDemoTradeCreated = createAction("demo/reset")

//trade action
export const tradeAction = createAsyncThunk("/tradingcreate", async (payload, { rejectWithValue, getState, dispatch })=>{
    //get user token from store
    const userToken = getState()?.user?.userAuth?.token;
    const config = {
        headers:{
            'Content-Type': 'application/json',
            Authorization : `Bearer ${userToken}`
        },
    };
    try {
        //http call
        const { data } = await axios.post(`${baseURL}/tradingcreate`, payload, config);
        dispatch(resetTradeCreated())
        dispatch(updateBalance(data?.balance));
        return data;
        
    } catch (error) {
        if(!error?.response){
            throw error;
        }
        return rejectWithValue(error?.response?.data)
    }
});
export const DemotradeAction = createAsyncThunk("/democreate", async (payload, { rejectWithValue, getState, dispatch })=>{
    //get user token from store
    const userToken = getState()?.user?.userAuth?.token;
    const config = {
        headers:{
            'Content-Type': 'application/json',
            Authorization : `Bearer ${userToken}`
        },
    };
    try {
        //http call
        const { data } = await axios.post(`${baseURL}/democreate`, payload, config);
        dispatch(resetDemoTradeCreated())
        dispatch(updateDemoBalance(data?.demoBalance));
        return data;
        
    } catch (error) {
        if(!error?.response){
            throw error;
        }
        return rejectWithValue(error?.response?.data)
    }
});


export const tradebalAction = createAsyncThunk("/trading", async (payload, { rejectWithValue, getState, dispatch })=>{
    //get user token from store
    const userToken = getState()?.user?.userAuth?.token;
    const config = {
        headers:{
            'Content-Type': 'application/json',
            Authorization : `Bearer ${userToken}`
        },
    };
    try {
        //http call
        const { data } = await axios.post(`${baseURL}/trading`, payload, config);
        dispatch(updateBalance(data?.balance));
        return data;
        
    } catch (error) {
        if(!error?.response){
            throw error;
        }
        return rejectWithValue(error?.response?.data)
    }
});
export const tradelostAction = createAsyncThunk("/tradelost", async (payload, { rejectWithValue, getState, dispatch })=>{
    //get user token from store
    const userToken = getState()?.user?.userAuth?.token;
    const config = {
        headers:{
            'Content-Type': 'application/json',
            Authorization : `Bearer ${userToken}`
        },
    };
    try {
        //http call
        const { data } = await axios.post(`${baseURL}/tradelost`, payload, config);
        return data;
        
    } catch (error) {
        if(!error?.response){
            throw error;
        }
        return rejectWithValue(error?.response?.data)
    }
});


export const demotradebalAction = createAsyncThunk("/demo", async (payload, { rejectWithValue, getState, dispatch })=>{
    //get user token from store
    const userToken = getState()?.user?.userAuth?.token;
    const config = {
        headers:{
            'Content-Type': 'application/json',
            Authorization : `Bearer ${userToken}`
        },
    };
    try {
        //http call
        const { data } = await axios.post(`${baseURL}/demo`, payload, config);
        dispatch(resetDemoTradeCreated())
        dispatch(updateDemoBalance(data?.demoBalance));
        return data;
        
    } catch (error) {
        if(!error?.response){
            throw error;
        }
        return rejectWithValue(error?.response?.data)
    }
});

const tradeSlice = createSlice({
    name: 'trading',
    initialState: {},
    extraReducers:(builder)=>{
        //create trade
        builder.addCase(tradeAction.pending,(state, action)=>{
            state.tradeloading = true;
        })
        //reset action
        builder.addCase(resetTradeCreated, (state, action)=>{
            state.isTradeCreated = true
        })
        builder.addCase(tradeAction.fulfilled,(state, action)=>{
            state.tradeloading = false;
            state.tradeCreated = action?.payload;
            state.appErr = action?.payload?.message;
            state.serverErr = action?.payload?.message; 
            state.isTradeCreated = false;

        // Update localStorage
        localStorage.setItem('userInfo', JSON.stringify({
            ...JSON.parse(localStorage.getItem('userInfo')),
            balance:action?.payload?.balance,
        }));
        })
        builder.addCase(tradeAction.rejected,(state, action)=>{
            state.tradeloading = false;
            state.appErr = action?.payload?.message;
            state.serverErr = action?.error?.message; 
            state.isTradeCreated = false
        })

        //demo trade
        builder.addCase(DemotradeAction.pending,(state, action)=>{
            state.loading = true;
        })
        //reset action
        builder.addCase(resetDemoTradeCreated, (state, action)=>{
            state.isDemoCreated = true
        })
        builder.addCase(DemotradeAction.fulfilled,(state, action)=>{
            state.loading = false;
            state.demoCreated = action?.payload;
            state.appErr = undefined;
            state.serverErr = undefined; 
            state.isDemoCreated = false

        // Update localStorage
        localStorage.setItem('userInfo', JSON.stringify({
            ...JSON.parse(localStorage.getItem('userInfo')),
            demoBalance:action?.payload?.demoBalance,
        }));
        })
        builder.addCase(DemotradeAction.rejected,(state, action)=>{
            state.loading = false;
            state.appErr = action?.payload?.msg;
            state.serverErr = action?.error?.msg; 
            state.isTradeCreated = false
        })


        //update bal
        builder.addCase(tradebalAction.pending,(state, action)=>{
            state.loading = true;
        })
        builder.addCase(tradebalAction.fulfilled,(state, action)=>{
            state.loading = false;
            state.balCreated = action?.payload;
            state.appErr = action?.payload?.message;
            state.serverErr = action?.payload?.message; 

        // Update localStorage
        localStorage.setItem('userInfo', JSON.stringify({
            ...JSON.parse(localStorage.getItem('userInfo')),
            balance:action?.payload?.balance,
        }));
        })
        builder.addCase(tradebalAction.rejected,(state, action)=>{
            state.loading = false;
            state.appErr = action?.payload?.msg;
            state.serverErr = action?.error?.msg; 
        })

        //update trade lost
        builder.addCase(tradelostAction.pending,(state, action)=>{
            state.loading = true;
        })
        builder.addCase(tradelostAction.fulfilled,(state, action)=>{
            state.loading = false;
            state.lostUpdated = action?.payload;
            state.appErr = action?.payload?.message;
            state.serverErr = action?.payload?.message; 
        })
        builder.addCase(tradelostAction.rejected,(state, action)=>{
            state.loading = false;
            state.appErr = action?.payload?.msg;
            state.serverErr = action?.error?.msg; 
        })

        //update demo bal
        builder.addCase(demotradebalAction.pending,(state, action)=>{
            state.loading = true;
        })
        builder.addCase(demotradebalAction.fulfilled,(state, action)=>{
            state.loading = false;
            state.balCreated = action?.payload;
            state.appErr = undefined;
            state.serverErr = undefined; 

        // Update localStorage
        localStorage.setItem('userInfo', JSON.stringify({
            ...JSON.parse(localStorage.getItem('userInfo')),
            demoBalance:action?.payload?.demoBalance,
        }));
        })
        builder.addCase(demotradebalAction.rejected,(state, action)=>{
            state.loading = false;
            state.appErr = action?.payload?.msg;
            state.serverErr = action?.error?.msg; 
        })
    }
});

export default tradeSlice.reducer