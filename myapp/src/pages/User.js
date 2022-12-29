import {useState,useEffect,useRef} from 'react'
import {
  NotificationManager,
  NotificationContainer,
} from "react-notifications";
import "react-notifications/lib/notifications.css";

export default function User(){
    //const cleaned = useRef(false)
    const [user,setUser] = useState()
    const [notLogged,setNotLogged] = useState()
    const [editWallet,setEditWallet] = useState('')

    useEffect(()=>{
        getDataUser()
        return()=>{console.log('clean')}
    },[])

    async function getDataUser(){
        const response = await fetch('http://localhost:3004/user',{credentials: 'include',method:'GET'}).catch((e)=>{console.error('error:',e)})
        console.log({response})
        if(!response.ok){
            return setNotLogged(await response.text())
        }
        const userRes = await response.json()
        setUser(userRes)
        console.log({userRes})
    }
    async function updateUserData(event){
        event.preventDefault()
        const response = await fetch('http://localhost:3004/user',{
            method:'post',
            credentials: 'include',
            body: JSON.stringify({ wallet:editWallet}),
            headers: { "Content-Type": "application/json" },
        })
        const {status } = response
        const message = await response.text()
        
        if (status === 200) {
            getDataUser()
            NotificationManager.success(message);
        } else if (status === 300) {
            NotificationManager.info(message);
        } else {
            NotificationManager.error(message);
        }
        console.log({status,message})
    }
 
    return(<div>
    User  {JSON.stringify(user)} {notLogged}
    {user && 
        <form >
            <input type="text" name='wallet' placeholder='wallet' value={editWallet} onChange={e=>setEditWallet(e.target.value)}/>
            <input type="submit" onClick={(event)=>{updateUserData(event)}} />
        </form>}

      <NotificationContainer />
    </div>)
}