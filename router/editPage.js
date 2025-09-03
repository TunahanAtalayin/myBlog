const express = require('express')
const fs = require('fs')
const path = require('path')
const router = express.Router()
const { join } = require('path')
const { title } = require('process')
const Post = require(join(__dirname, '..', 'model', 'postModel.js'))



router.get('/:id', async (req, res) => {
    try {
        if (!res.locals.user) {
            return res.json({
                case: false,
                message: 'Yetkisiz erişim!'
            })
        }
        const { id } = req.params
        const data = await Post.findById(id).exec();
        

        let fileName = data.path
        let pathName = join(__dirname, '..', 'public', fileName)

        fs.unlink(pathName, (err) => {
            if (err) {
                console.log(err)
            }
        })

        return res.render('site/edit', {
            data: data.toJSON()
            

        })
        
    } catch (error) {
        console.log(error)
        return res.redirect('/error')
    }
})

router.post('/', async (req, res) => {
    try {
        if (!res.locals.user) {
            return res.json({
                case: false,
                message: 'Yetkisiz erişim!'
            })
        }
        
        const { titleContent, postContent, authorContent, id } = req.body
        const { file } = req.files
        if (!req.body || !req.files) {
            return res.json({
                case: false,
                message: 'Veri iletilemedi'
            })
        }

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

                    Post.findByIdAndUpdate(id, {
                        $set: {
                            "title": titleContent,
                            "post": postContent,
                            "author": authorContent,
                            path: `/img/content/${uniqueName}`
                        }
                    }).then(() => {
                        return res.json({
                            case: true,
                            message: 'Veri başarılı bir şekilde güncellendi'
                        })
                    }).catch(err => {
                        console.log(err)
                        return res.json({
                            case: false,
                            message: 'Bir hata oluştu'
                        })
                    })
                }
            })




        }


    } catch (error) {
        console.log(error)
        return res.redirect('/error')
    }
})

module.exports = router