import React, { useState, useContext } from 'react';
import { Button, Form, InputGroup, FormControl, Alert} from 'react-bootstrap';
import { LocationContext } from '../../App'; 
import { sendMessage } from '../../hooks/webSocket'; 
import Select from 'react-select'; 
import '../cssFiles/commentInput.css';


const CommentInput = () => {
    const [text, setText] = useState('');
    const location = useContext(LocationContext); 
    const { lat, lng } = location || { lat: 40.7128, lng: -74.0060 };
    const maxLength = 280; // Maximum length for the input
    const [selectedTags, setSelectedTags] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertVariant, setAlertVariant] = useState('');


    const tags = [
        { value: 'Non-alcoholic', label: 'Non-alcoholic' },
        { value: 'FoodieFind', label: 'FoodieFind' },
        { value: 'HiddenGem', label: 'HiddenGem' },
        { value: 'Outdoor', label: 'Outdoor' },
        { value: 'ChillVibes', label: 'ChillVibes' },
        { value: 'BarHopping', label: 'BarHopping' },
        { value: 'GameNight', label: 'GameNight' },
        { value: 'Festival', label: 'Festival' },
        { value: 'CommunityEvent', label: 'CommunityEvent' },
        { value: 'Exhibit', label: 'Exhibit' },
        { value: 'Theater', label: 'Theater' },
        { value: 'Concert', label: 'Concert' },
        { value: 'Crowded', label: 'Crowded' },
        { value: 'LiveMusic', label: 'LiveMusic' },
        { value: 'DateSpot', label: 'DateSpot' },
        { value: 'OpenMic', label: 'OpenMic' }
    ];
    

    const handleInputChange = (event) => { 
        if (event.target.value.length <= maxLength) {
            setText(event.target.value);
        }
    };

    const handleTagChange = (selectedOptions) => {
        if (selectedOptions.length <= 3) {
            setSelectedTags(selectedOptions);
        }
    };

    const handleSubmit = () => { 
        if (text.trim() === '') {
            setAlertMessage('Comment cannot be empty');
            setAlertVariant('danger');
            return;
        }
        if (selectedTags.length === 0) {
            setAlertMessage('Please select at least one tag');
            setAlertVariant('danger');
            return;
        }
        const tagsObject = {};
        selectedTags.forEach((tag, index) => {
            tagsObject[`tag${index + 1}`] = tag.value;
        });

        sendMessage({
            type: 'new_comment', 
            text: text,
            lat:lat, 
            lng:lng,
            tags: tagsObject
            });

        setText('');
        setSelectedTags([]);
        setAlertMessage('Comment added successfully!');
        setAlertVariant('success');
    };

    return (
        <div className="input-container">
             {alertMessage && (
                <Alert variant={alertVariant} onClose={() => setAlertMessage('')} dismissible>
                    {alertMessage}
                </Alert>
            )}
            <InputGroup className="input-group">
                <FormControl
                    className="input-box"
                    placeholder="Enter your message (280 characters max)"
                    value={text}
                    onChange={handleInputChange}
                    maxLength={maxLength}
                    as="textarea"
                />
                <Select
                    isMulti
                    options={tags}
                    value={selectedTags}
                    onChange={handleTagChange}
                    placeholder="Must select tags (max 3)"
                    className="tag-select"
                    styles={{ 
                        control: (base) => ({
                            ...base,
                            border: 'none',
                            boxShadow: 'none',
                            '&:hover': { border: 'none' }
                        })
                    }}
                />
            </InputGroup>
            <Button variant="primary" onClick={handleSubmit} className="button">
                Submit
            </Button>
        </div>
    );
};

export default CommentInput;
