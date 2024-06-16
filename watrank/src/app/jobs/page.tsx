import { columns } from "./columns"
import { Job } from "./job"
import { Status } from "./status"
import { JobTable } from "./job-table"


async function getData(): Promise<Job[]> {
  // Fetch data from your API here.
    const response = await fetch(`http://localhost:8080/jobs/j12cole`);
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
   
    const data = await response.json();
    console.log(data);
    return data;
}
 


export default async function JobPage() {


  const data = await getData()
  
  return (
    <div className="px-10">
      <JobTable columns={columns} data={data}/>
    </div>
    
  )
}
