// ! currently not in use. replaced by comments component 
// * not deleted for back up, once comments componets work. this file can be deleted
//Imports
import Card from 'react-bootstrap/Card';
import LikeButton from './likeButton';

//Start  LocationIDCard function
//creates a componet of an image, textfield aboout the location a rating display and a like button. 

function MessageCard() {
    return (
        <section id="messageCard" className="locationIdCardBlock">
            <Card>
                <Card.Body>{messageCard.post}</Card.Body>
                <div className="row">
                <LikeButton />
                </div>
            </Card>
        </section>
    );
}


export default MessageCard;

//End of LocationIDCard function.
//Returns the componet of an image, textfield aboout the location a rating display and a like button. 