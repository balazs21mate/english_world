import React, {useContext, useEffect, useState} from "react";

import {CreateListContext} from '../../context/CreateList';

function Form() {

    const [title, setTitle] = useState('');
    const [english, setEnglish] = useState('');
    const [hungarian, setHungarian] = useState('');
    const [error, setError] = useState(false);
    const [errorColor, setErrorColor] = useState(false);
    const [errorText, setErrorText] = useState('');
    const [titles, setTitles] = useState([]);

    
    const {createList, setCreateList} = useContext(CreateListContext);

    useEffect(()=>{
        JSON.parse(localStorage.getItem('Titles'))&&setTitles(JSON.parse(localStorage.getItem('Titles')));
    }, [setTitles])

    useEffect(()=>{
        createList.length > 0&&localStorage.setItem('Items', JSON.stringify(createList));
        titles.length > 0&&localStorage.setItem('Titles', JSON.stringify(titles));
    }, [createList, titles])

    const set_error = (text, sec, color) =>{
        setErrorText(text);
        setError(true);
        setErrorColor(color);
        setTimeout(() => {
            setError(false);
        }, sec);
    } 

    const handleInput = (setItem)=>(event) => {
        setItem(event.target.value);
    }

    const handleForm = () =>{
        setTitle('');
        setEnglish('');
        setHungarian('');

        if (title.length > 0 && english.length > 0 && hungarian.length > 0) {
            const Item = {
                id:createList.length + 1,
                list: [{id: 1,english: english,hungarian: hungarian}],
                title: title
            }
            setCreateList(list =>[...list, Item]);
            setTitles(list =>[...list, Item.title]);
            set_error(`Created this list: ${title}!`, 1000, true);
        } else {
            set_error('Please, fill in all fields!', 1000, false);
        }
    }

    const handleWords = () =>{
        setEnglish('');
        setHungarian('');

        if (title.length > 0 && english.length > 0 && hungarian.length > 0) {
            if (createList.length > 0) {
                const filteredList = createList.filter(item => item.title === title)
                if (filteredList.length > 0) {
                    filteredList[0].list.push({id: filteredList[0].list.length + 1,english: english,hungarian: hungarian})
                    setCreateList(list =>[...list]);
                    set_error(`Added new word to this list: ${title}!`, 2000, true);
                } else {
                    const Item = {
                        id:createList.length + 1,
                        list: [{id: 1,english: english,hungarian: hungarian}],
                        title: title
                    }
                    setCreateList(list =>[...list, Item]);
                    setTitles(list =>[...list, Item.title]);
                    set_error(`Created this list: ${title}!`, 1000, true);
                }
            }   else {
                const Item = {
                    id:createList.length + 1,
                    list: [{id: 1,english: english,hungarian: hungarian}],
                    title: title
                }
                setCreateList(list =>[...list, Item]);
                setTitles(list =>[...list, Item.title]);
                set_error(`Created this list: ${title}!`, 1000, true);
            }
        } else {
            set_error('Please, fill in all fields!', 1000, false);
        }
    }

    const handleDelete = (prop) => {
        setTitle('');
        setEnglish('');
        setHungarian('');
        if (prop === 'all') {
            setCreateList([]);
            setTitles([]);
            set_error('Deleted all list!', 1000, true);
        } else {
            if (title.length > 0) {
                if (createList.length > 0) {
                    if (titles.includes(title)) {
                        setCreateList(createList.filter(item => item.title !== title));
                        setTitles(titles.filter(item => item !== title));
                        set_error(`Deleted this list: ${title}!`, 2000, true);
                    } else {
                        set_error('Title not exist!', 2000, false);
                    }
                }else {
                    set_error('Title not exist!', 2000, false);
                }
            }
        }
    }

    return (
        <div className="flex flex-col md:w-[60%] mx-auto">
            <p className={`${error?'block':'hidden'} ${errorColor?'bg-green-600':'bg-red-600'} text-white rounded self-center px-1`}>{errorText}</p>
            <label className="text-xl">Title:
                <input type='text' className="w-full  mt-2 border outline-none border-secondary_color rounded p-2" placeholder='Title...' onChange={handleInput(setTitle)} value={title}/>
            </label>
            <div className='flex justify-around mt-2'>
                <button type="button" className='text-center mr-1 w-[50%] h-14 p-2 bg-button text-white border-none rounded-xl shadow-button outline-none' onClick={handleDelete}>Delete list</button>
                <button type="button" className='text-center ml-1 w-[50%] h-14 p-2 bg-button text-white border-none rounded-xl shadow-button outline-none' onClick={()=>handleDelete('all')}>Delete all list</button>
            </div>
            <hr className='w-[80%] mt-10 mb-2 border-b-solid self-center border-secondary_color'></hr>
            <div className="flex flex-col xl:flex-row justify-between items-center">
                <div className="flex flex-col">
                    <label className="text-xl mt-1">English:
                        <input type='text' className="w-full outline-none mt-2 border border-secondary_color rounded p-2" placeholder="English..." onChange={handleInput(setEnglish)} value={english}/>
                    </label>
                    <label className="text-xl mt-1">Hungarian:
                        <input type='text' className="w-full outline-none mt-2 border border-secondary_color rounded p-2" placeholder="Hungarian..." onChange={handleInput(setHungarian)} value={hungarian}/>
                    </label>
                </div>
                <button type="button" className={`text-center w-25 h-14 ml-2 mt-2 p-2 bg-button text-white border-none rounded-xl shadow-button outline-none`} onClick={handleWords}>Add new word</button>
            </div>
            <hr className='w-[80%] mt-6 border-b-solid self-center border-secondary_color'></hr>
            <button type="button" className="text-center max-w-[25rem] mt-6 mx-auto p-1 text-3xl bg-button text-white border-none rounded-xl shadow-button outline-none mb-8 tracking-[0.3rem]" onClick={handleForm}>Create</button>
        </div>
    );
}

export default Form;