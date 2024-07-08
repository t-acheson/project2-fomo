import React from "react";

// start Action component
// reusable component for all the button actions for nested commnents.
// takes 3 props: handleClick, type, className

const Action = ({ handleClick, type, className }) => {
  return (
    <div className={className} onClick={handleClick}>
      {type}
    </div>
  );
};

export default Action;