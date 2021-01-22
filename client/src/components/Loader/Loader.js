
// Written by: Gavin Cernek, 1/21/2021 

import React from "react";

import LoadingSpinner from "../../icons/loading-spinner.gif";

const Loader = () => {      // Loader component

    return (
        <div className="loader">
            <img src={LoadingSpinner} alt="Loading Spinner" />
        </div>
    );
};

export default Loader;