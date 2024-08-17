import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getList } from './userSlice.js';

const usePrevList = () => {
    const dispatch = useDispatch();

    const fetchLists = async () => {
        try {
            const response = await axios.get('task/getlist', {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const serializedData = response.data.data; // Assuming response.data.data is serializable
            dispatch(getList(serializedData));
        } catch (error) {
            console.error('Error fetching lists:', error.response?.data || error.message);
        }
    };

    useEffect(() => {
        fetchLists();
    }, []);

    return fetchLists;
};

export default usePrevList;
