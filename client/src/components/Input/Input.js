
import React from "react";

import "./Input.css";

const Input = props => {

    return (
        <div className="input">
            <div className="label-container">
                <label>{props.label}</label>
            </div>
            <div className="input-box">
                <input
                    type={props.type}
                    id={props.id}
                    value={props.value}
                    onChange={props.onChange}
                    size={props.size}
                    required
                />
            </div>
        </div>
    );
};

export default Input;