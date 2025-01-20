import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const Preview = () => {
    const location = useLocation();
    const webContainer = location.state;
    console.log(webContainer);

    return (
        <div>
            <iframe src='https://k03e2io1v3fx9wvj0vr8qd5q58o56n-fkdo--5173--1b4252dd.local-corp.webcontainer-api.io'></iframe>
         </div>
    );
};


