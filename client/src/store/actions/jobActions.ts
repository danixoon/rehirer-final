import axios from "axios";
import store, { handleActionError } from "../store";

async function mapDataToJobs(jobs: any[]) {
  const token = sessionStorage.getItem("authToken");
  return await Promise.all(
    jobs.map(async (j: any) => {
      const res = await axios.get("/api/respond/job", { params: { jobId: j._id }, headers: { "x-auth-token": token } });
      const responds = await Promise.all(
        res.data.map(async (r: any) => {
          const author = await axios.get("/api/user/data", { params: { userId: r.authorId }, headers: { "x-auth-token": token } });
          return { ...r, author: author.data };
        })
      );
      return { ...j, responds: responds };
    })
  );
}

export const setJobSearch = (s: any) => {
  // if (search.page)
  const state = store.getState();
  if (!s) return { type: "JOB_FETCH_SEARCH_SET", payload: state.job.entities.search };
  const query = {
    ...s,
    search: s.search,
    tags: s.tags,
    minPrice: s.minPrice === "" ? undefined : s.minPrice,
    maxPrice: s.maxPrice === "" ? undefined : s.maxPrice,
    offset: s.page * s.maxOnPage,
    count: s.maxOnPage
  };
  return { type: "JOB_FETCH_SEARCH_SET", payload: query };
};

export const fetchUserJobs = () => async (dispatch: any, getState: any) => {
  dispatch({ type: "JOB_FETCH_LOADING" });
  const token = sessionStorage.getItem("authToken");
  try {
    const res = await axios.get("/api/job/user", { headers: { "x-auth-token": token } });
    if (res.data.items.length === 0) return dispatch({ type: "JOB_FETCH_SUCCESS", payload: { items: [], count: 0 } });
    const jobs = await axios.get("/api/job/byId", { params: { ids: res.data.items }, headers: { "x-auth-token": token } });
    dispatch({ type: "JOB_FETCH_SUCCESS", payload: jobs.data });
  } catch (err) {
    handleActionError(dispatch, "JOB_FETCH_ERROR", err);
  }
};

interface IAddJob {
  label: string;
  description: string;
  city?: string;
  timespan: number;
  secretInfo?: string;
  price: number;
  tags?: string[];
}

export const addUserJob = (jobData: IAddJob) => async (dispatch: any) => {
  dispatch({ type: "JOB_ADD_LOADING" });
  const token = sessionStorage.getItem("authToken");
  try {
    const res = await axios.get("/api/job/create", { params: { ...jobData }, headers: { "x-auth-token": token } });
    const job = await axios.get("/api/job/byId", { params: { ids: [res.data.jobId] }, headers: { "x-auth-token": token } });
    dispatch({ type: "JOB_ADD_SUCCESS", payload: job.data.items[0] });
  } catch (err) {
    handleActionError(dispatch, "JOB_ADD_ERROR", err);
  }
};

export const deleteUserJob = (jobId: string) => async (dispatch: any) => {
  dispatch({ type: "JOB_DELETE_LOADING" });
  const token = sessionStorage.getItem("authToken");
  try {
    const res = await axios.get("/api/job/delete", { params: { jobId }, headers: { "x-auth-token": token } });
    dispatch({ type: "JOB_DELETE_SUCCESS", payload: res.data });
  } catch (err) {
    handleActionError(dispatch, "JOB_DELETE_ERROR", err);
  }
};

export const fetchJobList = (query: any) => async (dispatch: any) => {
  dispatch({ type: "JOB_FETCH_LOADING" });
  const token = sessionStorage.getItem("authToken");
  try {
    const res = await axios.get("/api/job/find", {
      params: query,

      headers: { "x-auth-token": token }
    });
    dispatch({ type: "JOB_FETCH_SUCCESS", payload: res.data });
  } catch (err) {
    handleActionError(dispatch, "JOB_FETCH_ERROR", err);
  }
};

export const fetchRespondJobs = (jobIds: string[]) => async (dispatch: any, getState: any) => {
  dispatch({ type: "JOB_FETCH_LOADING" });
  const token = sessionStorage.getItem("authToken");
  try {
    const res = await axios.get("/api/job/find", { params: { ids: jobIds }, headers: { "x-auth-token": token } });
    dispatch({ type: "JOB_FETCH_SUCCESS", payload: res.data });
  } catch (err) {
    handleActionError(dispatch, "JOB_FETCH_ERROR", err);
  }
};
