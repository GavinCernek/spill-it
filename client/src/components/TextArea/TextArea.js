
import React from "react";

import "./TextArea.css";

const TextArea = props => {

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