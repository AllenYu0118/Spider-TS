import fs from 'fs'
import path from 'path'

import superagent from 'superagent'
import cheerio from 'cheerio'

interface Course {
    title: string,
    count: number,
    url: string
}

interface CourseResult {
    time: number
    data: Course[]
}

interface Content {
    [propName: number]: Course[]
}

class Crowller {
    private secret = 'soga9527'
    private url = `http://www.dell-lee.com/?secret=${this.secret}`

    constructor() {
        this.initSpiderProcess()
    }

    getCourseInfo(html: string) {
        const $ = cheerio.load(html)
        const courseItems = $('.course-link')
        const courseInfos: Course[] = []
        courseItems.map((index, element) => {
            const url = $(element).attr('href') || 'can\'t find href'
            const title = $(element).find('.course-desc').text()
            const count = Math.floor(Math.random() * 100 + 1)

            courseInfos.push({ title, count, url })
        })

        return {
            time: new Date().getTime(),
            data: courseInfos
        }
    }

    async getRawHtml() {
        const result = await superagent.get(this.url)
        return result.text
    }

    generateJsonContent(courseInfo: CourseResult) {
        const filePath = path.resolve(__dirname, '../data/course.json')
        let fileContent: Content = {}
        if (fs.existsSync(filePath)) {
            fileContent = JSON.parse(fs.readFileSync(filePath, 'utf8'))
        }

        fileContent[courseInfo.time] = courseInfo.data

        return fileContent
    }

    async initSpiderProcess() {
        const filePath = path.resolve(__dirname, '../data/course.json')
        const html = await this.getRawHtml()
        const courseInfo = this.getCourseInfo(html)
        const fileContent = this.generateJsonContent(courseInfo)
        fs.writeFileSync(filePath, JSON.stringify(fileContent))
    }
}


const crowller = new Crowller()