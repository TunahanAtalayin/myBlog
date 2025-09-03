const express =require('express')
const router=express.Router()
const pageInfo={
    source:'about.jpg',
    title:'Why U.S.',
    subTitle:'We Are a Family'
}


router.get('/',(req,res)=>{
    res.render('site/about',{pageInfo}) 
})


module.exports=router