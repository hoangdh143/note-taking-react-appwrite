import {useEffect, useState} from 'react';
import api from '../../api/api';
import {useGetChildren, useGetOneNotes} from '../../hooks';
import { Server } from '../../utils/config';
import Alert from '../Alert/Alert';
import { Permission, Role } from 'appwrite';
import {useParams} from "react-router-dom";
import NotesChild from "./NotesChild";
import AddChild from "./AddChild";

const NotesDetails = ({ user, dispatch }) => {
    const { notesDetailsId } = useParams();

    const [staleOne, setStaleOne] = useState({ stale: false, childrenIds: [] });
    const [{ oneNotes, isLoading, isError }] = useGetOneNotes(staleOne, notesDetailsId);
    const [staleChildren, setStaleChildren] = useState({ stale: false });
    const [{ children, isLoading: isChildrenLoading, isError: isChildrenError }] = useGetChildren(staleChildren);
    const [currentNotesContent, setCurrentNotesContent] = useState('');
    const [shouldReloadChildren, setShouldReloadChildren] = useState({reload: false});

    useEffect(() => {
        setCurrentNotesContent(oneNotes.content);
        if ("children" in oneNotes && oneNotes["children"].length > 0) {
            setStaleChildren({stale: true, childrenIds: oneNotes.children});
        }
    }, [oneNotes, shouldReloadChildren]);

    const handleEditNotes = async (e) => {
        e.preventDefault();
        const data = {
            content: currentNotesContent,
        };
        try {
            await api.updateDocument(Server.databaseID, Server.collectionNotesID, oneNotes['$id'], data, [
                Permission.read(Role.user(user['$id'])),
                Permission.write(Role.user(user['$id'])),
            ]);
            setStaleOne({ stale: true });
        } catch (e) {
            console.error('Error in editing notes');
        }
    };

    const deleteChild = async (id) => {
        const newChildren = oneNotes.children.filter(item => item !== id);
        const data = {
            children: newChildren
        };
        try {
            await api.updateDocument(Server.databaseID, Server.collectionNotesID, oneNotes['$id'], data, [
                Permission.read(Role.user(user['$id'])),
                Permission.write(Role.user(user['$id'])),
            ]);
            setStaleChildren({ stale: true, childrenIds: newChildren });
        } catch (e) {
            console.error('Error in deleting child');
        }
    }

    return (
        <>
            <section className="container h-screen max-h-screen px-3 max-w-xl mx-auto flex flex-col">
                {isError && <Alert color="red" message="Something went wrong..." />}
                <div className="p-16 rounded-lg text-center">
                    <div className="font-bold text-1xl md:text-2xl lg:text-3xl">
                        📝 <br /> &nbsp; Notes taking system
                    </div>

                    <form onSubmit={handleEditNotes}>
                        <textarea
                            // type="text"
                            className="w-full my-4 px-6 py-4 text-xl rounded-lg border-0 focus:ring-2 focus:ring-gray-800 transition duration-200 ease-in-out transform hover:-translate-y-1 hover:scale-110 hover:shadow-xl shadow-md"
                            placeholder="🤔   What to do today?"
                            value={currentNotesContent}
                            onChange={(e) => setCurrentNotesContent(e.target.value)}
                        ></textarea>
                        <button
                            className="w-full px-6 py-2 text-xl rounded-lg border-0 focus:ring-2 focus:ring-gray-800 transition duration-200 ease-in-out transform hover:-translate-y-1 hover:scale-110 hover:shadow-xl shadow-md bg-green-600 hover:bg-teal-700 text-white"
                            type="submit"
                        >
                            Update
                        </button>
                    </form>

                    {isLoading && <h1> Loading .... </h1>}
                    <AddChild user={user} oneNotes={oneNotes} setShouldReloadChildren={setShouldReloadChildren}/>
                    {isChildrenLoading && <h1>Loading children ...</h1>}
                    <ul>
                        {children.map((item) => (
                            <NotesChild key={item['$id']} item={item} deleteChild={deleteChild} />
                        ))}
                    </ul>
                </div>
            </section>
        </>
    );
};

export default NotesDetails;
