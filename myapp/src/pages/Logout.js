export default function Logout(){

          async function logout(){
              await fetch('http://localhost:3004/logout',{credentials:'include',method:'post'})
              window.location.href = '/'
          }
      
          return(<div>
              Logout
              <button onClick={()=>{logout()}}>Logout</button>
          </div>)
      }