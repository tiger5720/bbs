import React, { useEffect, useState } from 'react'
import { Button, Form, Row, Col } from 'react-bootstrap'
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { app } from '../../firebaseInit';
import { addDoc, collection, updateDoc, getFirestore, onSnapshot, deleteDoc, doc, orderBy, query, where} from 'firebase/firestore';

const Comments = () => {
    const [comments, setComments] = useState([]);
    const db = getFirestore(app);
    const [contents, setContents] = useState('');
    const email = sessionStorage.getItem('email');
    const {id} = useParams();

    const callAPI = () => {
        const q = query(collection(db, 'comments'), where('pid', '==', id), orderBy('date', 'desc'));
        onSnapshot(q, snapshot=>{
            let rows = [];
            snapshot.forEach(row=>{
                rows.push({id:row.id, ...row.data()});
            });
            const data = rows.map(row=>row && {...row, ellip:true, isEdit:false, text:row.contents});
            setComments(data);
        });
    }

    const onClickInsert = () => {
        sessionStorage.setItem('target', `/bbs/read/${id}`);
        window.location.href = '/login';
    }

    const onInsert = async() => {
        if(contents===""){
            alert("댓글 내용을 입력하세요!");
            return;
        }

        const data = {
            pid : id,
            email,
            contents, 
            date:moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        }
        await addDoc(collection(db, `/comments`), data);
        alert('댓글 등록 완료!');
        setContents("");
    }

    const onClickContents = (id) => {
        const data = comments.map(com=>com.id === id ? {...com, ellip:!com.ellip} : com);
        setComments(data);
    }

    const onClickDelete = async(id) => {
        if(!window.confirm(`${id}번 댓글을 삭제 하실래요?`)) return;
        await deleteDoc(doc(db, `/comments/${id}`));
    }

    const onClickUpdate = (id) => {
        const data = comments.map(com=>com.id === id ? {...com, isEdit:true} : com);
        setComments(data);
    }

    const onChangeContents = (e,id) => {
        const data = comments.map(com=>com.id === id ? {...com, contents:e.target.value} : com);
        setComments(data);
    }

    const onClickCancel = (comment) => {
        if(comment.contents !== comment.text)
        {
            if(window.confirm('정말 취소 하시겠습니까?'))
            {
                const data = comments.map(com=>com.id === comment.id ? {...com, isEdit:false, contents:com.text} : com);
                setComments(data);
            }
        }
        else{
            const data = comments.map(com=>com.id===comment.id ? {...com, isEdit:false} : com);
            setComments(data);
        }
       
    }

    const onClickSave = async(com) => {
        if(com.text !==  com.contents)
        {
            if(!window.confirm('변경 내용 저장 하실래요?')) return;

            await updateDoc(doc(db, `/comments/${com.id}`), com);
        }
        onClickCancel(com);
        
    }

    useEffect(()=>{
        callAPI();
    }, [])

    return (
       <div className='my-5'>
            {!email ? 
                <div className='text-end'>
                    <Button className='px-4' onClick={onClickInsert}>댓글 등록</Button>
                </div>
                :
                <div>
                    <Form.Control value={contents} onChange={(e)=>setContents(e.target.value)} as="textarea" rows={5} placeholder='댓글 내용 입력하세요.'/>
                    <div className='text-end mt-2'> 
                        <Button onClick={onInsert} className='px-3'>등록</Button>
                    </div>
                </div>
            }
            <div className='my-4'>
                {comments.map(com=>
                    <div key={com.id}>
                        <Row>
                            <Col className='text-muted'>
                                <span className='me-2'>{com.email}</span>
                                <span>{com.date}</span>
                            </Col>
                            {email===com.email && !com.isEdit &&
                                <Col className='text-end mb-2'>
                                    <Button onClick={()=>onClickUpdate(com.id)} size='sm' className='me-2'>수정</Button>
                                    <Button size='sm' variant='danger' onClick={()=>onClickDelete(com.id)}>삭제</Button>
                                </Col>
                            }
                            {email===com.email && com.isEdit &&
                                <Col className='text-end mb-2'>
                                    <Button onClick={()=>onClickSave(com)} variant='success' size='sm' className='me-2'>저장</Button>
                                    <Button size='sm' variant='secondary' onClick={()=>onClickCancel(com)}>취소</Button>
                                </Col>
                            }
                        </Row>
                        {com.isEdit ?
                            <Form.Control onChange={(e)=>onChangeContents(e,com.id)} value={com.contents} as='textarea' rows={5}/>
                            :
                            <div onClick={()=>onClickContents(com.id)} 
                            style={{whiteSpace:'pre-wrap', cursor:'pointer'}} 
                            className={com.ellip && 'ellipsis'}>{com.contents}</div>
                        }
                        
                        <hr/>
                    </div>
                )}
            </div>
       </div>
    )
}

export default Comments
