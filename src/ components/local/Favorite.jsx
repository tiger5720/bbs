import React, { useEffect, useState } from 'react'
import {app} from '../../firebaseInit'
import {getDatabase, ref, onValue, remove} from 'firebase/database'
import { Table , Row, Col, InputGroup, Form, Button} from 'react-bootstrap';

const Favorite = () => {
    const db = getDatabase(app);
    const uid = sessionStorage.getItem('uid');
    const [loading, setLoading] = useState(false);
    const [locals, setLocals] = useState([])
    
    const callAPI = () => {
        setLoading(true);
        onValue(ref(db, `favorite/${uid}`), snapshot => {
            let rows=[];
            snapshot.forEach(row=>{
                rows.push({...row.val()});
            })
            setLocals(rows);
            setLoading(false);
        });
    }

    const onClickDelete = async(local) => {
        if(window.confirm(`${local.id}번을 삭제하실랑가?`)){
            setLoading(true);
            await remove(ref(db, `favorite/${uid}/${local.id}`));
            setLoading(false);
        }
    }

    useEffect(()=>{callAPI()}, );

    if(loading) return <h1 className='my-5'>로딩중입니다...</h1>
    return (
        <div>
            <h1 className='my-5'>즐겨찾기</h1>
            <Table striped bordered hover>
                <thead>
                    <tr className='text-center'>
                        <td>ID</td>
                        <td>장소명</td>
                        <td>주소</td>
                        <td>전화 번호</td>
                        <td>취소</td>
                    </tr>
                </thead>
                <tbody>
                    {locals.map(local=>
                        <tr key={local.id}>
                            <td>{local.id}</td>
                            <td>{local.place_name}</td>
                            <td>{local.address_name}</td>
                            <td>{local.phone}</td>
                            <td className='text-center'><Button onClick={()=>onClickDelete(local)}>취소</Button></td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    )
}

export default Favorite
