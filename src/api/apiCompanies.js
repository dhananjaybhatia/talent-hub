import supabaseClient from "@/utils/supabase";

export async function getCompanies(token) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase.from("companies").select("*");

  if (error) {
    console.error("Error Fetching Companies: ", error);
    return null;
  }
  return data;
}

export async function getSingleJob(token, { job_id }) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .select("*, company:companies(name, logo_url),applications:applications(*)")
    .eq("id", job_id)
    .single();

  if (error) {
    console.error("Error Fetching a Job: ", error);
    return null;
  }
  return data;
}

export async function getUpdateHiringStatus(token, { job_id }, isOpen) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .update({ isOpen: isOpen })
    .eq("id", job_id)
    .select();

  if (error) {
    console.error("Error Updating Job: ", error);
    return null;
  }
  return data;
}
