import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { app } from '../../firebaseInit';
import { getFirestore, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { Row, Col, Button, Card } from 'react-bootstrap';
import Comments from './Comments';

const ReadPage = () => {
    const navi = useNavigate();
    const loginEmail = sessionStorage.getItem('email');
    const [post, setPost] = useState('');
    const {id} = useParams();
    const db = getFirestore(app);
    
    const callAPI = async() => {
        const res = await getDoc(doc(db, `posts/${id}`));
        setPost(res.data());
    }

    const {email, date, title, contents} = post;

    useEffect(()=>{
        callAPI();
    }, [])

    const onClickDelete = async() => {
        if(!window.confirm(`${id}번 게시글을 삭제하실래요?`)) return;
        //게시글 삭제
        await deleteDoc(doc(db, `/posts/${id}`));
       // window.location.href = '/bbs';
       navi('/bbs');
    }

    return (
        <Row className='my-5 justify-content-center'>
            <Col xs={12} md={10} lg={8}>
                <h1 className='mb-3'>게시글 정보</h1>
                {loginEmail===email && 
                    <div className='text-end mb-2'>
                        <Button onClick={()=>navi(`/bbs/update/${id}`)} className='me-2 px-3' size='sm' variant='success'>수정</Button>
                        <Button className='px-3' variant='danger' size='sm' onClick={onClickDelete}>삭제</Button>
                    </div>
                }
                <Card>
                    <Card.Body className='text-center'>
                        <h5>{title}</h5>
                        <hr/>
                        <div style={{whiteSpace:'pre-wrap'}}>{contents}</div>
                        <hr/>
                        <div className='text-muted'>
                            <span className='me-3'>{email}</span>
                            <span>{date}</span>
                        </div>
                    </Card.Body>
                </Card>
                <Comments/>
            </Col>
        </Row>
    )
}

export default ReadPage
