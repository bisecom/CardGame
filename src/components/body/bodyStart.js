import  React from 'react';
import stl from './body.module.css';
import {DataDisplay} from "./dataDisplay";

export const BodyStart = (props) => {
    return (
            <div className={`col-sm-4 ${stl.dock}`}>
                <DataDisplay/>
                {props.cardsDeck}
                {props.thrumpCard}
            </div>
    );
}