"use client"

import * as React from "react"

import Link from "next/link"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Icons } from "@/app/login/components/icons"
import { useToast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

const formSchema = z.object({
    username: z.string()
        .min(2, { message: "WatIAM must be at least 2 characters." })
        .max(8, { message: "WatIAM must be at most 8 characters." })
        .regex(/^[a-z0-9]*$/, { message: "Only lowercase letters and numbers are allowed." })
        .regex(/^[a-z][a-z0-9]*$/, { message: "WatIAM must start with a lowercase letter." })
})

export default function AuthenticationPage() {
    const [isSuccessful, setIsSuccessful] = React.useState<boolean>(false)
    const [username, setUsername] = React.useState<string>("")
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const { toast } = useToast()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
        },
    })

    const showErrorToast = ({ title, description }: { title?: string; description?: string } = {}) => {
        toast({
            variant: "destructive",
            title: title || "Uh oh! Something went wrong.",
            description: description || "Sorry, we messed up somewhere. We'll fix it soon."
        });
    };

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        console.log(values)

        const url = `${process.env.NEXT_PUBLIC_API_URL}/login/${values.username}`;

        try {
            const response = await fetch(url, { method: 'POST' });
            // 429: rate limit exceeded, 401: token expired, 403: forbidden
            if (!response.ok) {
                showErrorToast()
            } else {
                setIsSuccessful(true)
                setUsername(values.username)
            }
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
            showErrorToast()
        } finally {
            setIsLoading(false)
        }

        // FOR TESTING ONLY
        // setTimeout(() => {
        //     setIsLoading(false)
        //     showErrorToast({
        //         title: "Slow down there buddy!",
        //         description: "Please wait a few minutes before sending another link.",
        //     })
        //     setIsSuccessful(true)
        // }, 500)
    }

    let content;
    if (!isSuccessful) {
        content = <>
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                    Log In with WatIAM
                </h1>
                <p className="text-sm text-muted-foreground">
                    We&apos;ll send a link to your @uwaterloo.ca email
                </p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                    <div className="grid gap-2">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            placeholder="n42chen"
                                            autoCapitalize="none"
                                            autoComplete="username"
                                            autoCorrect="off"
                                            disabled={isLoading}
                                            {...field} />
                                    </FormControl>
                                    <FormDescription>
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Send
                        </Button>
                    </div>
                </form>
            </Form>
            {/* <p className="px-8 text-center text-sm text-muted-foreground">
                By clicking send, you agree to our{" "}<br />
                <Link
                    href="/terms"
                    className="underline underline-offset-4 hover:text-primary"
                >
                    Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                    href="/privacy"
                    className="underline underline-offset-4 hover:text-primary"
                >
                    Privacy Policy
                </Link>
                .
            </p> */}
        </>
    } else {
        content =
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                    Thanks!
                </h1>
                <p className="text-sm text-muted-foreground">
                    We&apos;ve sent a link to {username}@uwaterloo.ca
                </p>
                <p className="text-sm text-muted-foreground line-through">
                    Your email may take up to 5 minutes.
                </p>
                <p className="text-sm text-muted-foreground italic">
                    jk we fixed it, it&apos;s blazing fast now 🚀
                </p>
            </div>
    }

    return (
        <div className="p-8 rounded border bg-background max-w-96 m-auto">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 animate-fade">
                {content}
            </div>
        </div>
    )

}
