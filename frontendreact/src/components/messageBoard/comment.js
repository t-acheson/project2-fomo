import { useState, useRef, useEffect } from "react";
import { ReactComponent as DownArrow } from "../../assets/down-arrow.svg";
import { ReactComponent as UpArrow } from "../../assets/up-arrow.svg";
import Action from "./commentAction";
import LikeButton from "./likeButton";

const Comment = ({
    handleInsertNode,
    comment,
  }) => {
    const [input, setInput] = useState("");
    const [showInput, setShowInput] = useState(false);
    const [expand, setExpand] = useState(false);
    const inputRef = useRef(null);
  
    const handleNewComment = () => {
      setExpand(!expand);
      setShowInput(true);
    };
  
    const onAddComment = () => {
        if (input.trim() !== "") {
            handleInsertNode(comment.id, input);
            setExpand(true);
            setShowInput(false);
            setInput("");
          } else {
            // Optionally, you can show an error message here
            alert("Comment cannot be empty");
          }
        };
  
    return (
      <div>
        <div className={comment.id === 1 ? "inputContainer" : "commentContainer"}>
          {comment.id === 1 ? (
            <>
              <input
                type="text"
                className="inputContainer__input first_input"
                autoFocus
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="type..."
              />
  
              <Action
                className="reply comment"
                type="COMMENT"
                handleClick={onAddComment}
              />
            </>
          ) : (
            <>
              <span
                ref={inputRef}
                style={{ wordWrap: "break-word" }}
              >
                {comment.name}
              </span>
              <div style={{ display: "flex", marginTop: "5px" }}>
              <Action
                className="reply"
                type={
                  <>
                    {expand ? (
                      <UpArrow width="10px" height="10px" />
                    ) : (
                      <DownArrow width="10px" height="10px" />
                    )}{" "}
                    REPLY
                  </>
                }
                handleClick={handleNewComment}
                    />
                  <LikeButton/>
              </div>
            </>
          )}
        </div>
  
        <div style={{ display: expand ? "block" : "none", paddingLeft: 25 }}>
          {showInput && (
            <div className="inputContainer">
              <input
                type="text"
                className="inputContainer__input"
                autoFocus
                onChange={(e) => setInput(e.target.value)}
              />
              <Action className="reply" type="REPLY" handleClick={onAddComment} />
              <Action
                className="reply"
                type="CANCEL"
                handleClick={() => {
                  setShowInput(false);
                  if (!comment?.items?.length) setExpand(false);
                }}
              />
            </div>
          )}
  
          {comment?.items?.map((cmnt) => {
            return (
              <Comment
                key={cmnt.id}
                handleInsertNode={handleInsertNode}
                comment={cmnt}
              />
            );
          })}
        </div>
      </div>
    );
  };
  
  export default Comment;