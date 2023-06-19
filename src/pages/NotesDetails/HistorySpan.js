import React from "react";
import {Link} from "react-router-dom";

export const HistorySpan = ({history}) => {
    return (
        <div className="py-2">
            <span>
                <Link to={"/notes"} className="text-blue-500">Main</Link>
                <span> / </span>
            </span>
            {history.map(item => {
                return (
                    <span key={"route-" + item.id}>
                        <Link to={"/notesDetails/" + item.id} className="text-blue-500">{item.name}</Link>
                        <span> / </span>
                    </span>
                );
        })}
        </div>
    );
};