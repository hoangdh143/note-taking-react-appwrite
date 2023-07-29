import React, {useContext, useEffect, useState} from 'react';
import api from '../../api/api';
import {FetchState, useGetCategories} from '../../hooks';
import {Server} from '../../utils/config';
import Alert from '../Alert/Alert';
import {Permission, Role} from 'appwrite';
import CategoryCard from "./CategoryCard";
import SearchBar from "../NotesDetails/SearchBar";
import {Link} from "react-router-dom";


const Categories = ({user, dispatch}) => {
    const [stale, setStale] = useState({stale: false});
    const [{categories, isLoading, isError}] = useGetCategories(stale);
    const [categoryName, setCategoryName] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    const [searchedCategories, setSearchedCategories] = useState([]);
    const handleAddCategory = async (e) => {
        setIsAdding(true);
        e.preventDefault();
        const lines = categoryName.split("\n");
        // console.log('Adding Notes');
        const data = {
            name: lines[0],
            description: lines.length > 1 ? lines[1] : ""
        };
        try {
            await api.createDocument(Server.databaseID, Server.collectionCategoriesID, data, [
                Permission.read(Role.user(user['$id'])),
                Permission.write(Role.user(user['$id'])),
            ]);
            setStale({stale: true});
            setCategoryName('');
            setIsAdding(false);
        } catch (e) {
            console.error('Error in adding notes');
            console.log(e);
            setIsAdding(false);
        }
    };

    const loadMoreHandler = () => {
        setStale({stale: true, lastId: categories[categories.length - 1]['$id']});
    }

    const onSearchHandle = async (searchTerm) => {
        try {
            setIsSearchLoading(true);
            const data = await api.listDocumentsWithName(Server.databaseID, Server.collectionCategoriesID, searchTerm, [
                Permission.read(Role.user(user['$id'])),
                Permission.write(Role.user(user['$id'])),
            ]);
            setSearchedCategories(data.documents);
            setIsSearchLoading(false);
        } catch (e) {
            console.error('Error in getting notes');
        }
    }

    const categoryNameHandler = (e) => {
        setCategoryName(e.target.value);
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
            <section className="bg-gray-200 container h-screen max-h-screen px-3 max-w-xl mx-auto flex flex-row">
                {isError && <Alert color="red" message="Something went wrong..."/>}
                <div className="p-16 rounded-lg text-center">
                    {/* <div className="font-bold text-1xl md:text-2xl lg:text-3xl">
                        📝 <br/> &nbsp; Notes taking
                    </div> */}
                    <Link to={"/reminds"}>
                        <div className="font-bold text-1xl md:text-2xl lg:text-3xl">
                            📝 <br/> &nbsp; Notes taking
                        </div>
                    </Link>

                    <form onSubmit={handleAddCategory}>
                        <textarea className="w-full my-4 px-6 py-4" value={categoryName}
                               onChange={categoryNameHandler}/>
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
                    {searchedCategories.length > 0 && (
                        <ul>
                            {searchedCategories.map((item) => (
                                <CategoryCard key={item['$id']} item={item} setStale={setStale}/>
                            ))}
                        </ul>
                    )}
                    {searchedCategories.length === 0 && (
                        <ul>
                            {categories.map((item) => (
                                <CategoryCard key={item['$id']} item={item} setStale={setStale}/>
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
        </>
    );
};

export default Categories;
