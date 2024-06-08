import React from 'react'
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import DaumPostcodeEmbed from 'react-daum-postcode';

const ModalAddress = ({form, setForm}) => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const onComplete = (e) => {
        
        const address = e.buildingName ? `${e.address}(${e.buildingName})` : e.address;
        setForm({...form, addr1:address});
        handleClose();

    }

    return (
        <>
        <Button variant="primary" onClick={handleShow}>
          검색
        </Button>
  
        <Modal
            style={{top:'10%'}}
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>주소 검색</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <DaumPostcodeEmbed onComplete={onComplete}/>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    )
}

export default ModalAddress
