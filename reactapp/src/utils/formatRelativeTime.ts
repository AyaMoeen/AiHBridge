import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const formatRelativeTime = (isoString: string) => {
  return dayjs(isoString).fromNow();
};
