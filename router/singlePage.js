const { error } = require('console')
const express = require('express')
const router = express.Router()
const { join } = require('path')
const Post = require(join(__dirname, '..', 'model', 'postModel.js'))
const fs = require('fs')



router.get('/:id', async (req, res) => {

    try {
        const { id } = req.params
        const data = await Post.findById(id).exec();
        const formattedDate = data.date.toLocaleDateString('tr-TR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
        
        return res.render('site/single', {
            singleData: {
                ...data.toJSON(),
                date: formattedDate
            }

        })

    } catch (error) {
        console.log(error)
        return res.redirect('/error')

    }
})

router.delete('/:id', async (req, res) => {
    try {
        if (!res.locals.user) {
            return res.json({
                case: false,
                message: 'Yetkisiz erişim!'
            })
        }
        let { id } = req.params;
        const data=await Post.findById(id).exec();
        let fileName =data.path;
        let pathName =join(__dirname,'..','public',fileName)
      
        

        Post.findByIdAndDelete(id).then(() => {
            fs.unlink(pathName,(err)=>{
                console.log(err)
            })
            return res.json({
                case: true,
                message: 'Silme başarılı'
            })
        }).catch((err)=>{
            return res.json({
                case: true,
                message: 'Bir hata oluştu!'
            })
            
        })


    } catch (error) {
        console.log(error)
        return res.redirect('/error')

    }
})



module.exports = router