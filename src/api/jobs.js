import supabaseClient from "../utils/supabase"

export async function getJobs(token, { location, company_id, searchQuery}) {
    const supabase = await supabaseClient(token)

   let query = supabase
    .from('jobs')
    .select('*, company:companies(name, logo_url), saved: saved_jobs(id)');

   if(location) {
    query = query.eq('location', location)
   }

   if(company_id) {
    query = query.eq('company_id', company_id)
   }

   if(searchQuery) {
    query = query.ilike('title', `%${searchQuery}%`)
   }

   const { data, error } = await query;

   if(error) {
    console.log("Error fetching jobs", error)
    throw error;
   }

   return data;
   

}

export async function saveJob(token, { alreadySaved }, savedData) {
    const supabase = await supabaseClient(token)

    if(alreadySaved) {
        const { data, error: deleteError } = await supabase
        .from('saved_jobs')
        .delete()
        .eq('job_id', savedData.job_id)

        if(deleteError) {
            console.log("Error deleting saved job", deleteError)
            throw deleteError;
        }

        return data;
    } else {
        const { data, error: saveError } = await supabase
        .from('saved_jobs')
        .insert([savedData])
        .select()

        if(saveError) {
            console.log("Error saving job", saveError)
            throw saveError;
        }

        return data;
    }
}

export async function getSavedJobs(token) {
    const supabase = await supabaseClient(token)

    const { data, error } = await supabase
    .from('saved_jobs')
    .select('*, job: jobs(*, company: companies(name, logo_url))')

    if(error) {
        console.log("Error fetching saved jobs", error)
        throw error;
    }

    return data;
}

export async function getJob(token, { job_id }) {
    const supabase = await supabaseClient(token)

    let query = supabase
    .from('jobs')
    .select('*, company: companies(name, logo_url), applications: applications(*)')
    .eq('id', job_id)
    .single()

    const { data, error } = await query;

    if(error) {
        console.log("Error fetching job", error)
        throw error;
    }

    console.log(data);
    return data;
    

}

export async function updateJobStatus(token, { job_id }, isOpen) {
    const supabase = await supabaseClient(token);

    const { data, error } = await supabase
    .from('jobs')
    .update({ isOpen })
    .eq('id', job_id)
    .single()

    if(error) {
        console.log("Error updating job status", error)
        throw error;
    }

    return data;
}

export async function createJob(token, _, jobData) {
    const supabase = await supabaseClient(token);

    const { data, error } = await supabase
    .from('jobs')
    .insert([jobData])
    .select()

    if(error) {
        console.log("Error creating job", error)
        throw error;
    }

    return data;
}

export async function getMyJobs(token, { recruiter_id}) {
    const supabase = await supabaseClient(token);

    const { data, error } = await supabase
    .from('jobs')
    .select('*, company: companies(name, logo_url)')
    .eq('recruiter_id', recruiter_id)

    if(error) {
        console.log("Error fetching my jobs", error)
        throw error;
    }

    return data;
    
}

export async function deleteJob(token, { job_id }) {
    const supabase = await supabaseClient(token);

    const { data, error } = await supabase
    .from('jobs')
    .delete()
    .eq('id', job_id)
    .select()

    if(error) {
        console.log("Error deleting job", error)
        throw error;
    }

    return data;
}