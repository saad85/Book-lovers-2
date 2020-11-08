import BookList from './book-list';
import React from 'react';
import './index.css';


export default function(props){

    const {searchedText} =props;

    return (
        <>
            
                <div className="">
                    <BookList searchedText={searchedText}/>
                </div>
                {/* <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 right-section">
                    <BookDetails/>
                </div> */}
            
            

        </>
    );
}

