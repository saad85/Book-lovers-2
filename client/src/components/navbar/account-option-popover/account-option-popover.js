import React, {useState, useContext} from 'react';
import './account-option-popover.css';
import { FilterContext } from '../../../context-helper/context-helper';
import cookies from 'js-cookie';

export default function AccountOptionPopover(props){

    // const { setPopoverOpen }= props;

    const options=["Settings"],
    { loginModal, popover, userId } = useContext(FilterContext),
    { setShowLoginModal } = loginModal,
    { setShowPopover } = popover;

    function optionClicked(value,option){

        if(option=== "Log out") {
            cookies.remove("token");
            window.location.reload()
        } else {

            setShowLoginModal(value);
            setShowPopover(false);
        }
    }

    if(userId) options.push("Log out");
    else options.push("Log in");

    // console.log(" setShowLoginModal funct",optionClicked(true))
   // console.log("setPopoverOpen",setPopoverOpen);

    return(
        <div>

            {options.map((option,index)=> {
                return <div key={index } className="acc-option-popover" onClick={e=>optionClicked(true,option)}> { option} </div>
            })}

            
        </div>
    )
}