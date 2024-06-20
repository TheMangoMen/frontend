"use client";
import { Job } from "./job";
import { ColumnDef, Row } from "@tanstack/react-table";
import { EditIcon } from "lucide-react";
import { StarFilledIcon } from "@radix-ui/react-icons";
import Stepper from "@/components/ui/stepper";
import { Status } from "./status";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

const StageEnum = z.enum([
  "Ghosted :(",
  "OA",
  "Interview 1",
  "Interview 2",
  "Interview 3",
  "Offer Call",
]);

const formSchema = z.object({
  status: StageEnum,
});

const Loading = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function Skeley(props, forwardedRef) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-primary/10",
        "w-[24px] h-[24px] bg-zinc-100 dark:bg-muted",
      )}
      {...props}
      ref={forwardedRef}
    />
  );
});

function Contribute({ row }: { row: Row<Job> }) {
  const { token, isLoggedIn, authIsLoading } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  // const [selectedStatus, setSelectedStatus] = React.useState<Stage | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: "Ghosted :(",
    },
  });

  const showErrorToast = () =>
    toast({ variant: "destructive", title: "An error occured." });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const data = {
      jid: row.getValue("jid"),
      oa: values.status === StageEnum.enum["OA"],
      interviewstage: ["Interview 1", "Interview 2", "Interview 3"].includes(
        values.status,
      )
        ? parseInt(values.status.split(" ")[1])
        : 0,
      offercall: values.status === StageEnum.enum["Offer Call"],
    };
    // console.log(data)
    // console.log(process.env.NEXT_PUBLIC_API_URL)
    // return

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/contribution`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );
      if (!response.ok) {
        showErrorToast();
      } else {
        toast({ title: "Thank you for your contribution!" });
        setOpen(false);
      }
    } catch (error) {
      console.error(error);
      showErrorToast();
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <TooltipProvider>
        <DialogTrigger disabled={!isLoggedIn()}>
          <Tooltip>
            <TooltipTrigger asChild>
              {authIsLoading ? (
                <Loading />
              ) : (
                <EditIcon color={isLoggedIn() ? "currentColor" : "gray"} />
              )}
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {isLoggedIn()
                  ? "Contribute your status"
                  : "Log in to contribute"}
              </p>
            </TooltipContent>
          </Tooltip>
        </DialogTrigger>
      </TooltipProvider>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {row.getValue("title")}
            <span className="text-primary"> @ </span>
            {row.getValue("company")}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What&apos;s your status?</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger id="status" className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent position="popper">
                      {Object.keys(StageEnum.enum).map((stage) => (
                        <SelectItem key={stage} value={stage}>
                          {stage}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {/* <FormDescription>
                                    We
                                </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Contribute</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
function Watching({ row }: { row: Row<Job> }) {
  const { token, isLoggedIn, authIsLoading } = useAuth();
  const { toast } = useToast();
  const [watching, setWatching] = React.useState(false);

  const showErrorToast = () =>
    toast({
      variant: "destructive",
      title: "An error occurred while trying to update your watchlist.",
    });

  async function toggleWatch(isWatching: boolean) {
    const data = {
      jid: row.getValue("jid"),
      delete: isWatching,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/watching`,
        {
          method: "POST",
          headers: {
            ...(!!token && { Authorization: `Bearer ${token}` }),
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );
      if (!response.ok) {
        showErrorToast();
      } else {
        setWatching(!watching);
        toast({ title: "Updated your watch list!" });
      }
    } catch (error) {
      console.error(error);
      showErrorToast();
    }
  }

  // Use useEffect to set the initial state
  React.useEffect(() => {
    setWatching(row.getValue("watching") ?? false);
  }, [row]);

  return (
    <div className="h-full w-full flex justify-center">
      <Button
        disabled={!isLoggedIn()}
        onClick={() => toggleWatch(watching)}
        key={row.id}
        className={`text-primary ${!watching && "text-transparent"} ${
          isLoggedIn() ? "hover:text-primary" : "hover:gray"
        } h-full flex p-1`}
        variant="ghost"
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipContent>
              <p>
                {isLoggedIn()
                  ? "Update your watch list"
                  : "Log in to start a watch list."}
              </p>
            </TooltipContent>
            <TooltipTrigger>
              <StarFilledIcon />
            </TooltipTrigger>
          </Tooltip>
        </TooltipProvider>
      </Button>
    </div>
  );
}
export const columns: ColumnDef<Job>[] = [
  {
    accessorKey: "watching",
    header: "",
    cell: ({ row }) => {
      return <Watching row={row} />;
    },
    enableHiding: false,
  },
  {
    accessorKey: "jid",
    header: "ID",
  },
  {
    accessorKey: "title",
    header: "Title",
    enableHiding: false,
    cell: ({ row }) => {
      const title: string = row.getValue("title");
      return <div className="w-48">{title}</div>;
    },
  },
  {
    accessorKey: "company",
    header: "Company",
    enableHiding: false,
    cell: ({ row }) => {
      const company: string = row.getValue("company");
      return <div className="max-w-40">{company}</div>;
    },
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "openings",
    header: "Openings",
  },
  {
    accessorKey: "stages",
    header: "Status",
    enableHiding: false,
    cell: ({ row }) => {
      const stages: Status[] = row.getValue("stages");
      return <Stepper key={row.id} steps={stages} />;
    },
  },
  {
    accessorKey: "",
    id: "contribute",
    header: "",
    cell: ({ row }) => {
      return <Contribute row={row} />;
    },
    enableHiding: false,
  },
];
