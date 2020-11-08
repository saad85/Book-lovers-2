import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";

import { InputGroup, InputGroupAddon, Input, Button } from "reactstrap";
import "./search-section.css";
import CustomDropdown from "../../Utlies/dropdown/dropdown";
import { AUTHORS } from "../../gql-helper/queries";

export default function (props) {
  const [authorsList, setAuthorsList] = useState([]),
    { error, loading, data } = useQuery(AUTHORS),
    genreList = [
      "Action and adventure",
      "Bio-graphy",
      "Children's",
      "Graphic novel",
      "Poetry",
      "Political thriller",
      "Science fiction",
    ];

  const changeSearchText = (value) => {
    if (props && props.updateParentSearchText)
      props.updateParentSearchText(value);
  };

  useEffect(() => {
    if (data && data.authors && data.authors.length > 0) {
      let authors = data.authors;
      setAuthorsList(authors);
    }

    return () => {};
  }, [data]);

  return (
    <>
      <div className="container">
        <div className="search-section">
          <div className="author-filter">
            <div className="row">
              <div className="col-xs-6 col-sm-6 col-md-12 col-lg-6">
                <InputGroup>
                  <Input
                    placeholder="Search book by title"
                    bsSize="lg" style={{fontSize: "15px"}}
                    onChange={(e) => changeSearchText(e.target.value)}
                  />
                  <InputGroupAddon addonType="append">
                    <Button>
                      {" "}
                      <i className="fas fa-search"></i>
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
              </div>
            </div>

            <div className="row">
              {authorsList && authorsList.length > 0 ? (
                <div
                  className="col-xs-12 col-sm-12 col-md-6 col-lg-3"
                  style={{ paddingRight: "0", paddingTop: "20px" }}
                >
                  <CustomDropdown
                    dropdownId="authorFilter"
                    context="authors"
                    menus={authorsList}
                    placeholder="Filter by author"
                  />{" "}
                </div>
              ) : null}
              <div
                className="col-xs-12 col-sm-12 col-md-6 col-lg-3"
                style={{
                  paddingRight: "0",
                  paddingLeft: "0",
                  paddingTop: "20px",
                }}
              >
                <CustomDropdown
                  dropdownId="genreFilter"
                  menus={genreList}
                  context="genre"
                  placeholder="Filter by genre"
                />{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
