import { GeneralResponse } from "@/src/features/analiz/types";
import { AddSessionRequest } from "@/src/features/program/schemas/add_session.schema";
import { UpdateSessionRequest } from "@/src/features/program/schemas/update_session.schema";
import { Session } from "@/src/features/program/types";
import api from "../axios";

export type SessionsOfInterval = {
  date: Date;
  sessions: Session[];
};

class SessionService {
  async getSessions(start: string, end: string): Promise<SessionsOfInterval[]> {
    const res = await api.get<GeneralResponse<SessionsOfInterval[]>>(
      `sessions`,
      {
        params: {
          start,
          end,
        },
      },
    );

    if (!res.data?.success) throw new Error(res.data.message);

    console.log(res.data.payload);

    return res.data.payload;
  }

  async addSession(req: AddSessionRequest): Promise<Session> {
    const res = await api.post<GeneralResponse<Session>>(`sessions`, req);

    if (!res.data?.success) throw new Error(res.data.message);

    return res.data.payload;
  }

  async updateSession(req: UpdateSessionRequest): Promise<Session> {
    const res = await api.put<GeneralResponse<Session>>(`sessions`, req);

    if (!res.data?.success) throw new Error(res.data.message);

    return res.data.payload;
  }

  async deleteSession(id: string): Promise<void> {
    const res = await api.delete<GeneralResponse<void>>(`sessions/${id}`);

    if (!res.data?.success) throw new Error(res.data.message);
  }
}

export default new SessionService();
