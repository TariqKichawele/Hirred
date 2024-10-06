import supabaseClient, { supabaseUrl } from "../utils/supabase";

export async function applyToJob(token, _, jobData) {
    const supabase = await supabaseClient(token);

    const random = Math.floor(Math.random() * 90000);
    const fileName = `resume-${random}-${jobData.candidate_id}`;
    console.log(fileName);

    const { error: storageError } = await supabase.storage
        .from('resumes')
        .upload(fileName, jobData.resume);

    if(storageError) throw new Error("Error uploading resume");

    const resume = `${supabaseUrl}/storage/v1/object/public/resumes/${fileName}`;

    const { data, error } = await supabase
        .from('applications')
        .insert([
            {
                ...jobData,
                resume
            }
        ])
        .select()

    if(error) throw new Error("Error applying to job");

    return data;
}

export async function getApplications(token, { user_id }) {
    const supabase = await supabaseClient(token);

    const { data, error } = await supabase
        .from('applications')
        .select("*, job:jobs(title, company:companies(name))")
        .eq('candidate_id', user_id);

    if(error) throw new Error("Error fetching applications");

    return data;
}

export async function updateApplicationStatus(token, { job_id }, status) {
    const supabase = await supabaseClient(token);

    const { data, error } = await supabase
        .from('applications')
        .update({ status })
        .eq('job_id', job_id)
        .select()

    if(error) throw new Error("Error updating application status");

    return data;
}