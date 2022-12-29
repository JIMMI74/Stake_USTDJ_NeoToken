import { useEffect,useRef } from "react";
export default function useEffectOne(callback,list){
    const once = useRef(false)
    useEffect(()=>{
        if(!once.current) return()=>{once.current=true}
        return callback()
    },list)
}