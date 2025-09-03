const express = require('express')
const router = express.Router()
const { join } = require('path')
const Post = require(join(__dirname, '..', 'model', 'postModel.js'))
const pageInfo={
    source:'home.jpg',
    title:'My Blog.',
    subTitle:"It's a Dream"
}



router.get('/', async (req, res) => {

     

    try {

        const post = await Post.find().exec()
        


        return res.render('site/index', {
            pageInfo,
            allData: post.map(item => {
                const obj = item.toJSON();
                obj.date = new Date(obj.date).toLocaleDateString("tr-TR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric"
                });
                return obj;
        })
        
        

        })

    } catch (error) {
        console.log(error)
        return res.redirect('/error')
    }
})


module.exports = router