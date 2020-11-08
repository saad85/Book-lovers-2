import React, { useState, useEffect } from "react";
import { GET_REVIEW } from "../../gql-helper/queries";
import { useQuery } from "@apollo/client";
import "./right-panel.css";

export default function RightPanel(props) {
  const { setShowRightPanel, selectedReviewId } = props;

  const [query, setQuery]  =useState({})

  const { loading, data, refetch } = useQuery(GET_REVIEW, {
    variables: { query: query },
  });

  console.log("data in right panel",data);
  
  function openNav() {
    document.getElementById("mySidepanel").style.width = "40%";
    document.getElementById("container").style.opacity = "0.5";
  }

  function closeNav() {
    document.getElementById("mySidepanel").style.width = "0";
    document.body.style.opacity = "1";

    if (setShowRightPanel) {
      setTimeout(() => setShowRightPanel(false), 400);
    }
  }

  useEffect(() => {
    document.getElementById("mySidepanel").style.width = "40%";
    document.getElementById("mySidepanel").style.display = "block";

    if(selectedReviewId) setQuery({_id:selectedReviewId});

    return () => {};
  }, [selectedReviewId]);

  return (
    <>
      <div id="mySidepanel" className="sidepanel">
        <a className="closebtn" onClick={(e) => closeNav()}>
          ×
        </a>
        <a href="#">Implementation on right panel are pending.. </a>
        {/* <a href="#">Services</a>
        <a href="#">Clients</a>
        <a href="#">Contact</a> */}
      </div>
    </>
  );
}
