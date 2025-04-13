import React from "react";

const Spinner = () => {
    return (
        <div className="flex justify-center items-center my-8">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
    );
};

export default Spinner;
