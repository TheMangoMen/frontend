"use client"

import { useEffect, useState, ChangeEvent, FormEvent } from "react";

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
    dropdownOptions?: { label: string; value: string | number }[];
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
    dropdownOptions
}) => {
    const [value, setValue] = useState<string>('');
    const [initialValue, setInitialValue] = useState<string>('');

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
            console.log("success")
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

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    {inputType === 'dropdown' && dropdownOptions ? (
                        <Select value={value} onValueChange={handleSelectChange}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder={placeholder} />
                            </SelectTrigger>
                            <SelectContent>
                                {dropdownOptions?.map((option, index) => (
                                    <SelectItem key={index} value={String(option.value)}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    ) : inputType === 'boolean' ? (
                        <Select value={value} onValueChange={handleSelectChange}>
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
                        />
                    )}
                    <Button type="submit">{buttonText}</Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default function AdminPage() {
    const { token, authIsLoading } = useAuth()

    if (authIsLoading) {
        return <div>Loading...</div>;
    }
    return (
        <div className="px-10">
            <AdminCard
                title="Update Stage"
                description="Update the current stage"
                placeholder="Enter stage"
                buttonText="Update Stage"
                fetchUrl={`${process.env.NEXT_PUBLIC_API_URL}/admin/stage`}
                updateUrl={`${process.env.NEXT_PUBLIC_API_URL}/admin/stage`}
                inputType="boolean"
                dataKey="isRankingStage"
                token={token || ""}
            />
            <AdminCard
                title="Update Year"
                description="Update the current year"
                placeholder="Enter year"
                buttonText="Update Year"
                fetchUrl={`${process.env.NEXT_PUBLIC_API_URL}/admin/year`}
                updateUrl={`${process.env.NEXT_PUBLIC_API_URL}/admin/year`}
                inputType="number"
                dataKey="year"
                token={token || ""}
            />
            <AdminCard
                title="Update Season"
                description="Update the current season"
                placeholder="Enter season"
                buttonText="Update Season"
                fetchUrl={`${process.env.NEXT_PUBLIC_API_URL}/admin/season`}
                updateUrl={`${process.env.NEXT_PUBLIC_API_URL}/admin/season`}
                inputType="dropdown"
                dataKey="season"
                token={token || ""}
                dropdownOptions={
                    [
                        { label: "Fall", value: "Fall" },
                        { label: "Spring", value: "Spring" },
                        { label: "Winter", value: "Winter" },
                    ]
                }
            />
            <AdminCard
                title="Update Cycle"
                description="Update the current cycle"
                placeholder="Enter cycle"
                buttonText="Update Cycle"
                fetchUrl={`${process.env.NEXT_PUBLIC_API_URL}/admin/cycle`}
                updateUrl={`${process.env.NEXT_PUBLIC_API_URL}/admin/cycle`}
                inputType="number"
                dataKey="cycle"
                token={token || ""}
            />
            {/* <AdminCard */}
            {/*     title="Update Cycle" */}
            {/*     description="Update the current cycle" */}
            {/*     placeholder="Enter cycle" */}
            {/*     buttonText="Update Cycle" */}
            {/*     fetchUrl={`${process.env.NEXT_PUBLIC_API_URL}/admin/cycle`} */}
            {/*     updateUrl={`${process.env.NEXT_PUBLIC_API_URL}/admin/cycle`} */}
            {/*     inputType="dropdown" */}
            {/*     dataKey="cycle" */}
            {/*     token={token || ""} */}
            {/*     dropdownOptions={ */}
            {/*         [ */}
            {/*             { label: "Cycle 1", value: 1 }, */}
            {/*             { label: "Cycle 2", value: 2 }, */}
            {/*             { label: "Cycle 3", value: 3 }, */}
            {/*             { label: "Cycle 4", value: 4 }, */}
            {/*             { label: "Cycle 5", value: 5 }, */}
            {/*             { label: "Cycle 6", value: 6 }, */}
            {/*         ] */}
            {/*     } */}
            {/* /> */}
            {/* TODO: ContributionLogs */}
        </div>
    )
}

