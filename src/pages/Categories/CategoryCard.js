import api from '../../api/api';
import {Server} from '../../utils/config';
import {deleteButton} from '../icons';
import {Link} from "react-router-dom";

const CategoryCard = ({item, setStale}) => {
    const handleDelete = async (e, item) => {
        // console.log('Deleting Notes');
        try {
            await api.deleteDocument(
                Server.databaseID,
                Server.collectionCategoriesID,
                item['$id']
            );
            setStale({stale: true});
        } catch (e) {
            console.error('Error in deleting notes');
        }
    };

    return (
        <li className="flex justify-between items-center mt-4 px-4">
            <Link to={"/category/" + item["$id"]}>
                <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
                    <div className="md:flex">
                        <div className="p-8">
                            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                                {item["name"]}
                            </div>
                            <p className="mt-2 text-gray-500">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam at
                                ipsum eu nunc commodo posuere et sit amet ligula.
                            </p>
                        </div>
                        <button
                            onClick={(e) => handleDelete(e, item)}
                            className="focus:outline-none transition duration-75 ease-in-out transform hover:scale-125"
                        >
                            {deleteButton}
                        </button>
                    </div>
                </div>
            </Link>
        </li>
    );
};

export default CategoryCard;
