import { Status } from "./status"
export type Job = {
    watching: boolean
    jID: number
    title: string
    company: string
    location: string
    openings: number
    stages: Status[]
}
