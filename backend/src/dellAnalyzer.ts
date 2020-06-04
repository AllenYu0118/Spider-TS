import fs from 'fs'
import cheerio from 'cheerio'
import { Analyzer } from './crowller'

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


export default class DellAnalyzer implements Analyzer {
    private getCourseInfo(html: string) {
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

    generateJsonContent(courseInfo: CourseResult, filePath: string) {
        let fileContent: Content = {}
        if (fs.existsSync(filePath)) {
            fileContent = JSON.parse(fs.readFileSync(filePath, 'utf8'))
        }

        fileContent[courseInfo.time] = courseInfo.data

        return fileContent
    }

    public analyze(html: string, filePath: string) {
        const courseInfo = this.getCourseInfo(html)
        const fileContent = this.generateJsonContent(courseInfo, filePath)

        return JSON.stringify(fileContent)
    }
}