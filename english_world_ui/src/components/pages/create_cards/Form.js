import React, {useContext, useEffect, useState} from "react";

import {CreateListContext} from '../../context/CreateList';

function Form() {
    const [title, setTitle] = useState('');
    const [english, setEnglish] = useState('');
    const [hungarian, setHungarian] = useState('');
    const {createList, setCreateList} = useContext(CreateListContext)

    useEffect(()=>{
        JSON.parse(localStorage.getItem('Items'))&&setCreateList(JSON.parse(localStorage.getItem('Items')));
    }, [setCreateList])

    useEffect(()=>{
        createList?.length !== 0&&localStorage.setItem('Items', JSON.stringify(createList));
    }, [createList])

    const handleInput = (setItem)=>(event) => {
        setItem(event.target.value);
    }

    const handleForm = () =>{
        if (createList.length > 0 && title.length > 0 && english.length > 0 && hungarian.length > 0) {
            const filteredList = createList.filter(item => item.title === title)
            if (filteredList.length > 0) {
                filteredList[0].list.push({english: english,hungarian: hungarian})
                setCreateList(list =>[...list]);
            } else {
                const Item = {
                    list: [{english: english,hungarian: hungarian}],
                    title: title
                }
                setCreateList(list =>[...list, Item]);
            }
        } else if (title.length > 0 && english.length > 0 && hungarian.length > 0){
            const Item = {
                list: [{english: english,hungarian: hungarian}],
                title: title
            }
            setCreateList(list =>[...list, Item]);
        }
    }

    return (
        <form className="flex flex-col md:w-[60%] mx-auto">
            <label className="text-xl">Title:
                <input type='text' className="w-full ml-2 mt-2 border border-secondary_color rounded p-2" placeholder="Text..." onChange={handleInput(setTitle)} value={title}/>
            </label>
            <label className="text-xl mt-1">English:
                <input type='text' className="w-full ml-2 mt-2 border border-secondary_color rounded p-2" placeholder="Text..." onChange={handleInput(setEnglish)} value={english}/>
            </label>
            <label className="text-xl mt-1">Hungarian:
                <input type='text' className="w-full ml-2 mt-2 border border-secondary_color rounded p-2" placeholder="Text..." onChange={handleInput(setHungarian)} value={hungarian}/>
            </label>
            <button type="submit" className="text-center max-w-[25rem] mt-6 mx-auto p-1 text-3xl bg-button text-white border-none rounded-xl shadow-button cursor-pointer outline-none mb-8 tracking-[0.3rem]" onClick={handleForm}>Send</button>
        </form>
    );
}

export default Form;