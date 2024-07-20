import React, { useState, useContext } from 'react';
import { Button, Form, InputGroup, FormControl } from 'react-bootstrap';
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

    const tags = [
        { value: 'Tag1', label: 'Non-alcoholic' },
        { value: 'Tag2', label: 'FoodieFind' },
        { value: 'Tag3', label: 'HiddenGem' },
        { value: 'Tag4', label: 'Outdoor' },
        { value: 'Tag5', label: 'ChillVibes' },
        { value: 'Tag6', label: 'BarHopping' },
        { value: 'Tag7', label: 'GameNight' },
        { value: 'Tag8', label: 'Festival' },
        { value: 'Tag9', label: 'CommunityEvent' },
        { value: 'Tag10', label: 'Exhibit' },
        { value: 'Tag11', label: 'Theater' },
        { value: 'Tag12', label: 'Concert' },
        { value: 'Tag13', label: 'Crowded' },
        { value: 'Tag13', label: 'LiveMusic' },
        { value: 'Tag14', label: 'DateSpot' },
        { value: 'Tag14', label: 'OpenMic' },

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
            alert('Comment cannot be empty');
            return;
        }
        if (selectedTags.length === 0) {
            alert('Please select at least one tag');
            return;
        }
        sendMessage({
            type: 'new_comment', 
            text: text,
            // tags: selectedTags.map(tag => tag.value), 
            lat:lat, 
            lng:lng });
        setText('');
        setSelectedTags([]);
    };

    return (
        <div className="input-container">
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
