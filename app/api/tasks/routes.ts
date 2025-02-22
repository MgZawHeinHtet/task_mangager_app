import { NextRequest,NextResponse } from "next/server";

export async function Delete(req : NextRequest,res:NextResponse){
    const {data} = req.body
    console.log(data);
    
}