"use client"

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Check, Trash, X } from "lucide-react";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { useRouter } from 'next/navigation'
import { notFound } from 'next/navigation';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const ADMIN_CARD_DATA = [
    {
        title: "Stage",
        description: "Update the current stage",
        placeholder: "Enter stage",
        buttonText: "Update Stage",
        fetchUrl: `${process.env.NEXT_PUBLIC_API_URL}/admin/stage`,
        updateUrl: `${process.env.NEXT_PUBLIC_API_URL}/admin/stage`,
        inputType: "dropdown",
        dataKey: "isRankingStage",
        toastTitle: "Update Successful",
        toastDescription: "Ranking stage updated",
        dropdownOptions: [
            { label: "Ranking Stage", value: true },
            { label: "Interview Stage", value: false },
        ],
    },
    {
        title: "Cycle",
        description: "Update the current cycle",
        placeholder: "Enter cycle",
        buttonText: "Update Cycle",
        fetchUrl: `${process.env.NEXT_PUBLIC_API_URL}/admin/cycle`,
        updateUrl: `${process.env.NEXT_PUBLIC_API_URL}/admin/cycle`,
        inputType: "number",
        dataKey: "cycle",
        toastTitle: "Update Successful",
        toastDescription: "Cycle updated",
        dropdownOptions: undefined,
    },
    {
        title: "Term",
        description: "Update the current term",
        placeholder: "Enter term",
        buttonText: "Update Term",
        fetchUrl: `${process.env.NEXT_PUBLIC_API_URL}/admin/season`,
        updateUrl: `${process.env.NEXT_PUBLIC_API_URL}/admin/season`,
        inputType: "dropdown",
        dataKey: "season",
        toastTitle: "Update Successful",
        toastDescription: "Season updated",
        dropdownOptions: [
            { label: "Fall", value: "Fall" },
            { label: "Spring", value: "Spring" },
            { label: "Winter", value: "Winter" },
        ],
    },
    // TODO: remove current year and just get year from POSTGRES
    {
        title: "Year",
        description: "Update the current year",
        placeholder: "Enter year",
        buttonText: "Update Year",
        fetchUrl: `${process.env.NEXT_PUBLIC_API_URL}/admin/year`,
        updateUrl: `${process.env.NEXT_PUBLIC_API_URL}/admin/year`,
        inputType: "number",
        dataKey: "year",
        toastTitle: "Update Successful",
        toastDescription: "Year updated",
        dropdownOptions: undefined,
    },
];

interface AdminCardProps {
    title: string;
    description: string;
    placeholder: string;
    buttonText: string;
    fetchUrl: string;
    updateUrl: string;
    inputType: 'text' | 'number' | 'dropdown' | 'boolean';
    dataKey: string;
    token: string;
    toastTitle: string;
    toastDescription: string;
    dropdownOptions?: { label: string; value: string | number | boolean }[];
}

const AdminCard: React.FC<AdminCardProps> = ({
    title,
    description,
    placeholder,
    buttonText,
    fetchUrl,
    updateUrl,
    inputType,
    dataKey,
    token,
    toastTitle,
    toastDescription,
    dropdownOptions
}) => {
    const { toast } = useToast()
    const [value, setValue] = useState<string>('');
    const [initialValue, setInitialValue] = useState<string>('');
    const { isAdmin } = useAuth()
    const router = useRouter()

    const showToast = () => {
        toast({
            variant: "default",
            title: toastTitle,
            description: toastDescription,
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(fetchUrl, {
                    method: "GET",
                    headers: { ...(!!token && { 'Authorization': `Bearer ${token}` }) }
                });
                const data = await response.json();
                const initialValue = String(data); // Convert the value to a string
                setValue(initialValue);
                setInitialValue(initialValue);
            } catch (error) {
                console.error('Error fetching initial value:', error);
            }
        };

        fetchData();
    }, [fetchUrl, dataKey]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const payload = inputType === 'number' ? { [dataKey]: parseFloat(value) } : { [dataKey]: value === 'true' ? true : value === 'false' ? false : value };
            console.log(payload)
            const res: any = await fetch(updateUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });
            const val: any = await res.json()
            setInitialValue(val[dataKey]);
            setValue(val[dataKey])
            showToast()
        } catch (error) {
            console.error('Error updating value:', error);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setValue(e.target.value);
    };

    const handleSelectChange = (value: string) => {
        setValue(value);
    };

    if (!isAdmin()) {
        notFound();
    };

    return (
        <Card className="m-2 w-fit">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent >
                <form onSubmit={handleSubmit} className="w-full">
                    {inputType === 'dropdown' && dropdownOptions ? (
                        <Select value={value} onValueChange={handleSelectChange} >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={placeholder} />
                            </SelectTrigger>
                            <SelectContent className="w-full">
                                {dropdownOptions?.map((option, index) => (
                                    <SelectItem key={index} value={String(option.value)}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    ) : inputType === 'boolean' ? (
                        <Select value={value} onValueChange={handleSelectChange} >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder={placeholder} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="true">True</SelectItem>
                                <SelectItem value="false">False</SelectItem>
                            </SelectContent>
                        </Select>
                    ) : (
                        <Input
                            type={inputType}
                            value={value}
                            onChange={handleChange}
                            placeholder={placeholder}
                            className="w-full"
                        />
                    )}
                    <Button className="w-full mt-4" type="submit">{buttonText}</Button>
                </form>
            </CardContent>
        </Card>
    );
};

interface ContributionLog {
    LogID: number;
    LogTime: Date;
    UID: string;
    JID: number;
    OA: boolean;
    InterviewStage: number;
    OfferCall: boolean;
}

const logColumns: ColumnDef<ContributionLog>[] = [
    {
        accessorKey: "LogID",
        header: "Log ID"
    },
    {
        accessorKey: "LogTime",
        header: "Log Time"
    },
    {
        accessorKey: "UID",
        header: "User ID"
    },
    {
        accessorKey: "JID",
        header: "Job ID"
    },
    {
        accessorKey: "OA",
        header: "OA",
        cell: ({ row }) => (
            row.original.OA ? <Check className="text-green-500" /> : <X className="text-red-500" />
        )
    },
    {
        accessorKey: "InterviewStage",
        header: "Interview Stage"
    },
    {
        accessorKey: "OfferCall",
        header: "Offer Call",
        cell: ({ row }) => (
            row.original.OfferCall ? <Check className="text-green-500" /> : <X className="text-red-500" />
        )
    },
]

interface AdminViewContribution {
    UID: string;
    JID: number;
    OA: boolean;
    InterviewStage: number;
    OfferCall: boolean;
    Company: string;
    Title: string;
}

const deleteContribution = async (jid: number, uid: string, token: string, onSuccess: () => void) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/contributions`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ jid, uid }),
        });
        if (response.ok) {
            onSuccess();
        } else {
            console.error('Failed to delete contribution');
        }
    } catch (error) {
        console.error('Error deleting contribution:', error);
    }
};

const DeleteContributionButton: React.FC<{ contribution: AdminViewContribution }> = ({ contribution }) => {
    const { toast } = useToast();
    const { token } = useAuth();

    const handleDelete = () => {
        deleteContribution(contribution.JID, contribution.UID, token || "", () => {
            toast({
                title: "Contribution Deleted",
                description: "The contribution has been successfully deleted.",
            });
        });
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm">
                    <Trash className="h-4 w-4 text-destructive" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

const contributionColumns: ColumnDef<AdminViewContribution>[] = [
    {
        id: "actions",
        cell: ({ row }) => <DeleteContributionButton contribution={row.original} />,
    },
    {
        accessorKey: "UID",
        header: "User ID"
    },
    {
        accessorKey: "OA",
        header: "OA",
        cell: ({ row }) => (
            row.original.OA ? <Check className="text-green-500" /> : <X className="text-red-500" />
        )
    },
    {
        accessorKey: "InterviewStage",
        header: "Interview Stage"
    },
    {
        accessorKey: "OfferCall",
        header: "Offer Call",
        cell: ({ row }) => (
            row.original.OfferCall ? <Check className="text-cyan-500 bg-cyan-100 rounded-full p-1" /> : <X className="text-red-500" />
        )
    },
]

interface GroupedContributions {
    [key: string]: AdminViewContribution[];
}

const ContributionsAccordion: React.FC<{ contributions: AdminViewContribution[], onDelete: (jid: number, uid: string) => void }> = ({ contributions, onDelete }) => {
    const [sortBy, setSortBy] = useState<'contributions' | 'company'>('contributions');

    const groupedContributions: GroupedContributions = contributions.reduce((acc, contribution) => {
        const key = `${contribution.Company} - ${contribution.Title} (${contribution.JID})`;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(contribution);
        return acc;
    }, {} as GroupedContributions);

    const sortedGroupedContributions = Object.entries(groupedContributions).sort((a, b) => {
        if (sortBy === 'contributions') {
            return b[1].length - a[1].length;
        } else {
            return a[0].localeCompare(b[0]);
        }
    });

    return (
        <>
            <div className="mb-4">
                <Select onValueChange={(value) => setSortBy(value as 'contributions' | 'company')}>
                    <SelectTrigger className="w-56">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="contributions">Number of Contributions</SelectItem>
                        <SelectItem value="company">Company Name</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Accordion type="single" collapsible className="w-full">
                {sortedGroupedContributions.map(([key, groupContributions], index) => {
                    const [company, rest] = key.split(' - ');
                    const offerCallCount = groupContributions.filter(c => c.OfferCall).length;
                    return (
                        <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger className="flex space-x-2">
                                <span className="bg-primary text-primary-foreground rounded-full px-2 py-1 text-sm font-bold min-w-[3rem] text-center">
                                    {groupContributions.length}
                                </span>
                                <span className={`rounded-full px-2 py-1 text-sm font-bold min-w-[3rem] text-center bg-cyan-300 ${offerCallCount === 0 ? 'invisible' : ''}`}>
                                    {offerCallCount}
                                </span>
                                <span className="text-lg font-bold w-96 text-left">{company}</span>
                                <span className="text-sm text-left flex-grow">{rest}</span>
                            </AccordionTrigger>
                            <AccordionContent>
                                <DataTable columns={contributionColumns} data={groupContributions} />
                            </AccordionContent>
                        </AccordionItem>
                    );
                })}
            </Accordion>
        </>
    );
};

export default function AdminPage() {
    const { token, authIsLoading } = useAuth()
    const [contributionLogs, setContributionLogs] = useState<ContributionLog[]>([])
    const [contributions, setContributions] = useState<AdminViewContribution[]>([])

    const fetchContributionLogs = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/contribution_logs`, {
                method: "GET",
                headers: { ...(!!token && { 'Authorization': `Bearer ${token}` }) }
            });
            const data = await response.json();
            const formattedData = data.map((entry: ContributionLog) => {
                const date = new Date(entry.LogTime);
                const formattedLogTime = `${date.toLocaleDateString('en-US')} ${date.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                })}`;
                return {
                    ...entry,
                    LogTime: formattedLogTime
                };
            });
            setContributionLogs(formattedData);
        } catch (error) {
            console.error('Error fetching contribution logs:', error);
        }
    };

    const fetchContributions = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/contributions`, {
                method: "GET",
                headers: { ...(!!token && { 'Authorization': `Bearer ${token}` }) }
            });
            const data = await response.json();
            setContributions(data);
        } catch (error) {
            console.error('Error fetching contributions:', error);
        }
    };

    useEffect(() => {
        if (!authIsLoading) {
            fetchContributionLogs();
            fetchContributions();
        }
    }, [authIsLoading])

    if (authIsLoading) {
        return <div>Loading...</div>;
    }
    return (
        <div className="px-4 flex flex-col gap-4">
            <Card>
                <CardHeader>
                    <CardTitle>Status</CardTitle>
                    <CardDescription>Update current statuses of the platform</CardDescription>
                </CardHeader>
                <CardContent className="justify-center items-center flex flex-wrap">
                    {ADMIN_CARD_DATA.map((card, index) => (
                        <AdminCard
                            key={index}
                            title={card.title}
                            description={card.description}
                            placeholder={card.placeholder}
                            buttonText={card.buttonText}
                            fetchUrl={card.fetchUrl}
                            updateUrl={card.updateUrl}
                            inputType={card.inputType as any}
                            dataKey={card.dataKey}
                            token={token || ""}
                            toastTitle={card.toastTitle}
                            toastDescription={card.toastDescription}
                            dropdownOptions={card.dropdownOptions}
                        />
                    ))}
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Contributions</CardTitle>
                    <CardDescription>View and delete contributions</CardDescription>
                </CardHeader>
                <CardContent>
                    <ContributionsAccordion
                        contributions={contributions}
                        onDelete={(jid, uid) => {
                            deleteContribution(jid, uid, token || "", () => {
                                fetchContributions();
                            });
                        }}
                    />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Logs</CardTitle>
                    <CardDescription>View logs for recent contributions</CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable columns={logColumns} data={contributionLogs} />
                </CardContent>
            </Card>
        </div>
    )
}
