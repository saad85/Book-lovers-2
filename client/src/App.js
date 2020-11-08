import React, { useState, useEffect, useMemo } from "react";
import "./App.css";
import BookSection from "./components/books-section/index";
import Navbar from "./components/navbar/navbar";
import SearchSection from "./components/search-section/search-section";
import { FilterContext } from "./context-helper/context-helper";
import SignInForm from "./components/sign-up/sign-in-form";
import cookies from "js-cookie";
import jwt from "jsonwebtoken";

function App() {
  
  const [searchedText, setSearchedText] = useState(""),
    [rootGenre, setRootGenreFilter] = useState(""),
    [rootAuthorFilter, setRootAuthorFilter] = useState(""),
    [showPopover, setShowPopover] = useState(""),
    [addReviewBtnClicked, setAddReviewBtnClicked] = useState(false), //if add review btn is clicked and user not logged, show login modal, then add review modal
    [showAddReviewModal, setShowAddReviewModal] = useState(false),
    [showLoginModal, setShowLoginModal] = useState("");

  let token = cookies.get("token"),
    decoded = jwt.decode(token),
    {userId, email} = decoded || {};

  const updateSearchText = (text) => {
    setSearchedText(text);
  };

  const authorFilter = useMemo(
      () => ({ rootAuthorFilter, setRootAuthorFilter }),
      [rootAuthorFilter, setRootAuthorFilter]
    ),
    popover = useMemo(() => ({ showPopover, setShowPopover }), [
      showPopover,
      setShowPopover,
    ]),
    loginModal = useMemo(() => ({ showLoginModal, setShowLoginModal }), [
      showLoginModal,
      setShowLoginModal,
    ]),
    addReviewBtn = useMemo(
      () => ({ addReviewBtnClicked, setAddReviewBtnClicked }),
      [addReviewBtnClicked, setAddReviewBtnClicked]
    ),
    showAddReview = useMemo(
      () => ({ showAddReviewModal, setShowAddReviewModal }),
      [showAddReviewModal, setShowAddReviewModal]
    ); 

  return (
    <div className="App">
      <FilterContext.Provider value={{ popover, loginModal, userId, email }}>
        <div className="Navbar">
          <Navbar />
        </div>
      </FilterContext.Provider>

      <FilterContext.Provider
        value={{
          rootGenre,
          setRootGenreFilter,
          authorFilter,
          userId,
          loginModal,
          addReviewBtn,
          showAddReview,
        }}
      >
        <header className="App-header">
          <SearchSection updateParentSearchText={updateSearchText} />
        </header>
        <BookSection searchedText={searchedText} />
      </FilterContext.Provider>
    </div>
  );
}

export default App;
