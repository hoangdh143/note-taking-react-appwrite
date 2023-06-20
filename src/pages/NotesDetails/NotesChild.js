import { deleteButton } from '../icons';
import {cleanText, trimStr} from "../../utils/utils";
import {Link} from "react-router-dom";

const NotesChild = ({ item, deleteChild }) => {
    const handleDelete = async (e, item) => {
        // console.log('Deleting Notes');
        try {
            await deleteChild(item["$id"]);
        } catch (e) {
            console.error('Error in deleting notes');
        }
    };

    return (
        <li className="flex justify-between items-center mt-4 px-4">
            <div className="flex">
                <div
                    className={`capitalize ml-3 text-md font-medium`}
                    data-tooltip-id="notes-details-tooltip"
                    data-tooltip-content={cleanText(item['content'])}
                >
                    <Link to={"/notesDetails/" + item["$id"]} className="cursor-pointer">{trimStr(item['content'])}</Link>
                </div>
            </div>
            <button
                onClick={(e) => handleDelete(e, item)}
                className="focus:outline-none transition duration-75 ease-in-out transform hover:scale-125"
            >
                {deleteButton}
            </button>
        </li>
    );
};

export default NotesChild;
