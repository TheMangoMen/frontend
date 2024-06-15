import { ModeToggle } from "../../components/ui/mode-toggle"
import Stepper from "../../components/ui/stepper"
import { columns } from "./columns"
import { Job } from "./job"
import { Status } from "./status"
import { JobTable } from "./job-table"


async function getData(): Promise<Job[]> {
  // Fetch data from your API here.
  return [
    {
      watching: true,
      jID: 1,
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
      jID: 2,
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
      jID: 3,
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
      jID: 4,
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
      jID: 5,
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
      jID: 6,
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
      jID: 7,
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
      jID: 8,
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
      jID: 9,
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
      jID: 10,
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
      jID: 11,
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
      jID: 12,
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
      jID: 13,
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
      jID: 14,
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
      jID: 15,
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
      jID: 16,
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
      jID: 17,
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
      jID: 18,
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
      jID: 19,
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
      jID: 20,
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
      jID: 21,
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
      <JobTable columns={columns} data={data}/>
    </div>
    
  )
}
