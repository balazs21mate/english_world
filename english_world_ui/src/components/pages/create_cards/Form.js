import React, {useContext, useEffect, useState} from "react";

import {CreateListContext} from '../../context/CreateList';

function Confirm({text, func, visible, set_visible}) {
    const confirm = ()=>{
        func();
        set_visible(false);
    }

    return (
        <div className={`${visible?'flex':'hidden'} absolute left-10 bg-white flex-col w-[80%] border rounded p-2 border-secondary_color mx-auto`}>
            <p className="text-center text-secondary_color text-lg">{text}</p>
            <div className="flex justify-between">
                <button type="button" className="text-center max-w-[25rem] mt-6 mx-auto p-1 text-lg text-button border border-button rounded-lg outline-none mb-8 tracking-[0.3rem]" onClick={()=>set_visible(false)}>Cancel</button>
                <button type="button" className="text-center max-w-[25rem] mt-6 mx-auto p-1 text-lg bg-button text-white border-none rounded-lg outline-none mb-8 tracking-[0.3rem]" onClick={confirm}>Confirm</button>
            </div>
        </div>
    )
}

function Form() {

    const [title, setTitle] = useState('');
    const [english, setEnglish] = useState('');
    const [hungarian, setHungarian] = useState('');

    const [newWords, setNewWords] = useState([]);

    const [error, setError] = useState(false);
    const [errorColor, setErrorColor] = useState(false);
    const [errorText, setErrorText] = useState('');

    const [titles, setTitles] = useState([]);

    const [confirmText, setConfirmText] = useState('Biztos törli a listát?');
    const [visibleConfirm, setVisibleConfirm] = useState(false);

    const [handle, setHandle] = useState();

    
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

    const set_handle = (func, text) => {
        if (title.length > 0 && func === deleteListHandler) {
            setTitle('');
            setVisibleConfirm(true);
            setHandle(()=>func);
            setConfirmText(text);
        }else if(func === deleteAllListHandler){
            setTitle('');
            setVisibleConfirm(true);
            setHandle(()=>func);
            setConfirmText(text);
        }
    }

    const inputHandler = (setItem)=>(event) => {
        setItem(event.target.value);
    }

    const addNewWordsHandler = (props) =>{
        setEnglish('');
        setHungarian('');

        if (title.length > 0 && english.length > 0 && hungarian.length > 0) {
            if (createList.length > 0) {
                const filteredList = createList.filter(item => item.title === title)
                if (filteredList.length > 0) {
                    filteredList[0].list.push({english: english,hungarian: hungarian.split(',')})
                    setCreateList(list =>[...list]);
                    set_error(`Added new word to this list: ${title}!`, 2000, true);
                } else {
                    setNewWords(oldList => [...oldList, {english: english,hungarian: hungarian.split(',')}])
                }
            }   else {
                setNewWords(oldList => [...oldList, {english: english,hungarian: hungarian.split(',')}])
            }
        } else {
            set_error('Please, fill in all fields!', 2000, false);
        }
    }

    const addNewListHandler = () => {
        if (title.length > 0 && newWords.length > 0) {
            const Item = {
                id:createList.length + 1,
                list: [...newWords],
                title: title
            }
            setCreateList(list =>[...list, Item]);
            setTitles(list =>[...list, Item.title]);
            set_error(`Created this list: ${title}!`, 1000, true);
            setNewWords([]);
        } else {
            set_error('Please, fill in title field and add words that list!', 3000, false);
        }
    }

    const deleteListHandler = () => {
            if (title.length > 0) {
                if (createList.length > 0) {
                    if (titles.includes(title)) {
                        setCreateList(createList.filter(item => item.title !== title));
                        localStorage.setItem('Items', JSON.stringify(createList.filter(item => item.title !== title)));
                        setTitles(titles.filter(item => item !== title));
                        localStorage.setItem('Titles', JSON.stringify(titles.filter(item => item !== title)));
                        set_error(`Deleted this list: ${title}!`, 2000, true);
                    } else {
                        set_error('Title not exist!', 2000, false);
                    }
                }else {
                    set_error('Title not exist!', 2000, false);
                }
            }
    }

    const deleteAllListHandler = () => {
        setCreateList([]);
        localStorage.setItem('Items', JSON.stringify([]));
        setTitles([]);
        localStorage.setItem('Titles', JSON.stringify([]));
        set_error('Deleted all list!', 1000, true);
    }

    const deleteWordHandler = () => {
        if (title.length > 0 && english.length > 0) {
            const filteredList = createList.filter(item => item.title === title)
            if (filteredList.length > 0) {
                const filteredNewList = filteredList[0].list.filter(item => item.english !== english);
                const filteredEnglish = filteredList[0].list.filter(item => item.english === english);
                if (filteredEnglish.length > 0) {
                    filteredList[0].list = filteredNewList;
                    setCreateList(list =>[...list]);
                    setEnglish('');
                    setHungarian('');
                } else {
                    set_error(`This word: ${english} isn't in this list: ${title}`, 3000, false);
                }
            }else{
                set_error(`This list: ${title} not exist`, 2000, false);
            }
        }else{
            set_error('Please, fill in title and english fields!', 2000, false);
        }
    }

    const correctWordHandler = () => {
        if (title.length > 0 && english.length > 0 && hungarian.length > 0) {
            const filteredList = createList.filter(item => item.title === title)
            if (filteredList.length > 0) {
                const filteredEnglish = filteredList[0].list.filter(item => item.english === english);
                if (filteredEnglish.length > 0) {
                    filteredEnglish[0].hungarian = hungarian.split(',');
                    setCreateList(list =>[...list]);
                    setEnglish('');
                    setHungarian('');
                } else {
                    set_error(`This word: ${english} isn't in this list: ${title}`, 3000, false);
                }
            }
        }else{
            set_error('Please, fill in all fields!', 2000, false);
        }
    }

    return (
        <form className="flex flex-col relative md:w-[60%] mx-auto">
            <p className={`${error?'block':'hidden'} ${errorColor?'bg-green-600':'bg-red-600'} text-white rounded self-center px-1`}>{errorText}</p>
            <Confirm text={confirmText} func={handle} visible={visibleConfirm} set_visible={setVisibleConfirm}/>
            <label className="text-xl">Title:
                <input type='text' className="w-full  mt-2 border outline-none border-secondary_color rounded p-2" placeholder='Title...' onChange={inputHandler(setTitle)} value={title}/>
            </label>
            <div className='flex justify-around mt-2'>
                <button type="button" className='text-center mr-1 w-[50%] h-14 p-2 bg-button text-white border-none rounded-xl shadow-button outline-none tracking-[0.1rem]' onClick={()=>set_handle(deleteListHandler, `Are you sure you want delete this list: ${title}?`)}>Delete list</button>
                <button type="button" className='text-center ml-1 w-[50%] h-14 p-2 bg-button text-white border-none rounded-xl shadow-button outline-none tracking-[0.1rem]' onClick={()=>set_handle(deleteAllListHandler, 'Are you sure you want delete all list?')}>Delete all list</button>
            </div>
            <hr className='w-[80%] mt-10 mb-2 border-b-solid self-center border-secondary_color'></hr>
            <div className="flex flex-col xl:flex-row justify-between items-center">
                <div className="flex flex-col">
                    <label className="text-xl mt-1">English:
                        <input type='text' className="w-full outline-none mt-2 border border-secondary_color rounded p-2" placeholder="English..." onChange={inputHandler(setEnglish)} value={english}/>
                    </label>
                    <label className="text-xl mt-1">Hungarian:
                        <input type='text' className="w-full outline-none mt-2 border border-secondary_color rounded p-2" placeholder="Hungarian..." onChange={inputHandler(setHungarian)} value={hungarian}/>
                    </label>
                </div>
                <div className="flex xl:flex-col align-center">
                    <button type="button" className={`text-center w-25 h-14 ml-2 mt-2 p-2 bg-button text-white border-none rounded-xl shadow-button outline-none tracking-[0.1rem]`} onClick={addNewWordsHandler}>Add word</button>
                    <button type="button" className={`text-center w-25 h-14 ml-2 mt-2 p-2 bg-button text-white border-none rounded-xl shadow-button outline-none tracking-[0.1rem]`} onClick={correctWordHandler}>Correct word</button>
                    <button type="button" className={`text-center w-25 h-14 ml-2 mt-2 p-2 bg-button text-white border-none rounded-xl shadow-button outline-none tracking-[0.1rem]`} onClick={deleteWordHandler}>Delete word</button>
                </div>
            </div>
            <hr className='w-[80%] mt-6 border-b-solid self-center border-secondary_color'></hr>
            <button className="text-center max-w-[25rem] mt-6 mx-auto p-1 text-3xl bg-button text-white border-none rounded-xl shadow-button outline-none mb-8 tracking-[0.3rem]" onClick={addNewListHandler}>Create</button>
        </form>
    );
}

export default Form;