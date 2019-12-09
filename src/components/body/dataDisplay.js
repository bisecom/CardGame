import  React from 'react';
import stl from './body.module.css';

export const DataDisplay = (props) => {
    return (
        <div className={`${stl.display}`}>
           I will show you true!
        </div>
    );
}