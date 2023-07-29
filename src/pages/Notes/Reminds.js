import React, {useState} from 'react';
import api from '../../api/api';
import {FetchState, useGetRemindNotes} from '../../hooks';
import {Server} from '../../utils/config';
import Alert from '../Alert/Alert';
import {Permission, Role} from 'appwrite';
import NotesItem from "./NotesItem";
import SearchBar from "../NotesDetails/SearchBar";
import {Tooltip} from 'react-tooltip'
import {Link, useParams} from "react-router-dom";
import { getThreeDaysLater } from '../../utils/utils';

const getNewRemind = (item) => {
    const remindCounted = item["remindCounted"];
    const remindDate = getThreeDaysLater();
    return {
        remindDate,
        remindCounted: remindCounted + 1,
    }
}

const Reminds = ({user, dispatch}) => {
    const [stale, setStale] = useState({stale: false});
    const [{notes, isLoading, isError}] = useGetRemindNotes(stale);
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    const [searchedNotes, setSearchedNotes] = useState([]);
    const [isAdding, setIsAdding] = useState(false);

    const handleDone = async (e, item) => {
        setIsAdding(true);
        e.preventDefault();
        const data = {
            remindDate: "",
        };
        try {
            await api.updateDocument(Server.databaseID, Server.collectionNotesID, item['$id'], data, [
                Permission.read(Role.user(user['$id'])),
                Permission.write(Role.user(user['$id'])),
            ]);
            setStale({ stale: true });
            setIsAdding(false);
        } catch (error) {
            console.error('Error in editing notes');
            setIsAdding(false);
        }
    };

    const handleAgain = async (e, item) => {
        setIsAdding(true);
        e.preventDefault();
        const { remindDate, remindCounted } = getNewRemind(item);
        const data = {
            remindDate: remindDate,
            remindCounted: remindCounted,
        };
        try {
            await api.updateDocument(Server.databaseID, Server.collectionNotesID, item['$id'], data, [
                Permission.read(Role.user(user['$id'])),
                Permission.write(Role.user(user['$id'])),
            ]);
            setStale({ stale: true });
            setIsAdding(false);
        } catch (error) {
            console.error('Error in editing notes');
            setIsAdding(false);
        }
    };

    const loadMoreHandler = () => {
        setStale({stale: true, lastId: notes[notes.length - 1]['$id']});
    }

    const onSearchHandle = async (searchTerm) => {
        try {
            setIsSearchLoading(true);
            const data = await api.listDocumentsWithContent(Server.databaseID, Server.collectionNotesID, searchTerm, [
                Permission.read(Role.user(user['$id'])),
                Permission.write(Role.user(user['$id'])),
            ]);
            setSearchedNotes(data.documents);
            setIsSearchLoading(false);
        } catch (e) {
            console.error('Error in getting notes');
        }
    }

    const handleLogout = async () => {
        dispatch({type: FetchState.FETCH_INIT});
        try {
            await api.deleteCurrentSession();
            dispatch({type: FetchState.FETCH_SUCCESS, payload: null});
        } catch (e) {
            dispatch({type: FetchState.FETCH_FAILURE});
        }
    };

    return (
        <>
            <section className="bg-gray-200 container h-screen max-h-screen px-3 max-w-xl mx-auto flex flex-col">
                {isError && <Alert color="red" message="Something went wrong..."/>}
                <div className="p-16 rounded-lg text-center">
                    <Link to={"/categories"}>
                        <div className="font-bold text-1xl md:text-2xl lg:text-3xl">
                            📝 <br/> &nbsp; Reminds
                        </div>
                    </Link>

                    {isLoading && <h1> Loading .... </h1>}
                    <SearchBar onSearch={onSearchHandle}/>

                    {isSearchLoading && <h1>Searching ...</h1>}
                    {searchedNotes.length > 0 && (
                        <ul>
                            {searchedNotes.map((item) => (
                                <NotesItem key={item['$id']} item={item} setStale={setStale}/>
                            ))}
                        </ul>
                    )}
                    {searchedNotes.length === 0 && (
                        <ul>
                            {notes.map((item) => (
                                <div className='py-2 px-2 border border-gray-400 border-solid'>
                                    <NotesItem key={item['$id']} item={item} setStale={setStale}/>
                                    <div className='flex flex-col flex-grow mx-auto justify-center p-6 text-center'>
                                        <button className='bg-white text-red-500 font-bold my-2 py-2 px-4 rounded-lg' onClick={(e) => handleDone(e, item)}> {isAdding ? "Loading..." : "Done"}</button>
                                        <button className='bg-white text-green-500 font-bold my-2 py-2 px-4 rounded-lg' onClick={(e) => handleAgain(e, item)}>{isAdding ? "Loading..." : "Again"}</button>
                                    </div>
                                </div>
                            ))}
                        </ul>
                    )}
                    <button
                        className="w-full my-4 px-6 py-2 text-xl rounded-lg border-2 focus:ring-2 focus:ring-gray-800 transition duration-200 ease-in-out transform hover:-translate-y-1 hover:scale-110 hover:shadow-xl shadow-md border-green-600 hover:bg-teal-700 text-gray-900"
                        onClick={loadMoreHandler}
                    >
                        {isLoading ? "Loading ..." : "Load More"}
                    </button>
                </div>
            </section>

            <section className="absolute bottom-0 right-0 py-3 px-6 mr-8 mb-8">
                <button
                    onClick={handleLogout}
                    className="mx-auto mt-4 py-3 px-12 font-semibold text-md rounded-lg shadow-md bg-white text-gray-900 border border-gray-900 hover:border-transparent hover:text-white hover:bg-gray-900 focus:outline-none"
                >
                    Logout 👋
                </button>
            </section>
            <Tooltip id="notes-tooltip" className="max-w-lg"/>
        </>
    );
};

export default Reminds;
