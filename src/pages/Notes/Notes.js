import React, {useContext, useEffect, useState} from 'react';
import api from '../../api/api';
import {FetchState, useGetNotes} from '../../hooks';
import {Server} from '../../utils/config';
import Alert from '../Alert/Alert';
import {Permission, Role} from 'appwrite';
import NotesItem from "./NotesItem";
import ReactQuill from "react-quill";
import SearchBar from "../NotesDetails/SearchBar";
import {RoutesContext} from "../../App";

const Notes = ({user, dispatch}) => {
    const [stale, setStale] = useState({stale: false});
    const [{notes, isLoading, isError}] = useGetNotes(stale);
    const [currentNotes, setCurrentNotes] = useState('');
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    const [searchedNotes, setSearchedNotes] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const {setRoutes} = useContext(RoutesContext);

    useEffect(() => {
        setRoutes([]);
    }, [])

    const handleAddNotes = async (e) => {
        setIsAdding(true);
        e.preventDefault();
        // console.log('Adding Notes');
        const data = {
            content: currentNotes,
            children: [],
            tags: []
        };
        // console.log(data, user);
        try {
            await api.createDocument(Server.databaseID, Server.collectionNotesID, data, [
                Permission.read(Role.user(user['$id'])),
                Permission.write(Role.user(user['$id'])),
            ]);
            setStale({stale: true});
            setCurrentNotes('');
            setIsAdding(false);
        } catch (e) {
            console.error('Error in adding notes');
            console.log(e);
            setIsAdding(false);
        }
    };

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

    const handleLogout = async (e) => {
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
                    <div className="font-bold text-1xl md:text-2xl lg:text-3xl">
                        📝 <br/> &nbsp; Notes taking system
                    </div>

                    <form onSubmit={handleAddNotes}>
                        <ReactQuill className="w-full my-4 px-6 py-4" theme="snow" value={currentNotes}
                                    onChange={setCurrentNotes}/>
                        <button
                            className="w-full px-6 py-2 text-xl rounded-lg border-0 focus:ring-2 focus:ring-gray-800 transition duration-200 ease-in-out transform hover:-translate-y-1 hover:scale-110 hover:shadow-xl shadow-md bg-green-600 hover:bg-teal-700 text-white"
                            type="submit"
                        >
                            {isAdding ? "Adding ..." : "Add New"}
                        </button>
                    </form>

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
                                <NotesItem key={item['$id']} item={item} setStale={setStale}/>
                            ))}
                        </ul>
                    )}
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
        </>
    );
};

export default Notes;
