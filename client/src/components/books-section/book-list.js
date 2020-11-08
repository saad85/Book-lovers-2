import React, { useState, useEffect, useContext, useMemo } from "react";

import AddReviewModal from "../../Utlies/modals/add-review-modals";
import RightPanel from "../../Utlies/right-panel/right-panel.js";
import Loading from "../../Utlies/loader/loader";

import { Button } from "reactstrap";
import { useQuery } from "@apollo/client";
import { GET_REVIEW } from "../../gql-helper/queries";

import "./book-list.css";
import { FilterContext } from "../../context-helper/context-helper";

function Image(props) {
  const { book } = props;
  const { imgId, title } = book;
  const [imgSrc, setImgSrc] = useState("");

  useEffect(() => {
    getImgSrc();
    return () => {};
  }, []);

  async function getImgSrc() {
    if (imgId) {
      await fetch("https://api.jsonbin.io/b/" + imgId, {
        method: "GET",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "secret-key":
            "$2b$10$rhIFVqhUIEQwsbi0CwHLMe6jxkKyBD3otM2McKelyCAyWXJyFWQ7G",
        },
      }).then(async (response) => {
        let result = await response.json();

        if (result.imgSrc) {
          setImgSrc(result.imgSrc);
        }
      });
    }
  }

  return (
    <>
      <img src={imgSrc} width="100%" height="100%" className="img-container" />
    </>
  );
}

export default function (props) {
  const { searchedText } = props;
  const [showModal, setShowModal] = useState(false),
    [showRightPanel, setShowRightPanel] = useState(false),
    [headerText, setHeaderText] = useState("Book reviews"),
    [query, setQuery] = useState({}),
    [bookReviews, setBookReviews] = useState([]),
    [selectedReviewId, setSelectedReviewId] = useState([]);

    

  const {
      rootGenre,
      authorFilter: { rootAuthorFilter },
      userId,
      loginModal,
      addReviewBtn
    } = useContext(FilterContext),
    { setShowLoginModal } = loginModal,
    { addReviewBtnClicked,setAddReviewBtnClicked } = addReviewBtn,
    { loading, data, refetch } = useQuery(GET_REVIEW, {
      variables: { query: query },
    });

  const showAddReviewModal = (value) => {

    if (userId) setShowModal(value);
    else if (setShowLoginModal) {
      setShowLoginModal(true);
      setAddReviewBtnClicked(true); // show add review modal after log in
    }
  };

 

  const showRPanel = (reviewId) => {
    setShowRightPanel(!showRightPanel);
    setSelectedReviewId(reviewId);
  };

  const filterAndUpdate = () => {
    let reviews =
      data && data.reviews && data.reviews.length > 0 ? data.reviews : [];

    if (reviews && searchedText) {
      let filteredReviews = reviews.filter((bookReview) => {
        setHeaderText("Filtered book reviews");
        return bookReview.title
          .toLowerCase()
          .includes(searchedText.toLowerCase())
          ? bookReview
          : "";
      });
      setBookReviews(filteredReviews);
    } else {
      setBookReviews(reviews);
      setHeaderText("Book reviews");
    }
  };

  const userIdAdded = useMemo(
    () => ({ addReviewBtnClicked, userId }),
    [addReviewBtnClicked, userId]
  )

  useEffect(() => {
    filterAndUpdate();
    if (rootGenre) {
      query.genre = rootGenre;
      setQuery(query);
    } else {
      delete query.genre;
    }
    if (rootAuthorFilter) {
      query.author = rootAuthorFilter;
      setQuery(query);
    } else {
      delete query.author;
    }
    refetch(query);

    if(addReviewBtnClicked && userId){
      showAddReviewModal(true);
      setAddReviewBtnClicked(false);
    }

    return () => {};
  }, [searchedText, data, rootGenre, rootAuthorFilter, userIdAdded]);

  return (
    <div className="container books-container">
      <div className="row header-row">
        <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 header-text">
          <h5>{headerText}</h5>{" "}
        </div>
        <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 header-text"> </div>
        <div
          className="col-xs-8 col-sm-8 col-md-8 col-lg-8"
          style={{ textAlign: "end" }}
        >
          <div className="btn-container"></div>
          <Button onClick={(e) => showAddReviewModal(true)}>
            <i className="fas fa-plus"></i> Add review
          </Button>
        </div>
      </div>
      {loading ? <Loading /> : null}
      <div className="row">
        {bookReviews && bookReviews.length > 0 ? (
          bookReviews.map((book, index) => {
            return (
              <div
                className="col-xs-12 col-sm-12 col-md-4 col-lg-4 "
                key={index}
              >
                <div className="book-container" onClick={(e) => showRPanel(book._id)}>
                  <div
                    className="col-xs-4 col-sm-4 col-md-4 col-lg-4"
                    style={{ padding: "0px" }}
                    key={index}
                  >
                    {book.imgId ? (
                      <Image book={book} />
                    ) : (
                      <img
                        src="https://images.pexels.com/photos/965340/pexels-photo-965340.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                        width="100%"
                        height="100%"
                        className="img-container"
                      />
                    )}
                  </div>
                  <div
                    className="col-xs-9 col-sm-9 col-md-9 col-lg-9"
                    style={{ paddingLeft: "0px" }}
                  >
                    <div className="book-description">
                      <div
                        className="row"
                        style={{ borderBottom: "1px solid #eee",textAlign: "start"}}
                      >
                        <h5>{book.title}</h5>
                      </div>

                      {book.author && book.author.name ? (
                        <div className="row author-name">
                          <p>By: {" " + book.author.name}</p>
                        </div>
                      ) : null}
                      <div className="row genre">
                        <p>Genre: {" " + book.genre}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : !loading ? (
          <span className="not-found-msg">No review found..</span>
        ) : null}
      </div>

      {showModal ? <AddReviewModal closeModal={showAddReviewModal} /> : null}
      {showRightPanel ? (
        <RightPanel setShowRightPanel={setShowRightPanel} selectedReviewId={selectedReviewId}/>
      ) : null}
    </div>
  );
}
