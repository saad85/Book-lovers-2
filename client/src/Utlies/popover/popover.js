import React, { useState, useEffect, useContext } from "react";
import { Button, Popover, PopoverHeader, PopoverBody } from "reactstrap";
import { FilterContext } from "../../context-helper/context-helper";

const CustomPopover = (props) => {
  const { targetId, title, body } = props,
    { popover } = useContext(FilterContext),
    { showPopover, setShowPopover } = popover,
    [popoverOpen, setPopoverOpen] = useState(false);

  const toggle = () => setPopoverOpen(!popoverOpen);

  useEffect(() => {

    console.log("showPopover",showPopover);

    //'if (showPopover !==showPopover) toggle();

    setPopoverOpen(showPopover)
  }, [showPopover]);

  //hide Popover On Outside Click
  document.body.onclick = function (e) {
    const clickedEl = e.target,
      popoverClassList = [
        "popover-header",
        "popover-body",
        "acc-option-popover",
      ];

    if (clickedEl && !popoverClassList.includes(clickedEl.className))
      setPopoverOpen(false);
  };

  return (
    <div>
      <Popover
        placement="bottom"
        id="popover-container"
        isOpen={popoverOpen}
        target={targetId}
        toggle={toggle}
        style={{ width: "150px" }}
      >
        <PopoverHeader style={{ textAlign: "center" }}>{title}</PopoverHeader>
        <PopoverBody>{body}</PopoverBody>
      </Popover>
    </div>
  );
};

export default CustomPopover;
