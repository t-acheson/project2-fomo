import { useState, useRef, useEffect } from "react";
import { ReactComponent as DownArrow } from "../../assets/down-arrow.svg";
import { ReactComponent as UpArrow } from "../../assets/up-arrow.svg";
import Action from "./commentAction";
import LikeDislikeButton from "./likeAndDislikeButton";
import socket from "../../webSocket";

//Start Comment function
//Handles comments display and nesting comments. Also allowing users to add comments and reply to them individually. replys can be toggled to display or to be hidden.
const Comment = ({
    handleInsertNode,
    comment,
  }) => {
    const [input, setInput] = useState("");
    const [showInput, setShowInput] = useState(false);
    const [expand, setExpand] = useState(false);
    const inputRef = useRef(null);

    //Function for handling display of new comments 
    const handleNewComment = () => {
      setExpand(!expand);
      setShowInput(true);
    };

    // Function for adding comments
    const onAddComment = () => {
        if (input.trim() !== "") {
            const newComment = { id: comment.id, text: input };
            handleInsertNode(comment.id, input);
            setExpand(true);
            setShowInput(false);
            setInput("");

        // Send the comment data via WebSocket
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(newComment));
            console.log("Sent message to server:", newComment);
          } else {
            console.error("WebSocket is not open. Unable to send message:", newComment);
          }
        } else {
          alert("Comment cannot be empty");
        }
      };

 

  return (
    <div>
      {comment.id === 1 ? (
        <div className="inputContainer">
          <textarea
            className="inputContainer__input first_input"
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="type..."
          />
          <Action
            className="replyComment"
            type="COMMENT"
            handleClick={onAddComment}
          />
        </div>
      ) : null}

      <div className={comment.id === 1 ? "inputContainer" : "commentContainer"}>
        {comment.id !== 1 && (
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
              <LikeDislikeButton />
            </div>
          </>
        )}
      </div>

      <div style={{ display: expand ? "block" : "none", paddingLeft: 25 }}>
        {showInput && (
          <div className="inputContainer">
            <textarea
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
  // End of Comment
  //Returns a component that handles comments display and nesting comments. Also allowing users to add comments and reply to them individually. replies can be toggled to display or to be hidden.