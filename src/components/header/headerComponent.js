import  React from 'react';
import stl from './header.module.css';
export const Header = () => {
    return (
        <div className={`row h-150 ${stl.myHeader}`}>
            <div className={`col-sm-12`}>
                <h1><span className={`badge badge-warning ${stl.myBadge}`}>Underthrowable Fool</span></h1>

            </div>

        </div>
    );
}

