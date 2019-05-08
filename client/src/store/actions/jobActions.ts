import axios from "axios";
import { handleActionError } from "../store";

async function mapDataToJobs(jobs: any[]) {
  const token = sessionStorage.getItem("authToken");
  return await Promise.all(
    jobs.map(async (j: any) => {
      const res = await axios.get("/api/user/jobResponds", { params: { jobId: j._id }, headers: { "x-auth-token": token } });
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

export const fetchUserJobs = () => async (dispatch: any, getState: any) => {
  dispatch({ type: "JOB_FETCH_LOADING" });
  const token = sessionStorage.getItem("authToken");
  try {
    const res = await axios.get("/api/user/jobs", { headers: { "x-auth-token": token } });
    if (res.data.length === 0) return dispatch({ type: "JOB_FETCH_SUCCESS", payload: [] });
    const jobs = await axios.get("/api/job/byId", { params: { ids: res.data }, headers: { "x-auth-token": token } });
    // const responds = await axios.get("/api/user/jobResponds", { params: { jobId: }, headers: { "x-auth-token": token } });
    // dispatch({ type: "JOB_FETCH_SUCCESS", payload: await mapDataToJobs(jobs.data) });
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
    const res = await axios.get("/api/job/new", { params: { ...jobData }, headers: { "x-auth-token": token } });
    const job = await axios.get("/api/job/byId", { params: { ids: [res.data.jobId] }, headers: { "x-auth-token": token } });
    // dispatch({ type: "JOB_ADD_LOADING", payload: (await mapDataToJobs(job.data))[0] });
    dispatch({ type: "JOB_ADD_SUCCESS", payload: job.data[0] });
    // dispatch()
    // dispatch(fetchJobList());
    // dispatch(fetchUserJobs());
  } catch (err) {
    handleActionError(dispatch, "JOB_ADD_ERROR", err);
  }
};

export const deleteUserJob = (jobId: string) => async (dispatch: any) => {
  dispatch({ type: "JOB_DELETE_LOADING" });
  const token = sessionStorage.getItem("authToken");
  try {
    const res = await axios.get("/api/user/deleteJob", { params: { jobId }, headers: { "x-auth-token": token } });
    dispatch({ type: "JOB_DELETE_SUCCESS", payload: res.data });
    // dispatch(fetchJobList());
    // dispatch(fetchUserJobs());
  } catch (err) {
    handleActionError(dispatch, "JOB_DELETE_ERROR", err);
  }
};

export const fetchJobList = () => async (dispatch: any) => {
  dispatch({ type: "JOB_FETCH_LOADING" });
  const token = sessionStorage.getItem("authToken");
  try {
    const res = await axios.get("/api/job/find", { headers: { "x-auth-token": token } });
    dispatch({ type: "JOB_FETCH_SUCCESS", payload: res.data });
  } catch (err) {
    handleActionError(dispatch, "JOB_FETCH_ERROR", err);
  }
};

export const fetchRespondJobs = (jobIds: string[]) => async (dispatch: any, getState: any) => {
  dispatch({ type: "JOB_FETCH_LOADING" });
  const token = sessionStorage.getItem("authToken");
  try {
    // const responds = await axios.get("/api/job/find", { headers: { "x-auth-token": token } });
    const res = await axios.get("/api/job/find", { params: { ids: jobIds }, headers: { "x-auth-token": token } });
    dispatch({ type: "JOB_FETCH_SUCCESS", payload: res.data });
  } catch (err) {
    handleActionError(dispatch, "JOB_FETCH_ERROR", err);
  }
};

// export const fetchUserJob = () => async (dispatch: any, getState: any) => {
//   const state = getState();
//   dispatch({ type: "USER_JOB_FETCH" });
//   axios
//     .get("/api/user/jobs", { headers: { "x-auth-token": state.account.data.token } })
//     .then((res: any) => {
//       if (res.data.length === 0) {
//         dispatch({ type: "USER_JOB_FETCH_SUCCESS", payload: [] });
//         throw "ok";
//       }
//       // return null;
//       return axios.get("/api/job/byId", { params: { ids: res.data }, headers: { "x-auth-token": state.account.data.token } });
//     })
//     .then((res: any) =>
//       Promise.all(
//         res.data.map(async (d: any) => ({
//           ...d,
//           respond: (await axios.get("/api/user/jobResponds", { params: { jobId: d._id }, headers: { "x-auth-token": state.account.data.token } })).data
//         }))
//       )
//     )
//     .then(
//       jobs =>
//         Promise.all(
//           jobs.map(async (j: any) => ({
//             ...j,
//             respond: await Promise.all(
//               j.respond.map(async (r: any) => ({
//                 ...r,
//                 author: (await axios.get("/api/user/data", { params: { userId: r.authorId }, headers: { "x-auth-token": state.account.data.token } })).data
//               }))
//             )
//           }))
//         ) //{ ...j.respond, author: (await }))
//     )
//     .then(jobs => dispatch({ type: "USER_JOB_FETCH_SUCCESS", payload: jobs }))
//     .catch(err => {
//       if (err === "ok") return;
//       console.log(err.response.data);
//       dispatch({ type: "USER_JOB_FETCH_ERROR", payload: err.response.data });
//     });
// };

// export const fetchUserProfile = () => async (dispatch: any, getState: any) => {
//   const state = getState();
//   dispatch({ type: "USER_PROFILE_FETCH" });
//   console.log("LAAAADAD");
//   axios
//     .get("/api/user/profile", { headers: { "x-auth-token": state.account.data.token } })
//     .then(response => {
//       dispatch({ type: "USER_PROFILE_FETCH_SUCCESS", payload: response.data });
//     })
//     .catch(err => {
//       console.log("FCCC");
//       dispatch({ type: "USER_PROFILE_FETCH_ERROR", payload: err.response.data });
//     });
// };

// export const fetchUserData = () => async (dispatch: any, getState: any) => {
//   const state = getState();
//   dispatch({ type: "USER_DATA_FETCH" });
//   axios
//     .get("/api/user/data", { headers: { "x-auth-token": state.account.data.token } })
//     .then(response => {
//       dispatch({ type: "USER_DATA_FETCH_SUCCESS", payload: response.data });
//     })
//     .catch(err => {
//       dispatch({ type: "USER_DATA_FETCH_ERROR", payload: err.response.data });
//     });
// };

// async function populateRespond(responds: any[]) {
//   return await Promise.all(
//     responds.map(async (d: any) => {
//       const response = await Promise.all([
//         axios.get("/api/user/data", { params: { userId: d.authorId }, headers: { "x-auth-token": sessionStorage.getItem("authToken") } }),
//         axios.get("/api/job/byId", { params: { ids: [d.jobId] }, headers: { "x-auth-token": sessionStorage.getItem("authToken") } })
//       ]);
//       return { ...d, author: response[0].data, job: response[1].data[0] };
//     })
//   );
// }

// export const fetchUserRespond = () => async (dispatch: any, getState: any) => {
//   const state = getState();
//   dispatch({ type: "USER_RESPOND_FETCH" });
//   try {
//     const { data } = await axios.get("/api/user/myResponds", { headers: { "x-auth-token": state.account.data.token } });
//     const result = await populateRespond(data);
//     dispatch({ type: "USER_RESPOND_FETCH_SUCCESS", payload: result });
//   } catch (err) {
//     dispatch({ type: "USER_RESPOND_FETCH_ERROR", payload: !err.response ? err : err.response.data });
//   }
// };

// export const changeRespondStatus = (respondId: string, status: "DECLINE" | "APPROVED") => async (dispatch: any, getState: any) => {
//   const state = getState();
//   dispatch({ type: "USER_RESPOND_STATUS" });
//   try {
//     const { data } = await axios.get("/api/job/changeRespondStatus", { params: { respondId, status }, headers: { "x-auth-token": state.account.data.token } });
//     dispatch({ type: "USER_RESPOND_STATUS_SUCCESS", payload: data });
//   } catch (err) {
//     dispatch({ type: "USER_RESPOND_STATUS_ERROR", payload: !err.response ? err : err.response.data });
//   }
// };

// export const deleteUserJob = (jobId: string) => async (dispatch: any, getState: any) => {
//   const state = getState();
//   dispatch({ type: "USER_JOB_DELETE" });
//   axios.get("/api/user/deleteJob", { params: { jobId }, headers: { "x-auth-token": state.account.data.token } }).then(res => {
//     dispatch({ type: "USER_JOB_DELETE_SUCCESS", payload: res.data });
//   });
//   // .catch(err => {

//   //   dispatch({ type: "USER_JOB_DELETE_ERROR", payload: err.response.data });
//   // });
// };

// // export const fetchUserDataById()
