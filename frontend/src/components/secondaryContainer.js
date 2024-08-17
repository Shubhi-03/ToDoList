
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import usePrevList from '../utils/usePrevList';
import { useSelector } from 'react-redux';
import ListContainer from './listContainer';

const SecondaryContainer = () => {
    usePrevList();
    const lists = useSelector((store)=>store.user.prevList);
   
    if (!lists) {
        return <div>Loading...</div>;
    }
    return (
        <div className='flex flex-col space-y-6'>
            <h1 className='mx-auto text-2xl font-bold text-zinc-700 border-b border-gray-600'>Your Lists</h1>
            {lists.length === 0 ? (
                <p className='mx-auto text-lg text'>No lists found</p>
            ) : (
                <div className='flex flex-wrap justify-center w-full'>
                    {lists?.map((list) => (
                        <div key={list._id}>
                            <ListContainer list = {list}/>
                           
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SecondaryContainer;
