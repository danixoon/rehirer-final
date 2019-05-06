import axios from "axios";
import { async } from "q";

export const fetchUserProfile = () => async (dispatch: any, getState: any) => {
  const state = getState();
  dispatch({ type: "USER_PROFILE_FETCH" });
  console.log("LAAAADAD");
  axios
    .get("/api/user/profile", { headers: { "x-auth-token": state.account.data.token } })
    .then(response => {
      dispatch({ type: "USER_PROFILE_FETCH_SUCCESS", payload: response.data });
    })
    .catch(err => {
      console.log("FCCC");
      dispatch({ type: "USER_PROFILE_FETCH_ERROR", payload: err.response.data });
    });
};

export const fetchUserData = () => async (dispatch: any, getState: any) => {
  const state = getState();
  dispatch({ type: "USER_DATA_FETCH" });
  axios
    .get("/api/user/data", { headers: { "x-auth-token": state.account.data.token } })
    .then(response => {
      dispatch({ type: "USER_DATA_FETCH_SUCCESS", payload: response.data });
    })
    .catch(err => {
      dispatch({ type: "USER_DATA_FETCH_ERROR", payload: err.response.data });
    });
};

async function populateRespond(responds: any[]) {
  return await Promise.all(
    responds.map(async (d: any) => {
      const response = await Promise.all([
        axios.get("/api/user/data", { params: { userId: d.authorId }, headers: { "x-auth-token": sessionStorage.getItem("authToken") } }),
        axios.get("/api/job/byId", { params: { ids: [d.jobId] }, headers: { "x-auth-token": sessionStorage.getItem("authToken") } })
      ]);
      return { ...d, author: response[0].data, job: response[1].data[0] };
    })
  );
}

export const fetchUserRespond = () => async (dispatch: any, getState: any) => {
  const state = getState();
  dispatch({ type: "USER_RESPOND_FETCH" });
  try {
    const { data } = await axios.get("/api/user/myResponds", { headers: { "x-auth-token": state.account.data.token } });
    const result = await populateRespond(data);
    dispatch({ type: "USER_RESPOND_FETCH_SUCCESS", payload: result });
  } catch (err) {
    dispatch({ type: "USER_RESPOND_FETCH_ERROR", payload: !err.response ? err : err.response.data });
  }
};

export const changeRespondStatus = (respondId: string, status: "DECLINE" | "APPROVED") => async (dispatch: any, getState: any) => {
  const state = getState();
  dispatch({ type: "USER_RESPOND_STATUS" });
  try {
    const { data } = await axios.get("/api/job/changeRespondStatus", { params: { respondId, status }, headers: { "x-auth-token": state.account.data.token } });
    dispatch({ type: "USER_RESPOND_STATUS_SUCCESS", payload: data });
  } catch (err) {
    dispatch({ type: "USER_RESPOND_STATUS_ERROR", payload: !err.response ? err : err.response.data });
  }
};

export const fetchUserJob = () => async (dispatch: any, getState: any) => {
  const state = getState();
  dispatch({ type: "USER_JOB_FETCH" });
  axios
    .get("/api/user/jobs", { headers: { "x-auth-token": state.account.data.token } })
    .then((res: any) => {
      if (res.data.length === 0) {
        dispatch({ type: "USER_JOB_FETCH_SUCCESS", payload: [] });
        throw "ok";
      }
      // return null;
      return axios.get("/api/job/byId", { params: { ids: res.data }, headers: { "x-auth-token": state.account.data.token } });
    })
    .then((res: any) =>
      Promise.all(
        res.data.map(async (d: any) => ({
          ...d,
          respond: (await axios.get("/api/user/jobResponds", { params: { jobId: d._id }, headers: { "x-auth-token": state.account.data.token } })).data
        }))
      )
    )
    .then(
      jobs =>
        Promise.all(
          jobs.map(async (j: any) => ({
            ...j,
            respond: await Promise.all(
              j.respond.map(async (r: any) => ({
                ...r,
                author: (await axios.get("/api/user/data", { params: { userId: r.authorId }, headers: { "x-auth-token": state.account.data.token } })).data
              }))
            )
          }))
        ) //{ ...j.respond, author: (await }))
    )
    .then(jobs => dispatch({ type: "USER_JOB_FETCH_SUCCESS", payload: jobs }))
    .catch(err => {
      if (err === "ok") return;
      console.log(err.response.data);
      dispatch({ type: "USER_JOB_FETCH_ERROR", payload: err.response.data });
    });
};

export const deleteUserJob = (jobId: string) => async (dispatch: any, getState: any) => {
  const state = getState();
  dispatch({ type: "USER_JOB_DELETE" });
  axios.get("/api/user/deleteJob", { params: { jobId }, headers: { "x-auth-token": state.account.data.token } }).then(res => {
    dispatch({ type: "USER_JOB_DELETE_SUCCESS", payload: res.data });
  });
  // .catch(err => {

  //   dispatch({ type: "USER_JOB_DELETE_ERROR", payload: err.response.data });
  // });
};

// export const fetchUserDataById()
