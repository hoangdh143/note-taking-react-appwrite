import React, {useEffect, useState} from 'react';
import SearchBar from "./SearchBar";
import ChildItem from "./ChildItem";
import api from "../../api/api";
import {Server} from "../../utils/config";
import {Permission, Role} from "appwrite";

const AddChild = ({user, setShouldReloadChildren, addChild, oneNotes}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [notes, setNotes] = useState([]);
    const [isAdding, setIsAdding] = useState(false);

    const openModal = () => {
        setIsOpen(true);
        getTop5RecentNotes();
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    const getTop5RecentNotes = async () => {
        try {
            setIsLoading(true);
            const data = await api.listTop5RecentDocuments(Server.databaseID, Server.collectionNotesID, [
                Permission.read(Role.user(user['$id'])),
                Permission.write(Role.user(user['$id'])),
            ]);
            setNotes(data.documents.map(item => ({...item, isChecked: false})));
            setIsLoading(false);
        } catch (e) {
            console.error('Error in getting notes');
            console.log(e);
        }
    }

    const onSearchHandle = async (searchTerm) => {
        try {
            setIsLoading(true);
            const data = await api.listDocumentsWithContent(Server.databaseID, Server.collectionNotesID, searchTerm, [
                Permission.read(Role.user(user['$id'])),
                Permission.write(Role.user(user['$id'])),
            ]);
            setNotes(data.documents.map(item => ({...item, isChecked: false})));
            setIsLoading(false);
        } catch (e) {
            console.error('Error in getting notes');
        }
    }

    const onCheckedHandle = (id, checked) => {
        const newNotes = notes.map(item => {
            if (item["$id"] === id && item.isChecked !== checked) {
                return {...item, isChecked: checked}
            } else {
                return item;
            }
        });
        setNotes(newNotes);
    }

    const addChildHandler = async (e) => {
        e.preventDefault();
        setIsAdding(true);
        const addedChildrenIds = notes.filter(item => item.isChecked).map(item => item["$id"]);
        try {
            await addChild(addedChildrenIds);
            setIsAdding(false);
            setIsOpen(false)
        } catch (e) {
            console.error('Error in adding children');
            setIsAdding(false);
        }
    }

    return (
        <div>
            <button
                className="w-full my-4 px-6 py-2 text-xl rounded-lg border-0 focus:ring-2 focus:ring-gray-800 transition duration-200 ease-in-out transform hover:-translate-y-1 hover:scale-110 hover:shadow-xl shadow-md bg-green-600 hover:bg-teal-700 text-white"
                onClick={openModal}
            >
                Add Child
            </button>

            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white w-96 rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-bold mb-4">Add Child</h2>
                        <SearchBar onSearch={onSearchHandle}/>
                        {isLoading ? "Loading..." : ""}
                        <ul>
                            {notes.map((item) => (
                                <ChildItem key={item['$id']} item={item} onChecked={onCheckedHandle}/>
                            ))}
                        </ul>
                        <div className="flex justify-end">
                            <button
                                className="px-4 py-2 mx-2 bg-gray-300 rounded-lg text-white font-bold hover:bg-gray-500"
                                onClick={closeModal}
                            >
                                Close
                            </button>
                            <button
                                className="px-4 py-2 mx-2 rounded-lg border-0 focus:ring-2 focus:ring-gray-800 transition duration-200 ease-in-out transform hover:-translate-y-1 hover:scale-110 hover:shadow-xl shadow-md bg-green-600 hover:bg-teal-700 text-white"
                                onClick={addChildHandler}
                            >
                                {isAdding ? "Adding..." : "Add"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddChild;
