import React from 'react';

const DownloadButton = ({setPDF}) => {

    const download = async () => {
        const pdf = await fetch('http://localhost:9000/test');
        setPDF(pdf);
    }

    return (
        <div className="button">
            <button onClick={() => download()}>Download PDF</button>
        </div>
    );
}

export default DownloadButton;