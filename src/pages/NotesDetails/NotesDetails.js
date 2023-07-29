import React, {useContext, useEffect, useState} from 'react';
import api from '../../api/api';
import {useGetChildren, useGetOneNotes} from '../../hooks';
import { Server } from '../../utils/config';
import Alert from '../Alert/Alert';
import { Permission, Role } from 'appwrite';
import {Link, useParams} from "react-router-dom";
import NotesChild from "./NotesChild";
import AddChild from "./AddChild";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {RoutesContext} from "../../App";
import {trimStr} from "../../utils/utils";
import {HistorySpan} from "./HistorySpan";
import {Tooltip} from "react-tooltip";

const NotesDetails = ({ user, dispatch }) => {
    const { notesDetailsId } = useParams();

    const [staleOne, setStaleOne] = useState({ stale: false, id: notesDetailsId });
    const [{ oneNotes, isLoading, isError }] = useGetOneNotes(staleOne);
    const [staleChildren, setStaleChildren] = useState({ stale: false, childrenIds: [] });
    const [{ children, isLoading: isChildrenLoading, isError: isChildrenError }] = useGetChildren(staleChildren);
    const [currentNotesContent, setCurrentNotesContent] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const {routes, setRoutes} = useContext(RoutesContext);

    useEffect(() => {
        setCurrentNotesContent(oneNotes.content);
        setStaleChildren({stale: true, childrenIds: oneNotes.children});
        const routesIndex = routes.findIndex(item => item.id === notesDetailsId);
        if (oneNotes.content && routesIndex < 0) {
            setRoutes([...routes, {name: trimStr(oneNotes.content, 10), id: notesDetailsId}]);
        } else if (oneNotes.content && routesIndex >= 0) {
            setRoutes(routes.slice(0, routesIndex + 1));
        }
    }, [oneNotes]);

    useEffect(() => {
        setStaleOne({stale: true, id: notesDetailsId});
    }, [notesDetailsId]);

    const handleEditNotes = async (e) => {
        setIsUpdating(true);
        e.preventDefault();
        const data = {
            content: currentNotesContent,
        };
        try {
            await api.updateDocument(Server.databaseID, Server.collectionNotesID, oneNotes['$id'], data, [
                Permission.read(Role.user(user['$id'])),
                Permission.write(Role.user(user['$id'])),
            ]);
            setStaleOne({ stale: true, id: notesDetailsId });
            setIsUpdating(false);
        } catch (e) {
            console.error('Error in editing notes');
            setIsUpdating(false);
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
            setStaleOne({stale: true, id: notesDetailsId})
        } catch (e) {
            console.error('Error in deleting child');
        }
    }

    const addChild = async (addedIds) => {
        const idArr = [...oneNotes.children, ...addedIds];
        const data = {
            children: [...new Set(idArr)],
        };
        try {
            await api.updateDocument(Server.databaseID, Server.collectionNotesID, oneNotes['$id'], data, [
                Permission.read(Role.user(user['$id'])),
                Permission.write(Role.user(user['$id'])),
            ]);
            setStaleOne({stale: true, id: notesDetailsId});
        } catch (e) {
            console.error('Error in updating document');
        }
    }

    return (
        <>
            <section className="bg-gray-200 container h-screen max-h-screen px-3 max-w-xl mx-auto flex flex-col">
                {isError && <Alert color="red" message="Something went wrong..." />}
                <div className="p-16 rounded-lg text-center">
                    <Link to={"/categories"}>
                    <div className="font-bold text-1xl md:text-2xl lg:text-3xl">
                        📝 <br /> &nbsp; Notes taking
                    </div>
                    </Link>
                    <HistorySpan history={routes}/>

                    <form onSubmit={handleEditNotes}>
                        <ReactQuill className="w-full my-4 px-6 py-4" theme="snow" value={currentNotesContent} onChange={setCurrentNotesContent} />
                        <button
                            className="w-full px-6 py-2 text-xl rounded-lg border-0 focus:ring-2 focus:ring-gray-800 transition duration-200 ease-in-out transform hover:-translate-y-1 hover:scale-110 hover:shadow-xl shadow-md bg-green-600 hover:bg-teal-700 text-white"
                            type="submit"
                        >
                            {isUpdating ? "Updating ..." : "Update"}
                        </button>
                    </form>

                    {isLoading && <h1> Loading .... </h1>}
                    <AddChild user={user} oneNotes={oneNotes} addChild={addChild}/>
                    {isChildrenLoading && <h1>Loading children ...</h1>}
                    <ul>
                        {children.map((item) => (
                            <NotesChild key={item['$id']} item={item} deleteChild={deleteChild} />
                        ))}
                    </ul>
                </div>
            </section>
            <Tooltip id="notes-details-tooltip" className="max-w-lg"/>
        </>
    );
};

export default NotesDetails;
