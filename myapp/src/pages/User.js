import {useState,useEffect,useRef} from 'react'

export default function User(){
    //const cleaned = useRef(false)
    const [user,setUser] = useState()
    const [notLogged,setNotLogged] = useState()
    useEffect(()=>{
        getDataUser()
        return()=>{console.log('clean')}
    },[])

    async function getDataUser(){
        const response = await fetch('http://localhost:3004/user',{credentials:'include'}).catch((e)=>{console.error('error:',e)})
        if(!response.ok){
            return setNotLogged(await response.text())
        }
        const userRes = await response.json()
        setUser(userRes)
        console.log({userRes})
    }
 
    return(<div>
    User  {JSON.stringify(user)} {notLogged}
    {user && 
        <form  method='post' >
            <input type="text" name='username' placeholder='username' />
            <input type="text" name='gender' placeholder='gender'/>
            <input type="hidden" name="callbackOK" value={'/user'} />
            <input type="submit" />
        </form>}
    </div>)
}