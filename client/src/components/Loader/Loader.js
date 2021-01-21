
import React from "react";

import LoadingSpinner from "../../icons/loading-spinner.gif";

const Loader = () => {

    return (
        <div className="loader">
            <img src={LoadingSpinner} alt="Loading Spinner" />
        </div>
    );
};

export default Loader;