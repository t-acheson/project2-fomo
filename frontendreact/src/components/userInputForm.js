import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';

function UserInputForm() {
    return (
        <div className="d-flex justify-content-center">
            <Form className="w-100">
            <Row className="mb-3 justify-content-center">
                <Col md={10}>
                        <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Label>Example textarea</Form.Label>
                <Form.Control as="textarea" rows={8} />
                </Form.Group>
            </Col>
            </Row>
            <Row className="justify-content-center">
                <Col md={2}>
                    <Button type="submit" className="w-100">
                    Submit
                    </Button>
                </Col>
            </Row>
        </Form>
    </div>
    )
}

export default UserInputForm;