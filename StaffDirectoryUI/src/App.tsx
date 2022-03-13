import { useState } from 'react';
import './App.css';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Staff from './Model/Staff'
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';

function App() {

  const [file,setFile] = useState('')
  const [staffTable,setStaffTable] = useState<Staff[]>()

  const onSubmit = (e:any) => {
    e.preventDefault();
    if(file !== '')
    {
      const formData = new FormData();
      formData.append('formFile', file);
      submitForm(formData)
    }
  }

  const onFileChange = (e:any) => {
    setFile(e.target.files[0])
  }

  const onSuccess = (data:any) => {

    if(data && data.status === 400){
      //handle error
      return
    }

    setStaffTable(data)
  }

  const submitForm = (formData:FormData) => {
    fetch('https://localhost:7059/Staff', {
      method: 'POST',
      body: formData
    })
    .then(
      response => response.json())
    .then(
      success => onSuccess(success)
    ).catch(
      error => console.log(error) 
    );
  };

  return (
    <Container className="p-3 app-header">
      <Container className="p-5 mb-4 bg-light rounded-3">
        <h1 className="header">
          Welcome To Staff Directory
        </h1>
      </Container>

      <Form onSubmit={onSubmit}>
        <Form.Group controlId="formFileLg" className="mb-3">
          <Form.Label>Please upload the staff list:</Form.Label>
          <Row>
            <Col>
              <Form.Control
                name="fileUpload"
                type="file"
                onChange={onFileChange}
              ></Form.Control>
           </Col>
            <Col> 
              <Button variant="primary" type="submit">
                Upload
              </Button>
          </Col>
        </Row>
      </Form.Group>
        
      </Form>

      <Table bordered>
        <thead>
        <tr>
            <th>Employee Number</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Employee Status</th>
        </tr>
        </thead>
        <tbody>
        {
            staffTable && staffTable.map((item:Staff) => (
            <tr key={item.employeeNumber} className={item.employeeStatus === "Regular" ? 'green-font' : 'yellow-font'}>
            <td>{item.employeeNumber}</td>
            <td>{item.firstName}</td>
            <td>{item.lastName}</td>
            <td>{item.employeeStatus}</td>
            </tr>
            ))
        }
        </tbody>
        </Table>

    </Container>
  );
}

export default App;
