import fs from 'fs'
import path from 'path'
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
    private filePath = path.resolve(__dirname, '../../data/course.json')

    private static instance: DellAnalyzer

    static getInsatance() {
        if (!DellAnalyzer.instance) {
            DellAnalyzer.instance = new DellAnalyzer()
        }

        return DellAnalyzer.instance
    }

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

    private writeFile(content: string) {
        fs.writeFileSync(this.filePath, content)
    }

    private generateJsonContent(courseInfo: CourseResult) {
        let fileContent: Content = {}
        if (fs.existsSync(this.filePath)) {
            fileContent = JSON.parse(fs.readFileSync(this.filePath, 'utf8'))
        }
        fileContent[courseInfo.time] = courseInfo.data
        return fileContent
    }

    public analyze(html: string) {
        const courseInfo = this.getCourseInfo(html)
        const fileContent = this.generateJsonContent(courseInfo)
        this.writeFile(JSON.stringify(fileContent))
        return JSON.stringify(fileContent)
    }
}