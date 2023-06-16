import api from '../../api/api';

const ChildItem = ({ item, onChecked }) => {
    const handleChecked = async (e, item) => {
        const checked = e.target.checked;
        onChecked(item['$id'], checked);
    };

    return (
        <li className="flex justify-between items-center mt-4 px-4">
            <div className="flex">
                <input
                    type="checkbox"
                    className="h-6 w-6 text-green-500 rounded-md border-4 border-green-200 focus:ring-0 transition duration-75 ease-in-out transform hover:scale-125"
                    checked={item['isChecked']}
                    onChange={(e) => handleChecked(e, item)}
                />
                <div
                    className="capitalize ml-3 text-md font-medium"
                >
                    {item['content']}
                </div>
            </div>
        </li>
    );
};

export default ChildItem;
