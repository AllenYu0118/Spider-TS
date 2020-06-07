import { Router } from 'express'

import Crowller from './crowller'
import DellAnalyzer from './dellAnalyzer'

const router = Router()


router.get('/', (req, res) => {
    res.send('Hello World!')
})

router.get('/getData', (req, res) => {
    const secret = 'soga9527'
    const url = `http://www.dell-lee.com/?secret=${secret}`
    const analyzer = DellAnalyzer.getInsatance()

    new Crowller(url, analyzer)
    res.send('getData Success!')
})

export default router