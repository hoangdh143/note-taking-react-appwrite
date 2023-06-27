import React from "react";
import {Link} from "react-router-dom";

export const HistorySpan = ({history}) => {
    return (
        <div className="py-2">
            {history.map(item => {
                if (item.hasOwnProperty("url")) {
                    return (
                        <span key={"route-main"}>
                                <Link to={item.url} className="text-blue-500">{item.name}</Link>
                                <span> / </span>
                            </span>
                    );
                } else {
                    return (<span key={"route-" + item.id}>
                        <Link to={"/notesDetails/" + item.id} className="text-blue-500">{item.name}</Link>
                        <span> / </span>
                    </span>)
                }
            })}
        </div>
    );
};