"use client"
import { useRouter } from 'next/navigation';

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { useState } from "react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"

import { postComment } from "@/app/_util/postComment" 

interface testProps {
    comments: any
    parsedSlug: string[]
    professorID: any
}

import { Filter } from 'bad-words'

const filter = new Filter()

function CommentsPane({comments, parsedSlug, professorID} : testProps) {
    const router = useRouter();
    const [value, setValue] = useState("");
    const handleValueChange : any = (event: any) => {
        if (event.target.value.length <= 280) {
            setValue(event.target.value)
        }
    }

    return (
        <div className="w-full h-full flex flex-col">
            {/* gradient overlay */}
            <div className='pointer-events-none absolute inset-x-0 bottom-35 h-30 bg-transparent md:bg-linear-to-t from-background/90 to-background/0'></div>
                <div className="flex flex-col w-full py-2 overflow-y-scroll gap-3">
                        <div className="flex flex-col w-full md:min-h-screen max-h-10/12 gap-3">
                        {comments.map((eachComment : any) => (
                            <Card key={eachComment.id}  className = "border-foreground/20 rounded-md gap-1 py-3 px-3 w-full">
                                <h3 className="text-sm text-foreground/80 font-black">{eachComment.comment}</h3>
                                <span className="flex flex-row justify-between opacity-60">
                                    <h4 className="text-xs text-left inline-block text-uic-red-700">{eachComment.author}</h4>
                                    <h4 className="text-xs text-left inline-block text-foreground/40">//</h4>
                                    <h4 className="text-xs text-right inline-block text-foreground">{eachComment.date.toLocaleDateString('en-US')}</h4>
                                </span>
                            </Card>
                        ))}
                        </div>
                </div>

                <div className='py-6'>
                    <InputGroup className="overflow-y rounded-sm border-2 border-uic-navy-800/40 focus-visible:ring-0 bg-background">
                        <InputGroupTextarea className="text-xs resize-none border-none shadow-none" placeholder="Post a short tip you have for this course..." value = {value} onChange={handleValueChange}/>
                        <InputGroupAddon align="block-end">
                            <InputGroupText className="ml-auto">{value.length}/280</InputGroupText>
                                <InputGroupButton
                                variant="outline"
                                className="rounded-md w-20 text-foreground border border-secondary/50"
                                size="icon-xs"
                                onClick={() => {
                                    if (filter.isProfane(value)) {
                                        setValue("Don't use profanity please.")
                                    }
                                    else if (value.trim().length > 1) {
                                        postComment(
                                        // Defining comment object
                                        {
                                        comment: value,
                                        author: "Anonymous Fireball",
                                        courseID: parsedSlug[0],
                                        courseNumber: parseInt(parsedSlug[1]),
                                        }
                                        ),
                                        setValue(""),
                                        router.refresh()
                                    }
                                    }}
                                >Submit
                                </InputGroupButton>
                        </InputGroupAddon>
                    </InputGroup>
                </div>
        </div>
    )
}


export { CommentsPane }