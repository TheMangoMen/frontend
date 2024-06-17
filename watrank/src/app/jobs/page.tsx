import { columns } from "./columns"
import { Job } from "./job"
import { JobTable } from "./job-table"

async function getData(): Promise<Job[]> {
    // Fetch data from your API here.

    // const response = await fetch(`http://localhost:8080/jobs?uID=j12cole`);
    // if (!response.ok) {
    //     throw new Error(`HTTP error! Status: ${response.status}`);
    // }

    // const data = await response.json();
    // console.log(data);
    // return data;
    return [
        {
            watching: true,
            jid: 1,
            title: "Frontend Developer",
            company: "CodeMasters",
            location: "San Francisco, CA",
            openings: 3,
            stages: [
                { name: "OA", count: 10 },
                { name: "Interview 1", count: 5 },
                { name: "Offer", count: 2 }
            ]
        },
        {
            watching: false,
            jid: 2,
            title: "Backend Engineer",
            company: "Data Solutions",
            location: "New York, NY",
            openings: 2,
            stages: [
                { name: "Offer", count: 3 },
                { name: "OA", count: 2 },
                { name: "Interview 2", count: 4 }
            ]
        },
        {
            watching: true,
            jid: 3,
            title: "Product Manager",
            company: "InnovateTech",
            location: "Austin, TX",
            openings: 1,
            stages: [
                { name: "Interview 3", count: 7 },
                { name: "OA", count: 4 }
            ]
        },
        {
            watching: false,
            jid: 4,
            title: "HR Coordinator",
            company: "People Connect",
            location: "Chicago, IL",
            openings: 4,
            stages: [
                { name: "OA", count: 12 },
                { name: "Interview 1", count: 3 }
            ]
        },
        {
            watching: true,
            jid: 5,
            title: "Digital Marketing Specialist",
            company: "MarketWiz",
            location: "Los Angeles, CA",
            openings: 2,
            stages: [
                { name: "Offer", count: 8 },
                { name: "Interview 2", count: 5 }
            ]
        },
        {
            watching: false,
            jid: 6,
            title: "Data Scientist",
            company: "BigData Co.",
            location: "Seattle, WA",
            openings: 3,
            stages: [
                { name: "Interview 1", count: 9 },
                { name: "OA", count: 6 }
            ]
        },
        {
            watching: true,
            jid: 7,
            title: "DevOps Engineer",
            company: "CloudWorks",
            location: "Denver, CO",
            openings: 1,
            stages: [
                { name: "OA", count: 6 },
                { name: "Offer", count: 2 }
            ]
        },
        {
            watching: false,
            jid: 8,
            title: "Content Writer",
            company: "CreativeWriters",
            location: "Boston, MA",
            openings: 2,
            stages: [
                { name: "Offer", count: 7 },
                { name: "Interview 1", count: 4 }
            ]
        },
        {
            watching: true,
            jid: 9,
            title: "Sales Manager",
            company: "SalesPros",
            location: "Phoenix, AZ",
            openings: 4,
            stages: [
                { name: "Interview 2", count: 4 },
                { name: "OA", count: 3 }
            ]
        },
        {
            watching: false,
            jid: 10,
            title: "Network Security Specialist",
            company: "SecureNet",
            location: "Houston, TX",
            openings: 3,
            stages: [
                { name: "OA", count: 11 },
                { name: "Offer", count: 6 }
            ]
        },
        {
            watching: true,
            jid: 11,
            title: "Graphic Designer",
            company: "DesignStudio",
            location: "San Diego, CA",
            openings: 1,
            stages: [
                { name: "Offer", count: 2 },
                { name: "Interview 1", count: 3 }
            ]
        },
        {
            watching: false,
            jid: 12,
            title: "Software Engineer",
            company: "TechSolutions",
            location: "Miami, FL",
            openings: 2,
            stages: [
                { name: "Interview 2", count: 10 },
                { name: "OA", count: 5 }
            ]
        },
        {
            watching: true,
            jid: 13,
            title: "Business Analyst",
            company: "BusinessGenius",
            location: "Atlanta, GA",
            openings: 3,
            stages: [
                { name: "OA", count: 3 },
                { name: "Offer", count: 4 },
                { name: "Interview 1", count: 2 }
            ]
        },
        {
            watching: false,
            jid: 14,
            title: "Customer Support Representative",
            company: "SupportHub",
            location: "Dallas, TX",
            openings: 4,
            stages: [
                { name: "Offer", count: 5 },
                { name: "Interview 2", count: 6 }
            ]
        },
        {
            watching: true,
            jid: 15,
            title: "Project Manager",
            company: "ProjectPros",
            location: "Orlando, FL",
            openings: 1,
            stages: [
                { name: "Interview 1", count: 8 },
                { name: "OA", count: 2 }
            ]
        },
        {
            watching: false,
            jid: 16,
            title: "Quality Assurance Engineer",
            company: "QualityFirst",
            location: "Las Vegas, NV",
            openings: 2,
            stages: [
                { name: "OA", count: 7 },
                { name: "Offer", count: 3 }
            ]
        },
        {
            watching: true,
            jid: 17,
            title: "IT Support Technician",
            company: "TechSupport",
            location: "Portland, OR",
            openings: 3,
            stages: [
                { name: "Offer", count: 6 },
                { name: "Interview 1", count: 5 }
            ]
        },
        {
            watching: false,
            jid: 18,
            title: "Operations Analyst",
            company: "OpsInsight",
            location: "Charlotte, NC",
            openings: 4,
            stages: [
                { name: "Interview 2", count: 12 },
                { name: "OA", count: 8 }
            ]
        },
        {
            watching: true,
            jid: 19,
            title: "Marketing Manager",
            company: "BrandSavvy",
            location: "Nashville, TN",
            openings: 2,
            stages: [
                { name: "OA", count: 9 },
                { name: "Offer", count: 4 }
            ]
        },
        {
            watching: false,
            jid: 20,
            title: "Cloud Engineer",
            company: "SkyTech",
            location: "San Jose, CA",
            openings: 1,
            stages: [
                { name: "Offer", count: 3 },
                { name: "Interview 1", count: 2 }
            ]
        },
        {
            watching: true,
            jid: 21,
            title: "Machine Learning Engineer",
            company: "AI Innovators",
            location: "San Francisco, CA",
            openings: 2,
            stages: [
                { name: "Interview 3", count: 7 },
                { name: "OA", count: 4 }
            ]
        },
    ]
}

export default async function JobPage() {
    const data = await getData()

    return (
        <div className="px-10">
            <JobTable columns={columns} data={data} />
        </div>
    )

}
