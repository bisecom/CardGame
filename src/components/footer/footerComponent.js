import  React from 'react';
import stl from "./footer.module.css";
import {FooterPlayer} from "./footerPlayer";
import {FooterPc} from "./footerPc";

export const FooterComp = (props) => {
    return (
        <div className={`row ${stl.footerDiv}`}>
            <FooterPlayer playerCards={props.playerCards} onClick={props.playerClick} imgData={props.imgData}/>
            <FooterPc pcCards={props.pcCards} imgData={props.imgData}/>
        </div>
    );
}