import React, {useState, useEffect, useContext} from 'react';
import Card from './Card';
import SearchBar from './SearchBar';

import {FetchContext} from '../../context/Fetch';
import { Link } from 'react-router-dom';
import PagesTitle from '../PagesTitle';

function Cards(){
    const {wordsList} = useContext(FetchContext);
    const [cardItem, setCardItem] = useState({});

    useEffect(()=>{
      setCardItem(wordsList[0]);
    },[wordsList]);

    return(
        <div className="flex flex-col items-center">
          <div className='flex justify-end mx-auto w-[90%]'>
            <Link to='/create' className="text-sm md:text-lg text-secondary_color border-b border-secondary_color">Create new list</Link> 
          </div>
          <PagesTitle title='Study Cards'/>
          <div className='w-full lg:w-[80%] flex flex-col lg:flex-row justify-around items-center lg:items-start'>
              <SearchBar set_card_item={setCardItem}/>
              <Card title={cardItem?.title} list={cardItem?.list}/>
          </div>
        </div>
    )
}

export default Cards