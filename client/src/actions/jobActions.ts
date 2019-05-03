export const updateJobs = () => (dispatch: any) => {
  dispatch({ type: "JOB_UPDATE", payload: {} });
};

export const pushJob = (job: any) => ({ type: "JOB_PUSH", payload: [job] });
