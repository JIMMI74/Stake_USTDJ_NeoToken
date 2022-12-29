require('dotenv').config()
const crypto = require('crypto')
const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const {MongoClient} = require('mongodb')
const TOKEN_AUTH="eda5281d3f5416b8c23800147ef407441d87eb0bd9b645b5892cea909c29b5e659ec6f83beb79fc8dc2a929cb438b82220e85d5fc5ce6a1120dd7f5f76b1d13a"
REFRESH_TOKEN_SECRET="8e5a3dfb01220c77a0255676f4561a01c8b3c62240c8b9956a05bb72bb75c20abe52fa92eb3acfdfeefa9c957e5b30e83bcbcaa6aa71685192ec36c7ae6e2941"


//console.log(process.env.MONGO_URI);
// require('crypto').randomBytes(64).toString('hex')
const privateKey = "mongodb+srv://UTENTE:PASSWORD@jimmy.innukjq.mongodb.net/test"
//console.log({privateKey});
//const client = new MongoClient(process.env.MONGO_URI)

const client = new MongoClient(privateKey)
const db = client.db('auth')
const usersAuth = db.collection('usersAuth')
const userRegister = db.collection('userRegister')
const app = express();

//app.use(express.json()) // passa il body della richiesta a json
//app.use(express.urlencoded({extended:true})) // passa il body della richiesta a json
/* app.use((req,res,next)=>{
          console.log(req.method,req.url,req.body)
          next()
})

app.post('/login',(req,res)=>{
          const {paramas,body,query} = req
          console.log(req.headers.origin,paramas,body,query)
          res.send('ok')

})
app.post('/logout',()=>{
   
})
app.get('/user',()=>{

})

function authToken(){
          return((req,res,next)=>{
                    next()
          })
}

async function main(){
          await client.connect()
          console.log('Connected to MongoDB......')
          app.listen(3003,()=>{
                    console.log('Server on port 3003')

          })
}
main() */
app.use(bodyParser({extended:true}))
//app.use(bodyParser.json())
app.use(cors({credentials:true,origin:/./}))

app.options('*',cors({credentials:true,origin:/./,methods:['GET','POST','PUT','DELETE','OPTIONS'],allowedHeaders:['Content-Type','Authorization','Origin','X-Requested-With','Accept']}))
app.use(cookieParser)


app.post('/register',async(req,res)=>{
    const {params,body,query,method} = req
    const {email,pass,wallet} = body
    const origin = req.headers.origin
    console.log({origin,method})
    // 2) controllare che il wallet sia scritto giusto
    const regex = /^0x[a-fA-F0-9]{40}$/g
    if (!wallet.match(regex)){
        res.status(401).send('address sbagliato')
        return
    }  
    
    const dbuser = await usersAuth.findOne({_id:{$eq:email}})
    if(!dbuser){
        const salat = generationSalat()
        const encPass = generationSha256(salat,pass)
        const refreshToken = generateRefreshToken({email})
        const insert =  await usersAuth.insertOne({_id:email,encPass,salat,refreshToken})
        if(insert){// prima di fare il redirect dovremmo salvere il token per riconoscerlonode
            userRegister.insertOne({_id:email,wallet})
            res.cookie('jwtoken',generateAccessToken({email}))
            res.status(200).send('registrazione effetuata')
            return
        } else{
            res.status(401).send("Impossbile aggiungere l'utente")
            return;
        }
    }else {
        res.status(300).send("utente gia registrato")
        return
    }



})

app.post('/login',async(req,res)=>{
    const {params,body,query,method} = req
    const {email,pass} = body
    const origin = req.headers.origin
    // email esiste gia ?
    const dbuser = await usersAuth.findOne({_id:{$eq:email}})
    if(!dbuser){
        res.status(401).send("email non esiste")
        return;
    }
    // esiste mi prendo direttamente i dati e confronto i 2 encPass 
    const {_id,encPass,salat} = dbuser
    const encPassDaControllare = generationSha256(salat,pass)
    if(encPass === encPassDaControllare){// quindi le password corispondono
        // prima di fare il redirect dovremmo salvere il token per riconoscerlo 
        console.log('login con sucesso')
        res.cookie('jwtoken',generateAccessToken({email}))
        res.status(200).send('login con sucesso')
    } else{
        res.status(401).send("email e password non corrispondono")
    }
    return
})
app.post('/logout',(req,res)=>{
    res.clearCookie('jwtoken')
    res.send('ok')
})
app.get('/user',authToken,async (req,res)=>{
    const user = req.userData
    console.log('/user',{user})
    const dbuser = await userRegister.findOne({_id:{$eq:user.email}})
    console.log({dbuser})
    res.json(dbuser)
})
app.post('/user',authToken,(req,res)=>{
    const {email} = req.userData
    const {params,body,query} = req
    const {wallet} = body

    const regex = /^0x[a-fA-F0-9]{40}$/g
    if (wallet === undefined || !wallet.match(regex)){
        res.status(401).send('address sbagliato')
        return
    }  
    userRegister.findOne({_id:email}).then((user)=>{
        console.log('tovato')
        userRegister.updateOne({_id:email},{$set:{wallet}}).then((e)=>{
            console.log('update con success',e)
            res.status(200).send('wallet aggiornato con sucesso')
        })
        .catch((e)=>{
            console.log('errore',e)
            res.status(401).send('errore:'+JSON.stringify(e))})
    })
    .catch((e)=>{
        console.log('not find',e)
    })
})

async function authToken(req, res, next) {
    console.log('auth')
    if(!req.parsCookie) return res.status(401).send('please log in first')
    const token = req.parsCookie['jwtoken']
    console.log({token})
    if (token == null) return res.status(401).send('non sei loggato') // se l'utente non e loggato con nessun account lo m
  
    let user = dataFromAccessToken(token)
    console.log({user})
    if(user === undefined){ // se il token non e piu valido posso dagli un mesaggio di sessione scaduta, redirect o rigeneraralo 
        res.clearCookie('jwtoken')
        return res.status(401).send('sessione scaduta')
    }
    req.userData = user
    next()
}
function dataFromAccessToken(token){
    let user 
    jwt.verify(token,TOKEN_AUTH, (err, value) => {
      if(err) return undefined
      user = value
    })
    return user
  }
function generationSha256(salat,pass){
    return crypto.createHash('sha256').update(salat+pass).digest('hex')
}

function generationSalat(){
    return crypto.randomBytes(24).toString('hex')
}

function generateAccessToken(user) {
    return jwt.sign(user, TOKEN_AUTH,{expiresIn:'6M'})
}

function generateRefreshToken(user) {
    return jwt.sign(user, REFRESH_TOKEN_SECRET)
}

function cookieParser(req, res, next) {
    const cookies = req?.headers?.cookie
    console.log({heder:req.headers})
    if (!cookies) { next(); return; }
    const listCookies = cookies.split('; ')
    req.parsCookie = {}
    listCookies.forEach(cookie => {
        const [key, ...value] = cookie.split('=')
        req.parsCookie[key] = value.join('=')
    })
    
    return next()
}

async function main(){
    await client.connect()
    console.log('MongoDB connected....')
    app.listen(3004,()=>{
        console.log('Server on',3004);
    })
}


main()
