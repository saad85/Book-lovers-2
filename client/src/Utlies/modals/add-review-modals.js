import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from "reactstrap";
import "./add-review-modal.css";
import { useMutation, useQuery } from "@apollo/client";
import CustomDropdown from "../dropdown/dropdown";
import CustomGenreDropdown from "../dropdown/dropdown";

import {
  ADD_REVIEW,
  ADD_AUTHOR,
  AUTHORS,
  GET_REVIEW,
} from "../../gql-helper/queries";
import { FilterContext } from "../../context-helper/context-helper";

const AddReviewModal = (props) => {
  const { className } = props;

  const [modal, setModal] = useState(true),
    [title, setTitle] = useState(""),
    [author, setAuthor] = useState(""),
    [genre, setGenre] = useState(""),
    [desc, setDesc] = useState(""),
    [showAddNewAurthor, setShowAddNewAurthor] = useState(false),
    [readOnly] = useState(false),
    [authorsList, setAuthorsList] = useState([]),
    [selectedAuthor, setSelectedAuthor] = useState(""),
    [hasAllMandatoryFields, setHasAllMandatoryFields] = useState(true),
    [titleReq, setTitleReq] = useState(true),
    [authorReq, setAuthorReq] = useState(true),
    [imgId, setImgId] = useState("");

    const  { userId } = useContext(FilterContext);

  const [addReview] = useMutation(ADD_REVIEW),
    [addAuthor] = useMutation(ADD_AUTHOR),
    { data } = useQuery(AUTHORS);

  const genreList = [
    "Action and adventure",
    "Bio-graphy",
    "Children's",
    "Graphic novel",
    "Poetry",
    "Political thriller",
    "Science fiction",
  ];

  const toggle = () => setModal(!modal);

  function setAuthorFromDropdown(text, value) {
    setSelectedAuthor(value);
  }

  function setGenreFromDropdown(text, value) {
    setGenre(value);
  }

  function uploadImage() {
    let file = document.getElementById("img-uploader-btn").files;

    if (file.length > 0) {
      let uploadedFile = file[0];

      let reader = new FileReader();

      reader.onload = function (fileLoadEvent) {
        let srcData = fileLoadEvent.target.result;

        if (srcData) uploadImgFileToApi(srcData);
      };

      reader.readAsDataURL(uploadedFile);
    }
  }

  async function uploadImgFileToApi(srcData) {
    await fetch("https://api.jsonbin.io/b", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "secret-key":
          "$2b$10$rhIFVqhUIEQwsbi0CwHLMe6jxkKyBD3otM2McKelyCAyWXJyFWQ7G",
      },
      body: JSON.stringify({ imgSrc: srcData }),
    }).then(async (response) => {
      const { id } = await response.json();
      setImgId(id);
    });
  }

  function closeModal() {
    setModal(!modal);

    if (props.closeModal) {
      setTimeout(() => {
        props.closeModal(false);
      }, 100);
    }
  }

  // var myDropzone = new Dropzone("div#myId", { url: "/file/post"});

  useEffect(() => {

    if (data && data.authors && data.authors.length > 0) setAuthorsList(data.authors);

    //form validation
    if (
      title &&
      title.length > 0 &&
      selectedAuthor &&
      selectedAuthor.length > 0
    
      ) setHasAllMandatoryFields(false);
    

    if (title) setTitleReq(false);
    else setTitleReq(true);

    if (selectedAuthor) setAuthorReq(false);
    else setAuthorReq(true);

    return () => {};
  }, [data, title, selectedAuthor]);

  return (
    <div>
      <Modal
        isOpen={modal}
        toggle={toggle}
        className={className}
        onClosed={() => closeModal()}
      >
        <ModalHeader toggle={toggle} style={{ backgroundColor: "#f7f7f7" }}>
          Add review
        </ModalHeader>
        <ModalBody>
          <div>
            <div className="form-field">
              Title:{" "}
              <Input
                placeholder="add a title"
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
              {titleReq ? (
                <span className="req-class">*Required field</span>
              ) : null}
            </div>

            <div className="form-field">
              Author:
              {!showAddNewAurthor ? (
                <div>
                  <>
                    <CustomDropdown
                      dropdownId="author"
                      menus={authorsList}
                      setParentsAuthor={setAuthorFromDropdown}
                      context="add_review_authors"
                      placeholder="Select author"
                    />{" "}
                    or{" "}
                    <span
                      className="add-new-aurthor"
                      onClick={(e) => setShowAddNewAurthor(!showAddNewAurthor)}
                    >
                      <i
                        className="fas fa-plus"
                        style={{ fontSize: "12px" }}
                      ></i>{" "}
                      Add new
                    </span>
                  </>
                </div>
              ) : (
                <span className="row">
                  <span className="col-xs-7 col-sm-7 col-md-7 col-lg-7  ">
                    <Input
                      placeholder="add new author"
                      readOnly={readOnly}
                      onChange={(e) => {
                        setAuthor(e.target.value);
                      }}
                      style={{ marginTop: "10px" }}
                      value={author}
                    />
                  </span>
                  <span
                    className=" col-xs-2 col-sm-2 col-md-2 col-lg-2 add-icon"
                    id="addIcon"
                    onClick={(e) => {
                      addAuthor({
                        variables: { authorName: author },
                        refetchQueries: [{ query: AUTHORS }],
                      });
                      setShowAddNewAurthor(!showAddNewAurthor);
                    }}
                  >
                    <i className="fas fa-plus"></i>
                  </span>
                  <span
                    className=" col-xs-2 col-sm-2 col-md-2 col-lg-2 add-icon"
                    id="backIcon"
                    onClick={(e) => setShowAddNewAurthor(!showAddNewAurthor)}
                  >
                    <i className="fas fa-arrow-left"></i>
                  </span>
                </span>
              )}
              <div></div>
              {authorReq ? (
                <span className="req-class">*Required field</span>
              ) : null}
            </div>

            <div className="form-field">
              <div className="row">
                <div className="col-xs-6 col-sm-6  col-md-6  col-lg-6 ">
                  Genre:{" "}
                  <CustomGenreDropdown
                    dropdownId="genre"
                    menus={genreList}
                    setParentsGenre={setGenreFromDropdown}
                    context="add_review_genre"
                    placeholder="Select genre"
                  />
                </div>

                <div className="col-xs-6 col-sm-6  col-md-6  col-lg-6 img-section ">
                  Upload a cover:
                  <input
                    type="file"
                    id="img-uploader-btn"
                    onChange={(e) => uploadImage()}
                  />
                </div>
              </div>
            </div>

            {/* <img src={imgSrc} width="30px"/> */}

            <div className="form-field">
              How was it:{" "}
              <textarea
                placeholder="Short summary"
                style={{ width: "100%" }}
                onChange={(e) => {
                  setDesc(e.target.value);
                }}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            disabled={hasAllMandatoryFields}
            onClick={(e) => {
              closeModal();
              addReview({
                variables: {
                  title: title,
                  author: selectedAuthor,
                  genre: genre,
                  desc: desc,
                  imgId: imgId,
                  reviewerId: userId
                },
                refetchQueries: () => [
                  { query: GET_REVIEW, variables: { query: {} } },
                ],
              });
            }}
          >
            <i className="fas fa-plus"></i> Add
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default AddReviewModal;
