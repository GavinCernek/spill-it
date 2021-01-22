
// Written by: Gavin Cernek, 1/21/2021

import React from "react";

import "./TextArea.css";

const TextArea = props => {     // TextArea component

    return (
        <div className="textarea">
            <div className="label-container">
                <label>{props.label}</label>
            </div>
            <div className="textarea-box">
                <textarea
                    type={props.type}
                    id={props.id}
                    value={props.value}
                    onChange={props.onChange}
                    placeholder={props.placeholder}
                    cols={props.cols}
                    rows={props.rows}
                    required
                />
            </div>
        </div>
    );
};

export default TextArea;