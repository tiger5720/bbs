import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Button, InputGroup, Form } from 'react-bootstrap'
import { app } from '../../firebaseInit';
import { getFirestore, doc, setDoc, getDoc} from 'firebase/firestore';
import ModalAddress from './ModalAddress';
import ModalPhoto from './ModalPhoto';

const Mypage = () => {
    const [loading, setLoading] = useState(false);
    const db = getFirestore(app);
    const uid = sessionStorage.getItem('uid');
    const [form, setForm] = useState({
        email:sessionStorage.getItem('email'),
        name:'', phone:'', addr1:'', addr2:''
    });

    const {name, phone, addr1, addr2} = form;
    const onChangeForm = (e) => {
        setForm({...form, [e.target.name]:e.target.value})
    }

    const onSubmit = async(e) => {
        e.preventDefault();
        if(name===""){
            alert("이름 입력하자^^");
            return;
        }
        // 정보 저장
        if(!window.confirm("변경 내용 저장할꺼니?")) return;    
        console.log(form);
        setLoading(true);
        await setDoc(doc(db, `users/${uid}`), form);
        setLoading(false);
    }

    const callAPI = async() => {
        setLoading(true);
        const res  = await getDoc(doc(db, `users/${uid}`));
        if(res.data()){
            setForm(res.data());
        }
        setLoading(false);
    }

    useEffect(()=>{callAPI();},[]);

    if(loading) return <h1 className='text-center my-5'>로딩중이담</h1>
    return (
        <Row className='justify-content-center my-5'>
            <Col xs={12} md={10} lg={8}>
                <Card>
                    <Card.Header>
                        <h3 className='text-center'>마이페이지</h3>
                    </Card.Header>
                    <Card.Body>
                        <div className='text-center'>
                            <ModalPhoto setLoading={setLoading} form={form} setForm={setForm}/>
                        </div>
                        <form onSubmit={onSubmit}>
                            <InputGroup className='mb-2'>
                                <InputGroup.Text>이름</InputGroup.Text>
                                <Form.Control name="name" value={name} onChange={onChangeForm}/>
                            </InputGroup>
                            <InputGroup className='mb-2'>
                                <InputGroup.Text>전화</InputGroup.Text>
                                <Form.Control name="phone" value={phone} onChange={onChangeForm}/>
                            </InputGroup>
                            <InputGroup className='mb-2'>
                                <InputGroup.Text>주소</InputGroup.Text>
                                <Form.Control name="addr1" value={addr1} onChange={onChangeForm}/>
                                <ModalAddress form={form} setForm={setForm}/>
                            </InputGroup>
                            <Form.Control placeholder='상세주소' name="addr2" value={addr2} onChange={onChangeForm}/>
                            <div className='text-center mt-3'>
                                <Button className='px-4' type='submit'>저장</Button>
                                <Button variant='secondary' className='ms-2 px-4'>취소</Button>
                            </div>
                        </form>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    )
}

export default Mypage
