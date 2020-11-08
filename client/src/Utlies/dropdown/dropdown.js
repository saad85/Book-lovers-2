import React, { useState, useEffect, useContext } from "react";
import { FilterContext } from "../../context-helper/context-helper";
import "./dropdown.css";

const CustomDropdown = (props) => {

  const { dropdownId, context, placeholder } = props;
  const [menus, setMenus] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(placeholder);
  const {rootGenre, setRootGenreFilter,authorFilter} = useContext(FilterContext);

  useEffect(() => {
    if (props.menus) {

      let propsMenu =props.menus ? props.menus : [],
      updatedList = [];

      if(context === 'authors' || context === 'add_review_authors') {

        //update menu list in just text,value
        let updatedAuthorsList =  propsMenu.map((author)=> {
          return {
            text: author.name,
            value:author._id
          }
        });

        updatedList = updatedAuthorsList;
      
      } else if(context === 'genre' || context === 'add_review_genre' ) {
        //update menu list in just text,value
        let updatedGenreList =  propsMenu.map((genre)=> {
          return {
            text: genre,
            value:genre
          }
        });

        updatedList = updatedGenreList;
      }

      setMenus(updatedList);
    }
    return () => {};
  }, [props.menus]);

  function showOrCloseDropdown() {
    if (document.getElementById(dropdownId)){
      setIsOpen(!isOpen);
      document.getElementById(dropdownId).classList.toggle("show");
    }
      
  }

  function filterFunction(value) {
    console.log('  value  ',value);
    var input, filter, ul, li, a, i;
    input = document.getElementById("searchInput")
      ? document.getElementById("searchInput")
      : '';
    filter = input ? input.value.toUpperCase() : value;
    let div = document.getElementById(dropdownId)
      ? document.getElementById(dropdownId)
      : "";
    a = div ? div.getElementsByTagName("a") : "";

    for (i = 0; i < a.length; i++) {
      let txtValue = a[i].textContent || a[i].innerText;

      if (txtValue.toUpperCase().startsWith(value.toUpperCase())) {
        if (a[i]) a[i].style.display = "";
      } else {
        if (a[i]) a[i].style.display = "none";
      }
    }
  }

  function setSelectedValue(selectedItem){
    const {text,value} = selectedItem;
      
    if(text)setSelectedItem(text);
    else setSelectedItem(placeholder);

    if(context === 'add_review_authors' && props.setParentsAuthor) props.setParentsAuthor(text,value);
    if(context === 'add_review_genre' && props.setParentsGenre) props.setParentsGenre(text,value);
    
    if(context === 'genre' && setRootGenreFilter) setRootGenreFilter(value);
    if(context === 'authors' && authorFilter && authorFilter.setRootAuthorFilter) authorFilter.setRootAuthorFilter(value);
      
    showOrCloseDropdown();
  }

  return (
    <>
      <div className="dropdown">
        <button onClick={(e) => showOrCloseDropdown()} className="dropbtn">
           {selectedItem} <span className="icon-continer">{isOpen ? <i className="fas fa-chevron-up icon-class"></i> : <i className="fas fa-chevron-down"></i>}</span>
        </button>
        <div id={dropdownId} className="dropdown-content">
          <input
            type="text"
            placeholder="Search.."
            id="searchInput"
            onKeyUp={(e) => filterFunction(e.target.value)}
          />

          {selectedItem && selectedItem !== placeholder ? <div className="clear-btn" onClick={e=>{setSelectedValue('','')}}> clear</div> : null}

          {menus.map((menu, index) => (
            <a
              key={index}
              href="#"
              className="menu"
              onClick={(e) => setSelectedValue(menu)}
            >
              {menu.text}
            </a>
          ))}
        </div>
      </div>
    </>
  );
};

export default CustomDropdown;
