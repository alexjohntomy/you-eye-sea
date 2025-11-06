"use server"
import prisma from '@/lib/prisma'

//have not yet created this table in prisma. may just manually create in GUI

interface Comment {
    id?: number;
    comment: string
    date?: string
    author?: string
    courseInstanceID?: number
    courseID: string
    courseNumber: number
}

export async function postComment(userComment : Comment) {
    await prisma.comment.create({
        data: userComment
    })
}

//this is in _util folder
//plan is to have separate comment component that then calls this once user presses button after typing input
//technically course instance ID might be better but the ID would be collected from the page slug, and that as of 
//now only contains something like CS-202
//i think definitely not going to have semester level granularity in the urls right now, maybe could add professor
//though...
//ideally it would make sense to take the user to the main page, and then have them choose the specific professor.
//so basically need to implement something where URL is appended with ?professor=Katok_Zoe
//this would be enabled by user selecting it in a dropdown (technically could be from search page)
//but then adds hassle of needing to implement a "all sections" thing for each class in the search results
//slightly worse ux, better ux for me

//for now just will implement comments generally. this type of specific filtering can be added later.