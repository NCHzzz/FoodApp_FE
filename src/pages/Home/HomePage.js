import React, {useEffect, useReducer } from 'react';
import { getAll, getAllByTag, getAllTags } from '../../services/foodService';
import { search } from '../../services/foodService';
import Tags from '../../Components/Tags/Tags';
import Thumbnails from '../../Components/Thumbnails/Thumbnails';
import { useParams } from 'react-router-dom';
import NotFound from '../../Components/NotFound/NotFound';

const initialSate = { foods: [], tags: []};
const reducer = (state, action) => {
    switch (action.type){
        case 'FOODS_LOADED':
            return{...state, foods: action.payload };
        case 'TAGS_LOADED':
            return{...state, tags: action.payload };
        default:
            return state;
    };
}
export default function HomePage() {
    const [state, dispatch] = useReducer(reducer, initialSate);
    const { foods, tags } = state;
    const { searchTerm, tag } = useParams();

    useEffect(()=>{
            getAllTags().then(tags => dispatch({ type: 'TAGS_LOADED', payload: tags }));

            const loadFoods =
            tag? getAllByTag(tag)
            : searchTerm? 
            search(searchTerm) 
            : getAll();
    
            loadFoods.then(foods => dispatch({type: 'FOODS_LOADED', payload: foods}))
        
        
    }, [searchTerm, tag]);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://sf-cdn.coze.com/obj/unpkg-va/flow-platform/chat-app-sdk/0.1.0-beta.2/libs/oversea/index.js';
        script.async = true;
        script.onload = () => {
            if (window.CozeWebSDK) {
                new window.CozeWebSDK.WebChatClient({
                    config: {
                        bot_id: '7371775103573180432',
                    },
                    componentProps: {
                        title: 'FoodAI',
                    },
                });
            }
        };
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);


    return <>
        <Tags tags={tags}/>
        {foods.length ===0 && <NotFound linkText="Reset Search"/>}
        <Thumbnails foods={foods}/>
    </>;
}