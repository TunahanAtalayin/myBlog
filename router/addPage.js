const express = require('express')
const router = express.Router()
const { join } = require('path')
const { title } = require('process')
const Post = require('../model/postModel')

router.get('/', (req, res) => {
    if (!res.locals.user) {
        return res.redirect('/error')
    }
    return res.render('site/add')
})





router.post('/', (req, res) => {
    try {
        if (!res.locals.user) {
            return res.json({
                case: false,
                message: 'Yetkisiz erişim!'
            })
        }
        if (!req.body || !req.files) {
            return res.json({
                case: false,
                message: 'Veri iletilemedi'
            })
        }


        const { titleContent, postContent, authorContent } = req.body
        const file = req.files.file

        
        if (!titleContent || !postContent || !authorContent) {
            return res.json({               
                case: false,
                message: 'Veri iletilemedi.Single data'
            })
        }

        if (file.size > 1024 * 1024 * 5) {
            return res.json({
                case: false,
                message: 'Dosya boyutu 5 mb dan daha az olmalıdır'
            })
        }

        if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'image/jpg') {

            const extension = file.mimetype.split('/')[1]
            const uniqueName = `${Date.now()}-${Math.round(Math.random()) * 1E9}.${extension}`
            const pathName = join(__dirname, '..', 'public', 'img', 'content', uniqueName)
            
            

            file.mv(pathName, (err) => {
                if (err != undefined) {
                    return res.json({
                        case: true,
                        message: 'Dosya Eklenemedi'
                    })

                }
                else {
                       
                    const post = new Post({
                        'title': titleContent,
                        'author': authorContent,
                        'post': postContent,
                        'path': `/img/content/${uniqueName}`,
                        
                    })
                    post.save().then(() => {
                        return res.json({
                            case: true,
                            message: 'Veri başarılı bir şekilde eklendi'
                        })
                    }).catch(err => {
                        console.log(err)
                        return res.json({
                            case: false,
                            message: 'Bir hata oluştu'+err
                        })
                    })
                }
            })




        }
        else {
            return res.json({
                case: false,
                message: 'Dosya istenilen formatta değil'
            })

        }

    } catch (error) {
        console.log(error)
        return res.json({
            case: false,
            message: 'Beklenilmeyen bir hata oluştu!' + error
        })
    }

})

module.exports = router