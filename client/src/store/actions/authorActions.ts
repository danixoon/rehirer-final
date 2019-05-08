import axios from "axios";
import { handleActionError } from "../store";

export const authorsFetch = (jobIds: string[]) => async (dispatch: any, getState: any) => {
  dispatch({ type: "AUTHOR_FETCH_LOADING" });
  const token = sessionStorage.getItem("authToken");
  try {
    const authors = await Promise.all(
      jobIds.flatMap(async j => {
        const respondIds = await axios.get("/api/user/jobResponds", { params: { jobId: j }, headers: { "x-auth-token": token } });
        const result = await Promise.all(
          respondIds.data.flatMap(async (r: any) => {
            const user = await Promise.all([
              await axios.get("/api/user/data", { params: { userId: r.authorId }, headers: { "x-auth-token": token } }),
              await axios.get("/api/user/profile", { params: { userId: r.authorId }, headers: { "x-auth-token": token } })
            ]);
            return { data: user[0].data, profile: user[1].data, respondId: r._id };
          })
        );
        return result;
      })
    );
    let res = authors.flatMap(a => a);
    dispatch({ type: "AUTHOR_FETCH_SUCCESS", payload: res });
  } catch (err) {
    handleActionError(dispatch, "AUTHOR_FETCH_ERROR", err);
  }
};
